import type { ThemeConfig } from "heroui-native";

/**
 * City University Club Theme
 *
 * Brand Colors:
 * - Dark Navy: #06273a (HSL 202, 81%, 12.5%) - Primary, hero backgrounds, buttons
 * - Muted Sage: #8fa89d (HSL 153, 12%, 61%) - Header/nav, subtle accents
 * - Cream: #fffef8 (HSL 51, 100%, 99%) - Page backgrounds, text on dark
 * - White: #ffffff - Input backgrounds, cards
 *
 * Brand Mood: Sophisticated British private club - cool, understated, refined
 */
export const cucTheme: ThemeConfig = {
	light: {
		colors: {
			// Base Colors - Cream background, Navy text
			background: "hsl(51 100% 99%)", // Cream #fffef8
			foreground: "hsl(202 81% 12.5%)", // Navy #06273a
			panel: "hsl(0 0% 100%)", // White #ffffff

			muted: "hsl(153 12% 50%)",
			mutedForeground: "hsl(153 10% 40%)",

			surface: "hsl(0 0% 100%)", // White
			surfaceForeground: "hsl(202 81% 12.5%)", // Navy

			default: "hsl(51 50% 97%)", // Light cream
			defaultForeground: "hsl(202 81% 12.5%)", // Navy

			// Primary accent - Navy
			accent: "hsl(202 81% 12.5%)", // Navy #06273a
			accentForeground: "hsl(51 100% 99%)", // Cream

			// Soft accent - Sage
			accentSoft: "hsl(153 12% 90%)", // Light sage
			accentSoftForeground: "hsl(202 81% 12.5%)", // Navy

			// Status Colors - Muted to match sophisticated aesthetic
			success: "hsl(153 40% 45%)", // Sage-influenced green
			successForeground: "hsl(51 100% 99%)",

			warning: "hsl(45 55% 65%)", // Soft gold
			warningForeground: "hsl(202 81% 12.5%)",

			danger: "hsl(0 50% 55%)", // Muted red
			dangerForeground: "hsl(51 100% 99%)",

			// Surface hierarchy
			surface1: "hsl(51 100% 99%)", // Cream
			surface2: "hsl(0 0% 100%)", // White
			surface3: "hsl(51 30% 96%)", // Light cream

			// Misc Colors
			border: "hsl(153 12% 80%)", // Light sage
			divider: "hsl(153 10% 85%)",
			link: "hsl(202 81% 25%)", // Navy but lighter for visibility
		},
		borderRadius: {
			DEFAULT: "16px",
			panel: "14px",
			"panel-inner": "10px",
		},
		opacity: {
			disabled: 0.5,
		},
	},
	dark: {
		colors: {
			// Base Colors - Navy background, Cream text
			background: "hsl(202 81% 12.5%)", // Navy #06273a
			foreground: "hsl(51 100% 99%)", // Cream #fffef8
			panel: "hsl(202 70% 16%)", // Lighter navy

			muted: "hsl(153 12% 50%)",
			mutedForeground: "hsl(153 10% 65%)",

			surface: "hsl(202 70% 18%)", // Lighter navy
			surfaceForeground: "hsl(51 100% 99%)", // Cream

			default: "hsl(202 65% 20%)", // Even lighter navy
			defaultForeground: "hsl(51 80% 95%)", // Near cream

			// Primary accent - Sage for dark mode
			accent: "hsl(153 12% 61%)", // Sage #8fa89d
			accentForeground: "hsl(202 81% 12.5%)", // Navy

			// Soft accent
			accentSoft: "hsl(153 15% 25%)", // Dark sage
			accentSoftForeground: "hsl(153 12% 75%)", // Light sage

			// Status Colors
			success: "hsl(153 35% 50%)",
			successForeground: "hsl(51 100% 99%)",

			warning: "hsl(45 50% 55%)",
			warningForeground: "hsl(202 81% 12.5%)",

			danger: "hsl(0 45% 50%)",
			dangerForeground: "hsl(51 100% 99%)",

			// Surface hierarchy
			surface1: "hsl(202 81% 12.5%)", // Navy
			surface2: "hsl(202 70% 16%)",
			surface3: "hsl(202 65% 20%)",

			// Misc Colors
			border: "hsl(153 12% 30%)",
			divider: "hsl(153 10% 25%)",
			link: "hsl(153 12% 70%)", // Light sage
		},
		borderRadius: {
			DEFAULT: "16px",
			panel: "14px",
			"panel-inner": "10px",
		},
		opacity: {
			disabled: 0.5,
		},
	},
};

// Export themes array for easy access
export const cucThemes = [
	{ name: "City University Club", config: cucTheme, id: "cuc" },
] as const;

export type CucThemeId = (typeof cucThemes)[number]["id"];
