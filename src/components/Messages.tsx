import { Message } from "ai/react";
import React from "react";

import { Loader2 } from "lucide-react";

import { SingleMessage } from "./Message";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

export const Messages = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!messages) return null;

  return (
    <div className="flex flex-col h-full overflow-auto p-4">
      {messages.map((message) => (
        <SingleMessage
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
};
