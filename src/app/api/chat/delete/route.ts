import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/authOptions";
import { deleteNamespace } from "@/lib/pinecone";
import prisma from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3-server";

// export const runtime = "edge";

export async function DELETE(req: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId: session.user.id },
    });
    if (!chat) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    const key = chat.fileKey;

    await deleteNamespace(key);
    await deleteFromS3(key);
    await prisma.chat.delete({ where: { id: chatId } });
    await prisma.messages.deleteMany({ where: { chatId } });

    const nextChat = await prisma.chat.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    return NextResponse.json(
      {
        message: "chat deleted successfully",
        nextChatId: nextChat?.id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error in chat delete route", error);
    return NextResponse.json(
      { error: "error in chat delete route" },
      { status: 500 }
    );
  }
}
