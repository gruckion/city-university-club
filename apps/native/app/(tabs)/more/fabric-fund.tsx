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

// Image from the Fabric Fund page
const FABRIC_FUND_IMAGE =
	"https://static.wixstatic.com/media/5e0aaa_a4f22f2a2cc743e5bb27e7cce56a0327~mv2.jpg/v1/fill/w_600,h_800,al_c,q_85,enc_avif,quality_auto/5e0aaa_a4f22f2a2cc743e5bb27e7cce56a0327~mv2.jpg";

export default function FabricFund() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const handleDonate = () => {
		Linking.openURL("mailto:secretary@cityuniversityclub.co.uk?subject=Fabric%20Fund%20Donation");
	};

	const handleLearnMore = () => {
		Linking.openURL("https://www.cityuniversityclub.co.uk/about-2");
	};

	const handleCall = () => {
		Linking.openURL("tel:02078636681");
	};

	return (
		<View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
			{/* Header */}
			<View
				style={{
					backgroundColor: CUC_COLORS.navy,
					paddingTop: insets.top + 8,
					paddingBottom: 16,
					paddingHorizontal: 16,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Pressable
						onPress={() => router.back()}
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: `${CUC_COLORS.white}15`,
							alignItems: "center",
							justifyContent: "center",
							marginRight: 12,
						}}
					>
						<Ionicons name="arrow-back" size={22} color={CUC_COLORS.cream} />
					</Pressable>
					<Text
						style={{
							color: CUC_COLORS.cream,
							fontSize: 20,
							fontWeight: "300",
							fontFamily: "serif",
						}}
					>
						Fabric Fund
					</Text>
				</View>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
			>
				{/* Hero Image */}
				<Image
					source={{ uri: FABRIC_FUND_IMAGE }}
					style={{
						width: "100%",
						height: 240,
					}}
					contentFit="cover"
					cachePolicy="memory-disk"
				/>

				{/* Main Content */}
				<View style={{ padding: 16 }}>
					{/* Title Card */}
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
								fontSize: 24,
								fontWeight: "300",
								fontFamily: "serif",
								marginBottom: 8,
							}}
						>
							The City University Club Fabric Fund
						</Text>
						<Text
							style={{
								color: CUC_COLORS.sage,
								fontSize: 16,
								fontStyle: "italic",
							}}
						>
							Looking forward to the next 125 years
						</Text>
					</View>

					{/* About Section */}
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
								fontSize: 16,
								fontWeight: "600",
								marginBottom: 12,
							}}
						>
							About the Fund
						</Text>
						<Text
							style={{
								color: "#444",
								fontSize: 15,
								lineHeight: 24,
								marginBottom: 12,
							}}
						>
							In January 2018, the City University Club moved into our new home at 42 Crutched Friars, leaving behind our base of over 120 years at 50 Cornhill.
						</Text>
						<Text
							style={{
								color: "#444",
								fontSize: 15,
								lineHeight: 24,
								marginBottom: 12,
							}}
						>
							Since we moved in, the Club has established itself in the local area and the Committee has resolved to refurbish and completely overhaul the interior of the facilities.
						</Text>
						<Text
							style={{
								color: "#444",
								fontSize: 15,
								lineHeight: 24,
							}}
						>
							The Committee has established the 'Fabric Fund Committee' to lead on fundraising and provide the Club with the resources necessary to complete the project and ensure we have a club ready for the next 125 years.
						</Text>
					</View>

					{/* Honours Board Section */}
					<View
						style={{
							backgroundColor: CUC_COLORS.navy,
							borderRadius: 12,
							padding: 20,
							marginBottom: 16,
						}}
					>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
							<Ionicons name="ribbon-outline" size={24} color={CUC_COLORS.sage} />
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 18,
									fontWeight: "600",
									marginLeft: 10,
								}}
							>
								Members Honour Board
							</Text>
						</View>
						<Text
							style={{
								color: CUC_COLORS.cream,
								fontSize: 15,
								lineHeight: 24,
								marginBottom: 16,
							}}
						>
							Join the Fabric Fund today and make your name known! We are inviting members to donate to the Club and, in return, have their name featured on a new 'Members Honour Board'.
						</Text>
						<View
							style={{
								backgroundColor: `${CUC_COLORS.white}15`,
								borderRadius: 8,
								padding: 16,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: CUC_COLORS.sage,
									fontSize: 14,
									fontWeight: "500",
									marginBottom: 4,
								}}
							>
								Contribution Amount
							</Text>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 32,
									fontWeight: "300",
									fontFamily: "serif",
								}}
							>
								£125.00
							</Text>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 13,
									marginTop: 4,
									opacity: 0.8,
								}}
							>
								Your name and year of membership displayed
							</Text>
						</View>
					</View>

					{/* How to Contribute */}
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
								fontSize: 16,
								fontWeight: "600",
								marginBottom: 16,
							}}
						>
							How to Support Your Club
						</Text>

						<ContributionItem
							icon="heart-outline"
							title="Join the Honour Board"
							description="Donate £125 to have your name displayed"
						/>
						<ContributionItem
							icon="calendar-outline"
							title="Attend Club Events"
							description="Support fundraising celebrations"
						/>
						<ContributionItem
							icon="megaphone-outline"
							title="Spread the Word"
							description="Encourage fellow members to contribute"
							isLast
						/>
					</View>

					{/* Contact Card */}
					<View
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 20,
							marginBottom: 20,
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
								fontSize: 16,
								fontWeight: "600",
								marginBottom: 12,
							}}
						>
							Get in Touch
						</Text>
						<Text
							style={{
								color: "#666",
								fontSize: 14,
								lineHeight: 22,
								marginBottom: 16,
							}}
						>
							To make a donation or learn more about the Fabric Fund, please contact the Club Secretary.
						</Text>

						<Pressable
							onPress={handleCall}
							style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
						>
							<Ionicons name="call-outline" size={18} color={CUC_COLORS.sage} />
							<Text style={{ color: CUC_COLORS.navy, fontSize: 14, marginLeft: 10 }}>
								020 7863 6681
							</Text>
						</Pressable>

						<Pressable
							onPress={handleDonate}
							style={{ flexDirection: "row", alignItems: "center" }}
						>
							<Ionicons name="mail-outline" size={18} color={CUC_COLORS.sage} />
							<Text style={{ color: CUC_COLORS.navy, fontSize: 14, marginLeft: 10 }}>
								secretary@cityuniversityclub.co.uk
							</Text>
						</Pressable>
					</View>

					{/* Action Buttons */}
					<View style={{ gap: 12 }}>
						<Pressable
							onPress={handleDonate}
							style={({ pressed }) => ({
								backgroundColor: pressed ? `${CUC_COLORS.sage}dd` : CUC_COLORS.sage,
								borderRadius: 12,
								padding: 18,
								alignItems: "center",
								flexDirection: "row",
								justifyContent: "center",
							})}
						>
							<Ionicons name="heart" size={22} color={CUC_COLORS.navy} />
							<Text
								style={{
									color: CUC_COLORS.navy,
									fontSize: 16,
									fontWeight: "600",
									marginLeft: 10,
								}}
							>
								Enquire About Donating
							</Text>
						</Pressable>

						<Pressable
							onPress={handleLearnMore}
							style={({ pressed }) => ({
								backgroundColor: pressed ? `${CUC_COLORS.navy}dd` : CUC_COLORS.navy,
								borderRadius: 12,
								padding: 18,
								alignItems: "center",
								flexDirection: "row",
								justifyContent: "center",
							})}
						>
							<Ionicons name="open-outline" size={22} color={CUC_COLORS.cream} />
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 16,
									fontWeight: "600",
									marginLeft: 10,
								}}
							>
								Visit Website
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

function ContributionItem({
	icon,
	title,
	description,
	isLast = false,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	description: string;
	isLast?: boolean;
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingVertical: 12,
				borderBottomWidth: isLast ? 0 : 1,
				borderBottomColor: "#f0f0f0",
			}}
		>
			<View
				style={{
					width: 40,
					height: 40,
					borderRadius: 20,
					backgroundColor: `${CUC_COLORS.sage}20`,
					alignItems: "center",
					justifyContent: "center",
					marginRight: 14,
				}}
			>
				<Ionicons name={icon} size={20} color={CUC_COLORS.sage} />
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
