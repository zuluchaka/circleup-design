// Account creation for /sections/login/signup.
// Mirrors signin's gradient layout. Intent picker (member/organizer/starter),
// email + password fields with inline strength meter, T&Cs link always visible,
// social buttons below the divider.

import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Check, Users, Sparkles, Compass } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius, palette } from "@/theme";

type Intent = "member" | "organizer" | "starter";

const INTENTS: { key: Intent; label: string; sub: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { key: "member",    label: "Joining a circle",    sub: "Someone invited me",        Icon: Users },
  { key: "organizer", label: "Organizing a circle", sub: "I want to bring my group",  Icon: Sparkles },
  { key: "starter",   label: "Just exploring",      sub: "Show me how it works",      Icon: Compass },
];

const SAMPLE_PASSWORD = "Aurora-Sav!ngs-2026";

function scorePassword(pw: string): { level: number; label: string; color: (t: ReturnType<typeof useTheme>) => string } {
  let s = 0;
  if (pw.length >= 10) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^a-zA-Z\d]/.test(pw)) s++;
  if (pw.length >= 14 && /[^a-zA-Z\d]/.test(pw)) s++;
  const map = [
    { label: "Too short", color: (t: any) => t.danger },
    { label: "Weak",      color: (t: any) => t.warning },
    { label: "OK",        color: (t: any) => t.info },
    { label: "Strong",    color: (t: any) => t.success },
    { label: "Excellent", color: (t: any) => t.success },
  ];
  return { level: s, ...map[s] };
}

export function LoginSignup({
  initialIntent = "member",
  initialPassword = SAMPLE_PASSWORD,
}: { initialIntent?: Intent; initialPassword?: string } = {}) {
  const t = useTheme();
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState(initialPassword);
  const strength = scorePassword(pw);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ paddingBottom: space.xxxl }}>
      <LinearGradient
        colors={[palette.indigo[700], palette.indigo[900]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.4 }}>
          GET STARTED
        </Text>
        <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xs }}>
          Create your account
        </Text>
        <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.sm }}>
          Two-minute sign-up. KYC happens later, only when you join a high-value circle.
        </Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.lg }}>
        {/* Intent */}
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            WHAT BRINGS YOU HERE
          </Text>
          <View style={{ gap: space.sm }}>
            {INTENTS.map((opt) => {
              const sel = intent === opt.key;
              const Icon = opt.Icon;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setIntent(opt.key)}
                  style={[
                    styles.intentRow,
                    {
                      backgroundColor: sel ? t.primarySoft : t.surface,
                      borderColor: sel ? t.primary : t.border,
                      borderWidth: sel ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[styles.intentIcon, { backgroundColor: sel ? t.primary : t.bgMuted }]}>
                    <Icon size={18} color={sel ? "#fff" : t.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{opt.label}</Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{opt.sub}</Text>
                  </View>
                  <View style={[styles.radio, { borderColor: sel ? t.primary : t.border, backgroundColor: sel ? t.primary : "transparent" }]}>
                    {sel ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Email */}
        <View style={{ gap: 6 }}>
          <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>EMAIL</Text>
          <View style={[styles.field, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
            <Mail size={16} color={t.textMuted} />
            <TextInput
              value="amara@example.org"
              editable={false}
              placeholderTextColor={t.textMuted}
              style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
            />
          </View>
        </View>

        {/* Password + strength */}
        <View style={{ gap: 6 }}>
          <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>PASSWORD</Text>
          <View style={[styles.field, { borderColor: t.border, backgroundColor: t.bgMuted }]}>
            <Lock size={16} color={t.textMuted} />
            <TextInput
              value={pw}
              onChangeText={setPw}
              secureTextEntry={!showPw}
              placeholderTextColor={t.textMuted}
              style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
            />
            <Pressable onPress={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16} color={t.textMuted} /> : <Eye size={16} color={t.textMuted} />}
            </Pressable>
          </View>
          <View style={styles.strengthRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthBar,
                  { backgroundColor: i < strength.level ? strength.color(t) : t.bgMuted },
                ]}
              />
            ))}
            <Text variant="micro" weight="semibold" style={{ color: strength.color(t), marginLeft: space.xs }}>
              {strength.label}
            </Text>
          </View>
          <Text variant="micro" tone="muted" style={{ marginTop: 4 }}>
            Min 10 characters, mixed case, at least one number or symbol.
          </Text>
        </View>

        {/* T&Cs */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.sm }}>
          <View style={[styles.checkbox, { backgroundColor: t.primary, borderColor: t.primary }]}>
            <Check size={12} color="#fff" strokeWidth={3} />
          </View>
          <Text variant="caption" tone="secondary" style={{ flex: 1, lineHeight: 18 }}>
            I agree to the{" "}
            <Text variant="caption" weight="semibold" tone="accent">Terms of Service</Text>
            ,{" "}
            <Text variant="caption" weight="semibold" tone="accent">Privacy Policy</Text>
            , and FINMA financial-services disclosure.
          </Text>
        </View>

        <Button label="Create account" fullWidth size="lg" trailingIcon={<ArrowRight size={18} color="#fff" />} />

        {/* Divider */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.sm }}>
          <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
          <Text variant="caption" tone="muted">OR CONTINUE WITH</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
        </View>

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable style={[styles.social, { borderColor: t.border, backgroundColor: t.surface }]}>
            <Text variant="bodySmall" weight="bold">G</Text>
            <Text variant="bodySmall" weight="semibold">Google</Text>
          </Pressable>
          <Pressable style={[styles.social, { borderColor: t.border, backgroundColor: t.surface }]}>
            <Text variant="bodySmall" weight="bold"></Text>
            <Text variant="bodySmall" weight="semibold">Apple</Text>
          </Pressable>
        </View>

        <Text variant="caption" tone="secondary" align="center" style={{ marginTop: space.md }}>
          Already have an account?{" "}
          <Text variant="caption" weight="bold" tone="accent">Sign in</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 72,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
  },
  intentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  intentIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
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
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  social: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
