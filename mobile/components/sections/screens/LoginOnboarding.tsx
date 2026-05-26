// Multi-step onboarding wizard for /sections/login/onboarding.
// 4 steps per spec: Profile → Identity → Preferences → First circle.
// Each step's primary CTA is sticky at the bottom. Last step shows a
// "Recommended circle for you" card.

import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft, ArrowRight, Check, User as UserIcon, ShieldCheck, Bell, CircleDot,
  Camera, IdCard, CreditCard, Sparkles,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius, palette } from "@/theme";

type StepKey = "profile" | "identity" | "prefs" | "firstcircle";

const STEPS: { key: StepKey; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { key: "profile",      label: "Profile",      Icon: UserIcon },
  { key: "identity",     label: "Identity",     Icon: ShieldCheck },
  { key: "prefs",        label: "Preferences",  Icon: Bell },
  { key: "firstcircle",  label: "First circle", Icon: CircleDot },
];

const RECOMMENDED = [
  { id: "welfare", name: "Welfare Booster", contribution: 50, cadence: "Monthly",  reason: "Low-stakes start with 24 active members.", members: 24 },
  { id: "youth",   name: "Youth Starter",   contribution: 25, cadence: "Bi-weekly", reason: "Build a streak quickly with smaller contributions.", members: 14 },
];

type Props = { initialStep?: number };

export function LoginOnboarding({ initialStep = 0 }: Props = {}) {
  const t = useTheme();
  const [step, setStep] = useState(initialStep);
  const cur = STEPS[step];
  const Icon = cur.Icon;
  const isLast = step === STEPS.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <LinearGradient
        colors={[palette.indigo[700], palette.indigo[900]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.headerRow}>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} style={styles.backBtn}>
              <ArrowLeft size={18} color="#fff" />
            </Pressable>
          ) : <View style={{ width: 36 }} />}
          <Text variant="caption" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.2 }}>
            STEP {step + 1} OF {STEPS.length}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.stepsRow}>
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            const StepIcon = s.Icon;
            return (
              <View key={s.key} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: done ? palette.emerald[500] : active ? "#fff" : "rgba(255,255,255,0.18)",
                      borderColor: active ? "#fff" : "rgba(255,255,255,0.25)",
                    },
                  ]}
                >
                  {done ? <Check size={14} color="#fff" strokeWidth={3} /> : <StepIcon size={14} color={active ? palette.indigo[700] : "rgba(255,255,255,0.78)"} />}
                </View>
                <Text
                  variant="micro"
                  weight={active ? "bold" : "semibold"}
                  style={{ color: active ? "#fff" : "rgba(255,255,255,0.65)" }}
                  numberOfLines={1}
                >
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>

        <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.lg }}>
          {cur.key === "profile" && "Tell us who you are"}
          {cur.key === "identity" && "Quick identity check"}
          {cur.key === "prefs" && "How should we reach you?"}
          {cur.key === "firstcircle" && "Pick your first circle"}
        </Text>
        <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.sm }}>
          {cur.key === "profile" && "Name and language only. Phone + email come later if needed."}
          {cur.key === "identity" && "ID + selfie. Takes ~2 min. Skip for now if you're only joining a small circle."}
          {cur.key === "prefs" && "Push, email digest, and a default payment method."}
          {cur.key === "firstcircle" && "Two open circles match your readiness. Join one to start saving."}
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 120, gap: space.lg }}>
        {cur.key === "profile" && <ProfileStep t={t} />}
        {cur.key === "identity" && <IdentityStep t={t} />}
        {cur.key === "prefs" && <PrefsStep t={t} />}
        {cur.key === "firstcircle" && <FirstCircleStep t={t} />}
      </ScrollView>

      <View style={[styles.cta, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        {step > 0 ? (
          <Pressable onPress={() => setStep(step - 1)} style={[styles.ghostBtn, { borderColor: t.border }]}>
            <Text variant="bodySmall" weight="semibold" tone="secondary">Back</Text>
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }}>
          <Button
            label={isLast ? "Join circle & finish" : "Continue"}
            fullWidth
            trailingIcon={<ArrowRight size={16} color="#fff" />}
          />
        </View>
      </View>
    </View>
  );
}

// Variant wrappers
export function LoginOnboardingIdentity() { return <LoginOnboarding initialStep={1} />; }
export function LoginOnboardingPrefs() { return <LoginOnboarding initialStep={2} />; }
export function LoginOnboardingFirstCircle() { return <LoginOnboarding initialStep={3} />; }

// ----- Steps -----

function ProfileStep({ t }: { t: any }) {
  return (
    <View style={{ gap: space.md }}>
      <View style={{ gap: 6 }}>
        <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>FIRST NAME</Text>
        <View style={[styles.field, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
          <TextInput value="Amara" editable={false} style={{ flex: 1, color: t.textPrimary, fontSize: 14 }} />
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>LAST NAME</Text>
        <View style={[styles.field, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
          <TextInput value="Okonkwo" editable={false} style={{ flex: 1, color: t.textPrimary, fontSize: 14 }} />
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>PREFERRED LANGUAGE</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
          {[
            { flag: "🇬🇧", label: "English", selected: true },
            { flag: "🇫🇷", label: "Français", selected: false },
            { flag: "🇩🇪", label: "Deutsch", selected: false },
            { flag: "🇮🇹", label: "Italiano", selected: false },
            { flag: "🇵🇹", label: "Português", selected: false },
          ].map((l) => (
            <View
              key={l.label}
              style={[
                styles.langChip,
                {
                  backgroundColor: l.selected ? t.primarySoft : t.surface,
                  borderColor: l.selected ? t.primary : t.border,
                },
              ]}
            >
              <Text variant="bodySmall">{l.flag}</Text>
              <Text variant="caption" weight={l.selected ? "bold" : "semibold"} style={{ color: l.selected ? t.primary : t.textPrimary }}>{l.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function IdentityStep({ t }: { t: any }) {
  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.docCard, { borderColor: t.primary, backgroundColor: t.primarySoft }]}>
        <View style={[styles.docIcon, { backgroundColor: t.primary }]}>
          <IdCard size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="bold">Government ID</Text>
          <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>Passport, national ID, or residence permit.</Text>
        </View>
        <View style={[styles.uploadedBadge, { backgroundColor: t.success }]}>
          <Check size={12} color="#fff" strokeWidth={3} />
        </View>
      </View>
      <View style={[styles.docCard, { borderColor: t.border, backgroundColor: t.surface }]}>
        <View style={[styles.docIcon, { backgroundColor: t.bgMuted }]}>
          <Camera size={20} color={t.textSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="bold">Liveness selfie</Text>
          <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>5-second video, no spoofing.</Text>
        </View>
        <Text variant="caption" weight="semibold" tone="accent">Start</Text>
      </View>
      <Text variant="caption" tone="muted" style={{ lineHeight: 18 }}>
        Skip for now if you're only joining circles up to CHF 100/month. You can verify later anytime — required for higher-value circles.
      </Text>
    </View>
  );
}

function PrefsStep({ t }: { t: any }) {
  return (
    <View style={{ gap: space.md }}>
      <Card padded>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
          <View style={[styles.docIcon, { backgroundColor: t.primarySoft }]}>
            <Bell size={20} color={t.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="semibold">Push notifications</Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>Payment reminders, payouts, votes.</Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: t.primary }]}>
            <View style={[styles.toggleKnob, { right: 2 }]} />
          </View>
        </View>
      </Card>
      <Card padded>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
          <View style={[styles.docIcon, { backgroundColor: t.primarySoft }]}>
            <UserIcon size={20} color={t.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="semibold">Weekly email digest</Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>One email every Monday. Skippable.</Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: t.bgMuted }]}>
            <View style={[styles.toggleKnob, { left: 2 }]} />
          </View>
        </View>
      </Card>
      <Card padded>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
          <View style={[styles.docIcon, { backgroundColor: t.primarySoft }]}>
            <CreditCard size={20} color={t.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="semibold">Default payment method</Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>Add it now, or skip and add when you join your first circle.</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

function FirstCircleStep({ t }: { t: any }) {
  return (
    <View style={{ gap: space.md }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: space.xs }}>
        <Sparkles size={14} color={t.warning} />
        <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>RECOMMENDED FOR YOU</Text>
      </View>
      {RECOMMENDED.map((c, i) => (
        <View
          key={c.id}
          style={[
            styles.circleCard,
            {
              backgroundColor: i === 0 ? t.primarySoft : t.surface,
              borderColor: i === 0 ? t.primary : t.border,
              borderWidth: i === 0 ? 2 : 1,
            },
          ]}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text variant="h3" weight="bold">{c.name}</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{c.reason}</Text>
            </View>
            {i === 0 ? (
              <View style={[styles.pickBadge, { backgroundColor: t.primary }]}>
                <Text variant="micro" weight="bold" style={{ color: "#fff" }}>TOP MATCH</Text>
              </View>
            ) : null}
          </View>
          <View style={[styles.statsRow, { borderTopColor: t.border }]}>
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="muted">CONTRIBUTION</Text>
              <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>CHF {c.contribution}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="muted">CADENCE</Text>
              <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>{c.cadence}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="muted">MEMBERS</Text>
              <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>{c.members}</Text>
            </View>
          </View>
        </View>
      ))}
      <Pressable style={[styles.browseBtn, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
        <Text variant="bodySmall" weight="semibold" tone="secondary">Browse all circles instead</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 56,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepsRow: {
    flexDirection: "row",
    marginTop: space.md,
    gap: space.xs,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  langChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    position: "absolute",
  },
  circleCard: {
    padding: space.md,
    borderRadius: radius.md,
  },
  pickBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: space.md,
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
  },
  browseBtn: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  cta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.lg,
    paddingBottom: 40,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ghostBtn: {
    paddingHorizontal: space.lg,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
