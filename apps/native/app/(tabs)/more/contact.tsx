import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Text,
	View,
	ScrollView,
	Pressable,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Alert,
	Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

interface FormData {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

export default function Contact() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	// Get session - authenticated users don't need to enter name/email/phone
	const { data: session } = authClient.useSession();
	const isAuthenticated = !!session?.user;

	// Form state - guest fields only used when NOT authenticated
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateField = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Derive final values - session takes precedence for authenticated users
	const getName = () => (isAuthenticated ? session.user.name || "" : formData.name);
	const getEmail = () => (isAuthenticated ? session.user.email || "" : formData.email);
	const getPhone = () => (isAuthenticated ? "" : formData.phone);

	const handleSubmit = () => {
		const name = getName();
		const email = getEmail();

		// Only validate guest fields if not authenticated
		if (!isAuthenticated) {
			if (!name.trim()) {
				Alert.alert("Required Field", "Please enter your name.");
				return;
			}

			if (!email.trim()) {
				Alert.alert("Required Field", "Please enter your email address.");
				return;
			}

			if (!validateEmail(email.trim())) {
				Alert.alert("Invalid Email", "Please enter a valid email address.");
				return;
			}
		}

		setIsSubmitting(true);

		// Prepare submission data
		const submissionData = {
			name: name.trim(),
			email: email.trim(),
			phone: getPhone().trim(),
			subject: formData.subject.trim(),
			message: formData.message.trim(),
		};

		console.log("Submitting contact form:", submissionData);

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false);
			Alert.alert(
				"Message Sent",
				"Thank you for your message. We'll get back to you soon.",
				[
					{
						text: "OK",
						onPress: () => {
							// Reset form (only reset fields that are in state)
							setFormData({
								name: "",
								email: "",
								phone: "",
								subject: "",
								message: "",
							});
						},
					},
				]
			);
		}, 500);
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
						Contact Us
					</Text>
				</View>
			</View>

			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={0}
			>
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
					keyboardShouldPersistTaps="handled"
				>
					{/* Contact Info Card */}
					<View
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 16,
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

						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
							<Ionicons name="location-outline" size={18} color={CUC_COLORS.sage} />
							<Text style={{ color: "#666", fontSize: 14, marginLeft: 10 }}>
								42 Crutched Friars, London EC3N 2AP
							</Text>
						</View>

						<Pressable
							onPress={() => Linking.openURL("tel:02071676682")}
							style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
						>
							<Ionicons name="call-outline" size={18} color={CUC_COLORS.sage} />
							<Text style={{ color: CUC_COLORS.navy, fontSize: 14, marginLeft: 10 }}>
								020 7167 6682
							</Text>
						</Pressable>

						<Pressable
							onPress={() => Linking.openURL("mailto:info@cityuniversityclub.co.uk")}
							style={{ flexDirection: "row", alignItems: "center" }}
						>
							<Ionicons name="mail-outline" size={18} color={CUC_COLORS.sage} />
							<Text style={{ color: CUC_COLORS.navy, fontSize: 14, marginLeft: 10 }}>
								info@cityuniversityclub.co.uk
							</Text>
						</Pressable>
					</View>

					{/* Contact Form */}
					<View
						style={{
							backgroundColor: CUC_COLORS.white,
							borderRadius: 12,
							padding: 16,
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
							Send us a Message
						</Text>

						{/* Authenticated User Info */}
						{isAuthenticated && (
							<View
								style={{
									backgroundColor: `${CUC_COLORS.sage}15`,
									borderRadius: 8,
									padding: 12,
									marginBottom: 16,
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Ionicons name="person-circle-outline" size={20} color={CUC_COLORS.sage} />
								<View style={{ marginLeft: 10, flex: 1 }}>
									<Text style={{ color: CUC_COLORS.navy, fontSize: 14, fontWeight: "500" }}>
										{session.user.name || "Member"}
									</Text>
									<Text style={{ color: "#666", fontSize: 13 }}>
										{session.user.email}
									</Text>
								</View>
							</View>
						)}

						{/* Guest Fields - Only shown when NOT authenticated */}
						{!isAuthenticated && (
							<>
								{/* Name Field */}
								<View style={{ marginBottom: 16 }}>
									<Text
										style={{
											color: CUC_COLORS.navy,
											fontSize: 14,
											fontWeight: "500",
											marginBottom: 6,
										}}
									>
										Name <Text style={{ color: "#dc2626" }}>*</Text>
									</Text>
									<TextInput
										value={formData.name}
										onChangeText={(value) => updateField("name", value)}
										placeholder="Your full name"
										placeholderTextColor="#999"
										style={{
											backgroundColor: CUC_COLORS.white,
											borderWidth: 1,
											borderColor: "#e5e5e5",
											borderRadius: 8,
											padding: 14,
											fontSize: 15,
											color: CUC_COLORS.navy,
										}}
									/>
								</View>

								{/* Email and Phone Row */}
								<View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
									{/* Email Field */}
									<View style={{ flex: 1 }}>
										<Text
											style={{
												color: CUC_COLORS.navy,
												fontSize: 14,
												fontWeight: "500",
												marginBottom: 6,
											}}
										>
											Email <Text style={{ color: "#dc2626" }}>*</Text>
										</Text>
										<TextInput
											value={formData.email}
											onChangeText={(value) => updateField("email", value)}
											placeholder="Email address"
											placeholderTextColor="#999"
											keyboardType="email-address"
											autoCapitalize="none"
											autoCorrect={false}
											style={{
												backgroundColor: CUC_COLORS.white,
												borderWidth: 1,
												borderColor: "#e5e5e5",
												borderRadius: 8,
												padding: 14,
												fontSize: 15,
												color: CUC_COLORS.navy,
											}}
										/>
									</View>

									{/* Phone Field */}
									<View style={{ flex: 1 }}>
										<Text
											style={{
												color: CUC_COLORS.navy,
												fontSize: 14,
												fontWeight: "500",
												marginBottom: 6,
											}}
										>
											Phone
										</Text>
										<TextInput
											value={formData.phone}
											onChangeText={(value) => updateField("phone", value)}
											placeholder="Phone number"
											placeholderTextColor="#999"
											keyboardType="phone-pad"
											style={{
												backgroundColor: CUC_COLORS.white,
												borderWidth: 1,
												borderColor: "#e5e5e5",
												borderRadius: 8,
												padding: 14,
												fontSize: 15,
												color: CUC_COLORS.navy,
											}}
										/>
									</View>
								</View>
							</>
						)}

						{/* Subject Field */}
						<View style={{ marginBottom: 16 }}>
							<Text
								style={{
									color: CUC_COLORS.navy,
									fontSize: 14,
									fontWeight: "500",
									marginBottom: 6,
								}}
							>
								Subject
							</Text>
							<TextInput
								value={formData.subject}
								onChangeText={(value) => updateField("subject", value)}
								placeholder="What is this regarding?"
								placeholderTextColor="#999"
								style={{
									backgroundColor: CUC_COLORS.white,
									borderWidth: 1,
									borderColor: "#e5e5e5",
									borderRadius: 8,
									padding: 14,
									fontSize: 15,
									color: CUC_COLORS.navy,
								}}
							/>
						</View>

						{/* Message Field */}
						<View style={{ marginBottom: 20 }}>
							<Text
								style={{
									color: CUC_COLORS.navy,
									fontSize: 14,
									fontWeight: "500",
									marginBottom: 6,
								}}
							>
								Message
							</Text>
							<TextInput
								value={formData.message}
								onChangeText={(value) => updateField("message", value)}
								placeholder="Your message..."
								placeholderTextColor="#999"
								multiline
								numberOfLines={5}
								textAlignVertical="top"
								style={{
									backgroundColor: CUC_COLORS.white,
									borderWidth: 1,
									borderColor: "#e5e5e5",
									borderRadius: 8,
									padding: 14,
									fontSize: 15,
									color: CUC_COLORS.navy,
									height: 120,
								}}
							/>
						</View>

						{/* Submit Button */}
						<Pressable
							onPress={handleSubmit}
							disabled={isSubmitting}
							style={({ pressed }) => ({
								backgroundColor: pressed || isSubmitting ? `${CUC_COLORS.navy}cc` : CUC_COLORS.navy,
								borderRadius: 8,
								padding: 16,
								alignItems: "center",
								justifyContent: "center",
								opacity: isSubmitting ? 0.7 : 1,
							})}
						>
							<Text
								style={{
									color: CUC_COLORS.cream,
									fontSize: 16,
									fontWeight: "600",
								}}
							>
								{isSubmitting ? "Sending..." : "Send Message"}
							</Text>
						</Pressable>
					</View>

					{/* Opening Hours */}
					<View
						style={{
							backgroundColor: CUC_COLORS.navy,
							borderRadius: 12,
							padding: 20,
							marginTop: 20,
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
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
