import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  ShieldAlert,
  ShieldCheck,
  Wallet,
  Send,
  PauseCircle,
  Bell,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Exception = {
  id: string;
  memberId: string;
  name: string;
  issue: string;
  trust: number;
};

type RecentContribution = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  method: string;
  at: string;
  status: "completed" | "covered_by_ef" | "pending";
};

type EfActivity = {
  id: string;
  kind: "intervention" | "repayment" | "contribution";
  member: string;
  cycle: number;
  amount: number;
  currency: string;
  at: string;
  note: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

function timeAgo(iso: string) {
  const now = new Date("2026-05-22T10:00:00Z").getTime();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// ---------------------------------------------------------------------------
// Collection ring
// ---------------------------------------------------------------------------

function CollectionRing({
  value,
  color,
  size = 64,
  thickness = 7,
  t,
}: {
  value: number;
  color: string;
  size?: number;
  thickness?: number;
  t: AppTheme;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, value)) * c;
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
      <Text variant="bodySmall" weight="bold">{pct(value)}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Summary tile
// ---------------------------------------------------------------------------

function SummaryTile({
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
  sub: string;
  toneColor: string;
  t: AppTheme;
}) {
  return (
    <View style={[styles.summaryTile, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.summaryIcon, { backgroundColor: `${toneColor}22` }]}>
        <Icon size={14} color={toneColor} />
      </View>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.xs }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>{value}</Text>
      <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{sub}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Exception card
// ---------------------------------------------------------------------------

function ExceptionCard({
  exc,
  expanded,
  onToggle,
  t,
}: {
  exc: Exception;
  expanded: boolean;
  onToggle: () => void;
  t: AppTheme;
}) {
  const trustTone =
    exc.trust >= 750 ? { fg: t.success, bg: t.successSoft, label: "STRONG" } :
    exc.trust >= 600 ? { fg: t.warning, bg: t.warningSoft, label: "OK" } :
    { fg: t.danger, bg: t.dangerSoft, label: "AT RISK" };

  return (
    <View style={[styles.excCard, { backgroundColor: t.surface, borderColor: expanded ? t.primary : t.border, borderWidth: expanded ? 1.5 : 1 }]}>
      <Pressable onPress={onToggle} style={styles.excHeader}>
        <Avatar name={exc.name} size="md" />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Text variant="bodySmall" weight="bold">{exc.name}</Text>
            <View style={[styles.trustPill, { backgroundColor: trustTone.bg }]}>
              <Text variant="micro" weight="bold" style={{ color: trustTone.fg, letterSpacing: 0.6 }}>
                T·{exc.trust}
              </Text>
            </View>
          </View>
          <Text variant="micro" tone="danger" weight="semibold" style={{ marginTop: 2 }}>
            {exc.issue}
          </Text>
        </View>
        <View style={[styles.actionPill, { backgroundColor: expanded ? t.primarySoft : t.bgMuted }]}>
          <Text variant="micro" weight="bold" style={{ color: expanded ? t.primary : t.textSecondary, letterSpacing: 0.6 }}>
            {expanded ? "ACTIONS ▾" : "RESOLVE ▸"}
          </Text>
        </View>
      </Pressable>

      {expanded ? (
        <View style={[styles.excActions, { borderTopColor: t.border }]}>
          <ActionButton Icon={Send} label="Send reminder" body="WhatsApp + email" t={t} />
          <ActionButton Icon={ShieldCheck} label="Cover by EF" body="Auto-debit Emergency Fund" highlight t={t} />
          <ActionButton Icon={PauseCircle} label="Mark in-arrears" body="Pause until paid" t={t} danger />
        </View>
      ) : null}
    </View>
  );
}

function ActionButton({
  Icon,
  label,
  body,
  t,
  highlight,
  danger,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  body: string;
  t: AppTheme;
  highlight?: boolean;
  danger?: boolean;
}) {
  const bg = highlight ? t.primarySoft : danger ? t.dangerSoft : t.bgMuted;
  const fg = highlight ? t.primary : danger ? t.danger : t.textPrimary;
  return (
    <Pressable style={[styles.excActionRow, { backgroundColor: bg }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, flex: 1 }}>
        <Icon size={16} color={fg} />
        <View style={{ flex: 1 }}>
          <Text variant="caption" weight="bold" style={{ color: fg }}>{label}</Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{body}</Text>
        </View>
      </View>
      <ArrowRight size={14} color={fg} />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Recent collections row
// ---------------------------------------------------------------------------

function RecentRow({ r, t }: { r: RecentContribution; t: AppTheme }) {
  const covered = r.status === "covered_by_ef";
  return (
    <View style={[styles.recentRow, { borderBottomColor: t.border }]}>
      <Avatar name={r.name} size="sm" />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="caption" weight="bold">{r.name}</Text>
          {covered ? (
            <View style={[styles.efChip, { backgroundColor: t.warningSoft }]}>
              <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>EF</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          {r.method} · {timeAgo(r.at)}
        </Text>
      </View>
      <Text variant="caption" weight="bold" style={{ color: covered ? t.warning : t.success }}>
        {covered ? "Covered" : formatCurrency(r.amount, r.currency)}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaTreasurer() {
  const t = useTheme();
  const circle = rosca.circles[0];
  const treasurer = rosca.treasurer;
  const recent = rosca.recentContributions as RecentContribution[];
  const efActivity = rosca.emergencyFundActivity as EfActivity[];

  const [expandedId, setExpandedId] = useState<string | null>(treasurer.exceptions[0]?.id ?? null);

  const collected = treasurer.collected;
  const atRisk = treasurer.atRisk;
  const ef = treasurer.emergencyFund;

  const cyclePct = circle.cycle / circle.cycleLength;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Treasurer"
        subtitle={circle.name}
        onBack={() => router.back()}
        trailing={
          <HeaderIconButton>
            <Bell size={20} color={t.textPrimary} />
          </HeaderIconButton>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle banner */}
        <View style={[styles.cycleBanner, { backgroundColor: t.primary }]}>
          <View style={{ flex: 1 }}>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: 1.5 }}>
              CYCLE {circle.cycle} OF {circle.cycleLength}
            </Text>
            <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
              Close in 3 days
            </Text>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
              Pot {formatCurrency(circle.nextPayoutAmount, circle.currency)} → Kofi Mensah on 25 May
            </Text>
            <View style={[styles.miniBar, { backgroundColor: "rgba(255,255,255,0.2)", marginTop: space.sm }]}>
              <View style={[styles.miniBarFill, { width: `${cyclePct * 100}%`, backgroundColor: "#fff" }]} />
            </View>
          </View>
          <CollectionRing value={collected} color="#fff" t={t} />
        </View>

        {/* 3-tile summary */}
        <View style={styles.summaryGrid}>
          <SummaryTile
            Icon={TrendingUp}
            label="Collected"
            value={pct(collected)}
            sub="of cycle 8"
            toneColor={t.success}
            t={t}
          />
          <SummaryTile
            Icon={ShieldAlert}
            label="At risk"
            value={String(atRisk)}
            sub="needs action"
            toneColor={t.danger}
            t={t}
          />
          <SummaryTile
            Icon={ShieldCheck}
            label="EF balance"
            value={formatCurrency(ef, circle.currency)}
            sub="auto-covers gaps"
            toneColor={t.warning}
            t={t}
          />
        </View>

        {/* Exceptions */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Needs action</Text>
            <Text variant="caption" tone="secondary">{treasurer.exceptions.length} exception{treasurer.exceptions.length === 1 ? "" : "s"}</Text>
          </View>
          <View style={{ gap: space.sm }}>
            {treasurer.exceptions.map((exc) => (
              <ExceptionCard
                key={exc.id}
                exc={exc as Exception}
                expanded={expandedId === exc.id}
                onToggle={() => setExpandedId(expandedId === exc.id ? null : exc.id)}
                t={t}
              />
            ))}
          </View>
        </View>

        {/* Recent collections */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Recent collections</Text>
            <Pressable>
              <Text variant="caption" tone="accent" weight="semibold">See all</Text>
            </Pressable>
          </View>
          <Card padded={false}>
            {recent.map((r, i) => (
              <View key={r.id} style={i === recent.length - 1 ? { borderBottomWidth: 0 } : null}>
                <RecentRow r={r} t={t} />
              </View>
            ))}
          </Card>
        </View>

        {/* EF activity */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Emergency Fund activity</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Lock size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">Treasurer view</Text>
            </View>
          </View>
          <Card padded>
            {efActivity.map((a, i) => (
              <View
                key={a.id}
                style={[
                  styles.efRow,
                  i < efActivity.length - 1 ? { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth } : null,
                ]}
              >
                <View style={[
                  styles.efKindDot,
                  {
                    backgroundColor:
                      a.kind === "intervention" ? t.dangerSoft :
                      a.kind === "repayment" ? t.successSoft :
                      t.primarySoft,
                  },
                ]}>
                  {a.kind === "intervention" ? <ShieldAlert size={14} color={t.danger} /> :
                   a.kind === "repayment" ? <CheckCircle2 size={14} color={t.success} /> :
                   <Sparkles size={14} color={t.primary} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" weight="bold">{a.member}</Text>
                  <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{a.note} · {timeAgo(a.at)}</Text>
                </View>
                <Text
                  variant="caption"
                  weight="bold"
                  style={{ color: a.kind === "intervention" ? t.danger : t.success }}
                >
                  {a.kind === "intervention" ? "−" : "+"}{formatCurrency(a.amount, a.currency)}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cycleBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
  },
  miniBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  miniBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: space.sm,
  },
  summaryTile: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  excCard: {
    borderRadius: radius.md,
    padding: space.md,
    gap: space.md,
  },
  excHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  actionPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  excActions: {
    gap: space.xs,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  excActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.sm,
    borderRadius: radius.sm,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  efChip: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  efRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.sm,
  },
  efKindDot: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
