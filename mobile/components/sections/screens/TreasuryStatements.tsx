import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  FileText,
  Download,
  Pin,
  Plus,
  RefreshCw,
  Clock,
  AlertCircle,
  Check,
  Calendar,
  Folder,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Status = "ready" | "regenerating" | "expired";
type Filter = "all" | "monthly" | "quarterly" | "fund";

type Item = {
  id: string;
  period: string;
  rangeStart: string;
  rangeEnd: string;
  scope: string;
  generatedBy: string;
  generatedAt: string;
  size: string;
  pages: number;
  status: Status;
  pinned: boolean;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function dateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-CH", { day: "numeric", month: "short" })} — ${e.toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" })}`;
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "ready") return { color: t.success, bg: t.successSoft, Icon: Check, label: "READY" };
  if (s === "regenerating") return { color: t.warning, bg: t.warningSoft, Icon: Clock, label: "REGENERATING" };
  return { color: t.danger, bg: t.dangerSoft, Icon: AlertCircle, label: "EXPIRED" };
}

function classify(item: Item): "monthly" | "quarterly" | "fund" {
  if (item.scope !== "All funds") return "fund";
  // Quarterly = label like "Q1 2026"
  if (/^Q\d/.test(item.period)) return "quarterly";
  return "monthly";
}

export function TreasuryStatements() {
  const t = useTheme();
  const panel = treasury.statementsPanel as {
    storageUsed: number;
    storageLimit: number;
    items: Item[];
  };

  const [filter, setFilter] = useState<Filter>("all");

  const counts: Record<Filter, number> = {
    all: panel.items.length,
    monthly: panel.items.filter((i) => classify(i) === "monthly").length,
    quarterly: panel.items.filter((i) => classify(i) === "quarterly").length,
    fund: panel.items.filter((i) => classify(i) === "fund").length,
  };

  const visible = useMemo(() => {
    if (filter === "all") return panel.items;
    return panel.items.filter((i) => classify(i) === filter);
  }, [filter, panel.items]);

  const pinned = visible.filter((i) => i.pinned);
  const others = visible.filter((i) => !i.pinned);
  const storagePct = panel.storageUsed / panel.storageLimit;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Statements"
        subtitle="Diaspora Circle Geneva"
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Plus size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Storage strip */}
        <View style={[styles.storage, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Folder size={12} color={t.textSecondary} />
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                STATEMENT STORAGE
              </Text>
            </View>
            <Text variant="caption" weight="bold">
              {panel.storageUsed} / {panel.storageLimit} MB
            </Text>
          </View>
          <View style={[styles.storageBar, { backgroundColor: t.bgMuted }]}>
            <View style={[styles.storageFill, { width: `${storagePct * 100}%`, backgroundColor: t.primary }]} />
          </View>
        </View>

        {/* Filter tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          {(["all", "monthly", "quarterly", "fund"] as Filter[]).map((f) => {
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

        {/* Pinned section */}
        {pinned.length > 0 ? (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
              <Pin size={14} color={t.warning} />
              <Text variant="h3" weight="bold">Pinned</Text>
            </View>
            <Card padded={false}>
              {pinned.map((it, i) => (
                <StatementRow key={it.id} it={it} t={t} last={i === pinned.length - 1} />
              ))}
            </Card>
          </View>
        ) : null}

        {/* Other statements */}
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: space.sm }}>All statements</Text>
          {visible.length === 0 ? (
            <View style={[styles.empty, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text variant="bodySmall" weight="bold">No statements yet</Text>
              <Text variant="micro" tone="secondary" align="center" style={{ maxWidth: 240, lineHeight: 14 }}>
                Generate a statement from any cycle close or use the Reports panel.
              </Text>
            </View>
          ) : (
            <Card padded={false}>
              {others.map((it, i) => (
                <StatementRow key={it.id} it={it} t={t} last={i === others.length - 1} />
              ))}
            </Card>
          )}
        </View>
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label="Generate a new statement"
          fullWidth
          size="lg"
          trailingIcon={<FileText size={16} color="#fff" />}
        />
      </View>
    </View>
  );
}

function StatementRow({ it, t, last }: { it: Item; t: AppTheme; last: boolean }) {
  const meta = statusMeta(it.status, t);
  const Icon = meta.Icon;
  const isReady = it.status === "ready";

  return (
    <Pressable
      style={[styles.row, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
    >
      <View style={[styles.docIcon, { backgroundColor: isReady ? t.dangerSoft : meta.bg }]}>
        {isReady ? <FileText size={16} color={t.danger} /> : <Icon size={16} color={meta.color} />}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold">{it.period}</Text>
          {it.pinned ? <Pin size={10} color={t.warning} /> : null}
          <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
            <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
              {meta.label}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Calendar size={10} color={t.textMuted} />
          <Text variant="micro" tone="secondary" numberOfLines={1}>
            {dateRange(it.rangeStart, it.rangeEnd)}
          </Text>
        </View>
        <Text variant="micro" tone="muted">
          {it.scope} · {it.size}{it.pages > 0 ? ` · ${it.pages} pages` : ""} · by {it.generatedBy} · {timeAgo(it.generatedAt)}
        </Text>
      </View>
      {isReady ? (
        <Pressable style={[styles.dlBtn, { backgroundColor: t.primarySoft }]}>
          <Download size={14} color={t.primary} />
        </Pressable>
      ) : it.status === "regenerating" ? (
        <View style={[styles.dlBtn, { backgroundColor: t.warningSoft }]}>
          <RefreshCw size={14} color={t.warning} />
        </View>
      ) : (
        <Pressable style={[styles.dlBtn, { backgroundColor: t.dangerSoft }]}>
          <RefreshCw size={14} color={t.danger} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  storage: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  storageBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  storageFill: {
    height: "100%",
    borderRadius: 3,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  dlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    padding: space.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
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
