import { useState } from "react";
import { Modal, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  Crown,
  Check,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Smartphone,
  Landmark,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";

type Tier = "basic" | "pro" | "federation";
type Method = "card" | "twint" | "bank";

const TIERS: { id: Tier; name: string; price: number; cadence: string; cap: string; features: string[]; recommended?: boolean }[] = [
  { id: "basic", name: "Basic", price: 29, cadence: "month", cap: "up to 50 members · 5 circles", features: ["Full payment tracking", "Email support", "Basic exports"] },
  { id: "pro", name: "Pro", price: 99, cadence: "month", cap: "up to 200 members · unlimited circles", features: ["Advanced analytics", "Governance & voting", "Custom branding", "Phone & chat support", "API access"], recommended: true },
  { id: "federation", name: "Federation", price: 299, cadence: "month", cap: "unlimited members · multi-association", features: ["Federation governance", "Consolidated finance", "Dedicated success manager", "On-premise option"] },
];

const METHODS: { id: Method; label: string; hint: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: "card", label: "Card", hint: "Visa · Mastercard · Amex", Icon: CreditCard },
  { id: "twint", label: "TWINT", hint: "Swiss only · instant", Icon: Smartphone },
  { id: "bank", label: "Bank transfer", hint: "SEPA · 1–2 business days", Icon: Landmark },
];

export function SubscriptionPaymentModal({
  visible,
  onClose,
  currentTier = "pro",
}: {
  visible: boolean;
  onClose: () => void;
  currentTier?: Tier;
}) {
  const t = useTheme();
  const [tier, setTier] = useState<Tier>(currentTier === "pro" ? "federation" : "pro");
  const [method, setMethod] = useState<Method>("card");
  const [autoRenew, setAutoRenew] = useState(true);
  const [paid, setPaid] = useState(false);

  const sel = TIERS.find((tt) => tt.id === tier)!;
  const close = () => {
    onClose();
    setTimeout(() => setPaid(false), 300);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={[styles.sheet, { backgroundColor: t.bgElevated }]}>
          <View style={styles.handle}>
            <View style={[styles.handleBar, { backgroundColor: t.borderStrong }]} />
          </View>

          <View style={styles.header}>
            <Text variant="h2" weight="bold">
              {paid ? "Plan upgraded" : "Change plan"}
            </Text>
            <Pressable onPress={close} hitSlop={12} style={[styles.iconBtn, { backgroundColor: t.bgMuted }]}>
              <X size={18} color={t.textSecondary} />
            </Pressable>
          </View>

          {paid ? (
            <ScrollView contentContainerStyle={{ padding: space.lg, alignItems: "center" }}>
              <LinearGradient
                colors={[palette.amber[400], palette.amber[600]]}
                style={styles.successIcon}
              >
                <Crown size={32} color="#fff" />
              </LinearGradient>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                Welcome to {sel.name}
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: 4 }}>
                CHF {sel.price} charged via {METHODS.find((m) => m.id === method)?.label}. Receipt sent to your email.
              </Text>

              <View style={[styles.receiptCard, { backgroundColor: t.bgMuted, borderColor: t.border, marginTop: space.xl }]}>
                <View style={styles.receiptRow}>
                  <Text variant="caption" tone="secondary">Plan</Text>
                  <Text variant="caption" weight="semibold">{sel.name} · CHF {sel.price}/{sel.cadence}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text variant="caption" tone="secondary">Next billing</Text>
                  <Text variant="caption" weight="semibold">2026-06-19</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text variant="caption" tone="secondary">Auto-renew</Text>
                  <Text variant="caption" weight="semibold">{autoRenew ? "Enabled" : "Disabled"}</Text>
                </View>
              </View>

              <Pressable
                onPress={close}
                style={[styles.btnPrimary, { backgroundColor: t.primary, marginTop: space.xl, alignSelf: "stretch" }]}
              >
                <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                  Done
                </Text>
              </Pressable>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={{ padding: space.lg }}>
              {/* Tier picker */}
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                CHOOSE A PLAN
              </Text>
              <View style={{ gap: space.sm }}>
                {TIERS.map((tt) => {
                  const isSel = tier === tt.id;
                  const isCurrent = tt.id === currentTier;
                  return (
                    <Pressable
                      key={tt.id}
                      onPress={() => setTier(tt.id)}
                      disabled={isCurrent}
                      style={[
                        styles.tierCard,
                        {
                          backgroundColor: isSel ? t.primary : t.surface,
                          borderColor: isSel ? t.primary : t.border,
                          opacity: isCurrent ? 0.6 : 1,
                        },
                      ]}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
                            <Text
                              variant="h3"
                              weight="bold"
                              style={{ color: isSel ? "#fff" : t.textPrimary }}
                            >
                              {tt.name}
                            </Text>
                            {tt.recommended && !isCurrent ? (
                              <View style={[styles.recommendChip, { backgroundColor: isSel ? "rgba(255,255,255,0.2)" : t.accentSoft }]}>
                                <Sparkles size={9} color={isSel ? "#fff" : t.warning} />
                                <Text variant="micro" weight="bold" style={{ color: isSel ? "#fff" : t.warning }}>
                                  RECOMMENDED
                                </Text>
                              </View>
                            ) : null}
                            {isCurrent ? (
                              <View style={[styles.currentChip, { backgroundColor: t.bgMuted }]}>
                                <Text variant="micro" weight="bold" tone="secondary">
                                  CURRENT
                                </Text>
                              </View>
                            ) : null}
                          </View>
                          <Text
                            variant="caption"
                            style={{ color: isSel ? "rgba(255,255,255,0.8)" : t.textSecondary, marginTop: 2 }}
                          >
                            {tt.cap}
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text variant="h2" weight="bold" style={{ color: isSel ? "#fff" : t.textPrimary }}>
                            CHF {tt.price}
                          </Text>
                          <Text variant="micro" style={{ color: isSel ? "rgba(255,255,255,0.75)" : t.textMuted }}>
                            / {tt.cadence}
                          </Text>
                        </View>
                      </View>
                      {isSel ? (
                        <View style={[styles.featureList, { borderTopColor: "rgba(255,255,255,0.2)" }]}>
                          {tt.features.map((f) => (
                            <View key={f} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                              <Check size={12} color={palette.emerald[400]} />
                              <Text variant="caption" style={{ color: "rgba(255,255,255,0.9)" }}>
                                {f}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>

              {/* Payment method */}
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8, marginTop: space.xl, marginBottom: space.sm }}>
                BILLING METHOD
              </Text>
              <View style={{ flexDirection: "row", gap: space.sm }}>
                {METHODS.map((m) => {
                  const isSel = method === m.id;
                  const Icon = m.Icon;
                  return (
                    <Pressable
                      key={m.id}
                      onPress={() => setMethod(m.id)}
                      style={[
                        styles.methodCol,
                        {
                          backgroundColor: isSel ? t.primarySoft : t.surface,
                          borderColor: isSel ? t.primary : t.border,
                        },
                      ]}
                    >
                      <Icon size={18} color={isSel ? t.primary : t.textSecondary} />
                      <Text
                        variant="caption"
                        weight="bold"
                        style={{ color: isSel ? t.primary : t.textPrimary, marginTop: space.xs }}
                      >
                        {m.label}
                      </Text>
                      <Text variant="micro" tone={isSel ? "accent" : "muted"} align="center">
                        {m.hint}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Auto-renew */}
              <View style={[styles.autoRow, { backgroundColor: t.surface, borderColor: t.border, marginTop: space.lg }]}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="semibold">
                    Auto-renew
                  </Text>
                  <Text variant="micro" tone="secondary">
                    Charge automatically every month — cancel any time
                  </Text>
                </View>
                <Pressable
                  onPress={() => setAutoRenew(!autoRenew)}
                  style={[styles.switchTrack, { backgroundColor: autoRenew ? t.primary : t.borderStrong }]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      { transform: [{ translateX: autoRenew ? 18 : 2 }] },
                    ]}
                  />
                </Pressable>
              </View>

              {/* Summary */}
              <View style={[styles.summary, { backgroundColor: t.bgMuted, borderColor: t.border, marginTop: space.lg }]}>
                <View style={styles.summaryRow}>
                  <Text variant="bodySmall" tone="secondary">
                    {sel.name} plan
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    CHF {sel.price}.00
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text variant="bodySmall" tone="secondary">
                    VAT (7.7%)
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    CHF {(sel.price * 0.077).toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: t.border }]} />
                <View style={styles.summaryRow}>
                  <Text variant="body" weight="bold">
                    Charged today
                  </Text>
                  <Text variant="h3" weight="bold" style={{ color: t.primary }}>
                    CHF {(sel.price * 1.077).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Security note */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: space.md }}>
                <ShieldCheck size={12} color={t.success} />
                <Text variant="micro" tone="secondary" style={{ flex: 1 }}>
                  Stripe-secured · cancel any time · prorated refunds on downgrade
                </Text>
              </View>

              {/* Confirm */}
              <Pressable
                onPress={() => setPaid(true)}
                style={[styles.btnPrimary, { backgroundColor: t.primary, marginTop: space.lg }]}
              >
                <Crown size={16} color="#fff" />
                <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                  Confirm and pay
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "92%",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: "hidden",
  },
  handle: {
    alignItems: "center",
    paddingVertical: space.sm,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  tierCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  recommendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  currentChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  featureList: {
    marginTop: space.md,
    paddingTop: space.sm,
    borderTopWidth: 1,
  },

  methodCol: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
  },

  autoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  switchTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
  },

  summary: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: space.xs,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryDivider: {
    height: 1,
    marginVertical: space.xs,
  },

  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: radius.md,
  },

  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  receiptCard: {
    width: "100%",
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: space.sm,
  },
  receiptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
