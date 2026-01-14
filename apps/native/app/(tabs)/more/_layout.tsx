import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="membership" />
      <Stack.Screen name="dining-room" />
      <Stack.Screen name="reciprocal-clubs" />
      <Stack.Screen name="fabric-fund" />
      <Stack.Screen name="bugle" />
      <Stack.Screen name="about" />
      <Stack.Screen name="contact" />
    </Stack>
  );
}
