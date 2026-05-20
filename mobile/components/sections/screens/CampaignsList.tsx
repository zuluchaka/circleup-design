import { View, ScrollView, StyleSheet } from "react-native";
import { Sparkles, Heart, ArrowRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import projects from "@/product/sections/13-projects-and-fundraising/data.json";

export function CampaignsList() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Projects" subtitle="2 active campaigns" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {projects.campaigns.map((c) => {
          const pct = (c.raised / c.goal) * 100;
          return (
            <Card key={c.id} padded={false} bordered>
              <View style={[styles.cover, { backgroundColor: c.accent }]}>
                <Heart size={20} color="rgba(255,255,255,0.85)" />
                <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>{c.title}</Text>
                {c.matching ? (
                  <View style={[styles.matching]}>
                    <Sparkles size={12} color="#fff" />
                    <Text variant="micro" weight="semibold" style={{ color: "#fff" }}>
                      Matched by {c.matching.partner} · CHF for CHF up to {c.matching.cap}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={{ padding: space.lg, gap: space.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text variant="caption" tone="muted">RAISED</Text>
                  <Text variant="caption" tone="muted">{c.daysLeft} days left</Text>
                </View>
                <Text variant="h1" weight="bold">
                  {c.currency} {c.raised.toLocaleString("de-CH")}
                  <Text variant="bodySmall" tone="muted">  /  {c.currency} {c.goal.toLocaleString("de-CH")}</Text>
                </Text>
                <ProgressBar value={pct} tone="primary" />
                <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.xs }}>
                  <StatChip label={`${c.donors} donors`} tone="info" compact />
                  <StatChip label={`${Math.round(pct)}% funded`} tone={pct >= 100 ? "success" : "neutral"} compact />
                </View>
                <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.sm }}>{c.impact}</Text>
                <View style={{ marginTop: space.sm, alignSelf: "flex-start" }}>
                  <Button
                    label="Donate"
                    trailingIcon={<ArrowRight size={14} color="#fff" />}
                  />
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    padding: space.lg,
    paddingVertical: space.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  matching: {
    marginTop: space.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
});
