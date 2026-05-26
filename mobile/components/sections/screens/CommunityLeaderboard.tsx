// Opt-in leaderboard for /sections/community-and-social/leaderboard.
// Top 10 by selected metric, anonymised-name toggle, current user's rank.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Trophy, EyeOff, ShieldCheck, ChevronDown, Award, TrendingUp,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const METRICS = ["On-time months", "Total saved", "Endorsements", "Cycles completed"];

const ENTRIES = [
  { rank: 1, name: "Mariam Rahimi",  value: 58, isYou: false },
  { rank: 2, name: "Kofi Mensah",    value: 54, isYou: false },
  { rank: 3, name: "Amara Ofori",    value: 53, isYou: true  },
  { rank: 4, name: "Zara Bekele",    value: 48, isYou: false },
  { rank: 5, name: "Ngozi Okafor",   value: 42, isYou: false },
  { rank: 6, name: "Selam Haile",    value: 31, isYou: false },
  { rank: 7, name: "Aïssatou D.",    value: 28, isYou: false },
  { rank: 8, name: "Linh Pham",      value: 22, isYou: false },
  { rank: 9, name: "Chinedu Okoye",  value: 17, isYou: false },
  { rank: 10, name: "João da Silva", value: 0,  isYou: false },
];

function maskName(name: string) {
  return name.split(" ").map((w) => w[0] + "…").join(" ");
}

function medalColor(rank: number, t: any) {
  if (rank === 1) return palette.amber[500];
  if (rank === 2) return palette.slate[400];
  if (rank === 3) return palette.amber[700];
  return t.bgMuted;
}

export function CommunityLeaderboard() {
  const t = useTheme();
  const [metric, setMetric] = useState(METRICS[0]);
  const [anonymous, setAnonymous] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Leaderboard" subtitle="Section 11 · Community & Social" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <Trophy size={16} color={palette.amber[300]} />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.2 }}>
              YOU'RE RANKED
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 48, marginTop: space.xs }}>#3</Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)" }}>
            of 10 on the {metric} board · within 5 of #1
          </Text>

          <Pressable style={[styles.metricChip, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{metric}</Text>
            <ChevronDown size={12} color="#fff" />
          </Pressable>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
          {/* Anonymous toggle */}
          <View style={[styles.privacyRow, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={[styles.privIcon, { backgroundColor: anonymous ? t.primary : t.bgMuted }]}>
              <EyeOff size={14} color={anonymous ? "#fff" : t.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="semibold">Show anonymised names</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                Members appear as "A. O." instead of "Amara Ofori".
              </Text>
            </View>
            <Switch value={anonymous} onValueChange={setAnonymous} />
          </View>

          {/* Podium top 3 */}
          <View style={styles.podium}>
            {[ENTRIES[1], ENTRIES[0], ENTRIES[2]].map((e, i) => {
              const heightMap = [110, 140, 90];
              const order = [2, 1, 3];
              const color = medalColor(e.rank, t);
              return (
                <View key={e.rank} style={{ flex: 1, alignItems: "center" }}>
                  <Avatar name={e.name} size="lg" />
                  <Text variant="caption" weight="bold" align="center" numberOfLines={1} style={{ marginTop: 4 }}>
                    {anonymous ? maskName(e.name) : e.name}
                  </Text>
                  <Text variant="micro" tone="secondary">{e.value}</Text>
                  <View
                    style={[
                      styles.podiumBlock,
                      { backgroundColor: color, height: heightMap[i] },
                    ]}
                  >
                    <Text variant="h2" weight="bold" style={{ color: "#fff" }}>#{e.rank}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Rest of list */}
          <Card padded={false}>
            {ENTRIES.slice(3).map((e, i) => (
              <View
                key={e.rank}
                style={[
                  styles.row,
                  e.isYou && { backgroundColor: t.primarySoft },
                  i < ENTRIES.length - 4 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <Text variant="bodySmall" weight="bold" tone="muted" style={{ width: 28 }}>#{e.rank}</Text>
                <Avatar name={e.name} size="md" />
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight={e.isYou ? "bold" : "semibold"}>
                    {anonymous ? maskName(e.name) : e.name}
                    {e.isYou ? <Text variant="bodySmall" weight="bold" tone="accent">  · you</Text> : null}
                  </Text>
                </View>
                <Text variant="bodySmall" weight="bold">{e.value}</Text>
              </View>
            ))}
          </Card>

          <View style={[styles.disclosure, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
            <ShieldCheck size={14} color={t.info} />
            <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 16 }}>
              Leaderboards are opt-in. You can leave anytime from Settings · Privacy. Trust Scores and contribution amounts are never on a leaderboard.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.xl, paddingHorizontal: space.lg, paddingBottom: space.xl },
  metricChip: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", marginTop: space.sm, paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  privacyRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: 1 },
  privIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  podium: { flexDirection: "row", alignItems: "flex-end", gap: space.sm, marginTop: space.md },
  podiumBlock: { width: "100%", marginTop: space.sm, borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md },
  disclosure: { flexDirection: "row", alignItems: "flex-start", gap: 6, padding: space.md, borderRadius: radius.md, borderWidth: 1 },
});
