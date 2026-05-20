import { Text as RNText, TextProps, StyleSheet } from "react-native";
import { useTheme, fontFamily, fontSize, lineHeight, fontWeight } from "@/theme";

type Variant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodySmall"
  | "caption"
  | "micro";

type Tone = "primary" | "secondary" | "muted" | "inverse" | "accent" | "danger" | "success";

type Props = TextProps & {
  variant?: Variant;
  weight?: keyof typeof fontWeight;
  tone?: Tone;
  align?: "left" | "center" | "right";
};

const variantStyle: Record<Variant, { fontSize: number; lineHeight: number; weight: keyof typeof fontWeight }> = {
  display: { fontSize: fontSize.display, lineHeight: lineHeight.display, weight: "bold" },
  h1: { fontSize: fontSize.h1, lineHeight: lineHeight.h1, weight: "bold" },
  h2: { fontSize: fontSize.h2, lineHeight: lineHeight.h2, weight: "semibold" },
  h3: { fontSize: fontSize.h3, lineHeight: lineHeight.h3, weight: "semibold" },
  body: { fontSize: fontSize.body, lineHeight: lineHeight.body, weight: "regular" },
  bodySmall: { fontSize: fontSize.bodySmall, lineHeight: lineHeight.bodySmall, weight: "regular" },
  caption: { fontSize: fontSize.caption, lineHeight: lineHeight.caption, weight: "medium" },
  micro: { fontSize: fontSize.micro, lineHeight: lineHeight.caption, weight: "medium" },
};

export function Text({ variant = "body", weight, tone = "primary", align, style, ...rest }: Props) {
  const t = useTheme();
  const v = variantStyle[variant];
  const color =
    tone === "secondary" ? t.textSecondary
    : tone === "muted" ? t.textMuted
    : tone === "inverse" ? t.textInverse
    : tone === "accent" ? t.primary
    : tone === "danger" ? t.danger
    : tone === "success" ? t.success
    : t.textPrimary;
  const fw = fontWeight[weight ?? v.weight];

  return (
    <RNText
      {...rest}
      style={StyleSheet.flatten([
        {
          color,
          fontFamily: v.weight === "regular" ? fontFamily.body : fontFamily.heading,
          fontSize: v.fontSize,
          lineHeight: v.lineHeight,
          fontWeight: fw,
          textAlign: align,
        },
        style,
      ])}
    />
  );
}
