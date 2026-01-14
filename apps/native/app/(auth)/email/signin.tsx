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
	// Don't reveal whether email exists or password is wrong
	if (
		lowerMessage.includes("user not found") ||
		lowerMessage.includes("no user") ||
		lowerMessage.includes("invalid email") ||
		lowerMessage.includes("invalid password") ||
		lowerMessage.includes("incorrect password") ||
		lowerMessage.includes("wrong password") ||
		lowerMessage.includes("invalid credentials")
	) {
		return "Invalid email or password. Please try again.";
	}

	if (
		lowerMessage.includes("too many") ||
		lowerMessage.includes("rate limit")
	) {
		return "Too many attempts. Please try again later.";
	}

	if (
		lowerMessage.includes("account locked") ||
		lowerMessage.includes("account disabled")
	) {
		return "Unable to sign in. Please contact support.";
	}

	// Generic fallback for any other errors
	return "Unable to sign in. Please check your credentials and try again.";
}

export default function SignInRoute() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Ref for focusing password field on Enter
	const passwordRef = useRef<TextInput>(null);

	const handleSignIn = async () => {
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return;
		}
		if (!password) {
			Alert.alert("Error", "Please enter your password");
			return;
		}

		await authClient.signIn.email(
			{
				email: email.trim(),
				password: password,
				rememberMe: true,
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
				title="Welcome Back"
				description="Sign in to access your membership and exclusive club features"
			/>

			<StyledTextInput
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
				placeholder="Enter your password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				textContentType="password"
				autoComplete="password"
				returnKeyType="go"
				onSubmitEditing={handleSignIn}
			/>

			<View style={{ marginTop: 8 }}>
				<StyledButton
					onPress={handleSignIn}
					label="Sign In"
					isLoading={isLoading}
				/>
			</View>

			<Link href="/(auth)/email/(reset)/request-password-reset" asChild>
				<Pressable style={{ alignSelf: "center", paddingVertical: 8 }}>
					<Text
						style={{
							color: CUC_COLORS.sage,
							fontSize: 14,
							fontWeight: "500",
						}}
					>
						Forgot Password?
					</Text>
				</Pressable>
			</Link>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					marginTop: 24,
					gap: 4,
				}}
			>
				<Text style={{ color: "#666", fontSize: 14 }}>
					Don't have an account?
				</Text>
				<Link href="/(auth)/email/signup" replace asChild>
					<Pressable>
						<Text
							style={{
								color: CUC_COLORS.sage,
								fontSize: 14,
								fontWeight: "600",
							}}
						>
							Sign Up
						</Text>
					</Pressable>
				</Link>
			</View>
		</KeyboardAwareForm>
	);
}
