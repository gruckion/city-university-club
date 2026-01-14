import { Text, View } from "react-native";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
	white: "#ffffff",
};

/* ----------------------------- form container ----------------------------- */
export function FormContainer({ children }: { children: React.ReactNode }) {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: CUC_COLORS.cream,
				paddingHorizontal: 24,
				paddingTop: 100,
				gap: 16,
			}}
		>
			{children}
		</View>
	);
}

/* ------------------------------- form header ------------------------------ */
export default function FormHeader({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children?: React.ReactNode;
}) {
	return (
		<View style={{ gap: 8, marginBottom: 8 }}>
			<Text
				style={{
					fontSize: 32,
					fontWeight: "300",
					fontFamily: "serif",
					color: CUC_COLORS.navy,
				}}
			>
				{title}
			</Text>
			<Text
				style={{
					fontSize: 15,
					color: "#666",
					lineHeight: 22,
				}}
			>
				{description}
			</Text>
			{children}
		</View>
	);
}

/* ----------------------------- styled text input -------------------------- */
export function StyledTextInput({
	label,
	placeholder,
	value,
	onChangeText,
	secureTextEntry,
	keyboardType,
	autoCapitalize,
	autoCorrect,
	textContentType,
	autoComplete,
}: {
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	autoCorrect?: boolean;
	textContentType?: "emailAddress" | "password" | "newPassword" | "name" | "none";
	autoComplete?: "email" | "password" | "new-password" | "name" | "off";
}) {
	// Import TextInput here to avoid circular deps
	const { TextInput } = require("react-native");

	return (
		<View style={{ gap: 8 }}>
			<Text
				style={{
					fontSize: 14,
					fontWeight: "500",
					color: CUC_COLORS.navy,
				}}
			>
				{label}
			</Text>
			<TextInput
				style={{
					backgroundColor: CUC_COLORS.white,
					borderRadius: 12,
					paddingHorizontal: 16,
					paddingVertical: 16,
					fontSize: 16,
					color: CUC_COLORS.navy,
					borderWidth: 1,
					borderColor: "#e5e5e5",
				}}
				placeholder={placeholder}
				placeholderTextColor="#999"
				value={value}
				onChangeText={onChangeText}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				textContentType={textContentType}
				autoComplete={autoComplete}
			/>
		</View>
	);
}

/* ----------------------------- styled button ------------------------------ */
export function StyledButton({
	onPress,
	label,
	isLoading,
	variant = "primary",
}: {
	onPress: () => void;
	label: string;
	isLoading?: boolean;
	variant?: "primary" | "secondary" | "tertiary";
}) {
	const { Pressable, ActivityIndicator } = require("react-native");

	const getStyles = () => {
		switch (variant) {
			case "secondary":
				return {
					backgroundColor: CUC_COLORS.white,
					borderWidth: 1,
					borderColor: CUC_COLORS.navy,
				};
			case "tertiary":
				return {
					backgroundColor: "transparent",
				};
			default:
				return {
					backgroundColor: CUC_COLORS.navy,
				};
		}
	};

	const getTextColor = () => {
		switch (variant) {
			case "secondary":
			case "tertiary":
				return CUC_COLORS.navy;
			default:
				return CUC_COLORS.cream;
		}
	};

	return (
		<Pressable
			onPress={onPress}
			disabled={isLoading}
			style={{
				...getStyles(),
				borderRadius: 12,
				paddingVertical: 16,
				alignItems: "center",
				opacity: isLoading ? 0.7 : 1,
			}}
		>
			{isLoading ? (
				<ActivityIndicator size="small" color={getTextColor()} />
			) : (
				<Text
					style={{
						color: getTextColor(),
						fontSize: 16,
						fontWeight: "600",
					}}
				>
					{label}
				</Text>
			)}
		</Pressable>
	);
}

export { CUC_COLORS };
