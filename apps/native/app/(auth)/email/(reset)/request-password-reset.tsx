import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Button, Spinner, TextField, useThemeColor } from "heroui-native";
import { useState } from "react";
import { Alert } from "react-native";
import FormHeader, { FormContainer } from "@/components/form";
import { authClient } from "@/lib/auth-client";

export default function RequestPasswordResetRoute() {
	const router = useRouter();
	const background = useThemeColor("background");
	/* ---------------------------------- state --------------------------------- */
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	/* ------------------------ handle request reset --------------------------- */
	const handleRequestReset = async () => {
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return;
		}
		const { error, data } = await authClient.requestPasswordReset(
			{
				email: email,
				redirectTo: Linking.createURL("email/reset-password"),
			},
			{
				onRequest: () => {
					setIsLoading(true);
				},
				onError: (ctx) => {
					setIsLoading(false);
					Alert.alert(
						"Error",
						ctx.error.message || "Failed to send reset link",
					);
				},
				onSuccess: () => {
					setIsLoading(false);
					Alert.alert("Success", "Reset link sent to your email");
					router.back();
					console.log("success!");
				},
			},
		);
		console.log(data, error);
	};
	/* --------------------------------- return --------------------------------- */
	return (
		<FormContainer>
			{/* header */}
			<FormHeader
				title="Reset Password"
				description="Enter your email to receive a password reset link"
			/>
			{/* email */}
			<TextField isRequired>
				<TextField.Label>Email</TextField.Label>
				<TextField.Input
					className="h-14 rounded-2xl"
					placeholder="Enter your email"
					keyboardType="email-address"
					autoCapitalize="none"
					value={email}
					onChangeText={setEmail}
				/>
			</TextField>
			{/* submit button */}
			<Button
				onPress={handleRequestReset}
				isDisabled={isLoading}
				className="rounded-2xl"
				size="lg"
			>
				{isLoading ? (
					<Spinner color={background} />
				) : (
					<Button.Label>Send Reset Link</Button.Label>
				)}
			</Button>
		</FormContainer>
	);
}
