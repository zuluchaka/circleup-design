import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Mail,
  MessageCircle,
  Phone,
  User as UserIcon,
  Check,
  X,
  Clock,
  Inbox,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Invitation = {
  id: string;
  circleId: string;
  circleName: string;
  circleAccent: string;
  contribution: number;
  currency: string;
  cadence: string;
  inviterId: string;
  inviterName: string;
  inviterTrust: number;
  inviterRole: "Organizer" | "Treasurer" | "Member";
  associationName: string;
  channel: "WhatsApp" | "SMS" | "Email" | "Direct";
  message: string | null;
  sentAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
};

type Filter = "pending" | "all";

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - NOW;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days >= 1) return `${days}d ${hours}h left`;
  if (hours >= 1) return `${hours}h left`;
  const mins = Math.floor(diff / 60000);
  return `${mins}m left`;
}

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours >= 1) return `${hours}h ago`;
  return "just now";
}

function channelMeta(channel: Invitation["channel"]) {
  if (channel === "WhatsApp") return { Icon: MessageCircle, label: "WhatsApp" };
  if (channel === "SMS") return { Icon: Phone, label: "SMS" };
  if (channel === "Email") return { Icon: Mail, label: "Email" };
  return { Icon: UserIcon, label: "In app" };
}

export function RoscaInvitations() {
  const t = useTheme();
  const invitations = rosca.invitations as Invitation[];
  const [filter, setFilter] = useState<Filter>("pending");

  const pending = useMemo(() => invitations.filter((i) => i.status === "pending"), [invitations]);
  const visible = filter === "pending" ? pending : invitations;

  const urgent = pending.filter((i) => new Date(i.expiresAt).getTime() - NOW < 86400000 * 2).length;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Invitations"
        subtitle={`${pending.length} pending`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary banner */}
        {pending.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          <View style={[styles.summary, { backgroundColor: t.primarySoft }]}>
            <View style={[styles.summaryIcon, { backgroundColor: t.primary }]}>
              <Inbox size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.primary }}>
                {pending.length} circle{pending.length === 1 ? "" : "s"} are waiting for you
              </Text>
              {urgent > 0 ? (
                <Text variant="micro" style={{ color: t.primary, marginTop: 2 }}>
                  {urgent} expire{urgent === 1 ? "s" : ""} in less than 2 days.
                </Text>
              ) : (
                <Text variant="micro" style={{ color: t.primary, marginTop: 2 }}>
                  Plenty of time to decide — none expiring soon.
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Filter tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          <TabBtn label="Pending" count={pending.length} active={filter === "pending"} onPress={() => setFilter("pending")} t={t} />
          <TabBtn label="All" count={invitations.length} active={filter === "all"} onPress={() => setFilter("all")} t={t} />
        </View>

        {/* Invitation list */}
        <View style={{ gap: space.md }}>
          {visible.map((inv) => (
            <InvitationCard key={inv.id} inv={inv} t={t} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TabBtn({
  label,
  count,
  active,
  onPress,
  t,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabBtn, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
    >
      <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
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

function InvitationCard({ inv, t }: { inv: Invitation; t: AppTheme }) {
  const ch = channelMeta(inv.channel);
  const ChIcon = ch.Icon;
  const expired = inv.status === "expired";
  const declined = inv.status === "declined";
  const accepted = inv.status === "accepted";
  const inactive = expired || declined || accepted;
  const expiringSoon = inv.status === "pending" && new Date(inv.expiresAt).getTime() - NOW < 86400000 * 2;

  return (
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: expiringSoon ? t.warning : t.border, borderWidth: expiringSoon ? 1.5 : 1, opacity: inactive ? 0.6 : 1 }]}>
      {/* Top strip */}
      <View style={[styles.cardAccent, { backgroundColor: inv.circleAccent }]} />

      {/* Body */}
      <View style={{ padding: space.lg, gap: space.md }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
          <Avatar name={inv.inviterName} size="md" />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Text variant="bodySmall" weight="bold">{inv.inviterName}</Text>
              <View style={[styles.trustPill, { backgroundColor: t.successSoft }]}>
                <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.6 }}>
                  T·{inv.inviterTrust}
                </Text>
              </View>
              <View style={[styles.rolePill, { backgroundColor: t.bgMuted }]}>
                <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
                  {inv.inviterRole.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
              <ChIcon size={11} color={t.textMuted} />
              <Text variant="micro" tone="muted">
                {ch.label} · {timeSince(inv.sentAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Circle pill */}
        <View style={[styles.circlePill, { backgroundColor: t.bgMuted }]}>
          <View style={[styles.circleDot, { backgroundColor: inv.circleAccent }]} />
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold">{inv.circleName}</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{inv.associationName}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text variant="bodySmall" weight="bold">{formatCurrency(inv.contribution, inv.currency)}</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{inv.cadence.toLowerCase()}</Text>
          </View>
        </View>

        {/* Message */}
        {inv.message ? (
          <View style={[styles.quote, { borderLeftColor: inv.circleAccent }]}>
            <Text variant="caption" tone="secondary" style={{ lineHeight: 16, fontStyle: "italic" }}>
              "{inv.message}"
            </Text>
          </View>
        ) : null}

        {/* Expiry pill / status */}
        {inv.status === "pending" ? (
          <View style={[styles.expiryPill, { backgroundColor: expiringSoon ? t.warningSoft : t.bgMuted }]}>
            <Clock size={11} color={expiringSoon ? t.warning : t.textSecondary} />
            <Text variant="micro" weight="bold" style={{ color: expiringSoon ? t.warning : t.textSecondary, letterSpacing: 0.5 }}>
              {timeUntil(inv.expiresAt).toUpperCase()}
            </Text>
          </View>
        ) : (
          <View style={[styles.expiryPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
              {inv.status.toUpperCase()}
            </Text>
          </View>
        )}

        {/* Actions */}
        {inv.status === "pending" ? (
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Pressable
              style={[styles.declineBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
            >
              <X size={14} color={t.textSecondary} />
              <Text variant="caption" weight="semibold" tone="secondary">Decline</Text>
            </Pressable>
            <Pressable
              style={[styles.acceptBtn, { backgroundColor: inv.circleAccent }]}
            >
              <Check size={14} color="#fff" strokeWidth={3} />
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Accept &amp; review</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function EmptyState({ t }: { t: AppTheme }) {
  return (
    <View style={[styles.empty, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.emptyIcon, { backgroundColor: t.bgMuted }]}>
        <Inbox size={22} color={t.textMuted} />
      </View>
      <Text variant="bodySmall" weight="bold" align="center">No pending invitations</Text>
      <Text variant="micro" tone="secondary" align="center" style={{ marginTop: 4, maxWidth: 240 }}>
        When organisers and members invite you to circles, they'll show up here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardAccent: {
    height: 4,
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
  circlePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
  },
  circleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  quote: {
    paddingLeft: space.md,
    borderLeftWidth: 3,
  },
  expiryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  declineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  acceptBtn: {
    flex: 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  empty: {
    alignItems: "center",
    padding: space.xxl,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 4,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
});
