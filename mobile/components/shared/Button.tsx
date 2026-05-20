import { Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import { Text } from "./Text";
import { useTheme, radius, space } from "@/theme";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  leadingIcon,
  trailingIcon,
  fullWidth,
}: Props) {
  const t = useTheme();
  const isDisabled = disabled || loading;

  const padding =
    size === "sm" ? { v: 8, h: 12 } :
    size === "lg" ? { v: 14, h: 20 } :
    { v: 11, h: 16 };

  const palette = (() => {
    switch (variant) {
      case "secondary":
        return { bg: t.surface, fg: t.textPrimary, border: t.borderStrong };
      case "ghost":
        return { bg: "transparent", fg: t.primary, border: "transparent" };
      case "danger":
        return { bg: t.danger, fg: "#fff", border: t.danger };
      default:
        return { bg: t.primary, fg: t.primaryOn, border: t.primary };
    }
  })();

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          paddingVertical: padding.v,
          paddingHorizontal: padding.h,
          opacity: isDisabled ? 0.55 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={palette.fg} size="small" />
        ) : (
          leadingIcon
        )}
        <Text
          variant={size === "sm" ? "bodySmall" : "body"}
          weight="semibold"
          style={{ color: palette.fg }}
        >
          {label}
        </Text>
        {!loading && trailingIcon}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
});
