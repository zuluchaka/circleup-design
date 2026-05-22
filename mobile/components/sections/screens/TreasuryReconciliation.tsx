import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Check,
  AlertTriangle,
  CircleSlash,
  Building2,
  Link2,
  Sparkles,
  Pencil,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Side = "platform" | "bank";
type MatchStatus = "matched" | "discrepancy" | "orphan";
type Filter = "all" | "matched" | "discrepancy" | "orphan";

type Row = {
  id: string;
  side: Side;
  date: string;
  label: string;
  amount: number;
  currency: string;
  match: MatchStatus;
  matchedWith: string | null;
  variance: number | null;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("en-CH", { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function statusMeta(s: MatchStatus, t: AppTheme) {
  if (s === "matched")     return { color: t.success, bg: t.successSoft, Icon: Check,        label: "Matched" };
  if (s === "discrepancy") return { color: t.warning, bg: t.warningSoft, Icon: AlertTriangle,label: "Discrepancy" };
  return { color: t.danger, bg: t.dangerSoft, Icon: CircleSlash, label: "Orphan" };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryReconciliation() {
  const t = useTheme();
  const session = treasury.reconciliationSession as {
    period: string;
    fundId: string;
    bankName: string;
    importedAt: string;
    totals: {
      platform: number;
      bank: number;
      matched: number;
      discrepancy: number;
      orphan: number;
    };
    rows: Row[];
  };

  const [filter, setFilter] = useState<Filter>("all");
  const [expandedPairId, setExpandedPairId] = useState<string | null>(
    session.rows.find((r) => r.match === "discrepancy")?.matchedWith ?? null,
  );

  // Build paired groups. Each platform row pairs with a bank row by matchedWith.
  // Orphans appear alone.
  const groups = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; platform?: Row; bank?: Row; status: MatchStatus }[] = [];

    session.rows.forEach((r) => {
      if (seen.has(r.id)) return;
      if (r.matchedWith) {
        const other = session.rows.find((o) => o.id === r.matchedWith);
        const platform = r.side === "platform" ? r : other;
        const bank = r.side === "bank" ? r : other;
        seen.add(r.id);
        if (other) seen.add(other.id);
        list.push({
          id: platform?.id ?? r.id,
          platform,
          bank,
          status: r.match,
        });
      } else {
        seen.add(r.id);
        list.push({
          id: r.id,
          platform: r.side === "platform" ? r : undefined,
          bank: r.side === "bank" ? r : undefined,
          status: "orphan",
        });
      }
    });

    return list;
  }, [session.rows]);

  const filteredGroups = useMemo(() => {
    if (filter === "all") return groups;
    return groups.filter((g) => g.status === filter);
  }, [groups, filter]);

  const counts: Record<Filter, number> = {
    all: groups.length,
    matched: groups.filter((g) => g.status === "matched").length,
    discrepancy: groups.filter((g) => g.status === "discrepancy").length,
    orphan: groups.filter((g) => g.status === "orphan").length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Reconciliation"
        subtitle={`${session.period} · ${session.bankName}`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.summaryRow}>
            <SumCell label="Platform" value={String(session.totals.platform)} Icon={Sparkles} color={t.primary} t={t} />
            <View style={[styles.sumSep, { backgroundColor: t.border }]} />
            <SumCell label="Bank" value={String(session.totals.bank)} Icon={Building2} color={t.info} t={t} />
          </View>
          <View style={[styles.matchBar, { backgroundColor: t.bgMuted, marginTop: space.md }]}>
            <View style={{ flex: session.totals.matched, backgroundColor: t.success }} />
            <View style={{ flex: session.totals.discrepancy, backgroundColor: t.warning }} />
            <View style={{ flex: session.totals.orphan, backgroundColor: t.danger }} />
          </View>
          <View style={{ flexDirection: "row", gap: space.md, marginTop: space.sm }}>
            <Legend dotColor={t.success} label="Matched" count={session.totals.matched} />
            <Legend dotColor={t.warning} label="Discrepancy" count={session.totals.discrepancy} />
            <Legend dotColor={t.danger}  label="Orphan" count={session.totals.orphan} />
          </View>
          <Text variant="micro" tone="muted" style={{ marginTop: space.sm }}>
            Imported {timeAgo(session.importedAt)} · {session.bankName}
          </Text>
        </View>

        {/* Filter tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          {(["all", "matched", "discrepancy", "orphan"] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.tab, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
              >
                <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
                <View style={[styles.tabCount, { backgroundColor: active ? t.primarySoft : "transparent" }]}>
                  <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textMuted }}>
                    {counts[f]}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Match groups */}
        <View style={{ gap: space.sm }}>
          {filteredGroups.map((g) => (
            <MatchGroup
              key={g.id}
              g={g}
              expanded={expandedPairId === g.id}
              onToggle={() => setExpandedPairId(expandedPairId === g.id ? null : g.id)}
              t={t}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SumCell({
  label,
  value,
  Icon,
  color,
  t,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  t: AppTheme;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 4 }}>
      <View style={[styles.sumIcon, { backgroundColor: `${color}22` }]}>
        <Icon size={12} color={color} />
      </View>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ color }}>{value}</Text>
    </View>
  );
}

function Legend({ dotColor, label, count }: { dotColor: string; label: string; count: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor }} />
      <Text variant="micro" weight="bold">{count}</Text>
      <Text variant="micro" tone="secondary" weight="semibold">{label}</Text>
    </View>
  );
}

function MatchGroup({
  g,
  expanded,
  onToggle,
  t,
}: {
  g: { id: string; platform?: Row; bank?: Row; status: MatchStatus };
  expanded: boolean;
  onToggle: () => void;
  t: AppTheme;
}) {
  const status = statusMeta(g.status, t);
  const StatusIcon = status.Icon;
  const platform = g.platform;
  const bank = g.bank;
  const variance = platform && bank ? Math.abs(platform.amount - bank.amount) : null;
  const isOrphan = g.status === "orphan";

  return (
    <View
      style={[
        styles.group,
        {
          backgroundColor: t.surface,
          borderColor: g.status === "discrepancy" ? t.warning : g.status === "orphan" ? t.danger : t.border,
          borderWidth: g.status !== "matched" ? 1.5 : 1,
        },
      ]}
    >
      <Pressable onPress={onToggle} style={styles.groupHeader}>
        <View style={[styles.groupStatus, { backgroundColor: status.bg }]}>
          <StatusIcon size={12} color={status.color} strokeWidth={3} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Text variant="caption" weight="bold">
              {isOrphan
                ? (platform ? platform.label : bank?.label ?? "—")
                : platform?.label ?? "—"}
            </Text>
            <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
              <Text variant="micro" weight="bold" style={{ color: status.color, letterSpacing: 0.5 }}>
                {status.label.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text variant="micro" tone="secondary">
            {shortDate((platform ?? bank)!.date)} · {variance !== null && variance > 0 ? `variance ${formatCurrency(variance, "CHF")}` : `${formatCurrency((platform ?? bank)!.amount, "CHF")}`}
          </Text>
        </View>
        {expanded ? <ChevronUp size={16} color={t.textMuted} /> : <ChevronDown size={16} color={t.textMuted} />}
      </Pressable>

      {expanded ? (
        <View style={[styles.expanded, { borderTopColor: t.border }]}>
          <SideAccordion side="platform" row={platform} t={t} />
          <SideAccordion side="bank" row={bank} t={t} />

          {g.status === "matched" ? (
            <View style={[styles.matchedNote, { backgroundColor: t.successSoft }]}>
              <Check size={12} color={t.success} strokeWidth={3} />
              <Text variant="micro" weight="semibold" style={{ color: t.success, flex: 1 }}>
                Match confirmed via {bank?.label ? "amount + name + date" : "auto-match"}.
              </Text>
            </View>
          ) : g.status === "discrepancy" && variance !== null ? (
            <AdjustmentForm variance={variance} t={t} />
          ) : (
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.sm }}>
              <Pressable style={[styles.outBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}>
                <Text variant="caption" weight="bold">Mark as fee/charge</Text>
              </Pressable>
              <Pressable style={[styles.outBtnPrimary, { backgroundColor: t.primary }]}>
                <Link2 size={12} color="#fff" />
                <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Match manually</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

function SideAccordion({ side, row, t }: { side: Side; row?: Row; t: AppTheme }) {
  const isPlatform = side === "platform";
  const color = isPlatform ? t.primary : t.info;
  return (
    <View style={[styles.sideCard, { backgroundColor: t.bgMuted, borderLeftColor: color }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
        {isPlatform ? <Sparkles size={11} color={color} /> : <Building2 size={11} color={color} />}
        <Text variant="micro" weight="bold" style={{ color, letterSpacing: 0.8 }}>
          {isPlatform ? "PLATFORM" : "BANK"}
        </Text>
      </View>
      {row ? (
        <>
          <Text variant="caption" weight="bold">{row.label}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
            <Text variant="micro" tone="secondary">{shortDate(row.date)} {timeOf(row.date)}</Text>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: t.textMuted, opacity: 0.6 }} />
            <Text
              variant="caption"
              weight="bold"
              style={{ color: row.amount < 0 ? t.danger : t.success }}
            >
              {row.amount < 0 ? "" : "+"}{formatCurrency(row.amount, row.currency)}
            </Text>
          </View>
        </>
      ) : (
        <Text variant="caption" tone="muted" weight="semibold">— No match on this side —</Text>
      )}
    </View>
  );
}

function AdjustmentForm({ variance, t }: { variance: number; t: AppTheme }) {
  return (
    <View style={[styles.adjForm, { backgroundColor: t.warningSoft }]}>
      <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.8 }}>
        VARIANCE · CHF {variance.toLocaleString("de-CH")}
      </Text>
      <Text variant="caption" tone="secondary" style={{ marginTop: 4, lineHeight: 16 }}>
        Most likely a PostFinance handling fee. Post an adjustment with a reason and the audit trail will keep both sides.
      </Text>
      <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.sm }}>
        <Pressable style={[styles.adjBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}>
          <Text variant="caption" weight="bold">Investigate</Text>
        </Pressable>
        <Pressable style={[styles.adjBtnPrimary, { backgroundColor: t.warning }]}>
          <Pencil size={12} color="#fff" />
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Post adjustment</Text>
          <ArrowRight size={12} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sumIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  sumSep: {
    width: 1,
    height: 36,
  },
  matchBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
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
  tabCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  group: {
    borderRadius: radius.md,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  groupStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  expanded: {
    padding: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: space.sm,
  },
  sideCard: {
    padding: space.md,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
  },
  matchedNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  adjForm: {
    padding: space.md,
    borderRadius: radius.md,
  },
  adjBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
  },
  adjBtnPrimary: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  outBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
  },
  outBtnPrimary: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
});
