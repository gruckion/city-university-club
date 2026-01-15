import { Ionicons } from "@expo/vector-icons";
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
  colors: {
    navy: string;
    sage: string;
    cream: string;
    white: string;
  };
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
 *   colors={CUC_COLORS}
 * />
 * ```
 */
export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  colors,
}: CategoryFilterProps) {
  return (
    <View
      style={{
        backgroundColor: colors.cream,
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
            colors={colors}
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
  colors,
}: {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
  colors: CategoryFilterProps["colors"];
}) {
  const scale = useSharedValue(1);

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
      <Animated.View
        style={[
          animatedStyle,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: isSelected ? colors.navy : colors.white,
            borderWidth: 1,
            borderColor: isSelected ? colors.navy : "rgba(0, 0, 0, 0.08)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isSelected ? 0.1 : 0.05,
            shadowRadius: 2,
            elevation: isSelected ? 2 : 1,
          },
        ]}
      >
        <Ionicons
          color={isSelected ? colors.sage : colors.navy}
          name={category.icon}
          size={16}
        />
        <Text
          style={{
            color: isSelected ? colors.cream : colors.navy,
            fontSize: 14,
            fontWeight: isSelected ? "600" : "500",
          }}
        >
          {category.label}
        </Text>
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
