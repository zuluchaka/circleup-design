import { View, ScrollView, StyleSheet } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  ShieldCheck,
  ShieldAlert,
  Check,
  Sparkles,
  PlusCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Intervention = {
  id: string;
  memberId: string;
  memberName: string;
  cycle: number;
  amount: number;
  paid: number;
  installments: number;
  installmentsPaid: number;
  at: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------------------
// Balance gauge
// ---------------------------------------------------------------------------

function BalanceGauge({ balance, currency, t }: { balance: number; currency: string; t: AppTheme }) {
  const target = 6000;
  const value = Math.min(1, balance / target);
  const size = 180;
  const thickness = 14;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  // Show a 270° arc (3/4 circle), starting at the bottom-left
  const visibleArc = 0.75;
  const dash = value * (c * visibleArc);
  const trackDash = c * visibleArc;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <SvgCircle
          cx={size / 2} cy={size / 2} r={r}
          stroke={t.bgMuted} strokeWidth={thickness} fill="none"
          strokeDasharray={`${trackDash} ${c}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        <SvgCircle
          cx={size / 2} cy={size / 2} r={r}
          stroke={t.warning} strokeWidth={thickness} fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
        EF BALANCE
      </Text>
      <Text variant="h1" weight="bold" style={{ marginTop: 2 }}>
        {formatCurrency(balance, currency)}
      </Text>
      <Text variant="micro" tone="secondary" weight="semibold" style={{ marginTop: 2 }}>
        {Math.round(value * 100)}% of {formatCurrency(target, currency)} target
      </Text>
    </View>
  );
}

export function RoscaEmergencyFund() {
  const t = useTheme();
  const data = rosca.emergencyFundPanel as {
    balance: number;
    currency: string;
    rate: number;
    perCycle: number;
    totalCovered: number;
    totalRecovered: number;
    activeInterventions: number;
    interventions: Intervention[];
  };

  const active = data.interventions.filter((i) => i.paid < i.amount);
  const resolved = data.interventions.filter((i) => i.paid >= i.amount);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Emergency Fund"
        subtitle="Main CHF Circle"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance hero */}
        <View style={[styles.hero, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={{ alignItems: "center" }}>
            <BalanceGauge balance={data.balance} currency={data.currency} t={t} />
          </View>
          <View style={[styles.heroFooter, { borderTopColor: t.border }]}>
            <FooterStat label="EF rate" value={`${Math.round(data.rate * 100)}%`} sub={`+${formatCurrency(data.perCycle, data.currency)}/cycle`} t={t} />
            <View style={[styles.footerSep, { backgroundColor: t.border }]} />
            <FooterStat label="Total covered" value={formatCurrency(data.totalCovered, data.currency)} sub={`${data.activeInterventions} active`} t={t} />
            <View style={[styles.footerSep, { backgroundColor: t.border }]} />
            <FooterStat label="Recovered" value={formatCurrency(data.totalRecovered, data.currency)} sub={`${Math.round((data.totalRecovered / data.totalCovered) * 100)}% to date`} t={t} />
          </View>
        </View>

        {/* Health note */}
        <View style={[styles.healthCard, { backgroundColor: t.successSoft }]}>
          <View style={[styles.healthIcon, { backgroundColor: t.surface }]}>
            <ShieldCheck size={14} color={t.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.success }}>
              Fund is healthy
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              Current balance covers {Math.floor(data.balance / data.perCycle)} cycles of unbroken coverage at the current contribution rate.
            </Text>
          </View>
        </View>

        {/* Active interventions */}
        {active.length > 0 ? (
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ShieldAlert size={14} color={t.warning} />
                <Text variant="h3" weight="bold">Active interventions</Text>
              </View>
              <Text variant="caption" tone="secondary">{active.length}</Text>
            </View>
            <View style={{ gap: space.sm }}>
              {active.map((i) => (
                <InterventionRow key={i.id} i={i} currency={data.currency} t={t} active />
              ))}
            </View>
          </View>
        ) : null}

        {/* Resolved (historical) */}
        {resolved.length > 0 ? (
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Check size={14} color={t.success} strokeWidth={3} />
                <Text variant="h3" weight="bold">Resolved</Text>
              </View>
              <Text variant="caption" tone="secondary">{resolved.length}</Text>
            </View>
            <Card padded={false}>
              {resolved.map((i, idx) => (
                <ResolvedRow
                  key={i.id}
                  i={i}
                  currency={data.currency}
                  t={t}
                  last={idx === resolved.length - 1}
                />
              ))}
            </Card>
          </View>
        ) : null}

        {/* Top-up disclosure */}
        <View style={[styles.topUp, { backgroundColor: t.bgMuted }]}>
          <Sparkles size={14} color={t.textSecondary} />
          <Text variant="micro" tone="secondary" style={{ flex: 1, lineHeight: 14 }}>
            The fund grows automatically by 1% on every contribution. Members can also top it up voluntarily.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label="Top up the Emergency Fund"
          fullWidth
          size="lg"
          variant="secondary"
          trailingIcon={<PlusCircle size={16} color={t.textPrimary} />}
        />
      </View>
    </View>
  );
}

function FooterStat({ label, value, sub, t }: { label: string; value: string; sub: string; t: AppTheme }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>{value}</Text>
      <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{sub}</Text>
    </View>
  );
}

function InterventionRow({
  i,
  currency,
  t,
  active,
}: {
  i: Intervention;
  currency: string;
  t: AppTheme;
  active?: boolean;
}) {
  const pct = i.installmentsPaid / i.installments;
  const remaining = i.amount - i.paid;
  return (
    <View style={[styles.intRow, { backgroundColor: t.surface, borderColor: active ? t.warning : t.border, borderWidth: active ? 1.5 : 1 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
        <Avatar name={i.memberName} size="sm" />
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="bold">{i.memberName}</Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
            Cycle {i.cycle} · covered {shortDate(i.at)}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
            −{formatCurrency(i.amount, currency)}
          </Text>
          <Text variant="micro" tone="muted" style={{ marginTop: 1 }}>
            {formatCurrency(remaining, currency)} to repay
          </Text>
        </View>
      </View>

      <View style={{ marginTop: space.sm }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <Text variant="micro" tone="secondary" weight="semibold">
            Installment {i.installmentsPaid} of {i.installments}
          </Text>
          <Text variant="micro" weight="bold">{Math.round(pct * 100)}% repaid</Text>
        </View>
        <View style={[styles.intBar, { backgroundColor: t.bgMuted }]}>
          <View style={[styles.intFill, { width: `${pct * 100}%`, backgroundColor: t.warning }]} />
        </View>
      </View>
    </View>
  );
}

function ResolvedRow({ i, currency, t, last }: { i: Intervention; currency: string; t: AppTheme; last: boolean }) {
  return (
    <View style={[styles.resolvedRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.resolvedDot, { backgroundColor: t.successSoft }]}>
        <Check size={11} color={t.success} strokeWidth={3} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="caption" weight="bold">{i.memberName}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          Cycle {i.cycle} · {i.installments} installments · {shortDate(i.at)}
        </Text>
      </View>
      <Text variant="caption" weight="bold" style={{ color: t.success }}>
        +{formatCurrency(i.amount, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  heroFooter: {
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  footerSep: {
    width: 1,
    height: 32,
    marginHorizontal: space.xs,
  },
  healthCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  healthIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  intRow: {
    padding: space.md,
    borderRadius: radius.md,
  },
  intBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  intFill: {
    height: "100%",
    borderRadius: 4,
  },
  resolvedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  resolvedDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  topUp: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
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
});
