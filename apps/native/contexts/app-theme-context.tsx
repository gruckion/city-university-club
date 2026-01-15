import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Uniwind, useUniwind } from "uniwind";

interface AppThemeContextType {
  colorScheme: "light" | "dark";
  isLight: boolean;
  isDark: boolean;
  setColorScheme: (scheme: "light" | "dark" | "system") => void;
  toggleColorScheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined
);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const colorScheme = theme as "light" | "dark";
  const isLight = colorScheme === "light";
  const isDark = colorScheme === "dark";

  // Enable system theme on mount (Apple HIG compliance - follow device settings)
  useEffect(() => {
    Uniwind.setTheme("system");
  }, []);

  const setColorScheme = useCallback(
    (newScheme: "light" | "dark" | "system") => {
      Uniwind.setTheme(newScheme);
    },
    []
  );

  const toggleColorScheme = useCallback(() => {
    // If using system theme, switch to the opposite of current
    // Otherwise toggle between light and dark
    if (hasAdaptiveThemes) {
      Uniwind.setTheme(colorScheme === "light" ? "dark" : "light");
    } else {
      Uniwind.setTheme(colorScheme === "light" ? "dark" : "light");
    }
  }, [colorScheme, hasAdaptiveThemes]);

  const value = useMemo(
    () => ({
      colorScheme,
      isLight,
      isDark,
      setColorScheme,
      toggleColorScheme,
    }),
    [colorScheme, isLight, isDark, setColorScheme, toggleColorScheme]
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
