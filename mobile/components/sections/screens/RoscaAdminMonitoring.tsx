import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Snowflake,
  KeyRound,
  Search,
  ChevronRight,
  Building2,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Health = "ok" | "watch" | "risk";
type Status = "active" | "frozen" | "closed" | "pending";
type AlertKind = "off_platform" | "risk" | "freeze" | "kyc";

type MonitoredCircle = {
  circleId: string;
  name: string;
  associationName: string;
  status: Status;
  health: Health;
  cycle: number;
  cycleLength: number;
  collectionRate: number;
  openDisputes: number;
  offPlatformActivity: number;
  balance: number;
  currency: string;
  accent: string;
};

type Alert = {
  id: string;
  kind: AlertKind;
  circleId: string;
  circleName: string;
  body: string;
  at: string;
};

type Filter = "all" | "watch" | "risk" | "frozen";

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function healthMeta(h: Health, t: AppTheme) {
  if (h === "ok")    return { color: t.success, bg: t.successSoft, label: "Healthy", Icon: ShieldCheck };
  if (h === "watch") return { color: t.warning, bg: t.warningSoft, label: "Watch",    Icon: Shield };
  return { color: t.danger, bg: t.dangerSoft, label: "At risk", Icon: ShieldAlert };
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "active")  return { color: t.success, bg: t.successSoft, label: "Active" };
  if (s === "pending") return { color: t.warning, bg: t.warningSoft, label: "Pending" };
  if (s === "frozen")  return { color: t.danger,  bg: t.dangerSoft,  label: "Frozen" };
  return { color: t.textMuted, bg: t.bgMuted, label: "Closed" };
}

function alertMeta(k: AlertKind, t: AppTheme) {
  if (k === "off_platform") return { color: t.danger,  Icon: AlertCircle, label: "OFF-PLATFORM" };
  if (k === "risk")         return { color: t.warning, Icon: Shield,      label: "RISK" };
  if (k === "freeze")       return { color: t.info,    Icon: Snowflake,   label: "FROZEN" };
  return { color: t.primary, Icon: KeyRound, label: "KYC" };
}

export function RoscaAdminMonitoring() {
  const t = useTheme();
  const data = rosca.adminMonitoring as {
    totals: { circles: number; openDisputes: number; flaggedOffPlatform: number; frozen: number };
    alerts: Alert[];
    circles: MonitoredCircle[];
  };

  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    if (filter === "all") return data.circles;
    if (filter === "frozen") return data.circles.filter((c) => c.status === "frozen");
    return data.circles.filter((c) => c.health === filter);
  }, [filter, data.circles]);

  const counts: Record<Filter, number> = {
    all: data.circles.length,
    watch: data.circles.filter((c) => c.health === "watch").length,
    risk: data.circles.filter((c) => c.health === "risk").length,
    frozen: data.circles.filter((c) => c.status === "frozen").length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Admin monitoring"
        subtitle="Platform staff · CircleUp Support"
        onBack={() => router.back()}
        trailing={
          <Pressable hitSlop={10}>
            <Search size={20} color={t.textPrimary} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Platform totals */}
        <View style={styles.totalsGrid}>
          <TotalTile label="Circles"      value={String(data.totals.circles)}            color={t.primary} t={t} />
          <TotalTile label="Open disputes" value={String(data.totals.openDisputes)}      color={t.warning} t={t} />
          <TotalTile label="Off-platform"  value={String(data.totals.flaggedOffPlatform)} color={t.danger}  t={t} />
          <TotalTile label="Frozen"        value={String(data.totals.frozen)}             color={t.info}    t={t} />
        </View>

        {/* Live alerts */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <AlertCircle size={14} color={t.danger} />
              <Text variant="h3" weight="bold">Live alerts</Text>
            </View>
            <Text variant="caption" tone="secondary">{data.alerts.length} new</Text>
          </View>
          <View style={{ gap: space.sm }}>
            {data.alerts.map((a) => (
              <AlertRow key={a.id} a={a} t={t} />
            ))}
          </View>
        </View>

        {/* Filter chips */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          {(["all", "watch", "risk", "frozen"] as Filter[]).map((f) => {
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

        {/* Circles table */}
        <View style={{ gap: space.sm }}>
          {visible.map((c) => (
            <CircleRow key={c.circleId} c={c} t={t} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TotalTile({ label, value, color, t }: { label: string; value: string; color: string; t: AppTheme }) {
  return (
    <View style={[styles.total, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ color, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function AlertRow({ a, t }: { a: Alert; t: AppTheme }) {
  const meta = alertMeta(a.kind, t);
  const Icon = meta.Icon;
  return (
    <View style={[styles.alertCard, { backgroundColor: t.surface, borderColor: meta.color, borderLeftColor: meta.color }]}>
      <View style={[styles.alertIcon, { backgroundColor: `${meta.color}22` }]}>
        <Icon size={14} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <View style={[styles.alertPill, { backgroundColor: `${meta.color}22` }]}>
            <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
              {meta.label}
            </Text>
          </View>
          <Text variant="caption" weight="bold">{a.circleName}</Text>
          <Text variant="micro" tone="muted">· {timeAgo(a.at)}</Text>
        </View>
        <Text variant="caption" tone="secondary" style={{ marginTop: 4, lineHeight: 16 }}>{a.body}</Text>
      </View>
    </View>
  );
}

function CircleRow({ c, t }: { c: MonitoredCircle; t: AppTheme }) {
  const health = healthMeta(c.health, t);
  const HealthIcon = health.Icon;
  const status = statusMeta(c.status, t);
  const isFrozen = c.status === "frozen";

  return (
    <Pressable
      style={[
        styles.circleRow,
        {
          backgroundColor: t.surface,
          borderColor: isFrozen ? t.info : t.border,
          borderWidth: isFrozen ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.circleAccent, { backgroundColor: c.accent }]} />
      <View style={{ flex: 1, padding: space.md, gap: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold" numberOfLines={1} style={{ flex: 1 }}>{c.name}</Text>
          <View style={[styles.healthPill, { backgroundColor: health.bg }]}>
            <HealthIcon size={10} color={health.color} />
            <Text variant="micro" weight="bold" style={{ color: health.color, letterSpacing: 0.5 }}>
              {health.label.toUpperCase()}
            </Text>
          </View>
          {c.status !== "active" ? (
            <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
              <Text variant="micro" weight="bold" style={{ color: status.color, letterSpacing: 0.5 }}>
                {status.label.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Building2 size={10} color={t.textMuted} />
          <Text variant="micro" tone="secondary" numberOfLines={1}>
            {c.associationName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 2 }}>
          <Stat label="Cycle" value={`${c.cycle}/${c.cycleLength}`} t={t} />
          <Sep t={t} />
          <Stat label="Coll." value={`${Math.round(c.collectionRate * 100)}%`} t={t} tone={c.collectionRate < 0.7 ? t.danger : c.collectionRate < 0.85 ? t.warning : t.success} />
          <Sep t={t} />
          <Stat label="Disputes" value={String(c.openDisputes)} t={t} tone={c.openDisputes > 0 ? t.danger : t.textPrimary} />
          <Sep t={t} />
          <Stat label="Off-P." value={String(c.offPlatformActivity)} t={t} tone={c.offPlatformActivity > 0 ? t.warning : t.textPrimary} />
        </View>
        <View style={[styles.actionRow, { borderTopColor: t.border }]}>
          <Text variant="micro" tone="muted" weight="semibold" style={{ flex: 1 }}>
            Balance {formatCurrency(c.balance, c.currency)}
          </Text>
          {!isFrozen ? (
            <Pressable style={[styles.freezeBtn, { borderColor: t.danger }]}>
              <Snowflake size={11} color={t.danger} />
              <Text variant="micro" weight="bold" style={{ color: t.danger, letterSpacing: 0.5 }}>FREEZE</Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.unfreezeBtn, { backgroundColor: t.info }]}>
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.5 }}>UNFREEZE</Text>
            </Pressable>
          )}
          <ChevronRight size={14} color={t.textMuted} />
        </View>
      </View>
    </Pressable>
  );
}

function Stat({ label, value, t, tone }: { label: string; value: string; t: AppTheme; tone?: string }) {
  return (
    <View>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.5, fontSize: 9 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="caption" weight="bold" style={{ color: tone ?? t.textPrimary }}>{value}</Text>
    </View>
  );
}

function Sep({ t }: { t: AppTheme }) {
  return <View style={{ width: 1, height: 18, backgroundColor: t.border }} />;
}

const styles = StyleSheet.create({
  totalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  total: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: space.md,
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
    gap: 6,
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
  alertCard: {
    flexDirection: "row",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderWidth: 1,
  },
  alertIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  alertPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  circleRow: {
    flexDirection: "row",
    borderRadius: radius.md,
    overflow: "hidden",
  },
  circleAccent: {
    width: 4,
  },
  healthPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingTop: space.sm,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  freezeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  unfreezeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
});
