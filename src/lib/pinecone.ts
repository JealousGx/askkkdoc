import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import md5 from "md5";

import { env } from "./config";
import { getEmbeddings } from "./embeddings";
import { downloadFromS3 } from "./s3-server";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: env.PINECONE_API_KEY,
  });
};

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

export async function deleteNamespace(fileKey: string) {
  const client = getPineconeClient();
  const pineconeIndex = client.index(env.PINECONE_INDEX_NAME);

  await pineconeIndex
    .namespace(convertToAscii(fileKey))
    .deleteAll()
    .then(() => console.log("deleted namespace: ", fileKey))
    .catch((e) => console.log("error deleting namespace ", fileKey, " , ", e));
}

export async function loadS3FileInPinecone(fileKey: string) {
  const file = await downloadFromS3(fileKey);

  if (!file) {
    throw new Error("File not found");
  }

  const loader = new UnstructuredLoader(file, {
    apiKey: env.UNSTRUCTURED_API_KEY,
  });
  const pages = await loader.load();

  // 2. split and segment the pdf
  const docs = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(docs.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = getPineconeClient();

  const pineconeIndex = client.index(env.PINECONE_INDEX_NAME);
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  await namespace.upsert(vectors);

  return docs[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

async function prepareDocument(page: { pageContent: string; metadata: any }) {
  const pageContent = page.pageContent.replace(/\n/g, "");
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: page.metadata.page_number,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
