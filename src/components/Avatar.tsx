import { useSession } from "next-auth/react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = () => {
  const { data } = useSession();

  const user = data?.user;

  if (!user) return <></>;

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-gray-600 text-white">
        {user?.name?.charAt(0).toLocaleUpperCase()}
        {user?.name?.charAt(1).toLocaleUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="text-sm">Ask</AvatarFallback>
    </Avatar>
  );
};

export { BotAvatar, UserAvatar };
