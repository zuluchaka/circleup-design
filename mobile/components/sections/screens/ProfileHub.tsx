import { useState } from "react";
import { View, ScrollView, Image, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ConfirmSheet } from "@/components/shared/ConfirmSheet";
import {
  Star,
  Coins,
  Banknote,
  CircleDot,
  User,
  ShieldCheck,
  CreditCard,
  Lock,
  Bell,
  Globe,
  Crown,
  HelpCircle,
  Scale,
  ChevronRight,
  ChevronDown,
  LogOut,
  AlertTriangle,
  Check,
  Users,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppTabs } from "@/components/shared/AppTabs";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { useTheme, space, radius, palette } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type {
  AssociationMembership,
  ProfileMenuItem,
  UserProfile,
} from "@/product/sections/20-profile/types";

const sampleProfile = profile as unknown as UserProfile;

const ROLE_LABEL: Record<AssociationMembership["role"], string> = {
  member: "Member",
  treasurer: "Treasurer",
  organizer: "Organizer",
  president: "President",
  circle_manager: "Circle Manager",
};

const ICONS = {
  user: User,
  "shield-check": ShieldCheck,
  "credit-card": CreditCard,
  lock: Lock,
  bell: Bell,
  globe: Globe,
  crown: Crown,
  "help-circle": HelpCircle,
  scale: Scale,
} as const;

export function ProfileHub({
  data = sampleProfile,
  initialConfirm = false,
  initialSwitcherOpen = false,
}: {
  data?: UserProfile;
  initialConfirm?: boolean;
  initialSwitcherOpen?: boolean;
} = {}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { identity, memberships, stats, menu, subscription } = data;
  const [signOutOpen, setSignOutOpen] = useState(initialConfirm);
  const [switcherOpen, setSwitcherOpen] = useState(initialSwitcherOpen);
  const isPastDue = subscription.status === "past_due";
  const primary = memberships.find((m) => m.isPrimary) ?? memberships[0];
  const [activeId, setActiveId] = useState(primary.id);
  const active = memberships.find((m) => m.id === activeId) ?? primary;
  const roleLabel = ROLE_LABEL[active.role];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={
            t.mode === "dark"
              ? [palette.indigo[900], palette.indigo[950]]
              : [palette.indigo[700], palette.indigo[900]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + space.xl }]}
        >
          <View style={[styles.heroTopRow, { top: insets.top + 10 }]}>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1.4 }}>
              SIGNED IN AS
            </Text>
            <View style={styles.kycPill}>
              <ShieldCheck size={11} color={palette.emerald[400]} />
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                ENHANCED KYC
              </Text>
            </View>
          </View>

          <Image source={{ uri: identity.avatarUrl }} style={styles.avatar} />
          <Text variant="h1" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>
            {identity.fullName}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.78)" }}>
            {roleLabel} · {identity.city}
          </Text>

          {memberships.length > 1 ? (
            <Pressable
              style={styles.associationPill}
              onPress={() => setSwitcherOpen(true)}
              accessibilityLabel={`Switch active association. Currently ${active.name}.`}
            >
              <Users size={12} color="rgba(255,255,255,0.85)" />
              <Text variant="caption" weight="semibold" style={{ color: "#fff" }} numberOfLines={1}>
                {active.name}
              </Text>
              <View style={styles.associationCount}>
                <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.4 }}>
                  {memberships.length}
                </Text>
              </View>
              <ChevronDown size={14} color="rgba(255,255,255,0.85)" />
            </Pressable>
          ) : null}

          <Pressable style={styles.trustPill}>
            <Star size={14} color={palette.amber[300]} fill={palette.amber[300]} />
            <Text variant="body" weight="bold" style={{ color: "#fff" }}>
              {stats.trustScore}
            </Text>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.78)" }}>
              Trust Score
            </Text>
            <View style={styles.trustDelta}>
              <Text variant="micro" weight="bold" style={{ color: palette.emerald[400] }}>
                +{stats.trustDeltaWeek} this week
              </Text>
            </View>
          </Pressable>
        </LinearGradient>

        <View style={[styles.statRow, { marginTop: -space.xl }]}>
          <StatTile
            t={t}
            icon={<Coins size={18} color={t.primary} />}
            label="Contributions"
            value={stats.contributions.toString()}
            sub={`${stats.contributionsThisYear} this year`}
          />
          <StatTile
            t={t}
            icon={<Banknote size={18} color={t.success} />}
            label="Payouts"
            value={stats.payoutsReceived.toString()}
            sub={`CHF ${stats.payoutsAmountChf.toLocaleString("en-CH")}`}
          />
          <StatTile
            t={t}
            icon={<CircleDot size={18} color={t.accent} />}
            label="Circles"
            value={stats.circlesActive.toString()}
            sub={`${stats.circlesTotal} all-time`}
          />
        </View>

        {isPastDue ? (
          <Pressable
            style={[
              styles.pastDueBanner,
              { backgroundColor: t.dangerSoft, borderColor: t.danger },
            ]}
            onPress={() => router.push("/profile/subscription" as never)}
          >
            <View style={[styles.pastDueIcon, { backgroundColor: t.danger }]}>
              <AlertTriangle size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
                Payment failed
              </Text>
              <Text variant="caption" style={{ color: t.danger, opacity: 0.85, marginTop: 2 }}>
                Your card was declined. Update your payment method to keep Plus features.
              </Text>
            </View>
            <ChevronRight size={18} color={t.danger} />
          </Pressable>
        ) : null}

        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.sm }}>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs }}>
            ACCOUNT
          </Text>
          <Card padded={false}>
            {menu.map((item, i) => (
              <MenuRow key={item.key} item={item} last={i === menu.length - 1} />
            ))}
          </Card>
        </View>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg }}>
          <Pressable
            style={[styles.signOut, { backgroundColor: t.surface, borderColor: t.border }]}
            onPress={() => setSignOutOpen(true)}
          >
            <LogOut size={18} color={t.danger} />
            <Text variant="body" weight="semibold" style={{ flex: 1, color: t.danger }}>
              Sign out
            </Text>
            <Text variant="micro" tone="muted">
              Aminata · CircleUp v{data.about.version}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <AppTabs />

      <ConfirmSheet
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        icon={LogOut}
        tone="danger"
        title="Sign out?"
        description="You'll need to sign in again with your phone number and password. Active contributions and circle data stay safe."
        primaryLabel="Sign out"
        onPrimaryPress={() => {
          setSignOutOpen(false);
          router.replace("/welcome" as never);
        }}
      />

      <BottomSheet
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        title="Switch active association"
        subtitle="Trust score, stats, and notifications follow your active membership."
      >
        {memberships.map((m, i) => {
          const selected = m.id === active.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => {
                setActiveId(m.id);
                setSwitcherOpen(false);
              }}
              style={[
                styles.switcherRow,
                {
                  backgroundColor: selected ? t.primarySoft : t.surface,
                  borderColor: selected ? t.primary : t.border,
                },
                i > 0 && { marginTop: space.sm },
              ]}
            >
              <View style={[styles.switcherIcon, { backgroundColor: t.bgMuted }]}>
                <Users size={18} color={t.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">
                  {m.name}
                </Text>
                <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  {ROLE_LABEL[m.role]} · joined {new Date(m.joinedAt).getFullYear()}
                </Text>
              </View>
              {selected ? (
                <View style={[styles.switcherCheck, { backgroundColor: t.primary }]}>
                  <Check size={14} color="#fff" strokeWidth={3} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </View>
  );
}

function StatTile({
  t,
  icon,
  label,
  value,
  sub,
}: {
  t: ReturnType<typeof useTheme>;
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <View style={[styles.tile, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.tileIcon, { backgroundColor: t.bgMuted }]}>{icon}</View>
      <Text variant="h2" weight="bold" style={{ marginTop: space.sm }}>
        {value}
      </Text>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: 2 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
        {sub}
      </Text>
    </View>
  );
}

function MenuRow({ item, last }: { item: ProfileMenuItem; last: boolean }) {
  const t = useTheme();
  const Icon = ICONS[item.iconKey];
  const badgeTone =
    item.badge?.tone === "success"
      ? { bg: t.successSoft, fg: t.success }
      : item.badge?.tone === "warning"
      ? { bg: t.warningSoft, fg: t.warning }
      : item.badge?.tone === "danger"
      ? { bg: t.dangerSoft, fg: t.danger }
      : { bg: t.infoSoft, fg: t.info };

  return (
    <Pressable
      style={[
        styles.row,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
      onPress={() => router.push(`/profile/${item.key}` as never)}
    >
      <View style={[styles.rowIcon, { backgroundColor: t.primarySoft }]}>
        <Icon size={18} color={t.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" weight="semibold">
          {item.label}
        </Text>
        <Text variant="caption" tone="secondary">
          {item.description}
        </Text>
      </View>
      {item.badge ? (
        <View style={[styles.badge, { backgroundColor: badgeTone.bg }]}>
          <Text variant="micro" weight="bold" style={{ color: badgeTone.fg, letterSpacing: 0.4 }}>
            {item.badge.label.toUpperCase()}
          </Text>
        </View>
      ) : null}
      <ChevronRight size={18} color={t.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: space.xxxl + space.lg,
    paddingHorizontal: space.lg,
    alignItems: "center",
  },
  heroTopRow: {
    position: "absolute",
    left: space.lg,
    right: space.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kycPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: palette.slate[300],
  },
  trustPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: space.md,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  trustDelta: {
    marginLeft: space.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: "rgba(16, 185, 129, 0.18)",
  },
  statRow: {
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.lg,
  },
  tile: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  pastDueBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    marginHorizontal: space.lg,
    marginTop: space.lg,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  pastDueIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  associationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    maxWidth: "92%",
  },
  associationCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  switcherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  switcherIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  switcherCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
