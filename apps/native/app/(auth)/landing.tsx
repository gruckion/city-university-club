import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
	ImageBackground,
	Pressable,
	Text,
	View,
	Image,
	StatusBar,
	ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppleAuth, useGoogleAuth } from "@/lib/oauth";
import { authClient } from "@/lib/auth-client";
import { LastUsedIndicator } from "@/components/LastUsedIndicator";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

// Local assets for instant loading
const HERO_IMAGE = require("@/assets/images/hero-background.jpg");
const CUC_LOGO = require("@/assets/images/city_uni_club_gold.png");

export default function Landing() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { signIn: signInWithGoogle, isLoading: isGoogleLoading } =
		useGoogleAuth();
	const { signIn: signInWithApple, isLoading: isAppleLoading } = useAppleAuth();
	const isLoading = isGoogleLoading || isAppleLoading;

	return (
		<ImageBackground
			source={HERO_IMAGE}
			style={{ flex: 1 }}
			resizeMode="cover"
		>
			<StatusBar barStyle="light-content" />
			<View
				style={{
					flex: 1,
					backgroundColor: "rgba(6, 39, 58, 0.75)",
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
				}}
			>
				{/* Close Button - dismisses auth modal and returns to tabs */}
				<Pressable
					onPress={() => router.dismiss()}
					style={{
						position: "absolute",
						top: insets.top + 16,
						left: 16,
						width: 40,
						height: 40,
						borderRadius: 20,
						backgroundColor: "rgba(255, 255, 255, 0.15)",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 10,
					}}
				>
					<Ionicons name="close" size={24} color={CUC_COLORS.cream} />
				</Pressable>

				{/* Header with Logo */}
				<View className="items-center pt-8">
					<View className="w-24 h-24 rounded-full bg-transparentitems-center justify-center overflow-hidden mb-4">
						<Image
							source={CUC_LOGO}
							style={{ width: 80, height: 80 }}
							resizeMode="contain"
						/>
					</View>
					<Text
						style={{
							color: CUC_COLORS.cream,
							fontSize: 32,
							fontWeight: "300",
							fontFamily: "serif",
						}}
					>
						City University Club
					</Text>
					<Text
						style={{
							color: CUC_COLORS.sage,
							fontSize: 16,
							marginTop: 8,
						}}
					>
						Your exclusive members club
					</Text>
				</View>

				{/* Spacer */}
				<View className="flex-1" />

				{/* Sign In Options */}
				<View className="px-6 pb-8 gap-4">
					<Text
						style={{
							color: CUC_COLORS.cream,
							fontSize: 18,
							textAlign: "center",
							marginBottom: 8,
						}}
					>
						Sign in to continue
					</Text>

					{/* Social Login Buttons */}
					<View className="flex-row gap-3">
						{/* Google */}
						<Pressable
							onPress={signInWithGoogle}
							disabled={isLoading}
							style={{
								flex: 1,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								backgroundColor: CUC_COLORS.white,
								paddingVertical: 14,
								borderRadius: 12,
								opacity: isLoading ? 0.7 : 1,
							}}
						>
							{isGoogleLoading ? (
								<ActivityIndicator size="small" color={CUC_COLORS.navy} />
							) : (
								<>
									<Ionicons name="logo-google" size={20} color={CUC_COLORS.navy} />
									<Text
										style={{
											color: CUC_COLORS.navy,
											fontSize: 16,
											fontWeight: "500",
										}}
									>
										Google
									</Text>
									{authClient.isLastUsedLoginMethod("google") && (
										<LastUsedIndicator />
									)}
								</>
							)}
						</Pressable>

						{/* Apple */}
						<Pressable
							onPress={signInWithApple}
							disabled={isLoading}
							style={{
								flex: 1,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								backgroundColor: CUC_COLORS.white,
								paddingVertical: 14,
								borderRadius: 12,
								opacity: isLoading ? 0.7 : 1,
							}}
						>
							{isAppleLoading ? (
								<ActivityIndicator size="small" color={CUC_COLORS.navy} />
							) : (
								<>
									<Ionicons name="logo-apple" size={20} color={CUC_COLORS.navy} />
									<Text
										style={{
											color: CUC_COLORS.navy,
											fontSize: 16,
											fontWeight: "500",
										}}
									>
										Apple
									</Text>
									{authClient.isLastUsedLoginMethod("apple") && (
										<LastUsedIndicator />
									)}
								</>
							)}
						</Pressable>
					</View>

					{/* Email Button */}
					<Link href="/(auth)/email/signin" asChild>
						<Pressable
							style={{
								backgroundColor: CUC_COLORS.navy,
								paddingVertical: 16,
								borderRadius: 12,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								borderWidth: 1,
								borderColor: CUC_COLORS.sage,
							}}
						>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 16,
									fontWeight: "500",
								}}
							>
								Continue with Email
							</Text>
							{authClient.isLastUsedLoginMethod("email") && (
								<LastUsedIndicator />
							)}
						</Pressable>
					</Link>

					{/* Sign Up Link */}
					<View className="flex-row justify-center items-center gap-1 mt-2">
						<Text style={{ color: CUC_COLORS.sage, fontSize: 14 }}>
							Don't have an account?
						</Text>
						<Link href="/(auth)/email/signup" asChild>
							<Pressable>
								<Text
									style={{
										color: CUC_COLORS.cream,
										fontSize: 14,
										fontWeight: "600",
										textDecorationLine: "underline",
									}}
								>
									Sign Up
								</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
}
