import { View, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Users, ShieldAlert, CalendarDays } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

export function RoscaCircleDetail() {
  const t = useTheme();
  const circle = rosca.circles[0];
  const roster = rosca.circleRoster;
  const pct = (circle.cycle / circle.cycleLength) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title={circle.name} subtitle={`Cycle ${circle.cycle} of ${circle.cycleLength}`} onBack={() => {}} variant="primary" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[circle.accent, t.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text variant="caption" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
            CYCLE PROGRESS
          </Text>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xs }}>
            {Math.round(pct)}%
          </Text>
          <View style={{ marginTop: space.sm }}>
            <ProgressBar value={pct} tone="primary" thickness={10} />
          </View>
          <View style={styles.heroStatRow}>
            <View style={styles.heroStat}>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.75)" }}>CONTRIBUTION</Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{circle.currency} {circle.contribution}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.75)" }}>MEMBERS</Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{circle.members}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.75)" }}>CADENCE</Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{circle.cadence}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          <Card padded tone="primarySoft" bordered={false}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
              <Avatar name={circle.nextPayoutTo} size="lg" />
              <View style={{ flex: 1 }}>
                <Text variant="caption" tone="accent" weight="bold">NEXT PAYOUT</Text>
                <Text variant="h2" weight="bold">{circle.nextPayoutTo}</Text>
                <Text variant="bodySmall" tone="secondary">
                  {circle.currency} {circle.nextPayoutAmount.toLocaleString("de-CH")} · {new Date(circle.nextPayoutDate).toLocaleDateString("en-CH", { day: "2-digit", month: "short" })}
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ gap: space.sm }}>
            <Button label={`Contribute ${circle.currency} ${circle.yourDueAmount}`} size="lg" fullWidth />
            <View style={{ flexDirection: "row", gap: space.sm }}>
              <View style={{ flex: 1 }}>
                <Button label="View schedule" variant="secondary" fullWidth />
              </View>
              <View style={{ flex: 1 }}>
                <Button label="Members" variant="secondary" fullWidth />
              </View>
            </View>
          </View>

          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.md }}>
              <Users size={18} color={t.textSecondary} />
              <Text variant="h3" weight="bold" style={{ marginLeft: space.sm, flex: 1 }}>This cycle</Text>
              <StatChip label="94% collected" tone="success" compact />
            </View>
            {roster.slice(0, 5).map((row) => (
              <View key={row.id} style={[styles.rosterRow, { borderBottomColor: t.border }]}>
                <Avatar name={row.name} size="sm" />
                <View style={{ flex: 1, marginLeft: space.sm }}>
                  <Text variant="bodySmall" weight="semibold">{row.name}</Text>
                  <Text variant="caption" tone="muted">Trust {row.trust} · Slot #{row.slot}</Text>
                </View>
                <StatChip
                  label={row.status === "EF" ? "Covered by EF" : row.status}
                  tone={row.status === "Paid" ? "success" : row.status === "EF" ? "warning" : row.status === "Due" ? "warning" : "danger"}
                  compact
                />
              </View>
            ))}
          </Card>

          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.sm }}>
              <ShieldAlert size={18} color={t.warning} />
              <Text variant="h3" weight="bold" style={{ marginLeft: space.sm, flex: 1 }}>Emergency fund</Text>
              <Text variant="h3" weight="bold" tone="accent">{circle.currency} {circle.emergencyFund.toLocaleString("de-CH")}</Text>
            </View>
            <Text variant="bodySmall" tone="secondary">
              1% of every contribution funds the EF. It automatically covers a member's default and is repaid as they catch up.
            </Text>
          </Card>

          <Card padded bordered tone="muted">
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.xs }}>
              <CalendarDays size={16} color={t.textSecondary} />
              <Text variant="caption" tone="muted" weight="semibold">NEXT CONTRIBUTION DUE</Text>
            </View>
            <Text variant="h2" weight="bold">
              {new Date(circle.nextDue).toLocaleDateString("en-CH", { weekday: "long", day: "2-digit", month: "long" })}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    paddingTop: space.xl,
  },
  heroStatRow: {
    flexDirection: "row",
    marginTop: space.lg,
    gap: space.md,
  },
  heroStat: {
    flex: 1,
  },
  rosterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
