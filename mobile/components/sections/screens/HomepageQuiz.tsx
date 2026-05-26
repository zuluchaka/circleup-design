// Readiness quiz for /sections/homepage/quiz.
// 4 questions, single-question-per-step, large tappable answer cards, progress
// dots, final outcome screen with a recommendation badge.

import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check, ArrowLeft, ArrowRight, RotateCcw, Trophy, Sparkles, Compass } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius, palette } from "@/theme";

type Answer = string;

const QUESTIONS = [
  {
    id: "q1",
    prompt: "What's your top reason for joining a savings circle?",
    options: [
      { value: "discipline", label: "I want a forcing function to save consistently" },
      { value: "payout",     label: "I want a lump sum I can plan around" },
      { value: "community",  label: "I want to support my community" },
      { value: "credit",     label: "I want to build credit history" },
    ],
  },
  {
    id: "q2",
    prompt: "Are you joining a circle or starting one?",
    options: [
      { value: "joining",   label: "Joining one a friend told me about" },
      { value: "starting",  label: "Starting one with my community" },
      { value: "exploring", label: "Just exploring — not sure yet" },
    ],
  },
  {
    id: "q3",
    prompt: "How would you rate your past payment discipline?",
    options: [
      { value: "excellent", label: "Excellent — I never miss" },
      { value: "ok",        label: "Mostly good, occasional slip" },
      { value: "building",  label: "Working on it" },
    ],
  },
  {
    id: "q4",
    prompt: "What monthly contribution feels comfortable?",
    options: [
      { value: "lt_50",  label: "Less than CHF 50" },
      { value: "50_200", label: "CHF 50 – 200" },
      { value: "gt_200", label: "More than CHF 200" },
    ],
  },
] as const;

const OUTCOMES = {
  ready_to_join: {
    Icon: Trophy,
    badge: "READY TO JOIN",
    title: "You're ready to join",
    body: "Your goals and discipline are a great fit. We'll match you with an active circle in your area and contribution range.",
    cta: "Get started",
    accent: palette.emerald[500],
  },
  organize: {
    Icon: Sparkles,
    badge: "ORGANIZER MATERIAL",
    title: "You're a great fit to organize",
    body: "You've got the discipline and the intent. We'll walk you through creating an association and your first circle.",
    cta: "Start organising",
    accent: palette.indigo[500],
  },
  build_trust: {
    Icon: Compass,
    badge: "BUILD TRUST FIRST",
    title: "Build a foundation first",
    body: "Start in a low-stakes circle (CHF 25–50/month) to build your Trust Score. After a few cycles you'll qualify for larger pots.",
    cta: "Find a starter circle",
    accent: palette.amber[500],
  },
} as const;

function scoreOutcome(answers: Answer[]): keyof typeof OUTCOMES {
  if (answers[1] === "starting") return "organize";
  if (answers[2] === "building" || answers[3] === "lt_50") return "build_trust";
  return "ready_to_join";
}

type Props = {
  // Variant initial state for screenshots
  initialStep?: number;
  initialAnswers?: Answer[];
};

export function HomepageQuiz({ initialStep = 0, initialAnswers = [] }: Props = {}) {
  const t = useTheme();
  const [step, setStep] = useState(initialStep);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const total = QUESTIONS.length;
  const isOutcome = step >= total;

  const select = (val: Answer) => {
    const next = [...answers];
    next[step] = val;
    setAnswers(next);
    setTimeout(() => setStep(step + 1), 150);
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  if (isOutcome) {
    const outcome = OUTCOMES[scoreOutcome(answers)];
    const Icon = outcome.Icon;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ flexGrow: 1, paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[outcome.accent, palette.slate[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.outcomeHero}
        >
          <View style={[styles.outcomeIcon, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
            <Icon size={36} color="#fff" />
          </View>
          <View style={[styles.outcomeBadge]}>
            <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 1.2 }}>
              {outcome.badge}
            </Text>
          </View>
          <Text variant="display" weight="bold" align="center" style={{ color: "#fff", marginTop: space.md }}>
            {outcome.title}
          </Text>
          <Text variant="body" align="center" style={{ color: "rgba(255,255,255,0.9)", marginTop: space.sm, lineHeight: 22 }}>
            {outcome.body}
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, gap: space.md, marginTop: space.xl }}>
          <Button label={outcome.cta} fullWidth size="lg" trailingIcon={<ArrowRight size={18} color="#fff" />} />
          <Pressable onPress={reset} style={[styles.resetBtn, { borderColor: t.border, backgroundColor: t.surface }]}>
            <RotateCcw size={16} color={t.textSecondary} />
            <Text variant="bodySmall" weight="semibold" tone="secondary">Retake quiz</Text>
          </Pressable>
        </View>

        {/* Recap */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.sm }}>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>YOUR ANSWERS</Text>
          {QUESTIONS.map((q, i) => {
            const opt = q.options.find((o) => o.value === answers[i]);
            return (
              <View key={q.id} style={[styles.recapRow, { backgroundColor: t.surface, borderColor: t.border }]}>
                <Text variant="caption" tone="muted">{`Q${i + 1}`}</Text>
                <Text variant="bodySmall" weight="semibold" style={{ flex: 1 }}>
                  {opt?.label ?? "—"}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  const q = QUESTIONS[step];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={styles.header}>
        {step > 0 ? (
          <Pressable onPress={() => setStep(step - 1)} style={[styles.backBtn, { backgroundColor: t.bgMuted }]}>
            <ArrowLeft size={18} color={t.textPrimary} />
          </Pressable>
        ) : <View style={{ width: 36 }} />}
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", gap: 6 }}>
          {QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i < step ? t.primary : i === step ? t.primary : t.bgMuted,
                  width: i === step ? 24 : 6,
                },
              ]}
            />
          ))}
        </View>
        <Text variant="caption" weight="semibold" tone="muted">
          {step + 1}/{total}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <View>
          <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1.2 }}>
            READINESS QUIZ
          </Text>
          <Text variant="h1" weight="bold" style={{ marginTop: space.xs, lineHeight: 32 }}>
            {q.prompt}
          </Text>
        </View>

        <View style={{ gap: space.sm }}>
          {q.options.map((o) => {
            const selected = answers[step] === o.value;
            return (
              <Pressable
                key={o.value}
                onPress={() => select(o.value)}
                style={[
                  styles.option,
                  {
                    backgroundColor: selected ? t.primarySoft : t.surface,
                    borderColor: selected ? t.primary : t.border,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.optionCheck,
                    {
                      backgroundColor: selected ? t.primary : "transparent",
                      borderColor: selected ? t.primary : t.border,
                    },
                  ]}
                >
                  {selected ? <Check size={14} color="#fff" strokeWidth={3} /> : null}
                </View>
                <Text variant="body" weight={selected ? "semibold" : "regular"} style={{ flex: 1 }}>
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text variant="caption" tone="muted" align="center" style={{ marginTop: space.md }}>
          No email needed — your answers stay on your device.
        </Text>
      </ScrollView>
    </View>
  );
}

// Variant wrappers for screenshot routes
export function HomepageQuizMidway() {
  return <HomepageQuiz initialStep={2} initialAnswers={["discipline", "joining"]} />;
}

export function HomepageQuizOutcome() {
  return <HomepageQuiz initialStep={4} initialAnswers={["discipline", "joining", "excellent", "50_200"]} />;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: 56,
    paddingBottom: space.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.md,
    minHeight: 64,
  },
  optionCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  outcomeHero: {
    paddingTop: 96,
    paddingHorizontal: space.lg,
    paddingBottom: space.xxxl,
    alignItems: "center",
  },
  outcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  outcomeBadge: {
    marginTop: space.md,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  recapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
