import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  Star,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  ShieldAlert,
  Banknote,
  Coins,
  FileText,
  Plus,
  Download,
  AlertTriangle,
  ChevronRight,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";

type LedgerTab = "all" | "dues" | "contributions" | "payouts" | "adjustments";

type LedgerEntry = {
  id: string;
  type: "dues" | "contributions" | "payouts" | "adjustments";
  direction: "in" | "out";
  label: string;
  reference: string;
  amount: number;
  at: string;
  status: "settled" | "pending" | "disputed";
};

type Member = {
  id: string;
  name: string;
  role: "President" | "Treasurer" | "Secretary" | "Organizer" | "Member";
  trustScore: number;
  joinedAt: string;
  duesPaidYtd: number;
  duesOwed: number;
  efDebt: number;
  contributionsYtd: number;
  payoutsYtd: number;
  entries: LedgerEntry[];
};

const MEMBERS: Record<string, Member> = {
  m1: {
    id: "m1",
    name: "Aminata Diallo",
    role: "President",
    trustScore: 945,
    joinedAt: "2023-06-12",
    duesPaidYtd: 120,
    duesOwed: 0,
    efDebt: 0,
    contributionsYtd: 2400,
    payoutsYtd: 6000,
    entries: [
      { id: "e1", type: "dues", direction: "in", label: "Annual dues · 2026", reference: "DUES-2026-001", amount: 120, at: "2026-04-28T09:00:00Z", status: "settled" },
      { id: "e2", type: "contributions", direction: "in", label: "Main CHF Circle · Cycle 7", reference: "CTR-MCC-007", amount: 500, at: "2026-04-05T10:14:00Z", status: "settled" },
      { id: "e3", type: "payouts", direction: "out", label: "Welfare Booster payout received", reference: "PAY-WB-003", amount: 1200, at: "2026-03-22T14:30:00Z", status: "settled" },
      { id: "e4", type: "contributions", direction: "in", label: "Main CHF Circle · Cycle 6", reference: "CTR-MCC-006", amount: 500, at: "2026-03-05T10:00:00Z", status: "settled" },
      { id: "e5", type: "adjustments", direction: "in", label: "Bank fee refund", reference: "ADJ-2026-014", amount: 12, at: "2026-02-18T16:42:00Z", status: "settled" },
      { id: "e6", type: "contributions", direction: "in", label: "Main CHF Circle · Cycle 5", reference: "CTR-MCC-005", amount: 500, at: "2026-02-05T09:30:00Z", status: "settled" },
    ],
  },
  m4: {
    id: "m4",
    name: "Cheikh Diop",
    role: "Organizer",
    trustScore: 812,
    joinedAt: "2024-01-22",
    duesPaidYtd: 0,
    duesOwed: 120,
    efDebt: 60,
    contributionsYtd: 800,
    payoutsYtd: 0,
    entries: [
      { id: "e1", type: "dues", direction: "in", label: "Annual dues · 2026 (overdue)", reference: "DUES-2026-014", amount: 120, at: "2026-04-30T00:00:00Z", status: "pending" },
      { id: "e2", type: "adjustments", direction: "in", label: "Late penalty applied", reference: "ADJ-2026-022", amount: 6, at: "2026-05-08T00:00:00Z", status: "settled" },
      { id: "e3", type: "contributions", direction: "in", label: "Youth Starter · Cycle 2", reference: "CTR-YS-002", amount: 200, at: "2026-04-30T09:00:00Z", status: "settled" },
      { id: "e4", type: "adjustments", direction: "out", label: "EF advance — repaying", reference: "ADJ-EF-008", amount: 60, at: "2026-04-12T11:00:00Z", status: "settled" },
      { id: "e5", type: "contributions", direction: "in", label: "Youth Starter · Cycle 1", reference: "CTR-YS-001", amount: 200, at: "2026-04-16T09:00:00Z", status: "settled" },
    ],
  },
  m6: {
    id: "m6",
    name: "Ibrahima Sarr",
    role: "Member",
    trustScore: 780,
    joinedAt: "2024-08-04",
    duesPaidYtd: 0,
    duesOwed: 120,
    efDebt: 0,
    contributionsYtd: 1000,
    payoutsYtd: 0,
    entries: [
      { id: "e1", type: "dues", direction: "in", label: "Annual dues · 2026 (disputed)", reference: "DUES-2026-018", amount: 120, at: "2026-04-30T00:00:00Z", status: "disputed" },
      { id: "e2", type: "contributions", direction: "in", label: "Main CHF Circle · Cycle 7", reference: "CTR-MCC-007-IS", amount: 500, at: "2026-04-05T10:14:00Z", status: "settled" },
      { id: "e3", type: "contributions", direction: "in", label: "Main CHF Circle · Cycle 6", reference: "CTR-MCC-006-IS", amount: 500, at: "2026-03-05T10:00:00Z", status: "settled" },
    ],
  },
};

function fmt(amount: number, currency = "CHF") {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function entryIcon(type: LedgerEntry["type"]) {
  switch (type) {
    case "dues":
      return Coins;
    case "contributions":
      return Wallet;
    case "payouts":
      return Banknote;
    case "adjustments":
      return ShieldAlert;
  }
}

function statusTone(s: LedgerEntry["status"], t: AppTheme) {
  switch (s) {
    case "settled":
      return { fg: t.success, bg: t.successSoft, label: "Settled" };
    case "pending":
      return { fg: t.warning, bg: t.warningSoft, label: "Pending" };
    case "disputed":
      return { fg: t.danger, bg: t.dangerSoft, label: "Disputed" };
  }
}

export function MemberLedger({
  associationId,
  memberId,
  viewerRole = "Treasurer",
}: {
  associationId: string;
  memberId: string;
  viewerRole?: "Treasurer" | "President" | "Member" | "Secretary" | "Organizer";
}) {
  const t = useTheme();
  const m = MEMBERS[memberId] ?? MEMBERS.m1;
  const [tab, setTab] = useState<LedgerTab>("all");
  const isTreasurer = viewerRole === "Treasurer" || viewerRole === "President";
  const isSelf = viewerRole === "Member" && memberId === "m1";

  const filtered =
    tab === "all" ? m.entries : m.entries.filter((e) => e.type === tab);

  const tabs: { value: LedgerTab; label: string; count?: number }[] = [
    { value: "all", label: "All", count: m.entries.length },
    { value: "dues", label: "Dues", count: m.entries.filter((e) => e.type === "dues").length },
    { value: "contributions", label: "Contributions", count: m.entries.filter((e) => e.type === "contributions").length },
    { value: "payouts", label: "Payouts", count: m.entries.filter((e) => e.type === "payouts").length },
    { value: "adjustments", label: "Adjustments", count: m.entries.filter((e) => e.type === "adjustments").length },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Header */}
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
              <ChevronLeft size={22} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable hitSlop={12} style={styles.iconBtn}>
              <Download size={16} color="#fff" />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.md }}>
            <View style={[styles.avatar, { backgroundColor: palette.indigo[500] }]}>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>
                {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
                MEMBER LEDGER
              </Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>
                {isSelf ? "My ledger" : m.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 4 }}>
                <RoleBadge role={m.role} />
                <View style={[styles.trustChip]}>
                  <Star size={10} color={palette.amber[300]} fill={palette.amber[300]} />
                  <Text variant="micro" weight="bold" style={{ color: palette.amber[200] }}>
                    {m.trustScore}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text variant="caption" style={{ color: "rgba(255,255,255,0.7)", marginTop: space.md }}>
            Member since {new Date(m.joinedAt).toLocaleDateString("en-CH", { month: "short", year: "numeric" })} · Reference {associationId}
          </Text>
        </LinearGradient>

        {/* Summary stats */}
        <View style={styles.summaryGrid}>
          <SummaryStat label="Dues paid YTD" value={fmt(m.duesPaidYtd)} tone="success" t={t} />
          <SummaryStat label="Dues owed" value={fmt(m.duesOwed)} tone={m.duesOwed > 0 ? "danger" : "muted"} t={t} />
        </View>
        <View style={[styles.summaryGrid, { marginTop: space.sm }]}>
          <SummaryStat label="EF debt" value={fmt(m.efDebt)} tone={m.efDebt > 0 ? "warning" : "muted"} t={t} />
          <SummaryStat label="Contributions" value={fmt(m.contributionsYtd)} tone="primary" t={t} />
        </View>
        <View style={{ paddingHorizontal: space.lg, marginTop: space.sm }}>
          <View style={[styles.payoutCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <View style={[styles.kpiIcon, { backgroundColor: t.successSoft }]}>
                <Banknote size={14} color={t.success} />
              </View>
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.6 }}>
                PAYOUTS RECEIVED YTD
              </Text>
            </View>
            <Text variant="h2" weight="bold" style={{ marginTop: 4, color: t.success }}>
              {fmt(m.payoutsYtd)}
            </Text>
          </View>
        </View>

        {/* Quick actions */}
        {isTreasurer ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, flexDirection: "row", gap: space.sm }}>
            <Pressable style={[styles.actionBtn, { backgroundColor: t.primary }]}>
              <Plus size={14} color="#fff" />
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                Manual adjustment
              </Text>
            </Pressable>
            <Pressable style={[styles.actionBtnGhost, { backgroundColor: t.surface, borderColor: t.border }]}>
              <FileText size={14} color={t.textSecondary} />
              <Text variant="bodySmall" weight="semibold" tone="secondary">
                Send statement
              </Text>
            </Pressable>
          </View>
        ) : null}

        {m.efDebt > 0 ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
            <View style={[styles.warnCard, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
              <AlertTriangle size={16} color={t.warning} />
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold" style={{ color: t.warning }}>
                  Outstanding EF debt
                </Text>
                <Text variant="caption" tone="secondary">
                  {fmt(m.efDebt)} owed back to the emergency fund · repaying over 3 contributions
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Tabs */}
        <View style={{ marginTop: space.lg }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm }}
          >
            {tabs.map((opt) => {
              const selected = tab === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setTab(opt.value)}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: selected ? t.primary : t.bgElevated,
                      borderColor: selected ? t.primary : t.border,
                    },
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    weight="semibold"
                    style={{ color: selected ? "#fff" : t.textSecondary }}
                  >
                    {opt.label}
                  </Text>
                  {opt.count !== undefined ? (
                    <View
                      style={[
                        styles.tabCount,
                        { backgroundColor: selected ? "rgba(255,255,255,0.2)" : t.bgMuted },
                      ]}
                    >
                      <Text
                        variant="micro"
                        weight="bold"
                        style={{ color: selected ? "#fff" : t.textSecondary }}
                      >
                        {opt.count}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Timeline */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg }}>
          <View style={[styles.timeline, { backgroundColor: t.surface, borderColor: t.border }]}>
            {filtered.map((entry, idx) => {
              const Icon = entryIcon(entry.type);
              const status = statusTone(entry.status, t);
              return (
                <Pressable
                  key={entry.id}
                  onPress={() => {
                    if (entry.status === "disputed" || entry.type === "dues") {
                      router.push(`/associations/${associationId}/finance/dispute/${entry.id}` as never);
                    }
                  }}
                  style={[
                    styles.entryRow,
                    {
                      borderBottomColor: t.border,
                      borderBottomWidth: idx === filtered.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.entryIcon,
                      { backgroundColor: entry.direction === "in" ? t.successSoft : t.dangerSoft },
                    ]}
                  >
                    <Icon size={14} color={entry.direction === "in" ? t.success : t.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
                      {entry.label}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <Text variant="micro" tone="muted">
                        {entry.reference}
                      </Text>
                      <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: t.textMuted }} />
                      <Text variant="micro" tone="muted">
                        {new Date(entry.at).toLocaleDateString("en-CH", { day: "2-digit", month: "short" })}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      style={{ color: entry.direction === "in" ? t.success : t.danger }}
                    >
                      {entry.direction === "in" ? "+" : "−"} {fmt(entry.amount)}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg, marginTop: 2 }]}>
                      <Text variant="micro" weight="bold" style={{ color: status.fg }}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
            {filtered.length === 0 ? (
              <View style={{ padding: space.xl, alignItems: "center" }}>
                <Text variant="bodySmall" tone="muted">
                  No entries in this category.
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Footer note */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg }}>
          <Text variant="caption" tone="muted" align="center">
            Tap a dues entry to file a dispute or view the audit trail.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryStat({
  label,
  value,
  tone,
  t,
}: {
  label: string;
  value: string;
  tone: "success" | "danger" | "warning" | "primary" | "muted";
  t: AppTheme;
}) {
  const map = {
    success: { fg: t.success, bg: t.successSoft },
    danger: { fg: t.danger, bg: t.dangerSoft },
    warning: { fg: t.warning, bg: t.warningSoft },
    primary: { fg: t.primary, bg: t.primarySoft },
    muted: { fg: t.textSecondary, bg: t.bgMuted },
  } as const;
  const c = map[tone];
  return (
    <View style={[styles.summaryStat, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.kpiIcon, { backgroundColor: c.bg }]}>
        {tone === "success" || tone === "primary" ? (
          <ArrowDownLeft size={14} color={c.fg} />
        ) : (
          <ArrowUpRight size={14} color={c.fg} />
        )}
      </View>
      <Text variant="micro" weight="semibold" tone="muted" style={{ letterSpacing: 0.6, marginTop: space.sm }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ marginTop: 2, color: c.fg }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 56,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  trustChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  summaryGrid: {
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.lg,
    marginTop: -space.lg,
  },
  summaryStat: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  payoutCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  kpiIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.md,
  },
  actionBtnGhost: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  warnCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tabCount: {
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    alignItems: "center",
  },

  timeline: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: space.md,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.md,
  },
  entryIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
});
