import { Link } from "expo-router";
import { Button, Spinner, TextField, useThemeColor } from "heroui-native";
import { useState } from "react";
import { Alert } from "react-native";
import FormHeader, { FormContainer } from "@/components/form";
import { authClient } from "@/lib/auth-client";

export default function SignInRoute() {
	const background = useThemeColor("background");
	/* ---------------------------------- state --------------------------------- */
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	/* ----------------------------- handle sign in ----------------------------- */
	const handleSignIn = async () => {
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return;
		}
		if (!password) {
			Alert.alert("Error", "Please enter your password");
			return;
		}

		const { data, error } = await authClient.signIn.email(
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
					Alert.alert("Error", ctx.error.message || "Failed to sign in");
				},
				onSuccess: () => {
					setIsLoading(false);
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
				title="Login"
				description="Enter your email and password to login"
			/>

			{/* email text-field*/}
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

			{/* password text-field */}
			<TextField isRequired>
				<TextField.Label>Password</TextField.Label>
				<TextField.Input
					className="h-14 rounded-2xl"
					placeholder="Enter your password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
			</TextField>

			{/* submit button */}
			<Button
				onPress={handleSignIn}
				isDisabled={isLoading}
				size="lg"
				className="rounded-2xl"
			>
				{isLoading ? (
					<Spinner color={background} />
				) : (
					<Button.Label>Sign In</Button.Label>
				)}
			</Button>

			{/* forgot password route */}
			<Link href="/(auth)/email/(reset)/request-password-reset" asChild>
				<Button
					variant="tertiary"
					size="sm"
					className="self-center rounded-2xl"
				>
					<Button.Label>Forgot Password?</Button.Label>
				</Button>
			</Link>
		</FormContainer>
	);
}
