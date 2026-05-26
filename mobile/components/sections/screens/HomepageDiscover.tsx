// Educational scroll for /sections/homepage/discover.
// Explains: what a ROSCA is, cultural variants, Trust Score, Emergency Fund.
// Per spec: 3–5 horizontally-paginated cards + supporting context.

import { View, ScrollView, StyleSheet, useWindowDimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Coins, Globe, ShieldCheck, LifeBuoy, ArrowRight, Star } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius, palette } from "@/theme";

const PILLARS = [
  {
    id: "what",
    Icon: Coins,
    eyebrow: "THE BASICS",
    title: "What is a ROSCA?",
    body: "A Rotating Savings and Credit Association is a group of trusted members who pool fixed contributions every cycle and take turns receiving the full pot. No interest, no banks, just discipline and trust — refined over centuries.",
    accent: palette.indigo[500],
  },
  {
    id: "variants",
    Icon: Globe,
    eyebrow: "ONE IDEA, MANY NAMES",
    title: "Susu, tanda, paluwagan, tontine",
    body: "Same structure, different cultures. We've designed CircleUp around the governance traditions of West African susus, Latin American tandas, Filipino paluwagans, French tontines, and South Asian chit funds.",
    accent: palette.amber[500],
  },
  {
    id: "trust",
    Icon: ShieldCheck,
    eyebrow: "BUILT-IN ACCOUNTABILITY",
    title: "Trust Score makes risk visible",
    body: "Every member earns a 0–1000 Trust Score based on payment history, identity verification, peer endorsements, and tenure. You see exactly how it's calculated — and so does everyone in your circle.",
    accent: palette.emerald[500],
  },
  {
    id: "emergency",
    Icon: LifeBuoy,
    eyebrow: "PROTECTION FUND",
    title: "Emergency Fund covers defaults",
    body: "1% of every contribution feeds an Emergency Fund. If a member can't pay this cycle, the fund covers it so the payout schedule holds. No drama, no broken trust. The member repays the fund when they can.",
    accent: palette.rose[500],
  },
];

const VARIANTS = [
  { name: "Tontine", region: "West Africa · Senegal, Mali, Côte d'Ivoire", members: "12K+ on CircleUp" },
  { name: "Tanda", region: "Mexico, Peru, Colombia, Dominican Republic", members: "8.5K+ on CircleUp" },
  { name: "Susu", region: "Ghana, Nigeria, Trinidad, Guyana", members: "5K+ on CircleUp" },
  { name: "Paluwagan", region: "Philippines · Filipino diaspora", members: "3.2K+ on CircleUp" },
  { name: "Chit Fund", region: "India, Pakistan, Sri Lanka", members: "6.2K+ on CircleUp" },
];

const SUCCESS_STORIES = [
  {
    name: "Aminata Diallo",
    role: "Member · Geneva tontine",
    quote: "After 8 months I received CHF 4,800 for my daughter's university fees. The reminders meant I never missed a contribution.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
  },
  {
    name: "Carlos Mendoza",
    role: "Organiser · 5 tandas, Geneva",
    quote: "I used to spend 10 hours a week chasing payments by WhatsApp. Now I manage 60 members in 30 minutes a week.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
];

export function HomepageDiscover() {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - space.lg * 2, 320);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: space.xxxl }}>
      <LinearGradient
        colors={[palette.indigo[700], palette.indigo[900]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.4 }}>
          DISCOVER
        </Text>
        <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xs, lineHeight: 40 }}>
          How savings circles{"\n"}actually work
        </Text>
        <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.md }}>
          A four-card primer on the centuries-old practice we've brought to mobile.
        </Text>
      </LinearGradient>

      {/* Pillar cards — horizontally paginated */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + space.md}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingVertical: space.xl, gap: space.md }}
      >
        {PILLARS.map((p) => {
          const Icon = p.Icon;
          return (
            <View
              key={p.id}
              style={[
                styles.pillar,
                { width: cardWidth, backgroundColor: t.surface, borderColor: t.border, borderTopColor: p.accent, borderTopWidth: 4 },
              ]}
            >
              <View style={[styles.pillarIcon, { backgroundColor: `${p.accent}22` }]}>
                <Icon size={22} color={p.accent} />
              </View>
              <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1, marginTop: space.md }}>
                {p.eyebrow}
              </Text>
              <Text variant="h2" weight="bold" style={{ marginTop: space.xs }}>
                {p.title}
              </Text>
              <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.sm, lineHeight: 20, flex: 1 }}>
                {p.body}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Variants table */}
      <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
        <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1.2 }}>
          GLOBAL VARIANTS
        </Text>
        <Text variant="h2" weight="bold">
          Your tradition, your terminology
        </Text>
        <Card padded={false} bordered>
          {VARIANTS.map((v, i) => (
            <View
              key={v.name}
              style={[
                styles.variantRow,
                i < VARIANTS.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">{v.name}</Text>
                <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{v.region}</Text>
              </View>
              <View style={[styles.countChip, { backgroundColor: t.primarySoft }]}>
                <Text variant="micro" weight="bold" tone="accent">{v.members}</Text>
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* Success stories */}
      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.md }}>
        <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1.2 }}>
          MEMBER STORIES
        </Text>
        <Text variant="h2" weight="bold">
          Real circles, real payouts
        </Text>
        {SUCCESS_STORIES.map((s) => (
          <Card key={s.name} padded>
            <View style={{ flexDirection: "row", gap: 2, marginBottom: space.sm }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={12} color={palette.amber[400]} fill={palette.amber[400]} />
              ))}
            </View>
            <Text variant="body" style={{ lineHeight: 22 }}>"{s.quote}"</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.md }}>
              <Image source={{ uri: s.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">{s.name}</Text>
                <Text variant="micro" tone="secondary">{s.role}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
        <Button label="Take the readiness quiz" fullWidth size="lg" trailingIcon={<ArrowRight size={18} color="#fff" />} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 72,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
  },
  pillar: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: 320,
  },
  pillarIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  variantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  countChip: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.slate[200],
  },
});
