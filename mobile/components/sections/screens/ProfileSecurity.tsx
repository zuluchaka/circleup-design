import { useState } from "react";
import { View, ScrollView, Pressable, Switch, StyleSheet, Platform } from "react-native";
import { ConfirmSheet } from "@/components/shared/ConfirmSheet";
import {
  Lock,
  Fingerprint,
  KeyRound,
  Smartphone,
  Laptop,
  Monitor,
  Check,
  ChevronRight,
  LogOut,
  Trash2,
} from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type { ActiveSession, UserProfile } from "@/product/sections/20-profile/types";

function deviceIcon(device: string) {
  if (/iphone|pixel|android|phone/i.test(device)) return Smartphone;
  if (/macbook|mac/i.test(device)) return Laptop;
  return Monitor;
}

function plural(n: number, unit: string) {
  return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
}

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < hour) {
    const n = Math.max(1, Math.round(diff / minute));
    return `${n} min ago`;
  }
  if (diff < day) return plural(Math.round(diff / hour), "hour");
  if (diff < 7 * day) return plural(Math.round(diff / day), "day");
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

const BIOMETRIC_COPY =
  Platform.OS === "ios" ? "Face ID on this iPhone" : "Fingerprint on this device";

export type SecurityConfirmKey = "sign-out-all" | "delete-account";

export function ProfileSecurity({
  initialConfirm,
}: { initialConfirm?: SecurityConfirmKey } = {}) {
  const t = useTheme();
  const data = profile as unknown as UserProfile;
  const { security } = data;
  const [signOutAllOpen, setSignOutAllOpen] = useState(initialConfirm === "sign-out-all");
  const [deleteOpen, setDeleteOpen] = useState(initialConfirm === "delete-account");

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Security" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 64, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel>SIGN-IN</SectionLabel>
        <Card padded={false}>
          <Row
            Icon={KeyRound}
            iconBg={t.primarySoft}
            iconFg={t.primary}
            title="Password"
            sub={`Last changed ${relative(security.passwordUpdatedAt)}`}
            trailing={<ChevronRight size={18} color={t.textMuted} />}
          />
          <Row
            Icon={Fingerprint}
            iconBg={t.primarySoft}
            iconFg={t.primary}
            title="Biometric unlock"
            sub={BIOMETRIC_COPY}
            trailing={<Switch value={security.biometricsEnabled} />}
          />
          <Row
            Icon={Lock}
            iconBg={t.successSoft}
            iconFg={t.success}
            title="Two-factor authentication"
            sub="Authenticator app · enrolled Apr 2024"
            trailing={
              <View style={[styles.statusPill, { backgroundColor: t.successSoft }]}>
                <Check size={10} color={t.success} strokeWidth={3} />
                <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.4 }}>
                  ON
                </Text>
              </View>
            }
            last
          />
        </Card>

        <SectionLabel>ACTIVE SESSIONS</SectionLabel>
        <Card padded={false}>
          {security.sessions.map((s, i) => (
            <SessionRow
              key={s.id}
              session={s}
              last={i === security.sessions.length - 1}
            />
          ))}
        </Card>

        <Pressable
          style={[styles.dangerCard, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}
          onPress={() => setSignOutAllOpen(true)}
        >
          <LogOut size={18} color={t.danger} />
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
              Sign out of all devices
            </Text>
            <Text variant="caption" style={{ color: t.danger, opacity: 0.85, marginTop: 2 }}>
              Ends every session including this one. You'll need to sign in again.
            </Text>
          </View>
          <ChevronRight size={18} color={t.danger} />
        </Pressable>

        <SectionLabel>DANGER ZONE</SectionLabel>
        <Pressable
          style={[styles.deleteCard, { backgroundColor: t.surface, borderColor: t.danger }]}
          onPress={() => setDeleteOpen(true)}
        >
          <View style={[styles.deleteIcon, { backgroundColor: t.dangerSoft }]}>
            <Trash2 size={18} color={t.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
              Delete account
            </Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 2, lineHeight: 16 }}>
              Permanently removes your profile, memberships, and payment methods. Active circles must be closed or transferred first.
            </Text>
          </View>
          <ChevronRight size={18} color={t.danger} />
        </Pressable>
      </ScrollView>

      <ConfirmSheet
        open={signOutAllOpen}
        onClose={() => setSignOutAllOpen(false)}
        icon={LogOut}
        tone="danger"
        title="Sign out of all devices?"
        description="This ends every active session — including this one. You'll need to sign in again on each device."
        primaryLabel="Sign out everywhere"
      />

      <ConfirmSheet
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        icon={Trash2}
        tone="danger"
        title="Delete account?"
        description="This permanently removes your profile, memberships, payment methods, and trust history. Close or transfer any active circles first — this cannot be undone."
        primaryLabel="Delete my account"
      />
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: -space.xs }}>
      {children}
    </Text>
  );
}

function Row({
  Icon,
  iconBg,
  iconFg,
  title,
  sub,
  trailing,
  last,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconBg: string;
  iconFg: string;
  title: string;
  sub: string;
  trailing?: React.ReactNode;
  last?: boolean;
}) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Icon size={18} color={iconFg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">
          {title}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          {sub}
        </Text>
      </View>
      {trailing}
    </View>
  );
}

function SessionRow({ session, last }: { session: ActiveSession; last: boolean }) {
  const t = useTheme();
  const DeviceIcon = deviceIcon(session.device);
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: t.bgMuted }]}>
        <DeviceIcon size={18} color={t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="bodySmall" weight="semibold">
            {session.device}
          </Text>
          {session.isCurrent ? (
            <View style={[styles.statusPill, { backgroundColor: t.primarySoft }]}>
              <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.4 }}>
                THIS DEVICE
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          {session.os} · {session.city}, {session.country}
        </Text>
        <Text variant="micro" tone="muted" style={{ marginTop: 2 }}>
          Last active {relative(session.lastActive)}
        </Text>
      </View>
      {!session.isCurrent ? (
        <Pressable style={[styles.endBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Text variant="micro" weight="semibold" tone="secondary">
            End
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  endBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  dangerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  deleteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  deleteIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
