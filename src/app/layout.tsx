import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import SessionProvider from "@/components/SessionProvider";
import { getServerAuthSession } from "@/lib/authOptions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AskkkDoc",
  description:
    "Empower your documents to speak volumes! Our project seamlessly processes a variety of file formats - from PDFs and Word documents to images - extracting insightful information to answer your queries. Unlock the potential of your files and discover the answers you seek with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
