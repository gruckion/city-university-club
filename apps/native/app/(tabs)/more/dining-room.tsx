import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Text, View, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

// Dining room image from the CUC website
const DINING_ROOM_IMAGE =
	"https://static.wixstatic.com/media/5e0aaa_89c287ebeaca49b398ec7c86b8397a0f~mv2.jpg/v1/fill/w_800,h_600,al_c,q_85/5e0aaa_89c287ebeaca49b398ec7c86b8397a0f~mv2.webp";

export default function DiningRoom() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const handleCall = () => {
		Linking.openURL("tel:02071676682");
	};

	const handleEmail = () => {
		Linking.openURL("mailto:secretary@cityuniversityclub.co.uk");
	};

	return (
		<View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
			{/* Header */}
			<View
				style={{
					backgroundColor: CUC_COLORS.navy,
					paddingTop: insets.top + 8,
					paddingBottom: 20,
					paddingHorizontal: 20,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
					<Pressable
						onPress={() => router.back()}
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: `${CUC_COLORS.white}15`,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons name="arrow-back" size={22} color={CUC_COLORS.cream} />
					</Pressable>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								color: CUC_COLORS.cream,
								fontSize: 24,
								fontWeight: "300",
								fontFamily: "serif",
							}}
						>
							Dining Room
						</Text>
						<Text
							style={{
								color: CUC_COLORS.sage,
								fontSize: 13,
								marginTop: 2,
							}}
						>
							A quiet haven in the heart of the City
						</Text>
					</View>
				</View>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 32 }}
			>
				{/* Hero Image */}
				<Image
					source={{ uri: DINING_ROOM_IMAGE }}
					style={{ width: "100%", height: 220 }}
					contentFit="cover"
					cachePolicy="memory-disk"
				/>

				{/* Description Section */}
				<View style={{ padding: 16 }}>
					<View
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 20,
							marginBottom: 16,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.08,
							shadowRadius: 4,
							elevation: 2,
						}}
					>
						<Text
							style={{
								color: CUC_COLORS.navy,
								fontSize: 18,
								fontWeight: "600",
								marginBottom: 12,
							}}
						>
							About Our Dining Rooms
						</Text>
						<Text
							style={{
								color: "#444",
								fontSize: 15,
								lineHeight: 24,
							}}
						>
							The dining rooms are a quiet haven in the heart of the City of
							London for members and their guests, offering excellent food and
							superb service.
						</Text>
						<Text
							style={{
								color: "#444",
								fontSize: 15,
								lineHeight: 24,
								marginTop: 12,
							}}
						>
							The welfare and happiness of our members and their guests is of
							paramount importance, so we will always try to cater for
							individual needs wherever possible.
						</Text>
					</View>

					{/* Opening Hours */}
					<View
						style={{
							backgroundColor: CUC_COLORS.navy,
							borderRadius: 12,
							padding: 20,
							marginBottom: 16,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 10,
								marginBottom: 16,
							}}
						>
							<Ionicons name="time-outline" size={22} color={CUC_COLORS.sage} />
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 18,
									fontWeight: "600",
								}}
							>
								Opening Hours
							</Text>
						</View>

						<View style={{ gap: 12 }}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Text style={{ color: CUC_COLORS.cream, fontSize: 15 }}>
									Lunch Service
								</Text>
								<Text style={{ color: CUC_COLORS.sage, fontSize: 15 }}>
									12:00 noon onwards
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Text style={{ color: CUC_COLORS.cream, fontSize: 15 }}>
									Last Orders
								</Text>
								<Text style={{ color: CUC_COLORS.sage, fontSize: 15 }}>
									2:30 PM
								</Text>
							</View>
							<View
								style={{
									height: 1,
									backgroundColor: `${CUC_COLORS.cream}20`,
									marginVertical: 4,
								}}
							/>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 13,
									opacity: 0.8,
									fontStyle: "italic",
								}}
							>
								Later orders available by prior arrangement with the Secretary
							</Text>
						</View>
					</View>

					{/* Services */}
					<View
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 20,
							marginBottom: 16,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.08,
							shadowRadius: 4,
							elevation: 2,
						}}
					>
						<Text
							style={{
								color: CUC_COLORS.navy,
								fontSize: 18,
								fontWeight: "600",
								marginBottom: 16,
							}}
						>
							Our Services
						</Text>

						<View style={{ gap: 16 }}>
							<ServiceItem
								icon="cafe-outline"
								title="Breakfast"
								description="Start your day at the Club"
							/>
							<ServiceItem
								icon="restaurant-outline"
								title="Lunch"
								description="Daily lunch service with seasonal menus"
							/>
							<ServiceItem
								icon="wine-outline"
								title="Bar"
								description="Pre-lunch and post-lunch drinks available"
							/>
							<ServiceItem
								icon="moon-outline"
								title="Private Dinners"
								description="Evening dining for special occasions"
							/>
							<ServiceItem
								icon="business-outline"
								title="Private Rooms"
								description="Available 7 days a week for breakfast, lunch and dinner"
							/>
							<ServiceItem
								icon="people-outline"
								title="Meeting Rooms"
								description="Professional spaces for private hire"
							/>
						</View>
					</View>

					{/* Booking Information */}
					<View
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 20,
							marginBottom: 16,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.08,
							shadowRadius: 4,
							elevation: 2,
						}}
					>
						<Text
							style={{
								color: CUC_COLORS.navy,
								fontSize: 18,
								fontWeight: "600",
								marginBottom: 12,
							}}
						>
							Make a Reservation
						</Text>
						<Text
							style={{
								color: "#444",
								fontSize: 15,
								lineHeight: 24,
								marginBottom: 16,
							}}
						>
							Contact the Secretary to make a reservation or enquire about
							private dining and meeting room hire.
						</Text>

						<View style={{ flexDirection: "row", gap: 12 }}>
							<Pressable
								onPress={handleCall}
								style={{
									flex: 1,
									backgroundColor: CUC_COLORS.sage,
									borderRadius: 8,
									padding: 14,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									gap: 8,
								}}
							>
								<Ionicons name="call" size={18} color={CUC_COLORS.navy} />
								<Text
									style={{
										color: CUC_COLORS.navy,
										fontSize: 14,
										fontWeight: "600",
									}}
								>
									Call
								</Text>
							</Pressable>
							<Pressable
								onPress={handleEmail}
								style={{
									flex: 1,
									backgroundColor: CUC_COLORS.navy,
									borderRadius: 8,
									padding: 14,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									gap: 8,
								}}
							>
								<Ionicons name="mail" size={18} color={CUC_COLORS.cream} />
								<Text
									style={{
										color: CUC_COLORS.cream,
										fontSize: 14,
										fontWeight: "600",
									}}
								>
									Email
								</Text>
							</Pressable>
						</View>
					</View>

					{/* Location Note */}
					<View
						style={{
							backgroundColor: `${CUC_COLORS.sage}15`,
							borderRadius: 12,
							padding: 16,
							flexDirection: "row",
							alignItems: "center",
							gap: 12,
						}}
					>
						<Ionicons name="location" size={22} color={CUC_COLORS.sage} />
						<View style={{ flex: 1 }}>
							<Text
								style={{
									color: CUC_COLORS.navy,
									fontSize: 14,
									fontWeight: "500",
								}}
							>
								42 Crutched Friars
							</Text>
							<Text
								style={{
									color: "#666",
									fontSize: 13,
									marginTop: 2,
								}}
							>
								London EC3N 2AP
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

function ServiceItem({
	icon,
	title,
	description,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	description: string;
}) {
	return (
		<View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
			<View
				style={{
					width: 40,
					height: 40,
					borderRadius: 20,
					backgroundColor: `${CUC_COLORS.navy}10`,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Ionicons name={icon} size={20} color={CUC_COLORS.navy} />
			</View>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						color: CUC_COLORS.navy,
						fontSize: 15,
						fontWeight: "500",
					}}
				>
					{title}
				</Text>
				<Text
					style={{
						color: "#666",
						fontSize: 13,
						marginTop: 2,
					}}
				>
					{description}
				</Text>
			</View>
		</View>
	);
}
