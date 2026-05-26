import { View, ScrollView, StyleSheet } from "react-native";
import { TrendingUp, Lock } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import credit from "@/product/sections/09-credit-and-lending/data.json";

type CreditData = typeof credit;

const LOW_SCORE_DATA: CreditData = {
  ...credit,
  credit: {
    ...credit.credit,
    score: 412,
    band: "Building",
    factors: credit.credit.factors.map((f) =>
      f.id === "history"
        ? { ...f, score: 8, status: "Limited history" }
        : f.id === "tenure"
        ? { ...f, score: 4, status: "Just joined" }
        : f.id === "endorsements"
        ? { ...f, score: 2, status: "1 endorsement" }
        : f,
    ),
  },
  advance: { ...credit.advance, max: 0, currentAdvance: null },
};

export function CreditScoreLow() {
  return <CreditScore data={LOW_SCORE_DATA} />;
}

export function CreditScore({ data = credit }: { data?: CreditData } = {}) {
  const t = useTheme();
  const c = data.credit;
  const pct = ((c.score - c.range.min) / (c.range.max - c.range.min)) * 100;
  const advanceEligible = data.advance.max > 0;
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

        {advanceEligible ? (
          <Card padded>
            <Text variant="caption" tone="muted" weight="semibold">UNLOCKED FOR YOU</Text>
            <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>
              CHF {data.advance.max.toLocaleString("de-CH")} payout advance
            </Text>
            <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.xs }}>
              Repaid automatically from your cycle 11 payout on {new Date(data.advance.repayDate).toLocaleDateString("en-CH", { day: "2-digit", month: "short" })}.
            </Text>
            <View style={{ marginTop: space.md, flexDirection: "row", gap: space.sm }}>
              <StatChip label={`Fee ${(data.advance.feePct * 100).toFixed(1)}%`} tone="info" compact />
              <StatChip label={`Personal loan up to CHF ${data.loan.preApprovedAmount.toLocaleString("de-CH")}`} tone="primary" compact />
            </View>
            <View style={{ marginTop: space.md, flexDirection: "row", gap: space.sm }}>
              <View style={{ flex: 1 }}><Button label="Get advance" fullWidth /></View>
              <View style={{ flex: 1 }}><Button label="Apply for loan" variant="secondary" fullWidth /></View>
            </View>
          </Card>
        ) : (
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <View style={[styles.lockIcon, { backgroundColor: t.bgMuted }]}>
                <Lock size={18} color={t.textMuted} />
              </View>
              <Text variant="caption" tone="muted" weight="semibold">NO ADVANCES YET</Text>
            </View>
            <Text variant="h3" weight="bold" style={{ marginTop: space.sm }}>
              Build your score to unlock advances
            </Text>
            <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.xs, lineHeight: 18 }}>
              Payout advances unlock at a score of 500. You're at {c.score} — usually 2–3 on-time cycles closes the gap.
            </Text>
            <View style={{ marginTop: space.md, gap: space.sm }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.sm }}>
                <TrendingUp size={14} color={t.success} style={{ marginTop: 2 }} />
                <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
                  Pay every cycle on time — biggest factor (35% of score).
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.sm }}>
                <TrendingUp size={14} color={t.success} style={{ marginTop: 2 }} />
                <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
                  Verify your identity — instant +15 points.
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.sm }}>
                <TrendingUp size={14} color={t.success} style={{ marginTop: 2 }} />
                <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
                  Ask 2 long-tenure members for endorsements.
                </Text>
              </View>
            </View>
          </Card>
        )}
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
  lockIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
