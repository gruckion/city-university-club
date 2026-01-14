import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

export default function EmailLayout() {
	return (
		<Stack
			screenOptions={{
				gestureEnabled: false,
				headerTransparent: true,
				headerStyle: {
					backgroundColor: CUC_COLORS.cream,
				},
				headerTintColor: CUC_COLORS.navy,
				contentStyle: {
					backgroundColor: CUC_COLORS.cream,
				},
			}}
		>
			<Stack.Screen
				name="signin"
				options={{
					headerLeft: () => <CloseButton />,
					title: "",
				}}
			/>
			<Stack.Screen
				name="signup"
				options={{
					title: "",
					headerBackTitle: "Sign In",
				}}
			/>
			<Stack.Screen
				name="(reset)/request-password-reset"
				options={{
					title: "",
					headerBackTitle: "Sign In",
				}}
			/>
			<Stack.Screen
				name="(reset)/reset-password"
				options={{
					title: "",
				}}
			/>
		</Stack>
	);
}

const CloseButton = () => {
	return (
		<Link href=".." asChild>
			<Pressable
				style={{
					width: 36,
					height: 36,
					borderRadius: 18,
					backgroundColor: `${CUC_COLORS.navy}10`,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Ionicons name="close" size={20} color={CUC_COLORS.navy} />
			</Pressable>
		</Link>
	);
};

