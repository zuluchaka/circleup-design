// Elections list + candidate detail for /sections/governance-and-voting/elections.
// Active 2026 Treasurer race with 3 candidates: pitch, trust, endorsements, vote CTA.

import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Crown, Trophy, Calendar, Users, ThumbsUp, Star, ChevronRight, History,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const ELECTION = {
  id: "elec_treasurer_2026",
  seat: "Treasurer · 2026/27",
  endsAt: "2026-05-21",
  totalVoters: 138,
  votesCast: 87,
  candidates: [
    { id: "c_amara",  name: "Amara Ofori",   trust: 824, endorsements: 18, votes: 52, pct: 59.8, pitch: "Three years as Treasurer. Clean audits. Plans to onboard predictive analytics from Section 8 to anticipate cash needs.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop" },
    { id: "c_mariam", name: "Mariam Rahimi", trust: 802, endorsements: 11, votes: 24, pct: 27.6, pitch: "Auditor for two years. Will modernise the welfare approval workflow and tighten reconciliation.", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    { id: "c_ngozi",  name: "Ngozi Okafor",  trust: 731, endorsements:  6, votes: 11, pct: 12.6, pitch: "Organiser background. Will push for English/French parity on all communications.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
  ],
};

const PAST = [
  { seat: "President 2026/27", winner: "Kofi Mensah",   margin: "62 → 41", endsAt: "2026-02-14", outcome: "Decided" },
  { seat: "Secretary 2026/27", winner: "Zara Bekele",   margin: "78 → 24", endsAt: "2026-01-19", outcome: "Decided" },
  { seat: "Auditor 2025/26",   winner: "Mariam Rahimi", margin: "Tied · runoff Apr 5", endsAt: "2025-03-30", outcome: "Tied — runoff" },
];

export function GovernanceElections() {
  const t = useTheme();
  const daysLeft = Math.max(0, Math.ceil((new Date(ELECTION.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const turnout = Math.round((ELECTION.votesCast / ELECTION.totalVoters) * 100);
  const leader = ELECTION.candidates[0];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Elections" subtitle="Section 05 · Governance & Voting" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <Crown size={16} color={palette.amber[300]} />
            <Text variant="micro" weight="bold" style={{ color: palette.amber[300], letterSpacing: 1.2 }}>
              ACTIVE ELECTION
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xs, fontSize: 32 }}>
            {ELECTION.seat}
          </Text>

          <View style={{ flexDirection: "row", gap: space.lg, marginTop: space.lg }}>
            <View style={{ gap: 2 }}>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>ENDS IN</Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{daysLeft}d</Text>
            </View>
            <View style={{ gap: 2 }}>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>TURNOUT</Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{turnout}%</Text>
            </View>
            <View style={{ gap: 2 }}>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>VOTES CAST</Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{ELECTION.votesCast}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>
            CANDIDATES · {ELECTION.candidates.length}
          </Text>

          {ELECTION.candidates.map((c, i) => {
            const isLeader = c.id === leader.id;
            return (
              <View
                key={c.id}
                style={[
                  styles.candidate,
                  {
                    backgroundColor: t.surface,
                    borderColor: isLeader ? t.primary : t.border,
                    borderWidth: isLeader ? 2 : 1,
                  },
                ]}
              >
                {isLeader ? (
                  <View style={[styles.leaderBadge, { backgroundColor: t.primary }]}>
                    <Trophy size={11} color="#fff" />
                    <Text variant="micro" weight="bold" style={{ color: "#fff" }}>LEADING</Text>
                  </View>
                ) : null}
                <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
                  <Image source={{ uri: c.avatar }} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text variant="h3" weight="bold" numberOfLines={1}>{c.name}</Text>
                    <View style={{ flexDirection: "row", gap: space.md, marginTop: 2 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Star size={11} color={palette.amber[400]} fill={palette.amber[400]} />
                        <Text variant="caption" tone="secondary">{c.trust}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <ThumbsUp size={11} color={t.success} />
                        <Text variant="caption" tone="secondary">{c.endorsements} endorsements</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text variant="h2" weight="bold" style={{ color: t.primary }}>{c.pct.toFixed(0)}%</Text>
                    <Text variant="micro" tone="muted">{c.votes} votes</Text>
                  </View>
                </View>
                <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.md, lineHeight: 18 }}>
                  "{c.pitch}"
                </Text>
                <View style={{ marginTop: space.md }}>
                  <View style={[styles.bar, { backgroundColor: t.bgMuted }]}>
                    <View style={{ width: `${c.pct}%`, height: "100%", backgroundColor: isLeader ? t.primary : palette.indigo[400], borderRadius: 3 }} />
                  </View>
                </View>
              </View>
            );
          })}

          <Button label="Cast your ballot" size="lg" fullWidth trailingIcon={<ChevronRight size={16} color="#fff" />} />

          {/* Past elections */}
          <View style={{ marginTop: space.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
              <History size={14} color={t.textMuted} />
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>PAST ELECTIONS · 12 MONTHS</Text>
            </View>
            <Card padded={false}>
              {PAST.map((p, i) => (
                <View
                  key={p.seat}
                  style={[
                    styles.pastRow,
                    i < PAST.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={[styles.crownBubble, { backgroundColor: t.warningSoft }]}>
                    <Crown size={14} color={t.warning} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{p.seat}</Text>
                    <Text variant="caption" tone="secondary" numberOfLines={1}>{p.winner} · {p.margin}</Text>
                  </View>
                  <Text variant="micro" tone="muted">{new Date(p.endsAt).toLocaleDateString("en-CH", { month: "short", year: "2-digit" })}</Text>
                </View>
              ))}
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: space.xl,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  candidate: {
    padding: space.lg,
    borderRadius: radius.lg,
    position: "relative",
  },
  leaderBadge: {
    position: "absolute",
    top: -10,
    right: space.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.slate[300],
  },
  bar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  pastRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  crownBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
