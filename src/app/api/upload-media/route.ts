import { isCurrUserAllowedToChat } from "@/lib/api-limit";
import { getServerAuthSession } from "@/lib/authOptions";
import { env } from "@/lib/config";
import { getS3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(req: Request, _res: Response) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (!(await isCurrUserAllowedToChat())) {
    return NextResponse.json(
      {
        error: "No tokens left",
      },
      {
        status: 403,
      }
    );
  }

  const s3 = getS3Client();

  const { file_name, file_type } = await req.json();

  const fileExt = file_name.split(".").pop();

  const fileName =
    file_name.length > 20
      ? file_name.slice(0, 20) + "." + fileExt // truncate the file name if it's too long, and append the file extension
      : file_name;

  const Key = "uploads/" + Date.now().toString() + fileName.replace(" ", "-");

  const s3Params = {
    Bucket: env.S3_BUCKET_NAME,
    Key,
    ContentType: file_type,
  };

  const command = new PutObjectCommand(s3Params);

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });

  return NextResponse.json(
    {
      signedUrl,
      Key,
    },
    {
      status: 200,
    }
  );
}

// export const getS3SignedUrl = async (file_key: string) => {
//   const s3 = getS3Client();

//   const fileName =
//     file.name.length > 20
//       ? file.name.slice(0, 20) + "." + file.name.split(".").pop() // truncate the file name if it's too long, and append the file extension
//       : file.name;

//   const file_key =
//     "uploads/" + Date.now().toString() + fileName.replace(" ", "-");

//   let command = new PutObjectCommand({ Bucket: bucket, Key: path });
// };
