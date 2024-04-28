import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  AuthOptions,
  DefaultSession,
  DefaultUser,
  getServerSession,
} from "next-auth";
import { Adapter } from "next-auth/adapters";

import GithubProvider from "next-auth/providers/github";

import { env } from "@/lib/config";
import prisma from "./prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      totalTokens: number;
      usedTokens: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    totalTokens: number;
    usedTokens: number;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          totalTokens: user.totalTokens,
          usedTokens: user.usedTokens,
        },
      };
    },
  },
  session: { strategy: "database" },
};

export const getServerAuthSession = () => getServerSession(authOptions);
