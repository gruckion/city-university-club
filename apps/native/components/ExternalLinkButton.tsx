import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, Text } from "react-native";

// CUC brand colors
const CUC_COLORS = {
  navy: "#06273a",
  sage: "#85b09a",
  cream: "#fffef8",
  white: "#ffffff",
};

interface ExternalLinkButtonProps {
  label: string;
  url: string;
  variant?: "primary" | "subtle";
}

export function ExternalLinkButton({
  label,
  url,
  variant = "primary",
}: ExternalLinkButtonProps) {
  const handlePress = () => {
    Linking.openURL(url);
  };

  if (variant === "subtle") {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 16,
          gap: 6,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text
          style={{
            color: CUC_COLORS.navy,
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          {label}
        </Text>
        <Ionicons color={CUC_COLORS.navy} name="open-outline" size={16} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? `${CUC_COLORS.navy}dd` : CUC_COLORS.navy,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      })}
    >
      <Text
        style={{
          color: CUC_COLORS.cream,
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      <Ionicons color={CUC_COLORS.cream} name="open-outline" size={18} />
    </Pressable>
  );
}
