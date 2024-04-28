import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    NEXTAUTH_SECRET: z.string().trim().min(1),
    DATABASE_URL: z.string().trim().min(1),

    GITHUB_CLIENT_ID: z.string().trim().min(1),
    GITHUB_CLIENT_SECRET: z.string().trim().min(1),

    S3_BUCKET_NAME: z.string().trim().min(1),
    AWS_ACCESS_KEY: z.string().trim().min(1),
    AWS_SECRET_KEY: z.string().trim().min(1),

    OPEN_AI_KEY: z.string().trim().min(1),
    PINECONE_API_KEY: z.string().trim().min(1),
    PINECONE_INDEX_NAME: z.string().trim().min(1),
    UNSTRUCTURED_API_KEY: z.string().trim().min(1),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,

    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,

    UNSTRUCTURED_API_KEY: process.env.UNSTRUCTURED_API_KEY,
  },
});
