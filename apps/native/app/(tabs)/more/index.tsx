import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
	Text,
	View,
	ScrollView,
	Pressable,
	Linking,
	Image,
	StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

// Local asset for logo
const CUC_LOGO = require("@/assets/images/city_uni_club_white.png");

const MENU_ITEMS = [
	{
		id: "membership",
		icon: "card-outline" as const,
		title: "Membership Card",
		subtitle: "View your membership details",
	},
	{
		id: "dining-room",
		icon: "restaurant-outline" as const,
		title: "Dining Room",
		subtitle: "Information about our facilities",
	},
	{
		id: "reciprocal-clubs",
		icon: "globe-outline" as const,
		title: "Reciprocal Clubs",
		subtitle: "450+ partner clubs worldwide",
	},
	{
		id: "fabric-fund",
		icon: "heart-outline" as const,
		title: "Fabric Fund",
		subtitle: "Support club renovations",
	},
	{
		id: "newsletter",
		icon: "newspaper-outline" as const,
		title: "The Bugle",
		subtitle: "Read our newsletter",
	},
	{
		id: "about",
		icon: "information-circle-outline" as const,
		title: "About the Club",
		subtitle: "Our history since 1895",
	},
	{
		id: "contact",
		icon: "call-outline" as const,
		title: "Contact",
		subtitle: "Get in touch",
	},
];

export default function More() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { isAuthenticated } = useConvexAuth();
	const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

	const handleMenuPress = (id: string) => {
		switch (id) {
			case "membership":
				router.push("/(tabs)/more/membership");
				break;
			case "dining-room":
				router.push("/(tabs)/more/dining-room");
				break;
			case "reciprocal-clubs":
				router.push("/(tabs)/more/reciprocal-clubs");
				break;
			case "fabric-fund":
				router.push("/(tabs)/more/fabric-fund");
				break;
			case "contact":
				router.push("/(tabs)/more/contact");
				break;
			case "about":
				router.push("/(tabs)/more/about");
				break;
			case "newsletter":
				router.push("/(tabs)/more/bugle");
				break;
			default:
				// Navigate to respective screens when implemented
				break;
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
			<StatusBar barStyle="light-content" />
			{/* Header */}
			<View
				style={{
					backgroundColor: CUC_COLORS.navy,
					paddingTop: insets.top + 16,
					paddingBottom: 24,
					paddingHorizontal: 20,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
					{/* Logo */}
					<View
						style={{
							width: 60,
							height: 60,
							borderRadius: 30,
							backgroundColor: CUC_COLORS.sage,
							alignItems: "center",
							justifyContent: "center",
							overflow: "hidden",
						}}
					>
						<Image
							source={CUC_LOGO}
							style={{ width: 52, height: 52 }}
							resizeMode="contain"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								color: CUC_COLORS.cream,
								fontSize: 22,
								fontWeight: "300",
								fontFamily: "serif",
							}}
						>
							City University Club
						</Text>
						{isAuthenticated && user?.name && (
							<Text
								style={{
									color: CUC_COLORS.sage,
									fontSize: 14,
									marginTop: 2,
								}}
							>
								{user.name}
							</Text>
						)}
					</View>
				</View>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
			>
				{/* Quick Contact */}
				<View
					style={{
						backgroundColor: CUC_COLORS.white,
						borderRadius: 12,
						padding: 16,
						marginBottom: 20,
						flexDirection: "row",
						alignItems: "center",
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.08,
						shadowRadius: 4,
						elevation: 2,
					}}
				>
					<View style={{ flex: 1 }}>
						<Text
							style={{ color: CUC_COLORS.navy, fontSize: 15, fontWeight: "600" }}
						>
							42 Crutched Friars
						</Text>
						<Text style={{ color: "#666", fontSize: 14, marginTop: 2 }}>
							London EC3N 2AP
						</Text>
						<Text
							style={{ color: CUC_COLORS.sage, fontSize: 14, marginTop: 4 }}
						>
							020 7167 6682
						</Text>
					</View>
					<Pressable
						onPress={() => Linking.openURL("tel:02071676682")}
						style={{
							width: 48,
							height: 48,
							borderRadius: 24,
							backgroundColor: CUC_COLORS.sage,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons name="call" size={22} color={CUC_COLORS.navy} />
					</Pressable>
				</View>

				{/* Menu Items */}
				{MENU_ITEMS.map((item) => (
					<Pressable
						key={item.id}
						onPress={() => handleMenuPress(item.id)}
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 16,
							marginBottom: 12,
							flexDirection: "row",
							alignItems: "center",
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.05,
							shadowRadius: 2,
							elevation: 1,
						}}
					>
						<View
							style={{
								width: 44,
								height: 44,
								borderRadius: 22,
								backgroundColor: `${CUC_COLORS.navy}10`,
								alignItems: "center",
								justifyContent: "center",
								marginRight: 14,
							}}
						>
							<Ionicons name={item.icon} size={22} color={CUC_COLORS.navy} />
						</View>
						<View style={{ flex: 1 }}>
							<Text
								style={{ color: CUC_COLORS.navy, fontSize: 16, fontWeight: "500" }}
							>
								{item.title}
							</Text>
							<Text style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
								{item.subtitle}
							</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color="#ccc" />
					</Pressable>
				))}

				{/* Opening Hours */}
				<View
					style={{
						backgroundColor: CUC_COLORS.navy,
						borderRadius: 12,
						padding: 20,
						marginTop: 8,
						marginBottom: 16,
					}}
				>
					<Text
						style={{
							color: CUC_COLORS.cream,
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 12,
						}}
					>
						Opening Hours
					</Text>
					<Text style={{ color: CUC_COLORS.cream, fontSize: 14, lineHeight: 22 }}>
						Monday to Friday{"\n"}
						9:00 AM - 5:00 PM
					</Text>
					<Text
						style={{ color: CUC_COLORS.sage, fontSize: 13, marginTop: 8 }}
					>
						Lunch: 12:00 PM - Last orders 2:30 PM
					</Text>
				</View>

				{/* Sign Out Button */}
				{isAuthenticated && (
					<Pressable
						onPress={() => authClient.signOut()}
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 16,
							alignItems: "center",
							borderWidth: 1,
							borderColor: "#e5e5e5",
						}}
					>
						<Text style={{ color: "#dc2626", fontSize: 15, fontWeight: "500" }}>
							Sign Out
						</Text>
					</Pressable>
				)}

				{/* Website Link */}
				<Pressable
					onPress={() =>
						Linking.openURL("https://www.cityuniversityclub.co.uk/")
					}
					style={{
						marginTop: 16,
						paddingVertical: 16,
						alignItems: "center",
					}}
				>
					<Text style={{ color: CUC_COLORS.navy, fontSize: 14 }}>
						Visit our website →
					</Text>
				</Pressable>
			</ScrollView>
		</View>
	);
}
