import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Dining room image from the CUC website
const DINING_ROOM_IMAGE =
  "https://static.wixstatic.com/media/5e0aaa_89c287ebeaca49b398ec7c86b8397a0f~mv2.jpg/v1/fill/w_800,h_600,al_c,q_85/5e0aaa_89c287ebeaca49b398ec7c86b8397a0f~mv2.webp";

export default function DiningRoom() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Theme colors for Ionicons
  const foreground = useThemeColor("foreground");
  const accent = useThemeColor("accent");
  const primaryForeground = "#fffef8";

  const handleCall = () => {
    Linking.openURL("tel:02071676682");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:secretary@cityuniversityclub.co.uk");
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary px-5 pb-5"
        style={{
          paddingTop: insets.top + 8,
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
            <Ionicons color={primaryForeground} name="arrow-back" size={22} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              className="text-primary-foreground"
              style={{
                fontSize: 24,
                fontWeight: "300",
                fontFamily: "serif",
              }}
            >
              Dining Room
            </Text>
            <Text
              className="text-accent"
              style={{
                fontSize: 13,
                marginTop: 2,
              }}
            >
              A quiet haven in the heart of the City
            </Text>
          </View>
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
          source={{ uri: DINING_ROOM_IMAGE }}
          style={{ width: "100%", height: 220 }}
        />

        {/* Description Section */}
        <View style={{ padding: 16 }}>
          <View
            className="bg-surface"
            style={{
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
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              About Our Dining Rooms
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 15,
                lineHeight: 24,
              }}
            >
              The dining rooms are a quiet haven in the heart of the City of
              London for members and their guests, offering excellent food and
              superb service.
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 15,
                lineHeight: 24,
                marginTop: 12,
              }}
            >
              The welfare and happiness of our members and their guests is of
              paramount importance, so we will always try to cater for
              individual needs wherever possible.
            </Text>
          </View>

          {/* Opening Hours */}
          <View
            className="bg-primary"
            style={{
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <Ionicons color={accent} name="time-outline" size={22} />
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Opening Hours
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  className="text-primary-foreground"
                  style={{ fontSize: 15 }}
                >
                  Lunch Service
                </Text>
                <Text className="text-accent" style={{ fontSize: 15 }}>
                  12:00 noon onwards
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  className="text-primary-foreground"
                  style={{ fontSize: 15 }}
                >
                  Last Orders
                </Text>
                <Text className="text-accent" style={{ fontSize: 15 }}>
                  2:30 PM
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  marginVertical: 4,
                }}
              />
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 13,
                  opacity: 0.8,
                  fontStyle: "italic",
                }}
              >
                Later orders available by prior arrangement with the Secretary
              </Text>
            </View>
          </View>

          {/* Services */}
          <View
            className="bg-surface"
            style={{
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
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              Our Services
            </Text>

            <View style={{ gap: 16 }}>
              <ServiceItem
                description="Start your day at the Club"
                foreground={foreground}
                icon="cafe-outline"
                title="Breakfast"
              />
              <ServiceItem
                description="Daily lunch service with seasonal menus"
                foreground={foreground}
                icon="restaurant-outline"
                title="Lunch"
              />
              <ServiceItem
                description="Pre-lunch and post-lunch drinks available"
                foreground={foreground}
                icon="wine-outline"
                title="Bar"
              />
              <ServiceItem
                description="Evening dining for special occasions"
                foreground={foreground}
                icon="moon-outline"
                title="Private Dinners"
              />
              <ServiceItem
                description="Available 7 days a week for breakfast, lunch and dinner"
                foreground={foreground}
                icon="business-outline"
                title="Private Rooms"
              />
              <ServiceItem
                description="Professional spaces for private hire"
                foreground={foreground}
                icon="people-outline"
                title="Meeting Rooms"
              />
            </View>
          </View>

          {/* Booking Information */}
          <View
            className="bg-surface"
            style={{
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
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              Make a Reservation
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              Contact the Secretary to make a reservation or enquire about
              private dining and meeting room hire.
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                className="flex-1 bg-accent"
                onPress={handleCall}
                style={{
                  borderRadius: 8,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Ionicons color={foreground} name="call" size={18} />
                <Text
                  className="text-foreground"
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Call
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-primary"
                onPress={handleEmail}
                style={{
                  borderRadius: 8,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Ionicons color={primaryForeground} name="mail" size={18} />
                <Text
                  className="text-primary-foreground"
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Email
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Location Note */}
          <View
            className="bg-accent/15"
            style={{
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Ionicons color={accent} name="location" size={22} />
            <View style={{ flex: 1 }}>
              <Text
                className="text-foreground"
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                42 Crutched Friars
              </Text>
              <Text
                className="text-muted"
                style={{
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                London EC3N 2AP
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ServiceItem({
  icon,
  title,
  description,
  foreground,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  foreground: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
      <View
        className="bg-primary/10"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons color={foreground} name={icon} size={20} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          className="text-foreground"
          style={{
            fontSize: 15,
            fontWeight: "500",
          }}
        >
          {title}
        </Text>
        <Text
          className="text-muted"
          style={{
            fontSize: 13,
            marginTop: 2,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}
