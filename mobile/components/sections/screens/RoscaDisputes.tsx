import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Plus,
  ChevronRight,
  AlertCircle,
  HandCoins,
  Users,
  ShieldAlert,
  HelpCircle,
  Clock,
  Check,
  ArrowUpRight,
  CircleDot,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Status = "open" | "acknowledged" | "escalated" | "resolved";
type DisputeType = "missed_payment" | "off_platform" | "conflict" | "fraud" | "other";
type Priority = "low" | "medium" | "high";

type Dispute = {
  id: string;
  title: string;
  filedBy: string;
  against: string;
  type: DisputeType;
  priority: Priority;
  status: Status;
  filedAt: string;
  lastUpdate: string;
  evidenceCount: number;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "open") return { color: t.warning, bg: t.warningSoft, label: "Open", Icon: CircleDot };
  if (s === "acknowledged") return { color: t.info, bg: t.infoSoft, label: "Acknowledged", Icon: Clock };
  if (s === "escalated") return { color: t.danger, bg: t.dangerSoft, label: "Escalated", Icon: ArrowUpRight };
  return { color: t.success, bg: t.successSoft, label: "Resolved", Icon: Check };
}

function typeMeta(type: DisputeType, t: AppTheme) {
  if (type === "missed_payment") return { Icon: HandCoins, label: "Missed payment" };
  if (type === "off_platform") return { Icon: ShieldAlert, label: "Off-platform" };
  if (type === "conflict") return { Icon: Users, label: "Conflict" };
  if (type === "fraud") return { Icon: AlertCircle, label: "Fraud" };
  return { Icon: HelpCircle, label: "Other" };
}

function priorityMeta(p: Priority, t: AppTheme) {
  if (p === "high") return { color: t.danger, label: "HIGH" };
  if (p === "medium") return { color: t.warning, label: "MED" };
  return { color: t.textSecondary, label: "LOW" };
}

type Filter = "open" | "all";

export function RoscaDisputes() {
  const t = useTheme();
  const disputes = rosca.disputes as Dispute[];

  const [filter, setFilter] = useState<Filter>("open");

  const visible = useMemo(() => {
    const sorted = [...disputes].sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    if (filter === "open") return sorted.filter((d) => d.status !== "resolved");
    return sorted;
  }, [filter, disputes]);

  const openCount = disputes.filter((d) => d.status !== "resolved").length;
  const escalatedCount = disputes.filter((d) => d.status === "escalated").length;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Disputes"
        subtitle={`${openCount} open · Main CHF Circle`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary banner */}
        {escalatedCount > 0 ? (
          <View style={[styles.banner, { backgroundColor: t.dangerSoft }]}>
            <ArrowUpRight size={16} color={t.danger} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
                {escalatedCount} dispute{escalatedCount === 1 ? "" : "s"} with platform support
              </Text>
              <Text variant="micro" style={{ color: t.danger, marginTop: 2 }}>
                Awaiting decision. Most resolve within 48 hours.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Filter tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          <TabBtn label="Open" count={openCount} active={filter === "open"} onPress={() => setFilter("open")} t={t} />
          <TabBtn label="All" count={disputes.length} active={filter === "all"} onPress={() => setFilter("all")} t={t} />
        </View>

        {/* List */}
        <View style={{ gap: space.sm }}>
          {visible.map((d) => (
            <DisputeRow key={d.id} d={d} t={t} />
          ))}
        </View>
      </ScrollView>

      {/* New dispute CTA */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Pressable
          style={[styles.newBtn, { backgroundColor: t.primary }]}
          onPress={() => router.push("/sections/rosca-circles/dispute-detail" as never)}
        >
          <Plus size={18} color="#fff" />
          <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>File a new dispute</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TabBtn({
  label,
  count,
  active,
  onPress,
  t,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
    >
      <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
        {label}
      </Text>
      <View style={[styles.tabCount, { backgroundColor: active ? t.primarySoft : "transparent" }]}>
        <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textMuted }}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function DisputeRow({ d, t }: { d: Dispute; t: AppTheme }) {
  const status = statusMeta(d.status, t);
  const StatusIcon = status.Icon;
  const type = typeMeta(d.type, t);
  const TypeIcon = type.Icon;
  const priority = priorityMeta(d.priority, t);

  return (
    <Pressable
      onPress={() => router.push("/sections/rosca-circles/dispute-detail" as never)}
      style={[styles.row, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={[styles.priorityBar, { backgroundColor: priority.color }]} />

      <View style={{ flex: 1, padding: space.md, gap: space.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <View style={[styles.typePill, { backgroundColor: t.bgMuted }]}>
            <TypeIcon size={10} color={t.textSecondary} />
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
              {type.label.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.priorityPill, { backgroundColor: `${priority.color}22` }]}>
            <Text variant="micro" weight="bold" style={{ color: priority.color, letterSpacing: 0.5 }}>
              {priority.label}
            </Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
            <StatusIcon size={10} color={status.color} />
            <Text variant="micro" weight="bold" style={{ color: status.color, letterSpacing: 0.5 }}>
              {status.label.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text variant="bodySmall" weight="bold" numberOfLines={2}>{d.title}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
          <Avatar name={d.filedBy} size="xs" />
          <Text variant="micro" tone="secondary">
            <Text variant="micro" weight="bold" tone="primary">{d.filedBy.split(" ")[0]}</Text> filed against <Text variant="micro" weight="semibold">{d.against.split(" ")[0]}</Text> · {timeSince(d.lastUpdate)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text variant="micro" tone="muted" weight="semibold">
            {d.evidenceCount} evidence file{d.evidenceCount === 1 ? "" : "s"} · filed {timeSince(d.filedAt)}
          </Text>
          <ChevronRight size={14} color={t.textMuted} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
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
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  priorityBar: {
    width: 4,
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
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
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
});
