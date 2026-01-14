import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import {
	Text,
	View,
	ScrollView,
	Pressable,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
	FadeIn,
	FadeInDown,
	FadeInUp,
	SlideInRight,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	interpolate,
	Extrapolation,
} from "react-native-reanimated";
import { useState, useEffect } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@convoexpo-and-nextjs-web-bun-better-auth/backend/convex/_generated/api";
import { EVENTS, CUC_COLORS, type Event } from "./index";

// Blurhash for event images
const EVENT_BLURHASH = "LKJRyV~qIU-;_3M{ofRj9Fxut7WB";

export default function EventDetail() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();

	// Auth state
	const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
	const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

	const event = EVENTS.find((e) => e.id === id);

	// RSVP form state - pre-filled from user data
	const [formData, setFormData] = useState({
		guests: "1",
		notes: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Animation values
	const scrollY = useSharedValue(0);

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(
			scrollY.value,
			[-100, 0],
			[1.5, 1],
			Extrapolation.CLAMP
		);
		return {
			transform: [{ scale }],
		};
	});

	const handleSubmit = async () => {
		if (!isAuthenticated || !user) {
			return;
		}

		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsSubmitting(false);

		Alert.alert(
			"RSVP Confirmed!",
			`Thank you ${user.name}! We've received your RSVP for ${event?.title}. A confirmation email has been sent to ${user.email}.`,
			[{ text: "OK", onPress: () => router.back() }]
		);
	};

	const handleSignIn = () => {
		router.push("/(auth)/landing");
	};

	if (!event) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: CUC_COLORS.cream,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={{ color: CUC_COLORS.navy, fontSize: 18 }}>
					Event not found
				</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: CUC_COLORS.cream }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					style={{ flex: 1 }}
					onScroll={(e) => {
						scrollY.value = e.nativeEvent.contentOffset.y;
					}}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator={false}
				>
					{/* Hero Image */}
					<Animated.View style={headerAnimatedStyle}>
						<Animated.View entering={FadeIn.duration(400)}>
							<Image
								source={event.image}
								style={{ width: "100%", height: 280 }}
								contentFit="cover"
								placeholder={{ blurhash: EVENT_BLURHASH }}
								transition={300}
							/>
						</Animated.View>
					</Animated.View>

					{/* Back Button - Fixed Position */}
					<Pressable
						onPress={() => router.back()}
						style={{
							position: "absolute",
							top: insets.top + 12,
							left: 16,
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: "rgba(0, 0, 0, 0.4)",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 10,
						}}
					>
						<Ionicons name="arrow-back" size={24} color={CUC_COLORS.cream} />
					</Pressable>

					{/* Content Container */}
					<Animated.View
						entering={FadeInUp.delay(200).springify()}
						style={{
							backgroundColor: CUC_COLORS.cream,
							borderTopLeftRadius: 24,
							borderTopRightRadius: 24,
							marginTop: -24,
							paddingTop: 24,
							paddingHorizontal: 20,
							paddingBottom: 32,
						}}
					>
						{/* Event Title & Badge */}
						<View
							style={{
								flexDirection: "row",
								alignItems: "flex-start",
								marginBottom: 16,
							}}
						>
							<View style={{ flex: 1 }}>
								<Text
									style={{
										color: CUC_COLORS.navy,
										fontSize: 28,
										fontWeight: "300",
										fontFamily: "serif",
										lineHeight: 34,
									}}
								>
									{event.title}
								</Text>
							</View>
							{event.type === "special" && (
								<Animated.View
									entering={SlideInRight.delay(400)}
									style={{
										backgroundColor: CUC_COLORS.sage,
										paddingHorizontal: 12,
										paddingVertical: 6,
										borderRadius: 16,
										marginLeft: 12,
									}}
								>
									<Text
										style={{
											color: CUC_COLORS.navy,
											fontSize: 12,
											fontWeight: "600",
										}}
									>
										Special
									</Text>
								</Animated.View>
							)}
						</View>

						{/* Event Info Grid */}
						<Animated.View
							entering={FadeInDown.delay(300).springify()}
							style={{
								backgroundColor: CUC_COLORS.white,
								borderRadius: 16,
								padding: 16,
								marginBottom: 20,
							}}
						>
							<InfoRow
								icon="calendar-outline"
								label="Date"
								value={event.dateRange}
							/>
							<InfoRow icon="time-outline" label="Time" value={event.time} />
							<InfoRow
								icon="location-outline"
								label="Location"
								value={event.location}
							/>
							<InfoRow
								icon="pricetag-outline"
								label="Price"
								value={`£${event.price} per person`}
								isLast
							/>
						</Animated.View>

						{/* Description */}
						<Animated.View entering={FadeInDown.delay(400).springify()}>
							<Text
								style={{
									color: CUC_COLORS.navy,
									fontSize: 18,
									fontWeight: "600",
									marginBottom: 12,
								}}
							>
								About This Event
							</Text>
							<Text
								style={{
									color: "#444",
									fontSize: 15,
									lineHeight: 24,
									marginBottom: 24,
								}}
							>
								{event.fullDescription}
							</Text>
						</Animated.View>

						{/* RSVP Form */}
						<Animated.View
							entering={FadeInDown.delay(500).springify()}
							style={{
								backgroundColor: CUC_COLORS.navy,
								borderRadius: 20,
								padding: 20,
							}}
						>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 22,
									fontWeight: "300",
									fontFamily: "serif",
									marginBottom: 4,
								}}
							>
								Reserve Your Spot
							</Text>

							{!isAuthenticated ? (
								// Sign in prompt
								<>
									<Text
										style={{
											color: CUC_COLORS.sage,
											fontSize: 14,
											marginBottom: 20,
										}}
									>
										Sign in to reserve your spot at this event
									</Text>
									<Pressable
										onPress={handleSignIn}
										style={{
											backgroundColor: CUC_COLORS.cream,
											borderRadius: 14,
											paddingVertical: 16,
											alignItems: "center",
										}}
									>
										<Text
											style={{
												color: CUC_COLORS.navy,
												fontSize: 17,
												fontWeight: "600",
											}}
										>
											Sign In to RSVP
										</Text>
									</Pressable>
								</>
							) : (
								// RSVP form for authenticated users
								<>
									<Text
										style={{
											color: CUC_COLORS.sage,
											fontSize: 14,
											marginBottom: 20,
										}}
									>
										Complete the form below to RSVP
									</Text>

									{/* User Info Display */}
									<View
										style={{
											backgroundColor: "rgba(255, 255, 255, 0.08)",
											borderRadius: 12,
											padding: 16,
											marginBottom: 16,
										}}
									>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												marginBottom: 8,
											}}
										>
											<Ionicons
												name="person-circle-outline"
												size={20}
												color={CUC_COLORS.sage}
												style={{ marginRight: 10 }}
											/>
											<Text
												style={{
													color: CUC_COLORS.cream,
													fontSize: 16,
													fontWeight: "500",
												}}
											>
												{user?.name || "Loading..."}
											</Text>
										</View>
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Ionicons
												name="mail-outline"
												size={18}
												color={CUC_COLORS.sage}
												style={{ marginRight: 10 }}
											/>
											<Text
												style={{
													color: "rgba(255, 255, 255, 0.7)",
													fontSize: 14,
												}}
											>
												{user?.email || "Loading..."}
											</Text>
										</View>
									</View>

									{/* Number of Guests */}
									<View style={{ marginBottom: 16 }}>
										<Text
											style={{
												color: CUC_COLORS.sage,
												fontSize: 13,
												marginBottom: 8,
												fontWeight: "500",
											}}
										>
											Number of Guests
										</Text>
										<View style={{ flexDirection: "row", gap: 10 }}>
											{["1", "2", "3", "4", "5+"].map((num) => (
												<GuestButton
													key={num}
													value={num}
													selected={formData.guests === num}
													onPress={() =>
														setFormData((prev) => ({ ...prev, guests: num }))
													}
												/>
											))}
										</View>
									</View>

									{/* Special Requirements */}
									<View style={{ marginBottom: 20 }}>
										<Text
											style={{
												color: CUC_COLORS.sage,
												fontSize: 13,
												marginBottom: 8,
												fontWeight: "500",
											}}
										>
											Special Requirements (Optional)
										</Text>
										<TextInput
											style={{
												backgroundColor: "rgba(255, 255, 255, 0.1)",
												borderRadius: 12,
												paddingHorizontal: 16,
												paddingVertical: 14,
												color: CUC_COLORS.cream,
												fontSize: 16,
												minHeight: 80,
												textAlignVertical: "top",
											}}
											placeholder="Dietary requirements, accessibility needs, etc."
											placeholderTextColor="rgba(255, 255, 255, 0.4)"
											value={formData.notes}
											onChangeText={(text) =>
												setFormData((prev) => ({ ...prev, notes: text }))
											}
											multiline
										/>
									</View>

									{/* Submit Button */}
									<SubmitButton
										onPress={handleSubmit}
										isSubmitting={isSubmitting}
										price={event.price}
										guests={formData.guests}
									/>
								</>
							)}
						</Animated.View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

function InfoRow({
	icon,
	label,
	value,
	isLast,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	value: string;
	isLast?: boolean;
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingVertical: 12,
				borderBottomWidth: isLast ? 0 : 1,
				borderBottomColor: "rgba(0, 0, 0, 0.06)",
			}}
		>
			<View
				style={{
					width: 36,
					height: 36,
					borderRadius: 10,
					backgroundColor: `${CUC_COLORS.sage}20`,
					alignItems: "center",
					justifyContent: "center",
					marginRight: 12,
				}}
			>
				<Ionicons name={icon} size={18} color={CUC_COLORS.sage} />
			</View>
			<View style={{ flex: 1 }}>
				<Text style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>
					{label}
				</Text>
				<Text
					style={{
						color: CUC_COLORS.navy,
						fontSize: 15,
						fontWeight: "500",
					}}
				>
					{value}
				</Text>
			</View>
		</View>
	);
}

function GuestButton({
	value,
	selected,
	onPress,
}: {
	value: string;
	selected: boolean;
	onPress: () => void;
}) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<Pressable
			onPress={onPress}
			onPressIn={() => {
				scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 15, stiffness: 400 });
			}}
		>
			<Animated.View
				style={[
					animatedStyle,
					{
						width: 48,
						height: 48,
						borderRadius: 12,
						backgroundColor: selected
							? CUC_COLORS.sage
							: "rgba(255, 255, 255, 0.1)",
						alignItems: "center",
						justifyContent: "center",
					},
				]}
			>
				<Text
					style={{
						color: selected ? CUC_COLORS.navy : CUC_COLORS.cream,
						fontSize: 16,
						fontWeight: selected ? "600" : "400",
					}}
				>
					{value}
				</Text>
			</Animated.View>
		</Pressable>
	);
}

function SubmitButton({
	onPress,
	isSubmitting,
	price,
	guests,
}: {
	onPress: () => void;
	isSubmitting: boolean;
	price: string;
	guests: string;
}) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const guestCount = guests === "5+" ? 5 : parseInt(guests, 10);
	const totalPrice = parseInt(price, 10) * guestCount;

	return (
		<Pressable
			onPress={onPress}
			onPressIn={() => {
				scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 15, stiffness: 400 });
			}}
			disabled={isSubmitting}
		>
			<Animated.View
				style={[
					animatedStyle,
					{
						backgroundColor: CUC_COLORS.cream,
						borderRadius: 14,
						paddingVertical: 16,
						alignItems: "center",
						opacity: isSubmitting ? 0.7 : 1,
					},
				]}
			>
				<Text
					style={{
						color: CUC_COLORS.navy,
						fontSize: 17,
						fontWeight: "600",
					}}
				>
					{isSubmitting ? "Submitting..." : `Confirm RSVP`}
				</Text>
				<Text
					style={{
						color: CUC_COLORS.sage,
						fontSize: 13,
						marginTop: 2,
					}}
				>
					{guestCount} {guestCount === 1 ? "guest" : "guests"} - Total: £{totalPrice}
				</Text>
			</Animated.View>
		</Pressable>
	);
}
