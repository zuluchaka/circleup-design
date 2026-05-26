// Campaign detail for /sections/projects-and-fundraising/campaign-detail.
// Cover, title, story, progress bar with raised/goal, matching banner,
// donor wall, sticky donate CTA.

import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart, Sparkles, Users, Calendar, Share2, ArrowRight, MapPin,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const CAMPAIGN = {
  id: "fund_school_bus",
  title: "School Bus for Tamale Children",
  cause: "Education · Northern Ghana",
  raised: 12_400,
  goal: 25_000,
  currency: "CHF",
  donors: 84,
  daysLeft: 22,
  organiser: "Diaspora Circle Geneva",
  organiserCity: "Geneva, CH",
  impact: "Daily transport for 38 children across the 2026/27 school year.",
  story: "Our partner school in Tamale is one bus short — 38 students currently walk over an hour each way. With CHF 25,000 we can lease a school bus for the academic year and cover fuel + maintenance.\n\nThe school has been our partner since 2022 and has tripled enrolment since we started supporting it. The bus is the missing piece.",
  matching: { partner: "Geneva Diaspora Foundation", multiplier: 1, cap: 5_000, matched: 3_200 },
  coverImage: "https://images.unsplash.com/photo-1607000970735-94c7d96f7e95?w=900&h=540&fit=crop",
  donors_recent: [
    { name: "Mariam R.", amount: 200, at: "Today" },
    { name: "Kofi M.",   amount: 300, at: "Today" },
    { name: "Anonymous", amount: 150, at: "Yesterday" },
    { name: "Zara B.",   amount: 100, at: "Yesterday" },
    { name: "Ngozi O.",  amount:  50, at: "May 14" },
  ],
};

export function ProjectsCampaignDetail() {
  const t = useTheme();
  const pct = (CAMPAIGN.raised / CAMPAIGN.goal) * 100;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Campaign" subtitle={CAMPAIGN.cause} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: CAMPAIGN.coverImage }} style={styles.cover} />
          <LinearGradient
            colors={["transparent", "rgba(15, 23, 42, 0.85)"]}
            style={styles.coverGradient}
          />
          <View style={styles.coverContent}>
            <View style={[styles.causeChip, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Heart size={11} color={palette.amber[300]} fill={palette.amber[300]} />
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                {CAMPAIGN.cause.toUpperCase()}
              </Text>
            </View>
            <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.sm, fontSize: 28 }}>
              {CAMPAIGN.title}
            </Text>
          </View>
        </View>

        <View style={{ padding: space.lg, gap: space.lg }}>
          {/* Progress block */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
              <View>
                <Text variant="display" weight="bold">
                  {CAMPAIGN.currency} {CAMPAIGN.raised.toLocaleString("de-CH")}
                </Text>
                <Text variant="caption" tone="secondary">
                  raised of {CAMPAIGN.currency} {CAMPAIGN.goal.toLocaleString("de-CH")}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text variant="h2" weight="bold" style={{ color: t.success }}>{Math.round(pct)}%</Text>
                <Text variant="caption" tone="secondary">funded</Text>
              </View>
            </View>
            <View style={{ marginTop: space.md }}>
              <ProgressBar value={pct} tone="success" thickness={8} />
            </View>
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
              <StatChip label={`${CAMPAIGN.donors} donors`}    tone="info" compact />
              <StatChip label={`${CAMPAIGN.daysLeft} days left`} tone="warning" compact />
            </View>
          </View>

          {/* Matching banner */}
          {CAMPAIGN.matching ? (
            <View style={[styles.matching, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
              <View style={[styles.matchIcon, { backgroundColor: t.primary }]}>
                <Sparkles size={16} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold" style={{ color: t.primaryStrong }}>
                  {CAMPAIGN.matching.partner} matches CHF for CHF
                </Text>
                <Text variant="caption" style={{ color: t.textSecondary, marginTop: 2 }}>
                  Up to CHF {CAMPAIGN.matching.cap.toLocaleString("de-CH")} matched · CHF {CAMPAIGN.matching.matched.toLocaleString("de-CH")} already paired.
                </Text>
              </View>
            </View>
          ) : null}

          {/* Organiser */}
          <View style={[styles.organiser, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={[styles.orgIcon, { backgroundColor: t.primarySoft }]}>
              <Users size={18} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" tone="muted">ORGANISED BY</Text>
              <Text variant="bodySmall" weight="semibold">{CAMPAIGN.organiser}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <MapPin size={11} color={t.textMuted} />
                <Text variant="caption" tone="secondary">{CAMPAIGN.organiserCity}</Text>
              </View>
            </View>
            <Pressable style={[styles.shareBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Share2 size={14} color={t.textPrimary} />
            </Pressable>
          </View>

          {/* Story */}
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              WHY THIS MATTERS
            </Text>
            <Card padded>
              <Text variant="bodySmall" weight="semibold" style={{ color: t.success }}>
                {CAMPAIGN.impact}
              </Text>
              <View style={[styles.divider, { backgroundColor: t.border }]} />
              <Text variant="bodySmall" style={{ lineHeight: 20 }}>{CAMPAIGN.story}</Text>
            </Card>
          </View>

          {/* Donor wall */}
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>
                RECENT DONORS · {CAMPAIGN.donors}
              </Text>
              <Text variant="caption" weight="semibold" tone="accent">See all</Text>
            </View>
            <Card padded={false}>
              {CAMPAIGN.donors_recent.map((d, i) => (
                <View
                  key={d.name + i}
                  style={[
                    styles.donorRow,
                    i < CAMPAIGN.donors_recent.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={[styles.donorAvatar, { backgroundColor: t.primarySoft }]}>
                    <Text variant="caption" weight="bold" tone="accent">{d.name.slice(0, 1)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{d.name}</Text>
                    <Text variant="caption" tone="secondary">{d.at}</Text>
                  </View>
                  <Text variant="bodySmall" weight="bold" style={{ color: t.success }}>
                    +CHF {d.amount}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label={`Donate to ${CAMPAIGN.title.split(" ").slice(0, 2).join(" ")}`}
          fullWidth
          size="lg"
          trailingIcon={<ArrowRight size={18} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: "100%",
    height: 240,
    backgroundColor: palette.slate[300],
  },
  coverGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  coverContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
  },
  causeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  matching: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  matchIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  organiser: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  orgIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
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
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.md,
  },
  donorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  donorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
