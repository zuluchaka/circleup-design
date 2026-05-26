import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Sparkles, ShieldAlert, AlertOctagon, Info, ArrowRight, Clock } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius } from "@/theme";
import insights from "@/product/sections/10-ai-insights/data.json";

type InsightsData = typeof insights;

export function InsightsFeedEmpty() {
  return <InsightsFeed data={{ ...insights, feed: [] }} />;
}

export function InsightsFeed({
  data = insights,
}: { data?: InsightsData } = {}) {
  const t = useTheme();
  const isEmpty = data.feed.length === 0;

  if (isEmpty) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <AppHeader title="AI Insights" subtitle="Nothing new for you yet" />
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
          <Card padded bordered>
            <View style={{ alignItems: "center", paddingVertical: space.xl }}>
              <View style={[styles.emptyIcon, { backgroundColor: t.primarySoft }]}>
                <Sparkles size={28} color={t.primary} />
              </View>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                We need a bit more data
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm, lineHeight: 18, paddingHorizontal: space.md }}>
                Recommendations and risk alerts unlock once you've completed 3+ cycles. We surface only high-confidence signals — low-confidence ones stay hidden by default; you can opt in from Notification preferences.
              </Text>
              <View style={{ marginTop: space.lg, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Clock size={14} color={t.textMuted} />
                <Text variant="caption" tone="muted">Check back after your next payout.</Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="AI Insights" subtitle={`${data.feed.length} new · personalised for Amara`} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {data.feed.map((card) => {
          const kindMap = {
            Recommendation: { Icon: Sparkles, bg: t.primarySoft, fg: t.primary, tone: "primary" as const },
            Risk:           { Icon: ShieldAlert, bg: t.warningSoft, fg: t.warning, tone: "warning" as const },
            Fraud:          { Icon: AlertOctagon, bg: t.dangerSoft, fg: t.danger, tone: "danger" as const },
          } as const;
          const { Icon, bg, fg, tone } = kindMap[card.kind as keyof typeof kindMap];
          return (
            <Card key={card.id} padded>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.sm }}>
                <View style={[styles.iconBubble, { backgroundColor: bg }]}>
                  <Icon size={18} color={fg} />
                </View>
                <View style={{ flex: 1, marginLeft: space.sm }}>
                  <StatChip label={card.kind} tone={tone} compact />
                </View>
              </View>
              <Text variant="h3" weight="bold">{card.title}</Text>
              <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.xs }}>{card.body}</Text>

              <Pressable style={{ marginTop: space.md, flexDirection: "row", alignItems: "center" }}>
                <Info size={14} color={t.textMuted} />
                <Text variant="caption" tone="muted" style={{ marginLeft: 4 }}>
                  Why? Based on {card.dataInputs.join(", ")}.
                </Text>
              </Pressable>

              <View style={{ marginTop: space.md, alignSelf: "flex-start" }}>
                <Button
                  label={card.action.label}
                  variant={tone === "danger" ? "danger" : tone === "warning" ? "secondary" : "primary"}
                  trailingIcon={<ArrowRight size={14} color={tone === "warning" ? t.textPrimary : "#fff"} />}
                />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
