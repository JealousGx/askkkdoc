import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import { isCurrUserAllowedToChat } from "@/lib/api-limit";
import { getServerAuthSession } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

import { Chat } from "@/components/Chat";
import ClientOnly from "@/components/ClientOnly";
import { DocViewer } from "@/components/DocViewer";
import { Sidebar } from "@/components/Sidebar";

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const chatId = params.chatId;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });

  return {
    title: chat ? `${chat?.name} - AskkkDoc` : "AskkkDoc",
  };
}

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await getServerAuthSession();

  if (!session?.user) return redirect("/");

  const _chats = await getUserChats(session.user.id);

  if (!_chats || !_chats.find((chat) => chat.id === chatId))
    return redirect("/");

  const currentChat = _chats.find((chat) => chat.id === chatId);
  const isAllowedToOpenChat = await isCurrUserAllowedToChat();

  const usedTokens = session.user.usedTokens;
  const totalTokens = session.user.totalTokens;

  return (
    <ClientOnly>
      <div className="flex w-full max-h-screen overflow-scroll">
        <Sidebar
          chats={_chats}
          chatId={chatId}
          isAllowedToOpenChat={isAllowedToOpenChat}
          totalTokens={totalTokens}
          usedTokens={usedTokens}
        />

        {/* doc viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[4]">
          <DocViewer
            url={currentChat?.url || ""}
            name={currentChat?.name || ""}
          />
        </div>

        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <Chat chatId={chatId} />
        </div>
      </div>
    </ClientOnly>
  );
};

async function getUserChats(userId: string) {
  const _chats = await prisma.chat.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return _chats;
}

export default ChatPage;
