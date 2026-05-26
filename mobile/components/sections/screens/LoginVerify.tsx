// Email verification waiting state for /sections/login/verify.
// Per spec: calm waiting screen with big circular check (idle), 30s resend
// countdown, change-email affordance.

import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Check, ChevronRight, RefreshCw } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius, palette } from "@/theme";

const RESEND_SECONDS = 30;
const EMAIL = "amara@example.org";

export function LoginVerify({
  initialResendIn = RESEND_SECONDS,
}: { initialResendIn?: number } = {}) {
  const t = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(initialResendIn);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const canResend = secondsLeft === 0;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <LinearGradient
        colors={[palette.indigo[700], palette.indigo[900]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.iconCircle}>
          <Mail size={36} color="#fff" />
          <View style={[styles.checkBadge, { backgroundColor: t.success, borderColor: palette.indigo[900] }]}>
            <Check size={14} color="#fff" strokeWidth={3} />
          </View>
        </View>

        <Text variant="display" weight="bold" align="center" style={{ color: "#fff", marginTop: space.xl }}>
          Check your email
        </Text>
        <Text variant="body" align="center" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.sm }}>
          We sent a verification link to
        </Text>
        <View style={[styles.emailPill]}>
          <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
            {EMAIL}
          </Text>
        </View>
        <Text variant="caption" align="center" style={{ color: "rgba(255,255,255,0.65)", marginTop: space.lg, lineHeight: 18, paddingHorizontal: space.lg }}>
          Tap the link in the email to verify your address. We'll bring you straight back here.
        </Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.md }}>
        <Card padded>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>DIDN'T GET IT?</Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.sm, lineHeight: 18 }}>
            Check your spam folder, or resend the email. Some providers (Hotmail, Yahoo) take up to a minute.
          </Text>

          <Pressable
            disabled={!canResend}
            style={[
              styles.resendBtn,
              {
                backgroundColor: canResend ? t.primary : t.bgMuted,
                opacity: canResend ? 1 : 0.6,
              },
            ]}
          >
            <RefreshCw size={16} color={canResend ? "#fff" : t.textMuted} />
            <Text variant="bodySmall" weight="bold" style={{ color: canResend ? "#fff" : t.textMuted }}>
              {canResend ? "Resend email" : `Resend in ${secondsLeft}s`}
            </Text>
          </Pressable>
        </Card>

        <Card padded>
          <Pressable style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={[styles.changeIcon, { backgroundColor: t.bgMuted }]}>
              <Mail size={18} color={t.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="semibold">Change email address</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                Typed the wrong one? Update it now.
              </Text>
            </View>
            <ChevronRight size={18} color={t.textMuted} />
          </Pressable>
        </Card>

        <Text variant="caption" tone="muted" align="center" style={{ marginTop: space.md, paddingHorizontal: space.lg, lineHeight: 18 }}>
          Verifying your email earns you +5 Trust Score points and unlocks circle joins up to CHF 100/month.
        </Text>
      </View>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: space.lg, paddingBottom: 40 }}>
        <Button label="I've verified — sign in" fullWidth size="lg" variant="ghost" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 80,
    paddingBottom: space.xxxl,
    paddingHorizontal: space.lg,
    alignItems: "center",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  emailPill: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginTop: space.sm,
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: space.md,
  },
  changeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
