// CircleUp mobile color tokens.
// Primary: indigo. Secondary: amber. Neutral: slate.
// Mirrors Tailwind v4 palette values so designs stay consistent with the web app.

export const palette = {
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
  },
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
} as const;

export type Mode = "light" | "dark";

type Theme = {
  mode: Mode;
  bg: string;
  bgElevated: string;
  bgMuted: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  primaryOn: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;
  shadow: string;
};

export const light: Theme = {
  mode: "light",
  bg: palette.slate[50],
  bgElevated: palette.white,
  bgMuted: palette.slate[100],
  surface: palette.white,
  surfaceAlt: palette.slate[50],
  border: palette.slate[200],
  borderStrong: palette.slate[300],
  textPrimary: palette.slate[900],
  textSecondary: palette.slate[600],
  textMuted: palette.slate[400],
  textInverse: palette.white,
  primary: palette.indigo[600],
  primaryStrong: palette.indigo[700],
  primarySoft: palette.indigo[100],
  primaryOn: palette.white,
  accent: palette.amber[500],
  accentSoft: palette.amber[100],
  success: palette.emerald[600],
  successSoft: palette.emerald[100],
  warning: palette.amber[600],
  warningSoft: palette.amber[100],
  danger: palette.rose[600],
  dangerSoft: palette.rose[100],
  info: palette.sky[600],
  infoSoft: palette.sky[100],
  shadow: "rgba(15, 23, 42, 0.08)",
};

export const dark: Theme = {
  mode: "dark",
  bg: palette.slate[950],
  bgElevated: palette.slate[900],
  bgMuted: palette.slate[800],
  surface: palette.slate[900],
  surfaceAlt: palette.slate[800],
  border: palette.slate[800],
  borderStrong: palette.slate[700],
  textPrimary: palette.slate[50],
  textSecondary: palette.slate[300],
  textMuted: palette.slate[500],
  textInverse: palette.slate[950],
  primary: palette.indigo[400],
  primaryStrong: palette.indigo[300],
  primarySoft: palette.indigo[900],
  primaryOn: palette.indigo[950],
  accent: palette.amber[400],
  accentSoft: palette.amber[900],
  success: palette.emerald[400],
  successSoft: "rgba(16, 185, 129, 0.16)",
  warning: palette.amber[400],
  warningSoft: "rgba(245, 158, 11, 0.16)",
  danger: palette.rose[400],
  dangerSoft: "rgba(244, 63, 94, 0.16)",
  info: palette.sky[400],
  infoSoft: "rgba(14, 165, 233, 0.16)",
  shadow: "rgba(0, 0, 0, 0.5)",
};

export type AppTheme = Theme;
