import { Platform } from "react-native";

// Inter is the design-system body font on web. We use the platform system stack
// in React Native to keep things lightweight; if the user later loads Inter via
// expo-font we can swap these references in one place.
export const fontFamily = {
  body: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "Inter, system-ui, sans-serif",
  }) as string,
  heading: Platform.select({
    ios: "System",
    android: "sans-serif-medium",
    default: "Inter, system-ui, sans-serif",
  }) as string,
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "JetBrains Mono, ui-monospace, monospace",
  }) as string,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const fontSize = {
  display: 32,
  h1: 26,
  h2: 22,
  h3: 18,
  body: 15,
  bodySmall: 13,
  caption: 11,
  micro: 10,
};

export const lineHeight = {
  display: 38,
  h1: 32,
  h2: 28,
  h3: 24,
  body: 22,
  bodySmall: 19,
  caption: 16,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
