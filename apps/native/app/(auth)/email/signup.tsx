import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import FormHeader, {
	StyledTextInput,
	StyledButton,
	CUC_COLORS,
} from "@/components/form";
import { KeyboardAwareForm } from "@/components/keyboard";
import { authClient } from "@/lib/auth-client";

/**
 * Sanitize error messages to prevent information disclosure
 * This prevents email enumeration attacks by using generic messages
 */
function getSafeErrorMessage(errorMessage: string | undefined): string {
	const lowerMessage = (errorMessage || "").toLowerCase();

	// Map specific revealing errors to generic messages
	if (
		lowerMessage.includes("user already exists") ||
		lowerMessage.includes("email already") ||
		lowerMessage.includes("already registered")
	) {
		return "Unable to create account. Please check your details or try signing in.";
	}

	if (
		lowerMessage.includes("invalid email") ||
		lowerMessage.includes("email format")
	) {
		return "Please enter a valid email address.";
	}

	if (
		lowerMessage.includes("password") &&
		(lowerMessage.includes("weak") || lowerMessage.includes("short"))
	) {
		return "Password does not meet requirements. Please use at least 6 characters.";
	}

	// Generic fallback for any other errors
	return "Unable to create account. Please try again.";
}

export default function SignUpRoute() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Refs for keyboard navigation: name → email → password → confirmPassword → submit
	const emailRef = useRef<TextInput>(null);
	const passwordRef = useRef<TextInput>(null);
	const confirmPasswordRef = useRef<TextInput>(null);

	const handleSignUp = async () => {
		if (!name.trim()) {
			Alert.alert("Error", "Please enter your name");
			return;
		}

		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords don't match");
			return;
		}

		if (password.length < 6) {
			Alert.alert("Error", "Password must be at least 6 characters");
			return;
		}

		await authClient.signUp.email(
			{
				name: name.trim(),
				email: email.trim(),
				password: password,
			},
			{
				onRequest: () => {
					setIsLoading(true);
				},
				onError: (ctx) => {
					setIsLoading(false);
					// Use sanitized error message to prevent email enumeration
					Alert.alert("Error", getSafeErrorMessage(ctx.error.message));
				},
				onSuccess: () => {
					setIsLoading(false);
					// Navigate to tabs, dismissing all auth modals
					router.replace("/(tabs)");
				},
			},
		);
	};

	return (
		<KeyboardAwareForm>
			<FormHeader
				title="Create Account"
				description="Join City University Club and enjoy exclusive member benefits"
			/>

			<StyledTextInput
				label="Full Name"
				placeholder="Enter your full name"
				value={name}
				onChangeText={setName}
				autoCapitalize="words"
				textContentType="name"
				autoComplete="name"
				returnKeyType="next"
				blurOnSubmit={false}
				onSubmitEditing={() => emailRef.current?.focus()}
			/>

			<StyledTextInput
				ref={emailRef}
				label="Email Address"
				placeholder="Enter your email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				textContentType="emailAddress"
				autoComplete="email"
				returnKeyType="next"
				blurOnSubmit={false}
				onSubmitEditing={() => passwordRef.current?.focus()}
			/>

			<StyledTextInput
				ref={passwordRef}
				label="Password"
				placeholder="Create a password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				textContentType="newPassword"
				autoComplete="new-password"
				returnKeyType="next"
				blurOnSubmit={false}
				onSubmitEditing={() => confirmPasswordRef.current?.focus()}
			/>

			<StyledTextInput
				ref={confirmPasswordRef}
				label="Confirm Password"
				placeholder="Confirm your password"
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secureTextEntry
				textContentType="newPassword"
				autoComplete="new-password"
				returnKeyType="go"
				onSubmitEditing={handleSignUp}
			/>

			<View style={{ marginTop: 8 }}>
				<StyledButton
					onPress={handleSignUp}
					label="Create Account"
					isLoading={isLoading}
				/>
			</View>

			<Text
				style={{
					textAlign: "center",
					color: "#666",
					fontSize: 13,
					lineHeight: 20,
					paddingHorizontal: 20,
				}}
			>
				By signing up, you agree to our{" "}
				<Link href="https://cityuniversityclub.co.uk/terms" asChild>
					<Text style={{ color: CUC_COLORS.navy, textDecorationLine: "underline" }}>
						Terms of Service
					</Text>
				</Link>{" "}
				and{" "}
				<Link href="https://cityuniversityclub.co.uk/privacy" asChild>
					<Text style={{ color: CUC_COLORS.navy, textDecorationLine: "underline" }}>
						Privacy Policy
					</Text>
				</Link>
			</Text>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					marginTop: 8,
					gap: 4,
				}}
			>
				<Text style={{ color: "#666", fontSize: 14 }}>
					Already have an account?
				</Text>
				<Link href="/(auth)/email/signin" replace asChild>
					<Pressable>
						<Text
							style={{
								color: CUC_COLORS.sage,
								fontSize: 14,
								fontWeight: "600",
							}}
						>
							Sign In
						</Text>
					</Pressable>
				</Link>
			</View>
		</KeyboardAwareForm>
	);
}
