import { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput, Image } from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Search as SearchIcon,
  Sparkles,
  Briefcase,
  FileSignature,
  Mail,
  MapPin,
  Users,
  Building2,
  Percent,
  Coins,
  CalendarClock,
  ClipboardList,
  ShieldCheck,
  Upload,
  AlertCircle,
  X,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import {
  CANDIDATES,
  PROSPECT_STAGE_LABEL,
  type Candidate,
  type ProspectStage,
} from "@/data/prospects";
import { CURRENT_USER } from "@/data/currentUser";
import { type BrRelationshipType, type BrTier } from "@/data/businessRelationships";

// ============================================================================
// Step definitions
// ============================================================================

type StepKey = "association" | "terms" | "review" | "sent";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "association", label: "Association" },
  { key: "terms", label: "Terms" },
  { key: "review", label: "Review" },
];

type Tier = {
  key: BrTier;
  name: string;
  monthly: number;
  blurb: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    key: "free",
    name: "Free",
    monthly: 0,
    blurb: "Sandbox for small circles, no platform fee.",
    features: ["Up to 25 members", "Read-only ledger", "Community support"],
  },
  {
    key: "basic",
    name: "Basic",
    monthly: 80,
    blurb: "Operating tier for active associations.",
    features: ["Full ledger + dues", "Governance + voting", "Email support"],
  },
  {
    key: "pro",
    name: "Pro",
    monthly: 200,
    blurb: "Federations + analytics + white-glove.",
    features: ["Analytics + reports", "Federations", "Dedicated CM"],
  },
];

const RELATIONSHIP_TYPES: { value: BrRelationshipType; label: string; blurb: string }[] = [
  { value: "management", label: "Management", blurb: "CM operates the association day-to-day." },
  { value: "advisory", label: "Advisory", blurb: "CM advises; president retains ops control." },
  { value: "audit", label: "Audit", blurb: "Periodic review only; no operational role." },
];

// ============================================================================
// Sub-components
// ============================================================================

function StepIndicator({ active }: { active: StepKey }) {
  const t = useTheme();
  const idx = STEPS.findIndex((s) => s.key === active);

  return (
    <View style={styles.stepIndicator}>
      {STEPS.map((s, i) => {
        const done = i < idx;
        const current = i === idx;
        const dotBg = done || current ? t.primary : t.bgMuted;
        const labelColor = current ? t.primary : done ? t.textSecondary : t.textMuted;
        return (
          <View key={s.key} style={{ flexDirection: "row", alignItems: "center", flex: i === STEPS.length - 1 ? 0 : 1 }}>
            <View style={[styles.stepDot, { backgroundColor: dotBg, borderColor: dotBg }]}>
              {done ? (
                <Check size={12} color="#fff" />
              ) : (
                <Text variant="micro" weight="bold" style={{ color: current ? "#fff" : t.textMuted }}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text variant="caption" weight={current ? "bold" : "semibold"} style={{ color: labelColor, marginLeft: 6 }}>
              {s.label}
            </Text>
            {i < STEPS.length - 1 ? (
              <View style={[styles.stepConnector, { backgroundColor: done ? t.primary : t.bgMuted }]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function CandidateRow({
  c,
  selected,
  onPress,
}: {
  c: Candidate;
  selected: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.candidateRow,
        {
          backgroundColor: t.surface,
          borderColor: selected ? t.primary : t.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      <Image source={{ uri: c.logo }} style={styles.candidateLogo} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
          {c.associationName}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <View style={[styles.tag, { backgroundColor: c.source === "prospect" ? t.warningSoft : t.bgMuted }]}>
            <Text variant="micro" weight="bold" style={{ color: c.source === "prospect" ? t.warning : t.textSecondary, letterSpacing: 0.4 }}>
              {c.source === "prospect" ? "PIPELINE" : "DISCOVER"}
            </Text>
          </View>
          {c.source === "prospect" && c.stage ? (
            <Text variant="micro" tone="secondary">
              {PROSPECT_STAGE_LABEL[c.stage as ProspectStage]}
            </Text>
          ) : null}
          <Text variant="micro" tone="muted">·</Text>
          <MapPin size={9} color={t.textMuted} />
          <Text variant="micro" tone="secondary">
            {c.region}
          </Text>
          <Text variant="micro" tone="muted">·</Text>
          <Users size={9} color={t.textMuted} />
          <Text variant="micro" tone="secondary">
            {c.memberCount}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? t.primary : t.border,
            backgroundColor: selected ? t.primary : "transparent",
          },
        ]}
      >
        {selected ? <Check size={12} color="#fff" /> : null}
      </View>
    </Pressable>
  );
}

function TierCard({ tier, selected, onPress }: { tier: Tier; selected: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tierCard,
        {
          backgroundColor: t.surface,
          borderColor: selected ? t.primary : t.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Briefcase size={14} color={selected ? t.primary : t.textSecondary} />
          <Text variant="bodySmall" weight="bold" style={{ color: selected ? t.primary : t.textPrimary }}>
            {tier.name}
          </Text>
        </View>
        <Text variant="bodySmall" weight="bold">
          {tier.monthly > 0 ? `CHF ${tier.monthly}/mo` : "Free"}
        </Text>
      </View>
      <Text variant="micro" tone="secondary" style={{ marginTop: 4 }}>
        {tier.blurb}
      </Text>
      <View style={{ marginTop: space.sm, gap: 4 }}>
        {tier.features.map((f) => (
          <View key={f} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Check size={11} color={t.success} />
            <Text variant="micro" tone="secondary">
              {f}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

function SummaryRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, gap: space.md }}>
      <Text variant="bodySmall" tone="secondary">
        {label}
      </Text>
      <Text
        variant="bodySmall"
        weight="semibold"
        style={{ textAlign: "right", flex: 1, fontFamily: mono ? "monospace" : undefined }}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "decimal-pad";
}) {
  const t = useTheme();
  return (
    <View>
      <Text variant="caption" tone="secondary" style={{ marginBottom: 4 }}>
        {label}
      </Text>
      <View style={[styles.inputWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={t.textMuted}
          keyboardType={keyboardType ?? "default"}
          style={[styles.input, { color: t.textPrimary }]}
        />
      </View>
    </View>
  );
}

function MigrateRow({
  icon: Icon,
  tone,
  label,
  detail,
}: {
  icon: typeof Check;
  tone: "success" | "warning" | "danger";
  label: string;
  detail: string;
}) {
  const t = useTheme();
  const toneMap = {
    success: { bg: t.successSoft, fg: t.success },
    warning: { bg: t.warningSoft, fg: t.warning },
    danger: { bg: t.dangerSoft, fg: t.danger },
  } as const;
  const c = toneMap[tone];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
      <View style={[styles.migrateIcon, { backgroundColor: c.bg }]}>
        <Icon size={13} color={c.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold" style={{ color: c.fg }}>
          {label}
        </Text>
        <Text variant="micro" tone="secondary">
          {detail}
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// Main wizard
// ============================================================================

export function BrCreationWizard() {
  const t = useTheme();

  const [step, setStep] = useState<StepKey>("association");

  // Step 1
  type Step1Mode = "pick" | "create" | "migrate";
  const [step1Mode, setStep1Mode] = useState<Step1Mode>("pick");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "prospect" | "discoverable">("all");
  const [candidateId, setCandidateId] = useState<string | null>(null);

  // Step 1 — create-new form
  type NewAssocType = "cultural" | "religious" | "professional" | "savings" | "social" | "family";
  type TerminologyPreset = "default" | "susu" | "tanda" | "paluwagan" | "tontine";
  const [newAssoc, setNewAssoc] = useState({
    name: "",
    region: "",
    type: "savings" as NewAssocType,
    currency: "CHF" as "CHF" | "EUR",
    language: "en" as "en" | "fr" | "de" | "es" | "pt",
    contributionBaseline: "100",
    terminology: "tontine" as TerminologyPreset,
    estimatedMembers: "",
  });
  const [draftCreated, setDraftCreated] = useState<Candidate | null>(null);

  // Step 1 — migration form
  const [migration, setMigration] = useState({
    fileName: "",
    parsed: false,
    validated: false,
    validRows: 0,
    warningRows: 0,
    errorRows: 0,
    totalRows: 0,
  });
  const [draftMigrated, setDraftMigrated] = useState<Candidate | null>(null);

  // Step 2
  const [relType, setRelType] = useState<BrRelationshipType>("management");
  const [tier, setTier] = useState<BrTier>("basic");
  const [feePercentage, setFeePercentage] = useState("2.5");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [notes, setNotes] = useState("");

  // Result
  const [brRef] = useState<string>("BR-NEW9F2KP");

  const filteredCandidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CANDIDATES.filter((c) => {
      const matchesQ =
        !q ||
        c.associationName.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q);
      const matchesSource = filter === "all" || c.source === filter;
      return matchesQ && matchesSource;
    });
  }, [query, filter]);

  // Resolve the selected candidate from picker, create-new draft, or migrate draft.
  const candidate: Candidate | null = useMemo(() => {
    if (step1Mode === "create" && draftCreated) return draftCreated;
    if (step1Mode === "migrate" && draftMigrated) return draftMigrated;
    if (step1Mode === "pick" && candidateId) {
      return CANDIDATES.find((c) => c.id === candidateId) ?? null;
    }
    return null;
  }, [step1Mode, candidateId, draftCreated, draftMigrated]);

  const tierObj = TIERS.find((tt) => tt.key === tier)!;
  const projectedMrr = tierObj.monthly;

  const canNext =
    (step === "association" && !!candidate) ||
    (step === "terms" && !!parseFloat(feePercentage)) ||
    step === "review";

  const isLast = step === "review";

  const handleNext = () => {
    if (step === "association") setStep("terms");
    else if (step === "terms") setStep("review");
    else if (step === "review") setStep("sent");
  };

  const handleBack = () => {
    if (step === "terms") setStep("association");
    else if (step === "review") setStep("terms");
  };

  // ----------------------------------------
  // Sent / success state
  // ----------------------------------------
  if (step === "sent") {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
          <LinearGradient
            colors={[palette.indigo[600], palette.indigo[900]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successHero}
          >
            <View style={[styles.successCheck, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Check size={36} color="#fff" />
            </View>
            <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.lg }}>
              Sent for signature
            </Text>
            <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: 4, textAlign: "center" }}>
              The president has 14 days to sign. We'll notify you when it's done.
            </Text>
          </LinearGradient>

          <View style={{ padding: space.lg, gap: space.md }}>
            <View style={[styles.successCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <SummaryRow label="Reference" value={brRef} mono />
              <SummaryRow label="Association" value={candidate?.associationName ?? ""} />
              <SummaryRow label="President" value={candidate?.presidentName ?? "—"} />
              <SummaryRow label="Tier" value={tierObj.name} />
              <SummaryRow label="MRR (when active)" value={projectedMrr > 0 ? `CHF ${projectedMrr}/mo` : "—"} />
              <SummaryRow label="Status" value="Awaiting signature · 14 day deadline" />
            </View>

            <Pressable
              onPress={() => router.replace("/business-relationships" as never)}
              style={[styles.btnPrimary, { backgroundColor: t.primary }]}
            >
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                Back to relationships
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/business-relationships/new" as never)}
              style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}
            >
              <Text variant="bodySmall" weight="semibold">
                Create another BR
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ----------------------------------------
  // Wizard body
  // ----------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Hero */}
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
                NEW BUSINESS RELATIONSHIP
              </Text>
              <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {CURRENT_USER.employeeId} · {CURRENT_USER.name}
              </Text>
            </View>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.lg }}>
            {step === "association" ? "Pick the association" : step === "terms" ? "Set the terms" : "Review & send"}
          </Text>
          <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            {step === "association"
              ? "Choose a prospect from your pipeline or an existing association without a BR."
              : step === "terms"
              ? "Pick a subscription tier, fee model, and relationship type."
              : "Final check. Sending creates a draft contract with a 14-day signature deadline."}
          </Text>
        </LinearGradient>

        {/* Step indicator */}
        <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
          <View style={[styles.stepCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <StepIndicator active={step} />
          </View>
        </View>

        {/* ===== Step 1: Association ===== */}
        {step === "association" ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
            {/* Mode segmented control */}
            <View style={[styles.modeWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              {(
                [
                  { v: "pick", label: "Pick existing" },
                  { v: "create", label: "Create new" },
                  { v: "migrate", label: "Migrate" },
                ] as { v: Step1Mode; label: string }[]
              ).map((opt) => {
                const active = step1Mode === opt.v;
                return (
                  <Pressable
                    key={opt.v}
                    onPress={() => {
                      setStep1Mode(opt.v);
                      // Clearing other-mode picks keeps `candidate` resolution honest.
                      if (opt.v !== "pick") setCandidateId(null);
                      if (opt.v !== "create") setDraftCreated(null);
                      if (opt.v !== "migrate") setDraftMigrated(null);
                    }}
                    style={[
                      styles.modeBtn,
                      active && { backgroundColor: t.bgElevated, shadowColor: t.shadow },
                    ]}
                  >
                    <Text
                      variant="caption"
                      weight={active ? "bold" : "semibold"}
                      style={{ color: active ? t.textPrimary : t.textSecondary }}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* === Pick mode === */}
            {step1Mode === "pick" ? (
              <>
                <View style={[styles.searchWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
                  <SearchIcon size={16} color={t.textMuted} />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search by name or region..."
                    placeholderTextColor={t.textMuted}
                    style={[styles.searchInput, { color: t.textPrimary }]}
                  />
                </View>

                <View style={{ flexDirection: "row", gap: space.sm }}>
                  {[
                    { v: "all" as const, label: "All" },
                    { v: "prospect" as const, label: "From pipeline" },
                    { v: "discoverable" as const, label: "Discover" },
                  ].map((opt) => {
                    const active = filter === opt.v;
                    return (
                      <Pressable
                        key={opt.v}
                        onPress={() => setFilter(opt.v)}
                        style={[
                          styles.pillBtn,
                          {
                            backgroundColor: active ? t.primary : t.bgElevated,
                            borderColor: active ? t.primary : t.border,
                          },
                        ]}
                      >
                        <Text
                          variant="caption"
                          weight="semibold"
                          style={{ color: active ? "#fff" : t.textSecondary }}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text
                  variant="micro"
                  tone="muted"
                  weight="bold"
                  style={{ marginTop: space.sm, letterSpacing: 0.8 }}
                >
                  {filteredCandidates.length} CANDIDATE{filteredCandidates.length === 1 ? "" : "S"}
                </Text>

                <View style={{ gap: space.sm }}>
                  {filteredCandidates.map((c) => (
                    <CandidateRow
                      key={c.id}
                      c={c}
                      selected={candidateId === c.id}
                      onPress={() => setCandidateId(c.id)}
                    />
                  ))}
                </View>

                {candidate?.source === "prospect" ? (
                  <View style={[styles.note, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
                    <Sparkles size={14} color={t.primary} />
                    <Text variant="caption" weight="semibold" style={{ color: t.primary, flex: 1 }}>
                      Pipeline carry-over: proposal terms will pre-fill the next step.
                    </Text>
                  </View>
                ) : null}
              </>
            ) : null}

            {/* === Create-new mode === */}
            {step1Mode === "create" ? (
              <View style={{ gap: space.md }}>
                <View style={[styles.note, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
                  <Sparkles size={14} color={t.primary} />
                  <Text variant="caption" weight="semibold" style={{ color: t.primary, flex: 1 }}>
                    The association is created the moment the BR contract is signed.
                  </Text>
                </View>

                <View style={[styles.fieldCard, { backgroundColor: t.surface, borderColor: t.border }]}>
                  <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                    PROFILE
                  </Text>
                  <View style={{ gap: space.sm }}>
                    <LabeledInput
                      label="Association name"
                      value={newAssoc.name}
                      onChange={(v) => setNewAssoc({ ...newAssoc, name: v })}
                      placeholder="e.g. Senegalese Union of Lausanne"
                    />
                    <LabeledInput
                      label="Region"
                      value={newAssoc.region}
                      onChange={(v) => setNewAssoc({ ...newAssoc, region: v })}
                      placeholder="Lausanne · CH"
                    />
                    <LabeledInput
                      label="Estimated members"
                      value={newAssoc.estimatedMembers}
                      onChange={(v) => setNewAssoc({ ...newAssoc, estimatedMembers: v })}
                      placeholder="e.g. 80"
                      keyboardType="number-pad"
                    />
                  </View>

                  <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.md, marginBottom: space.sm }}>
                    TYPE
                  </Text>
                  <View style={{ flexDirection: "row", gap: space.sm, flexWrap: "wrap" }}>
                    {(
                      ["cultural", "savings", "religious", "professional", "social", "family"] as NewAssocType[]
                    ).map((opt) => {
                      const active = newAssoc.type === opt;
                      return (
                        <Pressable
                          key={opt}
                          onPress={() => setNewAssoc({ ...newAssoc, type: opt })}
                          style={[
                            styles.pillBtn,
                            {
                              backgroundColor: active ? t.primary : t.bgElevated,
                              borderColor: active ? t.primary : t.border,
                            },
                          ]}
                        >
                          <Text
                            variant="caption"
                            weight="semibold"
                            style={{ color: active ? "#fff" : t.textSecondary }}
                          >
                            {opt[0].toUpperCase() + opt.slice(1)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={[styles.fieldCard, { backgroundColor: t.surface, borderColor: t.border }]}>
                  <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                    LOCALE & CONTRIBUTION
                  </Text>
                  <View style={{ flexDirection: "row", gap: space.sm }}>
                    {(["CHF", "EUR"] as const).map((cur) => {
                      const active = newAssoc.currency === cur;
                      return (
                        <Pressable
                          key={cur}
                          onPress={() => setNewAssoc({ ...newAssoc, currency: cur })}
                          style={[
                            styles.pillBtn,
                            {
                              flex: 1,
                              alignItems: "center",
                              backgroundColor: active ? t.primary : t.bgElevated,
                              borderColor: active ? t.primary : t.border,
                            },
                          ]}
                        >
                          <Text variant="caption" weight="semibold" style={{ color: active ? "#fff" : t.textSecondary }}>
                            {cur}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View style={{ marginTop: space.sm }}>
                    <LabeledInput
                      label="Monthly contribution baseline"
                      value={newAssoc.contributionBaseline}
                      onChange={(v) => setNewAssoc({ ...newAssoc, contributionBaseline: v })}
                      placeholder="100"
                      keyboardType="number-pad"
                    />
                  </View>

                  <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.md, marginBottom: space.sm }}>
                    CULTURAL TERMINOLOGY
                  </Text>
                  <View style={{ flexDirection: "row", gap: space.sm, flexWrap: "wrap" }}>
                    {(["tontine", "susu", "tanda", "paluwagan", "default"] as TerminologyPreset[]).map((preset) => {
                      const active = newAssoc.terminology === preset;
                      const label = preset === "default" ? "Default" : preset[0].toUpperCase() + preset.slice(1);
                      return (
                        <Pressable
                          key={preset}
                          onPress={() => setNewAssoc({ ...newAssoc, terminology: preset })}
                          style={[
                            styles.pillBtn,
                            {
                              backgroundColor: active ? t.accent : t.bgElevated,
                              borderColor: active ? t.accent : t.border,
                            },
                          ]}
                        >
                          <Text variant="caption" weight="semibold" style={{ color: active ? "#fff" : t.textSecondary }}>
                            {label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text variant="micro" tone="muted" style={{ marginTop: 6 }}>
                    Sets cycle / payout / member labels across the app preview.
                  </Text>
                </View>

                {/* Use-as-candidate CTA */}
                <Pressable
                  onPress={() => {
                    const draft: Candidate = {
                      id: "new-draft",
                      source: "discoverable",
                      associationName: newAssoc.name || "New Association",
                      associationType: newAssoc.type,
                      region: newAssoc.region || "—",
                      memberCount: parseInt(newAssoc.estimatedMembers || "0", 10) || 0,
                      logo:
                        "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=200&h=200&fit=crop",
                    };
                    setDraftCreated(draft);
                  }}
                  disabled={!newAssoc.name.trim()}
                  style={[
                    styles.draftCta,
                    {
                      backgroundColor: draftCreated ? t.successSoft : newAssoc.name.trim() ? t.primary : t.bgMuted,
                      borderColor: draftCreated ? t.success : "transparent",
                    },
                  ]}
                >
                  {draftCreated ? (
                    <>
                      <Check size={14} color={t.success} />
                      <Text variant="caption" weight="bold" style={{ color: t.success }}>
                        Draft ready · "{draftCreated.associationName}"
                      </Text>
                    </>
                  ) : (
                    <Text
                      variant="caption"
                      weight="bold"
                      style={{ color: newAssoc.name.trim() ? "#fff" : t.textMuted }}
                    >
                      Use this draft
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : null}

            {/* === Migrate mode === */}
            {step1Mode === "migrate" ? (
              <View style={{ gap: space.md }}>
                <View style={[styles.note, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
                  <Upload size={14} color={t.warning} />
                  <Text variant="caption" weight="semibold" style={{ color: t.warning, flex: 1 }}>
                    Import a legacy roster · members, contributions, and ROSCA history.
                  </Text>
                </View>

                {/* Upload zone */}
                <View style={[styles.uploadCard, { backgroundColor: t.surface, borderColor: migration.fileName ? t.success : t.border, borderStyle: migration.fileName ? "solid" : "dashed" }]}>
                  <View style={[styles.uploadIcon, { backgroundColor: migration.fileName ? t.successSoft : t.bgMuted }]}>
                    <Upload size={20} color={migration.fileName ? t.success : t.textMuted} />
                  </View>
                  {migration.fileName ? (
                    <>
                      <Text variant="bodySmall" weight="bold" style={{ marginTop: space.sm }}>
                        {migration.fileName}
                      </Text>
                      <Text variant="micro" tone="secondary">
                        142 members · 2 ROSCA circles · 24 months of payment history
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text variant="bodySmall" weight="bold" style={{ marginTop: space.sm }}>
                        Drop CSV here
                      </Text>
                      <Text variant="micro" tone="secondary" align="center">
                        Or pick from device · max 5 MB · columns: name, email, role, joined_at
                      </Text>
                      <Pressable
                        onPress={() =>
                          setMigration({
                            ...migration,
                            fileName: "lausanne-roster-2026.csv",
                            parsed: true,
                            totalRows: 142,
                          })
                        }
                        style={[styles.uploadBtn, { backgroundColor: t.primary }]}
                      >
                        <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                          Choose file
                        </Text>
                      </Pressable>
                    </>
                  )}
                </View>

                {/* Parse → validate → review mini-pipeline */}
                {migration.parsed ? (
                  <View style={[styles.fieldCard, { backgroundColor: t.surface, borderColor: t.border }]}>
                    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                      VALIDATION
                    </Text>
                    {migration.validated ? (
                      <View style={{ gap: space.sm }}>
                        <MigrateRow
                          icon={Check}
                          tone="success"
                          label={`${migration.validRows} valid rows`}
                          detail="Ready to import"
                        />
                        <MigrateRow
                          icon={AlertCircle}
                          tone="warning"
                          label={`${migration.warningRows} warnings`}
                          detail="Duplicate emails — will merge"
                        />
                        <MigrateRow
                          icon={X}
                          tone="danger"
                          label={`${migration.errorRows} errors`}
                          detail="Missing required fields — fix in CSV"
                        />
                      </View>
                    ) : (
                      <Pressable
                        onPress={() =>
                          setMigration({
                            ...migration,
                            validated: true,
                            validRows: 138,
                            warningRows: 3,
                            errorRows: 1,
                          })
                        }
                        style={[styles.uploadBtn, { backgroundColor: t.primary, alignSelf: "flex-start" }]}
                      >
                        <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                          Validate {migration.totalRows} rows
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ) : null}

                {/* Review + use-as-candidate */}
                {migration.validated ? (
                  <Pressable
                    onPress={() => {
                      const draft: Candidate = {
                        id: "migrate-draft",
                        source: "discoverable",
                        associationName: "Lausanne Cultural Circle (migrated)",
                        associationType: "cultural",
                        region: "Lausanne · CH",
                        memberCount: migration.validRows,
                        logo:
                          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
                      };
                      setDraftMigrated(draft);
                    }}
                    style={[
                      styles.draftCta,
                      {
                        backgroundColor: draftMigrated ? t.successSoft : t.primary,
                        borderColor: draftMigrated ? t.success : "transparent",
                      },
                    ]}
                  >
                    {draftMigrated ? (
                      <>
                        <Check size={14} color={t.success} />
                        <Text variant="caption" weight="bold" style={{ color: t.success }}>
                          Migration ready · {migration.validRows} members
                        </Text>
                      </>
                    ) : (
                      <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                        Use migrated roster
                      </Text>
                    )}
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* ===== Step 2: Terms ===== */}
        {step === "terms" ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.lg }}>
            {/* Relationship type */}
            <View style={[styles.fieldCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                RELATIONSHIP TYPE
              </Text>
              <View style={{ gap: space.sm }}>
                {RELATIONSHIP_TYPES.map((rt) => {
                  const active = relType === rt.value;
                  return (
                    <Pressable
                      key={rt.value}
                      onPress={() => setRelType(rt.value)}
                      style={[
                        styles.optionRow,
                        {
                          backgroundColor: active ? t.primarySoft : t.bgElevated,
                          borderColor: active ? t.primary : t.border,
                          borderWidth: active ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text variant="bodySmall" weight="bold" style={{ color: active ? t.primary : t.textPrimary }}>
                          {rt.label}
                        </Text>
                        <Text variant="micro" tone="secondary">
                          {rt.blurb}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radio,
                          {
                            borderColor: active ? t.primary : t.border,
                            backgroundColor: active ? t.primary : "transparent",
                          },
                        ]}
                      >
                        {active ? <Check size={12} color="#fff" /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Tier */}
            <View>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                SUBSCRIPTION TIER
              </Text>
              <View style={{ gap: space.sm }}>
                {TIERS.map((tt) => (
                  <TierCard key={tt.key} tier={tt} selected={tier === tt.key} onPress={() => setTier(tt.key)} />
                ))}
              </View>
            </View>

            {/* Fee + cycle */}
            <View style={[styles.fieldCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                FEE AGREEMENT
              </Text>
              <View style={{ gap: space.md }}>
                <View>
                  <Text variant="caption" tone="secondary" style={{ marginBottom: 4 }}>
                    Platform fee (% of association revenue)
                  </Text>
                  <View style={[styles.fieldInputWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
                    <Percent size={14} color={t.textMuted} />
                    <TextInput
                      value={feePercentage}
                      onChangeText={setFeePercentage}
                      keyboardType="decimal-pad"
                      style={[styles.fieldInput, { color: t.textPrimary }]}
                      placeholder="2.5"
                      placeholderTextColor={t.textMuted}
                    />
                    <Text variant="bodySmall" weight="bold" tone="secondary">
                      %
                    </Text>
                  </View>
                </View>

                <View>
                  <Text variant="caption" tone="secondary" style={{ marginBottom: 4 }}>
                    Billing cycle
                  </Text>
                  <View style={{ flexDirection: "row", gap: space.sm }}>
                    {(["monthly", "quarterly", "annual"] as const).map((c) => {
                      const active = billingCycle === c;
                      return (
                        <Pressable
                          key={c}
                          onPress={() => setBillingCycle(c)}
                          style={[
                            styles.pillBtn,
                            {
                              backgroundColor: active ? t.primary : t.bgElevated,
                              borderColor: active ? t.primary : t.border,
                              flex: 1,
                              alignItems: "center",
                            },
                          ]}
                        >
                          <Text variant="caption" weight="semibold" style={{ color: active ? "#fff" : t.textSecondary }}>
                            {c[0].toUpperCase() + c.slice(1)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            {/* Notes */}
            <View style={[styles.fieldCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
                NOTES <Text variant="micro" tone="muted">(optional)</Text>
              </Text>
              <View style={[styles.fieldInputWrap, { backgroundColor: t.bgMuted, borderColor: t.border, alignItems: "flex-start" }]}>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Internal note for the contract record..."
                  placeholderTextColor={t.textMuted}
                  multiline
                  style={[styles.fieldInput, { color: t.textPrimary, minHeight: 60 }]}
                />
              </View>
            </View>
          </View>
        ) : null}

        {/* ===== Step 3: Review ===== */}
        {step === "review" && candidate ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
            {/* Association recap */}
            <View style={[styles.reviewCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                <Image source={{ uri: candidate.logo }} style={styles.reviewLogo} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="bold">
                    {candidate.associationName}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MapPin size={10} color={t.textMuted} />
                    <Text variant="micro" tone="secondary">
                      {candidate.region}
                    </Text>
                    <Text variant="micro" tone="muted">·</Text>
                    <Users size={10} color={t.textMuted} />
                    <Text variant="micro" tone="secondary">
                      {candidate.memberCount} members
                    </Text>
                  </View>
                </View>
              </View>
              {candidate.presidentName ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: space.sm }}>
                  <Mail size={11} color={t.textMuted} />
                  <Text variant="caption" tone="secondary" style={{ flex: 1 }} numberOfLines={1}>
                    {candidate.presidentName} · {candidate.presidentEmail}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Terms recap */}
            <View style={[styles.reviewCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
                <ClipboardList size={14} color={t.textMuted} />
                <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                  CONTRACT TERMS
                </Text>
              </View>
              <SummaryRow label="Relationship type" value={relType} />
              <SummaryRow label="Subscription tier" value={tierObj.name} />
              <SummaryRow
                label="Subscription fee"
                value={tierObj.monthly > 0 ? `CHF ${tierObj.monthly}/mo` : "—"}
              />
              <SummaryRow label="Platform fee" value={`${feePercentage}%`} />
              <SummaryRow label="Billing cycle" value={billingCycle} />
              <SummaryRow label="Currency" value="CHF" />
              <SummaryRow label="Projected MRR" value={projectedMrr > 0 ? `CHF ${projectedMrr}` : "—"} />
              {notes ? <SummaryRow label="Notes" value={notes} /> : null}
            </View>

            {/* What happens next */}
            <View style={[styles.reviewCard, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
                <FileSignature size={14} color={t.primary} />
                <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.8 }}>
                  WHAT HAPPENS NEXT
                </Text>
              </View>
              <NextStepRow icon={Mail} text="A draft contract is sent to the president's email" />
              <NextStepRow icon={CalendarClock} text="They have 14 days to sign via a secure link" />
              <NextStepRow icon={ShieldCheck} text="On signature, BR activates and the Association Account is auto-provisioned" />
              <NextStepRow icon={Coins} text="First billing cycle starts on activation" />
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky footer CTAs */}
      <View style={[styles.footer, { backgroundColor: t.bg, borderTopColor: t.border }]}>
        <Pressable
          onPress={step === "association" ? () => router.back() : handleBack}
          style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}
        >
          <Text variant="bodySmall" weight="semibold">
            {step === "association" ? "Cancel" : "Back"}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          disabled={!canNext}
          style={[
            styles.btnPrimary,
            { backgroundColor: canNext ? t.primary : t.bgMuted, opacity: canNext ? 1 : 0.6 },
          ]}
        >
          {isLast ? <FileSignature size={15} color="#fff" /> : null}
          <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
            {isLast ? "Send for signature" : "Continue"}
          </Text>
          {!isLast ? <ChevronRight size={15} color="#fff" /> : null}
        </Pressable>
      </View>
    </View>
  );
}

function NextStepRow({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 5 }}>
      <Icon size={12} color={t.primary} />
      <Text variant="caption" style={{ color: t.primary, flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: space.xl + space.lg,
    paddingHorizontal: space.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  stepCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  stepConnector: {
    height: 2,
    flex: 1,
    marginHorizontal: space.sm,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },

  pillBtn: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  // Mode segmented control (Pick / Create / Migrate)
  modeWrap: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  modeBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: radius.sm,
  },

  // Create / migrate shared
  inputWrap: {
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: {
    fontSize: 14,
    padding: 0,
  },
  draftCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  // Migration upload
  uploadCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: "center",
    gap: 4,
  },
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtn: {
    marginTop: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  migrateIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  candidateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  candidateLogo: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: palette.slate[200],
  },
  tag: {
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  fieldCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },

  tierCard: {
    padding: space.md,
    borderRadius: radius.md,
  },

  fieldInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },

  reviewCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  reviewLogo: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },

  // Success state
  successHero: {
    paddingTop: 96,
    paddingBottom: space.xxxl,
    paddingHorizontal: space.lg,
    alignItems: "center",
  },
  successCheck: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  successCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  // Footer CTAs
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.lg + space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btnGhost: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
});
