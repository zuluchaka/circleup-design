// In-app theme override on top of the system color scheme.
// `system` defers to the OS; `light` and `dark` force the resolved palette.
// State is in-memory only — fine for the design tool; the production app
// should persist this via AsyncStorage / MMKV.

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { ThemeContext, resolveTheme } from "./index";

export type ThemeMode = "light" | "dark" | "system";

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "system",
  setMode: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const resolvedScheme = mode === "system" ? systemScheme : mode;
  const theme = useMemo(() => resolveTheme(resolvedScheme), [resolvedScheme]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </ThemeModeContext.Provider>
  );
}
