"use client";

import React from "react";

import { Message } from "ai/react";
import { Clipboard } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";

import { BotAvatar, UserAvatar } from "./Avatar";
import { useToast } from "./ui/use-toast";

interface Props {
  message: Message;
}

export const SingleMessage = ({ message }: Props) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard",
    });
  };

  return (
    <div
      key={message.id}
      className={cn("flex gap-2 group", {
        "pl-10 flex-row-reverse mb-2": message.role === Role.user,
        "justify-start pr-10 mb-6": message.role === Role.system,
      })}
    >
      {message.role === Role.user ? <UserAvatar /> : <BotAvatar />}
      <div
        className={cn(
          "rounded-lg px-3 relative text-sm py-1 shadow-md ring-1 ring-gray-900/10",
          {
            "bg-black text-white": message.role === Role.user,
          }
        )}
      >
        {message.role === Role.system && (
          <Clipboard
            className="absolute hidden group-hover:block cursor-pointer h-6 w-6 right-2  p-1 rounded bg-gray-200 shadow-sm"
            onClick={() => copyToClipboard(message.content)}
          />
        )}
        <ReactMarkdown
          components={{
            pre: ({ node: _node, ...props }) => (
              <div className="my-2 w-full overflow-auto rounded-lg bg-black/10 p-2">
                <pre
                  {...props}
                  className="text-sm"
                />
              </div>
            ),
            code: ({ node: _node, ...props }) => (
              <code
                className="rounded-lg bg-black/10 p-1"
                {...props}
              />
            ),
          }}
          className="overflow-hidden text-sm"
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
