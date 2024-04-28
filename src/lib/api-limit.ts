import { getServerAuthSession } from "./authOptions";
import prisma from "./prisma";

export async function increaseApiUsage(incrementBy = 1) {
  const session = await getServerAuthSession();

  if (!session?.user) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      usedTokens: {
        increment: incrementBy,
      },
    },
  });
}

export async function isCurrUserAllowedToChat() {
  const session = await getServerAuthSession();

  if (!session?.user) return false;

  return session.user.totalTokens >= session.user.usedTokens;
}
