import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme, radius, space } from "@/theme";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

type Props = {
  label: string;
  value?: string | number;
  tone?: Tone;
  compact?: boolean;
};

export function StatChip({ label, value, tone = "neutral", compact = false }: Props) {
  const t = useTheme();
  const map = {
    neutral: { bg: t.bgMuted, fg: t.textSecondary },
    primary: { bg: t.primarySoft, fg: t.primary },
    success: { bg: t.successSoft, fg: t.success },
    warning: { bg: t.warningSoft, fg: t.warning },
    danger: { bg: t.dangerSoft, fg: t.danger },
    info: { bg: t.infoSoft, fg: t.info },
  } as const;
  const c = map[tone];
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: c.bg,
          paddingVertical: compact ? 2 : space.xs,
          paddingHorizontal: compact ? space.xs : space.sm,
        },
      ]}
    >
      <Text variant={compact ? "micro" : "caption"} style={{ color: c.fg }}>
        {value !== undefined ? `${label} · ${value}` : label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
});
