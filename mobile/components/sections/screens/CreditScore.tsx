import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import credit from "@/product/sections/09-credit-and-lending/data.json";

export function CreditScore() {
  const t = useTheme();
  const c = credit.credit;
  const pct = ((c.score - c.range.min) / (c.range.max - c.range.min)) * 100;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="CircleUp Credit" subtitle="Your score across formal & community signals" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <Card padded tone="primarySoft" bordered={false}>
          <Text variant="caption" tone="accent" weight="bold">YOUR SCORE</Text>
          <Text variant="display" weight="bold" style={{ marginTop: space.xs }}>{c.score}</Text>
          <Text variant="bodySmall" tone="secondary">{c.band} · {c.range.min}–{c.range.max} scale</Text>
          <View style={{ marginTop: space.md }}>
            <ProgressBar value={pct} tone="primary" thickness={10} />
            <View style={styles.scaleRow}>
              <Text variant="micro" tone="muted">{c.range.min}</Text>
              <Text variant="micro" tone="muted">{c.range.max}</Text>
            </View>
          </View>
        </Card>

        <Card padded>
          <Text variant="caption" tone="muted" weight="semibold">FACTORS</Text>
          <View style={{ gap: space.md, marginTop: space.sm }}>
            {c.factors.map((f) => (
              <View key={f.id}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text variant="bodySmall" weight="semibold">{f.label}</Text>
                  <Text variant="caption" tone="secondary">{f.score} / {f.weight}</Text>
                </View>
                <ProgressBar value={(f.score / f.weight) * 100} tone={f.score / f.weight > 0.7 ? "success" : f.score / f.weight > 0.3 ? "primary" : "warning"} />
                <Text variant="micro" tone="muted" style={{ marginTop: 2 }}>{f.status}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card padded>
          <Text variant="caption" tone="muted" weight="semibold">UNLOCKED FOR YOU</Text>
          <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>
            CHF {credit.advance.max.toLocaleString("de-CH")} payout advance
          </Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.xs }}>
            Repaid automatically from your cycle 11 payout on {new Date(credit.advance.repayDate).toLocaleDateString("en-CH", { day: "2-digit", month: "short" })}.
          </Text>
          <View style={{ marginTop: space.md, flexDirection: "row", gap: space.sm }}>
            <StatChip label={`Fee ${(credit.advance.feePct * 100).toFixed(1)}%`} tone="info" compact />
            <StatChip label={`Personal loan up to CHF ${credit.loan.preApprovedAmount.toLocaleString("de-CH")}`} tone="primary" compact />
          </View>
          <View style={{ marginTop: space.md, flexDirection: "row", gap: space.sm }}>
            <View style={{ flex: 1 }}><Button label="Get advance" fullWidth /></View>
            <View style={{ flex: 1 }}><Button label="Apply for loan" variant="secondary" fullWidth /></View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scaleRow: {
    marginTop: space.xs,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
