import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";

// Image from the Fabric Fund page
const FABRIC_FUND_IMAGE =
  "https://static.wixstatic.com/media/5e0aaa_a4f22f2a2cc743e5bb27e7cce56a0327~mv2.jpg/v1/fill/w_600,h_800,al_c,q_85,enc_avif,quality_auto/5e0aaa_a4f22f2a2cc743e5bb27e7cce56a0327~mv2.jpg";

export default function FabricFund() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Theme colors for Ionicons
  const foreground = useThemeColor("foreground");
  const accent = useThemeColor("accent");
  const primaryForeground = "#fffef8";

  const handleDonate = () => {
    Linking.openURL(
      "mailto:secretary@cityuniversityclub.co.uk?subject=Fabric%20Fund%20Donation"
    );
  };

  const handleCall = () => {
    Linking.openURL("tel:02078636681");
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary px-4 pb-4"
        style={{
          paddingTop: insets.top + 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons color={primaryForeground} name="arrow-back" size={22} />
          </Pressable>
          <Text
            className="text-primary-foreground"
            style={{
              fontSize: 20,
              fontWeight: "300",
              fontFamily: "serif",
            }}
          >
            Fabric Fund
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        style={{ flex: 1 }}
      >
        {/* Hero Image */}
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{ uri: FABRIC_FUND_IMAGE }}
          style={{
            width: "100%",
            height: 240,
          }}
        />

        {/* Main Content */}
        <View style={{ padding: 16 }}>
          {/* Title Card */}
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
                fontSize: 24,
                fontWeight: "300",
                fontFamily: "serif",
                marginBottom: 8,
              }}
            >
              The City University Club Fabric Fund
            </Text>
            <Text
              className="text-accent"
              style={{
                fontSize: 16,
                fontStyle: "italic",
              }}
            >
              Looking forward to the next 125 years
            </Text>
          </View>

          {/* About Section */}
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
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              About the Fund
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 12,
              }}
            >
              In January 2018, the City University Club moved into our new home
              at 42 Crutched Friars, leaving behind our base of over 120 years
              at 50 Cornhill.
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 12,
              }}
            >
              Since we moved in, the Club has established itself in the local
              area and the Committee has resolved to refurbish and completely
              overhaul the interior of the facilities.
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 15,
                lineHeight: 24,
              }}
            >
              The Committee has established the 'Fabric Fund Committee' to lead
              on fundraising and provide the Club with the resources necessary
              to complete the project and ensure we have a club ready for the
              next 125 years.
            </Text>
          </View>

          {/* Honours Board Section */}
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
                marginBottom: 12,
              }}
            >
              <Ionicons color={accent} name="ribbon-outline" size={24} />
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginLeft: 10,
                }}
              >
                Members Honour Board
              </Text>
            </View>
            <Text
              className="text-primary-foreground"
              style={{
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              Join the Fabric Fund today and make your name known! We are
              inviting members to donate to the Club and, in return, have their
              name featured on a new 'Members Honour Board'.
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 8,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                className="text-accent"
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                Contribution Amount
              </Text>
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 32,
                  fontWeight: "300",
                  fontFamily: "serif",
                }}
              >
                £125.00
              </Text>
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 13,
                  marginTop: 4,
                  opacity: 0.8,
                }}
              >
                Your name and year of membership displayed
              </Text>
            </View>
          </View>

          {/* How to Contribute */}
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
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              How to Support Your Club
            </Text>

            <ContributionItem
              accent={accent}
              description="Donate £125 to have your name displayed"
              icon="heart-outline"
              title="Join the Honour Board"
            />
            <ContributionItem
              accent={accent}
              description="Support fundraising celebrations"
              icon="calendar-outline"
              title="Attend Club Events"
            />
            <ContributionItem
              accent={accent}
              description="Encourage fellow members to contribute"
              icon="megaphone-outline"
              isLast
              title="Spread the Word"
            />
          </View>

          {/* Contact Card */}
          <View
            className="bg-surface"
            style={{
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
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
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              Get in Touch
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 16,
              }}
            >
              To make a donation or learn more about the Fabric Fund, please
              contact the Club Secretary.
            </Text>

            <Pressable
              onPress={handleCall}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons color={accent} name="call-outline" size={18} />
              <Text
                className="text-foreground"
                style={{ fontSize: 14, marginLeft: 10 }}
              >
                020 7863 6681
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDonate}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons color={accent} name="mail-outline" size={18} />
              <Text
                className="text-foreground"
                style={{ fontSize: 14, marginLeft: 10 }}
              >
                secretary@cityuniversityclub.co.uk
              </Text>
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            <Pressable
              className="bg-accent"
              onPress={handleDonate}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                borderRadius: 12,
                padding: 18,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              })}
            >
              <Ionicons color={foreground} name="heart" size={22} />
              <Text
                className="text-foreground"
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 10,
                }}
              >
                Enquire About Donating
              </Text>
            </Pressable>

            <ExternalLinkButton
              label="Learn More"
              url="https://www.cityuniversityclub.co.uk/about-2"
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ContributionItem({
  icon,
  title,
  description,
  isLast = false,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isLast?: boolean;
  accent: string;
}) {
  return (
    <View
      className="border-border"
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
      }}
    >
      <View
        className="bg-accent/20"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Ionicons color={accent} name={icon} size={20} />
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
