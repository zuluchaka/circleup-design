import { View, ScrollView, StyleSheet } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { ArrowDownRight, ArrowUpRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 96;
  const h = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <Svg width={w} height={h}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function TreasuryOverview() {
  const t = useTheme();
  const total = treasury.funds.reduce((s, f) => s + f.balance, 0);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Treasury" subtitle="Diaspora Circle Geneva" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <Card padded tone="primarySoft" bordered={false}>
          <Text variant="caption" tone="accent" weight="bold">TOTAL ACROSS FUNDS</Text>
          <Text variant="display" weight="bold" style={{ marginTop: space.xs }}>
            CHF {total.toLocaleString("de-CH")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: space.sm, gap: space.sm }}>
            <ArrowUpRight size={16} color={t.success} />
            <Text variant="bodySmall" tone="success" weight="semibold">+ CHF 480 this week</Text>
            <Text variant="bodySmall" tone="secondary">·  4 funds</Text>
          </View>
        </Card>

        {treasury.funds.map((fund) => {
          const last = fund.trend[fund.trend.length - 1];
          const prev = fund.trend[0];
          const delta = last - prev;
          const positive = delta >= 0;
          const accent =
            fund.kind === "emergency" ? t.warning :
            fund.kind === "welfare" ? t.success :
            fund.kind === "project" ? t.info :
            t.primary;
          return (
            <Card key={fund.id} padded>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" tone="muted" weight="semibold">{fund.kind.toUpperCase()}</Text>
                  <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>{fund.name}</Text>
                  <Text variant="h1" weight="bold" style={{ marginTop: space.xs }}>
                    {fund.currency} {fund.balance.toLocaleString("de-CH")}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: space.xs }}>
                    {positive ? (
                      <ArrowUpRight size={14} color={t.success} />
                    ) : (
                      <ArrowDownRight size={14} color={t.danger} />
                    )}
                    <Text variant="caption" weight="semibold" tone={positive ? "success" : "danger"} style={{ marginLeft: 4 }}>
                      {positive ? "+" : ""}{delta.toLocaleString("de-CH")} CHF · 30 d
                    </Text>
                  </View>
                </View>
                <Sparkline values={fund.trend} color={accent} />
              </View>
              {fund.kind === "emergency" ? (
                <View style={[styles.efBanner, { borderColor: t.warning, backgroundColor: t.warningSoft }]}>
                  <Text variant="caption" weight="semibold" tone="success" style={{ color: t.warning }}>
                    Auto-covers ROSCA defaults · 1% of every contribution
                  </Text>
                </View>
              ) : null}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  efBanner: {
    marginTop: space.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
});
