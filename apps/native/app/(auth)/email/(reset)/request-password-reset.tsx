import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import FormHeader, {
	FormContainer,
	StyledTextInput,
	StyledButton,
} from "@/components/form";
import { authClient } from "@/lib/auth-client";

export default function RequestPasswordResetRoute() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleRequestReset = async () => {
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return;
		}

		await authClient.requestPasswordReset(
			{
				email: email,
				redirectTo: Linking.createURL("email/reset-password"),
			},
			{
				onRequest: () => {
					setIsLoading(true);
				},
				onError: () => {
					setIsLoading(false);
					// SECURITY: Always show success message to prevent email enumeration
					// We don't reveal whether the email exists in our system
					Alert.alert(
						"Check Your Email",
						"If an account exists with this email, you'll receive a password reset link shortly.",
					);
					router.back();
				},
				onSuccess: () => {
					setIsLoading(false);
					Alert.alert(
						"Check Your Email",
						"If an account exists with this email, you'll receive a password reset link shortly.",
					);
					router.back();
				},
			},
		);
	};

	return (
		<FormContainer>
			<FormHeader
				title="Reset Password"
				description="Enter your email address and we'll send you a link to reset your password"
			/>

			<StyledTextInput
				label="Email Address"
				placeholder="Enter your email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
				textContentType="emailAddress"
			/>

			<View style={{ marginTop: 8 }}>
				<StyledButton
					onPress={handleRequestReset}
					label="Send Reset Link"
					isLoading={isLoading}
				/>
			</View>
		</FormContainer>
	);
}
