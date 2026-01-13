import React, { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import { Text } from "react-native";
import { ThemeToggle } from "@/components/theme-toggle";

function DrawerLayout() {
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

	const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

	return (
		<Drawer
			screenOptions={{
				headerTintColor: themeColorForeground,
				headerStyle: { backgroundColor: themeColorBackground },
				headerTitleStyle: {
					fontWeight: "600",
					color: themeColorForeground,
				},
				headerRight: renderThemeToggle,
				drawerStyle: { backgroundColor: themeColorBackground },
			}}
		>
			<Drawer.Screen
				name="index"
				options={{
					headerTitle: "City University Club",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Home
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="home-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="events"
				options={{
					headerTitle: "Events",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Events
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="calendar-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="dining"
				options={{
					headerTitle: "Dining",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Dining
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="restaurant-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="membership"
				options={{
					headerTitle: "Membership",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Membership
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="card-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="(tabs)"
				options={{
					headerTitle: "More",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							More
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="ellipsis-horizontal-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="todos"
				options={{
					headerTitle: "Todos",
					drawerItemStyle: { display: "none" },
				}}
			/>
			<Drawer.Screen
				name="ai"
				options={{
					headerTitle: "AI",
					drawerItemStyle: { display: "none" },
				}}
			/>
		</Drawer>
	);
}

export default DrawerLayout;
