import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MENU_DATA } from "./index";

// Generic food blurhash placeholder (warm brown/beige tones)
const FOOD_BLURHASH = "LKJRyV~qIU-;_3M{ofRj9Fxut7WB";

// CUC brand colors
const CUC_COLORS = {
  navy: "#06273a",
  sage: "#85b09a",
  cream: "#fffef8",
  white: "#ffffff",
};

const CATEGORY_TITLES: Record<string, string> = {
  starters: "Starters",
  mains: "Main Courses",
  desserts: "Desserts & Savouries",
  canape: "Canapé Menu",
};

export default function MenuCategory() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category: string }>();

  const categoryTitle = CATEGORY_TITLES[category || ""] || "Menu";
  const items = MENU_DATA[category as keyof typeof MENU_DATA] || [];

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
            <Ionicons color={CUC_COLORS.cream} name="arrow-back" size={24} />
          </Pressable>
          <View>
            <Text
              style={{
                color: CUC_COLORS.cream,
                fontSize: 24,
                fontWeight: "300",
                fontFamily: "serif",
              }}
            >
              {categoryTitle}
            </Text>
            <Text
              style={{
                color: CUC_COLORS.sage,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {items.length} items
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        style={{ flex: 1 }}
      >
        {items.map((item) => (
          <MenuItem item={item} key={item.name} />
        ))}
      </ScrollView>
    </View>
  );
}

function MenuItem({
  item,
}: {
  item: { name: string; description: string | null; image: string | null };
}) {
  return (
    <View
      style={{
        backgroundColor: CUC_COLORS.white,
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {item.image && (
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          placeholder={{ blurhash: FOOD_BLURHASH }}
          source={item.image}
          style={{ width: "100%", height: 180 }}
          transition={200}
        />
      )}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            color: CUC_COLORS.navy,
            fontSize: 17,
            fontWeight: "600",
            lineHeight: 22,
          }}
        >
          {item.name}
        </Text>
        {item.description && (
          <Text
            style={{
              color: "#666",
              fontSize: 14,
              marginTop: 6,
              lineHeight: 20,
            }}
          >
            {item.description}
          </Text>
        )}
      </View>
    </View>
  );
}
