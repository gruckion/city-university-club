import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useThemeColor } from "heroui-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";

// The Bugle PDF URL
const BUGLE_PDF_URL =
  "https://www.cityuniversityclub.co.uk/_files/ugd/da00a6_ff60a29890864b51be0e5aa177ba1d6a.pdf";

// Past issues (for display purposes)
const PAST_ISSUES = [
  { issue: "Autumn 2025", current: true },
  { issue: "Summer 2025", current: false },
  { issue: "Spring 2025", current: false },
  { issue: "Winter 2024", current: false },
];

export default function Bugle() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Theme colors for Ionicons
  const foreground = useThemeColor("foreground");
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");
  const primaryForeground = "#fffef8";

  const handleOpenPDF = async () => {
    await WebBrowser.openBrowserAsync(BUGLE_PDF_URL);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary px-4 pb-5"
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
            The Bugle
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        style={{ flex: 1 }}
      >
        {/* Hero Section with Icon */}
        <View
          className="bg-surface"
          style={{
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* Newsletter Icon */}
          <View
            className="bg-primary/10"
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <View
              className="bg-primary/15"
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons color={foreground} name="newspaper" size={36} />
            </View>
          </View>

          <Text
            className="text-center text-foreground"
            style={{
              fontSize: 22,
              fontWeight: "300",
              fontFamily: "serif",
              marginBottom: 8,
            }}
          >
            Club Newsletter
          </Text>

          <Text
            className="text-center text-muted"
            style={{
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 20,
              paddingHorizontal: 8,
            }}
          >
            Stay informed with the latest news, events, and updates from the
            City University Club. Published quarterly for our members.
          </Text>

          {/* Current Issue Badge */}
          <View
            className="bg-accent/20"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginBottom: 20,
            }}
          >
            <Text
              className="text-foreground"
              style={{
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Autumn 2025 Issue Now Available
            </Text>
          </View>

          {/* Read Latest Issue Button */}
          <Pressable
            className="w-full bg-primary"
            onPress={handleOpenPDF}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 32,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
            })}
          >
            <Ionicons
              color={primaryForeground}
              name="document-text"
              size={22}
            />
            <Text
              className="text-primary-foreground"
              style={{
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Read Latest Issue
            </Text>
          </Pressable>
        </View>

        {/* What's Inside Section */}
        <View
          className="bg-surface"
          style={{
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
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
            What's Inside The Bugle
          </Text>

          <ContentItem
            accent={accent}
            description="Details on club gatherings and special occasions"
            icon="calendar-outline"
            title="Upcoming Events"
          />
          <ContentItem
            accent={accent}
            description="Updates and achievements from our community"
            icon="people-outline"
            title="Member News"
          />
          <ContentItem
            accent={accent}
            description="New menus and seasonal offerings"
            icon="restaurant-outline"
            title="Dining Updates"
          />
          <ContentItem
            accent={accent}
            description="Fabric Fund progress and renovations"
            icon="construct-outline"
            isLast
            title="Club Improvements"
          />
        </View>

        {/* Past Issues */}
        <View
          className="bg-surface"
          style={{
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
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
            Recent Issues
          </Text>

          {PAST_ISSUES.map((item, index) => (
            <View
              className="border-border"
              key={item.issue}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: index === PAST_ISSUES.length - 1 ? 0 : 1,
              }}
            >
              <View
                className={item.current ? "bg-accent/20" : "bg-primary/10"}
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
                  color={item.current ? accent : muted}
                  name="document-text-outline"
                  size={18}
                />
              </View>
              <Text
                className="flex-1 text-foreground"
                style={{
                  fontSize: 15,
                  fontWeight: item.current ? "500" : "400",
                }}
              >
                {item.issue}
              </Text>
              {item.current && (
                <View
                  className="bg-accent"
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    className="text-surface"
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Current
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Publication Info */}
        <View
          className="bg-primary"
          style={{
            borderRadius: 12,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Ionicons color={primaryForeground} name="time-outline" size={24} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              className="text-primary-foreground"
              style={{
                fontSize: 15,
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              Published Quarterly
            </Text>
            <Text
              className="text-accent"
              style={{
                fontSize: 13,
              }}
            >
              New issues released in Spring, Summer, Autumn, and Winter
            </Text>
          </View>
        </View>

        {/* Website Link */}
        <View style={{ marginTop: 20 }}>
          <ExternalLinkButton
            label="View on Website"
            url="https://www.cityuniversityclub.co.uk/about-3"
            variant="subtle"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ContentItem({
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
        alignItems: "flex-start",
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
      }}
    >
      <View
        className="bg-accent/20"
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons color={accent} name={icon} size={18} />
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
          {title}
        </Text>
        <Text className="text-muted" style={{ fontSize: 13 }}>
          {description}
        </Text>
      </View>
    </View>
  );
}
