import { Ionicons } from "@expo/vector-icons";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, View, ScrollView, Image, Pressable } from "react-native";
import { Container } from "@/components/container";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

// Sample events data based on the website sitemap
const EVENTS = [
	{
		id: "christmas-lunch-2025",
		title: "Christmas Lunch",
		description: "Enjoy our special festive menu in the Main Dining Room",
		dateRange: "1st - 23rd December",
		type: "seasonal",
		image:
			"https://static.wixstatic.com/media/11062b_7daf34b38d874071a1001caa9dde798f~mv2_d_5616_3744_s_4_2.jpg/v1/fill/w_400,h_300,al_c,q_80/11062b_7daf34b38d874071a1001caa9dde798f~mv2_d_5616_3744_s_4_2.webp",
	},
	{
		id: "christmas-dinner-2025",
		title: "Christmas Dinners",
		description: "An evening of festive celebration with special menu",
		dateRange: "December 18th",
		type: "special",
		image:
			"https://static.wixstatic.com/media/da00a6_3329029cfbc048ab9d8b8fdd4e5e3563~mv2.jpg/v1/fill/w_400,h_300,al_c,q_80/da00a6_3329029cfbc048ab9d8b8fdd4e5e3563~mv2.webp",
	},
	{
		id: "wine-tasting",
		title: "Wine Tasting Evening",
		description: "Sample fine wines from our cellar with expert guidance",
		dateRange: "Monthly",
		type: "recurring",
		image:
			"https://static.wixstatic.com/media/da00a6_52bcb81f629b40c383a2f1a09aa1d97e~mv2.jpg/v1/fill/w_400,h_300,al_c,q_80/da00a6_52bcb81f629b40c383a2f1a09aa1d97e~mv2.webp",
	},
	{
		id: "business-lunch",
		title: "Business Networking Lunch",
		description: "Connect with fellow members over a delightful lunch",
		dateRange: "Last Friday of month",
		type: "recurring",
		image:
			"https://static.wixstatic.com/media/5e0aaa_89c287ebeaca49b398ec7c86b8397a0f~mv2.jpg/v1/fill/w_400,h_300,al_c,q_80/5e0aaa_89c287ebeaca49b398ec7c86b8397a0f~mv2.webp",
	},
];

export default function Events() {
	const insets = useSafeAreaInsets();

	return (
		<View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
			{/* Header */}
			<View
				style={{
					backgroundColor: CUC_COLORS.navy,
					paddingTop: insets.top + 16,
					paddingBottom: 20,
					paddingHorizontal: 20,
				}}
			>
				<Text
					style={{
						color: CUC_COLORS.cream,
						fontSize: 28,
						fontWeight: "300",
						fontFamily: "serif",
					}}
				>
					Events
				</Text>
				<Text
					style={{
						color: CUC_COLORS.sage,
						fontSize: 14,
						marginTop: 4,
					}}
				>
					Upcoming events at City University Club
				</Text>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
			>
				{EVENTS.map((event, index) => (
					<EventCard key={event.id} event={event} featured={index === 0} />
				))}

				{/* View Website Link */}
				<Pressable
					style={{
						marginTop: 16,
						paddingVertical: 16,
						alignItems: "center",
					}}
				>
					<Text style={{ color: CUC_COLORS.navy, fontSize: 14 }}>
						View all events on our website →
					</Text>
				</Pressable>
			</ScrollView>
		</View>
	);
}

function EventCard({
	event,
	featured,
}: {
	event: (typeof EVENTS)[0];
	featured?: boolean;
}) {
	return (
		<Pressable
			style={{
				backgroundColor: featured ? CUC_COLORS.navy : CUC_COLORS.white,
				borderRadius: 12,
				marginBottom: 16,
				overflow: "hidden",
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
				elevation: 3,
			}}
		>
			{/* Event Image */}
			<Image
				source={{ uri: event.image }}
				style={{ width: "100%", height: 160 }}
				resizeMode="cover"
			/>

			{/* Event Details */}
			<View style={{ padding: 16 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								color: featured ? CUC_COLORS.cream : CUC_COLORS.navy,
								fontSize: 18,
								fontWeight: "600",
								marginBottom: 4,
							}}
						>
							{event.title}
						</Text>
						<Text
							style={{
								color: featured ? CUC_COLORS.sage : "#666",
								fontSize: 14,
								lineHeight: 20,
							}}
						>
							{event.description}
						</Text>
					</View>
					{featured && (
						<View
							style={{
								backgroundColor: CUC_COLORS.sage,
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 12,
								marginLeft: 8,
							}}
						>
							<Text
								style={{
									color: CUC_COLORS.navy,
									fontSize: 11,
									fontWeight: "600",
								}}
							>
								Featured
							</Text>
						</View>
					)}
				</View>

				{/* Date and RSVP */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: 16,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
						<Ionicons
							name="calendar-outline"
							size={16}
							color={featured ? CUC_COLORS.sage : "#666"}
						/>
						<Text
							style={{
								color: featured ? CUC_COLORS.sage : "#666",
								fontSize: 13,
							}}
						>
							{event.dateRange}
						</Text>
					</View>

					<Pressable
						style={{
							backgroundColor: featured ? CUC_COLORS.cream : CUC_COLORS.navy,
							paddingHorizontal: 16,
							paddingVertical: 8,
							borderRadius: 6,
						}}
					>
						<Text
							style={{
								color: featured ? CUC_COLORS.navy : CUC_COLORS.cream,
								fontSize: 13,
								fontWeight: "500",
							}}
						>
							RSVP
						</Text>
					</Pressable>
				</View>
			</View>
		</Pressable>
	);
}
