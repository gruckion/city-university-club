import { useState } from "react";
import { authClient } from "../auth-client";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      // OAuth redirect initiated - browser will open
      // Navigation handled by (auth)/_layout.tsx when auth completes via deep link
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
};
