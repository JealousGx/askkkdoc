import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { chatId } = await req.json();

  const messages = await prisma.messages.findMany({
    where: {
      chatId,
    },
  });

  if (!messages) {
    return NextResponse.json({ error: "messages not found" }, { status: 404 });
  }

  return NextResponse.json(messages);
};
