// Community activity feed for /sections/community-and-social/feed.
// Member chip + verb sentence per spec. Kudos, milestones, joins.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  Award, Trophy, UserPlus, ThumbsUp, MessageCircle, Heart, Sparkles, Filter,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type FeedKind = "badge" | "streak" | "join" | "endorsement" | "payout";

const FEED: { id: string; kind: FeedKind; actor: string; verb: string; object: string; at: string; reactions?: number; comments?: number }[] = [
  { id: "fd_5", kind: "payout",      actor: "Kofi Mensah",     verb: "received", object: "his August payout · CHF 1,800",                 at: "Just now",  reactions: 14, comments: 3 },
  { id: "fd_1", kind: "badge",       actor: "Mariam Rahimi",   verb: "earned",   object: "5-Year tenure badge",                            at: "Today",     reactions: 22, comments: 5 },
  { id: "fd_2", kind: "streak",      actor: "Zara Bekele",     verb: "completed", object: "12-Month streak · no missed contributions",    at: "Yesterday", reactions: 18, comments: 2 },
  { id: "fd_3", kind: "join",        actor: "Olusegun Adebayo", verb: "joined",   object: "Diaspora Circle Geneva",                        at: "2d ago",    reactions:  9 },
  { id: "fd_4", kind: "endorsement", actor: "Aïssatou Dembélé", verb: "endorsed", object: "Linh Pham",                                      at: "4d ago",    reactions: 11, comments: 1 },
  { id: "fd_6", kind: "badge",       actor: "Selam Haile",     verb: "earned",   object: "First Payout badge",                             at: "5d ago",    reactions:  7 },
];

const FILTERS = ["All", "Badges", "Streaks", "Welfare", "Joins"];

function kindVisual(k: FeedKind, t: any) {
  switch (k) {
    case "badge":       return { Icon: Award,        bg: t.warningSoft, fg: t.warning };
    case "streak":      return { Icon: Trophy,       bg: t.successSoft, fg: t.success };
    case "join":        return { Icon: UserPlus,     bg: t.primarySoft, fg: t.primary };
    case "endorsement": return { Icon: ThumbsUp,     bg: t.primarySoft, fg: t.primary };
    case "payout":      return { Icon: Sparkles,     bg: t.infoSoft,    fg: t.info };
  }
}

export function CommunityFeed() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Community" subtitle="Activity from your associations" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f, i) => (
          <View
            key={f}
            style={[
              styles.filterChip,
              { backgroundColor: i === 0 ? t.primary : t.surface, borderColor: i === 0 ? t.primary : t.border },
            ]}
          >
            <Text variant="caption" weight="semibold" style={{ color: i === 0 ? "#fff" : t.textSecondary }}>{f}</Text>
          </View>
        ))}
        <View style={[styles.filterChip, { backgroundColor: t.surface, borderColor: t.border, flexDirection: "row", alignItems: "center", gap: 4 }]}>
          <Filter size={11} color={t.textSecondary} />
          <Text variant="caption" weight="semibold" tone="secondary">More</Text>
        </View>
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.sm }}>
        {FEED.map((item) => {
          const v = kindVisual(item.kind, t);
          const VIcon = v.Icon;
          return (
            <Card key={item.id} padded>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.md }}>
                <View style={{ position: "relative" }}>
                  <Avatar name={item.actor} size="md" />
                  <View style={[styles.kindBadge, { backgroundColor: v.bg, borderColor: t.surface }]}>
                    <VIcon size={10} color={v.fg} />
                  </View>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="bodySmall" style={{ lineHeight: 20 }}>
                    <Text variant="bodySmall" weight="bold">{item.actor}</Text>
                    <Text variant="bodySmall" tone="secondary"> {item.verb} </Text>
                    <Text variant="bodySmall" weight="semibold">{item.object}</Text>
                  </Text>
                  <Text variant="micro" tone="muted">{item.at}</Text>
                  {(item.reactions || item.comments) ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.xs }}>
                      {item.reactions ? (
                        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Heart size={13} color={t.danger} />
                          <Text variant="caption" weight="semibold" tone="secondary">{item.reactions}</Text>
                        </Pressable>
                      ) : null}
                      {item.comments ? (
                        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <MessageCircle size={13} color={t.textMuted} />
                          <Text variant="caption" weight="semibold" tone="secondary">{item.comments}</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { paddingHorizontal: space.lg, paddingVertical: space.sm, gap: space.sm },
  filterChip: { paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1 },
  kindBadge: { position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
