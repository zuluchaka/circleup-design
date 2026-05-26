// Referrals for /sections/community-and-social/referrals.
// Large copyable code, share affordance, reward ladder, history of invites.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Gift, Copy, Share2, CheckCircle2, Clock, X, Mail, MessageCircle, Award,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const CODE = "AMARA-CIRCLE";
const LADDER = [
  { invites: 1, reward: "CHF 5 credit",      Icon: Gift },
  { invites: 3, reward: "CHF 20 credit",     Icon: Gift },
  { invites: 5, reward: "Recruiter badge",   Icon: Award },
];
const HISTORY = [
  { id: "ref_1", to: "Olusegun Adebayo",  status: "joined",  at: "2 days ago", reward: "CHF 5 earned" },
  { id: "ref_2", to: "+41 79 555 0182",   status: "sent",    at: "5 days ago" },
  { id: "ref_3", to: "felipe@example.ch", status: "viewed",  at: "1 week ago" },
  { id: "ref_4", to: "+33 6 87 02 11 44", status: "expired", at: "3 weeks ago" },
];

const INVITES_DONE = 1;

function statusVisual(s: string, t: any) {
  if (s === "joined")  return { bg: t.successSoft, fg: t.success,    Icon: CheckCircle2, label: "Joined" };
  if (s === "viewed")  return { bg: t.infoSoft,    fg: t.info,       Icon: Clock,         label: "Viewed" };
  if (s === "sent")    return { bg: t.warningSoft, fg: t.warning,    Icon: Clock,         label: "Sent" };
  return { bg: t.bgMuted, fg: t.textMuted, Icon: X, label: "Expired" };
}

export function CommunityReferrals() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Invite friends" subtitle="Section 11 · Community & Social" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.emerald[600], palette.emerald[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={[styles.giftBubble]}>
            <Gift size={22} color="#fff" />
          </View>
          <Text variant="display" weight="bold" align="center" style={{ color: "#fff", marginTop: space.md, fontSize: 28 }}>
            Refer friends, earn rewards
          </Text>
          <Text variant="bodySmall" align="center" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.xs }}>
            You both get rewarded when they join their first circle.
          </Text>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          {/* Code card */}
          <Card padded>
            <Text variant="caption" weight="bold" tone="muted" align="center" style={{ letterSpacing: 1.2 }}>
              YOUR REFERRAL CODE
            </Text>
            <View style={[styles.codeBox, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Text variant="display" weight="bold" align="center" style={{ letterSpacing: 4, fontFamily: "monospace", fontSize: 28, color: t.primary }}>
                {CODE}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
              <Pressable style={[styles.actionBtn, { backgroundColor: t.primary }]}>
                <Share2 size={16} color="#fff" />
                <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>Share</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, { backgroundColor: t.surface, borderColor: t.border, borderWidth: 1 }]}>
                <Copy size={16} color={t.textPrimary} />
                <Text variant="bodySmall" weight="bold">Copy</Text>
              </Pressable>
            </View>
          </Card>

          {/* Reward ladder */}
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              REWARD LADDER
            </Text>
            <Card padded={false}>
              {LADDER.map((l, i) => {
                const earned = INVITES_DONE >= l.invites;
                const Icon = l.Icon;
                return (
                  <View
                    key={l.invites}
                    style={[
                      styles.ladderRow,
                      i < LADDER.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                    ]}
                  >
                    <View style={[styles.ladderRank, { backgroundColor: earned ? t.successSoft : t.bgMuted, borderColor: earned ? t.success : t.border }]}>
                      <Text variant="bodySmall" weight="bold" style={{ color: earned ? t.success : t.textSecondary }}>
                        {l.invites}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" weight="semibold">
                        {l.invites === 1 ? "First join" : `${l.invites} joins`}
                      </Text>
                      <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                        Reward: {l.reward}
                      </Text>
                    </View>
                    {earned ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={14} color={t.success} />
                        <Text variant="micro" weight="bold" style={{ color: t.success }}>EARNED</Text>
                      </View>
                    ) : (
                      <Icon size={16} color={t.textMuted} />
                    )}
                  </View>
                );
              })}
            </Card>
          </View>

          {/* History */}
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>YOUR INVITES · {HISTORY.length}</Text>
              <Text variant="caption" weight="semibold" tone="accent">All</Text>
            </View>
            <Card padded={false}>
              {HISTORY.map((h, i) => {
                const v = statusVisual(h.status, t);
                return (
                  <View
                    key={h.id}
                    style={[
                      styles.historyRow,
                      i < HISTORY.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                    ]}
                  >
                    <View style={[styles.histIcon, { backgroundColor: v.bg }]}>
                      <v.Icon size={14} color={v.fg} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{h.to}</Text>
                      <Text variant="caption" tone="secondary">{h.at}</Text>
                    </View>
                    {h.reward ? (
                      <Text variant="caption" weight="bold" style={{ color: t.success }}>{h.reward}</Text>
                    ) : (
                      <View style={[styles.sPill, { backgroundColor: v.bg }]}>
                        <Text variant="micro" weight="bold" style={{ color: v.fg }}>{v.label}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </Card>
          </View>

          {/* Quick channels */}
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Pressable style={[styles.quickChip, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Mail size={14} color={t.primary} />
              <Text variant="caption" weight="semibold">Email</Text>
            </Pressable>
            <Pressable style={[styles.quickChip, { backgroundColor: t.surface, borderColor: t.border }]}>
              <MessageCircle size={14} color={t.primary} />
              <Text variant="caption" weight="semibold">SMS</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.xl, paddingHorizontal: space.lg, paddingBottom: space.xl, alignItems: "center" },
  giftBubble: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.18)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  codeBox: { padding: space.md, marginTop: space.md, borderRadius: radius.md, borderWidth: 1, borderStyle: "dashed" },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: radius.md },
  ladderRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md },
  ladderRank: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  historyRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md },
  histIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill },
  quickChip: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1 },
});
