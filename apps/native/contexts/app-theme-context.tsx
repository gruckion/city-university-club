import type React from "react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { Uniwind, useUniwind } from "uniwind";

interface AppThemeContextType {
  colorScheme: "light" | "dark";
  isLight: boolean;
  isDark: boolean;
  setColorScheme: (scheme: "light" | "dark") => void;
  toggleColorScheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined
);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useUniwind();
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
