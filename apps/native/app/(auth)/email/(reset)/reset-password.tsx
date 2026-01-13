import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Spinner, TextField, useThemeColor } from "heroui-native";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import FormHeader, { FormContainer } from "@/components/form";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordRoute() {
	const background = useThemeColor("background");
	const router = useRouter();
	const { token, error } = useLocalSearchParams<{
		token: string;
		error?: string;
	}>();
	/* ---------------------------------- state --------------------------------- */
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	/* ------------------------- handle reset password ------------------------- */
	const handleResetPassword = async () => {
		if (!password) {
			Alert.alert("Error", "Please enter your new password");
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
		const { error: resetError, data } = await authClient.resetPassword(
			{
				newPassword: password,
				token: token,
			},
			{
				onRequest: () => {
					setIsLoading(true);
				},
				onError: (ctx) => {
					setIsLoading(false);
					Alert.alert("Error", ctx.error.message || "Failed to reset password");
				},
				onSuccess: () => {
					setIsLoading(false);
					console.log("success!");
					Alert.alert("Success", "Password reset successfully");
					router.back();
				},
			},
		);
		console.log(data, resetError);
	};
	/* --------------------------------- invalid token --------------------------------- */
	if (error === "INVALID_TOKEN" || !token) {
		return (
			<View className="flex-1 bg-background">
				<View className="flex-1 justify-center px-6">
					<View className="mb-8 text-center">
						<Text className="mb-4 font-bold text-2xl text-foreground">
							Invalid Link
						</Text>
						<Text className="text-muted-foreground">
							This reset link has already been used or is invalid
						</Text>
					</View>
					<Link href="/(auth)/email/signin" asChild>
						<Button className="rounded-2xl">
							<Button.Label>Back to Sign In</Button.Label>
						</Button>
					</Link>
				</View>
			</View>
		);
	}
	/* --------------------------------- return --------------------------------- */
	return (
		<FormContainer>
			{/* header */}
			<FormHeader
				title="Reset Password"
				description="Enter your new password to complete the reset"
			/>
			{/* new password */}
			<TextField isRequired>
				<TextField.Label>New Password</TextField.Label>
				<TextField.Input
					className="h-14 rounded-2xl"
					placeholder="Enter your new password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
			</TextField>
			{/* confirm password */}
			<TextField isRequired>
				<TextField.Label>Confirm Password</TextField.Label>
				<TextField.Input
					className="h-14 rounded-2xl"
					placeholder="Confirm your new password"
					secureTextEntry
					value={confirmPassword}
					onChangeText={setConfirmPassword}
				/>
			</TextField>
			{/* submit button */}
			<Button
				onPress={handleResetPassword}
				isDisabled={isLoading}
				className="rounded-2xl"
				size="lg"
			>
				{isLoading ? (
					<Spinner color={background} />
				) : (
					<Button.Label>Reset Password</Button.Label>
				)}
			</Button>
		</FormContainer>
	);
}
