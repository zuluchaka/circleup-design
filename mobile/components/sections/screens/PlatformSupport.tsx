// Support tickets queue for /sections/platform-administration/support.
// Subject, priority, SLA countdown, owner, status. Filter strip + sort.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  MessageCircle, Clock, AlertTriangle, CheckCircle2, User as UserIcon,
  Filter, ChevronRight, Lock, Inbox,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const FILTERS = ["All · 12", "High", "Overdue · 1", "Awaiting member", "Mine"];

const TICKETS = [
  { id: "tic_1", subject: "Payout mismatch · circle_main_chf",      priority: "high"   as const, sla: "4h left",    owner: "Operations", status: "open"    as const, member: "Aminata D." },
  { id: "tic_2", subject: "Bank link error · 12 members",            priority: "medium" as const, sla: "11h left",   owner: "Support",    status: "wip"     as const, member: "Multiple" },
  { id: "tic_3", subject: "Dispute · welfare disbursement",          priority: "high"   as const, sla: "OVERDUE",    owner: "Compliance", status: "open"    as const, member: "Kofi M." },
  { id: "tic_4", subject: "Account suspension appeal",                priority: "low"    as const, sla: "2d left",    owner: "Support",    status: "waiting" as const, member: "João S." },
  { id: "tic_5", subject: "Cannot link TWINT number to circle",       priority: "medium" as const, sla: "1d left",    owner: "Support",    status: "wip"     as const, member: "Ngozi O." },
  { id: "tic_6", subject: "Refund · accidental double contribution", priority: "low"    as const, sla: "3d left",    owner: "Finance",    status: "open"    as const, member: "Selam H." },
];

function priorityTone(p: "high" | "medium" | "low", t: any) {
  if (p === "high")   return { bg: t.dangerSoft,  fg: t.danger,  label: "HIGH"   };
  if (p === "medium") return { bg: t.warningSoft, fg: t.warning, label: "MEDIUM" };
  return                     { bg: t.bgMuted,     fg: t.textMuted, label: "LOW"  };
}

function statusVisual(s: "open" | "wip" | "waiting" | "resolved", t: any) {
  if (s === "wip")     return { bg: t.infoSoft,    fg: t.info,    label: "In progress" };
  if (s === "waiting") return { bg: t.warningSoft, fg: t.warning, label: "Awaiting"    };
  if (s === "resolved")return { bg: t.successSoft, fg: t.success, label: "Resolved"    };
  return                       { bg: t.primarySoft, fg: t.primary, label: "Open"       };
}

function slaVisual(sla: string, t: any) {
  if (sla === "OVERDUE") return { fg: t.danger,    weight: "bold"  as const };
  if (sla.startsWith("4"))  return { fg: t.warning,   weight: "bold"  as const };
  return { fg: t.textSecondary, weight: "semibold" as const };
}

export function PlatformSupport() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Support tickets" subtitle="Section 14 · Platform Admin" />

      <View style={[styles.staffBanner, { backgroundColor: palette.slate[800] }]}>
        <Lock size={11} color={palette.amber[300]} />
        <Text variant="micro" weight="bold" style={{ color: "#fff", flex: 1 }}>STAFF · 12 open · 1 overdue · 4h SLA avg</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f, i) => (
          <View
            key={f}
            style={[
              styles.filterChip,
              {
                backgroundColor: i === 0 ? t.primary : f.startsWith("Overdue") ? t.dangerSoft : t.surface,
                borderColor: i === 0 ? t.primary : f.startsWith("Overdue") ? t.danger : t.border,
              },
            ]}
          >
            <Text variant="caption" weight="semibold" style={{ color: i === 0 ? "#fff" : f.startsWith("Overdue") ? t.danger : t.textSecondary }}>
              {f}
            </Text>
          </View>
        ))}
        <Pressable style={[styles.filterChip, { backgroundColor: t.surface, borderColor: t.border, flexDirection: "row", alignItems: "center", gap: 4 }]}>
          <Filter size={11} color={t.textSecondary} />
          <Text variant="caption" weight="semibold" tone="secondary">Sort</Text>
        </Pressable>
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.sm }}>
        {TICKETS.map((tk) => {
          const p = priorityTone(tk.priority, t);
          const s = statusVisual(tk.status, t);
          const sla = slaVisual(tk.sla, t);
          const overdue = tk.sla === "OVERDUE";
          return (
            <Pressable key={tk.id} style={[styles.ticket, { backgroundColor: t.surface, borderColor: overdue ? t.danger : t.border, borderWidth: overdue ? 2 : 1 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={[styles.priorityPill, { backgroundColor: p.bg }]}>
                  <Text variant="micro" weight="bold" style={{ color: p.fg }}>{p.label}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
                  <Text variant="micro" weight="bold" style={{ color: s.fg }}>{s.label.toUpperCase()}</Text>
                </View>
                <Text variant="caption" tone="muted" weight="semibold" style={{ marginLeft: "auto", fontFamily: "monospace" }}>{tk.id}</Text>
              </View>
              <Text variant="bodySmall" weight="bold" style={{ marginTop: 6 }}>{tk.subject}</Text>
              <View style={[styles.metaRow, { borderTopColor: t.border, marginTop: space.sm }]}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <UserIcon size={11} color={t.textMuted} />
                  <Text variant="caption" tone="secondary">{tk.owner} · {tk.member}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  {overdue ? <AlertTriangle size={11} color={t.danger} /> : <Clock size={11} color={t.textMuted} />}
                  <Text variant="caption" weight={sla.weight} style={{ color: sla.fg }}>{tk.sla}</Text>
                </View>
                <ChevronRight size={14} color={t.textMuted} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  staffBanner: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: space.md, paddingVertical: 6 },
  filters: { paddingHorizontal: space.lg, paddingVertical: space.sm, gap: space.sm },
  filterChip: { paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1 },
  ticket: { padding: space.md, borderRadius: radius.md },
  priorityPill: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: radius.sm },
  statusPill: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: radius.sm },
  metaRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth },
});
