import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  AlertTriangle,
  Lock,
  Users,
  Minus,
  Plus,
  Banknote,
  ShieldCheck,
  Globe2,
  Pencil,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Step = 1 | 2 | 3 | 4 | 5;
type Cadence = "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly";
type PayoutMethod = "fixed" | "bidding" | "random";
type Visibility = "public" | "association_only" | "private";

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Basics" },
  { n: 2, label: "Schedule" },
  { n: 3, label: "Allocation" },
  { n: 4, label: "Penalties" },
  { n: 5, label: "Review" },
];

const CURRENCIES = ["CHF", "EUR", "USD", "GBP"];
const CADENCES: Cadence[] = ["Weekly", "Bi-weekly", "Monthly", "Quarterly"];
const LANGUAGES = ["EN", "FR", "IT", "DE", "PT"];

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "long", year: "numeric" });
}

export function RoscaCreate() {
  const t = useTheme();
  const draft = rosca.draftCircle;
  const ai = rosca.createAiSuggestion;
  const tier = rosca.createTierLimit;

  const [step, setStep] = useState<Step>(1);

  // Basics
  const [name, setName] = useState(draft.name);
  const [description, setDescription] = useState(draft.description);
  const [contribution, setContribution] = useState(draft.contribution);
  const [currency, setCurrency] = useState(draft.currency);
  const [visibility, setVisibility] = useState<Visibility>(draft.visibility as Visibility);
  // Schedule
  const [cadence, setCadence] = useState<Cadence>(draft.cadence as Cadence);
  const [cycleLength, setCycleLength] = useState(draft.cycleLength);
  // Allocation
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>(draft.payoutMethod as PayoutMethod);
  const [efRate, setEfRate] = useState(draft.emergencyFundRate);
  // Penalties
  const [graceDays, setGraceDays] = useState(draft.gracePeriodDays);
  const [latePenalty, setLatePenalty] = useState(draft.latePenalty);
  const [language, setLanguage] = useState(draft.language);

  const maxMembers = cycleLength;
  const totalPot = contribution * cycleLength;
  const efPerCycle = Math.round(contribution * efRate);
  const tierExceeded = maxMembers > tier.memberLimit;
  const needsKyc = contribution >= 500 && currency === "CHF"; // simplified threshold

  const goBack = () => (step > 1 ? setStep((step - 1) as Step) : router.back());
  const goNext = () => step < 5 && setStep((step + 1) as Step);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Create circle"
        subtitle={`Step ${step} of 5 · ${STEPS[step - 1].label}`}
        onBack={goBack}
      />

      {/* Progress dots */}
      <View style={[styles.dots, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        {STEPS.map((s) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <View key={s.n} style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: done ? t.success : active ? t.primary : t.bgMuted },
                ]}
              >
                {done ? (
                  <Check size={10} color="#fff" strokeWidth={3} />
                ) : (
                  <Text variant="micro" weight="bold" style={{ color: active ? "#fff" : t.textMuted }}>
                    {s.n}
                  </Text>
                )}
              </View>
              <Text
                variant="micro"
                weight={active ? "bold" : "semibold"}
                tone={active ? "accent" : done ? "primary" : "muted"}
                style={{ letterSpacing: 0.4, fontSize: 9 }}
              >
                {s.label.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: space.lg,
          paddingBottom: 140,
          gap: space.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <Step1Basics
            name={name} setName={setName}
            description={description} setDescription={setDescription}
            contribution={contribution} setContribution={setContribution}
            currency={currency} setCurrency={setCurrency}
            visibility={visibility} setVisibility={setVisibility}
            t={t}
          />
        ) : step === 2 ? (
          <Step2Schedule
            cadence={cadence} setCadence={setCadence}
            cycleLength={cycleLength} setCycleLength={setCycleLength}
            tier={tier} tierExceeded={tierExceeded}
            ai={ai}
            onApplyAi={() => {
              setCycleLength(ai.maxMembers);
            }}
            t={t}
          />
        ) : step === 3 ? (
          <Step3Allocation
            payoutMethod={payoutMethod} setPayoutMethod={setPayoutMethod}
            efRate={efRate} setEfRate={setEfRate}
            efPerCycle={efPerCycle} currency={currency}
            t={t}
          />
        ) : step === 4 ? (
          <Step4Penalties
            graceDays={graceDays} setGraceDays={setGraceDays}
            latePenalty={latePenalty} setLatePenalty={setLatePenalty}
            language={language} setLanguage={setLanguage}
            t={t}
          />
        ) : (
          <Step5Review
            draft={{
              name, description, contribution, currency, cadence,
              cycleLength, maxMembers, payoutMethod, efRate,
              graceDays, latePenalty, language, visibility,
            }}
            totalPot={totalPot}
            efPerCycle={efPerCycle}
            tierExceeded={tierExceeded}
            tier={tier}
            needsKyc={needsKyc}
            onEdit={(s) => setStep(s)}
            t={t}
          />
        )}
      </ScrollView>

      {/* Bottom dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
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
              label={step < 5 ? `Continue to ${STEPS[step].label}` : "Create circle"}
              onPress={goNext}
              fullWidth
              size="lg"
              trailingIcon={step < 5 ? <ChevronRight size={18} color="#fff" /> : <Check size={18} color="#fff" strokeWidth={3} />}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Basics
// ---------------------------------------------------------------------------

function Step1Basics({
  name, setName,
  description, setDescription,
  contribution, setContribution,
  currency, setCurrency,
  visibility, setVisibility,
  t,
}: {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  contribution: number; setContribution: (v: number) => void;
  currency: string; setCurrency: (v: string) => void;
  visibility: Visibility; setVisibility: (v: Visibility) => void;
  t: AppTheme;
}) {
  return (
    <>
      <StepHeader title="The basics" body="Give your circle a name, set the contribution, and decide who can see it." />

      <FieldLabel>Circle name</FieldLabel>
      <Input value={name} onChangeText={setName} placeholder="e.g. Builders Circle Geneva" t={t} />

      <FieldLabel>Description</FieldLabel>
      <Input value={description} onChangeText={setDescription} multiline minHeight={88} t={t} />

      <View style={{ flexDirection: "row", gap: space.md }}>
        <View style={{ flex: 1.4 }}>
          <FieldLabel>Contribution</FieldLabel>
          <Stepper
            value={contribution}
            onChange={setContribution}
            step={25}
            min={25}
            max={5000}
            prefix={currency}
            t={t}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FieldLabel>Currency</FieldLabel>
          <Segmented options={CURRENCIES} value={currency} onChange={setCurrency} t={t} />
        </View>
      </View>

      <FieldLabel>Visibility</FieldLabel>
      <View style={{ gap: space.sm }}>
        <RadioRow
          Icon={Globe2}
          title="Public"
          body="Listed in Discover. Anyone in the network can request to join."
          selected={visibility === "public"}
          onSelect={() => setVisibility("public")}
          t={t}
        />
        <RadioRow
          Icon={Users}
          title="Association only"
          body="Only members of your association can see and join."
          selected={visibility === "association_only"}
          onSelect={() => setVisibility("association_only")}
          t={t}
        />
        <RadioRow
          Icon={Lock}
          title="Private"
          body="Invitation-only. Won't appear in Discover."
          selected={visibility === "private"}
          onSelect={() => setVisibility("private")}
          t={t}
        />
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Schedule
// ---------------------------------------------------------------------------

function Step2Schedule({
  cadence, setCadence,
  cycleLength, setCycleLength,
  tier, tierExceeded,
  ai,
  onApplyAi,
  t,
}: {
  cadence: Cadence; setCadence: (v: Cadence) => void;
  cycleLength: number; setCycleLength: (v: number) => void;
  tier: { tier: string; memberLimit: number; current: number };
  tierExceeded: boolean;
  ai: typeof rosca.createAiSuggestion;
  onApplyAi: () => void;
  t: AppTheme;
}) {
  return (
    <>
      <StepHeader title="When and how often" body="One rotation = one cycle per member. The cycle length sets the maximum number of members." />

      <FieldLabel>Cadence</FieldLabel>
      <Segmented options={CADENCES} value={cadence} onChange={(v) => setCadence(v as Cadence)} t={t} />

      <FieldLabel>Cycle length</FieldLabel>
      <Stepper
        value={cycleLength}
        onChange={setCycleLength}
        step={1}
        min={3}
        max={36}
        suffix={`cycles · ${cycleLength} members`}
        t={t}
      />

      {/* Tier limit */}
      <View style={[styles.miniNote, { backgroundColor: tierExceeded ? t.dangerSoft : t.bgMuted }]}>
        <Users size={12} color={tierExceeded ? t.danger : t.textSecondary} />
        <Text variant="micro" weight="semibold" style={{ color: tierExceeded ? t.danger : t.textSecondary, flex: 1 }}>
          {tier.tier} tier · {tier.memberLimit} members max{tierExceeded ? " · upgrade required" : ""}
        </Text>
      </View>

      {/* AI suggestion */}
      <View style={[styles.aiCard, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Sparkles size={14} color={t.primary} />
          <Text variant="caption" weight="bold" style={{ color: t.primary, letterSpacing: 0.5 }}>
            AI SUGGESTION · {Math.round(ai.successProbability * 100)}% SUCCESS PROBABILITY
          </Text>
        </View>
        <Text variant="bodySmall" weight="semibold">
          Try {ai.maxMembers} members on a {ai.payoutMethod} rotation
        </Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 4, lineHeight: 14 }}>
          {ai.reason}
        </Text>
        <Pressable onPress={onApplyAi} style={[styles.aiBtn, { backgroundColor: t.primary }]}>
          <Sparkles size={12} color="#fff" />
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Apply suggestion</Text>
        </Pressable>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Allocation
// ---------------------------------------------------------------------------

function Step3Allocation({
  payoutMethod, setPayoutMethod,
  efRate, setEfRate,
  efPerCycle, currency,
  t,
}: {
  payoutMethod: PayoutMethod; setPayoutMethod: (v: PayoutMethod) => void;
  efRate: number; setEfRate: (v: number) => void;
  efPerCycle: number; currency: string;
  t: AppTheme;
}) {
  return (
    <>
      <StepHeader title="How payouts are allocated" body="Choose how members take their turn, and set aside a small surcharge to protect the circle from missed contributions." />

      <FieldLabel>Payout method</FieldLabel>
      <View style={{ gap: space.sm }}>
        <RadioRow
          Icon={Banknote}
          title="Fixed order"
          body="Rotation order set at the start. Predictable and simple."
          selected={payoutMethod === "fixed"}
          onSelect={() => setPayoutMethod("fixed")}
          recommended
          t={t}
        />
        <RadioRow
          Icon={Sparkles}
          title="Bidding"
          body="Members bid each cycle. Highest bid wins, with bid going into the pot."
          selected={payoutMethod === "bidding"}
          onSelect={() => setPayoutMethod("bidding")}
          t={t}
        />
        <RadioRow
          Icon={Globe2}
          title="Random"
          body="One member drawn at random per cycle until everyone's paid."
          selected={payoutMethod === "random"}
          onSelect={() => setPayoutMethod("random")}
          t={t}
        />
      </View>

      <FieldLabel>Emergency Fund rate</FieldLabel>
      <View style={[styles.sliderCard, { backgroundColor: t.surface, borderColor: t.border }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
          <Text variant="h2" weight="bold">{Math.round(efRate * 100)}%</Text>
          <Text variant="caption" tone="secondary">
            +{formatCurrency(efPerCycle, currency)} per cycle
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
          {[0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03].map((r) => (
            <Pressable
              key={r}
              onPress={() => setEfRate(r)}
              style={[
                styles.sliderDot,
                {
                  backgroundColor: r <= efRate ? t.primary : t.bgMuted,
                  borderColor: r === efRate ? t.primary : "transparent",
                  borderWidth: r === efRate ? 0 : 0,
                  transform: r === efRate ? [{ scale: 1.5 }] : undefined,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
          <Text variant="micro" tone="muted" weight="semibold">0%</Text>
          <Text variant="micro" tone="muted" weight="semibold">3%</Text>
        </View>
      </View>

      <View style={[styles.disclosure, { backgroundColor: t.infoSoft }]}>
        <ShieldCheck size={14} color={t.info} />
        <Text variant="micro" style={{ color: t.info, flex: 1, lineHeight: 14 }}>
          The Emergency Fund auto-covers missed contributions so the cycle never stalls. Unspent balance rolls into the next cycle.
        </Text>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Penalties
// ---------------------------------------------------------------------------

function Step4Penalties({
  graceDays, setGraceDays,
  latePenalty, setLatePenalty,
  language, setLanguage,
  t,
}: {
  graceDays: number; setGraceDays: (v: number) => void;
  latePenalty: number; setLatePenalty: (v: number) => void;
  language: string; setLanguage: (v: string) => void;
  t: AppTheme;
}) {
  return (
    <>
      <StepHeader title="Penalties and language" body="Set the grace period and late penalty for missed payments, and choose the circle's working language." />

      <FieldLabel>Grace period</FieldLabel>
      <Stepper
        value={graceDays}
        onChange={setGraceDays}
        step={1}
        min={0}
        max={14}
        suffix={`day${graceDays === 1 ? "" : "s"} before late penalty kicks in`}
        t={t}
      />

      <FieldLabel>Late penalty</FieldLabel>
      <View style={[styles.sliderCard, { backgroundColor: t.surface, borderColor: t.border }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
          <Text variant="h2" weight="bold">{Math.round(latePenalty * 100)}%</Text>
          <Text variant="caption" tone="secondary">added to the contribution</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
          {[0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.075, 0.1].map((r) => (
            <Pressable
              key={r}
              onPress={() => setLatePenalty(r)}
              style={[
                styles.sliderDot,
                {
                  backgroundColor: r <= latePenalty ? t.warning : t.bgMuted,
                  transform: r === latePenalty ? [{ scale: 1.5 }] : undefined,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
          <Text variant="micro" tone="muted" weight="semibold">0%</Text>
          <Text variant="micro" tone="muted" weight="semibold">10%</Text>
        </View>
      </View>

      <FieldLabel>Working language</FieldLabel>
      <Segmented options={LANGUAGES} value={language} onChange={setLanguage} t={t} />

      <View style={[styles.disclosure, { backgroundColor: t.warningSoft }]}>
        <AlertTriangle size={14} color={t.warning} />
        <Text variant="micro" style={{ color: t.warning, flex: 1, lineHeight: 14 }}>
          Penalties are designed to encourage on-time payment. Members can still be auto-covered by the Emergency Fund if needed.
        </Text>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 5 — Review
// ---------------------------------------------------------------------------

function Step5Review({
  draft,
  totalPot,
  efPerCycle,
  tierExceeded,
  tier,
  needsKyc,
  onEdit,
  t,
}: {
  draft: any;
  totalPot: number;
  efPerCycle: number;
  tierExceeded: boolean;
  tier: { tier: string; memberLimit: number };
  needsKyc: boolean;
  onEdit: (s: Step) => void;
  t: AppTheme;
}) {
  return (
    <>
      <StepHeader title="Review &amp; create" body="One last look — tap any section to edit. Members will be invited after you create the circle." />

      {/* Summary hero */}
      <View style={[styles.reviewHero, { backgroundColor: t.primary }]}>
        <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1.5 }}>
          TOTAL POT PER MEMBER
        </Text>
        <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 36, lineHeight: 40, marginTop: 4 }}>
          {formatCurrency(totalPot, draft.currency)}
        </Text>
        <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
          {formatCurrency(draft.contribution, draft.currency)} × {draft.cycleLength} cycles · {draft.cadence.toLowerCase()}
        </Text>
      </View>

      {/* Warnings */}
      {tierExceeded ? (
        <View style={[styles.warningBlock, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
          <AlertTriangle size={16} color={t.danger} />
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.danger }}>
              Exceeds {tier.tier} tier
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              Your tier allows {tier.memberLimit} members per circle. Reduce the cycle length or upgrade to continue.
            </Text>
          </View>
        </View>
      ) : null}
      {needsKyc ? (
        <View style={[styles.warningBlock, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
          <ShieldCheck size={16} color={t.warning} />
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.warning }}>
              Enhanced KYC required
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              Contributions of CHF 500/month or above require Enhanced KYC for every joining member.
            </Text>
          </View>
        </View>
      ) : null}

      {/* Section cards */}
      <ReviewSection title="Basics" onEdit={() => onEdit(1)} t={t}>
        <ReviewRow label="Name" value={draft.name} t={t} />
        <ReviewRow label="Visibility" value={cap(draft.visibility.replace("_", " "))} t={t} />
        <ReviewRow label="Contribution" value={`${formatCurrency(draft.contribution, draft.currency)} ${draft.cadence.toLowerCase()}`} t={t} last />
      </ReviewSection>

      <ReviewSection title="Schedule" onEdit={() => onEdit(2)} t={t}>
        <ReviewRow label="Cadence" value={draft.cadence} t={t} />
        <ReviewRow label="Cycle length" value={`${draft.cycleLength} cycles`} t={t} />
        <ReviewRow label="Max members" value={`${draft.maxMembers}`} t={t} last />
      </ReviewSection>

      <ReviewSection title="Allocation" onEdit={() => onEdit(3)} t={t}>
        <ReviewRow label="Payout method" value={cap(draft.payoutMethod)} t={t} />
        <ReviewRow label="Emergency Fund" value={`${Math.round(draft.efRate * 100)}% · +${formatCurrency(efPerCycle, draft.currency)}/cycle`} t={t} last />
      </ReviewSection>

      <ReviewSection title="Penalties" onEdit={() => onEdit(4)} t={t}>
        <ReviewRow label="Grace period" value={`${draft.graceDays} day${draft.graceDays === 1 ? "" : "s"}`} t={t} />
        <ReviewRow label="Late penalty" value={`${Math.round(draft.latePenalty * 100)}%`} t={t} />
        <ReviewRow label="Language" value={draft.language} t={t} last />
      </ReviewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

function StepHeader({ title, body }: { title: string; body: string }) {
  return (
    <View>
      <Text variant="h2" weight="bold">{title}</Text>
      <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>{body}</Text>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginTop: space.xs }}>
      {String(children).toUpperCase()}
    </Text>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
  minHeight,
  t,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  minHeight?: number;
  t: AppTheme;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={t.textMuted}
      multiline={multiline}
      style={[
        styles.input,
        {
          color: t.textPrimary,
          backgroundColor: t.surface,
          borderColor: t.border,
          minHeight: minHeight ?? 48,
          textAlignVertical: multiline ? "top" : "center",
        },
      ]}
    />
  );
}

function Stepper({
  value,
  onChange,
  step,
  min,
  max,
  prefix,
  suffix,
  t,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
  t: AppTheme;
}) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <View style={[styles.stepperRow, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Pressable onPress={dec} style={[styles.stepperBtn, { backgroundColor: t.bgMuted }]}>
        <Minus size={16} color={t.textPrimary} />
      </Pressable>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text variant="h2" weight="bold">
          {prefix ? `${prefix} ` : ""}{value}
        </Text>
        {suffix ? <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{suffix}</Text> : null}
      </View>
      <Pressable onPress={inc} style={[styles.stepperBtn, { backgroundColor: t.bgMuted }]}>
        <Plus size={16} color={t.textPrimary} />
      </Pressable>
    </View>
  );
}

function Segmented({
  options,
  value,
  onChange,
  t,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  t: AppTheme;
}) {
  return (
    <View style={[styles.segmented, { backgroundColor: t.bgMuted }]}>
      {options.map((o) => {
        const active = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={[
              styles.segBtn,
              active ? { backgroundColor: t.surface, borderColor: t.border } : null,
            ]}
          >
            <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
              {o}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function RadioRow({
  Icon,
  title,
  body,
  selected,
  onSelect,
  recommended,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  body: string;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.radioRow,
        {
          backgroundColor: selected ? t.primarySoft : t.surface,
          borderColor: selected ? t.primary : t.border,
          borderWidth: selected ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.radioIcon, { backgroundColor: selected ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Icon size={16} color={selected ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="bodySmall" weight="bold">{title}</Text>
          {recommended ? (
            <View style={[styles.recommendedPill, { backgroundColor: t.successSoft }]}>
              <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.5 }}>RECOMMENDED</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{body}</Text>
      </View>
      <View
        style={[
          styles.radioDot,
          {
            borderColor: selected ? t.primary : t.borderStrong,
            backgroundColor: selected ? t.primary : "transparent",
          },
        ]}
      >
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
    </Pressable>
  );
}

function ReviewSection({
  title,
  onEdit,
  t,
  children,
}: {
  title: string;
  onEdit: () => void;
  t: AppTheme;
  children: React.ReactNode;
}) {
  return (
    <Card padded>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
          {title.toUpperCase()}
        </Text>
        <Pressable onPress={onEdit} style={[styles.editPill, { backgroundColor: t.primarySoft }]}>
          <Pencil size={10} color={t.primary} />
          <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.6 }}>EDIT</Text>
        </Pressable>
      </View>
      {children}
    </Card>
  );
}

function ReviewRow({ label, value, t, last }: { label: string; value: string; t: AppTheme; last?: boolean }) {
  return (
    <View
      style={[
        styles.reviewRow,
        last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <Text variant="caption" tone="secondary">{label}</Text>
      <Text variant="bodySmall" weight="semibold" style={{ flex: 1, textAlign: "right" }} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
  input: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: space.sm,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  segmented: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  radioIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendedPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  miniNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  aiCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    marginTop: space.sm,
    alignSelf: "flex-start",
  },
  sliderCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  sliderDot: {
    flex: 1,
    height: 10,
    borderRadius: 5,
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  reviewHero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  warningBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  editPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: space.sm,
    gap: space.md,
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
