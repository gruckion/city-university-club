import { Ionicons } from "@expo/vector-icons";
import { useConvexAuth } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";

// CUC brand colors
const CUC_COLORS = {
  navy: "#06273a",
  sage: "#85b09a",
  cream: "#fffef8",
  white: "#ffffff",
};

// Globe image from CUC website (larger size for better display)
const GLOBE_IMAGE_URL =
  "https://static.wixstatic.com/media/5e0aaa_e35eca3738ef43d99b99e1e26df0bf16~mv2.png/v1/fill/w_640,h_536,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5e0aaa_e35eca3738ef43d99b99e1e26df0bf16~mv2.png";

// Sample featured reciprocal clubs (for visual appeal)
const FEATURED_CLUBS = [
  {
    name: "The Arts Club",
    location: "London, UK",
    icon: "color-palette-outline" as const,
  },
  {
    name: "University Club",
    location: "New York, USA",
    icon: "school-outline" as const,
  },
  {
    name: "Australian Club",
    location: "Sydney, Australia",
    icon: "leaf-outline" as const,
  },
  {
    name: "Hong Kong Club",
    location: "Hong Kong",
    icon: "business-outline" as const,
  },
];

// Club facilities available at reciprocal clubs
const FACILITIES = [
  { icon: "bed-outline" as const, label: "Accommodation" },
  { icon: "fitness-outline" as const, label: "Gym" },
  { icon: "water-outline" as const, label: "Swimming Pool" },
  { icon: "golf-outline" as const, label: "Golf Course" },
  { icon: "tennisball-outline" as const, label: "Tennis Courts" },
  { icon: "restaurant-outline" as const, label: "Dining" },
];

export default function ReciprocalClubs() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useConvexAuth();

  const handleSignIn = () => {
    router.push("/(auth)/landing");
  };

  return (
    <View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: CUC_COLORS.navy,
          paddingTop: insets.top + 8,
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${CUC_COLORS.white}15`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons color={CUC_COLORS.cream} name="arrow-back" size={22} />
          </Pressable>
          <Text
            style={{
              color: CUC_COLORS.cream,
              fontSize: 20,
              fontWeight: "300",
              fontFamily: "serif",
              flex: 1,
            }}
          >
            Reciprocal Clubs
          </Text>
          <Ionicons color={CUC_COLORS.sage} name="globe-outline" size={24} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        style={{ flex: 1 }}
      >
        {/* Hero Image */}
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{ uri: GLOBE_IMAGE_URL }}
          style={{ width: "100%", height: 220 }}
        />

        {/* Content Section */}
        <View style={{ padding: 16 }}>
          {/* Stats Card */}
          <View
            style={{
              backgroundColor: CUC_COLORS.white,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: CUC_COLORS.navy,
                fontSize: 28,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              450+
            </Text>
            <Text
              style={{
                color: CUC_COLORS.sage,
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Reciprocal Clubs Worldwide
            </Text>
            <Text
              style={{
                color: "#666",
                fontSize: 15,
                lineHeight: 22,
                textAlign: "center",
              }}
            >
              The City University Club has a unique list of over 450 reciprocal
              clubs throughout the world where members will be welcomed.
            </Text>
          </View>

          {/* About Section */}
          <View
            style={{
              backgroundColor: CUC_COLORS.white,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: CUC_COLORS.navy,
                fontSize: 17,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              World-Class Clubs
            </Text>
            <Text
              style={{
                color: "#555",
                fontSize: 15,
                lineHeight: 24,
              }}
            >
              Many of our reciprocal clubs are renowned as being amongst the
              very finest private members' clubs in the world. As a City
              University Club member, you have access to an exclusive global
              network.
            </Text>
          </View>

          {/* Available Facilities */}
          <View
            style={{
              backgroundColor: CUC_COLORS.white,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: CUC_COLORS.navy,
                fontSize: 17,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              Available Facilities
            </Text>
            <Text
              style={{
                color: "#555",
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 16,
              }}
            >
              Many reciprocal clubs offer accommodation and a number possess
              excellent facilities including:
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {FACILITIES.map((facility) => (
                <View
                  key={facility.label}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: `${CUC_COLORS.navy}08`,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    gap: 6,
                  }}
                >
                  <Ionicons
                    color={CUC_COLORS.navy}
                    name={facility.icon}
                    size={16}
                  />
                  <Text
                    style={{
                      color: CUC_COLORS.navy,
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    {facility.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Authentication-based content */}
          {isAuthenticated ? (
            // Authenticated: Show full access coming soon
            <View
              style={{
                backgroundColor: CUC_COLORS.sage,
                borderRadius: 12,
                padding: 24,
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <Ionicons
                color={CUC_COLORS.navy}
                name="checkmark-circle"
                size={48}
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{
                  color: CUC_COLORS.navy,
                  fontSize: 18,
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Member Access
              </Text>
              <Text
                style={{
                  color: CUC_COLORS.navy,
                  fontSize: 15,
                  textAlign: "center",
                  lineHeight: 22,
                  opacity: 0.85,
                }}
              >
                Full reciprocal clubs directory coming soon. In the meantime,
                you can view the complete list on our website.
              </Text>
              <View style={{ marginTop: 16 }}>
                <ExternalLinkButton
                  label="View Members' Area"
                  url="https://www.cityuniversityclub.co.uk/copy-of-reciprocal-clubs"
                  variant="primary"
                />
              </View>
            </View>
          ) : (
            // Not authenticated: Show sign in prompt
            <View
              style={{
                backgroundColor: CUC_COLORS.white,
                borderRadius: 12,
                padding: 24,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: CUC_COLORS.sage,
                borderStyle: "dashed",
                alignItems: "center",
              }}
            >
              <Ionicons
                color={CUC_COLORS.navy}
                name="lock-closed-outline"
                size={40}
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{
                  color: CUC_COLORS.navy,
                  fontSize: 17,
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Members Only
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: 16,
                }}
              >
                Sign in to access the full directory of reciprocal clubs and
                view detailed information about each club's facilities and
                booking process.
              </Text>
              <Pressable
                onPress={handleSignIn}
                style={{
                  backgroundColor: CUC_COLORS.navy,
                  paddingVertical: 14,
                  paddingHorizontal: 32,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  color={CUC_COLORS.cream}
                  name="log-in-outline"
                  size={20}
                />
                <Text
                  style={{
                    color: CUC_COLORS.cream,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  Sign In to Access Full Details
                </Text>
              </Pressable>
            </View>
          )}

          {/* Featured Clubs Preview */}
          <View
            style={{
              backgroundColor: CUC_COLORS.white,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: CUC_COLORS.navy,
                fontSize: 17,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              Featured Partner Clubs
            </Text>
            {FEATURED_CLUBS.map((club, index) => (
              <View
                key={club.name}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: index < FEATURED_CLUBS.length - 1 ? 1 : 0,
                  borderBottomColor: "#f0f0f0",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${CUC_COLORS.sage}30`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    color={CUC_COLORS.navy}
                    name={club.icon}
                    size={20}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: CUC_COLORS.navy,
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {club.name}
                  </Text>
                  <Text
                    style={{
                      color: "#888",
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {club.location}
                  </Text>
                </View>
              </View>
            ))}
            <Text
              style={{
                color: "#999",
                fontSize: 12,
                textAlign: "center",
                marginTop: 12,
                fontStyle: "italic",
              }}
            >
              ...and 446+ more clubs worldwide
            </Text>
          </View>

          {/* Contact for Assistance */}
          <View
            style={{
              backgroundColor: CUC_COLORS.navy,
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: CUC_COLORS.cream,
                fontSize: 15,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Need Assistance?
            </Text>
            <Text
              style={{
                color: CUC_COLORS.cream,
                fontSize: 14,
                textAlign: "center",
                opacity: 0.9,
                marginBottom: 12,
              }}
            >
              Contact the club for help with reciprocal club bookings
            </Text>
            <Pressable
              onPress={() => Linking.openURL("tel:02071676682")}
              style={{
                backgroundColor: CUC_COLORS.sage,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons color={CUC_COLORS.navy} name="call" size={18} />
              <Text
                style={{
                  color: CUC_COLORS.navy,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                020 7167 6682
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
