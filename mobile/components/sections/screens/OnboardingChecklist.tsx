import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronDown,
  Check,
  Clock,
  AlertTriangle,
  Sparkles,
  Building2,
  Banknote,
  Receipt,
  Users,
  CircleDot,
  ShieldCheck,
  FileSignature,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import { CURRENT_USER } from "@/data/currentUser";
import {
  findOnboardingChecklistByBrId,
  buildFreshChecklist,
  applyStepComplete,
  STEP_ORDER,
  STEP_LABEL,
  type OnboardingChecklist as Checklist,
  type OnboardingStepKey,
} from "@/data/onboardingChecklists";
import { findRelationshipDetail } from "@/data/businessRelationships";

// ============================================================================
// Helpers
// ============================================================================

const STEP_ICONS: Record<OnboardingStepKey, typeof Building2> = {
  association_profile: Building2,
  account_activation: Banknote,
  dues_config: Receipt,
  member_invitations: Users,
  first_circle: CircleDot,
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtRelative(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  return fmt(iso);
}

function statusPillStyle(s: Checklist["status"], t: AppTheme) {
  switch (s) {
    case "completed":
      return { bg: t.successSoft, fg: t.success, label: "Completed" };
    case "escalated":
      return { bg: t.dangerSoft, fg: t.danger, label: "Escalated" };
    case "in_progress":
      return { bg: t.infoSoft, fg: t.info, label: "In progress" };
  }
}

// ============================================================================
// Sub-components
// ============================================================================

function ProgressDots({ checklist, t }: { checklist: Checklist; t: AppTheme }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.sm }}>
      {STEP_ORDER.map((key, i) => {
        const done = checklist.steps[key].status === "completed";
        const inProgress = checklist.steps[key].status === "in_progress";
        const bg = done ? t.success : inProgress ? t.primary : t.bgMuted;
        return (
          <View key={key} style={{ flexDirection: "row", alignItems: "center", flex: i === STEP_ORDER.length - 1 ? 0 : 1 }}>
            <View style={[styles.dot, { backgroundColor: bg }]}>
              {done ? (
                <Check size={11} color="#fff" />
              ) : (
                <Text variant="micro" weight="bold" style={{ color: inProgress ? "#fff" : t.textMuted }}>
                  {i + 1}
                </Text>
              )}
            </View>
            {i < STEP_ORDER.length - 1 ? (
              <View style={[styles.dotConnector, { backgroundColor: done ? t.success : t.bgMuted }]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function StepCard({
  stepKey,
  checklist,
  onComplete,
}: {
  stepKey: OnboardingStepKey;
  checklist: Checklist;
  onComplete: (onBehalf: boolean, consentNote: string) => void;
}) {
  const t = useTheme();
  const step = checklist.steps[stepKey];
  const meta = STEP_LABEL[stepKey];
  const Icon = STEP_ICONS[stepKey];
  const isCompleted = step.status === "completed";
  const isInProgress = step.status === "in_progress";

  const [expanded, setExpanded] = useState(false);
  const [onBehalf, setOnBehalf] = useState(false);
  const [consentNote, setConsentNote] = useState("");

  const accentColor = isCompleted ? t.success : isInProgress ? t.primary : t.textMuted;
  const cardBg = isCompleted ? t.successSoft : t.surface;
  const borderColor = isCompleted ? t.success : isInProgress ? t.primary : t.border;
  const isLocked = checklist.status === "completed";

  return (
    <View style={[styles.stepCard, { backgroundColor: cardBg, borderColor }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
        <View style={[styles.stepIcon, { backgroundColor: isCompleted ? t.success : t.bgMuted }]}>
          {isCompleted ? <Check size={16} color="#fff" /> : <Icon size={16} color={accentColor} />}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="bodySmall" weight="bold" style={{ color: accentColor }}>
            {meta.label}
          </Text>
          <Text variant="micro" tone="secondary">
            {meta.description}
          </Text>
          {isCompleted && step.completedAt ? (
            <Text variant="micro" style={{ color: t.success, marginTop: 2 }}>
              ✓ {step.completedByName ?? "System"} · {fmtRelative(step.completedAt)}
            </Text>
          ) : null}
          {isInProgress ? (
            <Text variant="micro" weight="semibold" style={{ color: t.primary, marginTop: 2 }}>
              In progress
            </Text>
          ) : null}
        </View>
        {!isCompleted && !isLocked ? (
          <Pressable
            onPress={() => setExpanded((v) => !v)}
            style={[styles.completeBtn, { backgroundColor: t.primary }]}
          >
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
              {expanded ? "Cancel" : "Complete"}
            </Text>
            <ChevronDown
              size={12}
              color="#fff"
              style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Expanded complete form */}
      {expanded && !isCompleted && !isLocked ? (
        <View style={{ marginTop: space.md, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.border, gap: space.sm }}>
          <Pressable
            onPress={() => setOnBehalf((v) => !v)}
            style={[
              styles.toggleRow,
              {
                backgroundColor: onBehalf ? t.warningSoft : t.bgMuted,
                borderColor: onBehalf ? t.warning : t.border,
              },
            ]}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: onBehalf ? t.warning : "transparent",
                  borderColor: onBehalf ? t.warning : t.border,
                },
              ]}
            >
              {onBehalf ? <Check size={10} color="#fff" /> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold">
                Complete on behalf of president
              </Text>
              <Text variant="micro" tone="secondary">
                Requires a consent note for the audit trail.
              </Text>
            </View>
          </Pressable>
          {onBehalf ? (
            <View style={[styles.inputWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <TextInput
                value={consentNote}
                onChangeText={setConsentNote}
                placeholder="Consent note (e.g. confirmed by phone on 2026-05-17)"
                placeholderTextColor={t.textMuted}
                multiline
                style={[styles.input, { color: t.textPrimary }]}
              />
            </View>
          ) : null}
          <Pressable
            onPress={() => {
              onComplete(onBehalf, consentNote);
              setExpanded(false);
              setOnBehalf(false);
              setConsentNote("");
            }}
            disabled={onBehalf && !consentNote.trim()}
            style={[
              styles.confirmBtn,
              {
                backgroundColor: onBehalf && !consentNote.trim() ? t.bgMuted : t.success,
                opacity: onBehalf && !consentNote.trim() ? 0.6 : 1,
              },
            ]}
          >
            <Check size={14} color="#fff" />
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
              Mark complete
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

// ============================================================================
// Main
// ============================================================================

export function OnboardingChecklistView({ brId }: { brId: string }) {
  const t = useTheme();
  const br = findRelationshipDetail(brId);
  const initial =
    findOnboardingChecklistByBrId(brId) ??
    buildFreshChecklist(brId, br?.associationName ?? "Association");
  const [checklist, setChecklist] = useState<Checklist>(initial);
  const [toast, setToast] = useState<string | null>(null);

  const handleComplete = (stepKey: OnboardingStepKey, onBehalf: boolean, consentNote: string) => {
    const next = applyStepComplete(
      checklist,
      stepKey,
      CURRENT_USER.name,
      onBehalf,
      consentNote,
    );
    setChecklist(next);
    if (next.status === "completed") {
      setToast("Onboarding complete · association activated");
    } else {
      setToast(`${STEP_LABEL[stepKey].label} marked complete`);
    }
  };

  const sPill = statusPillStyle(checklist.status, t);
  const isCompleted = checklist.status === "completed";

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Hero */}
        <LinearGradient
          colors={
            isCompleted
              ? [palette.emerald[600], palette.emerald[700]]
              : [palette.indigo[700], palette.indigo[900]]
          }
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
                ONBOARDING · {checklist.contractReference}
              </Text>
              <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                CM · {CURRENT_USER.employeeId} · {CURRENT_USER.name}
              </Text>
            </View>
            <View style={[styles.heroPill, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                {sPill.label}
              </Text>
            </View>
          </View>

          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.lg }}>
            {checklist.prospectName}
          </Text>

          {/* Big progress */}
          <View style={{ marginTop: space.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
              <Text variant="caption" weight="semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
                {STEP_ORDER.filter((k) => checklist.steps[k].status === "completed").length}/{STEP_ORDER.length} STEPS
              </Text>
              <Text variant="display" weight="bold" style={{ color: "#fff" }}>
                {checklist.completionPercentage}%
              </Text>
            </View>
            <View style={[styles.heroProgress, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <View
                style={{
                  width: `${checklist.completionPercentage}%`,
                  height: "100%",
                  borderRadius: 6,
                  backgroundColor: isCompleted ? palette.emerald[100] : palette.amber[300],
                }}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Escalation banner */}
        {checklist.escalationLevel ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
            <View
              style={[
                styles.banner,
                checklist.escalationLevel === "red"
                  ? { backgroundColor: t.dangerSoft, borderColor: t.danger }
                  : { backgroundColor: t.warningSoft, borderColor: t.warning },
              ]}
            >
              {checklist.escalationLevel === "red" ? (
                <AlertTriangle size={14} color={t.danger} />
              ) : (
                <Clock size={14} color={t.warning} />
              )}
              <View style={{ flex: 1 }}>
                <Text
                  variant="caption"
                  weight="bold"
                  style={{ color: checklist.escalationLevel === "red" ? t.danger : t.warning }}
                >
                  {checklist.escalationLevel === "red" ? "Escalated · 7+ days" : "Behind schedule · 48h+"}
                </Text>
                <Text
                  variant="micro"
                  style={{ color: checklist.escalationLevel === "red" ? t.danger : t.warning }}
                >
                  Reach out to the president to unblock the remaining steps.
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Success banner */}
        {isCompleted ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
            <View style={[styles.banner, { backgroundColor: t.successSoft, borderColor: t.success }]}>
              <ShieldCheck size={14} color={t.success} />
              <View style={{ flex: 1 }}>
                <Text variant="caption" weight="bold" style={{ color: t.success }}>
                  Association onboarded
                </Text>
                <Text variant="micro" style={{ color: t.success }}>
                  All 5 steps complete. First billing cycle is live.
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Toast */}
        {toast ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
            <View style={[styles.banner, { backgroundColor: t.primary, borderColor: t.primary }]}>
              <Sparkles size={14} color="#fff" />
              <Text variant="caption" weight="semibold" style={{ color: "#fff", flex: 1 }}>
                {toast}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Step indicator */}
        <View style={{ paddingHorizontal: space.lg, marginTop: checklist.escalationLevel || isCompleted ? space.lg : space.xl }}>
          <View style={[styles.indicatorCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <ProgressDots checklist={checklist} t={t} />
          </View>
        </View>

        {/* Step cards */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
          {STEP_ORDER.map((key) => (
            <StepCard
              key={key}
              stepKey={key}
              checklist={checklist}
              onComplete={(onBehalf, consentNote) => handleComplete(key, onBehalf, consentNote)}
            />
          ))}
        </View>

        {/* On-behalf audit trail */}
        {checklist.completedOnBehalf.length > 0 ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
              <FileSignature size={14} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                ON-BEHALF AUDIT TRAIL
              </Text>
            </View>
            <View style={[styles.auditCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              {checklist.completedOnBehalf.map((entry, i) => (
                <View
                  key={i}
                  style={{
                    paddingVertical: space.sm,
                    borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                    borderColor: t.border,
                  }}
                >
                  <Text variant="bodySmall" weight="semibold">
                    {STEP_LABEL[entry.step].label}
                  </Text>
                  <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                    By {entry.completedBy} · {fmtRelative(entry.completedAt)}
                  </Text>
                  <Text variant="caption" tone="secondary" style={{ marginTop: 4, fontStyle: "italic" }}>
                    "{entry.consentNote}"
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
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
  heroPill: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  heroProgress: {
    height: 8,
    borderRadius: 4,
    marginTop: space.sm,
    overflow: "hidden",
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  // Step indicator dots
  indicatorCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dotConnector: {
    height: 2,
    flex: 1,
    marginHorizontal: 4,
  },

  // Step cards
  stepCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  inputWrap: {
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: {
    fontSize: 13,
    padding: 0,
    minHeight: 48,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.md,
  },

  // Audit
  auditCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
