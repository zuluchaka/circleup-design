import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Sparkles, ShieldAlert, AlertOctagon, Info, ArrowRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius } from "@/theme";
import insights from "@/product/sections/10-ai-insights/data.json";

export function InsightsFeed() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="AI Insights" subtitle="3 new · personalised for Amara" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {insights.feed.map((card) => {
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
});
