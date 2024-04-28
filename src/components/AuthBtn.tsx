"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export const AuthBtn = () => {
  const { data } = useSession();

  let authBtnText = "Get Started";
  let authBtnAction = () => signIn();

  if (data?.user) {
    authBtnText = "Logout";
    authBtnAction = () => signOut();
  }

  return <Button onClick={() => authBtnAction()}>{authBtnText}</Button>;
};
