import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  Check,
  Clock,
  AlertCircle,
  RotateCw,
  Send,
  ShieldCheck,
  Filter,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Status = "Paid" | "Pending" | "Failed" | "Late" | "EF";
type Filter = "all" | "outstanding" | "paid";

type Member = {
  memberId: string;
  name: string;
  slot: number;
  trust: number;
  status: Status;
  amount: number;
  method: string | null;
  paidAt: string | null;
  failureReason: string | null;
  retryCount: number;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const diff = NOW - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function dueShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "Paid") return { color: t.success, bg: t.successSoft, label: "Paid", Icon: Check };
  if (s === "Failed") return { color: t.danger, bg: t.dangerSoft, label: "Failed", Icon: AlertCircle };
  if (s === "Pending") return { color: t.warning, bg: t.warningSoft, label: "Pending", Icon: Clock };
  if (s === "EF") return { color: t.warning, bg: t.warningSoft, label: "EF cover", Icon: ShieldCheck };
  return { color: t.danger, bg: t.dangerSoft, label: "Late", Icon: Clock };
}

// ---------------------------------------------------------------------------
// Collection ring
// ---------------------------------------------------------------------------

function CollectionRing({
  collected,
  expected,
  color,
  size = 100,
  thickness = 10,
  t,
}: {
  collected: number;
  expected: number;
  color: string;
  size?: number;
  thickness?: number;
  t: AppTheme;
}) {
  const value = expected === 0 ? 0 : collected / expected;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.min(1, value) * c;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <SvgCircle cx={size / 2} cy={size / 2} r={r} stroke={t.bgMuted} strokeWidth={thickness} fill="none" />
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text variant="h2" weight="bold">{Math.round(value * 100)}%</Text>
      <Text variant="micro" tone="muted" weight="semibold">collected</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

function FilterTabs({ filter, setFilter, counts, t }: { filter: Filter; setFilter: (f: Filter) => void; counts: Record<Filter, number>; t: AppTheme }) {
  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "outstanding", label: "Outstanding" },
    { id: "paid", label: "Paid" },
  ];
  return (
    <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
      {tabs.map((tab) => {
        const active = filter === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setFilter(tab.id)}
            style={[styles.tabBtn, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
          >
            <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
              {tab.label}
            </Text>
            <View style={[styles.tabCount, { backgroundColor: active ? t.primarySoft : "transparent" }]}>
              <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textMuted }}>
                {counts[tab.id]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Member row
// ---------------------------------------------------------------------------

function MemberRow({ m, currency, t }: { m: Member; currency: string; t: AppTheme }) {
  const meta = statusMeta(m.status, t);
  const Icon = meta.Icon;
  const outstanding = m.status === "Pending" || m.status === "Failed" || m.status === "Late";

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: t.surface,
          borderColor: outstanding ? meta.color : t.border,
          borderWidth: outstanding ? 1.5 : 1,
        },
      ]}
    >
      <View style={styles.slotChip}>
        <Text variant="micro" weight="bold" tone="muted">#{m.slot}</Text>
      </View>
      <Avatar name={m.name} size="sm" />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold" numberOfLines={1}>{m.name}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{m.trust}</Text>
          </View>
        </View>
        {m.status === "Paid" ? (
          <Text variant="micro" tone="muted">
            {m.method} · {timeAgo(m.paidAt)}
          </Text>
        ) : m.status === "Failed" ? (
          <Text variant="micro" tone="danger">
            {m.failureReason} · retry {m.retryCount}
          </Text>
        ) : (
          <Text variant="micro" tone="muted">No attempt yet</Text>
        )}
      </View>
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
          <Icon size={10} color={meta.color} strokeWidth={3} />
          <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
            {meta.label.toUpperCase()}
          </Text>
        </View>
        {outstanding ? (
          <Pressable style={[styles.actionBtn, { backgroundColor: t.bgMuted }]}>
            {m.status === "Failed" ? (
              <RotateCw size={12} color={t.textPrimary} />
            ) : (
              <Send size={12} color={t.textPrimary} />
            )}
            <Text variant="micro" weight="bold" tone="primary">
              {m.status === "Failed" ? "Retry" : "Remind"}
            </Text>
          </Pressable>
        ) : (
          <Text variant="micro" tone="muted" weight="semibold">
            {formatCurrency(m.amount, currency)}
          </Text>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaCycleProgress() {
  const t = useTheme();
  const data = rosca.cycleProgress as {
    cycle: number;
    cycleLength: number;
    dueDate: string;
    perMember: number;
    currency: string;
    expectedTotal: number;
    collectedTotal: number;
    confirmed: number;
    pending: number;
    failed: number;
    payoutRecipient: string;
    payoutAmount: number;
    payoutTriggerable: boolean;
    members: Member[];
  };

  const [filter, setFilter] = useState<Filter>("outstanding");

  const counts = useMemo<Record<Filter, number>>(() => ({
    all: data.members.length,
    outstanding: data.members.filter((m) => m.status !== "Paid" && m.status !== "EF").length,
    paid: data.members.filter((m) => m.status === "Paid").length,
  }), [data.members]);

  const visible = useMemo(() => {
    const sorted = [...data.members].sort((a, b) => {
      const order = { Failed: 0, Pending: 1, Late: 2, EF: 3, Paid: 4 } as const;
      return order[a.status] - order[b.status];
    });
    if (filter === "paid") return sorted.filter((m) => m.status === "Paid");
    if (filter === "outstanding") return sorted.filter((m) => m.status !== "Paid" && m.status !== "EF");
    return sorted;
  }, [filter, data.members]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title={`Cycle ${data.cycle} of ${data.cycleLength}`}
        subtitle={`Due ${dueShort(data.dueDate)} · Main CHF Circle`}
        onBack={() => router.back()}
        trailing={
          <Pressable hitSlop={10}>
            <Filter size={20} color={t.textPrimary} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — collection vs expected */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <CollectionRing collected={data.collectedTotal} expected={data.expectedTotal} color={t.primary} t={t} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                COLLECTED
              </Text>
              <Text variant="h2" weight="bold">
                {formatCurrency(data.collectedTotal, data.currency)}
              </Text>
              <Text variant="micro" tone="secondary">
                of {formatCurrency(data.expectedTotal, data.currency)} expected
              </Text>
              <View style={[styles.shortfall, { backgroundColor: t.dangerSoft }]}>
                <AlertCircle size={11} color={t.danger} />
                <Text variant="micro" weight="bold" style={{ color: t.danger, letterSpacing: 0.5 }}>
                  {formatCurrency(data.expectedTotal - data.collectedTotal, data.currency)} SHORTFALL
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Stat tiles */}
        <View style={styles.statGrid}>
          <StatTile Icon={Check} label="Confirmed" value={data.confirmed} color={t.success} t={t} />
          <StatTile Icon={Clock} label="Pending" value={data.pending} color={t.warning} t={t} />
          <StatTile Icon={AlertCircle} label="Failed" value={data.failed} color={t.danger} t={t} />
        </View>

        {/* Payout recipient card */}
        <View style={[styles.payoutCard, { backgroundColor: data.payoutTriggerable ? t.primary : t.surface, borderColor: data.payoutTriggerable ? t.primary : t.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <Avatar name={data.payoutRecipient} size="md" />
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: data.payoutTriggerable ? "rgba(255,255,255,0.7)" : t.textMuted, letterSpacing: 0.8 }}>
                THIS CYCLE'S RECIPIENT
              </Text>
              <Text variant="bodySmall" weight="bold" style={{ color: data.payoutTriggerable ? "#fff" : t.textPrimary, marginTop: 2 }}>
                {data.payoutRecipient}
              </Text>
              <Text variant="micro" style={{ color: data.payoutTriggerable ? "rgba(255,255,255,0.85)" : t.textSecondary, marginTop: 1 }}>
                Payout {formatCurrency(data.payoutAmount, data.currency)}
              </Text>
            </View>
            <ChevronRight size={16} color={data.payoutTriggerable ? "#fff" : t.textMuted} />
          </View>
          {!data.payoutTriggerable ? (
            <View style={[styles.payoutHint, { backgroundColor: t.bgMuted }]}>
              <Sparkles size={11} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold" style={{ flex: 1 }}>
                Trigger payout unlocks at 100% collection (or EF cover).
              </Text>
            </View>
          ) : null}
        </View>

        {/* Filter */}
        <FilterTabs filter={filter} setFilter={setFilter} counts={counts} t={t} />

        {/* Member list */}
        <View style={{ gap: space.sm }}>
          {visible.map((m) => (
            <MemberRow key={m.memberId} m={m} currency={data.currency} t={t} />
          ))}
        </View>
      </ScrollView>

      {/* CTA dock — bulk actions or trigger payout */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        {data.payoutTriggerable ? (
          <Button
            label={`Trigger payout · ${formatCurrency(data.payoutAmount, data.currency)}`}
            fullWidth
            size="lg"
            trailingIcon={<Check size={18} color="#fff" strokeWidth={3} />}
          />
        ) : (
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Pressable
              style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
            >
              <ShieldCheck size={14} color={t.warning} />
              <Text variant="bodySmall" weight="semibold" style={{ color: t.warning }}>Cover with EF</Text>
            </Pressable>
            <View style={{ flex: 1 }}>
              <Button
                label="Remind all outstanding"
                fullWidth
                size="lg"
                trailingIcon={<Send size={16} color="#fff" />}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function StatTile({
  Icon,
  label,
  value,
  color,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  value: number;
  color: string;
  t: AppTheme;
}) {
  return (
    <View style={[styles.stat, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}22` }]}>
        <Icon size={14} color={color} strokeWidth={3} />
      </View>
      <Text variant="h2" weight="bold" style={{ marginTop: space.xs }}>{value}</Text>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shortfall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  statGrid: {
    flexDirection: "row",
    gap: space.sm,
  },
  stat: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  payoutHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.sm,
    paddingRight: space.md,
    borderRadius: radius.md,
  },
  slotChip: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  ctaDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
