import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MembershipCard } from "@/components/MembershipCard";

export default function MembershipScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

  // Theme colors for icons
  const foreground = useThemeColor("foreground");
  const accent = useThemeColor("accent");
  const primaryForeground = "#fffef8";

  const handleSignIn = () => {
    router.push("/(auth)/landing");
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons color={primaryForeground} name="arrow-back" size={24} />
          </Pressable>
          <Text
            className="text-primary-foreground"
            style={{
              fontSize: 24,
              fontWeight: "300",
              fontFamily: "serif",
            }}
          >
            Membership Card
          </Text>
        </View>
      </View>

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        {isAuthenticated ? (
          // Logged in - show membership card
          <View style={{ alignItems: "center", width: "100%" }}>
            {/* Membership Card */}
            <MembershipCard
              memberName={user?.name || "Member"}
              memberSince={
                user?._creationTime
                  ? new Date(user._creationTime).toISOString()
                  : undefined
              }
            />

            {/* Card info */}
            <View
              className="bg-surface"
              style={{
                marginTop: 32,
                borderRadius: 12,
                padding: 16,
                width: "100%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: `${accent}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    color={accent}
                    name="information-circle"
                    size={24}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    className="text-foreground"
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      marginBottom: 2,
                    }}
                  >
                    Show at entry
                  </Text>
                  <Text className="text-muted" style={{ fontSize: 13 }}>
                    Present this card when visiting the club or reciprocal clubs
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Not logged in state
          <View style={{ alignItems: "center", paddingHorizontal: 16 }}>
            <View
              className="bg-primary/10"
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons color={foreground} name="card" size={48} />
            </View>

            <Text
              className="text-foreground"
              style={{
                fontSize: 24,
                fontWeight: "300",
                fontFamily: "serif",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Members Only
            </Text>

            <Text
              className="text-muted"
              style={{
                fontSize: 16,
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              Sign in to access your digital membership card. Show it when
              visiting the club or any of our 450+ reciprocal clubs worldwide.
            </Text>

            <Pressable
              className="bg-primary"
              onPress={handleSignIn}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 48,
                borderRadius: 8,
              }}
            >
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Bottom padding for safe area */}
      <View style={{ height: insets.bottom + 16 }} />
    </View>
  );
}
