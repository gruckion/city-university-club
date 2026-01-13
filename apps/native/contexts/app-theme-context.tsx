import type { ThemeConfig } from "heroui-native";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { Uniwind, useUniwind } from "uniwind";
import { cucTheme, cucThemes, type CucThemeId } from "../themes/cuc-theme";

interface AppThemeContextType {
	currentThemeId: CucThemeId;
	currentTheme: ThemeConfig;
	colorScheme: "light" | "dark";
	isLight: boolean;
	isDark: boolean;
	setColorScheme: (scheme: "light" | "dark") => void;
	toggleColorScheme: () => void;
	availableThemes: typeof cucThemes;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
	undefined,
);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { theme } = useUniwind();
	const [currentThemeId] = useState<CucThemeId>("cuc");

	const colorScheme = theme as "light" | "dark";
	const isLight = colorScheme === "light";
	const isDark = colorScheme === "dark";

	const setColorScheme = useCallback((newScheme: "light" | "dark") => {
		Uniwind.setTheme(newScheme);
	}, []);

	const toggleColorScheme = useCallback(() => {
		Uniwind.setTheme(colorScheme === "light" ? "dark" : "light");
	}, [colorScheme]);

	const value = useMemo(
		() => ({
			currentThemeId,
			currentTheme: cucTheme,
			colorScheme,
			isLight,
			isDark,
			setColorScheme,
			toggleColorScheme,
			availableThemes: cucThemes,
		}),
		[
			currentThemeId,
			colorScheme,
			isLight,
			isDark,
			setColorScheme,
			toggleColorScheme,
		],
	);

	return (
		<AppThemeContext.Provider value={value}>
			{children}
		</AppThemeContext.Provider>
	);
};

export function useAppTheme() {
	const context = useContext(AppThemeContext);
	if (!context) {
		throw new Error("useAppTheme must be used within AppThemeProvider");
	}
	return context;
}
