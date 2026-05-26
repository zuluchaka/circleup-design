// Donate flow for /sections/projects-and-fundraising/donate.
// Campaign summary, quick amounts, custom amount, payment method, anonymous
// option, sticky confirm CTA.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput, Image } from "react-native";
import {
  Heart, CreditCard, Lock, ShieldCheck, ArrowRight, EyeOff, Check, Sparkles,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const CAMPAIGN = {
  title: "School Bus for Tamale Children",
  raised: 12_400,
  goal: 25_000,
  donors: 84,
  matching: { partner: "Geneva Diaspora Foundation", multiplier: 1 },
  cover: "https://images.unsplash.com/photo-1607000970735-94c7d96f7e95?w=400&h=240&fit=crop",
};

const QUICK = [25, 50, 100, 200];

const METHODS = [
  { id: "visa",  label: "Visa · personal",    sub: "•••• 4242",  selected: true  },
  { id: "twint", label: "TWINT",              sub: "•••• 4128",  selected: false },
  { id: "iban",  label: "ZKB · CHF account",  sub: "CH93 •••• 9012", selected: false },
];

export function ProjectsDonate() {
  const t = useTheme();
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("visa");
  const [anonymous, setAnonymous] = useState(false);

  const matchAdd = CAMPAIGN.matching ? Math.min(amount, 5000 - 3200) : 0;
  const total = amount + matchAdd;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Donate" subtitle="Section 13 · Projects & Fundraising" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 120, gap: space.lg }}>
        {/* Campaign summary */}
        <Card padded={false}>
          <View style={{ flexDirection: "row", gap: space.md, padding: space.md, alignItems: "center" }}>
            <Image source={{ uri: CAMPAIGN.cover }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" numberOfLines={2}>{CAMPAIGN.title}</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                CHF {CAMPAIGN.raised.toLocaleString("de-CH")} of CHF {CAMPAIGN.goal.toLocaleString("de-CH")} · {CAMPAIGN.donors} donors
              </Text>
            </View>
          </View>
        </Card>

        {/* Amount picker */}
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            AMOUNT
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
            {QUICK.map((v) => {
              const sel = amount === v && custom === "";
              return (
                <Pressable
                  key={v}
                  onPress={() => { setAmount(v); setCustom(""); }}
                  style={[
                    styles.quickChip,
                    {
                      backgroundColor: sel ? t.primary : t.surface,
                      borderColor: sel ? t.primary : t.border,
                    },
                  ]}
                >
                  <Text variant="h3" weight="bold" style={{ color: sel ? "#fff" : t.textPrimary }}>
                    CHF {v}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{ marginTop: space.sm }}>
            <View style={[styles.customField, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Text variant="bodySmall" weight="bold" tone="secondary">CHF</Text>
              <TextInput
                value={custom || (amount.toString())}
                onChangeText={(v) => { setCustom(v); setAmount(Number(v) || 0); }}
                keyboardType="number-pad"
                placeholder="Other amount"
                placeholderTextColor={t.textMuted}
                style={{ flex: 1, color: t.textPrimary, fontSize: 18, fontWeight: "600" }}
              />
            </View>
          </View>
        </View>

        {/* Matching */}
        {matchAdd > 0 ? (
          <View style={[styles.match, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
            <Sparkles size={16} color={t.primary} />
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" style={{ color: t.primaryStrong }}>
                {CAMPAIGN.matching!.partner} will match CHF {matchAdd}
              </Text>
              <Text variant="caption" style={{ color: t.textSecondary, marginTop: 2 }}>
                Your CHF {amount} becomes CHF {total} for the campaign.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Payment method */}
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            PAYMENT METHOD
          </Text>
          <View style={{ gap: space.sm }}>
            {METHODS.map((m) => {
              const sel = method === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setMethod(m.id)}
                  style={[
                    styles.methodRow,
                    {
                      backgroundColor: sel ? t.primarySoft : t.surface,
                      borderColor: sel ? t.primary : t.border,
                      borderWidth: sel ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[styles.methodIcon, { backgroundColor: t.bgMuted }]}>
                    <CreditCard size={16} color={t.textPrimary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{m.label}</Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{m.sub}</Text>
                  </View>
                  <View style={[styles.radio, { borderColor: sel ? t.primary : t.border, backgroundColor: sel ? t.primary : "transparent" }]}>
                    {sel ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Anonymous toggle */}
        <Pressable
          onPress={() => setAnonymous(!anonymous)}
          style={[styles.anon, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <View style={[styles.anonIcon, { backgroundColor: anonymous ? t.primary : t.bgMuted }]}>
            <EyeOff size={14} color={anonymous ? "#fff" : t.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="semibold">Donate anonymously</Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
              Your name shows as "Anonymous" on the donor wall.
            </Text>
          </View>
          <View
            style={[
              styles.checkbox,
              { backgroundColor: anonymous ? t.primary : "transparent", borderColor: anonymous ? t.primary : t.border },
            ]}
          >
            {anonymous ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
          </View>
        </Pressable>

        <View style={[styles.secure, { backgroundColor: t.successSoft, borderColor: t.success }]}>
          <Lock size={14} color={t.success} />
          <Text variant="caption" style={{ color: t.success, flex: 1 }}>
            Secured by Stripe · PCI-DSS Level 1 · receipt emailed immediately
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.cta, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label={`Donate CHF ${amount}`}
          fullWidth
          size="lg"
          leadingIcon={<Heart size={16} color="#fff" />}
          trailingIcon={<ArrowRight size={16} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },
  quickChip: {
    flexBasis: "22%",
    flexGrow: 1,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: "center",
  },
  customField: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  match: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  anon: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  anonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  secure: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
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
