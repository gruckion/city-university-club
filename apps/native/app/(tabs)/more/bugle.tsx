import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View, ScrollView, Pressable, Linking, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { WebView } from "react-native-webview";
import { useCallback, useRef, useState } from "react";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

// The Bugle PDF URL - using Google Docs viewer for reliable PDF rendering
const BUGLE_PDF_URL =
	"https://www.cityuniversityclub.co.uk/_files/ugd/da00a6_ff60a29890864b51be0e5aa177ba1d6a.pdf";
const PDF_VIEWER_URL = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(BUGLE_PDF_URL)}`;

// Past issues (for display purposes)
const PAST_ISSUES = [
	{ issue: "Autumn 2025", current: true },
	{ issue: "Summer 2025", current: false },
	{ issue: "Spring 2025", current: false },
	{ issue: "Winter 2024", current: false },
];

export default function Bugle() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [isLoading, setIsLoading] = useState(true);

	const handleOpenPDF = useCallback(() => {
		setIsLoading(true);
		bottomSheetRef.current?.expand();
	}, []);

	const handleCloseSheet = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.5}
			/>
		),
		[]
	);

	return (
		<View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
			{/* Header */}
			<View
				style={{
					backgroundColor: CUC_COLORS.navy,
					paddingTop: insets.top + 8,
					paddingBottom: 20,
					paddingHorizontal: 16,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
					<Pressable
						onPress={() => router.back()}
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: "rgba(255, 255, 255, 0.15)",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons name="arrow-back" size={24} color={CUC_COLORS.cream} />
					</Pressable>
					<Text
						style={{
							color: CUC_COLORS.cream,
							fontSize: 24,
							fontWeight: "300",
							fontFamily: "serif",
						}}
					>
						The Bugle
					</Text>
				</View>
			</View>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
			>
				{/* Hero Section with Icon */}
				<View
					style={{
						backgroundColor: CUC_COLORS.white,
						borderRadius: 16,
						padding: 24,
						alignItems: "center",
						marginBottom: 20,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.08,
						shadowRadius: 4,
						elevation: 2,
					}}
				>
					{/* Newsletter Icon */}
					<View
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							backgroundColor: `${CUC_COLORS.navy}10`,
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 20,
						}}
					>
						<View
							style={{
								width: 70,
								height: 70,
								borderRadius: 35,
								backgroundColor: `${CUC_COLORS.navy}15`,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons name="newspaper" size={36} color={CUC_COLORS.navy} />
						</View>
					</View>

					<Text
						style={{
							color: CUC_COLORS.navy,
							fontSize: 22,
							fontWeight: "300",
							fontFamily: "serif",
							textAlign: "center",
							marginBottom: 8,
						}}
					>
						Club Newsletter
					</Text>

					<Text
						style={{
							color: "#666",
							fontSize: 15,
							textAlign: "center",
							lineHeight: 22,
							marginBottom: 20,
							paddingHorizontal: 8,
						}}
					>
						Stay informed with the latest news, events, and updates from the
						City University Club. Published quarterly for our members.
					</Text>

					{/* Current Issue Badge */}
					<View
						style={{
							backgroundColor: `${CUC_COLORS.sage}20`,
							paddingHorizontal: 16,
							paddingVertical: 8,
							borderRadius: 20,
							marginBottom: 20,
						}}
					>
						<Text
							style={{
								color: CUC_COLORS.navy,
								fontSize: 14,
								fontWeight: "600",
							}}
						>
							Autumn 2025 Issue Now Available
						</Text>
					</View>

					{/* Read Latest Issue Button */}
					<Pressable
						onPress={handleOpenPDF}
						style={({ pressed }) => ({
							backgroundColor: pressed ? `${CUC_COLORS.navy}dd` : CUC_COLORS.navy,
							borderRadius: 12,
							paddingVertical: 16,
							paddingHorizontal: 32,
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
							width: "100%",
							justifyContent: "center",
						})}
					>
						<Ionicons name="document-text" size={22} color={CUC_COLORS.cream} />
						<Text
							style={{
								color: CUC_COLORS.cream,
								fontSize: 16,
								fontWeight: "600",
							}}
						>
							Read Latest Issue
						</Text>
					</Pressable>
				</View>

				{/* What's Inside Section */}
				<View
					style={{
						backgroundColor: CUC_COLORS.white,
						borderRadius: 12,
						padding: 20,
						marginBottom: 20,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.05,
						shadowRadius: 2,
						elevation: 1,
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
						What's Inside The Bugle
					</Text>

					<ContentItem
						icon="calendar-outline"
						title="Upcoming Events"
						description="Details on club gatherings and special occasions"
					/>
					<ContentItem
						icon="people-outline"
						title="Member News"
						description="Updates and achievements from our community"
					/>
					<ContentItem
						icon="restaurant-outline"
						title="Dining Updates"
						description="New menus and seasonal offerings"
					/>
					<ContentItem
						icon="construct-outline"
						title="Club Improvements"
						description="Fabric Fund progress and renovations"
						isLast
					/>
				</View>

				{/* Past Issues */}
				<View
					style={{
						backgroundColor: CUC_COLORS.white,
						borderRadius: 12,
						padding: 20,
						marginBottom: 20,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.05,
						shadowRadius: 2,
						elevation: 1,
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
						Recent Issues
					</Text>

					{PAST_ISSUES.map((item, index) => (
						<View
							key={item.issue}
							style={{
								flexDirection: "row",
								alignItems: "center",
								paddingVertical: 12,
								borderBottomWidth: index === PAST_ISSUES.length - 1 ? 0 : 1,
								borderBottomColor: "#f0f0f0",
							}}
						>
							<View
								style={{
									width: 36,
									height: 36,
									borderRadius: 18,
									backgroundColor: item.current
										? `${CUC_COLORS.sage}20`
										: `${CUC_COLORS.navy}08`,
									alignItems: "center",
									justifyContent: "center",
									marginRight: 12,
								}}
							>
								<Ionicons
									name="document-text-outline"
									size={18}
									color={item.current ? CUC_COLORS.sage : "#999"}
								/>
							</View>
							<Text
								style={{
									flex: 1,
									color: CUC_COLORS.navy,
									fontSize: 15,
									fontWeight: item.current ? "500" : "400",
								}}
							>
								{item.issue}
							</Text>
							{item.current && (
								<View
									style={{
										backgroundColor: CUC_COLORS.sage,
										paddingHorizontal: 10,
										paddingVertical: 4,
										borderRadius: 12,
									}}
								>
									<Text
										style={{
											color: CUC_COLORS.white,
											fontSize: 12,
											fontWeight: "600",
										}}
									>
										Current
									</Text>
								</View>
							)}
						</View>
					))}
				</View>

				{/* Publication Info */}
				<View
					style={{
						backgroundColor: CUC_COLORS.navy,
						borderRadius: 12,
						padding: 20,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<View
						style={{
							width: 48,
							height: 48,
							borderRadius: 24,
							backgroundColor: "rgba(255, 255, 255, 0.15)",
							alignItems: "center",
							justifyContent: "center",
							marginRight: 16,
						}}
					>
						<Ionicons name="time-outline" size={24} color={CUC_COLORS.cream} />
					</View>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								color: CUC_COLORS.cream,
								fontSize: 15,
								fontWeight: "600",
								marginBottom: 4,
							}}
						>
							Published Quarterly
						</Text>
						<Text
							style={{
								color: CUC_COLORS.sage,
								fontSize: 13,
							}}
						>
							New issues released in Spring, Summer, Autumn, and Winter
						</Text>
					</View>
				</View>

				{/* Website Link */}
				<Pressable
					onPress={() =>
						Linking.openURL("https://www.cityuniversityclub.co.uk/about-3")
					}
					style={{
						marginTop: 20,
						paddingVertical: 16,
						alignItems: "center",
					}}
				>
					<Text style={{ color: CUC_COLORS.navy, fontSize: 14 }}>
						View on website
					</Text>
				</Pressable>
			</ScrollView>

			{/* PDF Viewer Bottom Sheet */}
			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={["95%"]}
				enablePanDownToClose
				enableContentPanningGesture={false}
				backdropComponent={renderBackdrop}
				handleIndicatorStyle={{ backgroundColor: CUC_COLORS.sage }}
				backgroundStyle={{ backgroundColor: CUC_COLORS.white }}
			>
				<BottomSheetView style={{ flex: 1 }}>
					{/* Sheet Header */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							paddingHorizontal: 16,
							paddingVertical: 12,
							borderBottomWidth: 1,
							borderBottomColor: "#f0f0f0",
						}}
					>
						<Text
							style={{
								color: CUC_COLORS.navy,
								fontSize: 18,
								fontWeight: "600",
							}}
						>
							The Bugle - Autumn 2025
						</Text>
						<Pressable
							onPress={handleCloseSheet}
							style={{
								width: 32,
								height: 32,
								borderRadius: 16,
								backgroundColor: `${CUC_COLORS.navy}10`,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons name="close" size={20} color={CUC_COLORS.navy} />
						</Pressable>
					</View>

					{/* PDF WebView */}
					<View style={{ flex: 1 }}>
						{isLoading && (
							<View
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: CUC_COLORS.white,
									zIndex: 1,
								}}
							>
								<ActivityIndicator size="large" color={CUC_COLORS.navy} />
								<Text
									style={{
										marginTop: 12,
										color: CUC_COLORS.navy,
										fontSize: 14,
									}}
								>
									Loading newsletter...
								</Text>
							</View>
						)}
						<WebView
							source={{ uri: PDF_VIEWER_URL }}
							style={{ flex: 1 }}
							onLoadEnd={() => setIsLoading(false)}
							onError={() => setIsLoading(false)}
							nestedScrollEnabled
							javaScriptEnabled
							domStorageEnabled
							startInLoadingState={false}
							originWhitelist={["*"]}
						/>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</View>
	);
}

function ContentItem({
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
				alignItems: "flex-start",
				paddingVertical: 12,
				borderBottomWidth: isLast ? 0 : 1,
				borderBottomColor: "#f0f0f0",
			}}
		>
			<View
				style={{
					width: 36,
					height: 36,
					borderRadius: 18,
					backgroundColor: `${CUC_COLORS.sage}20`,
					alignItems: "center",
					justifyContent: "center",
					marginRight: 12,
				}}
			>
				<Ionicons name={icon} size={18} color={CUC_COLORS.sage} />
			</View>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						color: CUC_COLORS.navy,
						fontSize: 15,
						fontWeight: "500",
						marginBottom: 2,
					}}
				>
					{title}
				</Text>
				<Text style={{ color: "#888", fontSize: 13 }}>{description}</Text>
			</View>
		</View>
	);
}
