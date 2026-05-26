// Personal loan application for /sections/credit-and-lending/loan.
// Pre-approved amount, term selector, monthly payment + APR breakdown,
// schedule preview, FINMA disclosure, apply CTA.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Wallet, ArrowRight, Calendar, ShieldCheck, Info, TrendingUp,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const APPROVED = 6000;
const APR = 0.089;
const TERMS = [6, 12, 18, 24] as const;

function monthlyPayment(principal: number, apr: number, months: number) {
  const r = apr / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function CreditLoan() {
  const t = useTheme();
  const [amount, setAmount] = useState(4000);
  const [term, setTerm] = useState<number>(12);
  const monthly = monthlyPayment(amount, APR, term);
  const total = monthly * term;
  const interest = total - amount;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Personal loan" subtitle="Section 09 · Credit & Lending" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={styles.iconBubble}>
              <Wallet size={16} color="#fff" />
            </View>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.2 }}>
              PRE-APPROVED FOR YOU
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 48, marginTop: space.xs }}>
            CHF {APPROVED.toLocaleString("de-CH")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.sm }}>
            <View style={[styles.rateChip, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{(APR * 100).toFixed(1)}% APR</Text>
            </View>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.78)" }}>fixed · no prepayment penalty</Text>
          </View>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          <Card padded>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>HOW MUCH</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.md }}>
              {[1000, 2000, 4000, 6000].map((v) => {
                const sel = amount === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => setAmount(v)}
                    style={[
                      styles.amountChip,
                      {
                        backgroundColor: sel ? t.primary : t.surface,
                        borderColor: sel ? t.primary : t.border,
                      },
                    ]}
                  >
                    <Text variant="bodySmall" weight="bold" style={{ color: sel ? "#fff" : t.textPrimary }}>
                      CHF {v.toLocaleString("de-CH")}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card padded>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>TERM</Text>
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
              {TERMS.map((m) => {
                const sel = term === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setTerm(m)}
                    style={[
                      styles.termChip,
                      {
                        backgroundColor: sel ? t.primary : t.surface,
                        borderColor: sel ? t.primary : t.border,
                      },
                    ]}
                  >
                    <Text variant="h3" weight="bold" style={{ color: sel ? "#fff" : t.textPrimary }}>{m}</Text>
                    <Text variant="micro" style={{ color: sel ? "rgba(255,255,255,0.85)" : t.textMuted }}>months</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card padded tone="primarySoft" bordered={false}>
            <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1 }}>YOUR MONTHLY PAYMENT</Text>
            <Text variant="display" weight="bold" style={{ marginTop: space.xs, color: t.primary }}>
              CHF {monthly.toFixed(0)}
            </Text>
            <Text variant="bodySmall" tone="secondary" style={{ marginTop: 2 }}>
              for {term} months · first payment due 28 of next month
            </Text>

            <View style={[styles.summaryRow, { borderTopColor: t.border, marginTop: space.md }]}>
              <View style={{ flex: 1, alignItems: "center", gap: 2, paddingTop: space.md }}>
                <Text variant="micro" tone="muted" weight="semibold">PRINCIPAL</Text>
                <Text variant="bodySmall" weight="bold">CHF {amount.toLocaleString("de-CH")}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: t.border }} />
              <View style={{ flex: 1, alignItems: "center", gap: 2, paddingTop: space.md }}>
                <Text variant="micro" tone="muted" weight="semibold">INTEREST</Text>
                <Text variant="bodySmall" weight="bold">CHF {interest.toFixed(0)}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: t.border }} />
              <View style={{ flex: 1, alignItems: "center", gap: 2, paddingTop: space.md }}>
                <Text variant="micro" tone="muted" weight="semibold">TOTAL</Text>
                <Text variant="bodySmall" weight="bold">CHF {total.toFixed(0)}</Text>
              </View>
            </View>
          </Card>

          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              PAYMENT SCHEDULE · FIRST 3 MONTHS
            </Text>
            <Card padded={false}>
              {[1, 2, 3].map((m) => {
                const r = APR / 12;
                const interestPart = (amount - (amount * m * 0.075)) * r;
                const principalPart = monthly - interestPart;
                return (
                  <View
                    key={m}
                    style={[
                      styles.scheduleRow,
                      m < 3 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                    ]}
                  >
                    <View style={[styles.monthBubble, { backgroundColor: t.primarySoft }]}>
                      <Text variant="caption" weight="bold" tone="accent">M{m}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" weight="semibold">Payment {m}</Text>
                      <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                        Principal CHF {principalPart.toFixed(0)} · Interest CHF {interestPart.toFixed(0)}
                      </Text>
                    </View>
                    <Text variant="bodySmall" weight="bold">CHF {monthly.toFixed(0)}</Text>
                  </View>
                );
              })}
            </Card>
          </View>

          <View style={[styles.disclosure, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
            <ShieldCheck size={16} color={t.warning} />
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" style={{ color: t.warning }}>
                FINMA Art. 28a · responsible-lending check required
              </Text>
              <Text variant="caption" style={{ color: t.warning, opacity: 0.85, marginTop: 2, lineHeight: 16 }}>
                You'll need to confirm income and existing obligations before final approval. Decision usually within 24 hours.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label={`Apply for CHF ${amount.toLocaleString("de-CH")}`}
          fullWidth
          size="lg"
          trailingIcon={<ArrowRight size={18} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: space.xl,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  rateChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  amountChip: {
    flex: 1,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    minWidth: "22%",
  },
  termChip: {
    flex: 1,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    gap: 2,
  },
  summaryRow: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  monthBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
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
