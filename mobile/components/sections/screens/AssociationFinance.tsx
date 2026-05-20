import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Settings,
  Crown,
  Calendar,
  Download,
  Plus,
  Sparkles,
  ChevronRight,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { DuesPaymentModal } from "@/components/sections/screens/DuesPaymentModal";
import { SubscriptionPaymentModal } from "@/components/sections/screens/SubscriptionPaymentModal";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";

// ============================================================================
// Data (mirrors per-association finance state)
// ============================================================================

type Tab = "overview" | "ledger" | "dues" | "approvals" | "subscription";

type Association = {
  id: string;
  name: string;
  brand: [string, string];
  currency: "CHF" | "EUR";
  role: "President" | "Treasurer" | "Secretary" | "Organizer" | "Member";
};

const ASSOCIATIONS: Record<string, Association> = {
  ma1: { id: "ma1", name: "Senegalese Union of Switzerland", brand: [palette.indigo[600], palette.amber[400]], currency: "CHF", role: "Treasurer" },
  ma2: { id: "ma2", name: "Latina Tanda Network", brand: [palette.rose[500], palette.amber[400]], currency: "CHF", role: "Member" },
  ma3: { id: "ma3", name: "Geneva Diaspora Welfare", brand: [palette.emerald[600], palette.indigo[500]], currency: "CHF", role: "Secretary" },
  ma4: { id: "ma4", name: "West African Heritage Foundation", brand: [palette.amber[500], palette.indigo[700]], currency: "CHF", role: "President" },
};

const OVERVIEW = {
  totalBalance: 86400,
  collected: 24800,
  disbursed: 18200,
  efBalance: 4320,
  runwayMonths: 14,
  pendingApprovals: 6,
  delta: 12.4, // % vs last month
};

const RECENT_TRANSACTIONS = [
  { id: "tx1", type: "in" as const, label: "Annual dues · 14 members", category: "Dues", amount: 1680, at: "2026-05-19T09:14:00Z" },
  { id: "tx2", type: "out" as const, label: "Payout · Main CHF Circle Cycle 8", category: "Payout", amount: 2400, at: "2026-05-18T14:00:00Z" },
  { id: "tx3", type: "in" as const, label: "Cultural night ticket sales", category: "Events", amount: 480, at: "2026-05-17T20:30:00Z" },
  { id: "tx4", type: "out" as const, label: "EF claim · Awa N. medical aid", category: "Emergency Fund", amount: 600, at: "2026-05-16T11:00:00Z" },
  { id: "tx5", type: "in" as const, label: "Stripe subscription Pro plan", category: "Subscription", amount: 99, at: "2026-05-15T08:00:00Z" },
  { id: "tx6", type: "in" as const, label: "Contribution · Welfare Booster", category: "Contributions", amount: 1200, at: "2026-05-14T07:30:00Z" },
];

const LEDGER_MONTHS = [
  {
    month: "May 2026",
    in: 3360,
    out: 3000,
    entries: 24,
    categories: [
      { name: "Dues", in: 1680, out: 0 },
      { name: "Contributions", in: 1200, out: 0 },
      { name: "Events", in: 480, out: 0 },
      { name: "Payouts", in: 0, out: 2400 },
      { name: "Emergency Fund", in: 0, out: 600 },
    ],
  },
  {
    month: "April 2026",
    in: 5180,
    out: 4920,
    entries: 31,
    categories: [
      { name: "Dues", in: 2100, out: 0 },
      { name: "Contributions", in: 2880, out: 0 },
      { name: "Events", in: 200, out: 0 },
      { name: "Payouts", in: 0, out: 4800 },
      { name: "Refunds", in: 0, out: 120 },
    ],
  },
  {
    month: "March 2026",
    in: 4780,
    out: 4200,
    entries: 28,
    categories: [],
  },
];

const MEMBER_DUES = [
  { id: "m1", name: "Aminata Diallo", status: "paid" as const, amount: 120, due: "2026-04-30", paid: "2026-04-28" },
  { id: "m2", name: "Kofi Mensah", status: "paid" as const, amount: 120, due: "2026-04-30", paid: "2026-04-29" },
  { id: "m3", name: "Mariama Sow", status: "owed" as const, amount: 120, due: "2026-05-31" },
  { id: "m4", name: "Cheikh Diop", status: "overdue" as const, amount: 120, due: "2026-04-30" },
  { id: "m5", name: "Awa Ndiaye", status: "paid" as const, amount: 120, due: "2026-04-30", paid: "2026-05-02" },
  { id: "m6", name: "Ibrahima Sarr", status: "dispute" as const, amount: 120, due: "2026-04-30" },
  { id: "m7", name: "Zara Bekele", status: "paid" as const, amount: 120, due: "2026-04-30", paid: "2026-04-30" },
];

const PENDING_APPROVALS = [
  {
    id: "ap1",
    type: "disbursement" as const,
    title: "Above-threshold payout request",
    description: "Welfare claim · CHF 1,800 to Sekou Touré",
    amount: 1800,
    requestedBy: "Cheikh Diop · Organizer",
    requestedAt: "2026-05-19T08:00:00Z",
    needsCoSign: true,
  },
  {
    id: "ap2",
    type: "refund" as const,
    title: "Member dues refund",
    description: "Dispute resolved in member favour",
    amount: 120,
    requestedBy: "Ibrahima Sarr · Member",
    requestedAt: "2026-05-18T17:30:00Z",
    needsCoSign: false,
  },
  {
    id: "ap3",
    type: "manual" as const,
    title: "Manual ledger adjustment",
    description: "Bank fee correction · Q2 reconciliation",
    amount: 45,
    requestedBy: "You · Treasurer",
    requestedAt: "2026-05-18T11:00:00Z",
    needsCoSign: true,
  },
];

const SUBSCRIPTION = {
  tier: "Pro",
  price: 99,
  cadence: "month",
  nextRenewal: "2026-06-15",
  autoRenew: true,
  memberCap: 200,
  memberUsage: 248,
  circleCap: "Unlimited",
  kycThresholdOk: true,
  invoices: [
    { id: "in1", date: "2026-05-15", amount: 99, status: "paid" as const },
    { id: "in2", date: "2026-04-15", amount: 99, status: "paid" as const },
    { id: "in3", date: "2026-03-15", amount: 99, status: "paid" as const },
  ],
};

// ============================================================================
// Helpers
// ============================================================================

function fmt(amount: number, currency: string, sign?: "+" | "-") {
  const prefix = sign === "+" ? "+" : sign === "-" ? "−" : "";
  return `${prefix}${currency} ${amount.toLocaleString("en-CH")}`;
}

function relativeTime(iso: string, now = new Date()) {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString("en-CH", { day: "2-digit", month: "short" });
}

function duesStatusTone(s: "paid" | "owed" | "overdue" | "dispute", t: AppTheme) {
  switch (s) {
    case "paid":
      return { fg: t.success, bg: t.successSoft, label: "Paid" };
    case "owed":
      return { fg: t.textSecondary, bg: t.bgMuted, label: "Owed" };
    case "overdue":
      return { fg: t.danger, bg: t.dangerSoft, label: "Overdue" };
    case "dispute":
      return { fg: t.warning, bg: t.warningSoft, label: "Dispute" };
  }
}

// ============================================================================
// Sub-components
// ============================================================================

function SegmentedTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: Tab; label: string; count?: number }[];
  value: Tab;
  onChange: (v: Tab) => void;
}) {
  const t = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm }}
    >
      {tabs.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
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
  );
}

function KpiCard({
  label,
  value,
  sub,
  Icon,
  toneFg,
  toneBg,
  t,
}: {
  label: string;
  value: string;
  sub?: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  toneFg: string;
  toneBg: string;
  t: AppTheme;
}) {
  return (
    <View style={[styles.kpiCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.kpiIcon, { backgroundColor: toneBg }]}>
        <Icon size={14} color={toneFg} />
      </View>
      <Text variant="micro" weight="semibold" tone="muted" style={{ marginTop: space.sm, letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>
        {value}
      </Text>
      {sub ? (
        <Text variant="micro" tone="secondary">
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

// ============================================================================
// Tabs
// ============================================================================

function OverviewTab({ a, t, associationId }: { a: Association; t: AppTheme; associationId: string }) {
  return (
    <View style={{ gap: space.lg }}>
      <View style={styles.kpiGrid}>
        <KpiCard label="Total balance" value={fmt(OVERVIEW.totalBalance, a.currency)} sub={`+${OVERVIEW.delta}% vs last month`} Icon={Wallet} toneFg={t.primary} toneBg={t.primarySoft} t={t} />
        <KpiCard label="Emergency fund" value={fmt(OVERVIEW.efBalance, a.currency)} sub={`${OVERVIEW.runwayMonths} months runway`} Icon={ShieldCheck} toneFg={t.success} toneBg={t.successSoft} t={t} />
      </View>
      <View style={styles.kpiGrid}>
        <KpiCard label="Collected" value={fmt(OVERVIEW.collected, a.currency)} sub="this month" Icon={TrendingUp} toneFg={t.success} toneBg={t.successSoft} t={t} />
        <KpiCard label="Disbursed" value={fmt(OVERVIEW.disbursed, a.currency)} sub="this month" Icon={TrendingDown} toneFg={t.danger} toneBg={t.dangerSoft} t={t} />
      </View>

      <View style={[styles.runwayCard, { backgroundColor: t.surface, borderColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
          <Sparkles size={14} color={t.info} />
          <Text variant="caption" weight="bold" tone="secondary" style={{ letterSpacing: 0.8 }}>
            PROJECTED RUNWAY
          </Text>
        </View>
        <Text variant="body" tone="secondary">
          At current burn (CHF {(OVERVIEW.disbursed - OVERVIEW.collected > 0 ? OVERVIEW.disbursed - OVERVIEW.collected : 309).toLocaleString()} / month), funds last <Text variant="body" weight="bold">{OVERVIEW.runwayMonths} months</Text>.
        </Text>
        <View style={[styles.runwayBar, { backgroundColor: t.bgMuted }]}>
          <LinearGradient colors={[t.success, t.warning]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.runwayFill, { width: "78%" }]} />
        </View>
      </View>

      {/* Recent transactions */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text variant="h3" weight="bold">Recent transactions</Text>
          <Text variant="caption" tone="accent" weight="semibold">See all</Text>
        </View>
        <View style={[styles.listCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          {RECENT_TRANSACTIONS.map((tx, idx) => (
            <View
              key={tx.id}
              style={[
                styles.txRow,
                {
                  borderBottomColor: t.border,
                  borderBottomWidth: idx === RECENT_TRANSACTIONS.length - 1 ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View
                style={[
                  styles.txIcon,
                  { backgroundColor: tx.type === "in" ? t.successSoft : t.dangerSoft },
                ]}
              >
                {tx.type === "in" ? (
                  <ArrowDownLeft size={14} color={t.success} />
                ) : (
                  <ArrowUpRight size={14} color={t.danger} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
                  {tx.label}
                </Text>
                <Text variant="micro" tone="secondary">
                  {tx.category} · {relativeTime(tx.at)}
                </Text>
              </View>
              <Text
                variant="bodySmall"
                weight="bold"
                style={{ color: tx.type === "in" ? t.success : t.danger }}
              >
                {fmt(tx.amount, a.currency, tx.type === "in" ? "+" : "-")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick links */}
      <View style={{ flexDirection: "row", gap: space.sm }}>
        <CtaCard Icon={FileText} label="Reports" hint="PDF / CSV exports" t={t} onPress={() => router.push(`/associations/${associationId}/finance/reports` as never)} />
        <CtaCard Icon={Settings} label="Dues config" hint="Amount, frequency, late fee" t={t} />
      </View>
    </View>
  );
}

function CtaCard({
  Icon,
  label,
  hint,
  t,
  onPress,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  hint: string;
  t: AppTheme;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.ctaCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.ctaIcon, { backgroundColor: t.primarySoft }]}>
        <Icon size={16} color={t.primary} />
      </View>
      <Text variant="bodySmall" weight="bold" style={{ marginTop: space.sm }}>
        {label}
      </Text>
      <Text variant="micro" tone="secondary">
        {hint}
      </Text>
    </Pressable>
  );
}

function LedgerTab({ a, t, associationId }: { a: Association; t: AppTheme; associationId: string }) {
  return (
    <View style={{ gap: space.lg }}>
      {/* Subscription banner */}
      <View style={[styles.subBanner, { backgroundColor: t.primary }]}>
        <View style={{ flex: 1 }}>
          <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1 }}>
            {SUBSCRIPTION.tier.toUpperCase()} PLAN · ACTIVE
          </Text>
          <Text variant="bodySmall" weight="semibold" style={{ color: "#fff", marginTop: 2 }}>
            Next billing {SUBSCRIPTION.nextRenewal} · {fmt(SUBSCRIPTION.price, a.currency)}/mo
          </Text>
        </View>
        <Pressable style={styles.subBtn}>
          <Text variant="caption" weight="bold" style={{ color: t.primary }}>
            View invoice
          </Text>
        </Pressable>
      </View>

      {/* Monthly entries */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text variant="h3" weight="bold">Monthly ledger</Text>
          <Pressable
            onPress={() => router.push(`/associations/${associationId}/finance/reports` as never)}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Download size={13} color={t.primary} />
            <Text variant="caption" tone="accent" weight="semibold">Export</Text>
          </Pressable>
        </View>
        <View style={{ gap: space.md }}>
          {LEDGER_MONTHS.map((m) => {
            const net = m.in - m.out;
            const positive = net >= 0;
            return (
              <View
                key={m.month}
                style={[styles.monthCard, { backgroundColor: t.surface, borderColor: t.border }]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                    <Text variant="body" weight="bold">{m.month}</Text>
                    <Text variant="micro" tone="secondary">{m.entries} entries</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text variant="h3" weight="bold" style={{ color: positive ? t.success : t.danger }}>
                      {fmt(Math.abs(net), a.currency, positive ? "+" : "-")}
                    </Text>
                    <Text variant="micro" tone="muted">net</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: space.md, marginTop: space.sm }}>
                  <View style={[styles.miniStat, { backgroundColor: t.successSoft }]}>
                    <ArrowDownLeft size={11} color={t.success} />
                    <Text variant="micro" weight="bold" style={{ color: t.success }}>
                      {fmt(m.in, a.currency)}
                    </Text>
                  </View>
                  <View style={[styles.miniStat, { backgroundColor: t.dangerSoft }]}>
                    <ArrowUpRight size={11} color={t.danger} />
                    <Text variant="micro" weight="bold" style={{ color: t.danger }}>
                      {fmt(m.out, a.currency)}
                    </Text>
                  </View>
                </View>
                {m.categories.length > 0 ? (
                  <View style={{ marginTop: space.md, gap: 6 }}>
                    {m.categories.map((c) => (
                      <View key={c.name} style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text variant="caption" style={{ flex: 1 }} tone="secondary">
                          {c.name}
                        </Text>
                        {c.in > 0 ? (
                          <Text variant="caption" weight="semibold" style={{ color: t.success, marginLeft: space.sm }}>
                            {fmt(c.in, a.currency, "+")}
                          </Text>
                        ) : null}
                        {c.out > 0 ? (
                          <Text variant="caption" weight="semibold" style={{ color: t.danger, marginLeft: space.sm }}>
                            {fmt(c.out, a.currency, "-")}
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function DuesTab({ a, t, associationId, onPay }: { a: Association; t: AppTheme; associationId: string; onPay: () => void }) {
  const paid = MEMBER_DUES.filter((m) => m.status === "paid").length;
  const overdue = MEMBER_DUES.filter((m) => m.status === "overdue").length;
  const dispute = MEMBER_DUES.filter((m) => m.status === "dispute").length;

  return (
    <View style={{ gap: space.lg }}>
      <View style={[styles.duesConfig, { backgroundColor: t.surface, borderColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
          <View style={[styles.kpiIcon, { backgroundColor: t.primarySoft }]}>
            <Coins size={16} color={t.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.6 }}>
              DUES CONFIGURATION
            </Text>
            <Text variant="h3" weight="bold">
              {fmt(120, a.currency)} / year
            </Text>
            <Text variant="caption" tone="secondary">
              30-day grace · 2% late fee · auto-charged via Stripe
            </Text>
          </View>
          {a.role === "Treasurer" || a.role === "President" ? (
            <Pressable style={[styles.editPill, { borderColor: t.border }]}>
              <Settings size={12} color={t.textSecondary} />
              <Text variant="micro" weight="semibold" tone="secondary">
                Edit
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: space.sm }}>
        <DuesStat label="Paid" value={paid} tone="success" t={t} />
        <DuesStat label="Overdue" value={overdue} tone="danger" t={t} />
        <DuesStat label="Disputes" value={dispute} tone="warning" t={t} />
      </View>

      {/* Member list */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text variant="h3" weight="bold">Member dues · April 2026</Text>
          <Text variant="caption" tone="accent" weight="semibold">
            Send reminders
          </Text>
        </View>
        <View style={[styles.listCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          {MEMBER_DUES.map((m, idx) => {
            const tone = duesStatusTone(m.status, t);
            return (
              <Pressable
                key={m.id}
                onPress={() => router.push(`/associations/${associationId}/finance/member/${m.id}` as never)}
                style={[
                  styles.memberRow,
                  {
                    borderBottomColor: t.border,
                    borderBottomWidth: idx === MEMBER_DUES.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <View style={[styles.memberAvatar, { backgroundColor: t.primarySoft }]}>
                  <Text variant="caption" weight="bold" style={{ color: t.primary }}>
                    {m.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
                    {m.name}
                  </Text>
                  <Text variant="micro" tone="secondary">
                    {m.status === "paid" && m.paid ? `Paid ${m.paid}` : `Due ${m.due}`}
                  </Text>
                </View>
                <Text variant="bodySmall" weight="semibold" style={{ marginRight: space.sm }}>
                  {fmt(m.amount, a.currency)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: tone.bg }]}>
                  <Text variant="micro" weight="bold" style={{ color: tone.fg }}>
                    {tone.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Member-facing pay CTA */}
      {a.role === "Member" ? (
        <View style={[styles.payCta, { backgroundColor: t.primary }]}>
          <View style={{ flex: 1 }}>
            <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1 }}>
              YOUR DUES
            </Text>
            <Text variant="body" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
              {fmt(120, a.currency)} due May 31
            </Text>
          </View>
          <Pressable onPress={onPay} style={styles.subBtn}>
            <Text variant="caption" weight="bold" style={{ color: t.primary }}>
              Pay now
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* Treasurer/President also need a quick pay button for the dues config card flow */}
      {a.role !== "Member" ? (
        <Pressable
          onPress={onPay}
          style={[styles.payCta, { backgroundColor: t.bgMuted, borderWidth: 1, borderColor: t.border }]}
        >
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="semibold" tone="secondary">
              Demo dues payment modal
            </Text>
            <Text variant="micro" tone="muted">
              Preview the payment sheet members see
            </Text>
          </View>
          <ChevronRight size={16} color={t.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

function DuesStat({ label, value, tone, t }: { label: string; value: number; tone: "success" | "danger" | "warning"; t: AppTheme }) {
  const map = {
    success: { fg: t.success, bg: t.successSoft },
    danger: { fg: t.danger, bg: t.dangerSoft },
    warning: { fg: t.warning, bg: t.warningSoft },
  } as const;
  const c = map[tone];
  return (
    <View style={[styles.duesStat, { backgroundColor: c.bg }]}>
      <Text variant="h2" weight="bold" style={{ color: c.fg }}>
        {value}
      </Text>
      <Text variant="micro" weight="semibold" style={{ color: c.fg, letterSpacing: 0.5 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function ApprovalsTab({ a, t }: { a: Association; t: AppTheme }) {
  return (
    <View style={{ gap: space.md }}>
      <View style={styles.sectionHeaderRow}>
        <Text variant="h3" weight="bold">Pending approvals</Text>
        <Text variant="caption" tone="muted" weight="semibold">
          {PENDING_APPROVALS.length} items
        </Text>
      </View>
      {PENDING_APPROVALS.map((ap) => (
        <View
          key={ap.id}
          style={[styles.approvalCard, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={[
                styles.typeChip,
                { backgroundColor: ap.type === "disbursement" ? t.dangerSoft : ap.type === "refund" ? t.warningSoft : t.primarySoft },
              ]}
            >
              <Text
                variant="micro"
                weight="bold"
                style={{
                  color:
                    ap.type === "disbursement"
                      ? t.danger
                      : ap.type === "refund"
                        ? t.warning
                        : t.primary,
                  letterSpacing: 0.6,
                }}
              >
                {ap.type.toUpperCase()}
              </Text>
            </View>
            {ap.needsCoSign ? (
              <View style={[styles.cosignChip, { backgroundColor: t.warningSoft }]}>
                <Crown size={9} color={t.warning} />
                <Text variant="micro" weight="bold" style={{ color: t.warning }}>
                  CO-SIGN REQUIRED
                </Text>
              </View>
            ) : null}
            <Text variant="micro" tone="muted" style={{ marginLeft: "auto" }}>
              {relativeTime(ap.requestedAt)}
            </Text>
          </View>

          <Text variant="body" weight="bold" style={{ marginTop: space.sm }}>
            {ap.title}
          </Text>
          <Text variant="bodySmall" tone="secondary">
            {ap.description}
          </Text>

          <View style={[styles.approvalMeta, { borderTopColor: t.border }]}>
            <View>
              <Text variant="micro" tone="muted" weight="semibold">AMOUNT</Text>
              <Text variant="h3" weight="bold" style={{ color: ap.type === "manual" ? t.warning : t.danger }}>
                {fmt(ap.amount, a.currency)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text variant="micro" tone="muted" weight="semibold">REQUESTED BY</Text>
              <Text variant="caption" weight="semibold" align="right">
                {ap.requestedBy}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
            <Pressable style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <X size={13} color={t.danger} />
              <Text variant="caption" weight="semibold" style={{ color: t.danger }}>
                Reject
              </Text>
            </Pressable>
            <Pressable style={[styles.btnPrimary, { backgroundColor: t.success }]}>
              <CheckCircle2 size={14} color="#fff" />
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                Approve
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={[styles.auditNote, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
        <AlertTriangle size={14} color={t.textSecondary} />
        <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
          All decisions are logged to the immutable audit trail with timestamp and signer.
        </Text>
      </View>
    </View>
  );
}

function SubscriptionTab({ a, t, onUpgrade }: { a: Association; t: AppTheme; onUpgrade: () => void }) {
  const usagePct = (SUBSCRIPTION.memberUsage / SUBSCRIPTION.memberCap) * 100;
  const overCap = usagePct > 100;

  return (
    <View style={{ gap: space.lg }}>
      {/* Tier card */}
      <View style={[styles.tierCard, { backgroundColor: t.primary }]}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
              CURRENT PLAN
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.sm, marginTop: space.xs }}>
              <Text variant="display" weight="bold" style={{ color: "#fff" }}>
                {SUBSCRIPTION.tier}
              </Text>
              <Text variant="body" style={{ color: "rgba(255,255,255,0.85)" }}>
                {fmt(SUBSCRIPTION.price, a.currency)} / {SUBSCRIPTION.cadence}
              </Text>
            </View>
          </View>
          <View style={[styles.autoChip, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
            <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
              {SUBSCRIPTION.autoRenew ? "AUTO-RENEW ON" : "AUTO-RENEW OFF"}
            </Text>
          </View>
        </View>
        <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.md }}>
          Renews {SUBSCRIPTION.nextRenewal} · via Stripe · {fmt(SUBSCRIPTION.price, a.currency)}
        </Text>
      </View>

      {/* Usage gauges */}
      <View style={[styles.usageCard, { backgroundColor: t.surface, borderColor: t.border }]}>
        <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.6, marginBottom: space.sm }}>
          MEMBER CAP USAGE
        </Text>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.sm }}>
          <Text variant="h2" weight="bold" style={{ color: overCap ? t.danger : t.textPrimary }}>
            {SUBSCRIPTION.memberUsage}
          </Text>
          <Text variant="caption" tone="secondary">
            of {SUBSCRIPTION.memberCap} included · {(usagePct).toFixed(0)}%
          </Text>
        </View>
        <View style={[styles.usageBar, { backgroundColor: t.bgMuted, marginTop: space.sm }]}>
          <View
            style={[
              styles.usageFill,
              {
                width: `${Math.min(usagePct, 100)}%`,
                backgroundColor: overCap ? t.danger : usagePct > 80 ? t.warning : t.success,
              },
            ]}
          />
        </View>
        {overCap ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: space.sm }}>
            <AlertTriangle size={13} color={t.danger} />
            <Text variant="caption" weight="semibold" style={{ color: t.danger, flex: 1 }}>
              Over member cap — overage billed at CHF 0.50/member/month
            </Text>
          </View>
        ) : null}

        <View style={{ height: 1, backgroundColor: t.border, marginVertical: space.md }} />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <CheckCircle2 size={13} color={t.success} />
          <Text variant="caption" tone="secondary">
            KYC threshold compliant · contributions under CHF 500/mo per member
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: space.sm }}>
        <Pressable onPress={onUpgrade} style={[styles.upgradeBtn, { backgroundColor: t.accent }]}>
          <Crown size={14} color="#fff" />
          <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
            Upgrade
          </Text>
        </Pressable>
        <Pressable onPress={onUpgrade} style={[styles.cancelBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
          <Text variant="bodySmall" weight="semibold" tone="secondary">
            Manage billing
          </Text>
        </Pressable>
      </View>

      {/* Billing history */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text variant="h3" weight="bold">Billing history</Text>
          <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Download size={13} color={t.primary} />
            <Text variant="caption" tone="accent" weight="semibold">All invoices</Text>
          </Pressable>
        </View>
        <View style={[styles.listCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          {SUBSCRIPTION.invoices.map((inv, idx) => (
            <View
              key={inv.id}
              style={[
                styles.invoiceRow,
                {
                  borderBottomColor: t.border,
                  borderBottomWidth: idx === SUBSCRIPTION.invoices.length - 1 ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View style={[styles.txIcon, { backgroundColor: t.successSoft }]}>
                <CheckCircle2 size={14} color={t.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">
                  Pro plan · {SUBSCRIPTION.cadence}
                </Text>
                <Text variant="micro" tone="secondary">
                  {inv.date} · paid via Stripe
                </Text>
              </View>
              <Text variant="bodySmall" weight="bold">
                {fmt(inv.amount, a.currency)}
              </Text>
              <ChevronRight size={16} color={t.textMuted} style={{ marginLeft: space.sm }} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// Main
// ============================================================================

export function AssociationFinance({ id }: { id: string }) {
  const t = useTheme();
  const a = ASSOCIATIONS[id] ?? ASSOCIATIONS.ma1;
  const [tab, setTab] = useState<Tab>("overview");
  const [duesModalOpen, setDuesModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Hero header */}
        <LinearGradient
          colors={a.brand}
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
              <Calendar size={16} color="#fff" />
            </Pressable>
            <Pressable hitSlop={12} style={[styles.iconBtn, { marginLeft: space.sm }]}>
              <Plus size={18} color="#fff" />
            </Pressable>
          </View>
          <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2, marginTop: space.lg }}>
            FINANCE · {a.role.toUpperCase()}
          </Text>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: 4 }}>
            {a.name}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            Treasury, dues, approvals, and subscription — all in one place.
          </Text>
        </LinearGradient>

        {/* Tabs */}
        <View style={{ marginTop: space.lg }}>
          <SegmentedTabs
            tabs={[
              { value: "overview", label: "Overview" },
              { value: "ledger", label: "Ledger" },
              { value: "dues", label: "Dues", count: MEMBER_DUES.length },
              { value: "approvals", label: "Approvals", count: PENDING_APPROVALS.length },
              { value: "subscription", label: "Subscription" },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>

        {/* Tab content */}
        <View style={{ paddingHorizontal: space.lg, paddingTop: space.lg }}>
          {tab === "overview" ? <OverviewTab a={a} t={t} associationId={id} /> : null}
          {tab === "ledger" ? <LedgerTab a={a} t={t} associationId={id} /> : null}
          {tab === "dues" ? <DuesTab a={a} t={t} associationId={id} onPay={() => setDuesModalOpen(true)} /> : null}
          {tab === "approvals" ? <ApprovalsTab a={a} t={t} /> : null}
          {tab === "subscription" ? <SubscriptionTab a={a} t={t} onUpgrade={() => setSubModalOpen(true)} /> : null}
        </View>
      </ScrollView>

      <DuesPaymentModal
        visible={duesModalOpen}
        onClose={() => setDuesModalOpen(false)}
        amount={120}
        currency={a.currency}
      />
      <SubscriptionPaymentModal
        visible={subModalOpen}
        onClose={() => setSubModalOpen(false)}
      />
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

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

  kpiGrid: {
    flexDirection: "row",
    gap: space.sm,
  },
  kpiCard: {
    flex: 1,
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

  runwayCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  runwayBar: {
    height: 6,
    borderRadius: 3,
    marginTop: space.sm,
    overflow: "hidden",
  },
  runwayFill: {
    height: "100%",
    borderRadius: 3,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.sm,
  },

  listCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: space.md,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.md,
  },
  txIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  ctaCard: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  ctaIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  subBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
  },
  subBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.md,
  },

  monthCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  miniStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },

  // Dues
  duesConfig: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  editPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  duesStat: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.md,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  payCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
  },

  // Approvals
  approvalCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  typeChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  cosignChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  approvalMeta: {
    flexDirection: "row",
    paddingTop: space.md,
    marginTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btnGhost: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 11,
    borderRadius: radius.md,
  },
  auditNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  // Subscription
  tierCard: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  autoChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  usageCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  usageBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  usageFill: {
    height: "100%",
    borderRadius: 4,
  },
  upgradeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: radius.md,
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  invoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.md,
  },
});
