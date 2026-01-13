import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useThemeColor } from "heroui-native";

// CUC brand colors from design.md
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a", // rgb(133, 176, 154) from user input
	cream: "#fffef8",
	white: "#ffffff",
};

export default function TabLayout() {
	const router = useRouter();
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

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
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="menu"
				options={{
					title: "Menu",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="restaurant-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="events"
				options={{
					title: "Events",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: "Menu",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="menu-outline" size={24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
