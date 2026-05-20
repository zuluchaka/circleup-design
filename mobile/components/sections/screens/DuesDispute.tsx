import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  AlertTriangle,
  Coins,
  Paperclip,
  Check,
  Clock,
  ShieldCheck,
  ChevronDown,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";

const REASONS = [
  { id: "wrong_amount", label: "Wrong amount" },
  { id: "already_paid", label: "Already paid" },
  { id: "should_be_waived", label: "Should be waived" },
  { id: "duplicate", label: "Duplicate charge" },
  { id: "other", label: "Other" },
];

const CHARGES: Record<string, { label: string; amount: number; due: string; ref: string; circle: string }> = {
  e1: { label: "Annual dues · 2026", amount: 120, due: "2026-04-30", ref: "DUES-2026-018", circle: "Senegalese Union" },
};

export function DuesDispute({
  associationId,
  duesId,
}: {
  associationId: string;
  duesId: string;
}) {
  const t = useTheme();
  const charge = CHARGES[duesId] ?? { label: "Annual dues · 2026", amount: 120, due: "2026-04-30", ref: duesId, circle: associationId };

  const [reason, setReason] = useState<string>("wrong_amount");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = reason && description.trim().length >= 20 && !submitted;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        <LinearGradient
          colors={[palette.rose[500], palette.indigo[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
              <ChevronLeft size={22} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }} />
          </View>
          <View style={[styles.heroBadge]}>
            <AlertTriangle size={11} color={palette.amber[300]} />
            <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
              FILE A DISPUTE
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>
            Something wrong with this charge?
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            Your treasurer will review your dispute within 3 business days. The charge is paused until resolved.
          </Text>
        </LinearGradient>

        {/* Charge being disputed */}
        <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
          <View style={[styles.chargeCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
              <View style={[styles.iconBubble, { backgroundColor: t.primarySoft }]}>
                <Coins size={18} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.6 }}>
                  CHARGE
                </Text>
                <Text variant="body" weight="bold">
                  {charge.label}
                </Text>
                <Text variant="caption" tone="secondary">
                  {charge.circle} · Due {charge.due} · Ref {charge.ref}
                </Text>
              </View>
              <Text variant="h2" weight="bold" style={{ color: t.primary }}>
                CHF {charge.amount}
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        {submitted ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
            <View style={[styles.successCard, { backgroundColor: t.successSoft, borderColor: t.success }]}>
              <View style={[styles.successIcon, { backgroundColor: t.success }]}>
                <Check size={24} color="#fff" />
              </View>
              <Text variant="h3" weight="bold" align="center" style={{ marginTop: space.md }}>
                Dispute submitted
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.xs }}>
                Reference DSP-2026-{Math.floor(Math.random() * 9000 + 1000)}. The treasurer has been notified and the charge is paused.
              </Text>
              <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.lg }}>
                <Pressable
                  onPress={() => router.back()}
                  style={[styles.btnPrimary, { backgroundColor: t.primary }]}
                >
                  <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                    Back to ledger
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.lg }}>
              {/* Reason */}
              <View>
                <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                  REASON
                </Text>
                <View style={{ gap: 6 }}>
                  {REASONS.map((r) => {
                    const selected = reason === r.id;
                    return (
                      <Pressable
                        key={r.id}
                        onPress={() => setReason(r.id)}
                        style={[
                          styles.radioRow,
                          {
                            backgroundColor: selected ? t.primarySoft : t.surface,
                            borderColor: selected ? t.primary : t.border,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            { borderColor: selected ? t.primary : t.borderStrong },
                          ]}
                        >
                          {selected ? <View style={[styles.radioInner, { backgroundColor: t.primary }]} /> : null}
                        </View>
                        <Text
                          variant="bodySmall"
                          weight={selected ? "semibold" : "regular"}
                          style={{ color: selected ? t.primary : t.textPrimary, flex: 1 }}
                        >
                          {r.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Description */}
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.sm }}>
                  <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8 }}>
                    EXPLAIN WHAT HAPPENED
                  </Text>
                  <Text variant="micro" tone={description.length >= 20 ? "secondary" : "muted"}>
                    {description.length} / 500
                  </Text>
                </View>
                <View style={[styles.textArea, { backgroundColor: t.surface, borderColor: t.border }]}>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Provide enough context for the treasurer to understand the issue (min 20 characters)..."
                    placeholderTextColor={t.textMuted}
                    multiline
                    numberOfLines={6}
                    maxLength={500}
                    style={[styles.textInput, { color: t.textPrimary }]}
                  />
                </View>
              </View>

              {/* Attachments */}
              <View>
                <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                  EVIDENCE (OPTIONAL)
                </Text>
                <Pressable
                  onPress={() => setAttachments((a) => a + 1)}
                  style={[styles.attachBtn, { backgroundColor: t.surface, borderColor: t.border }]}
                >
                  <Paperclip size={16} color={t.primary} />
                  <Text variant="bodySmall" weight="semibold" style={{ color: t.primary }}>
                    {attachments === 0 ? "Add receipt or screenshot" : `${attachments} file${attachments === 1 ? "" : "s"} attached`}
                  </Text>
                  <ChevronDown size={14} color={t.textMuted} style={{ marginLeft: "auto" }} />
                </Pressable>
              </View>

              {/* Process info */}
              <View style={[styles.infoCard, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
                  <ShieldCheck size={14} color={t.success} />
                  <Text variant="caption" weight="bold" tone="secondary">
                    WHAT HAPPENS NEXT
                  </Text>
                </View>
                <View style={{ gap: 6, marginTop: space.sm }}>
                  <ProcessStep n={1} label="Charge is paused immediately" t={t} done />
                  <ProcessStep n={2} label="Treasurer reviews within 3 business days" t={t} />
                  <ProcessStep n={3} label="You receive the resolution by push and email" t={t} />
                </View>
              </View>
            </View>

            {/* Footer CTAs */}
            <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, flexDirection: "row", gap: space.sm }}>
              <Pressable
                onPress={() => router.back()}
                style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}
              >
                <Text variant="bodySmall" weight="semibold" tone="secondary">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => canSubmit && setSubmitted(true)}
                disabled={!canSubmit}
                style={[
                  styles.btnPrimary,
                  { backgroundColor: canSubmit ? t.primary : t.bgMuted, opacity: canSubmit ? 1 : 0.6 },
                ]}
              >
                <Text variant="bodySmall" weight="bold" style={{ color: canSubmit ? "#fff" : t.textMuted }}>
                  Submit dispute
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ProcessStep({ n, label, t, done }: { n: number; label: string; t: AppTheme; done?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
      <View
        style={[
          styles.stepDot,
          { backgroundColor: done ? t.success : t.bgElevated, borderColor: done ? t.success : t.border },
        ]}
      >
        {done ? (
          <Check size={10} color="#fff" />
        ) : (
          <Text variant="micro" weight="bold" tone="secondary">
            {n}
          </Text>
        )}
      </View>
      <Text variant="caption" tone={done ? "success" : "secondary"} style={{ flex: 1 }}>
        {label}
      </Text>
      {!done && n === 2 ? <Clock size={11} color={t.textMuted} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 56,
    paddingBottom: space.xl + space.lg,
    paddingHorizontal: space.lg,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    marginTop: space.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  chargeCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
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

  textArea: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space.md,
    minHeight: 120,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
    textAlignVertical: "top",
  },

  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
  },

  infoCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  btnGhost: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  successCard: {
    padding: space.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
