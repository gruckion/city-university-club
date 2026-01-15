import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Linking, Pressable, Text } from "react-native";

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
  const foreground = useThemeColor("foreground");
  const primary = "#06273a";
  const primaryForeground = "#fffef8";

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
          className="text-foreground"
          style={{
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          {label}
        </Text>
        <Ionicons color={foreground} name="open-outline" size={16} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        className="text-primary-foreground"
        style={{
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      <Ionicons color={primaryForeground} name="open-outline" size={18} />
    </Pressable>
  );
}
