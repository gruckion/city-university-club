import "@/polyfills";
import "@/global.css";

import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { env } from "@convoexpo-and-nextjs-web-bun-better-auth/env/native";

import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider, useAppTheme } from "@/contexts/app-theme-context";

export const unstable_settings = {
	initialRouteName: "(drawer)",
};

const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
	unsavedChangesWarning: false,
});

function StackLayout() {
	return (
		<Stack screenOptions={{}}>
			<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
		</Stack>
	);
}

/* ------------------------------ themed layout ------------------------------ */
function ThemedLayout() {
	const { currentTheme } = useAppTheme();
	return (
		<HeroUINativeProvider
			config={{
				colorScheme: "system",
				theme: currentTheme,
				textProps: {
					allowFontScaling: false,
				},
			}}
		>
			<StackLayout />
		</HeroUINativeProvider>
	);
}

/* ------------------------------- root layout ------------------------------ */
export default function Layout() {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<AppThemeProvider>
						<ThemedLayout />
					</AppThemeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</ConvexBetterAuthProvider>
	);
}
