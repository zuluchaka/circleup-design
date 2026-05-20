import type { ReactNode } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserPlus, CirclePlus, Megaphone, Wallet, ChevronRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import data from "@/product/sections/01-associations/data.json";

const iconFor: Record<string, (color: string) => ReactNode> = {
  user_plus:        (c) => <UserPlus size={20} color={c} />,
  start_circle:     (c) => <CirclePlus size={20} color={c} />,
  new_announcement: (c) => <Megaphone size={20} color={c} />,
  open_treasury:    (c) => <Wallet size={20} color={c} />,
  add_member:       (c) => <UserPlus size={20} color={c} />,
};

export function AssociationsDashboard() {
  const t = useTheme();
  const a = data.association;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title={a.name} subtitle={a.tagline ?? `${a.city}, ${a.country}`} variant="primary" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[a.brandHue, t.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={[styles.crest, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>DG</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
                ASSOCIATION HUB
              </Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{a.name}</Text>
            </View>
          </View>
          <View style={styles.statStrip}>
            <Stat label="Members"      value={String(a.members)} />
            <Stat label="Circles"       value={String(a.circles)} />
            <Stat label="Trust avg"     value={String(a.trustAverage)} />
            <Stat label="Funds CHF"     value={a.fundsBalance.toLocaleString("de-CH")} />
          </View>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          <View style={{ gap: space.sm }}>
            <Text variant="caption" tone="muted" weight="semibold">QUICK ACTIONS</Text>
            <View style={styles.actionsGrid}>
              {data.quickActions.map((q) => (
                <Pressable key={q.id} style={{ width: "48%" }}>
                  <Card padded>
                    <View style={[styles.actionIcon, { backgroundColor: t.primarySoft }]}>
                      {(iconFor[q.id] ?? iconFor.add_member)(t.primary)}
                    </View>
                    <Text variant="body" weight="semibold" style={{ marginTop: space.sm }}>{q.label}</Text>
                  </Card>
                </Pressable>
              ))}
            </View>
          </View>

          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.sm }}>
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>Recent activity</Text>
              <ChevronRight size={16} color={t.textMuted} />
            </View>
            {data.recentActivity.map((row) => (
              <View key={row.id} style={[styles.activityRow, { borderBottomColor: t.border }]}>
                <Avatar name={row.actor} size="sm" />
                <View style={{ flex: 1, marginLeft: space.sm }}>
                  <Text variant="bodySmall">
                    <Text variant="bodySmall" weight="semibold">{row.actor}</Text>
                    <Text variant="bodySmall" tone="secondary"> {row.message}</Text>
                  </Text>
                </View>
                <Text variant="caption" tone="muted">
                  {new Date(row.at).toLocaleDateString("en-CH", { day: "2-digit", month: "short" })}
                </Text>
              </View>
            ))}
          </Card>

          <Card padded tone="primarySoft" bordered={false}>
            <Text variant="caption" tone="accent" weight="bold">MIGRATION READY</Text>
            <Text variant="h3" weight="bold" style={{ marginTop: space.xs }}>
              Bringing your circles over from spreadsheets?
            </Text>
            <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.xs }}>
              Our 5-step wizard imports your members, contributions, and ROSCA history with Trust Score bootstrapping.
            </Text>
            <View style={{ marginTop: space.md, alignSelf: "flex-start" }}>
              <StatChip label="Start migration" tone="primary" />
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{value}</Text>
      <Text variant="micro" style={{ color: "rgba(255,255,255,0.78)" }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    paddingTop: space.xl,
    paddingBottom: space.xxl,
  },
  crest: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  statStrip: {
    flexDirection: "row",
    marginTop: space.lg,
    gap: space.sm,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
