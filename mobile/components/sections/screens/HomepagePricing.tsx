// Pricing-only focused screen for /sections/homepage/pricing.
// Mirrors the PricingSection block from HomepageWelcome but standalone, with
// a focused header, transparent fee disclosure, and a comparison footnote.

import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { ArrowRight, Check, ShieldCheck, Info } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette } from "@/theme";

const PRICING = [
  {
    id: "free",
    name: "Free",
    price: "CHF 0",
    cadence: "forever",
    fee: "3.5% per contribution",
    tagline: "Try CircleUp or run one small circle",
    features: ["1 active circle", "Up to 8 members", "Basic payment tracking", "Email support"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "CHF 99",
    cadence: "per month",
    fee: "2.0% per contribution",
    tagline: "For serious organisers and associations",
    features: [
      "Unlimited circles",
      "Up to 200 members",
      "Advanced analytics",
      "Governance & voting",
      "Custom branding",
      "Phone & chat support",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    id: "basic",
    name: "Basic",
    price: "CHF 29",
    cadence: "per month",
    fee: "2.5% per contribution",
    tagline: "For multiple circles or small associations",
    features: ["5 active circles", "Up to 50 members", "Full payment tracking", "Export reports"],
    cta: "Start Basic",
    highlighted: false,
  },
] as const;

export function HomepagePricing() {
  const t = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: space.xxxl }}>
      <View style={styles.header}>
        <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1.4 }}>
          SIMPLE PRICING
        </Text>
        <Text variant="display" weight="bold" style={{ marginTop: space.xs }}>
          Pay only for what you use
        </Text>
        <Text variant="body" tone="secondary" style={{ marginTop: space.sm, lineHeight: 22 }}>
          Start free. Upgrade when you're ready. Three plans, transparent fees, and a 1% Emergency Fund contribution baked into every cycle to cover defaults.
        </Text>
      </View>

      <View style={{ paddingHorizontal: space.lg, gap: space.md }}>
        {PRICING.map((p) => (
          <View
            key={p.id}
            style={[
              styles.card,
              {
                backgroundColor: p.highlighted ? t.primary : t.surface,
                borderColor: p.highlighted ? t.primary : t.border,
              },
            ]}
          >
            {p.highlighted ? (
              <View style={styles.popular}>
                <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 1 }}>
                  MOST POPULAR
                </Text>
              </View>
            ) : null}
            <Text
              variant="caption"
              weight="bold"
              style={{ color: p.highlighted ? "rgba(255,255,255,0.85)" : t.textSecondary, letterSpacing: 1.2 }}
            >
              {p.name.toUpperCase()}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.xs, marginTop: space.xs }}>
              <Text variant="display" weight="bold" style={{ color: p.highlighted ? "#fff" : t.textPrimary }}>
                {p.price}
              </Text>
              <Text variant="bodySmall" style={{ color: p.highlighted ? "rgba(255,255,255,0.75)" : t.textSecondary }}>
                {p.cadence}
              </Text>
            </View>
            <Text variant="bodySmall" style={{ color: p.highlighted ? "rgba(255,255,255,0.85)" : t.textSecondary, marginTop: space.xs }}>
              {p.tagline}
            </Text>

            <View
              style={[
                styles.feePill,
                { backgroundColor: p.highlighted ? "rgba(255,255,255,0.15)" : t.primarySoft, marginTop: space.md },
              ]}
            >
              <Text variant="micro" weight="semibold" style={{ color: p.highlighted ? "#fff" : t.primary }}>
                {p.fee}
              </Text>
            </View>

            <View style={{ marginTop: space.lg, gap: space.sm }}>
              {p.features.map((f) => (
                <View key={f} style={{ flexDirection: "row", gap: space.sm, alignItems: "flex-start" }}>
                  <Check size={16} color={p.highlighted ? palette.emerald[400] : t.success} style={{ marginTop: 2 }} />
                  <Text variant="bodySmall" style={{ color: p.highlighted ? "#fff" : t.textPrimary, flex: 1 }}>
                    {f}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable
              style={[styles.cta, { backgroundColor: p.highlighted ? "#fff" : t.primary, marginTop: space.lg }]}
            >
              <Text variant="body" weight="semibold" style={{ color: p.highlighted ? t.primary : "#fff" }}>
                {p.cta}
              </Text>
              <ArrowRight size={16} color={p.highlighted ? t.primary : "#fff"} />
            </Pressable>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.md }}>
        <View style={[styles.note, { backgroundColor: t.successSoft, borderColor: t.success }]}>
          <ShieldCheck size={18} color={t.success} />
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: t.success }}>
              Emergency Fund — 1% on every contribution
            </Text>
            <Text variant="caption" style={{ color: t.success, opacity: 0.85, marginTop: 2, lineHeight: 16 }}>
              Pools across all circles to cover missed payments. Disclosed in every payment receipt.
            </Text>
          </View>
        </View>

        <View style={[styles.note, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
          <Info size={18} color={t.info} />
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: t.info }}>
              No hidden fees
            </Text>
            <Text variant="caption" style={{ color: t.info, opacity: 0.85, marginTop: 2, lineHeight: 16 }}>
              You see the exact platform fee before every payment. Cancel any time, keep your data.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space.lg,
    paddingTop: 72,
    paddingBottom: space.xl,
  },
  card: {
    padding: space.xl,
    borderRadius: radius.lg,
    borderWidth: 2,
    position: "relative",
  },
  popular: {
    position: "absolute",
    top: -10,
    right: space.lg,
    backgroundColor: "#fff",
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  feePill: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  cta: {
    paddingVertical: 14,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
  },
  note: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "flex-start",
  },
});
