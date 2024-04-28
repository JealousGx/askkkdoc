"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { Chat } from "@prisma/client";
import { MessageCircle, Trash2 } from "lucide-react";

import { useSidebar } from "@/hooks/sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FileUpload } from "./FileUpload";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

type Props = {
  chats: Chat[];
  chatId?: string;
  isAllowedToOpenChat: boolean;
  totalTokens: number;
  usedTokens: number;
};

export const Sidebar = ({
  chats,
  chatId,
  isAllowedToOpenChat,
  totalTokens,
  usedTokens,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const sidebarContext = useSidebar();

  const deleteChat = async (chatId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this chat? You will lose everything in this chat. This action cannot be undone."
    );

    if (!confirm) return;

    try {
      const res = await fetch("/api/chat/delete", {
        method: "DELETE",
        body: JSON.stringify({ chatId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete chat");
      }

      const data = await res.json();
      const nextChatId = data.nextChatId;

      if (nextChatId) {
        router.push(`/chat/${nextChatId}`);
      } else {
        router.push("/");
      }

      toast({
        description: "Chat deleted successfully",
      });
    } catch (error) {
      toast({
        description: "Failed to delete chat",
        variant: "destructive",
      });
      console.error("Failed to delete chat: ", error);
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col transition-all justify-between overflow-scroll max-w-xs p-4 text-gray-200 bg-black",
        {
          "-translate-x-full w-0": !sidebarContext.isOpen,
          "translate-x-0": sidebarContext.isOpen,
        }
      )}
    >
      <div className="w-full flex items-center justify-between">
        <Link
          className="text-lg italic font-bold text-center"
          href="/"
        >
          AskkkDoc
        </Link>

        <button
          className="text-sm text-gray-300 hover:text-white transition-colors"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>

      <div className="flex flex-grow overflow-scroll flex-col gap-2 mt-6">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
          >
            <div
              className={cn(
                "rounded-lg p-3 group text-slate-300 flex items-center border border-dotted hover:bg-gray-500 transition",
                {
                  "bg-gray-600 text-white hover:bg-gray-700":
                    chatId && chat.id === chatId,
                  "hover:text-white": chatId && chat.id !== chatId,
                }
              )}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.name}
              </p>

              <Button
                size="sm"
                variant="ghost"
                className="p-2 h-6 group-hover:flex"
                onClick={() => deleteChat(chat.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Link>
        ))}
      </div>

      {isAllowedToOpenChat && (
        <FileUpload
          text="+ Start a new chat"
          className="py-8 bg-gray-800"
        />
      )}

      <p className="mt-4 w-full bg-gray-900 p-2 rounded-lg">
        You have {totalTokens - usedTokens} tokens left.
      </p>
    </div>
  );
};
