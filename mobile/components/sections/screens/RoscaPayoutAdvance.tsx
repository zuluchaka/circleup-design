import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  Check,
  AlertTriangle,
  X,
  Lock,
  Sparkles,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type EligibilityCheck = {
  id: string;
  label: string;
  detail: string;
  status: "ok" | "warning" | "blocker";
};

type Eligibility = {
  yourPosition: number;
  cyclesToPayout: number;
  estimatedPayoutAmount: number;
  currency: string;
  maxAdvance: number;
  cooldownDays: number;
  checks: EligibilityCheck[];
  reviewerTrustThreshold: number;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

export function RoscaPayoutAdvance() {
  const t = useTheme();
  const elig = rosca.payoutAdvanceEligibility as Eligibility;

  const [amount, setAmount] = useState(Math.round(elig.maxAdvance * 0.5));
  const [reason, setReason] = useState("");

  const blockers = useMemo(() => elig.checks.filter((c) => c.status === "blocker"), [elig.checks]);
  const canSubmit = blockers.length === 0 && amount > 0 && amount <= elig.maxAdvance;
  const fee = Math.round(amount * 0.02); // 2% sample fee
  const willReceive = amount - fee;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Request payout advance"
        subtitle={`Slot #${elig.yourPosition} · in ${elig.cyclesToPayout} cycles`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text variant="h2" weight="bold">Get part of your payout sooner</Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
            Borrow against your future payout. The organiser reviews the request and confirms the disbursement.
          </Text>
        </View>

        {/* Eligibility checks */}
        <View>
          <FieldLabel>Eligibility</FieldLabel>
          <View style={{ gap: space.sm }}>
            {elig.checks.map((c) => (
              <CheckRow key={c.id} check={c} t={t} />
            ))}
          </View>
        </View>

        {/* Amount picker */}
        <View>
          <FieldLabel>How much</FieldLabel>
          <View style={[styles.amountCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
              {elig.currency}
            </Text>
            <TextInput
              value={String(amount)}
              onChangeText={(v) => setAmount(Math.max(0, parseInt(v.replace(/[^0-9]/g, "") || "0", 10)))}
              keyboardType="number-pad"
              style={[styles.amountInput, { color: t.textPrimary }]}
            />
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="micro" tone="muted" weight="semibold">MAX</Text>
              <Text variant="caption" weight="bold">{formatCurrency(elig.maxAdvance, elig.currency)}</Text>
            </View>
          </View>

          {/* Visual slider */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: space.sm }}>
            {[0.25, 0.5, 0.75, 1].map((pct) => {
              const val = Math.round(elig.maxAdvance * pct);
              const active = amount === val;
              return (
                <Pressable
                  key={pct}
                  onPress={() => setAmount(val)}
                  style={[styles.pctChip, { backgroundColor: active ? t.primarySoft : t.bgMuted }]}
                >
                  <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textSecondary }}>
                    {Math.round(pct * 100)}%
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {amount > elig.maxAdvance ? (
            <View style={[styles.warn, { backgroundColor: t.dangerSoft }]}>
              <AlertTriangle size={12} color={t.danger} />
              <Text variant="micro" weight="semibold" style={{ color: t.danger, flex: 1 }}>
                Exceeds your maximum of {formatCurrency(elig.maxAdvance, elig.currency)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Reason */}
        <View>
          <FieldLabel>Reason</FieldLabel>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="The organiser sees this. Be specific about timing and urgency."
            placeholderTextColor={t.textMuted}
            multiline
            maxLength={300}
            style={[
              styles.reasonInput,
              { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border },
            ]}
          />
          <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
            {reason.length}/300
          </Text>
        </View>

        {/* Summary */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            ADVANCE SUMMARY
          </Text>
          <SummaryRow label="Requested" value={formatCurrency(amount, elig.currency)} t={t} />
          <SummaryRow label="Platform fee (2%)" value={`−${formatCurrency(fee, elig.currency)}`} t={t} valueColor={t.danger} />
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <SummaryRow label="You receive" value={formatCurrency(willReceive, elig.currency)} t={t} valueColor={t.success} bold />
          <Text variant="micro" tone="muted" style={{ marginTop: space.sm, lineHeight: 14 }}>
            Deducted from your future payout of {formatCurrency(elig.estimatedPayoutAmount, elig.currency)} in cycle {elig.yourPosition}.
          </Text>
        </Card>

        {/* Review flow */}
        <View style={[styles.flowCard, { backgroundColor: t.infoSoft }]}>
          <View style={[styles.flowIcon, { backgroundColor: t.surface }]}>
            <Sparkles size={14} color={t.info} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.info }}>
              Reviewed by your organiser
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              Usually answered within 24 hours. Approved advances are released to your default disbursement method.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            One advance per circle. Cool-down {elig.cooldownDays} days after disbursement.
          </Text>
        </View>
        <Button
          label={canSubmit ? `Request ${formatCurrency(amount, elig.currency)}` : `${blockers.length} blocker${blockers.length === 1 ? "" : "s"} to resolve`}
          fullWidth
          size="lg"
          disabled={!canSubmit}
          variant={canSubmit ? "primary" : "secondary"}
          trailingIcon={canSubmit ? <Check size={18} color="#fff" strokeWidth={3} /> : undefined}
        />
      </View>
    </View>
  );
}

function CheckRow({ check, t }: { check: EligibilityCheck; t: AppTheme }) {
  const meta =
    check.status === "ok" ? { color: t.success, bg: t.successSoft, Icon: Check, pill: null } :
    check.status === "warning" ? { color: t.warning, bg: t.warningSoft, Icon: AlertTriangle, pill: "HEADS UP" } :
    { color: t.danger, bg: t.dangerSoft, Icon: X, pill: "BLOCKER" };
  const Icon = meta.Icon;

  return (
    <View style={[styles.checkRow, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.checkDot, { backgroundColor: meta.bg }]}>
        <Icon size={12} color={meta.color} strokeWidth={3} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">{check.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{check.detail}</Text>
      </View>
      {meta.pill ? (
        <View style={[styles.checkPill, { backgroundColor: meta.bg }]}>
          <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.6 }}>{meta.pill}</Text>
        </View>
      ) : null}
    </View>
  );
}

function SummaryRow({
  label,
  value,
  t,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  t: AppTheme;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text variant={bold ? "body" : "bodySmall"} weight={bold ? "bold" : "regular"} tone="secondary" style={{ flex: 1 }}>
        {label}
      </Text>
      <Text
        variant={bold ? "body" : "bodySmall"}
        weight="bold"
        style={{ color: valueColor ?? t.textPrimary }}
      >
        {value}
      </Text>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
      {String(children).toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  checkDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  checkPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700",
    padding: 0,
  },
  pctChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: radius.sm,
  },
  warn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  reasonInput: {
    minHeight: 88,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
    textAlignVertical: "top",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.xs,
  },
  flowCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  flowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
