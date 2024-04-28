"use client";

import { EmptyState } from "@/components/EmptyState";
import { useEffect } from "react";

interface ErrorState {
  error: Error;
}

const ErrorState: React.FC<ErrorState> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      title="Uh Oh"
      subtitle="Something went wrong!"
    />
  );
};

export default ErrorState;
