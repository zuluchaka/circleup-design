import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, Mail, Fingerprint } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius, palette } from "@/theme";

export function LoginSignIn() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <LinearGradient
        colors={[palette.indigo[600], palette.indigo[900]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cap}
      >
        <Text variant="caption" weight="bold" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: 1.5 }}>
          CIRCLEUP
        </Text>
        <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>
          Welcome back
        </Text>
        <Text variant="body" style={{ color: "rgba(255,255,255,0.9)", marginTop: space.xs }}>
          Sign in to keep your circle moving.
        </Text>
      </LinearGradient>

      <View style={[styles.sheet, { backgroundColor: t.bg }]}>
        <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Mail size={18} color={t.textSecondary} />
          <TextInput
            placeholder="email@example.org"
            placeholderTextColor={t.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            defaultValue="amara@example.org"
            style={{ flex: 1, color: t.textPrimary, fontSize: 15 }}
          />
        </View>

        <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Lock size={18} color={t.textSecondary} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={t.textMuted}
            secureTextEntry
            defaultValue="••••••••••"
            style={{ flex: 1, color: t.textPrimary, fontSize: 15 }}
          />
        </View>

        <Pressable style={{ alignSelf: "flex-end", paddingVertical: space.xs }}>
          <Text variant="bodySmall" weight="semibold" tone="accent">Forgot password?</Text>
        </Pressable>

        <View style={{ marginTop: space.md, gap: space.md }}>
          <Button label="Sign in" size="lg" fullWidth />
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <Button label="Continue with Google" variant="secondary" size="lg" fullWidth />
          <Button label="Continue with Apple" variant="secondary" size="lg" fullWidth />
        </View>

        <View style={[styles.biometricRow, { borderColor: t.border }]}>
          <Fingerprint size={20} color={t.primary} />
          <Text variant="bodySmall" tone="secondary" style={{ flex: 1 }}>
            Use Face ID next time? Enabled on this device.
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: space.lg, gap: 4 }}>
          <Text variant="bodySmall" tone="secondary">New to CircleUp?</Text>
          <Pressable><Text variant="bodySmall" weight="semibold" tone="accent">Create account</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cap: {
    paddingTop: 68,
    paddingBottom: 48,
    paddingHorizontal: space.lg,
  },
  sheet: {
    flex: 1,
    marginTop: -28,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: space.lg,
    gap: space.md,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  biometricRow: {
    marginTop: space.lg,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
});
