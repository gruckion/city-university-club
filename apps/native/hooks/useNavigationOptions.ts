import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useTheme } from "heroui-native";
import { useMemo } from "react";
import { Platform } from "react-native";

export const useNavigationOptions = () => {
	const { colors } = useTheme();
	return useMemo(() => {
		const root: NativeStackNavigationOptions = {
			contentStyle: {
				backgroundColor: colors.background,
			},
		};

		const base: NativeStackNavigationOptions = {
			headerTintColor: colors.foreground,
			headerTitleAlign: "center",
			headerLargeTitleShadowVisible: false,
			headerLargeTitleStyle: {
				color: colors.foreground,
			},
			headerShadowVisible: false,
			contentStyle: { backgroundColor: colors.background },
		};

		return {
			root,
			standard: {
				...base,
				headerStyle: {
					backgroundColor:
						Platform.OS === "ios" ? "transparent" : colors.background,
				},
				headerTransparent: Platform.OS === "ios",
			},
			modal: {
				...base,
				headerStyle: {
					backgroundColor:
						Platform.OS === "ios" ? "transparent" : colors.background,
				},
			},
		};
	}, [colors]);
};
