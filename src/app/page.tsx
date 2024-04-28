import React from "react";

import { AuthBtn } from "@/components/AuthBtn";
import { FileUpload } from "@/components/FileUpload";
import { Link } from "@/components/ui/link";

import ClientOnly from "@/components/ClientOnly";
import { getServerAuthSession } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export default async function Home() {
  const session = await getServerAuthSession();

  const chat = await prisma.chat.findFirst({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
    },
  });

  return (
    <ClientOnly>
      <main className="max-w-3xl mx-auto h-screen">
        <nav className="w-full py-4 flex justify-between items-center">
          <h1 className="text-2xl italic font-extrabold">AskkkDoc</h1>
          <AuthBtn />
        </nav>

        <section className="pt-24 pb-10 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold">Welcome to AskkkDoc</h2>
          <p className="mt-4 text-lg text-center max-w-lg">
            AskkkDoc is a platform where you can ask questions and get answers
            from the document you upload.
          </p>
        </section>

        <div className="w-full flex flex-col items-center justify-center">
          {session ? (
            <React.Fragment>
              <FileUpload />

              {chat && (
                <Link
                  className="mt-4"
                  href={`/chat/${chat.id}`}
                >
                  Goto your chats
                </Link>
              )}
            </React.Fragment>
          ) : (
            <AuthBtn />
          )}
        </div>
      </main>
    </ClientOnly>
  );
}
