// Concentration monitor for /sections/multi-share/monitor.
// Organiser+ view of share concentration per circle. Heatmap-style row per
// holder showing share count, % of pot, vs cap. Risk callouts.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  AlertTriangle, ShieldCheck, ChevronDown, Users, TrendingUp, Filter,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const CIRCLE = "Main CHF Circle";
const CAP = 0.30;

const HOLDERS = [
  { name: "Mariam Rahimi",  shares: 3, share: 0.250, status: "near"  as const },
  { name: "Kofi Mensah",    shares: 2, share: 0.167, status: "ok"    as const },
  { name: "Amara Ofori",    shares: 2, share: 0.167, status: "ok"    as const },
  { name: "Zara Bekele",    shares: 1, share: 0.083, status: "ok"    as const },
  { name: "Selam Haile",    shares: 1, share: 0.083, status: "ok"    as const },
  { name: "Aïssatou D.",    shares: 1, share: 0.083, status: "ok"    as const },
  { name: "Linh Pham",      shares: 1, share: 0.083, status: "low"   as const },
  { name: "Chinedu Okoye",  shares: 1, share: 0.083, status: "low"   as const },
];

const TOTAL_SHARES = HOLDERS.reduce((s, h) => s + h.shares, 0);

function statusVisual(s: "ok" | "near" | "low" | "over", t: any) {
  switch (s) {
    case "near": return { bg: t.warningSoft, fg: t.warning, label: "Near cap" };
    case "low":  return { bg: t.infoSoft,    fg: t.info,    label: "Low risk" };
    case "over": return { bg: t.dangerSoft,  fg: t.danger,  label: "Over cap" };
    default:     return { bg: t.successSoft, fg: t.success, label: "OK" };
  }
}

export function MultiShareMonitor() {
  const t = useTheme();
  const nearCap = HOLDERS.filter((h) => h.share > 0.20).length;
  const giniLike = "low"; // simplification: visual indicator

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Concentration monitor" subtitle={`${CIRCLE} · ${TOTAL_SHARES} shares total`} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {/* Risk strip */}
        <View style={{ flexDirection: "row", gap: space.sm }}>
          <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Users size={14} color={t.primary} />
            <Text variant="h2" weight="bold">{HOLDERS.length}</Text>
            <Text variant="micro" tone="muted" weight="semibold">HOLDERS</Text>
          </View>
          <View style={[styles.summary, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
            <AlertTriangle size={14} color={t.warning} />
            <Text variant="h2" weight="bold" style={{ color: t.warning }}>{nearCap}</Text>
            <Text variant="micro" tone="muted" weight="semibold">NEAR CAP</Text>
          </View>
          <View style={[styles.summary, { backgroundColor: t.successSoft, borderColor: t.success }]}>
            <ShieldCheck size={14} color={t.success} />
            <Text variant="h2" weight="bold" style={{ color: t.success }}>{giniLike.toUpperCase()}</Text>
            <Text variant="micro" tone="muted" weight="semibold">RISK</Text>
          </View>
        </View>

        {/* Circle picker */}
        <Pressable style={[styles.circlePicker, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.circleAvatar, { backgroundColor: t.primary }]}>
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>CHF</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="semibold">{CIRCLE}</Text>
            <Text variant="caption" tone="secondary">12 members · CHF 200/mo base · cap {(CAP * 100).toFixed(0)}%</Text>
          </View>
          <ChevronDown size={16} color={t.textMuted} />
        </Pressable>

        {/* Concentration heatmap */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>HOLDERS · BY SHARE %</Text>
            <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Filter size={11} color={t.textMuted} />
              <Text variant="caption" weight="semibold" tone="secondary">Sort: %</Text>
            </Pressable>
          </View>
          <Card padded={false}>
            {HOLDERS.map((h, i) => {
              const v = statusVisual(h.status, t);
              const sharePct = h.share * 100;
              const capPct = CAP * 100;
              return (
                <View
                  key={h.name}
                  style={[
                    styles.row,
                    i < HOLDERS.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <Avatar name={h.name} size="md" />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{h.name}</Text>
                      <Text variant="bodySmall" weight="bold">{sharePct.toFixed(1)}%</Text>
                    </View>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                      {h.shares} share{h.shares === 1 ? "" : "s"} · projected payout CHF {(h.shares * 2400).toLocaleString("de-CH")}
                    </Text>
                    <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center", gap: space.sm }}>
                      <View style={{ flex: 1 }}>
                        <ProgressBar value={(sharePct / capPct) * 100} tone={h.status === "near" ? "warning" : "primary"} />
                      </View>
                      <View style={[styles.statusPill, { backgroundColor: v.bg }]}>
                        <Text variant="micro" weight="bold" style={{ color: v.fg }}>{v.label}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>

        <View style={[styles.tip, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
          <AlertTriangle size={14} color={t.warning} />
          <Text variant="caption" style={{ color: t.warning, flex: 1, lineHeight: 16 }}>
            Mariam holds 25% of this circle — under the 30% cap but worth watching. Above 25%, the system requires Auditor approval for any new share request.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flex: 1, alignItems: "center", paddingVertical: space.md, borderRadius: radius.md, borderWidth: 1, gap: 4 },
  circlePicker: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: 1 },
  circleAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill },
  tip: { flexDirection: "row", alignItems: "flex-start", gap: 6, padding: space.md, borderRadius: radius.md, borderWidth: 1 },
});
