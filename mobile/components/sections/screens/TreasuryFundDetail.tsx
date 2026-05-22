import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import Svg, { Polyline, Circle as SvgCircle } from "react-native-svg";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  HeartHandshake,
  ShieldCheck,
  FolderKanban,
  Users,
  Lock,
  Sparkles,
  ScanLine,
  FileText,
  ArrowUpDown,
  Download,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Tab = "ledger" | "reconciliation" | "ef" | "reports";
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
  rules: {
    allowedSources: string[];
    allowedUses: string[];
    maxSingleDisbursement: number;
    signersRequired: number;
    autoCover?: boolean;
  };
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

// ---------------------------------------------------------------------------
// Sparkline behind hero
// ---------------------------------------------------------------------------

function HeroSparkline({ values, color, w = 320, h = 64 }: { values: number[]; color: string; w?: number; h?: number }) {
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
    <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <SvgCircle cx={w} cy={h - ((values[values.length - 1] - min) / range) * h} r={3} fill={color} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryFundDetail() {
  const t = useTheme();
  const funds = (treasury.overview as { funds: Fund[] }).funds;
  const fund = funds.find((f) => f.kind === "welfare") ?? funds[0];
  const ledger = (treasury.overview as { recentLedger: LedgerEntry[] }).recentLedger.filter(
    (e) => e.fundId === fund.id,
  );

  const meta = fundMeta(fund.kind, t);
  const Icon = meta.Icon;

  const [tab, setTab] = useState<Tab>("ledger");

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title={fund.name}
        subtitle="Diaspora Circle Geneva"
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Download size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance hero with sparkline */}
        <View style={[styles.hero, { backgroundColor: meta.color }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              {fund.kind.toUpperCase()} FUND
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 42, lineHeight: 46, marginTop: space.xs }}>
            {formatCurrency(fund.balance, fund.currency)}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
            30-day trend · {fund.signersRequired} signers
          </Text>
          <View style={{ marginTop: space.md, opacity: 0.85 }}>
            <HeroSparkline values={fund.trend} color="rgba(255,255,255,0.9)" />
          </View>
        </View>

        {/* Stats strip */}
        <View style={[styles.statsStrip, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Stat label="Available" value={formatCurrency(fund.available, fund.currency)} t={t} tone={t.success} />
          <Sep t={t} />
          <Stat label="Pending" value={formatCurrency(fund.pending, fund.currency)} t={t} tone={t.warning} />
          <Sep t={t} />
          <Stat label="Max single" value={formatCurrency(fund.maxDisbursement, fund.currency)} t={t} />
          <Sep t={t} />
          <Stat label="Signers" value={`${fund.signersRequired}/3`} t={t} />
        </View>

        {/* Tab strip */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          <TabBtn label="Ledger"         Icon={ArrowUpDown} active={tab === "ledger"}         onPress={() => setTab("ledger")} t={t} />
          <TabBtn label="Recon"          Icon={ScanLine}    active={tab === "reconciliation"} onPress={() => setTab("reconciliation")} t={t} />
          <TabBtn label="EF"             Icon={ShieldCheck} active={tab === "ef"}             onPress={() => setTab("ef")} t={t} />
          <TabBtn label="Reports"        Icon={FileText}    active={tab === "reports"}        onPress={() => setTab("reports")} t={t} />
        </View>

        {tab === "ledger" ? (
          <>
            <Card padded={false}>
              {ledger.length === 0 ? (
                <View style={{ padding: space.lg, alignItems: "center", gap: 4 }}>
                  <Text variant="bodySmall" weight="bold">No entries yet</Text>
                  <Text variant="micro" tone="secondary" align="center" style={{ maxWidth: 240, lineHeight: 14 }}>
                    Contributions, disbursements, and EF activity for this fund will appear here.
                  </Text>
                </View>
              ) : (
                ledger.map((e, i) => (
                  <LedgerRow key={e.id} e={e} t={t} last={i === ledger.length - 1} />
                ))
              )}
            </Card>
            <Pressable
              onPress={() => router.push("/sections/treasury-and-funds/ledger" as never)}
              style={[styles.seeAll, { backgroundColor: t.bgMuted }]}
            >
              <Text variant="caption" weight="bold" tone="accent">See full ledger →</Text>
            </Pressable>
          </>
        ) : tab === "reconciliation" ? (
          <TabPlaceholder
            Icon={ScanLine}
            title="Reconciliation"
            body="Side-by-side Platform vs Bank diff lives in its own screen with drag-to-match."
            cta="Open Reconciliation"
            onCta={() => router.push("/sections/treasury-and-funds/reconciliation" as never)}
            t={t}
          />
        ) : tab === "ef" ? (
          <TabPlaceholder
            Icon={ShieldCheck}
            title="Emergency Fund · cross-section"
            body="EF balance, interventions, and repayments live under Section 3 to avoid duplication."
            cta="Open EF panel"
            onCta={() => router.push("/sections/rosca-circles/emergency-fund" as never)}
            t={t}
          />
        ) : (
          <TabPlaceholder
            Icon={FileText}
            title="Reports"
            body="Generate period reports and audit-grade exports from the Reports panel."
            cta="Open Reports"
            onCta={() => router.push("/sections/treasury-and-funds/reports" as never)}
            t={t}
          />
        )}

        {/* Rules card */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
            <Lock size={12} color={t.textMuted} />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              FUND RULES
            </Text>
          </View>
          <RuleSection label="Allowed sources" items={fund.rules.allowedSources} t={t} />
          <RuleSection label="Allowed uses" items={fund.rules.allowedUses} t={t} />
          <View style={[styles.ruleRow, { borderTopColor: t.border }]}>
            <Users size={14} color={t.textSecondary} />
            <Text variant="caption" tone="secondary" style={{ flex: 1 }}>Signers required</Text>
            <Text variant="caption" weight="bold">{fund.rules.signersRequired}</Text>
          </View>
          <View style={styles.ruleRow}>
            <Banknote size={14} color={t.textSecondary} />
            <Text variant="caption" tone="secondary" style={{ flex: 1 }}>Max single disbursement</Text>
            <Text variant="caption" weight="bold">{formatCurrency(fund.rules.maxSingleDisbursement, fund.currency)}</Text>
          </View>
          {fund.rules.autoCover ? (
            <View style={[styles.efNote, { backgroundColor: t.warningSoft }]}>
              <Sparkles size={11} color={t.warning} />
              <Text variant="micro" weight="semibold" style={{ color: t.warning, flex: 1 }}>
                Auto-covers missed contributions to keep the cycle moving.
              </Text>
            </View>
          ) : null}
        </Card>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, t, tone }: { label: string; value: string; t: AppTheme; tone?: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="caption" weight="bold" style={{ color: tone ?? t.textPrimary, marginTop: 2 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Sep({ t }: { t: AppTheme }) {
  return <View style={{ width: 1, height: 24, backgroundColor: t.border }} />;
}

function TabBtn({
  label,
  Icon,
  active,
  onPress,
  t,
}: {
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
    >
      <Icon size={12} color={active ? t.primary : t.textSecondary} />
      <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
        {label}
      </Text>
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

function TabPlaceholder({
  Icon,
  title,
  body,
  cta,
  onCta,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  body: string;
  cta: string;
  onCta: () => void;
  t: AppTheme;
}) {
  return (
    <View style={[styles.tabPlaceholder, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.tabPhIcon, { backgroundColor: t.bgMuted }]}>
        <Icon size={20} color={t.textSecondary} />
      </View>
      <Text variant="bodySmall" weight="bold" align="center">{title}</Text>
      <Text variant="micro" tone="secondary" align="center" style={{ maxWidth: 280, lineHeight: 14 }}>{body}</Text>
      <Pressable onPress={onCta} style={[styles.tabPhCta, { backgroundColor: t.primary }]}>
        <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{cta} →</Text>
      </Pressable>
    </View>
  );
}

function RuleSection({ label, items, t }: { label: string; items: string[]; t: AppTheme }) {
  return (
    <View style={{ marginBottom: space.sm }}>
      <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.5, marginBottom: 4 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
        {items.map((it) => (
          <View key={it} style={[styles.rulePill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="semibold" tone="secondary">{it}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  statsStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
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
  seeAll: {
    alignItems: "center",
    padding: space.sm,
    borderRadius: radius.sm,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rulePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  efNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  tabPlaceholder: {
    alignItems: "center",
    padding: space.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: space.sm,
  },
  tabPhIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPhCta: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginTop: 4,
  },
});
