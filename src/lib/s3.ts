import { S3Client } from "@aws-sdk/client-s3";

import { env } from "./config";

export const getS3Client = () => {
  return new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    },
  });
};

export async function uploadToS3(file: File) {
  const file_name = file.name;
  const file_type = file.type;

  const { url, key } = await fetch("/api/upload-media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_name, file_type }),
  }).then(async (res) => {
    const data = await res.json();
    return {
      url: data.signedUrl,
      key: data.Key,
    };
  });

  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file_type,
    },
    body: file,
  });

  return {
    file_key: key,
    file_name,
  };
}

export function getS3Url(file_key: string) {
  return `https://${env.S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${file_key}`;
}
