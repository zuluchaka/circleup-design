import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Users,
  Mail,
  ShieldAlert,
  Clock,
  ArrowUp,
  MoreVertical,
  AlertCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Tab = "members" | "waitlist" | "invitations" | "disputes";

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

export function RoscaManagement() {
  const t = useTheme();
  const m = rosca.managementSummary as {
    members: any[];
    waitlist: any[];
    pendingInvitations: number;
    openDisputes: number;
  };

  const [tab, setTab] = useState<Tab>("members");

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Manage circle"
        subtitle={`${m.members.length} members · Main CHF Circle`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          <TabBtn label="Members" count={m.members.length} Icon={Users} active={tab === "members"} onPress={() => setTab("members")} t={t} />
          <TabBtn label="Waitlist" count={m.waitlist.length} Icon={Clock} active={tab === "waitlist"} onPress={() => setTab("waitlist")} t={t} />
          <TabBtn label="Invites" count={m.pendingInvitations} Icon={Mail} active={tab === "invitations"} onPress={() => setTab("invitations")} t={t} />
          <TabBtn label="Disputes" count={m.openDisputes} Icon={ShieldAlert} active={tab === "disputes"} onPress={() => setTab("disputes")} t={t} />
        </View>

        {tab === "members" ? (
          <View style={{ gap: space.sm }}>
            {m.members.map((mem) => (
              <MemberRow key={mem.memberId} mem={mem} t={t} />
            ))}
          </View>
        ) : tab === "waitlist" ? (
          <View style={{ gap: space.sm }}>
            {m.waitlist.length === 0 ? (
              <EmptyState body="No one on the waitlist." t={t} />
            ) : (
              m.waitlist.map((w) => <WaitlistRow key={w.position} w={w} t={t} />)
            )}
          </View>
        ) : tab === "invitations" ? (
          <EmptyState
            heading="Invitations live in their own screen"
            body="Use the Invite screen for channel-selector, bulk send, and per-invitation status."
            cta="Open Invite"
            onCta={() => router.push("/sections/rosca-circles/invite" as never)}
            t={t}
          />
        ) : (
          <EmptyState
            heading="Disputes live in their own screen"
            body="See open and resolved disputes with full timeline and evidence carousel."
            cta="Open Disputes"
            onCta={() => router.push("/sections/rosca-circles/disputes" as never)}
            t={t}
          />
        )}
      </ScrollView>
    </View>
  );
}

function TabBtn({
  label,
  count,
  Icon,
  active,
  onPress,
  t,
}: {
  label: string;
  count: number;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
    >
      <Icon size={12} color={active ? t.primary : t.textSecondary} />
      <Text variant="micro" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
        {label}
      </Text>
      <View style={[styles.tabCount, { backgroundColor: active ? t.primarySoft : "transparent" }]}>
        <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textMuted }}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function MemberRow({ mem, t }: { mem: any; t: AppTheme }) {
  const inArrears = mem.status === "in_arrears";
  const suspended = mem.status === "suspended";
  const roleColor = mem.role === "Organizer" ? t.primary : mem.role === "Treasurer" ? t.warning : t.textSecondary;

  return (
    <View style={[styles.memberRow, { backgroundColor: t.surface, borderColor: inArrears ? t.danger : t.border, borderWidth: inArrears ? 1.5 : 1 }]}>
      <View style={styles.slotChip}>
        <Text variant="micro" weight="bold" tone="muted">#{mem.slot}</Text>
      </View>
      <Avatar name={mem.name} size="sm" />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold" numberOfLines={1}>{mem.name}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{mem.trust}</Text>
          </View>
          {mem.role !== "Member" ? (
            <View style={[styles.rolePill, { backgroundColor: `${roleColor}22` }]}>
              <Text variant="micro" weight="bold" style={{ color: roleColor, letterSpacing: 0.5 }}>
                {mem.role.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary">
          On-time {Math.round(mem.onTimeRate * 100)}% · joined {new Date(mem.joinedAt).toLocaleDateString("en-CH", { month: "short", year: "numeric" })}
        </Text>
        {inArrears ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <AlertCircle size={10} color={t.danger} />
            <Text variant="micro" weight="bold" style={{ color: t.danger }}>IN ARREARS</Text>
          </View>
        ) : null}
      </View>
      <Pressable style={[styles.menuBtn, { backgroundColor: t.bgMuted }]}>
        <MoreVertical size={14} color={t.textPrimary} />
      </Pressable>
    </View>
  );
}

function WaitlistRow({ w, t }: { w: any; t: AppTheme }) {
  return (
    <View style={[styles.waitlistRow, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.posPill, { backgroundColor: t.primarySoft }]}>
        <Text variant="caption" weight="bold" style={{ color: t.primary }}>#{w.position}</Text>
      </View>
      <Avatar name={w.name} size="sm" />
      <View style={{ flex: 1 }}>
        <Text variant="caption" weight="bold">{w.name}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          T·{w.trust} · joined {timeSince(w.joinedAt)} · {w.channel}
        </Text>
      </View>
      <Pressable style={[styles.promoteBtn, { backgroundColor: t.success }]}>
        <ArrowUp size={11} color="#fff" strokeWidth={3} />
        <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.5 }}>PROMOTE</Text>
      </Pressable>
    </View>
  );
}

function EmptyState({
  heading,
  body,
  cta,
  onCta,
  t,
}: {
  heading?: string;
  body: string;
  cta?: string;
  onCta?: () => void;
  t: AppTheme;
}) {
  return (
    <View style={[styles.empty, { backgroundColor: t.surface, borderColor: t.border }]}>
      {heading ? (
        <Text variant="bodySmall" weight="bold" align="center">{heading}</Text>
      ) : null}
      <Text variant="micro" tone="secondary" align="center" style={{ maxWidth: 280, lineHeight: 14 }}>{body}</Text>
      {cta ? (
        <Pressable onPress={onCta} style={[styles.emptyCta, { backgroundColor: t.primary }]}>
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{cta} →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.sm,
    paddingRight: space.md,
    borderRadius: radius.md,
  },
  slotChip: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  menuBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  waitlistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  posPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  promoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  empty: {
    alignItems: "center",
    padding: space.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: space.sm,
  },
  emptyCta: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginTop: 4,
  },
});
