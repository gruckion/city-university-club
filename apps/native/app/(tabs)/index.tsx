import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import {
	ImageBackground,
	Pressable,
	Text,
	View,
	Image,
	Dimensions,
	StatusBar,
} from "react-native";
import { Container } from "@/components/container";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// CUC brand colors from design.md
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a", // rgb(133, 176, 154) greeting text color
	cream: "#fffef8",
	white: "#ffffff",
};

// Background image from user input
const HERO_IMAGE_URL =
	"https://static.wixstatic.com/media/5e0aaa_ccdcbf3fc2554b5dade459417f201713~mv2.jpg/v1/fill/w_1770,h_1184,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/5e0aaa_ccdcbf3fc2554b5dade459417f201713~mv2.jpg";

// Logo URL from design.md
const LOGO_URL =
	"https://static.wixstatic.com/media/5e0aaa_0e0a73fe0edb472b8eebfde40d24d47f~mv2.png/v1/fill/w_102,h_102,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20(Instagram%20Post).png";

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good Morning,";
	if (hour < 17) return "Good Afternoon,";
	return "Good Evening,";
}

export default function Home() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { isAuthenticated } = useConvexAuth();
	const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

	// If not authenticated, show landing prompt
	if (!isAuthenticated) {
		return (
			<ImageBackground
				source={{ uri: HERO_IMAGE_URL }}
				style={{ flex: 1 }}
				resizeMode="cover"
			>
				<StatusBar barStyle="light-content" />
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(6, 39, 58, 0.7)",
						paddingTop: insets.top,
					}}
				>
					{/* Header */}
					<View className="flex-row items-center justify-between px-4 py-3">
						<View className="flex-row items-center gap-3">
							<View className="w-16 h-16 rounded-full bg-white items-center justify-center overflow-hidden">
								<Image
									source={{ uri: LOGO_URL }}
									style={{ width: 56, height: 56 }}
									resizeMode="contain"
								/>
							</View>
							<View>
								<Text style={{ color: CUC_COLORS.sage, fontSize: 16 }}>
									Welcome to
								</Text>
								<Text
									style={{
										color: CUC_COLORS.cream,
										fontSize: 24,
										fontWeight: "300",
										fontFamily: "serif",
									}}
								>
									City University Club
								</Text>
							</View>
						</View>
					</View>

					{/* Content */}
					<View className="flex-1 justify-center items-center px-6">
						<Text
							style={{
								color: CUC_COLORS.cream,
								fontSize: 32,
								fontWeight: "300",
								textAlign: "center",
								fontFamily: "serif",
								marginBottom: 16,
							}}
						>
							Your exclusive members club
						</Text>
						<Text
							style={{
								color: CUC_COLORS.sage,
								fontSize: 16,
								textAlign: "center",
								marginBottom: 32,
							}}
						>
							A lunch club in the heart of the financial area of London
						</Text>
					</View>

					{/* Membership Card Button */}
					<View className="px-6 pb-6">
						<Pressable
							onPress={() => router.push("/(auth)/landing")}
							style={{
								backgroundColor: CUC_COLORS.navy,
								paddingVertical: 16,
								paddingHorizontal: 24,
								borderRadius: 8,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 16,
									fontWeight: "500",
								}}
							>
								Sign In
							</Text>
						</Pressable>
					</View>
				</View>
			</ImageBackground>
		);
	}

	const firstName = user?.name?.split(" ")[0] || "Member";

	return (
		<ImageBackground
			source={{ uri: HERO_IMAGE_URL }}
			style={{ flex: 1 }}
			resizeMode="cover"
		>
			<StatusBar barStyle="light-content" />
			<View
				style={{
					flex: 1,
					backgroundColor: "rgba(6, 39, 58, 0.6)",
					paddingTop: insets.top,
				}}
			>
				{/* Header with Logo, Greeting and Notification */}
				<View className="flex-row items-center justify-between px-4 py-3">
					<View className="flex-row items-center gap-3">
						{/* Logo */}
						<View className="w-16 h-16 rounded-full bg-white items-center justify-center overflow-hidden">
							<Image
								source={{ uri: LOGO_URL }}
								style={{ width: 56, height: 56 }}
								resizeMode="contain"
							/>
						</View>
						{/* Greeting */}
						<View>
							<Text style={{ color: CUC_COLORS.sage, fontSize: 16 }}>
								{getGreeting()}
							</Text>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 28,
									fontWeight: "300",
									fontFamily: "serif",
								}}
							>
								{firstName}
							</Text>
						</View>
					</View>

					{/* Notification Bell */}
					<Pressable
						style={{
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: "rgba(255, 255, 255, 0.15)",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons name="notifications-outline" size={24} color={CUC_COLORS.cream} />
					</Pressable>
				</View>

				{/* Main content area - spacer for the background image */}
				<View className="flex-1" />

				{/* Membership Card Button */}
				<View className="px-6 pb-6">
					<Pressable
						onPress={() => router.push("/(tabs)/more")}
						style={{
							backgroundColor: CUC_COLORS.navy,
							paddingVertical: 16,
							paddingHorizontal: 24,
							borderRadius: 8,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: CUC_COLORS.cream,
								fontSize: 16,
								fontWeight: "500",
							}}
						>
							Membership Card
						</Text>
					</Pressable>
				</View>
			</View>
		</ImageBackground>
	);
}
