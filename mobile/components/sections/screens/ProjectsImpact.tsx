// Impact stories for /sections/projects-and-fundraising/impact.
// Story cards with hero photo, body, attribution to a campaign + share CTA.
// Aggregate impact stats at the top.

import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart, Share2, Calendar, ExternalLink, MapPin, TrendingUp, Award, Users,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const AGG = {
  campaignsCompleted: 14,
  totalRaised: 184_200,
  livesImpacted: 1_400,
  currency: "CHF",
};

const STORIES = [
  {
    id: "imp_1",
    title: "38 children riding daily",
    body: "First month with the new bus completed. 38 students riding daily; on-time arrivals improved from 64% to 96%. Two children who'd dropped out re-enrolled.",
    metric: "96% on-time arrivals",
    photoHue: palette.emerald[500],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=540&fit=crop",
    campaign: "School Bus for Tamale Children",
    location: "Tamale, Ghana",
    when: "May 14, 2026",
  },
  {
    id: "imp_2",
    title: "Fuel and maintenance under budget",
    body: "Operating costs running 12% under projection thanks to a fuel-efficient route partnership with a local cooperative. Surplus reserved for tire replacement in October.",
    metric: "-12% vs budget",
    photoHue: palette.sky[500],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&h=540&fit=crop",
    campaign: "School Bus for Tamale Children",
    location: "Tamale, Ghana",
    when: "May 8, 2026",
  },
  {
    id: "imp_3",
    title: "80 families housed",
    body: "Distribution complete: 80 displaced families received emergency kits (tent, blanket, 30-day food). Follow-up survey at 30 days shows 92% satisfaction.",
    metric: "80 families",
    photoHue: palette.rose[500],
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&h=540&fit=crop",
    campaign: "Emergency Aid · Marrakech Quake",
    location: "Marrakech, Morocco",
    when: "Apr 22, 2026",
  },
];

export function ProjectsImpact() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Impact" subtitle="Section 13 · Projects & Fundraising" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.emerald[600], palette.emerald[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.4 }}>
            CUMULATIVE IMPACT · ALL TIME
          </Text>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xs }}>
            What we built together
          </Text>

          <View style={styles.aggRow}>
            <AggCell Icon={Award} value={String(AGG.campaignsCompleted)} label="Campaigns" />
            <AggSep />
            <AggCell Icon={TrendingUp} value={`${AGG.currency} ${(AGG.totalRaised / 1000).toFixed(0)}K`} label="Raised" />
            <AggSep />
            <AggCell Icon={Users} value={`${(AGG.livesImpacted / 1000).toFixed(1)}K`} label="Lives" />
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>
            RECENT STORIES · {STORIES.length}
          </Text>

          {STORIES.map((s) => (
            <Card key={s.id} padded={false}>
              <View style={{ position: "relative" }}>
                <Image source={{ uri: s.image }} style={styles.storyImage} />
                <View style={[styles.metricChip, { backgroundColor: s.photoHue }]}>
                  <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{s.metric}</Text>
                </View>
              </View>
              <View style={{ padding: space.lg, gap: space.sm }}>
                <Text variant="h3" weight="bold">{s.title}</Text>
                <Text variant="bodySmall" tone="secondary" style={{ lineHeight: 20 }}>{s.body}</Text>

                <View style={[styles.attribution, { borderTopColor: t.border }]}>
                  <View style={[styles.attrIcon, { backgroundColor: t.primarySoft }]}>
                    <Heart size={14} color={t.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" weight="semibold" numberOfLines={1}>{s.campaign}</Text>
                    <View style={{ flexDirection: "row", gap: space.sm, marginTop: 2 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MapPin size={10} color={t.textMuted} />
                        <Text variant="micro" tone="muted">{s.location}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Calendar size={10} color={t.textMuted} />
                        <Text variant="micro" tone="muted">{s.when}</Text>
                      </View>
                    </View>
                  </View>
                  <Pressable style={[styles.shareBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
                    <Share2 size={14} color={t.textPrimary} />
                  </Pressable>
                </View>
              </View>
            </Card>
          ))}

          <Pressable style={[styles.allBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text variant="bodySmall" weight="bold" tone="accent" style={{ flex: 1 }}>
              See all 14 impact stories
            </Text>
            <ExternalLink size={14} color={t.primary} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function AggCell({ Icon, value, label }: { Icon: React.ComponentType<{ size?: number; color?: string }>; value: string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 4 }}>
      <Icon size={16} color="rgba(255,255,255,0.85)" />
      <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{value}</Text>
      <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function AggSep() {
  return <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.2)" }} />;
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: space.xl,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  aggRow: {
    flexDirection: "row",
    marginTop: space.lg,
    paddingVertical: space.md,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  storyImage: {
    width: "100%",
    height: 160,
    backgroundColor: palette.slate[200],
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  metricChip: {
    position: "absolute",
    top: space.md,
    left: space.md,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  attribution: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingTop: space.md,
    marginTop: space.sm,
    borderTopWidth: 1,
  },
  attrIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  allBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
