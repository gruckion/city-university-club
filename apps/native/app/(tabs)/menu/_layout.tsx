import { Stack } from "expo-router";

// CUC brand colors
const CUC_COLORS = {
	navy: "#06273a",
	sage: "#85b09a",
	cream: "#fffef8",
};

export default function MenuLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}
