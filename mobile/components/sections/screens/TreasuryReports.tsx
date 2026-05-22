import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  FolderKanban,
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  Activity,
  ChevronDown,
  Sparkles,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Period = "month" | "quarter" | "year";
type Scope = "all" | "single" | "custom";

type Kpi = {
  id: string;
  label: string;
  value: number;
  trend: "up" | "down" | "flat";
  delta: string;
  toneHint: "good" | "bad" | "neutral";
};

type BalanceSheetRow = {
  id: string;
  label: string;
  value: number;
  group: "assets" | "liabilities" | "equity";
};

type CashFlowRow = {
  id: string;
  label: string;
  value: number;
  group: "operating" | "investing" | "financing";
};

function formatCurrency(amount: number, currency: string) {
  const abs = Math.abs(amount);
  return `${amount < 0 ? "−" : ""}${currency} ${abs.toLocaleString("de-CH")}`;
}

function dateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-CH", { day: "numeric", month: "short" })} — ${e.toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" })}`;
}

function trendIcon(t: "up" | "down" | "flat") {
  return t === "up" ? TrendingUp : t === "down" ? TrendingDown : Minus;
}

function toneColor(tone: "good" | "bad" | "neutral", t: AppTheme) {
  if (tone === "good") return t.success;
  if (tone === "bad") return t.danger;
  return t.textSecondary;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryReports() {
  const t = useTheme();
  const p = treasury.reportPreview as {
    period: Period;
    scope: Scope;
    scopeLabel: string;
    rangeStart: string;
    rangeEnd: string;
    currency: string;
    kpis: Kpi[];
    balanceSheet: BalanceSheetRow[];
    cashFlow: CashFlowRow[];
  };

  const [period, setPeriod] = useState<Period>(p.period);
  const [scope, setScope] = useState<Scope>(p.scope);

  const assets = useMemo(() => p.balanceSheet.filter((r) => r.group === "assets"), [p.balanceSheet]);
  const liabilities = useMemo(() => p.balanceSheet.filter((r) => r.group === "liabilities"), [p.balanceSheet]);
  const equity = useMemo(() => p.balanceSheet.filter((r) => r.group === "equity"), [p.balanceSheet]);
  const totalAssets = assets.reduce((s, r) => s + r.value, 0);
  const totalLiab = liabilities.reduce((s, r) => s + r.value, 0);
  const totalEquity = equity.reduce((s, r) => s + r.value, 0);

  const operating = useMemo(() => p.cashFlow.filter((r) => r.group === "operating"), [p.cashFlow]);
  const financing = useMemo(() => p.cashFlow.filter((r) => r.group === "financing"), [p.cashFlow]);
  const opNet = operating.reduce((s, r) => s + r.value, 0);
  const finNet = financing.reduce((s, r) => s + r.value, 0);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Financial reports"
        subtitle="Diaspora Circle Geneva"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Period segmented */}
        <View>
          <FieldLabel>Period</FieldLabel>
          <View style={[styles.segment, { backgroundColor: t.bgMuted }]}>
            {(["month", "quarter", "year"] as Period[]).map((pp) => (
              <Pressable
                key={pp}
                onPress={() => setPeriod(pp)}
                style={[styles.segBtn, period === pp ? { backgroundColor: t.surface, borderColor: t.border } : null]}
              >
                <Text variant="caption" weight={period === pp ? "bold" : "semibold"} tone={period === pp ? "primary" : "secondary"}>
                  {pp.charAt(0).toUpperCase() + pp.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Range display */}
        <View style={[styles.rangeRow, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Calendar size={14} color={t.textSecondary} />
          <Text variant="caption" weight="bold" style={{ flex: 1 }}>
            {dateRange(p.rangeStart, p.rangeEnd)}
          </Text>
          <Text variant="micro" tone="secondary">{p.scopeLabel}</Text>
        </View>

        {/* Scope picker */}
        <View>
          <FieldLabel>Scope</FieldLabel>
          <View style={{ gap: space.sm }}>
            <ScopeRow
              Icon={FolderKanban}
              title="All funds"
              body="Operating + Welfare + Emergency + Project · 4 funds"
              active={scope === "all"}
              onSelect={() => setScope("all")}
              t={t}
            />
            <ScopeRow
              Icon={Scale}
              title="A single fund"
              body="Drill into one fund's contributions, payouts, and EF activity."
              active={scope === "single"}
              onSelect={() => setScope("single")}
              t={t}
            />
            <ScopeRow
              Icon={Sparkles}
              title="Custom selection"
              body="Pick a custom mix of funds — useful for project sub-reports."
              active={scope === "custom"}
              onSelect={() => setScope("custom")}
              t={t}
            />
          </View>
        </View>

        {/* KPI tiles */}
        <View>
          <FieldLabel>Preview · key metrics</FieldLabel>
          <View style={styles.kpiGrid}>
            {p.kpis.map((k) => (
              <KpiTile key={k.id} k={k} currency={p.currency} t={t} />
            ))}
          </View>
        </View>

        {/* Balance sheet preview */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
            <Scale size={14} color={t.primary} />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              BALANCE SHEET · END OF PERIOD
            </Text>
          </View>
          <BalanceGroup label="Assets" rows={assets} total={totalAssets} currency={p.currency} color={t.success} t={t} />
          <BalanceGroup label="Liabilities" rows={liabilities} total={totalLiab} currency={p.currency} color={t.warning} t={t} />
          <BalanceGroup label="Members' equity" rows={equity} total={totalEquity} currency={p.currency} color={t.primary} t={t} last />
        </Card>

        {/* Cash flow preview */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
            <Activity size={14} color={t.primary} />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              CASH FLOW · {period.toUpperCase()}LY
            </Text>
          </View>
          <CashFlowGroup label="Operating" rows={operating} total={opNet} currency={p.currency} t={t} />
          <CashFlowGroup label="Financing" rows={financing} total={finNet} currency={p.currency} t={t} last />
        </Card>

        {/* What's included */}
        <View style={[styles.included, { backgroundColor: t.bgMuted }]}>
          <ChevronDown size={11} color={t.textMuted} />
          <Text variant="micro" tone="secondary" style={{ flex: 1, lineHeight: 14 }}>
            Generated PDFs include the cover sheet, KPIs, balance sheet, cash flow, and a per-fund summary table.
          </Text>
        </View>
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable style={[styles.csvBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}>
            <Download size={14} color={t.textPrimary} />
            <Text variant="caption" weight="bold">CSV</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Button
              label={`Generate PDF · ${period}`}
              fullWidth
              size="lg"
              trailingIcon={<Download size={16} color="#fff" />}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
      {String(children).toUpperCase()}
    </Text>
  );
}

function ScopeRow({
  Icon,
  title,
  body,
  active,
  onSelect,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  body: string;
  active: boolean;
  onSelect: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.scopeRow,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.scopeIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Icon size={16} color={active ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold">{title}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{body}</Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: active ? t.primary : t.borderStrong,
            backgroundColor: active ? t.primary : "transparent",
          },
        ]}
      >
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function KpiTile({ k, currency, t }: { k: Kpi; currency: string; t: AppTheme }) {
  const TrendIcon = trendIcon(k.trend);
  const color = toneColor(k.toneHint, t);
  return (
    <View style={[styles.kpi, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
          {k.label.toUpperCase()}
        </Text>
        <View style={[styles.trendPill, { backgroundColor: `${color}22` }]}>
          <TrendIcon size={10} color={color} />
        </View>
      </View>
      <Text
        variant="h2"
        weight="bold"
        style={{
          marginTop: space.xs,
          color: k.toneHint === "bad" ? t.danger : k.id === "net" && k.value < 0 ? t.danger : t.textPrimary,
        }}
      >
        {formatCurrency(k.value, currency)}
      </Text>
      <Text variant="micro" weight="semibold" style={{ color, marginTop: 2 }}>{k.delta}</Text>
    </View>
  );
}

function BalanceGroup({
  label,
  rows,
  total,
  currency,
  color,
  t,
  last,
}: {
  label: string;
  rows: BalanceSheetRow[];
  total: number;
  currency: string;
  color: string;
  t: AppTheme;
  last?: boolean;
}) {
  if (rows.length === 0) return null;
  return (
    <View style={{ marginBottom: last ? 0 : space.md }}>
      <View style={[styles.groupHeader, { borderBottomColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
          <Text variant="caption" weight="bold">{label}</Text>
        </View>
        <Text variant="caption" weight="bold">{formatCurrency(total, currency)}</Text>
      </View>
      {rows.map((r) => (
        <View key={r.id} style={styles.bsRow}>
          <Text variant="caption" tone="secondary" style={{ flex: 1 }}>{r.label}</Text>
          <Text variant="caption" weight="semibold">{formatCurrency(r.value, currency)}</Text>
        </View>
      ))}
    </View>
  );
}

function CashFlowGroup({
  label,
  rows,
  total,
  currency,
  t,
  last,
}: {
  label: string;
  rows: CashFlowRow[];
  total: number;
  currency: string;
  t: AppTheme;
  last?: boolean;
}) {
  if (rows.length === 0) return null;
  const totalColor = total >= 0 ? t.success : t.danger;
  return (
    <View style={{ marginBottom: last ? 0 : space.md }}>
      <View style={[styles.groupHeader, { borderBottomColor: t.border }]}>
        <Text variant="caption" weight="bold">{label}</Text>
        <Text variant="caption" weight="bold" style={{ color: totalColor }}>
          {total < 0 ? "−" : "+"}{currency} {Math.abs(total).toLocaleString("de-CH")}
        </Text>
      </View>
      {rows.map((r) => {
        const positive = r.value >= 0;
        return (
          <View key={r.id} style={styles.bsRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1 }}>
              {positive ? (
                <ArrowDownLeft size={11} color={t.success} strokeWidth={3} />
              ) : (
                <ArrowUpRight size={11} color={t.danger} strokeWidth={3} />
              )}
              <Text variant="caption" tone="secondary" style={{ flex: 1 }}>{r.label}</Text>
            </View>
            <Text
              variant="caption"
              weight="semibold"
              style={{ color: positive ? t.success : t.danger }}
            >
              {positive ? "+" : "−"}{currency} {Math.abs(r.value).toLocaleString("de-CH")}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  scopeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  scopeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  kpi: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  trendPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  included: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
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
  csvBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
