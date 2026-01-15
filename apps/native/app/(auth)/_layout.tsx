import { useConvexAuth } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useNavigationOptions } from "@/hooks/useNavigationOptions";

export default function AuthLayout() {
  const { root } = useNavigationOptions();
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  // Single source of truth: Navigate to tabs when user becomes authenticated
  // This handles all auth methods: email signin/signup, and social OAuth
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);

  return (
    <Stack>
      <Stack.Screen
        name="landing"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="email"
        options={{
          headerShown: false,
          presentation: "modal",
          ...root,
        }}
      />
    </Stack>
  );
}
