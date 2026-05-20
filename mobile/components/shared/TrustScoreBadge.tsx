import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme, radius, space } from "@/theme";

type Props = {
  score: number;
  compact?: boolean;
};

function bandFor(score: number): { label: string; tone: "success" | "primary" | "warning" | "danger" } {
  if (score >= 800) return { label: "Excellent", tone: "success" };
  if (score >= 600) return { label: "Strong", tone: "primary" };
  if (score >= 400) return { label: "Building", tone: "warning" };
  return { label: "Limited", tone: "danger" };
}

export function TrustScoreBadge({ score, compact = false }: Props) {
  const t = useTheme();
  const band = bandFor(score);
  const colorMap = {
    success: { bg: t.successSoft, fg: t.success },
    primary: { bg: t.primarySoft, fg: t.primary },
    warning: { bg: t.warningSoft, fg: t.warning },
    danger: { bg: t.dangerSoft, fg: t.danger },
  } as const;
  const c = colorMap[band.tone];
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: c.bg,
          paddingVertical: compact ? 3 : 6,
          paddingHorizontal: compact ? space.sm : space.md,
        },
      ]}
    >
      <Text variant={compact ? "caption" : "bodySmall"} weight="bold" style={{ color: c.fg }}>
        Trust {score}
      </Text>
      {!compact && (
        <Text variant="micro" style={{ color: c.fg, opacity: 0.85 }}>
          {band.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    alignItems: "center",
  },
});
