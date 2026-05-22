import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Building2,
  Download,
  Copy,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Banknote,
  Calendar,
  Wallet,
  Receipt,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Status = "active" | "frozen" | "closed" | "pending";
type Kind = "credit" | "debit";
type Category = "contribution" | "payout" | "ef_intervention" | "ef_repayment" | "platform_fee" | "cash" | "refund";

type Ledger = {
  id: string;
  kind: Kind;
  category: Category;
  label: string;
  amount: number;
  currency: string;
  at: string;
  counterparty: string;
  balanceAfter: number;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "active")  return { color: t.success, bg: t.successSoft, label: "Active" };
  if (s === "pending") return { color: t.warning, bg: t.warningSoft, label: "Pending" };
  if (s === "frozen")  return { color: t.danger,  bg: t.dangerSoft,  label: "Frozen" };
  return { color: t.textMuted, bg: t.bgMuted, label: "Closed" };
}

function categoryMeta(c: Category, t: AppTheme) {
  if (c === "contribution")    return { color: t.success, Icon: ArrowDownLeft, label: "Contribution" };
  if (c === "payout")          return { color: t.primary, Icon: ArrowUpRight,  label: "Payout" };
  if (c === "ef_intervention") return { color: t.danger,  Icon: ShieldCheck,   label: "EF cover" };
  if (c === "ef_repayment")    return { color: t.success, Icon: ShieldCheck,   label: "EF repay" };
  if (c === "platform_fee")    return { color: t.warning, Icon: Receipt,       label: "Platform fee" };
  if (c === "cash")            return { color: t.success, Icon: Banknote,      label: "Cash" };
  return { color: t.textMuted, Icon: Banknote, label: "Refund" };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaCircleAccount() {
  const t = useTheme();
  const acc = rosca.circleAccount as {
    accountNumber: string;
    status: Status;
    openedAt: string;
    totalBalance: number;
    contributionsThisCycle: number;
    efBalance: number;
    platformFeesTotal: number;
    currency: string;
    nextPayout: { recipient: string; amount: number; date: string };
    ledger: Ledger[];
  };

  const status = statusMeta(acc.status, t);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Circle account"
        subtitle="Main CHF Circle · B2B ledger"
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Download size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account header card */}
        <View style={[styles.headerCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={[styles.bankIcon, { backgroundColor: t.primarySoft }]}>
              <Building2 size={18} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                ACCOUNT NUMBER
              </Text>
              <Text variant="bodySmall" weight="bold" style={{ fontFamily: "Menlo", marginTop: 2 }} numberOfLines={1}>
                {acc.accountNumber}
              </Text>
            </View>
            <Pressable style={[styles.iconBtn, { backgroundColor: t.bgMuted }]}>
              <Copy size={14} color={t.textPrimary} />
            </Pressable>
          </View>

          <View style={[styles.statusRow, { borderTopColor: t.border }]}>
            <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: status.color }]} />
              <Text variant="micro" weight="bold" style={{ color: status.color, letterSpacing: 0.5 }}>
                {status.label.toUpperCase()}
              </Text>
            </View>
            <Text variant="micro" tone="muted">
              Opened {new Date(acc.openedAt).toLocaleDateString("en-CH", { month: "long", year: "numeric" })}
            </Text>
          </View>
        </View>

        {/* Balance hero */}
        <View style={[styles.hero, { backgroundColor: t.primary }]}>
          <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1.5 }}>
            TOTAL BALANCE
          </Text>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 44, lineHeight: 50, marginTop: space.xs }}>
            {formatCurrency(acc.totalBalance, acc.currency)}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
            Includes Emergency Fund · ledger reconciled hourly
          </Text>
        </View>

        {/* 4-up metrics */}
        <View style={styles.metricGrid}>
          <Metric
            Icon={Wallet}
            label="This cycle"
            value={formatCurrency(acc.contributionsThisCycle, acc.currency)}
            sub="contributions"
            color={t.success}
            t={t}
          />
          <Metric
            Icon={ShieldCheck}
            label="EF balance"
            value={formatCurrency(acc.efBalance, acc.currency)}
            sub="auto-cover"
            color={t.warning}
            t={t}
          />
          <Metric
            Icon={Receipt}
            label="Platform fees"
            value={formatCurrency(acc.platformFeesTotal, acc.currency)}
            sub="lifetime"
            color={t.danger}
            t={t}
          />
          <Metric
            Icon={Calendar}
            label="Next payout"
            value={formatCurrency(acc.nextPayout.amount, acc.currency)}
            sub={shortDate(acc.nextPayout.date)}
            color={t.primary}
            t={t}
          />
        </View>

        {/* Next payout banner */}
        <View style={[styles.payoutBanner, { backgroundColor: t.primarySoft }]}>
          <Avatar name={acc.nextPayout.recipient} size="sm" />
          <View style={{ flex: 1 }}>
            <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.8 }}>
              NEXT PAYOUT
            </Text>
            <Text variant="caption" weight="bold" style={{ marginTop: 2 }}>
              {acc.nextPayout.recipient} · {formatCurrency(acc.nextPayout.amount, acc.currency)}
            </Text>
          </View>
          <Text variant="caption" weight="bold" style={{ color: t.primary }}>
            {shortDate(acc.nextPayout.date)}
          </Text>
        </View>

        {/* Recent transactions */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Recent transactions</Text>
            <Pressable>
              <Text variant="caption" tone="accent" weight="bold">Export →</Text>
            </Pressable>
          </View>
          <Card padded={false}>
            {acc.ledger.map((e, i) => (
              <LedgerRow key={e.id} e={e} t={t} last={i === acc.ledger.length - 1} />
            ))}
          </Card>
        </View>

        {/* Compliance note */}
        <View style={[styles.compliance, { backgroundColor: t.bgMuted }]}>
          <ShieldCheck size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted" weight="semibold" style={{ flex: 1, lineHeight: 14 }}>
            This account is FINMA-registered B2B infrastructure. Statements are exportable for tax and audit.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Metric({
  Icon,
  label,
  value,
  sub,
  color,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
  t: AppTheme;
}) {
  return (
    <View style={[styles.metric, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}22` }]}>
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

function LedgerRow({ e, t, last }: { e: Ledger; t: AppTheme; last: boolean }) {
  const meta = categoryMeta(e.category, t);
  const Icon = meta.Icon;
  const isCredit = e.kind === "credit";

  return (
    <View style={[styles.lRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.lIcon, { backgroundColor: `${meta.color}22` }]}>
        <Icon size={14} color={meta.color} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="caption" weight="bold" numberOfLines={1}>{e.label}</Text>
        <Text variant="micro" tone="secondary">
          {meta.label} · {timeAgo(e.at)} · balance {formatCurrency(e.balanceAfter, e.currency)}
        </Text>
      </View>
      <Text
        variant="bodySmall"
        weight="bold"
        style={{ color: isCredit ? t.success : t.danger }}
      >
        {isCredit ? "+" : "−"}{formatCurrency(e.amount, e.currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: space.sm,
    marginTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  metric: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  metricIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  lRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  lIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  compliance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
});
