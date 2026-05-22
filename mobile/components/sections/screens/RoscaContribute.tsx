import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  ChevronLeft,
  Check,
  ChevronRight,
  Landmark,
  CreditCard,
  Smartphone,
  Shield,
  Info,
  Lock,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Step = 1 | 2 | 3;

type PaymentMethod = {
  id: string;
  label: string;
  kind: "bank" | "card" | "wallet";
  default: boolean;
};

type Circle = {
  id: string;
  name: string;
  contribution: number;
  currency: string;
  cadence: string;
  cycle: number;
  cycleLength: number;
  yourDueAmount: number;
  nextDue: string | null;
  nextPayoutTo: string | null;
  nextPayoutAmount: number;
  nextPayoutDate: string | null;
  emergencyFundRate?: number;
  accent: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function longDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CH", { day: "2-digit", month: "short" });
}

function methodIcon(kind: PaymentMethod["kind"]) {
  return kind === "bank" ? Landmark : kind === "card" ? CreditCard : Smartphone;
}

// ---------------------------------------------------------------------------
// Stepper — three pills with a connecting track
// ---------------------------------------------------------------------------

function Stepper({ step, t }: { step: Step; t: AppTheme }) {
  const steps: { n: Step; label: string }[] = [
    { n: 1, label: "Amount" },
    { n: 2, label: "Method" },
    { n: 3, label: "Confirm" },
  ];
  return (
    <View style={styles.stepperRow}>
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        const bg = done ? t.success : active ? t.primary : t.bgMuted;
        const fg = done || active ? "#fff" : t.textSecondary;
        return (
          <View key={s.n} style={{ flex: 1, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
              <View
                style={[
                  styles.stepLine,
                  { backgroundColor: i === 0 ? "transparent" : done || active ? t.primarySoft : t.bgMuted },
                ]}
              />
              <View style={[styles.stepDot, { backgroundColor: bg }]}>
                {done ? (
                  <Check size={14} color="#fff" strokeWidth={3} />
                ) : (
                  <Text variant="caption" weight="bold" style={{ color: fg }}>{s.n}</Text>
                )}
              </View>
              <View
                style={[
                  styles.stepLine,
                  { backgroundColor: i === steps.length - 1 ? "transparent" : done ? t.primarySoft : t.bgMuted },
                ]}
              />
            </View>
            <Text
              variant="micro"
              weight={active || done ? "bold" : "semibold"}
              tone={active ? "accent" : done ? "primary" : "muted"}
              style={{ marginTop: 4, letterSpacing: 0.6 }}
            >
              {s.label.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// MethodRow
// ---------------------------------------------------------------------------

function MethodRow({
  method,
  selected,
  onSelect,
  expired,
  t,
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
  expired?: boolean;
  t: AppTheme;
}) {
  const Icon = methodIcon(method.kind);
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.methodRow,
        {
          backgroundColor: selected ? t.primarySoft : t.surface,
          borderColor: selected ? t.primary : t.border,
          borderWidth: selected ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.methodIcon, { backgroundColor: selected ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Icon size={18} color={selected ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs, flexWrap: "wrap" }}>
          <Text variant="bodySmall" weight="bold">{method.label}</Text>
          {method.default ? (
            <View style={[styles.miniPill, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" tone="secondary" weight="bold">DEFAULT</Text>
            </View>
          ) : null}
          {expired ? (
            <View style={[styles.miniPill, { backgroundColor: t.dangerSoft }]}>
              <Text variant="micro" weight="bold" style={{ color: t.danger }}>RE-LINK</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          {method.kind === "bank" ? "1–2 business days · No fees" :
           method.kind === "card" ? "Instant · 1.4% processing fee" :
           "Instant · No fees"}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? t.primary : t.borderStrong,
            backgroundColor: selected ? t.primary : "transparent",
          },
        ]}
      >
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaContribute() {
  const t = useTheme();
  const circle = (rosca.circles as Circle[])[0]; // Main CHF Circle
  const methods = rosca.paymentMethods as PaymentMethod[];

  const [step, setStep] = useState<Step>(1);
  const [methodId, setMethodId] = useState<string>(methods.find((m) => m.default)?.id ?? methods[0].id);

  const selectedMethod = methods.find((m) => m.id === methodId)!;
  const efAmount = circle.yourDueAmount - circle.contribution;
  const cyclePct = circle.cycle / circle.cycleLength;

  const ctaLabel = useMemo(() => {
    if (step === 1) return "Continue to method";
    if (step === 2) return "Review contribution";
    return `Confirm ${formatCurrency(circle.yourDueAmount, circle.currency)}`;
  }, [step, circle.yourDueAmount, circle.currency]);

  const goBack = () => {
    if (step > 1) setStep((step - 1) as Step);
    else router.back();
  };

  const goNext = () => {
    if (step < 3) setStep((step + 1) as Step);
    // step 3 → would post the contribution; preview stays put
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.slate[900] }}>
      {/* Compact top bar — sits over the darker backdrop to evoke a sheet */}
      <View style={styles.topBar}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.topBarBtn}>
          <ChevronLeft size={22} color="#fff" />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text variant="caption" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>
            CONTRIBUTE
          </Text>
          <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }} numberOfLines={1}>
            {circle.name}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Sheet container */}
      <View style={[styles.sheet, { backgroundColor: t.bg }]}>
        <View style={[styles.handle, { backgroundColor: t.bgMuted }]} />

        <View style={{ paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Stepper step={step} t={t} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: space.lg,
            paddingBottom: 140,
            gap: space.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <Step1Amount circle={circle} efAmount={efAmount} cyclePct={cyclePct} t={t} />
          ) : step === 2 ? (
            <Step2Method
              methods={methods}
              methodId={methodId}
              onSelect={setMethodId}
              t={t}
            />
          ) : (
            <Step3Confirm
              circle={circle}
              method={selectedMethod}
              efAmount={efAmount}
              t={t}
            />
          )}
        </ScrollView>

        {/* CTA dock */}
        <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
          {step === 3 ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
              <Lock size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted">
                Funds go to the Main CHF Circle pot. You'll get a receipt.
              </Text>
            </View>
          ) : null}
          <View style={{ flexDirection: "row", gap: space.sm }}>
            {step > 1 ? (
              <Pressable
                onPress={goBack}
                style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
              >
                <Text variant="bodySmall" weight="semibold" tone="secondary">Back</Text>
              </Pressable>
            ) : null}
            <View style={{ flex: 1 }}>
              <Button
                label={ctaLabel}
                onPress={goNext}
                fullWidth
                size="lg"
                trailingIcon={step < 3 ? <ChevronRight size={18} color="#fff" /> : <Check size={18} color="#fff" />}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Amount
// ---------------------------------------------------------------------------

function Step1Amount({
  circle,
  efAmount,
  cyclePct,
  t,
}: {
  circle: Circle;
  efAmount: number;
  cyclePct: number;
  t: AppTheme;
}) {
  return (
    <>
      {/* Hero amount */}
      <View style={{ alignItems: "center", gap: space.xs, marginTop: space.sm }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1.5 }}>
          DUE THIS CYCLE
        </Text>
        <Text style={{ fontSize: 56, lineHeight: 60, fontWeight: "700", color: t.textPrimary }}>
          {formatCurrency(circle.yourDueAmount, circle.currency)}
        </Text>
        <View style={[styles.dueBadge, { backgroundColor: t.warningSoft }]}>
          <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.8 }}>
            DUE {shortDate(circle.nextDue).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Breakdown */}
      <Card padded>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          BREAKDOWN
        </Text>
        <View style={styles.breakdownRow}>
          <Text variant="bodySmall">Cycle contribution</Text>
          <Text variant="bodySmall" weight="semibold">{formatCurrency(circle.contribution, circle.currency)}</Text>
        </View>
        <View style={[styles.breakdownRow, { marginTop: space.xs }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Shield size={12} color={t.textSecondary} />
            <Text variant="bodySmall" tone="secondary">Emergency Fund (1%)</Text>
          </View>
          <Text variant="bodySmall" weight="semibold">{formatCurrency(efAmount, circle.currency)}</Text>
        </View>
        <View style={[styles.breakdownDivider, { backgroundColor: t.border }]} />
        <View style={styles.breakdownRow}>
          <Text variant="body" weight="bold">Total due</Text>
          <Text variant="body" weight="bold" style={{ color: t.primary }}>
            {formatCurrency(circle.yourDueAmount, circle.currency)}
          </Text>
        </View>
      </Card>

      {/* Circle context */}
      <Card padded>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.md }}>
          <View style={[styles.circleDot, { backgroundColor: circle.accent }]} />
          <Text variant="bodySmall" weight="bold" style={{ flex: 1 }}>{circle.name}</Text>
          <Text variant="micro" tone="secondary" weight="semibold" style={{ letterSpacing: 0.6 }}>
            CYCLE {circle.cycle}/{circle.cycleLength}
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: t.bgMuted }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${cyclePct * 100}%`, backgroundColor: circle.accent },
            ]}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
          <View>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>NEXT PAYOUT</Text>
            <Text variant="caption" weight="semibold" style={{ marginTop: 2 }}>{circle.nextPayoutTo}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>AMOUNT</Text>
            <Text variant="caption" weight="semibold" style={{ marginTop: 2 }}>
              {formatCurrency(circle.nextPayoutAmount, circle.currency)}
            </Text>
          </View>
        </View>
      </Card>

      {/* EF disclosure */}
      <View style={[styles.disclosureCard, { backgroundColor: t.infoSoft }]}>
        <View style={[styles.disclosureIcon, { backgroundColor: t.surface }]}>
          <Info size={14} color={t.info} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" weight="bold" style={{ color: t.info }}>
            What is the Emergency Fund?
          </Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
            A 1% surcharge auto-covers anyone who falls behind, so the cycle never stalls. Unspent balance rolls over.
          </Text>
        </View>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Method
// ---------------------------------------------------------------------------

function Step2Method({
  methods,
  methodId,
  onSelect,
  t,
}: {
  methods: PaymentMethod[];
  methodId: string;
  onSelect: (id: string) => void;
  t: AppTheme;
}) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Choose a method</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4 }}>
          Bank transfers are free. Cards settle instantly with a small fee.
        </Text>
      </View>

      <View style={{ gap: space.sm }}>
        {methods.map((m) => (
          <MethodRow
            key={m.id}
            method={m}
            selected={methodId === m.id}
            onSelect={() => onSelect(m.id)}
            t={t}
          />
        ))}
      </View>

      <Pressable style={[styles.addMethod, { borderColor: t.border, backgroundColor: t.surface }]}>
        <View style={[styles.addMethodIcon, { backgroundColor: t.bgMuted }]}>
          <Text variant="h2" weight="bold" tone="secondary" style={{ marginTop: -2 }}>+</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="semibold">Add a new method</Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>Bank account, card, or TWINT</Text>
        </View>
        <ChevronRight size={16} color={t.textMuted} />
      </Pressable>

      <View style={[styles.disclosureCard, { backgroundColor: t.successSoft }]}>
        <View style={[styles.disclosureIcon, { backgroundColor: t.surface }]}>
          <Shield size={14} color={t.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" weight="bold" style={{ color: t.success }}>
            Your details are encrypted
          </Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
            CircleUp uses bank-grade encryption. Your treasurer never sees full card numbers.
          </Text>
        </View>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Confirm
// ---------------------------------------------------------------------------

function Step3Confirm({
  circle,
  method,
  efAmount,
  t,
}: {
  circle: Circle;
  method: PaymentMethod;
  efAmount: number;
  t: AppTheme;
}) {
  const Icon = methodIcon(method.kind);
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Review &amp; confirm</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4 }}>
          One tap and your contribution is in. You can download a receipt anytime.
        </Text>
      </View>

      {/* Receipt-style card */}
      <View style={[styles.receipt, { backgroundColor: t.surface, borderColor: t.border }]}>
        {/* Header band */}
        <View style={[styles.receiptHeader, { backgroundColor: t.primary }]}>
          <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: 1.4 }}>
            CIRCLEUP CONTRIBUTION
          </Text>
          <Text variant="h1" weight="bold" style={{ color: "#fff", marginTop: 6 }}>
            {formatCurrency(circle.yourDueAmount, circle.currency)}
          </Text>
          <Text variant="micro" style={{ color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            includes {formatCurrency(efAmount, circle.currency)} Emergency Fund
          </Text>
        </View>

        {/* Notched divider */}
        <View style={styles.notchRow}>
          <View style={[styles.notch, { backgroundColor: palette.slate[900] }]} />
          <View style={[styles.dashedLine, { borderColor: t.border }]} />
          <View style={[styles.notch, { backgroundColor: palette.slate[900] }]} />
        </View>

        {/* Receipt body */}
        <View style={{ padding: space.lg, gap: space.md }}>
          <ReceiptRow label="From" right={
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs }}>
              <Avatar name="Amara Ofori" size="xs" hue={circle.accent} />
              <Text variant="bodySmall" weight="semibold">Amara Ofori</Text>
            </View>
          } t={t} />
          <ReceiptRow label="To" right={
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs }}>
              <View style={[styles.dotSmall, { backgroundColor: circle.accent }]} />
              <Text variant="bodySmall" weight="semibold">{circle.name}</Text>
            </View>
          } t={t} />
          <ReceiptRow label="Cycle" right={
            <Text variant="bodySmall" weight="semibold">
              {circle.cycle}/{circle.cycleLength} · {circle.cadence}
            </Text>
          } t={t} />
          <ReceiptRow label="Due date" right={
            <Text variant="bodySmall" weight="semibold">{longDate(circle.nextDue)}</Text>
          } t={t} />
          <ReceiptRow label="Method" right={
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon size={14} color={t.textPrimary} />
              <Text variant="bodySmall" weight="semibold">{method.label}</Text>
            </View>
          } t={t} />
        </View>
      </View>

      {/* What happens next */}
      <Card padded tone="muted" bordered={false}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          WHAT HAPPENS NEXT
        </Text>
        <NextStep n={1} title="We charge your method" body="Instant for cards/wallets, 1–2 days for bank transfer." t={t} />
        <NextStep n={2} title="Your cycle status updates" body="You'll move from Due → Paid. The collection rate climbs." t={t} />
        <NextStep n={3} title="Receipt &amp; activity post" body={`A receipt arrives by email. The Geneva dashboard shows your activity.`} t={t} last />
      </Card>
    </>
  );
}

function ReceiptRow({ label, right, t }: { label: string; right: React.ReactNode; t: AppTheme }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text variant="caption" tone="muted" weight="semibold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      {right}
    </View>
  );
}

function NextStep({
  n,
  title,
  body,
  t,
  last,
}: {
  n: number;
  title: string;
  body: string;
  t: AppTheme;
  last?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", gap: space.sm, paddingBottom: last ? 0 : space.sm }}>
      <View style={[styles.nextStepDot, { backgroundColor: t.surface, borderColor: t.border }]}>
        <Text variant="micro" weight="bold" tone="accent">{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">{title}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    gap: space.md,
  },
  topBarBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: space.sm,
    marginBottom: space.xs,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: space.sm,
  },
  stepLine: {
    flex: 1,
    height: 2,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dueBadge: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: space.xs,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.sm,
  },
  circleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  disclosureCard: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    alignItems: "flex-start",
  },
  disclosureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
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
  miniPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  addMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addMethodIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  receipt: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  receiptHeader: {
    padding: space.lg,
    paddingBottom: space.xl,
  },
  notchRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 12,
    marginTop: -6,
  },
  notch: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dashedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    marginHorizontal: -4,
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextStepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
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
  secondaryBtn: {
    paddingHorizontal: space.lg,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
