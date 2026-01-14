import "@/polyfills";
import "@/global.css";

import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { env } from "@convoexpo-and-nextjs-web-bun-better-auth/env/native";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider } from "@/contexts/app-theme-context";

// Expo Go doesn't support custom splash screens (SDK 52+), so we silence errors there only
const isExpoGo =
	Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync().catch((error) => {
	if (!isExpoGo) throw error;
});

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
	expectAuth: true,
	unsavedChangesWarning: false,
});

/**
 * Navigation Layout - Selective Auth Pattern
 *
 * This pattern allows:
 * - Main app (tabs) accessible to everyone, authenticated or not
 * - Auth screens presented as modals that can be dismissed
 * - Individual screens can check auth state and show appropriate UI
 *
 * For the "Auth-First" pattern, see: docs/AUTH_NAVIGATION_PATTERNS.md
 */
function StackLayout() {
	return (
		<Stack screenOptions={{ animation: "fade" }}>
			{/* Main tabs - always accessible */}
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
				}}
			/>

			{/* Auth screens - presented as fullscreen modal */}
			<Stack.Screen
				name="(auth)"
				options={{
					headerShown: false,
					presentation: "fullScreenModal",
					animation: "fade",
				}}
			/>

			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
		</Stack>
	);
}

/* ------------------------------- root layout ------------------------------ */
export default function Layout() {
	const [fontsLoaded, fontError] = useFonts({
		"DancingScript-Regular": require("@/assets/fonts/DancingScript-Regular.ttf"),
		"DancingScript-Bold": require("@/assets/fonts/DancingScript-Bold.ttf"),
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync().catch((error) => {
				if (!isExpoGo) throw error;
			});
		}
	}, [fontsLoaded, fontError]);

	// Don't render until fonts are loaded
	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<HeroUINativeProvider
						config={{
							textProps: {
								allowFontScaling: false,
							},
						}}
					>
						<AppThemeProvider>
							<StackLayout />
						</AppThemeProvider>
					</HeroUINativeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</ConvexBetterAuthProvider>
	);
}
