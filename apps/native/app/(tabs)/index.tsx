import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MembershipCard } from "@/components/MembershipCard";

// Local assets for instant loading
const HERO_IMAGE = require("@/assets/images/hero-background.jpg");
const CUC_LOGO = require("@/assets/images/city_uni_club_gold.png");

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning,";
  }
  if (hour < 17) {
    return "Good Afternoon,";
  }
  return "Good Evening,";
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

  // Defense-in-depth: Don't render anything while auth is loading
  // This should rarely trigger since AuthGate handles splash visibility,
  // but protects against edge cases
  if (isLoading) {
    return null;
  }

  // If not authenticated, show landing prompt
  if (!isAuthenticated) {
    return (
      <ImageBackground
        resizeMode="cover"
        source={HERO_IMAGE}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(6, 39, 58, 0.7)",
            paddingTop: insets.top,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center gap-3">
              <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-transparent">
                <Image
                  resizeMode="contain"
                  source={CUC_LOGO}
                  style={{ width: 56, height: 56 }}
                />
              </View>
              <View>
                <Text className="text-accent text-base">Welcome to</Text>
                <Text
                  className="font-light text-2xl text-primary-foreground"
                  style={{ fontFamily: "serif" }}
                >
                  City University Club
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="flex-1 items-center justify-center px-6">
            <Text
              className="mb-4 text-center font-light text-3xl text-primary-foreground"
              style={{ fontFamily: "serif" }}
            >
              Your exclusive members club
            </Text>
            <Text className="mb-8 text-center text-accent text-base">
              A lunch club in the heart of the financial area of London
            </Text>
          </View>

          {/* Membership Card Button */}
          <View className="px-6 pb-6">
            <Pressable
              className="items-center bg-primary"
              onPress={() => router.push("/(auth)/landing")}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <Text className="font-medium text-base text-primary-foreground">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Member";

  return (
    <ImageBackground resizeMode="cover" source={HERO_IMAGE} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(6, 39, 58, 0.6)",
          paddingTop: insets.top,
        }}
      >
        {/* Header with Logo and Greeting */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            {/* Logo */}
            <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface">
              <Image
                resizeMode="contain"
                source={CUC_LOGO}
                style={{ width: 56, height: 56 }}
              />
            </View>
            {/* Greeting */}
            <View>
              <Text className="text-accent text-base">{getGreeting()}</Text>
              <Text
                className="font-light text-3xl text-primary-foreground"
                style={{ fontFamily: "serif" }}
              >
                {firstName}
              </Text>
            </View>
          </View>
        </View>

        {/* Main content area with Membership Card */}
        <View className="flex-1 justify-center">
          <MembershipCard
            memberName={user?.name || "Member"}
            memberSince={
              user?._creationTime
                ? new Date(user._creationTime).toISOString()
                : undefined
            }
          />
        </View>
      </View>
    </ImageBackground>
  );
}
