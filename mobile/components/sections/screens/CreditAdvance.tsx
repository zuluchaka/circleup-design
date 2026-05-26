// Payout advance flow for /sections/credit-and-lending/advance.
// Adjustable advance amount up to your eligible max, auto-repaid from the
// next payout. Fee disclosure, repayment summary, confirm CTA.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Zap, ArrowRight, Banknote, Calendar, ShieldCheck, Info, Minus, Plus,
  ChevronRight,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const MAX = 1200;
const FEE_PCT = 0.012;
const REPAY_DATE = "2026-08-25";
const REPAY_SOURCE = "Cycle 11 payout · Main CHF Circle";
const STEP = 100;

export function CreditAdvance() {
  const t = useTheme();
  const [amount, setAmount] = useState(800);
  const fee = Math.round(amount * FEE_PCT);
  const net = amount - fee;
  const pct = (amount / MAX) * 100;

  const adjust = (delta: number) => setAmount((a) => Math.min(MAX, Math.max(0, a + delta)));

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Payout advance" subtitle="Section 09 · Credit & Lending" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient
          colors={[palette.emerald[600], palette.emerald[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={styles.zapBubble}>
              <Zap size={16} color="#fff" />
            </View>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.2 }}>
              ELIGIBLE TODAY
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 48, marginTop: space.xs }}>
            CHF {MAX.toLocaleString("de-CH")}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.xs }}>
            Tap into your next payout early. Auto-repaid on {new Date(REPAY_DATE).toLocaleDateString("en-CH", { day: "numeric", month: "long" })}.
          </Text>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          <Card padded>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>HOW MUCH</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.md, marginTop: space.md }}>
              <Pressable
                onPress={() => adjust(-STEP)}
                style={[styles.stepBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}
              >
                <Minus size={18} color={t.textPrimary} />
              </Pressable>
              <View style={{ alignItems: "center", minWidth: 140 }}>
                <Text variant="display" weight="bold">CHF {amount.toLocaleString("de-CH")}</Text>
                <Text variant="caption" tone="muted">of CHF {MAX.toLocaleString("de-CH")} max</Text>
              </View>
              <Pressable
                onPress={() => adjust(STEP)}
                style={[styles.stepBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}
              >
                <Plus size={18} color={t.textPrimary} />
              </Pressable>
            </View>
            <View style={[styles.slider, { backgroundColor: t.bgMuted, marginTop: space.lg }]}>
              <View style={[styles.sliderFill, { width: `${pct}%`, backgroundColor: t.primary }]} />
              <View style={[styles.sliderKnob, { left: `${pct}%`, backgroundColor: t.primary, borderColor: t.surface }]} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
              <Text variant="micro" tone="muted">CHF 0</Text>
              <Text variant="micro" tone="muted">CHF {MAX.toLocaleString("de-CH")}</Text>
            </View>
          </Card>

          <Card padded>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>BREAKDOWN</Text>
            <View style={{ marginTop: space.md, gap: space.sm }}>
              <Row label="Advance amount"  value={`CHF ${amount.toLocaleString("de-CH")}`} t={t} />
              <Row label={`Platform fee · ${(FEE_PCT * 100).toFixed(1)}%`} value={`-CHF ${fee.toLocaleString("de-CH")}`} t={t} subtle />
              <View style={[styles.divider, { backgroundColor: t.border }]} />
              <Row label="You receive today" value={`CHF ${net.toLocaleString("de-CH")}`} t={t} accent />
            </View>
          </Card>

          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
              <View style={[styles.repayIcon, { backgroundColor: t.primarySoft }]}>
                <Calendar size={16} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold">Auto-repaid {new Date(REPAY_DATE).toLocaleDateString("en-CH", { day: "numeric", month: "long" })}</Text>
                <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{REPAY_SOURCE}</Text>
              </View>
            </View>
            <Text variant="caption" tone="secondary" style={{ lineHeight: 16 }}>
              When your payout posts, CHF {amount.toLocaleString("de-CH")} is automatically deducted to repay this advance. No statement, no chasing, no impact on your Trust Score.
            </Text>
          </Card>

          <Pressable style={[styles.disclosure, { backgroundColor: t.surface, borderColor: t.border }]}>
            <ShieldCheck size={16} color={t.success} />
            <Text variant="caption" weight="semibold" style={{ flex: 1, color: t.textPrimary }}>
              Bound by FINMA Article 18 · responsible-lending disclosure
            </Text>
            <ChevronRight size={14} color={t.textMuted} />
          </Pressable>

          <View style={[styles.tip, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
            <Info size={16} color={t.info} />
            <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 16 }}>
              Advances don't affect your Trust Score as long as they're auto-repaid. Missed repayments are rare but do count against the On-time factor.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label={`Get CHF ${net.toLocaleString("de-CH")} advance`}
          fullWidth
          size="lg"
          trailingIcon={<ArrowRight size={18} color="#fff" />}
        />
      </View>
    </View>
  );
}

function Row({ label, value, t, subtle, accent }: { label: string; value: string; t: any; subtle?: boolean; accent?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text variant="bodySmall" tone={subtle ? "secondary" : "primary"}>{label}</Text>
      <Text
        variant={accent ? "h3" : "bodySmall"}
        weight="bold"
        style={{ color: accent ? t.success : subtle ? t.textSecondary : t.textPrimary }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: space.xl,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  zapBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    height: 6,
    borderRadius: 3,
    position: "relative",
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderKnob: {
    position: "absolute",
    top: -7,
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  repayIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
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
