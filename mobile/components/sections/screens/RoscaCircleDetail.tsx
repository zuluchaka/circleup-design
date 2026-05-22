import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Wallet,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Award,
  Banknote,
  FileText,
  Repeat,
  Settings as SettingsIcon,
  UserPlus,
  ListOrdered,
  Gavel,
  Coins,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { StatChip } from "@/components/shared/StatChip";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type CircleRecord = typeof rosca.circles[number];
type RosterEntry = typeof rosca.circleRoster[number];
type PayoutEntry = typeof rosca.payoutSchedule[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function formatShortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CH", { day: "2-digit", month: "short" });
}

function yourStatusTone(s: string): "success" | "warning" | "danger" | "primary" {
  return s === "Paid" ? "success" : s === "Overdue" ? "danger" : s === "Due" ? "warning" : "primary";
}

// ---------------------------------------------------------------------------
// ProgressRing
// ---------------------------------------------------------------------------

function ProgressRing({
  value,
  color,
  size = 96,
  thickness = 10,
  centerTop,
  centerBottom,
  t,
}: {
  value: number;
  color: string;
  size?: number;
  thickness?: number;
  centerTop: string;
  centerBottom?: string;
  t: AppTheme;
}) {
  const ringR = (size - thickness) / 2;
  const circumference = 2 * Math.PI * ringR;
  const dash = Math.max(0, Math.min(1, value)) * circumference;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <SvgCircle cx={size / 2} cy={size / 2} r={ringR} stroke={t.bgMuted} strokeWidth={thickness} fill="none" />
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={ringR}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text variant="h2" weight="bold" style={{ color: "#fff" }}>
        {centerTop}
      </Text>
      {centerBottom ? (
        <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 0.8 }}>
          {centerBottom}
        </Text>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Stat tile (4-up)
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
        <Icon size={13} color={toneColor} />
      </View>
      <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.6, marginTop: space.xs }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h3" weight="bold" style={{ marginTop: 2 }}>{value}</Text>
      {sub ? <Text variant="micro" tone="secondary">{sub}</Text> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Quick-Nav chip
// ---------------------------------------------------------------------------

const QUICK_NAV: { id: string; label: string; route: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: "participants",    label: "Participants",    route: "/sections/rosca-circles/participants",      Icon: Users },
  { id: "payout-schedule", label: "Payouts",         route: "/sections/rosca-circles/payout-schedule",   Icon: Calendar },
  { id: "bidding",         label: "Bidding",         route: "/sections/rosca-circles/bidding",           Icon: Gavel },
  { id: "swap",            label: "Position swap",   route: "/sections/rosca-circles/position-swap",     Icon: Repeat },
  { id: "ef",              label: "Emergency fund",  route: "/sections/rosca-circles/emergency-fund",    Icon: ShieldAlert },
  { id: "treasurer",       label: "Treasurer",       route: "/sections/rosca-circles/treasurer",         Icon: Coins },
  { id: "risk",            label: "Risk scores",     route: "/sections/rosca-circles/risk-scores",       Icon: Award },
  { id: "disputes",        label: "Disputes",        route: "/sections/rosca-circles/disputes",          Icon: AlertTriangle },
  { id: "documents",       label: "Documents",       route: "/sections/rosca-circles/documents",         Icon: FileText },
  { id: "settings",        label: "Settings",        route: "/sections/rosca-circles/settings",          Icon: SettingsIcon },
  { id: "cash",            label: "Cash collection", route: "/sections/rosca-circles/cash-collection",   Icon: Banknote },
  { id: "invite",          label: "Invite",          route: "/sections/rosca-circles/invite",            Icon: UserPlus },
  { id: "waitlist",        label: "Waitlist",        route: "/sections/rosca-circles/waitlist",          Icon: ListOrdered },
];

function QuickNavChip({
  Icon,
  label,
  onPress,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.quickChip, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <Icon size={14} color={t.primary} />
      <Text variant="caption" weight="semibold">{label}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Members list rows
// ---------------------------------------------------------------------------

function MemberRow({ row, t, isLast }: { row: RosterEntry; t: AppTheme; isLast: boolean }) {
  return (
    <View style={[styles.rosterRow, { borderBottomColor: t.border, borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth }]}>
      <Avatar name={row.name} size="sm" />
      <View style={{ flex: 1, marginLeft: space.sm }}>
        <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{row.name}</Text>
        <Text variant="caption" tone="muted">Trust {row.trust} · Slot #{row.slot}</Text>
      </View>
      <StatChip
        label={row.status === "EF" ? "Covered by EF" : row.status}
        tone={row.status === "Paid" ? "success" : row.status === "EF" ? "warning" : row.status === "Due" ? "warning" : "danger"}
        compact
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Payout timeline
// ---------------------------------------------------------------------------

function PayoutTimelineRow({
  entry,
  isLast,
  isCurrent,
  t,
}: {
  entry: PayoutEntry;
  isLast: boolean;
  isCurrent: boolean;
  t: AppTheme;
}) {
  const isPaid = entry.status === "Paid";
  const dotColor = isPaid ? t.success : isCurrent ? t.primary : t.textMuted;
  const dotBg = isPaid ? t.successSoft : isCurrent ? t.primarySoft : t.bgMuted;
  return (
    <View style={{ flexDirection: "row", gap: space.sm, alignItems: "stretch" }}>
      <View style={{ alignItems: "center", width: 24 }}>
        <View style={[styles.timelineDot, { backgroundColor: dotBg, borderColor: dotColor }]}>
          {isPaid ? <CheckCircle2 size={10} color={dotColor} /> : isCurrent ? <Clock size={10} color={dotColor} /> : null}
        </View>
        {!isLast ? <View style={[styles.timelineLine, { backgroundColor: t.border }]} /> : null}
      </View>
      <View
        style={{
          flex: 1,
          paddingBottom: isLast ? 0 : space.md,
          flexDirection: "row",
          alignItems: "center",
          gap: space.sm,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.6 }}>
              CYCLE {entry.cycle}
            </Text>
            {isCurrent ? (
              <View style={[styles.currentPill, { backgroundColor: t.primary }]}>
                <Text variant="micro" weight="bold" style={{ color: "#fff" }}>NEXT</Text>
              </View>
            ) : null}
          </View>
          <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{entry.to}</Text>
          <Text variant="caption" tone="secondary">
            {formatShortDate(entry.date)} · {entry.status}
          </Text>
        </View>
        <Text variant="bodySmall" weight="bold" style={{ color: isPaid ? t.success : isCurrent ? t.primary : t.textPrimary }}>
          {formatCurrency(entry.amount, "CHF")}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaCircleDetail() {
  const t = useTheme();
  const circle = rosca.circles[0] as CircleRecord & {
    associationName?: string;
    organizerName?: string;
    organizerTrust?: number;
    paymentMode?: string;
    payoutMethod?: string;
    yourPosition?: number;
    totalCollected?: number;
    totalDisbursed?: number;
    onTimeRate?: number;
    emergencyFundRate?: number;
    gracePeriodDays?: number;
    latePenalty?: number;
    language?: string;
  };
  const roster = rosca.circleRoster as RosterEntry[];
  const payouts = rosca.payoutSchedule as PayoutEntry[];
  const recent = (rosca as unknown as { recentContributions: { id: string; name: string; amount: number; currency: string; method: string; at: string; status: string }[] }).recentContributions;
  const efActivity = (rosca as unknown as { emergencyFundActivity: { id: string; kind: string; member: string; cycle: number; amount: number; currency: string; at: string; note: string }[] }).emergencyFundActivity;

  const cyclePct = circle.cycleLength === 0 ? 0 : circle.cycle / circle.cycleLength;
  const currentCycle = payouts.find((p) => p.cycle === circle.cycle);
  const upcomingCycle = payouts.find((p) => p.status === "Upcoming") ?? payouts.find((p) => p.cycle === circle.cycle + 1) ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl + 80 }}>
        {/* Hero header */}
        <LinearGradient
          colors={[circle.accent, palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={[styles.heroTopRow, { paddingTop: space.lg }]}>
            <Pressable onPress={() => router.back()} style={styles.heroIconBtn}>
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
            <View style={[styles.statusPillHero, { backgroundColor: "rgba(16,185,129,0.25)" }]}>
              <ShieldCheck size={11} color={palette.emerald[100]} />
              <Text variant="micro" weight="bold" style={{ color: palette.emerald[100], letterSpacing: 0.8 }}>
                ACTIVE
              </Text>
            </View>
          </View>

          <View style={{ marginTop: space.lg }}>
            <Text variant="caption" weight="bold" style={{ color: palette.indigo[200], letterSpacing: 1.5 }}>
              {(circle.associationName ?? "").toUpperCase()}
            </Text>
            <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xs }}>
              {circle.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 }}>
              <Avatar name={circle.organizerName ?? ""} size="xs" />
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.9)" }}>
                Organized by {circle.organizerName}
                {circle.organizerTrust ? ` · Trust ${circle.organizerTrust}` : ""}
              </Text>
            </View>
          </View>

          <View style={[styles.heroBody, { marginTop: space.lg }]}>
            <ProgressRing
              value={cyclePct}
              color="#fff"
              centerTop={`${circle.cycle}/${circle.cycleLength}`}
              centerBottom="CYCLE"
              t={t}
            />
            <View style={{ flex: 1, gap: space.xs }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>
                NEXT CONTRIBUTION
              </Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>
                {formatCurrency(circle.yourDueAmount || circle.contribution, circle.currency)}
              </Text>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)" }}>
                Due {formatShortDate(circle.nextDue)} · {circle.cadence}
              </Text>
              <Pressable
                onPress={() => router.push("/sections/rosca-circles/contribute" as never)}
                style={styles.payNowBtn}
              >
                <Text variant="caption" weight="bold" style={{ color: circle.accent }}>Pay now</Text>
                <ChevronRight size={12} color={circle.accent} />
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          {/* 4-up stats */}
          <View style={styles.statsGrid}>
            <StatTile
              Icon={Calendar}
              label="Progress"
              value={`${Math.round(cyclePct * 100)}%`}
              sub={`${circle.cycle}/${circle.cycleLength} cycles`}
              toneColor={t.primary}
              t={t}
            />
            <StatTile
              Icon={Users}
              label="Members"
              value={`${circle.members}/${circle.maxMembers}`}
              sub={`Slot ${circle.yourPosition ?? "—"} is you`}
              toneColor={t.info}
              t={t}
            />
            <StatTile
              Icon={Wallet}
              label="Collected"
              value={formatCurrency(circle.totalCollected ?? 0, circle.currency)}
              sub={circle.collectionRate ? `${Math.round(circle.collectionRate * 100)}% rate` : undefined}
              toneColor={t.success}
              t={t}
            />
            <StatTile
              Icon={ShieldAlert}
              label="Emergency fund"
              value={formatCurrency(circle.emergencyFund, circle.currency)}
              sub={circle.emergencyFundRate ? `${(circle.emergencyFundRate * 100).toFixed(0)}% of each contribution` : undefined}
              toneColor={t.warning}
              t={t}
            />
          </View>

          {/* Quick-Nav */}
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              QUICK NAVIGATION
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.xs }}>
              {QUICK_NAV.map((q) => (
                <QuickNavChip
                  key={q.id}
                  Icon={q.Icon}
                  label={q.label}
                  onPress={() => router.push(q.route as never)}
                  t={t}
                />
              ))}
            </ScrollView>
          </View>

          {/* My Participation */}
          <Card padded tone="primarySoft" bordered={false}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <Award size={16} color={t.primary} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>My participation</Text>
              <StatChip label={circle.yourStatus} tone={yourStatusTone(circle.yourStatus)} compact />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space.md }}>
              <View style={{ flex: 1 }}>
                <Text variant="micro" tone="muted" weight="semibold">YOUR SLOT</Text>
                <Text variant="bodySmall" weight="bold">#{circle.yourPosition ?? "—"} of {circle.maxMembers}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="micro" tone="muted" weight="semibold">CONTRIBUTED</Text>
                <Text variant="bodySmall" weight="bold">{formatCurrency(circle.totalContributed, circle.currency)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="micro" tone="muted" weight="semibold">PAYOUT WHEN</Text>
                <Text variant="bodySmall" weight="bold">
                  {payouts.find((p) => p.to.toLowerCase().includes("you"))?.date
                    ? formatShortDate(payouts.find((p) => p.to.toLowerCase().includes("you"))!.date)
                    : "—"}
                </Text>
              </View>
            </View>
          </Card>

          {/* Progress (cycle bar + summary) */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <TrendingUp size={16} color={t.success} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>This cycle</Text>
              <Text variant="caption" weight="bold" tone="muted">
                Cycle {circle.cycle} of {circle.cycleLength}
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: t.bgMuted }]}>
              <View style={[styles.progressFg, { width: `${cyclePct * 100}%`, backgroundColor: circle.accent }]} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
              <View>
                <Text variant="micro" tone="muted" weight="semibold">CONTRIBUTION</Text>
                <Text variant="bodySmall" weight="bold">{formatCurrency(circle.contribution, circle.currency)} {circle.cadence.toLowerCase()}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text variant="micro" tone="muted" weight="semibold">NEXT PAYOUT</Text>
                <Text variant="bodySmall" weight="bold">{currentCycle?.to ?? circle.nextPayoutTo} · {formatShortDate(circle.nextPayoutDate)}</Text>
              </View>
            </View>
          </Card>

          {/* Members list */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <Users size={16} color={t.textSecondary} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>Members</Text>
              <Pressable onPress={() => router.push("/sections/rosca-circles/participants" as never)}>
                <Text variant="caption" weight="bold" tone="accent">View all →</Text>
              </Pressable>
            </View>
            {roster.slice(0, 5).map((m, i) => (
              <MemberRow key={m.id} row={m} t={t} isLast={i === Math.min(roster.length, 5) - 1} />
            ))}
            <Text variant="caption" tone="secondary" style={{ marginTop: space.sm, textAlign: "center" }}>
              {roster.length} members · {circle.organizerName} is organizer
            </Text>
          </Card>

          {/* Payout schedule timeline */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.md }}>
              <Calendar size={16} color={t.textSecondary} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>Payout schedule</Text>
              <Pressable onPress={() => router.push("/sections/rosca-circles/payout-schedule" as never)}>
                <Text variant="caption" weight="bold" tone="accent">Full timeline →</Text>
              </Pressable>
            </View>
            {payouts.slice(circle.cycle - 1, circle.cycle + 3).map((p, i, arr) => (
              <PayoutTimelineRow
                key={p.cycle}
                entry={p}
                isLast={i === arr.length - 1}
                isCurrent={p.cycle === circle.cycle + 1 || (p.status === "Upcoming" && upcomingCycle?.cycle === p.cycle)}
                t={t}
              />
            ))}
          </Card>

          {/* Recent contributions */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <Banknote size={16} color={t.textSecondary} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>Recent contributions</Text>
              <Text variant="caption" tone="muted">Cycle {circle.cycle}</Text>
            </View>
            {recent.map((c, i) => (
              <View
                key={c.id}
                style={[styles.contribRow, { borderBottomColor: t.border, borderBottomWidth: i === recent.length - 1 ? 0 : StyleSheet.hairlineWidth }]}
              >
                <Avatar name={c.name} size="xs" />
                <View style={{ flex: 1, marginLeft: space.sm }}>
                  <Text variant="caption" weight="semibold" numberOfLines={1}>{c.name}</Text>
                  <Text variant="micro" tone="secondary">
                    {c.method} · {formatShortDate(c.at)}
                  </Text>
                </View>
                {c.status === "covered_by_ef" ? (
                  <StatChip label="EF covered" tone="warning" compact />
                ) : (
                  <Text variant="caption" weight="bold" style={{ color: t.success }}>
                    {formatCurrency(c.amount, c.currency)}
                  </Text>
                )}
              </View>
            ))}
          </Card>

          {/* Financial summary */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <TrendingUp size={16} color={t.success} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>Financial summary</Text>
            </View>
            <View style={[styles.kvRow, { borderBottomColor: t.border }]}>
              <Text variant="caption" tone="secondary">Total collected</Text>
              <Text variant="caption" weight="bold">{formatCurrency(circle.totalCollected ?? 0, circle.currency)}</Text>
            </View>
            <View style={[styles.kvRow, { borderBottomColor: t.border }]}>
              <Text variant="caption" tone="secondary">Total disbursed</Text>
              <Text variant="caption" weight="bold">{formatCurrency(circle.totalDisbursed ?? 0, circle.currency)}</Text>
            </View>
            <View style={[styles.kvRow, { borderBottomColor: t.border }]}>
              <Text variant="caption" tone="secondary">Emergency fund balance</Text>
              <Text variant="caption" weight="bold" style={{ color: t.warning }}>{formatCurrency(circle.emergencyFund, circle.currency)}</Text>
            </View>
            <View style={[styles.kvRow, { borderBottomWidth: 0 }]}>
              <Text variant="caption" tone="secondary">On-time payment rate</Text>
              <Text variant="caption" weight="bold">{circle.onTimeRate ? `${Math.round(circle.onTimeRate * 100)}%` : "—"}</Text>
            </View>
          </Card>

          {/* Circle settings summary */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <SettingsIcon size={16} color={t.textSecondary} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>Settings summary</Text>
              <Pressable onPress={() => router.push("/sections/rosca-circles/settings" as never)}>
                <Text variant="caption" weight="bold" tone="accent">Edit →</Text>
              </Pressable>
            </View>
            <View style={[styles.kvRow, { borderBottomColor: t.border }]}>
              <Text variant="caption" tone="secondary">Payout method</Text>
              <Text variant="caption" weight="bold" style={{ textTransform: "capitalize" }}>
                {(circle.payoutMethod ?? "fixed").replace("_", " ")}
              </Text>
            </View>
            <View style={[styles.kvRow, { borderBottomColor: t.border }]}>
              <Text variant="caption" tone="secondary">Payment mode</Text>
              <Text variant="caption" weight="bold" style={{ textTransform: "capitalize" }}>
                {(circle.paymentMode ?? "stripe_only").replace("_", " ")}
              </Text>
            </View>
            <View style={[styles.kvRow, { borderBottomColor: t.border }]}>
              <Text variant="caption" tone="secondary">Grace period</Text>
              <Text variant="caption" weight="bold">{circle.gracePeriodDays ?? 0} days</Text>
            </View>
            <View style={[styles.kvRow, { borderBottomColor: t.border }]}>
              <Text variant="caption" tone="secondary">Late penalty</Text>
              <Text variant="caption" weight="bold">{circle.latePenalty ? `${(circle.latePenalty * 100).toFixed(0)}%` : "None"}</Text>
            </View>
            <View style={[styles.kvRow, { borderBottomWidth: 0 }]}>
              <Text variant="caption" tone="secondary">Language</Text>
              <Text variant="caption" weight="bold">{circle.language ?? "EN"}</Text>
            </View>
          </Card>

          {/* Emergency Fund activity */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <ShieldAlert size={16} color={t.warning} />
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>Emergency fund activity</Text>
              <Pressable onPress={() => router.push("/sections/rosca-circles/emergency-fund" as never)}>
                <Text variant="caption" weight="bold" tone="accent">Manage →</Text>
              </Pressable>
            </View>
            {efActivity.map((ev, i) => (
              <View
                key={ev.id}
                style={[styles.efRow, { borderBottomColor: t.border, borderBottomWidth: i === efActivity.length - 1 ? 0 : StyleSheet.hairlineWidth }]}
              >
                <View
                  style={[
                    styles.efIcon,
                    {
                      backgroundColor:
                        ev.kind === "intervention" ? t.warningSoft : ev.kind === "repayment" ? t.successSoft : t.primarySoft,
                    },
                  ]}
                >
                  {ev.kind === "intervention" ? (
                    <AlertTriangle size={11} color={t.warning} />
                  ) : ev.kind === "repayment" ? (
                    <CheckCircle2 size={11} color={t.success} />
                  ) : (
                    <Coins size={11} color={t.primary} />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: space.sm }}>
                  <Text variant="caption" weight="semibold">
                    {ev.member} · Cycle {ev.cycle}
                  </Text>
                  <Text variant="micro" tone="secondary">{ev.note}</Text>
                </View>
                <Text
                  variant="caption"
                  weight="bold"
                  style={{ color: ev.kind === "intervention" ? t.warning : ev.kind === "repayment" ? t.success : t.primary }}
                >
                  {formatCurrency(ev.amount, ev.currency)}
                </Text>
              </View>
            ))}
          </Card>

          {/* Bottom contribute CTA */}
          <View style={{ gap: space.sm }}>
            <Button
              label={`Contribute ${circle.currency} ${circle.yourDueAmount}`}
              size="lg"
              fullWidth
              onPress={() => router.push("/sections/rosca-circles/contribute" as never)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 32,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroIconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  statusPillHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  heroBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.lg,
  },
  payNowBtn: {
    alignSelf: "flex-start",
    marginTop: space.xs,
    backgroundColor: "#fff",
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },

  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFg: {
    height: "100%",
    borderRadius: 5,
  },

  rosterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  contribRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  efRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  efIcon: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginVertical: 2,
  },
  currentPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
});
