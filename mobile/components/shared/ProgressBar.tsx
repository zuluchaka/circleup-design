import { View, StyleSheet } from "react-native";
import { useTheme, radius } from "@/theme";

type Props = {
  value: number;
  max?: number;
  tone?: "primary" | "success" | "warning" | "danger";
  thickness?: number;
};

export function ProgressBar({ value, max = 100, tone = "primary", thickness = 8 }: Props) {
  const t = useTheme();
  const colorMap = {
    primary: t.primary,
    success: t.success,
    warning: t.warning,
    danger: t.danger,
  };
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <View style={[styles.track, { backgroundColor: t.bgMuted, height: thickness, borderRadius: radius.pill }]}>
      <View
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          backgroundColor: colorMap[tone],
          borderRadius: radius.pill,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
});
