// My Shares for /sections/multi-share/my-shares.
// Per-circle share status: shares held, max eligible, capacity, your % of pot,
// stacked share-block visual.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Layers, ChevronRight, TrendingUp, Info,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const HOLDINGS = [
  { id: "circle_main_chf", name: "Main CHF Circle",  shares: 1, maxEligible: 3, cap: 0.30, concentration: 0.083 },
  { id: "circle_welfare",  name: "Welfare Booster",  shares: 1, maxEligible: 1, cap: 0.30, concentration: 0.042 },
  { id: "circle_youth",    name: "Youth Starter",    shares: 0, maxEligible: 0, cap: 0.30, concentration: 0.000 },
];

const TOTAL_SHARES = HOLDINGS.reduce((s, h) => s + h.shares, 0);
const TOTAL_ELIGIBLE = HOLDINGS.reduce((s, h) => s + h.maxEligible, 0);

export function MultiShareMyShares() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="My shares" subtitle="Section 12 · Multi-share" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={styles.heroIcon}>
              <Layers size={18} color="#fff" />
            </View>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.2 }}>
              ACTIVE HOLDINGS
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.xs, marginTop: space.xs }}>
            <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 56 }}>{TOTAL_SHARES}</Text>
            <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.78)" }}>shares · max {TOTAL_ELIGIBLE} eligible</Text>
          </View>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.xs }}>
            Holding multiple shares means contributing N× and receiving N× the payout.
          </Text>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.md }}>
          {HOLDINGS.map((h) => {
            const headroom = h.maxEligible - h.shares;
            const concentrationPct = h.concentration * 100;
            const capPct = h.cap * 100;
            return (
              <Card key={h.id} padded>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ flex: 1 }}>
                    <Text variant="h3" weight="bold">{h.name}</Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                      {h.shares}/{h.maxEligible} eligible · cap {capPct.toFixed(0)}%
                    </Text>
                  </View>
                  {headroom > 0 ? (
                    <View style={[styles.headroomChip, { backgroundColor: t.primarySoft }]}>
                      <Text variant="micro" weight="bold" tone="accent">+{headroom} OPEN</Text>
                    </View>
                  ) : (
                    <View style={[styles.headroomChip, { backgroundColor: t.bgMuted }]}>
                      <Text variant="micro" weight="bold" tone="secondary">FULL</Text>
                    </View>
                  )}
                </View>

                {/* Share blocks */}
                <View style={{ flexDirection: "row", gap: 6, marginTop: space.md }}>
                  {Array.from({ length: Math.max(h.maxEligible, h.shares, 1) }).map((_, i) => {
                    const held = i < h.shares;
                    const eligible = i < h.maxEligible;
                    return (
                      <View
                        key={i}
                        style={[
                          styles.shareBlock,
                          {
                            backgroundColor: held ? t.primary : eligible ? t.primarySoft : t.bgMuted,
                            borderColor: held ? t.primary : eligible ? t.primary : t.border,
                          },
                        ]}
                      >
                        {held ? (
                          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{i + 1}</Text>
                        ) : eligible ? (
                          <Text variant="caption" weight="bold" tone="accent">{i + 1}</Text>
                        ) : (
                          <Text variant="caption" tone="muted">—</Text>
                        )}
                      </View>
                    );
                  })}
                </View>

                <View style={{ marginTop: space.md }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text variant="caption" tone="muted" weight="semibold">YOUR % OF CIRCLE</Text>
                    <Text variant="caption" weight="bold">{concentrationPct.toFixed(1)}% / {capPct.toFixed(0)}% cap</Text>
                  </View>
                  <ProgressBar value={(concentrationPct / capPct) * 100} tone={concentrationPct / capPct > 0.85 ? "warning" : "primary"} />
                </View>
              </Card>
            );
          })}

          <Pressable style={[styles.requestBtn, { backgroundColor: t.surface, borderColor: t.primary }]}>
            <TrendingUp size={16} color={t.primary} />
            <Text variant="bodySmall" weight="bold" tone="accent" style={{ flex: 1 }}>
              Request additional shares
            </Text>
            <ChevronRight size={16} color={t.primary} />
          </Pressable>

          <View style={[styles.note, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
            <Info size={14} color={t.info} />
            <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 16 }}>
              Eligibility is gated by Trust Score (≥700), tenure (≥12 months), missed-payment history, and a 30% per-circle concentration cap.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.xl, paddingHorizontal: space.lg, paddingBottom: space.xl },
  heroIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  headroomChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  shareBlock: { flex: 1, height: 56, borderRadius: radius.sm, borderWidth: 1.5, alignItems: "center", justifyContent: "center", borderStyle: "dashed" },
  requestBtn: { flexDirection: "row", alignItems: "center", gap: space.sm, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderStyle: "dashed" },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 6, padding: space.md, borderRadius: radius.md, borderWidth: 1 },
});
