import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";

// Local assets for instant loading
const HERO_IMAGE = require("@/assets/images/hero-background.jpg");
const CUC_LOGO = require("@/assets/images/city_uni_club_gold.png");

export default function About() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Theme colors for Ionicons
  const foreground = useThemeColor("foreground");
  const primaryForeground = "#fffef8";

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary px-4 pb-4"
        style={{
          paddingTop: insets.top,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons color={primaryForeground} name="arrow-back" size={22} />
          </Pressable>
          <Text
            className="flex-1 text-primary-foreground"
            style={{
              fontSize: 20,
              fontWeight: "300",
              fontFamily: "serif",
            }}
          >
            About the Club
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {/* Hero Image */}
        <View style={{ height: 220 }}>
          <Image
            contentFit="cover"
            source={HERO_IMAGE}
            style={{ width: "100%", height: "100%" }}
          />
          {/* Overlay with logo */}
          <View
            style={{
              position: "absolute",
              bottom: -40,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <View
              className="bg-surface"
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Image
                contentFit="contain"
                source={CUC_LOGO}
                style={{ width: 70, height: 70 }}
              />
            </View>
          </View>
        </View>

        {/* Spacer for overlapping logo */}
        <View style={{ height: 50 }} />

        {/* Club Title */}
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: 20,
            marginBottom: 24,
          }}
        >
          <Text
            className="text-center text-foreground"
            style={{
              fontSize: 26,
              fontWeight: "300",
              fontFamily: "serif",
            }}
          >
            City University Club
          </Text>
          <Text
            className="text-center text-accent"
            style={{
              fontSize: 16,
              marginTop: 4,
            }}
          >
            Established 1895
          </Text>
        </View>

        {/* History Section */}
        <View
          className="mx-4 mb-4 bg-surface"
          style={{
            borderRadius: 12,
            padding: 20,
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
              marginBottom: 12,
            }}
          >
            <View
              className="bg-primary/10"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons color={foreground} name="book-outline" size={18} />
            </View>
            <Text
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Our History
            </Text>
          </View>
          <Text
            className="text-muted"
            style={{
              fontSize: 15,
              lineHeight: 24,
            }}
          >
            Originally established in 1895 by Oxbridge graduates who wanted a
            lunch club in the City, the link with the universities remains,
            although membership is now much wider, embracing both sexes and many
            professions.
          </Text>
          <Text
            className="text-muted"
            style={{
              fontSize: 15,
              lineHeight: 24,
              marginTop: 12,
            }}
          >
            Our current premises at 42 Crutched Friars, which we moved to in
            January 2018, have a rich history of their own - they were once the
            residence of the Spanish Ambassador during the late 18th century.
          </Text>
        </View>

        {/* About Section */}
        <View
          className="mx-4 mb-4 bg-surface"
          style={{
            borderRadius: 12,
            padding: 20,
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
              marginBottom: 12,
            }}
          >
            <View
              className="bg-primary/10"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                color={foreground}
                name="restaurant-outline"
                size={18}
              />
            </View>
            <Text
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              The Club Today
            </Text>
          </View>
          <Text
            className="text-muted"
            style={{
              fontSize: 15,
              lineHeight: 24,
            }}
          >
            The City University Club is a lunch club in the heart of London's
            financial district. It is the ideal place for lunch or simply a
            drink at the bar. The Club offers a first-class meal in discreet
            circumstances for a modest price.
          </Text>
          <Text
            className="text-muted"
            style={{
              fontSize: 15,
              lineHeight: 24,
              marginTop: 12,
            }}
          >
            Members joining the Club find the atmosphere equally conducive to
            lunching with friends or on their own at the club tables. The food
            is first-class, the wine list comprehensive, and the service
            excellent.
          </Text>
        </View>

        {/* Key Features */}
        <View
          className="mx-4 mb-4 bg-surface"
          style={{
            borderRadius: 12,
            padding: 20,
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
              marginBottom: 16,
            }}
          >
            <View
              className="bg-primary/10"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons color={foreground} name="star-outline" size={18} />
            </View>
            <Text
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              What We Offer
            </Text>
          </View>

          {/* Feature Items */}
          {[
            {
              icon: "globe-outline" as const,
              title: "Reciprocal Clubs",
              description: "Access to over 450 of the finest clubs worldwide",
            },
            {
              icon: "restaurant-outline" as const,
              title: "Fine Dining",
              description: "First-class cuisine with an excellent wine list",
            },
            {
              icon: "briefcase-outline" as const,
              title: "Business Space",
              description:
                "Comfortable space for business use from early morning",
            },
            {
              icon: "people-outline" as const,
              title: "Networking",
              description:
                "Meet professionals from many fields and backgrounds",
            },
          ].map((feature, index) => (
            <View
              key={feature.title}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: index < 3 ? 16 : 0,
              }}
            >
              <View
                className="bg-accent"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons color={foreground} name={feature.icon} size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  className="text-foreground"
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {feature.title}
                </Text>
                <Text
                  className="text-muted"
                  style={{
                    fontSize: 14,
                    marginTop: 2,
                  }}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Location Section */}
        <View
          className="mx-4 mb-4 bg-primary"
          style={{
            borderRadius: 12,
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                color={primaryForeground}
                name="location-outline"
                size={18}
              />
            </View>
            <Text
              className="text-primary-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Visit Us
            </Text>
          </View>

          <Text
            className="text-primary-foreground"
            style={{
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            42 Crutched Friars
          </Text>
          <Text
            className="text-accent"
            style={{
              fontSize: 15,
              marginTop: 4,
            }}
          >
            London EC3N 2AP2
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              marginVertical: 16,
            }}
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              className="flex-1 bg-accent"
              onPress={() => Linking.openURL("tel:02071676682")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                borderRadius: 8,
                gap: 8,
              }}
            >
              <Ionicons color={foreground} name="call" size={18} />
              <Text
                className="text-foreground"
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Call Us
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Linking.openURL("mailto:secretary@cityuniversityclub.co.uk")
              }
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                paddingVertical: 12,
                borderRadius: 8,
                gap: 8,
              }}
            >
              <Ionicons color={primaryForeground} name="mail" size={18} />
              <Text
                className="text-primary-foreground"
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Email
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Dress Code */}
        <View
          className="mx-4 mb-4 bg-surface"
          style={{
            borderRadius: 12,
            padding: 20,
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
              marginBottom: 12,
            }}
          >
            <View
              className="bg-primary/10"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons color={foreground} name="shirt-outline" size={18} />
            </View>
            <Text
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Dress Code
            </Text>
          </View>
          <Text
            className="text-muted"
            style={{
              fontSize: 15,
              lineHeight: 24,
            }}
          >
            In keeping with other private members clubs, the dress code is
            jacket and tie for men and smart dress for ladies. Jeans and
            trainers are not permitted.
          </Text>
        </View>

        {/* Opening Hours */}
        <View
          className="mx-4 mb-4 bg-surface"
          style={{
            borderRadius: 12,
            padding: 20,
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
              marginBottom: 12,
            }}
          >
            <View
              className="bg-primary/10"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons color={foreground} name="time-outline" size={18} />
            </View>
            <Text
              className="text-foreground"
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Opening Hours
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text className="text-muted" style={{ fontSize: 15 }}>
                Monday - Friday
              </Text>
              <Text
                className="text-foreground"
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                9:00 AM - 5:00 PM
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text className="text-muted" style={{ fontSize: 15 }}>
                Lunch Service
              </Text>
              <Text
                className="text-foreground"
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                12:00 PM - 2:30 PM
              </Text>
            </View>
          </View>
          <Text
            className="text-muted"
            style={{
              fontSize: 13,
              marginTop: 12,
              fontStyle: "italic",
            }}
          >
            Closed between Christmas and New Year
          </Text>
        </View>

        {/* Website Link */}
        <View style={{ marginHorizontal: 16 }}>
          <ExternalLinkButton
            label="Visit Our Website"
            url="https://www.cityuniversityclub.co.uk/"
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
}
