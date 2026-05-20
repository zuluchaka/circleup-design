import { View, ScrollView, StyleSheet } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { ArrowUpRight, Download } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import analytics from "@/product/sections/08-analytics-and-reporting/data.json";

export function AnalyticsPersonal() {
  const t = useTheme();
  const p = analytics.personal;
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

const styles = StyleSheet.create({});
