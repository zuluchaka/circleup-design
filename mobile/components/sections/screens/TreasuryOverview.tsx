import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import Svg, { Polyline, Circle as SvgCircle } from "react-native-svg";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Banknote,
  HeartHandshake,
  FolderKanban,
  ScanLine,
  ChevronRight,
  Bell,
  Download,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type FundKind = "operating" | "welfare" | "emergency" | "project";

type Fund = {
  id: string;
  name: string;
  kind: FundKind;
  balance: number;
  currency: string;
  available: number;
  pending: number;
  trend: number[];
  maxDisbursement: number;
  signersRequired: number;
};

type ActionItem = {
  id: string;
  kind: "reconciliation" | "unconfirmed" | "expiring_statement" | "expiring_approval";
  label: string;
  detail: string;
  fundId: string | null;
  at: string;
  severity: "info" | "warning" | "danger";
};

type LedgerEntry = {
  id: string;
  at: string;
  fundId: string;
  kind: "credit" | "debit";
  amount: number;
  currency: string;
  category: string;
  label: string;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function fundMeta(kind: FundKind, t: AppTheme) {
  if (kind === "operating") return { color: t.primary, Icon: Banknote };
  if (kind === "welfare")   return { color: t.success, Icon: HeartHandshake };
  if (kind === "emergency") return { color: t.warning, Icon: ShieldCheck };
  return { color: t.info, Icon: FolderKanban };
}

function actionMeta(kind: ActionItem["kind"], severity: ActionItem["severity"], t: AppTheme) {
  const color =
    severity === "danger" ? t.danger :
    severity === "warning" ? t.warning : t.info;
  const bg =
    severity === "danger" ? t.dangerSoft :
    severity === "warning" ? t.warningSoft : t.infoSoft;
  let Icon = AlertCircle;
  if (kind === "reconciliation") Icon = ScanLine;
  else if (kind === "expiring_statement") Icon = Download;
  else if (kind === "expiring_approval") Icon = ShieldAlert;
  return { color, bg, Icon };
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

function Sparkline({ values, color, w = 96, h = 32 }: { values: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <Svg width={w} height={h}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <SvgCircle cx={w} cy={h - ((values[values.length - 1] - min) / range) * h} r={2.5} fill={color} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryOverview() {
  const t = useTheme();
  const o = treasury.overview as {
    totalBalance: number;
    available: number;
    pending: number;
    efBalance: number;
    currency: string;
    weeklyDelta: number;
    actionQueue: ActionItem[];
    funds: Fund[];
    recentLedger: LedgerEntry[];
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Treasury"
        subtitle="Diaspora Circle Geneva"
        trailing={<HeaderIconButton><Bell size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Total balance hero */}
        <View style={[styles.hero, { backgroundColor: t.primary }]}>
          <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1.5 }}>
            TOTAL ACROSS FUNDS
          </Text>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 40, lineHeight: 44, marginTop: space.xs }}>
            {formatCurrency(o.totalBalance, o.currency)}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <ArrowUpRight size={12} color="rgba(255,255,255,0.9)" />
            <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)" }}>
              +{formatCurrency(o.weeklyDelta, o.currency)} this week · {o.funds.length} funds
            </Text>
          </View>
        </View>

        {/* 4-up stats */}
        <View style={styles.statsGrid}>
          <StatTile
            label="Available"
            value={formatCurrency(o.available, o.currency)}
            sub="ready to disburse"
            Icon={Banknote}
            color={t.success}
            t={t}
          />
          <StatTile
            label="Pending"
            value={formatCurrency(o.pending, o.currency)}
            sub="awaiting clearance"
            Icon={TrendingUp}
            color={t.warning}
            t={t}
          />
          <StatTile
            label="EF balance"
            value={formatCurrency(o.efBalance, o.currency)}
            sub="auto-cover"
            Icon={ShieldCheck}
            color={t.warning}
            t={t}
          />
          <StatTile
            label="Funds"
            value={String(o.funds.length)}
            sub="under management"
            Icon={FolderKanban}
            color={t.primary}
            t={t}
          />
        </View>

        {/* Action queue */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <AlertCircle size={14} color={t.warning} />
              <Text variant="h3" weight="bold">Needs attention</Text>
            </View>
            <Text variant="caption" tone="secondary">{o.actionQueue.length}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: space.sm, paddingRight: space.lg }}
          >
            {o.actionQueue.map((a) => (
              <ActionCard key={a.id} a={a} t={t} />
            ))}
          </ScrollView>
        </View>

        {/* Fund grid */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Funds</Text>
            <Pressable
              onPress={() => router.push("/sections/treasury-and-funds/ledger" as never)}
            >
              <Text variant="caption" tone="accent" weight="bold">Full ledger →</Text>
            </Pressable>
          </View>
          <View style={{ gap: space.sm }}>
            {o.funds.map((f) => (
              <FundRow key={f.id} f={f} t={t} />
            ))}
          </View>
        </View>

        {/* Recent ledger preview */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Recent transactions</Text>
            <Pressable
              onPress={() => router.push("/sections/treasury-and-funds/ledger" as never)}
            >
              <Text variant="caption" tone="accent" weight="bold">See all →</Text>
            </Pressable>
          </View>
          <Card padded={false}>
            {o.recentLedger.map((e, i) => (
              <LedgerRow key={e.id} e={e} t={t} last={i === o.recentLedger.length - 1} />
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function StatTile({
  label,
  value,
  sub,
  Icon,
  color,
  t,
}: {
  label: string;
  value: string;
  sub: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  t: AppTheme;
}) {
  return (
    <View style={[styles.stat, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}22` }]}>
        <Icon size={12} color={color} />
      </View>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6, marginTop: space.xs }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }} numberOfLines={1}>{value}</Text>
      <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{sub}</Text>
    </View>
  );
}

function ActionCard({ a, t }: { a: ActionItem; t: AppTheme }) {
  const meta = actionMeta(a.kind, a.severity, t);
  const Icon = meta.Icon;
  return (
    <Pressable style={[styles.actionCard, { backgroundColor: t.surface, borderColor: meta.color, borderLeftColor: meta.color }]}>
      <View style={[styles.actionIcon, { backgroundColor: meta.bg }]}>
        <Icon size={14} color={meta.color} />
      </View>
      <Text variant="caption" weight="bold" numberOfLines={2} style={{ marginTop: space.sm, lineHeight: 16 }}>
        {a.label}
      </Text>
      <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }} numberOfLines={2}>
        {a.detail}
      </Text>
      <Text variant="micro" tone="muted" weight="semibold" style={{ marginTop: space.sm }}>
        {timeAgo(a.at)}
      </Text>
    </Pressable>
  );
}

function FundRow({ f, t }: { f: Fund; t: AppTheme }) {
  const meta = fundMeta(f.kind, t);
  const Icon = meta.Icon;
  return (
    <Pressable
      onPress={() => router.push("/sections/treasury-and-funds/fund-detail" as never)}
      style={[styles.fundRow, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={[styles.fundIcon, { backgroundColor: `${meta.color}22` }]}>
        <Icon size={16} color={meta.color} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="bodySmall" weight="bold">{f.name}</Text>
          {f.kind === "emergency" ? (
            <View style={[styles.efPill, { backgroundColor: t.warningSoft }]}>
              <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>AUTO-COVER</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary">
          {f.signersRequired} signers · max {formatCurrency(f.maxDisbursement, f.currency)}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 2 }}>
        <Text variant="bodySmall" weight="bold">{formatCurrency(f.balance, f.currency)}</Text>
        <Sparkline values={f.trend} color={meta.color} w={64} h={20} />
      </View>
      <ChevronRight size={14} color={t.textMuted} />
    </Pressable>
  );
}

function LedgerRow({ e, t, last }: { e: LedgerEntry; t: AppTheme; last: boolean }) {
  const isCredit = e.kind === "credit";
  return (
    <View style={[styles.ledgerRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.ledgerIcon, { backgroundColor: isCredit ? t.successSoft : t.dangerSoft }]}>
        {isCredit ? (
          <ArrowDownLeft size={12} color={t.success} strokeWidth={3} />
        ) : (
          <ArrowUpRight size={12} color={t.danger} strokeWidth={3} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="caption" weight="bold" numberOfLines={1}>{e.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          {timeAgo(e.at)}
        </Text>
      </View>
      <Text variant="caption" weight="bold" style={{ color: isCredit ? t.success : t.danger }}>
        {isCredit ? "+" : "−"}{formatCurrency(e.amount, e.currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  stat: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCard: {
    width: 220,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  fundRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  fundIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  efPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  ledgerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
