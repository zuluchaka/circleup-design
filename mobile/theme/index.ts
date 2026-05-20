import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { dark, light, type AppTheme } from "./colors";

export * from "./colors";
export * from "./typography";

export const ThemeContext = createContext<AppTheme>(light);

export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}

export function resolveTheme(scheme: "light" | "dark" | null | undefined): AppTheme {
  return scheme === "dark" ? dark : light;
}

export function useSystemTheme(): AppTheme {
  const scheme = useColorScheme();
  return resolveTheme(scheme);
}
