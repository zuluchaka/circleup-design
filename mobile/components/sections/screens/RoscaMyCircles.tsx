import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Bell, Plus, ChevronRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { StatChip } from "@/components/shared/StatChip";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

function statusTone(s: string): "success" | "warning" | "danger" | "primary" {
  return s === "Paid" ? "success" : s === "Overdue" ? "danger" : s === "Due" ? "warning" : "primary";
}

export function RoscaMyCircles() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="My Circles"
        subtitle="Diaspora Circle Geneva"
        trailing={<HeaderIconButton><Bell size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <View style={{ gap: 2 }}>
          <Text variant="caption" tone="accent" weight="bold">YOUR ACTIVITY</Text>
          <Text variant="h1" weight="bold">3 active circles</Text>
          <Text variant="bodySmall" tone="secondary">CHF 275 contributed this month · 12-month streak</Text>
        </View>

        {rosca.circles.map((c) => {
          const cyclePct = c.cycle / c.cycleLength;
          return (
            <Pressable key={c.id}>
              <Card padded>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
                  <View style={[styles.accentDot, { backgroundColor: c.accent }]} />
                  <Text variant="h3" weight="bold" style={{ flex: 1 }}>{c.name}</Text>
                  <ChevronRight size={18} color={t.textMuted} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: space.sm }}>
                  <View>
                    <Text variant="caption" tone="muted">CONTRIBUTION</Text>
                    <Text variant="h2" weight="bold">{c.currency} {c.contribution}</Text>
                    <Text variant="caption" tone="secondary">{c.cadence}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text variant="caption" tone="muted">YOUR STATUS</Text>
                    <View style={{ marginTop: 2 }}>
                      <StatChip label={c.yourStatus} tone={statusTone(c.yourStatus)} />
                    </View>
                    <Text variant="caption" tone="secondary" style={{ marginTop: space.xs }}>
                      Due {new Date(c.nextDue).toLocaleDateString("en-CH", { day: "2-digit", month: "short" })}
                    </Text>
                  </View>
                </View>
                <View style={{ gap: 6 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text variant="caption" tone="muted">CYCLE {c.cycle} OF {c.cycleLength}</Text>
                    <Text variant="caption" tone="secondary">Next payout: {c.nextPayoutTo}</Text>
                  </View>
                  <ProgressBar value={cyclePct * 100} tone="primary" />
                </View>
              </Card>
            </Pressable>
          );
        })}

        <Pressable>
          <View style={[styles.addCard, { borderColor: t.border, backgroundColor: t.surface }]}>
            <View style={[styles.plusBubble, { backgroundColor: t.primarySoft }]}>
              <Plus size={20} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="body" weight="semibold">Start a new circle</Text>
              <Text variant="caption" tone="secondary">Invite up to 12 members. Configure cadence and amount.</Text>
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  plusBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
