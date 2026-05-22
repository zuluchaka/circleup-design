import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  Search,
  Filter,
  Users,
  Crown,
  Wallet,
  AlertCircle,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Participant = {
  memberId: string;
  name: string;
  trust: number;
  role: "Member" | "Treasurer" | "Organizer";
  slot: number;
  status: "active" | "suspended" | "in_arrears";
  onTimeRate: number;
  cyclesPaid: number;
  missedCycles: number;
  joinedAt: string;
};

type Sort = "slot" | "trust" | "onTime";

function roleMeta(role: Participant["role"], t: AppTheme) {
  if (role === "Organizer") return { color: t.primary, Icon: Crown };
  if (role === "Treasurer") return { color: t.warning, Icon: Wallet };
  return { color: t.textSecondary, Icon: Users };
}

export function RoscaParticipants() {
  const t = useTheme();
  const all = rosca.participants as Participant[];

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("slot");

  const filtered = useMemo(() => {
    let list = all;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    if (sort === "trust") list = [...list].sort((a, b) => b.trust - a.trust);
    else if (sort === "onTime") list = [...list].sort((a, b) => b.onTimeRate - a.onTimeRate);
    else list = [...list].sort((a, b) => a.slot - b.slot);
    return list;
  }, [all, query, sort]);

  const inArrears = all.filter((p) => p.status === "in_arrears").length;
  const avgOnTime = Math.round((all.reduce((acc, p) => acc + p.onTimeRate, 0) / all.length) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Participants"
        subtitle={`${all.length} members · Main CHF Circle`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary tiles */}
        <View style={styles.summary}>
          <SumTile label="Members" value={String(all.length)} t={t} />
          <View style={[styles.sumSep, { backgroundColor: t.border }]} />
          <SumTile label="Avg on-time" value={`${avgOnTime}%`} t={t} tone="success" />
          <View style={[styles.sumSep, { backgroundColor: t.border }]} />
          <SumTile label="In arrears" value={String(inArrears)} t={t} tone={inArrears > 0 ? "danger" : "neutral"} />
        </View>

        {/* Search */}
        <View style={[styles.search, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Search size={16} color={t.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name…"
            placeholderTextColor={t.textMuted}
            style={[styles.searchInput, { color: t.textPrimary }]}
          />
          <Pressable style={[styles.filterBtn, { backgroundColor: t.bgMuted }]}>
            <Filter size={12} color={t.textPrimary} />
          </Pressable>
        </View>

        {/* Sort chips */}
        <View style={[styles.sortRow, { backgroundColor: t.bgMuted }]}>
          <SortBtn label="Slot" active={sort === "slot"} onPress={() => setSort("slot")} t={t} />
          <SortBtn label="Trust" active={sort === "trust"} onPress={() => setSort("trust")} t={t} />
          <SortBtn label="On-time" active={sort === "onTime"} onPress={() => setSort("onTime")} t={t} />
        </View>

        {/* Participants list */}
        <Card padded={false}>
          {filtered.map((p, i) => (
            <ParticipantRow key={p.memberId} p={p} t={t} last={i === filtered.length - 1} />
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

function SumTile({
  label,
  value,
  t,
  tone,
}: {
  label: string;
  value: string;
  t: AppTheme;
  tone?: "success" | "danger" | "neutral";
}) {
  const color = tone === "success" ? t.success : tone === "danger" ? t.danger : t.textPrimary;
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h3" weight="bold" style={{ color, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function SortBtn({ label, active, onPress, t }: { label: string; active: boolean; onPress: () => void; t: AppTheme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sortBtn, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
    >
      <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
        {label}
      </Text>
    </Pressable>
  );
}

function ParticipantRow({ p, t, last }: { p: Participant; t: AppTheme; last: boolean }) {
  const role = roleMeta(p.role, t);
  const RoleIcon = role.Icon;
  const inArrears = p.status === "in_arrears";

  return (
    <Pressable
      style={[styles.row, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
    >
      <View style={[styles.slotChip, { backgroundColor: t.bgMuted }]}>
        <Text variant="micro" weight="bold" tone="muted">#{p.slot}</Text>
      </View>
      <Avatar name={p.name} size="sm" />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold" numberOfLines={1}>{p.name}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{p.trust}</Text>
          </View>
          {p.role !== "Member" ? (
            <View style={[styles.rolePill, { backgroundColor: `${role.color}22` }]}>
              <RoleIcon size={10} color={role.color} />
              <Text variant="micro" weight="bold" style={{ color: role.color, letterSpacing: 0.5 }}>
                {p.role.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary">
          On-time {Math.round(p.onTimeRate * 100)}% · paid {p.cyclesPaid}/{p.cyclesPaid + p.missedCycles}
        </Text>
        {inArrears ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <AlertCircle size={10} color={t.danger} />
            <Text variant="micro" weight="bold" style={{ color: t.danger, letterSpacing: 0.5 }}>IN ARREARS</Text>
          </View>
        ) : null}
      </View>
      <ChevronRight size={14} color={t.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  sumSep: {
    width: 1,
    height: 32,
    marginHorizontal: space.xs,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 4,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: space.sm,
    fontSize: 14,
  },
  filterBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  sortRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
  },
  slotChip: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
});
