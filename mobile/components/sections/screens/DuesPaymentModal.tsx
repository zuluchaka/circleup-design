import { useState } from "react";
import { Modal, View, StyleSheet, Pressable, ScrollView, TextInput } from "react-native";
import {
  X,
  CreditCard,
  Landmark,
  Smartphone,
  Check,
  ShieldCheck,
  Receipt,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, type AppTheme } from "@/theme";

type Method = "card" | "bank" | "twint";

const METHODS: { id: Method; label: string; hint: string; Icon: React.ComponentType<{ size?: number; color?: string }>; fee: number }[] = [
  { id: "card", label: "Card", hint: "Visa · Mastercard · Amex · 2.9% fee", Icon: CreditCard, fee: 0.029 },
  { id: "twint", label: "TWINT", hint: "Instant · 1.4% fee · Swiss only", Icon: Smartphone, fee: 0.014 },
  { id: "bank", label: "Bank transfer", hint: "SEPA · 1-2 business days · no fee", Icon: Landmark, fee: 0 },
];

export function DuesPaymentModal({
  visible,
  onClose,
  amount,
  currency = "CHF",
  duesId = "DUES-2026-001",
}: {
  visible: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  duesId?: string;
}) {
  const t = useTheme();
  const [method, setMethod] = useState<Method>("twint");
  const [partial, setPartial] = useState(false);
  const [partialAmount, setPartialAmount] = useState(String(amount));
  const [paid, setPaid] = useState(false);

  const selected = METHODS.find((m) => m.id === method)!;
  const payAmount = partial ? Number(partialAmount) || 0 : amount;
  const feeAmount = Math.round(payAmount * selected.fee * 100) / 100;
  const total = payAmount + feeAmount;

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
              {paid ? "Payment confirmed" : "Pay dues"}
            </Text>
            <Pressable onPress={close} hitSlop={12} style={[styles.iconBtn, { backgroundColor: t.bgMuted }]}>
              <X size={18} color={t.textSecondary} />
            </Pressable>
          </View>

          {paid ? (
            <ScrollView contentContainerStyle={{ padding: space.lg, alignItems: "center" }}>
              <View style={[styles.successIcon, { backgroundColor: t.success }]}>
                <Check size={32} color="#fff" />
              </View>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                {currency} {total.toFixed(2)} paid
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: 4 }}>
                Receipt #{Math.floor(Math.random() * 9000 + 1000)} sent to your email.
              </Text>
              <View style={[styles.receiptCard, { backgroundColor: t.bgMuted, borderColor: t.border, marginTop: space.xl }]}>
                <View style={styles.receiptRow}>
                  <Text variant="caption" tone="secondary">Dues reference</Text>
                  <Text variant="caption" weight="semibold">{duesId}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text variant="caption" tone="secondary">Method</Text>
                  <Text variant="caption" weight="semibold">{selected.label}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text variant="caption" tone="secondary">Fee</Text>
                  <Text variant="caption" weight="semibold">{currency} {feeAmount.toFixed(2)}</Text>
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
              {/* Amount card */}
              <View style={[styles.amountCard, { backgroundColor: t.primary }]}>
                <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.75)", letterSpacing: 1 }}>
                  AMOUNT DUE
                </Text>
                <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: 4 }}>
                  {currency} {amount.toLocaleString("en-CH")}
                </Text>
                <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Reference {duesId}
                </Text>
              </View>

              {/* Partial toggle */}
              <View style={[styles.partialRow, { backgroundColor: t.surface, borderColor: t.border, marginTop: space.lg }]}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="semibold">
                    Pay a partial amount
                  </Text>
                  <Text variant="micro" tone="secondary">
                    Remaining balance stays on the ledger
                  </Text>
                </View>
                <Pressable
                  onPress={() => setPartial(!partial)}
                  style={[
                    styles.switchTrack,
                    { backgroundColor: partial ? t.primary : t.borderStrong },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      { transform: [{ translateX: partial ? 18 : 2 }] },
                    ]}
                  />
                </Pressable>
              </View>
              {partial ? (
                <View style={[styles.partialInput, { backgroundColor: t.surface, borderColor: t.border, marginTop: space.sm }]}>
                  <Text variant="bodySmall" weight="bold" style={{ color: t.textSecondary }}>
                    {currency}
                  </Text>
                  <TextInput
                    value={partialAmount}
                    onChangeText={setPartialAmount}
                    keyboardType="numeric"
                    style={[styles.partialInputText, { color: t.textPrimary }]}
                  />
                  <Text variant="caption" tone="muted">
                    of {amount}
                  </Text>
                </View>
              ) : null}

              {/* Payment methods */}
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8, marginTop: space.xl, marginBottom: space.sm }}>
                PAYMENT METHOD
              </Text>
              <View style={{ gap: 6 }}>
                {METHODS.map((m) => {
                  const sel = method === m.id;
                  const Icon = m.Icon;
                  return (
                    <Pressable
                      key={m.id}
                      onPress={() => setMethod(m.id)}
                      style={[
                        styles.methodRow,
                        {
                          backgroundColor: sel ? t.primarySoft : t.surface,
                          borderColor: sel ? t.primary : t.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.methodIcon,
                          { backgroundColor: sel ? t.primary : t.bgMuted },
                        ]}
                      >
                        <Icon size={16} color={sel ? "#fff" : t.textSecondary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" weight="semibold" style={{ color: sel ? t.primary : t.textPrimary }}>
                          {m.label}
                        </Text>
                        <Text variant="micro" tone="secondary">
                          {m.hint}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: sel ? t.primary : t.borderStrong },
                        ]}
                      >
                        {sel ? <View style={[styles.radioInner, { backgroundColor: t.primary }]} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Summary */}
              <View style={[styles.summary, { backgroundColor: t.bgMuted, borderColor: t.border, marginTop: space.lg }]}>
                <View style={styles.summaryRow}>
                  <Text variant="bodySmall" tone="secondary">
                    Subtotal
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    {currency} {payAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text variant="bodySmall" tone="secondary">
                    Processing fee ({(selected.fee * 100).toFixed(1)}%)
                  </Text>
                  <Text variant="bodySmall" weight="semibold">
                    {currency} {feeAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: t.border }]} />
                <View style={styles.summaryRow}>
                  <Text variant="body" weight="bold">
                    Total
                  </Text>
                  <Text variant="h3" weight="bold" style={{ color: t.primary }}>
                    {currency} {total.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Security note */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: space.md }}>
                <ShieldCheck size={12} color={t.success} />
                <Text variant="micro" tone="secondary" style={{ flex: 1 }}>
                  Secured by Stripe · PCI-DSS Level 1 · GDPR / FADP compliant
                </Text>
              </View>

              {/* Pay button */}
              <Pressable
                onPress={() => setPaid(true)}
                style={[styles.btnPrimary, { backgroundColor: t.primary, marginTop: space.lg }]}
              >
                <Receipt size={16} color="#fff" />
                <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                  Pay {currency} {total.toFixed(2)}
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

  amountCard: {
    padding: space.lg,
    borderRadius: radius.lg,
  },

  partialRow: {
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
  partialInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  partialInputText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    padding: 0,
  },

  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
