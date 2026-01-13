import { Link } from "expo-router";
import { Button, Spinner, TextField, useThemeColor } from "heroui-native";
import { useState } from "react";
import { Alert, Text } from "react-native";
import FormHeader, { FormContainer } from "@/components/form";
import { authClient } from "@/lib/auth-client";

export default function SignUpRoute() {
	const background = useThemeColor("background");
	/* ---------------------------------- state --------------------------------- */
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	/* ------------------------------ handle signup ----------------------------- */
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

		const { data, error } = await authClient.signUp.email(
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
					Alert.alert("Error", ctx.error.message || "Failed to sign up");
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
				title="Sign Up"
				description="Create your account to get started"
			/>
			{/* name */}
			<TextField isRequired>
				<TextField.Label>Full Name</TextField.Label>
				<TextField.Input
					className="h-14 rounded-2xl"
					placeholder="Enter your full name"
					autoCapitalize="words"
					value={name}
					onChangeText={setName}
				/>
			</TextField>
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
			{/* password */}
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
			{/* confirm password */}
			<TextField isRequired>
				<TextField.Label>Confirm Password</TextField.Label>
				<TextField.Input
					className="h-14 rounded-2xl"
					placeholder="Confirm your password"
					secureTextEntry
					value={confirmPassword}
					onChangeText={setConfirmPassword}
				/>
			</TextField>
			{/* submit button */}
			<Button
				onPress={handleSignUp}
				isDisabled={isLoading}
				className="rounded-2xl"
				size="lg"
			>
				{isLoading ? (
					<Spinner color={background} />
				) : (
					<Button.Label>Sign Up</Button.Label>
				)}
			</Button>
			<Text className="px-14 text-center text-muted-foreground text-sm">
				by continuing you agree to our{" "}
				<Link href="http://convex.dev" className="text-foreground underline">
					terms of service
				</Link>{" "}
				and{" "}
				<Link href="http://convex.dev" className="text-foreground underline">
					privacy policy
				</Link>
			</Text>
		</FormContainer>
	);
}
