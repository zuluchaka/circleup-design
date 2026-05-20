import { View, Pressable, StyleSheet } from "react-native";
import { ChevronLeft, Bell, Search } from "lucide-react-native";
import { Text } from "./Text";
import { useTheme, space } from "@/theme";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  trailing?: ReactNode;
  variant?: "default" | "transparent" | "primary";
};

export function AppHeader({ title, subtitle, onBack, trailing, variant = "default" }: Props) {
  const t = useTheme();
  const bg = variant === "primary" ? t.primary : variant === "transparent" ? "transparent" : t.bgElevated;
  const fg = variant === "primary" ? "#fff" : t.textPrimary;
  const fgMuted = variant === "primary" ? "rgba(255,255,255,0.85)" : t.textSecondary;
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: bg,
          borderBottomColor: t.border,
          borderBottomWidth: variant === "transparent" ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={{ width: 32 }}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12}>
            <ChevronLeft size={26} color={fg} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text variant="h3" weight="bold" style={{ color: fg }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" style={{ color: fgMuted }} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ width: 32, alignItems: "flex-end" }}>{trailing}</View>
    </View>
  );
}

export function HeaderIconButton({ onPress, children }: { onPress?: () => void; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      {children}
    </Pressable>
  );
}

export const HeaderIcons = { Bell, Search };

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    gap: space.md,
  },
});
