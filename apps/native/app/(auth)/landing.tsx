import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LastUsedIndicator } from "@/components/LastUsedIndicator";
import { authClient } from "@/lib/auth-client";
import { useAppleAuth, useGitHubAuth, useGoogleAuth } from "@/lib/oauth";

// Local assets for instant loading
const HERO_IMAGE = require("@/assets/images/hero-background.jpg");
const CUC_LOGO = require("@/assets/images/city_uni_club_gold.png");

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn: signInWithGoogle, isLoading: isGoogleLoading } =
    useGoogleAuth();
  const { signIn: signInWithApple, isLoading: isAppleLoading } = useAppleAuth();
  const { signIn: signInWithGitHub, isLoading: isGitHubLoading } =
    useGitHubAuth();
  const isLoading = isGoogleLoading || isAppleLoading || isGitHubLoading;

  // Theme colors for Ionicons (which don't support className)
  const foreground = useThemeColor("foreground");
  const primaryForeground = "#fffef8";

  // Read last login method after mount to ensure SecureStore/cookies are available
  const [lastMethod, setLastMethod] = useState<string | null>(null);
  useEffect(() => {
    const method = authClient.getLastUsedLoginMethod();
    setLastMethod(method);
  }, []);

  return (
    <ImageBackground resizeMode="cover" source={HERO_IMAGE} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(6, 39, 58, 0.75)",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Close Button - dismisses auth modal and returns to tabs */}
        <Pressable
          onPress={() => router.dismiss()}
          style={{
            position: "absolute",
            top: insets.top + 16,
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <Ionicons color={primaryForeground} name="close" size={24} />
        </Pressable>

        {/* Header with Logo */}
        <View className="items-center pt-8">
          <View className="mb-4 h-24 w-24 justify-center overflow-hidden rounded-full bg-transparentitems-center">
            <Image
              resizeMode="contain"
              source={CUC_LOGO}
              style={{ width: 80, height: 80 }}
            />
          </View>
          <Text
            className="text-primary-foreground"
            style={{
              fontSize: 32,
              fontWeight: "300",
              fontFamily: "serif",
            }}
          >
            City University Club
          </Text>
          <Text
            className="text-accent"
            style={{
              fontSize: 16,
              marginTop: 8,
            }}
          >
            Your exclusive members club
          </Text>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Sign In Options */}
        <View className="gap-4 px-6 pb-8">
          <Text
            className="text-center text-primary-foreground"
            style={{
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            Sign in to continue
          </Text>

          {/* Social Login Buttons */}
          <View className="flex-row gap-3">
            {/* GitHub */}
            <View style={{ flex: 1, position: "relative" }}>
              <Pressable
                className="bg-surface"
                disabled={isLoading}
                onPress={signInWithGitHub}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isGitHubLoading ? (
                  <ActivityIndicator color={foreground} size="small" />
                ) : (
                  <>
                    <Ionicons color={foreground} name="logo-github" size={20} />
                    <Text
                      className="text-foreground"
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      GitHub
                    </Text>
                  </>
                )}
              </Pressable>
              {lastMethod === "github" && (
                <View style={{ position: "absolute", top: -10, right: -4 }}>
                  <LastUsedIndicator />
                </View>
              )}
            </View>

            {/* Google */}
            <View style={{ flex: 1, position: "relative" }}>
              <Pressable
                className="bg-surface"
                disabled={isLoading}
                onPress={signInWithGoogle}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator color={foreground} size="small" />
                ) : (
                  <>
                    <Ionicons color={foreground} name="logo-google" size={20} />
                    <Text
                      className="text-foreground"
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Google
                    </Text>
                  </>
                )}
              </Pressable>
              {lastMethod === "google" && (
                <View style={{ position: "absolute", top: -10, right: -4 }}>
                  <LastUsedIndicator />
                </View>
              )}
            </View>

            {/* Apple */}
            <View style={{ flex: 1, position: "relative" }}>
              <Pressable
                className="bg-surface"
                disabled={isLoading}
                onPress={signInWithApple}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isAppleLoading ? (
                  <ActivityIndicator color={foreground} size="small" />
                ) : (
                  <>
                    <Ionicons color={foreground} name="logo-apple" size={20} />
                    <Text
                      className="text-foreground"
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Apple
                    </Text>
                  </>
                )}
              </Pressable>
              {lastMethod === "apple" && (
                <View style={{ position: "absolute", top: -10, right: -4 }}>
                  <LastUsedIndicator />
                </View>
              )}
            </View>
          </View>

          {/* Email Button */}
          <View style={{ position: "relative" }}>
            <Link asChild href="/(auth)/email/signin">
              <Pressable
                className="border-accent bg-primary"
                style={{
                  paddingVertical: 16,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                }}
              >
                <Text
                  className="text-primary-foreground"
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Continue with Email
                </Text>
              </Pressable>
            </Link>
            {lastMethod === "email" && (
              <View
                style={{
                  position: "absolute",
                  top: -10,
                  right: -4,
                }}
              >
                <LastUsedIndicator />
              </View>
            )}
          </View>

          {/* Sign Up Link */}
          <View className="mt-2 flex-row items-center justify-center gap-1">
            <Text className="text-accent" style={{ fontSize: 14 }}>
              Don't have an account?
            </Text>
            <Link asChild href="/(auth)/email/signup">
              <Pressable>
                <Text
                  className="text-primary-foreground"
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    textDecorationLine: "underline",
                  }}
                >
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
