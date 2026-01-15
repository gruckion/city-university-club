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
      // OAuth redirect initiated - browser will open
      // Navigation handled by (auth)/_layout.tsx when auth completes via deep link
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
