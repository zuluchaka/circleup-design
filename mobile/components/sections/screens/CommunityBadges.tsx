// Badges grid for /sections/community-and-social/badges.
// 3-col grid. Locked badges show silhouette + trigger condition.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Award, Trophy, ThumbsUp, Crown, UserPlus, Heart, Lock, Sparkles, CheckCircle2,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type Badge = {
  id: string;
  title: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  earned: boolean;
  criterion: string;
  progress?: number;
  accent: string;
};

const BADGES: Badge[] = [
  { id: "b_streak_12",    title: "12-Month Streak",  Icon: Trophy,   earned: true,  criterion: "12 on-time months in a row",                    accent: palette.amber[500] },
  { id: "b_first_payout", title: "First payout",     Icon: Award,    earned: true,  criterion: "Receive your first ROSCA payout",                accent: palette.emerald[500] },
  { id: "b_endorser",     title: "Endorser",         Icon: ThumbsUp, earned: true,  criterion: "Endorse 3 members",                              accent: palette.indigo[500] },
  { id: "b_circle_lead",  title: "Circle Leader",    Icon: Crown,    earned: false, criterion: "Run a circle for 12 months without defaults",   accent: palette.amber[500], progress: 67 },
  { id: "b_recruiter",    title: "Recruiter · 5",    Icon: UserPlus, earned: false, criterion: "Bring 5 members",                                accent: palette.indigo[500], progress: 40 },
  { id: "b_welfare_help", title: "Welfare champion", Icon: Heart,    earned: false, criterion: "Sign off 10 welfare approvals",                  accent: palette.rose[500], progress: 20 },
];

export function CommunityBadges() {
  const t = useTheme();
  const earnedCount = BADGES.filter((b) => b.earned).length;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Badges" subtitle="Section 11 · Community & Social" />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.amber[500], palette.amber[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={styles.heroIcon}>
              <Award size={18} color="#fff" />
            </View>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.2 }}>
              YOUR BADGES
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 44, marginTop: space.xs }}>
            {earnedCount} <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.75)" }}>/ {BADGES.length}</Text>
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.xs }}>
            3 to go — Welfare champion is closest at 2 of 10 approvals.
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.lg }}>
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              EARNED · {earnedCount}
            </Text>
            <View style={styles.grid}>
              {BADGES.filter((b) => b.earned).map((b) => (
                <BadgeCard key={b.id} b={b} t={t} />
              ))}
            </View>
          </View>

          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              LOCKED · {BADGES.length - earnedCount}
            </Text>
            <View style={styles.grid}>
              {BADGES.filter((b) => !b.earned).map((b) => (
                <BadgeCard key={b.id} b={b} t={t} />
              ))}
            </View>
          </View>

          <View style={[styles.tip, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
            <Sparkles size={16} color={t.primary} />
            <Text variant="caption" style={{ color: t.textPrimary, flex: 1, lineHeight: 16 }}>
              Earning a badge bumps your Trust Score's "Tenure & engagement" factor. Public on your profile by default — adjustable in Privacy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function BadgeCard({ b, t }: { b: Badge; t: any }) {
  const Icon = b.Icon;
  return (
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: b.earned ? b.accent : t.border, opacity: b.earned ? 1 : 0.95 }]}>
      <View style={[styles.medal, { backgroundColor: b.earned ? `${b.accent}22` : t.bgMuted, borderColor: b.earned ? b.accent : t.border }]}>
        {b.earned ? (
          <Icon size={28} color={b.accent} />
        ) : (
          <>
            <Icon size={28} color={t.textMuted} />
            <View style={[styles.lockBadge, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Lock size={10} color={t.textMuted} />
            </View>
          </>
        )}
      </View>
      <Text variant="bodySmall" weight="bold" align="center" numberOfLines={1} style={{ color: b.earned ? t.textPrimary : t.textSecondary }}>
        {b.title}
      </Text>
      <Text variant="micro" tone="muted" align="center" numberOfLines={2} style={{ minHeight: 28 }}>
        {b.criterion}
      </Text>
      {b.earned ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <CheckCircle2 size={11} color={t.success} />
          <Text variant="micro" weight="bold" style={{ color: t.success }}>EARNED</Text>
        </View>
      ) : (
        <View style={{ width: "100%", gap: 2 }}>
          <ProgressBar value={b.progress ?? 0} tone="primary" />
          <Text variant="micro" tone="muted" align="center">{b.progress ?? 0}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.xl, paddingHorizontal: space.lg, paddingBottom: space.xl },
  heroIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  card: {
    flexBasis: "31%",
    flexGrow: 1,
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  medal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  lockBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
