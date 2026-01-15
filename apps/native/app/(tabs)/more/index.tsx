import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";
import { authClient } from "@/lib/auth-client";

// Local asset for logo
const CUC_LOGO = require("@/assets/images/city_uni_club_white.png");

// Type-safe menu routing
const MENU_ROUTES = {
  membership: "/(tabs)/more/membership",
  "dining-room": "/(tabs)/more/dining-room",
  "reciprocal-clubs": "/(tabs)/more/reciprocal-clubs",
  "fabric-fund": "/(tabs)/more/fabric-fund",
  contact: "/(tabs)/more/contact",
  about: "/(tabs)/more/about",
  newsletter: "/(tabs)/more/bugle",
} as const satisfies Record<string, `/(tabs)/more/${string}`>;

type MenuId = keyof typeof MENU_ROUTES;

const MENU_ITEMS: Array<{
  id: MenuId;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}> = [
  {
    id: "membership",
    icon: "card-outline",
    title: "Membership Card",
    subtitle: "View your membership details",
  },
  {
    id: "dining-room",
    icon: "restaurant-outline",
    title: "Dining Room",
    subtitle: "Information about our facilities",
  },
  {
    id: "reciprocal-clubs",
    icon: "globe-outline",
    title: "Reciprocal Clubs",
    subtitle: "450+ partner clubs worldwide",
  },
  {
    id: "fabric-fund",
    icon: "heart-outline",
    title: "Fabric Fund",
    subtitle: "Support club renovations",
  },
  {
    id: "newsletter",
    icon: "newspaper-outline",
    title: "The Bugle",
    subtitle: "Read our newsletter",
  },
  {
    id: "about",
    icon: "information-circle-outline",
    title: "About the Club",
    subtitle: "Our history since 1895",
  },
  {
    id: "contact",
    icon: "call-outline",
    title: "Contact",
    subtitle: "Get in touch",
  },
];

export default function More() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

  // Theme colors for icons (with fallbacks)
  const foreground = useThemeColor("foreground") || "#06273a";
  const border = useThemeColor("border") || "#e5e5e5";

  const handleMenuPress = (id: MenuId) => {
    const route = MENU_ROUTES[id];
    router.push(route);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary"
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          {/* Logo */}
          <View
            className="bg-accent"
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              resizeMode="contain"
              source={CUC_LOGO}
              style={{ width: 52, height: 52 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              className="text-primary-foreground"
              style={{
                fontSize: 22,
                fontWeight: "300",
                fontFamily: "serif",
              }}
            >
              City University Club
            </Text>
            {isAuthenticated && user?.name && (
              <Text
                className="text-accent"
                style={{
                  fontSize: 14,
                  marginTop: 2,
                }}
              >
                {user.name}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        style={{ flex: 1 }}
      >
        {/* Quick Contact */}
        <View
          className="bg-surface"
          style={{
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              className="text-foreground"
              style={{
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              42 Crutched Friars
            </Text>
            <Text className="text-muted" style={{ fontSize: 14, marginTop: 2 }}>
              London EC3N 2AP
            </Text>
            <Text
              className="text-accent"
              style={{ fontSize: 14, marginTop: 4 }}
            >
              020 7167 6682
            </Text>
          </View>
          <Pressable
            className="bg-accent"
            onPress={() => Linking.openURL("tel:02071676682")}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons color={foreground} name="call" size={22} />
          </Pressable>
        </View>

        {/* Menu Items */}
        {MENU_ITEMS.map((item) => (
          <Pressable
            className="bg-surface"
            key={item.id}
            onPress={() => handleMenuPress(item.id)}
            style={{
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <View
              className="bg-primary/10"
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons color={foreground} name={item.icon} size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                className="text-foreground"
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {item.title}
              </Text>
              <Text
                className="text-muted"
                style={{ fontSize: 13, marginTop: 2 }}
              >
                {item.subtitle}
              </Text>
            </View>
            <Ionicons color={border} name="chevron-forward" size={20} />
          </Pressable>
        ))}

        {/* Opening Hours */}
        <View
          className="bg-primary"
          style={{
            borderRadius: 12,
            padding: 20,
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          <Text
            className="text-primary-foreground"
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 12,
            }}
          >
            Opening Hours
          </Text>
          <Text
            className="text-primary-foreground"
            style={{ fontSize: 14, lineHeight: 22 }}
          >
            Monday to Friday{"\n"}
            9:00 AM - 5:00 PM
          </Text>
          <Text className="text-accent" style={{ fontSize: 13, marginTop: 8 }}>
            Lunch: 12:00 PM - Last orders 2:30 PM
          </Text>
        </View>

        {/* Sign Out Button */}
        {isAuthenticated && (
          <Pressable
            className="border-border bg-surface"
            onPress={() => authClient.signOut()}
            style={{
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "#dc2626", fontSize: 15, fontWeight: "500" }}>
              Sign Out
            </Text>
          </Pressable>
        )}

        {/* Website Link */}
        <View style={{ marginTop: 16 }}>
          <ExternalLinkButton
            label="Visit Our Website"
            url="https://www.cityuniversityclub.co.uk/"
            variant="subtle"
          />
        </View>
      </ScrollView>
    </View>
  );
}
