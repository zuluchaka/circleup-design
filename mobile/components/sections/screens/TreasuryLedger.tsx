import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Download,
  Banknote,
  HeartHandshake,
  ShieldCheck,
  FolderKanban,
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
};

type Entry = {
  id: string;
  at: string;
  fundId: string;
  kind: "credit" | "debit";
  amount: number;
  currency: string;
  category: string;
  label: string;
  counterparty: string;
  balanceAfter: number;
  reference: string;
};

type FundFilter = "all" | string;
type KindFilter = "all" | "credit" | "debit";

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function dateGroup(iso: string) {
  const d = new Date(iso);
  const now = new Date(NOW);
  if (d.toDateString() === now.toDateString()) return "TODAY";
  const yesterday = new Date(NOW - 86400000);
  if (d.toDateString() === yesterday.toDateString()) return "YESTERDAY";
  return d.toLocaleDateString("en-CH", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("en-CH", { hour: "2-digit", minute: "2-digit" });
}

function fundMeta(kind: FundKind, t: AppTheme) {
  if (kind === "operating") return { color: t.primary, Icon: Banknote };
  if (kind === "welfare")   return { color: t.success, Icon: HeartHandshake };
  if (kind === "emergency") return { color: t.warning, Icon: ShieldCheck };
  return { color: t.info, Icon: FolderKanban };
}

function categoryLabel(cat: string) {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryLedger() {
  const t = useTheme();
  const ledger = treasury.ledger as Entry[];
  const funds = (treasury.overview as { funds: Fund[] }).funds;

  const [fundId, setFundId] = useState<FundFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");

  const visible = useMemo(() => {
    let v = ledger;
    if (fundId !== "all") v = v.filter((e) => e.fundId === fundId);
    if (kind !== "all") v = v.filter((e) => e.kind === kind);
    return v;
  }, [ledger, fundId, kind]);

  // Totals from visible
  const totals = useMemo(() => {
    const credits = visible.filter((e) => e.kind === "credit").reduce((s, e) => s + e.amount, 0);
    const debits = visible.filter((e) => e.kind === "debit").reduce((s, e) => s + e.amount, 0);
    return { credits, debits, net: credits - debits };
  }, [visible]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    visible.forEach((e) => {
      const key = dateGroup(e.at);
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [visible]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Ledger"
        subtitle="Diaspora Circle Geneva"
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Download size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Totals strip */}
        <View style={[styles.totals, { backgroundColor: t.surface, borderColor: t.border }]}>
          <TotalCell label="In" value={formatCurrency(totals.credits, "CHF")} tone={t.success} t={t} />
          <Sep t={t} />
          <TotalCell label="Out" value={formatCurrency(totals.debits, "CHF")} tone={t.danger} t={t} />
          <Sep t={t} />
          <TotalCell label="Net" value={formatCurrency(totals.net, "CHF")} tone={totals.net >= 0 ? t.success : t.danger} t={t} />
        </View>

        {/* Fund filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          <FundChip label="All funds" active={fundId === "all"} onPress={() => setFundId("all")} t={t} />
          {funds.map((f) => {
            const meta = fundMeta(f.kind, t);
            return (
              <FundChip
                key={f.id}
                label={f.name}
                Icon={meta.Icon}
                color={meta.color}
                active={fundId === f.id}
                onPress={() => setFundId(f.id)}
                t={t}
              />
            );
          })}
        </ScrollView>

        {/* Kind filter */}
        <View style={[styles.kindRow, { backgroundColor: t.bgMuted }]}>
          <KindBtn label="All" active={kind === "all"} onPress={() => setKind("all")} t={t} />
          <KindBtn label="In" active={kind === "credit"} onPress={() => setKind("credit")} tone={t.success} t={t} />
          <KindBtn label="Out" active={kind === "debit"} onPress={() => setKind("debit")} tone={t.danger} t={t} />
        </View>

        {/* Grouped list */}
        {grouped.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text variant="bodySmall" weight="bold">No entries match</Text>
            <Text variant="micro" tone="secondary" align="center">Try a different fund or kind.</Text>
          </View>
        ) : (
          grouped.map(([day, entries]) => (
            <View key={day}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
                {day}
              </Text>
              <Card padded={false}>
                {entries.map((e, i) => (
                  <LedgerRow key={e.id} e={e} funds={funds} t={t} last={i === entries.length - 1} />
                ))}
              </Card>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function TotalCell({ label, value, tone, t }: { label: string; value: string; tone: string; t: AppTheme }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="caption" weight="bold" style={{ color: tone, marginTop: 2 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Sep({ t }: { t: AppTheme }) {
  return <View style={{ width: 1, height: 24, backgroundColor: t.border }} />;
}

function FundChip({
  label,
  Icon,
  color,
  active,
  onPress,
  t,
}: {
  label: string;
  Icon?: React.ComponentType<{ size?: number; color?: string }>;
  color?: string;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.fundChip,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      {Icon ? <Icon size={11} color={color ?? t.textSecondary} /> : null}
      <Text variant="micro" weight="bold" tone={active ? "accent" : "secondary"}>
        {label}
      </Text>
    </Pressable>
  );
}

function KindBtn({
  label,
  active,
  onPress,
  tone,
  t,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  tone?: string;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.kindBtn,
        active ? { backgroundColor: t.surface, borderColor: t.border } : null,
      ]}
    >
      <Text variant="caption" weight={active ? "bold" : "semibold"} style={{ color: active ? (tone ?? t.primary) : t.textSecondary }}>
        {label}
      </Text>
    </Pressable>
  );
}

function LedgerRow({
  e,
  funds,
  t,
  last,
}: {
  e: Entry;
  funds: Fund[];
  t: AppTheme;
  last: boolean;
}) {
  const isCredit = e.kind === "credit";
  const fund = funds.find((f) => f.id === e.fundId);
  const meta = fund ? fundMeta(fund.kind, t) : { color: t.textMuted, Icon: Banknote };

  return (
    <Pressable
      onPress={() => router.push("/sections/treasury-and-funds/entry-detail" as never)}
      style={[styles.row, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: isCredit ? t.successSoft : t.dangerSoft }]}>
        {isCredit ? (
          <ArrowDownLeft size={12} color={t.success} strokeWidth={3} />
        ) : (
          <ArrowUpRight size={12} color={t.danger} strokeWidth={3} />
        )}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="caption" weight="bold" numberOfLines={1}>{e.label}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <View style={[styles.catPill, { backgroundColor: `${meta.color}22` }]}>
            <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
              {categoryLabel(e.category).toUpperCase()}
            </Text>
          </View>
          <Text variant="micro" tone="muted">{timeOf(e.at)}</Text>
          <Text variant="micro" tone="muted" style={{ fontFamily: "Menlo" }}>{e.reference}</Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end", gap: 2 }}>
        <Text variant="caption" weight="bold" style={{ color: isCredit ? t.success : t.danger }}>
          {isCredit ? "+" : "−"}{formatCurrency(e.amount, e.currency)}
        </Text>
        <Text variant="micro" tone="muted">
          bal {formatCurrency(e.balanceAfter, e.currency)}
        </Text>
      </View>
      <ChevronRight size={14} color={t.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  totals: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  fundChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  kindRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  kindBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  empty: {
    alignItems: "center",
    padding: space.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  catPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
});
