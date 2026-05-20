import { useMemo } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  AlertTriangle,
  Briefcase,
  Receipt,
  Building2,
  Sparkles,
  CircleDot,
  ShieldCheck,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import { CURRENT_USER } from "@/data/currentUser";
import {
  RELATIONSHIPS,
  BR_TIER_LABEL,
  type BrTier,
  type BusinessRelationship,
} from "@/data/businessRelationships";

// ============================================================================
// Aggregations
// ============================================================================

function computeMetrics(items: BusinessRelationship[]) {
  const today = Date.now();
  const ms30 = 30 * 24 * 60 * 60 * 1000;
  const ms90 = 90 * 24 * 60 * 60 * 1000;

  const active = items.filter((i) => i.status === "active");
  const pending = items.filter((i) => i.status === "pending");
  const suspended = items.filter((i) => i.status === "suspended");
  const terminated = items.filter((i) => i.status === "terminated");

  const mrr = active.reduce((s, i) => s + i.monthlyRevenue, 0);
  const overdueBilling = items
    .filter((i) => (i.overdueAmount ?? 0) > 0)
    .reduce((s, i) => s + (i.overdueAmount ?? 0), 0);

  const churnRisk = items.filter((i) => i.isChurnRisk);
  const expiringThisMonth = items.filter(
    (i) =>
      i.contractEndDate &&
      new Date(i.contractEndDate).getTime() - today <= ms30 &&
      new Date(i.contractEndDate).getTime() - today > 0,
  );
  const renewalsNext90 = items.filter(
    (i) =>
      i.status === "active" &&
      i.contractEndDate &&
      new Date(i.contractEndDate).getTime() - today <= ms90 &&
      new Date(i.contractEndDate).getTime() - today > 0,
  );

  // Tier mix: count active BRs per tier
  const tierMix: Record<BrTier, number> = { free: 0, basic: 0, pro: 0 };
  for (const br of active) tierMix[br.tier]++;
  const tierMrr: Record<BrTier, number> = { free: 0, basic: 0, pro: 0 };
  for (const br of active) tierMrr[br.tier] += br.monthlyRevenue;

  return {
    totalBrs: items.length,
    activeCount: active.length,
    pendingCount: pending.length,
    suspendedCount: suspended.length,
    terminatedCount: terminated.length,
    mrr,
    overdueBilling,
    churnRisk,
    expiringThisMonthCount: expiringThisMonth.length,
    renewalsNext90,
    tierMix,
    tierMrr,
  };
}

// Synthetic 6-month MRR history for trend bars.
// In production this comes from a billing rollup query.
function fakeMrrHistory(currentMrr: number): { month: string; value: number }[] {
  const now = new Date();
  const out: { month: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleDateString("en-CH", { month: "short" });
    // Synthetic growth curve: ramp up to current MRR
    const factor = 0.55 + (5 - i) * 0.09 + (Math.sin(i * 1.4) * 0.04);
    out.push({ month: monthLabel, value: Math.round(currentMrr * factor) });
  }
  return out;
}

// ============================================================================
// Sub-components
// ============================================================================

function Tile({
  label,
  value,
  hint,
  tone,
  Icon,
  onPress,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone: "success" | "warning" | "danger" | "primary" | "info" | "neutral";
  Icon: typeof TrendingUp;
  onPress?: () => void;
}) {
  const t = useTheme();
  const toneMap = {
    success: { bg: t.successSoft, fg: t.success },
    warning: { bg: t.warningSoft, fg: t.warning },
    danger: { bg: t.dangerSoft, fg: t.danger },
    primary: { bg: t.primarySoft, fg: t.primary },
    info: { bg: t.infoSoft, fg: t.info },
    neutral: { bg: t.bgMuted, fg: t.textSecondary },
  } as const;
  const c = toneMap[tone];
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={[styles.tileIcon, { backgroundColor: c.bg }]}>
        <Icon size={14} color={c.fg} />
      </View>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6, marginTop: space.sm }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>
        {value}
      </Text>
      {hint ? (
        <Text variant="micro" tone="secondary" numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </Pressable>
  );
}

function TierBar({
  tierMix,
  tierMrr,
}: {
  tierMix: Record<BrTier, number>;
  tierMrr: Record<BrTier, number>;
}) {
  const t = useTheme();
  const total = tierMix.free + tierMix.basic + tierMix.pro;
  const totalMrr = tierMrr.free + tierMrr.basic + tierMrr.pro;
  const tierColor = (tier: BrTier) => {
    if (tier === "pro") return t.primary;
    if (tier === "basic") return t.info;
    return t.textMuted;
  };

  return (
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
        <Briefcase size={14} color={t.textMuted} />
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
          TIER MIX
        </Text>
        <Text variant="micro" tone="secondary" style={{ flex: 1, textAlign: "right" }}>
          {total} active · CHF {totalMrr.toLocaleString("en-CH")}/mo
        </Text>
      </View>

      {/* Stacked bar */}
      <View style={[styles.stackedBar, { backgroundColor: t.bgMuted }]}>
        {(["pro", "basic", "free"] as BrTier[]).map((tier) => {
          const pct = total === 0 ? 0 : tierMix[tier] / total;
          if (pct === 0) return null;
          return (
            <View
              key={tier}
              style={{ width: `${pct * 100}%`, backgroundColor: tierColor(tier) }}
            />
          );
        })}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
        {(["pro", "basic", "free"] as BrTier[]).map((tier) => (
          <View key={tier} style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={[styles.legendDot, { backgroundColor: tierColor(tier) }]} />
              <Text variant="micro" weight="bold" style={{ color: tierColor(tier), letterSpacing: 0.4 }}>
                {BR_TIER_LABEL[tier].toUpperCase()}
              </Text>
            </View>
            <Text variant="bodySmall" weight="bold">
              {tierMix[tier]}
            </Text>
            <Text variant="micro" tone="secondary">
              CHF {tierMrr[tier].toLocaleString("en-CH")}/mo
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MrrTrend({ data, current }: { data: { month: string; value: number }[]; current: number }) {
  const t = useTheme();
  const max = Math.max(...data.map((d) => d.value), current);
  const previous = data[data.length - 2]?.value ?? current;
  const delta = current - previous;
  const deltaPct = previous === 0 ? 0 : (delta / previous) * 100;
  const up = delta >= 0;

  return (
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <TrendingUp size={14} color={t.textMuted} />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
              MRR · LAST 6 MONTHS
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ marginTop: 2, color: t.success }}>
            CHF {current.toLocaleString("en-CH")}
          </Text>
        </View>
        <View
          style={[
            styles.deltaPill,
            { backgroundColor: up ? t.successSoft : t.dangerSoft },
          ]}
        >
          {up ? (
            <TrendingUp size={11} color={t.success} />
          ) : (
            <TrendingDown size={11} color={t.danger} />
          )}
          <Text
            variant="micro"
            weight="bold"
            style={{ color: up ? t.success : t.danger }}
          >
            {up ? "+" : ""}
            {deltaPct.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Bar chart */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, marginTop: space.lg, height: 96 }}>
        {data.map((d, i) => {
          const isCurrent = i === data.length - 1;
          const h = max === 0 ? 0 : (d.value / max) * 96;
          return (
            <View key={d.month + i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View
                style={{
                  width: "100%",
                  height: Math.max(h, 4),
                  borderRadius: 6,
                  backgroundColor: isCurrent ? t.primary : t.primarySoft,
                }}
              />
              <Text
                variant="micro"
                weight={isCurrent ? "bold" : "regular"}
                tone={isCurrent ? "primary" : "secondary"}
              >
                {d.month}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function RenewalRow({ br, t }: { br: BusinessRelationship; t: AppTheme }) {
  const today = Date.now();
  const end = br.contractEndDate ? new Date(br.contractEndDate).getTime() : today;
  const days = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
  const urgency = days <= 14 ? "danger" : days <= 30 ? "warning" : "primary";
  const toneMap = { primary: t.primary, warning: t.warning, danger: t.danger } as const;

  return (
    <Pressable
      onPress={() => router.push(`/business-relationships/${br.id}` as never)}
      style={[styles.row, { borderColor: t.border }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: t[`${urgency}Soft` as const] }]}>
        <CalendarClock size={14} color={toneMap[urgency]} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
          {br.associationName}
        </Text>
        <Text variant="micro" tone="secondary">
          {br.reference} · ends{" "}
          {br.contractEndDate
            ? new Date(br.contractEndDate).toLocaleDateString("en-CH", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text variant="bodySmall" weight="bold" style={{ color: toneMap[urgency] }}>
          {days}d
        </Text>
        <Text variant="micro" tone="muted">
          remaining
        </Text>
      </View>
      <ChevronRight size={14} color={t.textMuted} />
    </Pressable>
  );
}

function ChurnRow({ br, t }: { br: BusinessRelationship; t: AppTheme }) {
  return (
    <Pressable
      onPress={() => router.push(`/business-relationships/${br.id}` as never)}
      style={[styles.row, { borderColor: t.border }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: t.dangerSoft }]}>
        <AlertTriangle size={14} color={t.danger} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
          {br.associationName}
        </Text>
        <Text variant="micro" tone="secondary">
          {br.reference} · {br.status}
          {br.graceDaysLeft ? ` · ${br.graceDaysLeft}d grace` : ""}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        {br.overdueAmount && br.overdueAmount > 0 ? (
          <>
            <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
              {br.currency} {br.overdueAmount}
            </Text>
            <Text variant="micro" tone="muted">
              overdue
            </Text>
          </>
        ) : (
          <Text variant="micro" weight="semibold" style={{ color: t.danger }}>
            review now
          </Text>
        )}
      </View>
      <ChevronRight size={14} color={t.textMuted} />
    </Pressable>
  );
}

// ============================================================================
// Main
// ============================================================================

export function BrDashboard() {
  const t = useTheme();
  const m = useMemo(() => computeMetrics(RELATIONSHIPS), []);
  const mrrHistory = useMemo(() => fakeMrrHistory(m.mrr), [m.mrr]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Hero */}
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
                BR DASHBOARD · {CURRENT_USER.employeeId}
              </Text>
              <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {CURRENT_USER.name} · {CURRENT_USER.cmActiveCircles}/{CURRENT_USER.cmMaxCircles} circles
              </Text>
            </View>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.lg }}>
            Portfolio health
          </Text>
          <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            Pipeline metrics, renewals timeline, and churn-risk roll-up across all your BRs.
          </Text>
        </LinearGradient>

        {/* MRR trend */}
        <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
          <MrrTrend data={mrrHistory} current={m.mrr} />
        </View>

        {/* Tile grid */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
          <View style={styles.tileRow}>
            <Tile
              label="Active"
              value={m.activeCount}
              hint="of all BRs"
              tone="success"
              Icon={ShieldCheck}
            />
            <Tile
              label="Pending"
              value={m.pendingCount}
              hint="awaiting signature"
              tone="warning"
              Icon={Sparkles}
            />
          </View>
          <View style={styles.tileRow}>
            <Tile
              label="Suspended"
              value={m.suspendedCount}
              hint="in grace period"
              tone="danger"
              Icon={CircleDot}
            />
            <Tile
              label="Churn risk"
              value={m.churnRisk.length}
              hint="need attention"
              tone="danger"
              Icon={AlertTriangle}
            />
          </View>
          <View style={styles.tileRow}>
            <Tile
              label="Renewals ≤ 90d"
              value={m.renewalsNext90.length}
              hint={`${m.expiringThisMonthCount} this month`}
              tone="warning"
              Icon={CalendarClock}
            />
            <Tile
              label="Overdue"
              value={`CHF ${m.overdueBilling}`}
              hint="across portfolio"
              tone="danger"
              Icon={Receipt}
            />
          </View>
        </View>

        {/* Tier mix */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
          <TierBar tierMix={m.tierMix} tierMrr={m.tierMrr} />
        </View>

        {/* Renewals timeline */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CalendarClock size={14} color={t.textPrimary} />
            <Text variant="h3" weight="bold">
              Upcoming renewals
            </Text>
          </View>
          <Text variant="caption" tone="accent" weight="semibold">
            Next 90 days
          </Text>
        </View>
        <View style={{ paddingHorizontal: space.lg, marginTop: space.sm, gap: space.sm }}>
          {m.renewalsNext90.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text variant="caption" tone="secondary" align="center">
                No renewals due in the next 90 days.
              </Text>
            </View>
          ) : (
            m.renewalsNext90.map((br) => <RenewalRow key={br.id} br={br} t={t} />)
          )}
        </View>

        {/* Churn risk */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <AlertTriangle size={14} color={t.danger} />
            <Text variant="h3" weight="bold">
              Churn risk
            </Text>
          </View>
          <Text variant="caption" tone="accent" weight="semibold">
            {m.churnRisk.length} BR{m.churnRisk.length === 1 ? "" : "s"}
          </Text>
        </View>
        <View style={{ paddingHorizontal: space.lg, marginTop: space.sm, gap: space.sm }}>
          {m.churnRisk.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text variant="caption" tone="secondary" align="center">
                No relationships flagged. Portfolio healthy.
              </Text>
            </View>
          ) : (
            m.churnRisk.map((br) => <ChurnRow key={br.id} br={br} t={t} />)
          )}
        </View>

        {/* Quick links */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.sm }}>
          <Pressable
            onPress={() => router.push("/business-relationships" as never)}
            style={[styles.quickLink, { backgroundColor: t.surface, borderColor: t.border }]}
          >
            <View style={[styles.quickLinkIcon, { backgroundColor: t.primarySoft }]}>
              <Building2 size={16} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold">
                Back to relationships list
              </Text>
              <Text variant="micro" tone="secondary">
                {m.totalBrs} total · {m.activeCount} active
              </Text>
            </View>
            <ChevronRight size={16} color={t.textMuted} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: space.xl + space.lg,
    paddingHorizontal: space.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  card: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },

  // Tile grid
  tileRow: {
    flexDirection: "row",
    gap: space.sm,
    marginBottom: space.sm,
  },
  tile: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tileIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  // MRR trend
  deltaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },

  // Tier bar
  stackedBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty
  emptyCard: {
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
  },

  // Quick link
  quickLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
