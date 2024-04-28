import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

import { Role } from "@prisma/client";

import { getContext } from "@/lib/context";
import openai from "@/lib/openai";
import prisma from "@/lib/prisma";

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
    });
    if (!_chat) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chat.fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will not provide any information that is not from the context.
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      AI assistant will not apologize for previous responses, but instead will indicate that new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      AI assistant will not provide any information that is confidential or proprietary such as social security numbers, credit card numbers, or any other sensitive information. If you are asked to provide this information, simply say say only few letters of the information and hide other letters with '*'
      `,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });
    const stream = OpenAIStream(response, {
      onStart: async () => {
        // save user message into db
        await prisma.messages.upsert({
          where: {
            id: chatId,
          },
          update: {
            content: lastMessage.content,
            role: Role.user,
          },
          create: {
            content: lastMessage.content,
            role: Role.user,
            chatId: chatId,
          },
        });
      },
      onCompletion: async (completion) => {
        // save ai message into db
        await prisma.messages.upsert({
          where: {
            id: chatId,
          },
          update: {
            content: completion,
            role: Role.system,
          },
          create: {
            content: completion,
            role: Role.system,
            chatId: chatId,
          },
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("error in chat route", error);
    return NextResponse.json({ error: "error in chat route" }, { status: 500 });
  }
}
