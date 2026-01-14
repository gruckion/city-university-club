import { StyleSheet, Text, View } from "react-native";

/**
 * A small pill/badge component that indicates the last used login method.
 * Styled similar to Vercel's "Last Used" indicator.
 */
export function LastUsedIndicator() {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>Last Used</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "rgba(59, 130, 246, 0.9)", // Blue color similar to Vercel
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  text: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
