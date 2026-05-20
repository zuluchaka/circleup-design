import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Building2, ChevronRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import fed from "@/product/sections/16-federations/data.json";

export function FederationsOverview() {
  const t = useTheme();
  const f = fed.federation;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Federation" subtitle={f.name} variant="primary" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[f.crestHue, t.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={[styles.crest, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
            <Building2 size={28} color="#fff" />
          </View>
          <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>{f.name}</Text>
          <Text variant="caption" style={{ color: "rgba(255,255,255,0.78)", marginTop: 2 }}>
            Active since {new Date(f.founded).getFullYear()} · {f.status}
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statCol}>
              <Text variant="h1" weight="bold" style={{ color: "#fff" }}>{f.associations}</Text>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.75)" }}>Associations</Text>
            </View>
            <View style={styles.statCol}>
              <Text variant="h1" weight="bold" style={{ color: "#fff" }}>{f.totalMembers.toLocaleString("en-US")}</Text>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.75)" }}>Total members</Text>
            </View>
            <View style={styles.statCol}>
              <Text variant="h1" weight="bold" style={{ color: "#fff" }}>{f.currency} {(f.totalCirculating / 1000).toFixed(0)}k</Text>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.75)" }}>Circulating</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          <View style={{ gap: space.sm }}>
            <Text variant="caption" tone="muted" weight="semibold">MEMBER ASSOCIATIONS</Text>
            {fed.federatedAssociations.map((a) => {
              const tone = a.duesStatus === "Current" ? "success" : "warning";
              return (
                <Pressable key={a.id}>
                  <Card padded>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text variant="body" weight="semibold">{a.name}</Text>
                        <Text variant="caption" tone="muted">{a.members} members · {a.circles} circles</Text>
                      </View>
                      <StatChip label={a.duesStatus} tone={tone} compact />
                      <ChevronRight size={16} color={t.textMuted} style={{ marginLeft: space.sm }} />
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>

          <Card padded tone="primarySoft" bordered={false}>
            <Text variant="caption" tone="accent" weight="bold">CONSOLIDATED FINANCE</Text>
            <Text variant="h2" weight="bold" style={{ marginTop: space.xs }}>
              {f.currency} {fed.consolidatedFinance.federationFundBalance.toLocaleString("de-CH")}
            </Text>
            <Text variant="bodySmall" tone="secondary">Federation Fund balance · 2 associations late on dues.</Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.xxl,
  },
  crest: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  statRow: {
    flexDirection: "row",
    marginTop: space.lg,
    gap: space.md,
  },
  statCol: {
    flex: 1,
  },
});
