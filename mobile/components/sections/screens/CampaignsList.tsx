import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Sparkles, Heart, ArrowRight, Plus } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import projects from "@/product/sections/13-projects-and-fundraising/data.json";

type Campaign = (typeof projects.campaigns)[number];

export function CampaignsListEmptyOrganiser() {
  return <CampaignsList campaigns={[]} organiserCanCreate={true} />;
}

export function CampaignsListEmptyMember() {
  return <CampaignsList campaigns={[]} organiserCanCreate={false} />;
}

export function CampaignsList({
  campaigns = projects.campaigns,
  organiserCanCreate = true,
}: { campaigns?: Campaign[]; organiserCanCreate?: boolean } = {}) {
  const t = useTheme();
  const count = campaigns.length;
  const subtitle =
    count === 0 ? "No active campaigns" : `${count} active campaign${count === 1 ? "" : "s"}`;

  if (count === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <AppHeader title="Projects" subtitle={subtitle} />
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
          <Card padded bordered>
            <View style={{ alignItems: "center", paddingVertical: space.xl }}>
              <View style={[styles.emptyIcon, { backgroundColor: t.primarySoft }]}>
                <Heart size={28} color={t.primary} />
              </View>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                No active campaigns
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm, lineHeight: 18, paddingHorizontal: space.md }}>
                Campaigns let your association raise money for a specific cause — a school bus, emergency relief, scholarships. Donors get progress updates and impact stories as the goal fills up.
              </Text>
              {organiserCanCreate ? (
                <Pressable style={[styles.cta, { backgroundColor: t.primary }]}>
                  <Plus size={16} color="#fff" />
                  <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                    Start a campaign
                  </Text>
                </Pressable>
              ) : (
                <Text variant="caption" tone="muted" style={{ marginTop: space.md }}>
                  Only organisers and presidents can create campaigns.
                </Text>
              )}
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Projects" subtitle={subtitle} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {campaigns.map((c) => {
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
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.md,
    marginTop: space.lg,
  },
});
