import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";

// CUC brand colors from design.md
const CUC_COLORS = {
  navy: "#06273a",
  sage: "#85b09a", // rgb(133, 176, 154) from user input
  cream: "#fffef8",
  white: "#ffffff",
};

export default function TabLayout() {
  const _router = useRouter();
  const _themeColorForeground = useThemeColor("foreground");
  const _themeColorBackground = useThemeColor("background");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CUC_COLORS.cream,
        tabBarInactiveTintColor: CUC_COLORS.sage,
        tabBarStyle: {
          backgroundColor: CUC_COLORS.navy,
          borderTopWidth: 0,
          height: 85,
          paddingTop: 8,
          paddingBottom: 25,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} name="home-outline" size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} name="restaurant-outline" size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} name="calendar-outline" size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} name="ellipsis-horizontal" size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
