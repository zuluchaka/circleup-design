import { useMemo } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  Bell,
  Plus,
  Users,
  Wallet,
  Clock as ClockIcon,
  CheckCircle2,
  TrendingUp,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type CircleStatus = "active" | "forming" | "completed";
type YourStatus = "Paid" | "Due" | "Overdue" | "Joined";

type Circle = {
  id: string;
  name: string;
  contribution: number;
  currency: string;
  cadence: string;
  status: CircleStatus;
  members: number;
  maxMembers: number;
  cycle: number;
  cycleLength: number;
  yourStatus: YourStatus;
  yourDueAmount: number;
  nextDue: string | null;
  nextPayoutTo: string | null;
  nextPayoutAmount: number;
  nextPayoutDate: string | null;
  totalContributed: number;
  collectionRate: number | null;
  emergencyFund: number;
  accent: string;
};

function yourStatusTone(s: string): "success" | "warning" | "danger" | "primary" {
  return s === "Paid" ? "success" : s === "Overdue" ? "danger" : s === "Due" ? "warning" : "primary";
}

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function shortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CH", { day: "2-digit", month: "short" });
}

// ---------------------------------------------------------------------------
// ProgressRing — small SVG donut showing cycle X / Y
// ---------------------------------------------------------------------------

function ProgressRing({
  value,
  color,
  size = 56,
  thickness = 6,
  label,
  sublabel,
  t,
}: {
  value: number; // 0..1
  color: string;
  size?: number;
  thickness?: number;
  label: string;
  sublabel?: string;
  t: AppTheme;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, value)) * circumference;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={t.bgMuted}
          strokeWidth={thickness}
          fill="none"
        />
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text variant="caption" weight="bold">{label}</Text>
      {sublabel ? (
        <Text variant="micro" tone="muted" weight="semibold">{sublabel}</Text>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// MemberFillBar — for forming circles, shows joined / max members
// ---------------------------------------------------------------------------

function MemberFillBar({ joined, max, accent, t }: { joined: number; max: number; accent: string; t: AppTheme }) {
  const pct = max === 0 ? 0 : Math.min(1, joined / max);
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.6 }}>
          {joined} / {max} JOINED
        </Text>
        <Text variant="micro" tone="secondary" weight="semibold">
          {max - joined} left
        </Text>
      </View>
      <View style={[styles.fillTrack, { backgroundColor: t.bgMuted }]}>
        <View style={[styles.fillFg, { width: `${pct * 100}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// CircleCard — branches by status
// ---------------------------------------------------------------------------

function CircleCard({ circle, t }: { circle: Circle; t: AppTheme }) {
  const onOpen = () => router.push(`/sections/rosca-circles/circle-detail` as never);
  const cyclePct = circle.cycleLength === 0 ? 0 : circle.cycle / circle.cycleLength;

  return (
    <Pressable onPress={onOpen}>
      <Card padded>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
          <View style={[styles.accentDot, { backgroundColor: circle.accent }]} />
          <Text variant="h3" weight="bold" style={{ flex: 1 }} numberOfLines={1}>
            {circle.name}
          </Text>
          {circle.status === "completed" ? (
            <View style={[styles.statusPill, { backgroundColor: t.bgMuted }]}>
              <CheckCircle2 size={10} color={t.textSecondary} />
              <Text variant="micro" weight="bold" tone="secondary">COMPLETED</Text>
            </View>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="caption" tone="muted" weight="semibold">CONTRIBUTION</Text>
            <Text variant="h2" weight="bold">
              {formatCurrency(circle.contribution, circle.currency)}
            </Text>
            <Text variant="caption" tone="secondary">{circle.cadence}</Text>
          </View>

          {circle.status === "active" ? (
            <ProgressRing
              value={cyclePct}
              color={circle.accent}
              label={`${circle.cycle}/${circle.cycleLength}`}
              sublabel="CYCLE"
              t={t}
            />
          ) : circle.status === "forming" ? (
            <View style={{ flex: 1 }}>
              <MemberFillBar joined={circle.members} max={circle.maxMembers} accent={circle.accent} t={t} />
            </View>
          ) : (
            <View style={{ alignItems: "flex-end", gap: 2 }}>
              <Text variant="caption" tone="muted" weight="semibold">CONTRIBUTED</Text>
              <Text variant="h3" weight="bold">
                {formatCurrency(circle.totalContributed, circle.currency)}
              </Text>
            </View>
          )}
        </View>

        {circle.status === "active" ? (
          <View style={[styles.bottomRow, { borderTopColor: t.border }]}>
            <View>
              <Text variant="caption" tone="muted" weight="semibold">YOUR STATUS</Text>
              <View style={{ marginTop: 2, flexDirection: "row" }}>
                <StatChip label={circle.yourStatus} tone={yourStatusTone(circle.yourStatus)} />
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="caption" tone="muted" weight="semibold">NEXT DUE</Text>
              <Text variant="caption" weight="bold">{shortDate(circle.nextDue)}</Text>
              <Text variant="micro" tone="secondary">→ {circle.nextPayoutTo}</Text>
            </View>
          </View>
        ) : circle.status === "forming" ? (
          <View style={[styles.bottomRow, { borderTopColor: t.border }]}>
            <Text variant="caption" tone="secondary">
              Starts when {circle.maxMembers} members join.
            </Text>
            <Text variant="caption" weight="bold" style={{ color: circle.accent }}>
              Invite →
            </Text>
          </View>
        ) : (
          <View style={[styles.bottomRow, { borderTopColor: t.border }]}>
            <Text variant="caption" tone="secondary">
              Wrapped up · {circle.cycleLength} cycles
            </Text>
            <Text variant="caption" weight="bold" style={{ color: t.textSecondary }}>
              View summary →
            </Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Stat tile
// ---------------------------------------------------------------------------

function StatTile({
  Icon,
  label,
  value,
  sub,
  toneColor,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  sub?: string;
  toneColor: string;
  t: AppTheme;
}) {
  return (
    <View style={[styles.statTile, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.statIcon, { backgroundColor: `${toneColor}22` }]}>
        <Icon size={14} color={toneColor} />
      </View>
      <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.6, marginTop: space.xs }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h3" weight="bold" style={{ marginTop: 2 }}>
        {value}
      </Text>
      {sub ? (
        <Text variant="micro" tone="secondary">{sub}</Text>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaMyCircles() {
  const t = useTheme();

  const circles = rosca.circles as Circle[];

  const stats = useMemo(() => {
    const active = circles.filter((c) => c.status === "active");
    const completed = circles.filter((c) => c.status === "completed");
    const totalContributed = circles.reduce((s, c) => s + (c.totalContributed ?? 0), 0);
    const totalFunds = circles.reduce(
      (s, c) => s + c.contribution * c.members * (c.status === "completed" ? c.cycleLength : c.cycle),
      0,
    );
    const upcomingPayouts = active.filter((c) => c.nextPayoutDate).length;
    const currency = circles[0]?.currency ?? "CHF";
    return {
      active: active.length,
      completed: completed.length,
      totalContributed,
      totalFunds,
      upcomingPayouts,
      currency,
    };
  }, [circles]);

  // Pinned Pay-Now: most urgent unpaid active circle
  const payNowCircle = useMemo(() => {
    const candidates = circles
      .filter((c) => c.status === "active" && (c.yourStatus === "Overdue" || c.yourStatus === "Due"))
      .sort((a, b) => {
        const aDate = a.nextDue ? new Date(a.nextDue).getTime() : Infinity;
        const bDate = b.nextDue ? new Date(b.nextDue).getTime() : Infinity;
        return aDate - bDate;
      });
    return candidates[0] ?? null;
  }, [circles]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="My Circles"
        subtitle="Diaspora Circle Geneva"
        trailing={<HeaderIconButton><Bell size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{
          padding: space.lg,
          paddingBottom: payNowCircle ? 160 : space.xxxl,
          gap: space.lg,
        }}
      >
        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatTile
            Icon={Users}
            label="Active"
            value={String(stats.active)}
            sub={`${circles.length} total`}
            toneColor={t.primary}
            t={t}
          />
          <StatTile
            Icon={Wallet}
            label="Contributed"
            value={formatCurrency(stats.totalContributed, stats.currency)}
            sub="this cycle"
            toneColor={t.success}
            t={t}
          />
          <StatTile
            Icon={TrendingUp}
            label="Total funds"
            value={formatCurrency(stats.totalFunds, stats.currency)}
            sub="across circles"
            toneColor={t.warning}
            t={t}
          />
          <StatTile
            Icon={ClockIcon}
            label="Upcoming"
            value={String(stats.upcomingPayouts)}
            sub="payouts"
            toneColor={t.info}
            t={t}
          />
          <StatTile
            Icon={CheckCircle2}
            label="Completed"
            value={String(stats.completed)}
            toneColor={t.textSecondary}
            t={t}
          />
        </View>

        {/* Create circle CTA */}
        <Pressable
          onPress={() => router.push("/sections/rosca-circles/create-wizard" as never)}
          style={[styles.ctaCard, { backgroundColor: t.surface, borderColor: t.border, flexDirection: "row", alignItems: "center", gap: space.md }]}
        >
          <View style={[styles.ctaIcon, { backgroundColor: t.accentSoft }]}>
            <Plus size={18} color={t.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold">Create circle</Text>
            <Text variant="micro" tone="secondary">Multi-step wizard</Text>
          </View>
        </Pressable>

        {/* Circle list */}
        {circles.map((c) => <CircleCard key={c.id} circle={c} t={t} />)}
      </ScrollView>

      {/* Pinned Pay-Now banner */}
      {payNowCircle ? (
        <Pressable
          onPress={() => router.push("/sections/rosca-circles/contribute" as never)}
          style={[
            styles.payNowBanner,
            { backgroundColor: payNowCircle.yourStatus === "Overdue" ? t.danger : t.primary },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1 }}>
              {payNowCircle.yourStatus === "Overdue" ? "OVERDUE" : "DUE SOON"}
            </Text>
            <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
              {payNowCircle.name} · {formatCurrency(payNowCircle.yourDueAmount, payNowCircle.currency)}
            </Text>
            <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)" }}>
              {payNowCircle.yourStatus === "Overdue" ? "Past due" : `Due ${shortDate(payNowCircle.nextDue)}`}
            </Text>
          </View>
          <View style={styles.payNowCta}>
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Pay now</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  statTile: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fillTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  fillFg: {
    height: "100%",
    borderRadius: 4,
  },
  bottomRow: {
    marginTop: space.md,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  payNowBanner: {
    position: "absolute",
    left: space.lg,
    right: space.lg,
    bottom: space.md,
    padding: space.md,
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    shadowColor: palette.slate[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  payNowCta: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.pill,
  },
});
