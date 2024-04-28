import { NextResponse } from "next/server";

import { increaseApiUsage, isCurrUserAllowedToChat } from "@/lib/api-limit";
import { getServerAuthSession } from "@/lib/authOptions";
import { loadS3FileInPinecone } from "@/lib/pinecone";
import prisma from "@/lib/prisma";
import { getS3Url } from "@/lib/s3";

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

  const { file_key, file_name } = await req.json();

  await loadS3FileInPinecone(file_key);

  const chat = await prisma.chat.create({
    data: {
      fileKey: file_key,
      name: file_name,
      url: getS3Url(file_key),
      userId: session.user.id,
    },
  });

  await increaseApiUsage();

  return NextResponse.json(
    {
      chatId: chat.id,
    },
    {
      status: 200,
    }
  );
}
