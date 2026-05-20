import { Pressable, View, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Text } from "./Text";
import { useTheme, radius, space } from "@/theme";
import type { ReactNode } from "react";

type Props = {
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  meta?: string | ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  divider?: boolean;
};

export function ListRow({ leading, title, subtitle, meta, trailing, onPress, divider = true }: Props) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: t.border,
          borderBottomWidth: divider ? StyleSheet.hairlineWidth : 0,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {leading ? <View style={{ marginRight: space.md }}>{leading}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" weight="semibold">
          {title}
        </Text>
        {subtitle ? <Text variant="bodySmall" tone="secondary">{subtitle}</Text> : null}
      </View>
      <View style={{ alignItems: "flex-end", gap: 2, marginLeft: space.sm }}>
        {meta && typeof meta === "string" ? (
          <Text variant="caption" tone="muted">{meta}</Text>
        ) : meta}
        {trailing ?? (onPress ? <ChevronRight size={18} color={t.textMuted} /> : null)}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
});

export { radius };
