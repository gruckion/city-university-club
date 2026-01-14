import { Ionicons } from "@expo/vector-icons";
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

// Local assets for instant loading
const HERO_IMAGE = require("@/assets/images/hero-background.jpg");
const CUC_LOGO = require("@/assets/images/city_uni_club_gold.png");

export default function About() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: CUC_COLORS.navy,
          paddingTop: insets.top,
          paddingBottom: 16,
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
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              alignItems: "center",
              justifyContent: "center",
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
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: CUC_COLORS.white,
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
            style={{
              color: CUC_COLORS.navy,
              fontSize: 26,
              fontWeight: "300",
              fontFamily: "serif",
              textAlign: "center",
            }}
          >
            City University Club
          </Text>
          <Text
            style={{
              color: CUC_COLORS.sage,
              fontSize: 16,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            Established 1895
          </Text>
        </View>

        {/* History Section */}
        <View
          style={{
            backgroundColor: CUC_COLORS.white,
            marginHorizontal: 16,
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
                backgroundColor: `${CUC_COLORS.navy}10`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons color={CUC_COLORS.navy} name="book-outline" size={18} />
            </View>
            <Text
              style={{
                color: CUC_COLORS.navy,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Our History
            </Text>
          </View>
          <Text
            style={{
              color: "#444",
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
            style={{
              color: "#444",
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
          style={{
            backgroundColor: CUC_COLORS.white,
            marginHorizontal: 16,
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
                backgroundColor: `${CUC_COLORS.navy}10`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                color={CUC_COLORS.navy}
                name="restaurant-outline"
                size={18}
              />
            </View>
            <Text
              style={{
                color: CUC_COLORS.navy,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              The Club Today
            </Text>
          </View>
          <Text
            style={{
              color: "#444",
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
            style={{
              color: "#444",
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
          style={{
            backgroundColor: CUC_COLORS.white,
            marginHorizontal: 16,
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: `${CUC_COLORS.navy}10`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons color={CUC_COLORS.navy} name="star-outline" size={18} />
            </View>
            <Text
              style={{
                color: CUC_COLORS.navy,
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
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: CUC_COLORS.sage,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  color={CUC_COLORS.navy}
                  name={feature.icon}
                  size={16}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: CUC_COLORS.navy,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {feature.title}
                </Text>
                <Text
                  style={{
                    color: "#666",
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
          style={{
            backgroundColor: CUC_COLORS.navy,
            marginHorizontal: 16,
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
                color={CUC_COLORS.cream}
                name="location-outline"
                size={18}
              />
            </View>
            <Text
              style={{
                color: CUC_COLORS.cream,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Visit Us
            </Text>
          </View>

          <Text
            style={{
              color: CUC_COLORS.cream,
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            42 Crutched Friars
          </Text>
          <Text
            style={{
              color: CUC_COLORS.sage,
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
              onPress={() => Linking.openURL("tel:02071676682")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: CUC_COLORS.sage,
                paddingVertical: 12,
                borderRadius: 8,
                gap: 8,
              }}
            >
              <Ionicons color={CUC_COLORS.navy} name="call" size={18} />
              <Text
                style={{
                  color: CUC_COLORS.navy,
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
              <Ionicons color={CUC_COLORS.cream} name="mail" size={18} />
              <Text
                style={{
                  color: CUC_COLORS.cream,
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
          style={{
            backgroundColor: CUC_COLORS.white,
            marginHorizontal: 16,
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
                backgroundColor: `${CUC_COLORS.navy}10`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                color={CUC_COLORS.navy}
                name="shirt-outline"
                size={18}
              />
            </View>
            <Text
              style={{
                color: CUC_COLORS.navy,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Dress Code
            </Text>
          </View>
          <Text
            style={{
              color: "#444",
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
          style={{
            backgroundColor: CUC_COLORS.white,
            marginHorizontal: 16,
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
                backgroundColor: `${CUC_COLORS.navy}10`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons color={CUC_COLORS.navy} name="time-outline" size={18} />
            </View>
            <Text
              style={{
                color: CUC_COLORS.navy,
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
              <Text style={{ color: "#444", fontSize: 15 }}>
                Monday - Friday
              </Text>
              <Text
                style={{
                  color: CUC_COLORS.navy,
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
              <Text style={{ color: "#444", fontSize: 15 }}>Lunch Service</Text>
              <Text
                style={{
                  color: CUC_COLORS.navy,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                12:00 PM - 2:30 PM
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: "#888",
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
