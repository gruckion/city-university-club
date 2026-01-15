import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export interface Category {
  id: string | null; // null = "All"
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

/**
 * Horizontal scrollable category filter chips
 *
 * Usage:
 * ```tsx
 * const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
 *
 * <CategoryFilter
 *   categories={CATEGORIES}
 *   selectedCategory={selectedCategory}
 *   onSelectCategory={setSelectedCategory}
 * />
 * ```
 */
export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <View
      className="bg-background"
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.06)",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <CategoryChip
            category={category}
            isSelected={selectedCategory === category.id}
            key={category.id ?? "all"}
            onPress={() => onSelectCategory(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function CategoryChip({
  category,
  isSelected,
  onPress,
}: {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  // useThemeColor only for Ionicons (which don't support className)
  const accent = useThemeColor("accent") || "#85b09a";
  const foreground = useThemeColor("foreground") || "#06273a";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
    >
      <Animated.View style={animatedStyle}>
        <View
          className={
            isSelected
              ? "border-primary bg-primary"
              : "border-border bg-surface"
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isSelected ? 0.1 : 0.05,
            shadowRadius: 2,
            elevation: isSelected ? 2 : 1,
          }}
        >
          <Ionicons
            color={isSelected ? accent : foreground}
            name={category.icon}
            size={16}
          />
          <Text
            className={
              isSelected ? "text-primary-foreground" : "text-foreground"
            }
            style={{
              fontSize: 14,
              fontWeight: isSelected ? "600" : "500",
            }}
          >
            {category.label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// Default event categories
export const EVENT_CATEGORIES: Category[] = [
  { id: null, label: "All Events", icon: "apps-outline" },
  { id: "seasonal", label: "Seasonal", icon: "leaf-outline" },
  { id: "special", label: "Special", icon: "star-outline" },
  { id: "recurring", label: "Recurring", icon: "repeat-outline" },
];
