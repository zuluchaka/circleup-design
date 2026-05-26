import { View, ScrollView, StyleSheet } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { ArrowUpRight, Download, LineChart, ArrowRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import analytics from "@/product/sections/08-analytics-and-reporting/data.json";

type AnalyticsData = typeof analytics;

const EMPTY_DATA: AnalyticsData = {
  ...analytics,
  personal: {
    ...analytics.personal,
    savedYtd: 0,
    streakMonths: 0,
    monthlySeries: [],
  },
};

export function AnalyticsPersonalEmpty() {
  return <AnalyticsPersonal data={EMPTY_DATA} />;
}

export function AnalyticsPersonal({
  data = analytics,
}: { data?: AnalyticsData } = {}) {
  const t = useTheme();
  const p = data.personal;
  const isEmpty = p.monthlySeries.length === 0;

  if (isEmpty) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <AppHeader title="My progress" subtitle="Come back after your first contribution" />
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
          <Card padded bordered>
            <View style={{ alignItems: "center", paddingVertical: space.xl }}>
              <View style={[styles.emptyIcon, { backgroundColor: t.primarySoft }]}>
                <LineChart size={28} color={t.primary} />
              </View>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                No data to chart yet
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm, lineHeight: 18, paddingHorizontal: space.md }}>
                Your savings, contribution streak, trust trend, and next-payout countdown will appear here after your first cycle completes. Join a circle to get started.
              </Text>
              <View style={{ marginTop: space.lg, width: "100%" }}>
                <Button label="Browse circles" trailingIcon={<ArrowRight size={16} color="#fff" />} fullWidth />
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  const min = Math.min(...p.monthlySeries);
  const max = Math.max(...p.monthlySeries);
  const range = max - min || 1;
  const w = 320;
  const h = 80;
  const pts = p.monthlySeries
    .map((v, i) => {
      const x = (i / (p.monthlySeries.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="My progress" subtitle="Personal dashboard" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <Card padded tone="primarySoft" bordered={false}>
          <Text variant="caption" tone="accent" weight="bold">SAVED YEAR-TO-DATE</Text>
          <Text variant="display" weight="bold" style={{ marginTop: space.xs }}>
            CHF {p.savedYtd.toLocaleString("de-CH")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: space.xs, gap: space.sm }}>
            <ArrowUpRight size={16} color={t.success} />
            <Text variant="bodySmall" tone="success" weight="semibold">{p.streakMonths}-month streak · no misses</Text>
          </View>
        </Card>

        <Card padded>
          <Text variant="caption" tone="muted" weight="semibold">CONTRIBUTIONS · LAST 12 MONTHS</Text>
          <View style={{ marginTop: space.sm, alignItems: "center" }}>
            <Svg width={w} height={h}>
              <Polyline points={pts} stroke={t.primary} strokeWidth={2} fill="none" />
            </Svg>
          </View>
          <Text variant="caption" tone="muted" align="center" style={{ marginTop: space.xs }}>
            Steady CHF 200/month across {p.monthlySeries.length} months.
          </Text>
        </Card>

        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold" style={{ flex: 1 }}>Trust trend</Text>
            <TrustScoreBadge score={p.trust.current} compact />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <ArrowUpRight size={16} color={t.success} />
            <Text variant="bodySmall" tone="success" weight="semibold">+{p.trust.delta90d} pts in 90 days</Text>
          </View>
        </Card>

        <Card padded>
          <Text variant="caption" tone="muted" weight="semibold">NEXT PAYOUT</Text>
          <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>
            CHF {p.nextPayout.amount.toLocaleString("de-CH")}
          </Text>
          <Text variant="bodySmall" tone="secondary">
            {new Date(p.nextPayout.date).toLocaleDateString("en-CH", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </Text>
        </Card>

        <View>
          <Button
            label="Download statement (PDF)"
            variant="secondary"
            leadingIcon={<Download size={16} color={t.textPrimary} />}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
