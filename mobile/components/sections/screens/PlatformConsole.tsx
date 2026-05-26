// Operator console for /sections/platform-administration/console.
// Dense KPI strip + queue counts + recent ops events. staff-role-only.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  Users, DollarSign, ShieldCheck, AlertOctagon, Activity, TrendingUp,
  TrendingDown, Minus, ChevronRight, Lock, BarChart3, Server,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const KPIS = [
  { id: "users",   label: "Active users",     value: "12,418",     trend: "up"   as const, delta: "+4.2%",  Icon: Users },
  { id: "arr",     label: "ARR",              value: "CHF 184k",   trend: "up"   as const, delta: "+12%",   Icon: DollarSign },
  { id: "kyc",     label: "KYC backlog",      value: "38",         trend: "down" as const, delta: "-6",     Icon: ShieldCheck },
  { id: "disputes",label: "Open disputes",    value: "4",          trend: "flat" as const, delta: "0",      Icon: AlertOctagon },
  { id: "uptime",  label: "Uptime (30d)",     value: "99.97%",     trend: "flat" as const, delta: "—",       Icon: Server },
  { id: "txns",    label: "Today's txns",     value: "CHF 28.4k",  trend: "up"   as const, delta: "+18%",   Icon: BarChart3 },
];

const QUEUES = [
  { id: "kyc",      label: "KYC review",         count: 38, sla: "1.2h avg", tone: "warning" as const },
  { id: "support",  label: "Support tickets",    count: 12, sla: "4h avg",   tone: "primary" as const },
  { id: "compliance",label:"Compliance flags",   count:  3, sla: "30min",    tone: "danger"  as const },
  { id: "appeals", label: "Account appeals",     count:  5, sla: "1d avg",   tone: "primary" as const },
];

const RECENT = [
  { id: "ev_1", at: "11:47", text: "Suspended user u_8814 (chargeback)", actor: "compliance@mafao.ch" },
  { id: "ev_2", at: "11:32", text: "Approved KYC for Joseph Banda (ZM)",  actor: "ops@mafao.ch" },
  { id: "ev_3", at: "11:18", text: "Reversed payout CHF 1,800 · circle_main_chf", actor: "ops@mafao.ch" },
  { id: "ev_4", at: "10:55", text: "Force-rotated session for kofi@example.ch", actor: "security@mafao.ch" },
];

export function PlatformConsole() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Operator console" subtitle="Section 14 · Platform Admin" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <View style={[styles.staffBanner, { backgroundColor: palette.slate[800] }]}>
          <Lock size={14} color={palette.amber[300]} />
          <Text variant="caption" weight="bold" style={{ color: "#fff", flex: 1 }}>
            STAFF VIEW · Mafao Operations · session 7d2a
          </Text>
          <Text variant="micro" style={{ color: "rgba(255,255,255,0.6)" }}>v2.4.1 · prod</Text>
        </View>

        {/* KPI grid */}
        <View style={styles.grid}>
          {KPIS.map((k) => {
            const Icon = k.Icon;
            const TrendIcon = k.trend === "up" ? TrendingUp : k.trend === "down" ? TrendingDown : Minus;
            const trendColor = k.trend === "up" ? t.success : k.trend === "down" ? t.warning : t.textMuted;
            return (
              <View key={k.id} style={[styles.kpi, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={[styles.kpiIcon, { backgroundColor: t.primarySoft }]}>
                    <Icon size={14} color={t.primary} />
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <TrendIcon size={11} color={trendColor} />
                    <Text variant="micro" weight="bold" style={{ color: trendColor }}>{k.delta}</Text>
                  </View>
                </View>
                <Text variant="h2" weight="bold" style={{ marginTop: space.sm }}>{k.value}</Text>
                <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.4 }}>{k.label.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>

        {/* Queue counts */}
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>QUEUES</Text>
          <View style={{ gap: space.sm }}>
            {QUEUES.map((q) => {
              const tonePalette = q.tone === "danger" ? { bg: t.dangerSoft, fg: t.danger }
                : q.tone === "warning" ? { bg: t.warningSoft, fg: t.warning }
                : { bg: t.primarySoft, fg: t.primary };
              return (
                <Pressable key={q.id} style={[styles.queueRow, { backgroundColor: t.surface, borderColor: t.border }]}>
                  <View style={[styles.queueIcon, { backgroundColor: tonePalette.bg }]}>
                    <Activity size={16} color={tonePalette.fg} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{q.label}</Text>
                    <Text variant="caption" tone="secondary">SLA · {q.sla}</Text>
                  </View>
                  <Text variant="h2" weight="bold" style={{ color: tonePalette.fg }}>{q.count}</Text>
                  <ChevronRight size={14} color={t.textMuted} />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Recent events */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: space.sm }}>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>RECENT OPERATIONS</Text>
            <Text variant="caption" weight="semibold" tone="accent">Audit log</Text>
          </View>
          <Card padded={false}>
            {RECENT.map((e, i) => (
              <View
                key={e.id}
                style={[
                  styles.eventRow,
                  i < RECENT.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <Text variant="caption" weight="bold" tone="muted" style={{ width: 44, fontFamily: "monospace" }}>{e.at}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="semibold" numberOfLines={2}>{e.text}</Text>
                  <Text variant="micro" tone="secondary" style={{ marginTop: 2, fontFamily: "monospace" }}>{e.actor}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  staffBanner: { flexDirection: "row", alignItems: "center", gap: 6, padding: space.sm, paddingHorizontal: space.md, borderRadius: radius.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  kpi: { flexBasis: "48%", flexGrow: 1, padding: space.md, borderRadius: radius.md, borderWidth: 1, gap: 4 },
  kpiIcon: { width: 28, height: 28, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  queueRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: 1 },
  queueIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  eventRow: { flexDirection: "row", alignItems: "flex-start", gap: space.sm, padding: space.md },
});
