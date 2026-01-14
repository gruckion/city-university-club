import { useState } from "react";
import { authClient } from "../auth-client";

export const useGitHubAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("GitHub sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
};
