import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

import { env } from "./config";
import { getS3Client } from "./s3";

export async function deleteFromS3(file_key: string) {
  const s3 = getS3Client();
  const params = {
    Bucket: env.S3_BUCKET_NAME,
    Key: file_key,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error(`Error deleting file from S3: ${error}`);
    return null;
  }
}

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = getS3Client();
      const params = {
        Bucket: env.S3_BUCKET_NAME,
        Key: file_key,
      };

      const fileExt = file_key.split(".").pop();

      const obj = await s3.send(new GetObjectCommand(params));
      const file_name = `/tmp/askkkdoc${Date.now().toString()}.${fileExt}`;

      if (obj.Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(file_name);
        file.on("open", function (_fd) {
          // @ts-ignore
          obj.Body?.pipe(file).on("finish", () => {
            return resolve(file_name);
          });
        });
      }
    } catch (error) {
      console.error(`Error downloading file from S3: ${error}`);
      reject(error);
      return null;
    }
  });
}
