// Member profile detail for /sections/members-and-trust/profile.
// Public-facing view of another association member (not your own profile,
// which is Section 20). Shows identity, role, trust score, contribution
// stats, peer endorsements, and action affordances.

import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  MapPin, Calendar, CheckCircle2, MessageCircle, ThumbsUp, ShieldCheck,
  TrendingUp, Star, AlertCircle,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const MEMBER = {
  name: "Amara Ofori",
  role: "Treasurer",
  city: "Geneva, CH",
  joinedAt: "2020-09-12",
  trust: 824,
  trustDelta90d: 18,
  bio: "Three years as Treasurer for Diaspora Circle Geneva. Background in audit and compliance. Mother of two, runs the welfare fund.",
  avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
  stats: {
    contributions: 56,
    payouts: 3,
    circles: 4,
    onTimeRate: 100,
  },
  endorsements: [
    { name: "Kofi Mensah", role: "President", note: "Steady, transparent, fast to escalate." },
    { name: "Mariam Rahimi", role: "Auditor", note: "Reconciliation is always clean before I review it." },
    { name: "Zara Bekele", role: "Secretary", note: "Best Treasurer I've worked with in 4 years." },
  ],
  verifiedChannels: [
    { label: "Identity verified", at: "2021-02-04" },
    { label: "Phone verified",    at: "2020-09-12" },
    { label: "Email verified",    at: "2020-09-12" },
  ],
};

function fmtJoined(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleString("en-CH", { month: "long", year: "numeric" })}`;
}

export function MembersProfile() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Member profile" subtitle="Section 02 · Members & Trust" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Image source={{ uri: MEMBER.avatar }} style={styles.avatar} />
          <Text variant="h1" weight="bold" align="center" style={{ color: "#fff", marginTop: space.md }}>
            {MEMBER.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 }}>
            <RoleBadge role={MEMBER.role as never} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MapPin size={12} color="rgba(255,255,255,0.78)" />
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.78)" }}>{MEMBER.city}</Text>
            </View>
          </View>

          <View style={[styles.trustPill, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Star size={14} color={palette.amber[300]} fill={palette.amber[300]} />
            <Text variant="body" weight="bold" style={{ color: "#fff" }}>{MEMBER.trust}</Text>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.78)" }}>Trust Score</Text>
            <View style={[styles.delta, { backgroundColor: "rgba(16, 185, 129, 0.22)" }]}>
              <Text variant="micro" weight="bold" style={{ color: palette.emerald[400] }}>
                +{MEMBER.trustDelta90d} / 90d
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <View style={{ flex: 1 }}>
              <Button label="Message" variant="primary" leadingIcon={<MessageCircle size={14} color="#fff" />} fullWidth />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="Endorse" variant="secondary" leadingIcon={<ThumbsUp size={14} color={t.primary} />} fullWidth />
            </View>
          </View>

          <Card padded>
            <Text variant="bodySmall" style={{ lineHeight: 20 }}>{MEMBER.bio}</Text>
          </Card>

          <View style={[styles.statRow, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Stat label="Contributions" value={String(MEMBER.stats.contributions)} t={t} />
            <Sep t={t} />
            <Stat label="Payouts"       value={String(MEMBER.stats.payouts)} t={t} />
            <Sep t={t} />
            <Stat label="Circles"       value={String(MEMBER.stats.circles)} t={t} />
            <Sep t={t} />
            <Stat label="On-time"       value={`${MEMBER.stats.onTimeRate}%`} t={t} tone={t.success} />
          </View>

          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              VERIFIED CHANNELS
            </Text>
            <Card padded={false}>
              {MEMBER.verifiedChannels.map((v, i) => (
                <View
                  key={v.label}
                  style={[
                    styles.verifyRow,
                    i < MEMBER.verifiedChannels.length - 1 && {
                      borderBottomColor: t.border,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View style={[styles.verifyIcon, { backgroundColor: t.successSoft }]}>
                    <CheckCircle2 size={16} color={t.success} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{v.label}</Text>
                    <Text variant="caption" tone="secondary">verified {fmtJoined(v.at)}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>

          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              PEER ENDORSEMENTS · {MEMBER.endorsements.length}
            </Text>
            <View style={{ gap: space.sm }}>
              {MEMBER.endorsements.map((e) => (
                <Card key={e.name} padded>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
                    <View style={[styles.endorseDot, { backgroundColor: t.primarySoft }]}>
                      <ThumbsUp size={14} color={t.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" weight="semibold">{e.name}</Text>
                      <Text variant="caption" tone="secondary">{e.role}</Text>
                    </View>
                  </View>
                  <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.sm, lineHeight: 18 }}>
                    "{e.note}"
                  </Text>
                </Card>
              ))}
            </View>
          </View>

          <View style={[styles.joinedFooter, { borderTopColor: t.border }]}>
            <Calendar size={14} color={t.textMuted} />
            <Text variant="caption" tone="muted">
              Member since {fmtJoined(MEMBER.joinedAt)} · {MEMBER.stats.contributions} contributions
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, t, tone }: { label: string; value: string; t: any; tone?: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 2, paddingVertical: space.sm }}>
      <Text variant="h3" weight="bold" style={{ color: tone ?? t.textPrimary }}>{value}</Text>
      <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.4 }} numberOfLines={1}>{label.toUpperCase()}</Text>
    </View>
  );
}

function Sep({ t }: { t: any }) {
  return <View style={{ width: 1, backgroundColor: t.border }} />;
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 32,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
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
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  delta: {
    marginLeft: space.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  statRow: {
    flexDirection: "row",
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  verifyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  endorseDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  joinedFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: space.md,
    borderTopWidth: 1,
    justifyContent: "center",
    marginTop: space.sm,
  },
});
