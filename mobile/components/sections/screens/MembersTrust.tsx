// Trust Score breakdown for /sections/members-and-trust/trust.
// Factor-by-factor breakdown with tips, recent trust history, and
// endorsement actions.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Star, ChevronRight, Sparkles, TrendingUp, TrendingDown, Info, ThumbsUp,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const SCORE = 824;
const BAND = "Excellent";
const DELTA_90 = 18;

const FACTORS = [
  { id: "ontime",      label: "On-time contributions", weight: 35, score: 32, status: "Excellent",  tip: "Stay current with this cycle to maintain Excellent." },
  { id: "tenure",      label: "Tenure & engagement",   weight: 20, score: 17, status: "Strong",     tip: "Joining circles and voting in elections compounds tenure value." },
  { id: "identity",    label: "Verified identity",     weight: 15, score: 15, status: "Verified",   tip: "Identity verified · no action needed." },
  { id: "welfare",     label: "Welfare repayment",     weight: 15, score:  0, status: "No history", tip: "You haven't drawn welfare aid yet — neutral impact." },
  { id: "endorsements",label: "Peer endorsements",     weight: 15, score:  8, status: "Building",   tip: "Ask 2 long-tenured members to endorse you to unlock the full 15 points." },
];

const HISTORY = [
  { week: "Wk 21", change: 3,  reason: "On-time contribution · Welfare Booster" },
  { week: "Wk 20", change: 8,  reason: "Endorsed by Kofi Mensah" },
  { week: "Wk 18", change: 5,  reason: "Identity re-verified (Permit B renewal)" },
  { week: "Wk 16", change: -4, reason: "Late contribution · Geneva Diaspora Circle" },
  { week: "Wk 13", change: 6,  reason: "Endorsed by Mariam Rahimi" },
];

function factorTone(score: number, weight: number, t: any) {
  const ratio = score / weight;
  if (ratio >= 0.85) return { color: t.success, label: "Strong" };
  if (ratio >= 0.5)  return { color: t.primary, label: "OK" };
  if (ratio > 0)     return { color: t.warning, label: "Building" };
  return { color: t.textMuted, label: "Neutral" };
}

export function MembersTrust() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Trust Score" subtitle="Section 02 · Members & Trust" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.4 }}>
            YOUR TRUST SCORE
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.xs, marginTop: space.xs }}>
            <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 64 }}>{SCORE}</Text>
            <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.7)" }}>/ 1000</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 }}>
            <View style={[styles.bandPill, { backgroundColor: "rgba(16, 185, 129, 0.22)", borderColor: palette.emerald[400] }]}>
              <Star size={11} color={palette.amber[300]} fill={palette.amber[300]} />
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{BAND}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <TrendingUp size={12} color={palette.emerald[400]} />
              <Text variant="caption" weight="bold" style={{ color: palette.emerald[400] }}>
                +{DELTA_90} in last 90 days
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              FACTOR BREAKDOWN
            </Text>
            <View style={{ gap: space.sm }}>
              {FACTORS.map((f) => {
                const tone = factorTone(f.score, f.weight, t);
                return (
                  <Card key={f.id} padded>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                      <Text variant="bodySmall" weight="semibold" style={{ flex: 1 }}>{f.label}</Text>
                      <Text variant="caption" tone="muted">{f.score} / {f.weight}</Text>
                    </View>
                    <ProgressBar value={(f.score / f.weight) * 100} tone={tone.color === t.success ? "success" : tone.color === t.warning ? "warning" : "primary"} />
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 6, marginTop: space.sm }}>
                      <Info size={12} color={t.textMuted} style={{ marginTop: 3 }} />
                      <Text variant="caption" tone="secondary" style={{ flex: 1, lineHeight: 16 }}>{f.tip}</Text>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>

          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.sm }}>
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>RECENT CHANGES</Text>
              <Text variant="caption" weight="semibold" tone="accent">See all</Text>
            </View>
            <Card padded={false}>
              {HISTORY.map((h, i) => {
                const up = h.change > 0;
                return (
                  <View
                    key={h.week}
                    style={[
                      styles.historyRow,
                      i < HISTORY.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                    ]}
                  >
                    <View style={[styles.histIcon, { backgroundColor: up ? t.successSoft : t.dangerSoft }]}>
                      {up ? <TrendingUp size={14} color={t.success} /> : <TrendingDown size={14} color={t.danger} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" weight="semibold">{h.reason}</Text>
                      <Text variant="caption" tone="secondary">{h.week}</Text>
                    </View>
                    <Text variant="bodySmall" weight="bold" style={{ color: up ? t.success : t.danger }}>
                      {up ? "+" : ""}{h.change}
                    </Text>
                  </View>
                );
              })}
            </Card>
          </View>

          <Pressable style={[styles.tipCard, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
            <View style={[styles.tipIcon, { backgroundColor: t.primary }]}>
              <Sparkles size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.primaryStrong }}>
                Get 2 endorsements → +7 points
              </Text>
              <Text variant="caption" style={{ color: t.textSecondary, marginTop: 2, lineHeight: 16 }}>
                Long-tenured members can endorse you in 30 seconds.
              </Text>
            </View>
            <ChevronRight size={16} color={t.primary} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: space.xl,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  bandPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  histIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
