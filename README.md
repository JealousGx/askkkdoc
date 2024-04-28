# AskkkDoc

Empower your documents to speak volumes! Our project seamlessly processes a variety of file formats - from PDFs and Word documents to images - extracting insightful information to answer your queries. Unlock the potential of your files and discover the answers you seek with ease.

[Live site](https://jealous-askkkdoc.vercel.app)

## Overview

This is a monorepo project containing the backend as well as the frontend, to make it simple. The backend services are implemented through NextJS' API directory.

Docker setup has also been implemented to get a local database running for local use. Each user gets 3 tokens for free. This means that only 3 documents are allowed per user. Feature to increase this limit has not been implemented yet due to some reasons.

Note: The live site will soon be taken down.

## Technologies and Framework

- NextJS (React)
- TypeScript
- TailwindCSS
- Shadcn UI
- React Dropzone
- React Markdown
- Next Auth
- Prisma
- MySQL (PlanetScale)
- AWS SDK
- OpenAI API
- Pinecone
- Vercel's AI
- Langchain
- Unstructured
- MD5
- Stream
- Zod
- T3 OSS (ENV-NextJS)
- Docker (local database)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JealousGx/askkkdoc.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set the environment variables:
   Rename `.env.example` to `.env` and replace all the placeholders with the actual values.

4. Get local database setup:

   Open Docker and run the following command:

   ```bash
   npm run setup-db
   ```

## Usage

1. Create and push the schema to the database:

   ```bash
   npx prisma db push
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:3000`.

## Details

The backend services are implemented such that all the accepted file types (mentioned in `/src/components/FileUpload.tsx`) are processed and then uploaded. This project uses 3 types of databases:

- AWS S3 to store the files uploaded.
- Pinecone to upload the files in the vector form.
- MySQL to upload the user related information.

The uploaded files are processed by `Langchain` dependency, `UnstructuredLoader` package to be more specific. This package internally uses `Unstructured` API to process the files, converts them into vector forms. After conversion, they are uploaded on pinecone index.
