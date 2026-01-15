import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MembershipCard } from "@/components/MembershipCard";

// CUC brand colors from design.md
const CUC_COLORS = {
  navy: "#06273a",
  sage: "#85b09a", // rgb(133, 176, 154) greeting text color
  cream: "#fffef8",
  white: "#ffffff",
};

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
                <Text style={{ color: CUC_COLORS.sage, fontSize: 16 }}>
                  Welcome to
                </Text>
                <Text
                  style={{
                    color: CUC_COLORS.cream,
                    fontSize: 24,
                    fontWeight: "300",
                    fontFamily: "serif",
                  }}
                >
                  City University Club
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="flex-1 items-center justify-center px-6">
            <Text
              style={{
                color: CUC_COLORS.cream,
                fontSize: 32,
                fontWeight: "300",
                textAlign: "center",
                fontFamily: "serif",
                marginBottom: 16,
              }}
            >
              Your exclusive members club
            </Text>
            <Text
              style={{
                color: CUC_COLORS.sage,
                fontSize: 16,
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              A lunch club in the heart of the financial area of London
            </Text>
          </View>

          {/* Membership Card Button */}
          <View className="px-6 pb-6">
            <Pressable
              onPress={() => router.push("/(auth)/landing")}
              style={{
                backgroundColor: CUC_COLORS.navy,
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: CUC_COLORS.cream,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
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
            <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white">
              <Image
                resizeMode="contain"
                source={CUC_LOGO}
                style={{ width: 56, height: 56 }}
              />
            </View>
            {/* Greeting */}
            <View>
              <Text style={{ color: CUC_COLORS.sage, fontSize: 16 }}>
                {getGreeting()}
              </Text>
              <Text
                style={{
                  color: CUC_COLORS.cream,
                  fontSize: 28,
                  fontWeight: "300",
                  fontFamily: "serif",
                }}
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
