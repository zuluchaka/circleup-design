import { View, ViewProps, StyleSheet } from "react-native";
import { useTheme, radius, space } from "@/theme";

type Props = ViewProps & {
  padded?: boolean;
  tone?: "surface" | "elevated" | "muted" | "primarySoft";
  bordered?: boolean;
};

export function Card({ padded = true, tone = "surface", bordered = true, style, ...rest }: Props) {
  const t = useTheme();
  const bg =
    tone === "elevated" ? t.bgElevated
    : tone === "muted" ? t.bgMuted
    : tone === "primarySoft" ? t.primarySoft
    : t.surface;
  return (
    <View
      {...rest}
      style={StyleSheet.flatten([
        {
          backgroundColor: bg,
          borderRadius: radius.lg,
          borderColor: t.border,
          borderWidth: bordered ? 1 : 0,
          padding: padded ? space.lg : 0,
        },
        style,
      ])}
    />
  );
}
