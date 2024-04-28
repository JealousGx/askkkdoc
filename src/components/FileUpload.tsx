"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { Inbox, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

import { useToast } from "@/components/ui/use-toast";
import { uploadToS3 } from "@/lib/s3";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export const maxDuration = 300;

interface FileUploadProps {
  text?: string;
  className?: string;
}

export const FileUpload = ({
  text = "Drop document Here",
  className,
}: FileUploadProps) => {
  const { data } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const createChat = async (data: { file_key: string; file_name: string }) => {
    return fetch("/api/create-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const data = await res.json();
      return data.chatId;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpeg", ".jpg", ".gif", ".svg", ".bmp"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.ms-excel": [".xls", ".xlsx", ".csv"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        return toast({
          title: "File too large",
          description: "Please upload a file smaller than 10mb",
          variant: "destructive",
        });
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          return toast({
            title: "Something went wrong",
            description: "Please try again",
            variant: "destructive",
          });
        }

        try {
          const chatId = await createChat(data);

          toast({
            title: "Chat created!",
            description: "You can now ask questions",
          });

          router.push(`/chat/${chatId}`);
        } catch (error) {
          console.log(error);
          toast({
            title: "Error creating chat",
            description: "Please try again",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log(`Error uploading file: ${error}`);
      } finally {
        setUploading(false);
      }
    },
  });

  if (data?.user?.usedTokens! >= data?.user?.totalTokens!) {
    return (
      <p>
        You have used all your tokens. Please wait for the subscription feature
        to be implemented.
      </p>
    );
  }

  return (
    <div className="p-2 rounded-xl w-full">
      <div
        {...getRootProps({
          className: cn(
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-20 flex justify-center items-center flex-col",
            className
          ),
        })}
      >
        <Input {...getInputProps()} />
        {uploading ? (
          <React.Fragment>
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="mt-2 text-sm text-gray-400">GPT is being fed...</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Inbox className="w-10 h-10" />
            <p className="mt-2 text-sm text-gray-400">{text}</p>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
