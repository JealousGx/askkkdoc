"use client";
import { Message } from "ai";
import { useChat } from "ai/react";
import React, { useEffect, useState } from "react";

import { Send } from "lucide-react";

import { Messages } from "./Messages";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = { chatId: string };

export const Chat = ({ chatId }: Props) => {
  const [data, setData] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatId }),
        });

        if (!response.ok) {
          throw new Error("error in chat component");
        }

        const data = await response.json();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("error in chat component", error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const { input, setInput, handleInputChange, handleSubmit, messages } =
    useChat({
      api: "/api/chat",
      body: {
        chatId,
      },
      initialMessages: data || [],
    });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const onSuggestionClick = (suggestion: string) => setInput(suggestion);

  return (
    <div
      className="relative max-h-screen flex-col flex items-center justify-between h-full overflow-scroll"
      id="message-container"
    >
      {/* header */}
      <div className="sticky w-full p-4 border-b top-0 inset-x-0 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <Messages
        messages={messages}
        isLoading={isLoading}
      />

      <form
        onSubmit={handleSubmit}
        className="sticky w-full bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        {!data.length && !isLoading && (
          <DisplaySuggestions onSuggestionClick={onSuggestionClick} />
        )}
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

function DisplaySuggestions({
  onSuggestionClick,
}: {
  onSuggestionClick: (suggestion: string) => void;
}) {
  const suggestions = [
    "Summarize the document",
    "List the key takeaways",
    "Write the main point",
    "Write the author's opinion",
  ];

  return (
    <div className="flex flex-wrap gap-2 pb-4">
      {suggestions.map((suggestion) => (
        <Button
          onClick={() => onSuggestionClick(suggestion)}
          key={suggestion}
          variant="ghost"
          className="text-xs p-2"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
