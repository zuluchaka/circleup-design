import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Stethoscope,
  Flower2,
  BookOpen,
  Siren,
  MoreHorizontal,
  Banknote,
  Camera,
  Upload,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Step = 1 | 2 | 3;

type Reason = {
  id: string;
  label: string;
  icon: string;
};

type Attachment = {
  id: string;
  label: string;
  size: string;
  kind: "image" | "document";
};

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Reason" },
  { n: 2, label: "Amount" },
  { n: 3, label: "Documents" },
];

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function reasonIcon(id: string) {
  if (id === "medical")   return Stethoscope;
  if (id === "funeral")   return Flower2;
  if (id === "education") return BookOpen;
  if (id === "emergency") return Siren;
  return MoreHorizontal;
}

export function TreasuryRequest() {
  const t = useTheme();
  const draft = treasury.welfareRequestDraft as {
    fundId: string;
    reasons: Reason[];
    eligibility: { maxAdvance: number; trustScore: number; tenureMonths: number; detail: string };
  };

  const [step, setStep] = useState<Step>(1);
  const [reasonId, setReasonId] = useState<string>("medical");
  const [note, setNote] = useState("Cardiology appointment needed before end of month. Will provide receipts after the visit.");
  const [amount, setAmount] = useState(500);
  const [trackAsLoan, setTrackAsLoan] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "att1", label: "Garage quote.pdf",        size: "184 KB", kind: "document" },
  ]);

  const reason = draft.reasons.find((r) => r.id === reasonId)!;
  const overLimit = amount > draft.eligibility.maxAdvance;
  const canContinue = step === 1 ? Boolean(reasonId) : step === 2 ? amount > 0 && !overLimit : true;

  const goBack = () => (step > 1 ? setStep((step - 1) as Step) : router.back());
  const goNext = () => step < 3 && canContinue && setStep((step + 1) as Step);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Request welfare aid"
        subtitle={`Welfare Fund · Step ${step} of 3`}
        onBack={goBack}
      />

      {/* Progress dots */}
      <View style={[styles.dots, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        {STEPS.map((s) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <View key={s.n} style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View style={[styles.dot, { backgroundColor: done ? t.success : active ? t.primary : t.bgMuted }]}>
                {done ? (
                  <Check size={10} color="#fff" strokeWidth={3} />
                ) : (
                  <Text variant="micro" weight="bold" style={{ color: active ? "#fff" : t.textMuted }}>{s.n}</Text>
                )}
              </View>
              <Text
                variant="micro"
                weight={active ? "bold" : "semibold"}
                tone={active ? "accent" : done ? "primary" : "muted"}
                style={{ letterSpacing: 0.5, fontSize: 9 }}
              >
                {s.label.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <Step1Reason
            reasons={draft.reasons}
            reasonId={reasonId}
            setReasonId={setReasonId}
            note={note}
            setNote={setNote}
            t={t}
          />
        ) : step === 2 ? (
          <Step2Amount
            amount={amount}
            setAmount={setAmount}
            maxAdvance={draft.eligibility.maxAdvance}
            currency="CHF"
            eligibilityDetail={draft.eligibility.detail}
            trustScore={draft.eligibility.trustScore}
            tenureMonths={draft.eligibility.tenureMonths}
            trackAsLoan={trackAsLoan}
            setTrackAsLoan={setTrackAsLoan}
            overLimit={overLimit}
            t={t}
          />
        ) : (
          <Step3Documents
            attachments={attachments}
            setAttachments={setAttachments}
            reason={reason}
            amount={amount}
            note={note}
            trackAsLoan={trackAsLoan}
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
              Signers see your request and notes immediately. You'll get a push when each signer decides.
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", gap: space.sm }}>
          {step > 1 ? (
            <Pressable
              onPress={goBack}
              style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
            >
              <ChevronLeft size={16} color={t.textPrimary} />
              <Text variant="bodySmall" weight="semibold">Back</Text>
            </Pressable>
          ) : null}
          <View style={{ flex: 1 }}>
            <Button
              label={step < 3 ? `Continue to ${STEPS[step].label}` : `Submit · ${formatCurrency(amount, "CHF")}`}
              onPress={step < 3 ? goNext : undefined}
              fullWidth
              size="lg"
              disabled={!canContinue}
              trailingIcon={step < 3 ? <ChevronRight size={16} color="#fff" /> : <Check size={16} color="#fff" strokeWidth={3} />}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Reason
// ---------------------------------------------------------------------------

function Step1Reason({
  reasons,
  reasonId,
  setReasonId,
  note,
  setNote,
  t,
}: {
  reasons: Reason[];
  reasonId: string;
  setReasonId: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  t: AppTheme;
}) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Why do you need help?</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Picking a reason helps signers route your request faster. You can add details in the note.
        </Text>
      </View>

      <View style={styles.reasonGrid}>
        {reasons.map((r) => {
          const Icon = reasonIcon(r.id);
          const active = r.id === reasonId;
          return (
            <Pressable
              key={r.id}
              onPress={() => setReasonId(r.id)}
              style={[
                styles.reasonTile,
                {
                  backgroundColor: active ? t.primarySoft : t.surface,
                  borderColor: active ? t.primary : t.border,
                  borderWidth: active ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.reasonIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
                <Icon size={20} color={active ? t.primary : t.textSecondary} />
              </View>
              <Text variant="bodySmall" weight="bold" align="center" style={{ marginTop: space.sm }}>{r.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          ADD SOME CONTEXT
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="A short context helps signers approve faster…"
          placeholderTextColor={t.textMuted}
          multiline
          maxLength={300}
          style={[
            styles.textArea,
            { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border },
          ]}
        />
        <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
          {note.length}/300
        </Text>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Amount
// ---------------------------------------------------------------------------

function Step2Amount({
  amount,
  setAmount,
  maxAdvance,
  currency,
  eligibilityDetail,
  trustScore,
  tenureMonths,
  trackAsLoan,
  setTrackAsLoan,
  overLimit,
  t,
}: {
  amount: number;
  setAmount: (v: number) => void;
  maxAdvance: number;
  currency: string;
  eligibilityDetail: string;
  trustScore: number;
  tenureMonths: number;
  trackAsLoan: boolean;
  setTrackAsLoan: (v: boolean) => void;
  overLimit: boolean;
  t: AppTheme;
}) {
  const pcts = [0.25, 0.5, 0.75, 1];
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">How much do you need?</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          You can change this later if circumstances shift. Signers will see both your ask and any updates.
        </Text>
      </View>

      <Card padded>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          AMOUNT
        </Text>
        <View style={[styles.amountCard, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
          <Banknote size={20} color={t.textSecondary} />
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
            {currency}
          </Text>
          <TextInput
            value={String(amount)}
            onChangeText={(v) => setAmount(Math.max(0, parseInt(v.replace(/[^0-9]/g, "") || "0", 10)))}
            keyboardType="number-pad"
            style={[styles.amountInput, { color: t.textPrimary }]}
          />
          <View style={{ alignItems: "flex-end" }}>
            <Text variant="micro" tone="muted" weight="semibold">MAX</Text>
            <Text variant="caption" weight="bold">{maxAdvance}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.sm }}>
          {pcts.map((pct) => {
            const val = Math.round(maxAdvance * pct);
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

        {overLimit ? (
          <View style={[styles.warn, { backgroundColor: t.dangerSoft }]}>
            <AlertTriangle size={12} color={t.danger} />
            <Text variant="micro" weight="semibold" style={{ color: t.danger, flex: 1 }}>
              Exceeds your maximum of {formatCurrency(maxAdvance, currency)}
            </Text>
          </View>
        ) : null}
      </Card>

      <View style={[styles.eligibility, { backgroundColor: t.successSoft }]}>
        <ShieldCheck size={14} color={t.success} />
        <View style={{ flex: 1 }}>
          <Text variant="caption" weight="bold" style={{ color: t.success }}>
            Eligible · trust score {trustScore} · {tenureMonths} months
          </Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
            {eligibilityDetail}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => setTrackAsLoan(!trackAsLoan)}
        style={[styles.toggle, { backgroundColor: trackAsLoan ? t.primarySoft : t.surface, borderColor: trackAsLoan ? t.primary : t.border }]}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: trackAsLoan ? t.primary : "transparent",
              borderColor: trackAsLoan ? t.primary : t.borderStrong,
            },
          ]}
        >
          {trackAsLoan ? <Check size={11} color="#fff" strokeWidth={3} /> : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="bold">Track as a loan to repay</Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
            Optional. We'll set up an installment plan after approval.
          </Text>
        </View>
      </Pressable>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Documents
// ---------------------------------------------------------------------------

function Step3Documents({
  attachments,
  setAttachments,
  reason,
  amount,
  note,
  trackAsLoan,
  t,
}: {
  attachments: Attachment[];
  setAttachments: (v: Attachment[]) => void;
  reason: Reason;
  amount: number;
  note: string;
  trackAsLoan: boolean;
  t: AppTheme;
}) {
  const Icon = reasonIcon(reason.id);
  const remove = (id: string) => setAttachments(attachments.filter((a) => a.id !== id));

  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Attach supporting docs</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Quotes, receipts, photos — anything that helps signers say yes.
        </Text>
      </View>

      {/* Uploaders */}
      <View style={{ flexDirection: "row", gap: space.sm }}>
        <Pressable style={[styles.uploaderBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Camera size={16} color={t.primary} />
          <Text variant="caption" weight="bold" tone="accent">Take photo</Text>
        </Pressable>
        <Pressable style={[styles.uploaderBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Upload size={16} color={t.primary} />
          <Text variant="caption" weight="bold" tone="accent">Upload file</Text>
        </Pressable>
      </View>

      {/* Attachment list */}
      {attachments.length > 0 ? (
        <Card padded={false}>
          {attachments.map((a, i) => (
            <View
              key={a.id}
              style={[styles.attRow, i === attachments.length - 1 ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
            >
              <View style={[styles.attIcon, { backgroundColor: t.bgMuted }]}>
                <Upload size={14} color={t.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="caption" weight="bold">{a.label}</Text>
                <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{a.size} · {a.kind}</Text>
              </View>
              <Pressable onPress={() => remove(a.id)} style={[styles.removeBtn, { backgroundColor: t.dangerSoft }]}>
                <Trash2 size={11} color={t.danger} />
              </Pressable>
            </View>
          ))}
        </Card>
      ) : null}

      {/* Review summary */}
      <Card padded>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          YOU'RE ABOUT TO SUBMIT
        </Text>
        <View style={[styles.summaryHeader, { backgroundColor: t.primarySoft }]}>
          <View style={[styles.summaryIcon, { backgroundColor: t.surface }]}>
            <Icon size={16} color={t.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: t.primary }}>
              {reason.label} · {formatCurrency(amount, "CHF")}
            </Text>
            <Text variant="micro" style={{ color: t.primary, marginTop: 2 }}>
              {trackAsLoan ? "Tracked as a loan (installments)" : "Gift · no repayment"}
            </Text>
          </View>
        </View>
        <Text variant="caption" tone="secondary" style={{ marginTop: space.sm, lineHeight: 16 }} numberOfLines={4}>
          "{note}"
        </Text>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: "row",
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reasonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  reasonTile: {
    flexBasis: "30%",
    flexGrow: 1,
    padding: space.md,
    alignItems: "center",
    borderRadius: radius.md,
  },
  reasonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textArea: {
    minHeight: 100,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
    textAlignVertical: "top",
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
  eligibility: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  uploaderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  attRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  attIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
