// Circle health dashboard for /sections/analytics-and-reporting/circle-health.
// Treasurer-facing: collection rate, default risk, attendance, welfare uptake +
// at-risk members drilldown.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import Svg, { Polyline, Line } from "react-native-svg";
import {
  TrendingUp, TrendingDown, Minus, AlertCircle, MessageCircle, ChevronRight,
  Activity, Users, Banknote, Heart,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const CIRCLE = "Main CHF Circle";
const TILES = [
  { id: "collected",  label: "Collection rate",  value: "94%", trend: "up"   as const, tone: "success" as const, Icon: Activity },
  { id: "risk",       label: "Default risk",     value: "2",   trend: "down" as const, tone: "warning" as const, Icon: AlertCircle },
  { id: "attendance", label: "Event attendance", value: "91%", trend: "flat" as const, tone: "info"    as const, Icon: Users },
  { id: "welfare",    label: "Welfare uptake",   value: "14%", trend: "up"   as const, tone: "primary" as const, Icon: Heart },
];

const COLLECTION_SERIES = [88, 91, 92, 90, 93, 95, 94, 96, 94, 92, 95, 94];

const AT_RISK = [
  { name: "Linh Pham",     trust: 615, reason: "3 days late · prior 2 missed", confidence: 84 },
  { name: "Chinedu Okoye", trust: 558, reason: "Predicted late · 78%",          confidence: 78 },
];

export function AnalyticsCircleHealth() {
  const t = useTheme();

  const tones = {
    success: { fg: t.success, bg: t.successSoft },
    warning: { fg: t.warning, bg: t.warningSoft },
    info:    { fg: t.info,    bg: t.infoSoft    },
    primary: { fg: t.primary, bg: t.primarySoft },
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Circle health" subtitle={CIRCLE} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {/* KPI tiles */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
          {TILES.map((tile) => {
            const Icon = tile.Icon;
            const tone = tones[tile.tone];
            const TrendIcon = tile.trend === "up" ? TrendingUp : tile.trend === "down" ? TrendingDown : Minus;
            const trendColor = tile.trend === "up" ? t.success : tile.trend === "down" ? t.danger : t.textMuted;
            return (
              <View key={tile.id} style={[styles.tile, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={[styles.tileIcon, { backgroundColor: tone.bg }]}>
                    <Icon size={16} color={tone.fg} />
                  </View>
                  <TrendIcon size={14} color={trendColor} />
                </View>
                <Text variant="display" weight="bold" style={{ marginTop: space.sm, fontSize: 32 }}>{tile.value}</Text>
                <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.4 }}>{tile.label.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>

        {/* Sparkline chart */}
        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: space.sm }}>
            <View>
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8 }}>COLLECTION · LAST 12 CYCLES</Text>
              <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>94%</Text>
              <Text variant="caption" tone="success" weight="semibold">+2 pts vs prior 6</Text>
            </View>
          </View>
          <Sparkline data={COLLECTION_SERIES} t={t} />
          <View style={[styles.legendRow, { borderTopColor: t.border }]}>
            <View style={{ alignItems: "center", gap: 2 }}>
              <Text variant="micro" tone="muted">PEAK</Text>
              <Text variant="bodySmall" weight="bold" style={{ color: t.success }}>96%</Text>
            </View>
            <View style={{ alignItems: "center", gap: 2 }}>
              <Text variant="micro" tone="muted">TROUGH</Text>
              <Text variant="bodySmall" weight="bold" style={{ color: t.warning }}>88%</Text>
            </View>
            <View style={{ alignItems: "center", gap: 2 }}>
              <Text variant="micro" tone="muted">AVG</Text>
              <Text variant="bodySmall" weight="bold">93%</Text>
            </View>
          </View>
        </Card>

        {/* At-risk drilldown */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>AT-RISK MEMBERS</Text>
            <Text variant="caption" weight="semibold" tone="accent">All 2</Text>
          </View>
          <View style={{ gap: space.sm }}>
            {AT_RISK.map((m) => (
              <Card key={m.name} padded>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                  <View style={[styles.riskBubble, { backgroundColor: t.warningSoft }]}>
                    <AlertCircle size={18} color={t.warning} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
                      <Text variant="bodySmall" weight="semibold">{m.name}</Text>
                      <TrustScoreBadge score={m.trust} compact />
                    </View>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{m.reason}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text variant="caption" weight="bold" style={{ color: t.warning }}>{m.confidence}%</Text>
                    <Text variant="micro" tone="muted">confidence</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
                  <Pressable style={[styles.outreachBtn, { backgroundColor: t.primary, flex: 1 }]}>
                    <MessageCircle size={14} color="#fff" />
                    <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Friendly outreach</Text>
                  </Pressable>
                  <Pressable style={[styles.outreachBtn, { backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, flex: 1 }]}>
                    <Text variant="caption" weight="semibold">Open thread</Text>
                    <ChevronRight size={12} color={t.textPrimary} />
                  </Pressable>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Welfare uptake */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={[styles.welfareIcon, { backgroundColor: t.primarySoft }]}>
              <Heart size={20} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8 }}>WELFARE UPTAKE</Text>
              <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>14%</Text>
              <Text variant="caption" tone="secondary">3 of 22 members drew aid this cycle</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <TrendingUp size={12} color={t.success} />
                <Text variant="caption" weight="bold" style={{ color: t.success }}>+4 pts</Text>
              </View>
              <Text variant="micro" tone="muted">vs Q4</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function Sparkline({ data, t }: { data: number[]; t: any }) {
  const w = 300;
  const h = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  return (
    <View style={{ alignItems: "center", marginTop: space.sm }}>
      <Svg width={w} height={h}>
        <Line x1={0} y1={h - 4} x2={w} y2={h - 4} stroke={t.border} strokeWidth={1} />
        <Polyline points={pts} stroke={t.primary} strokeWidth={2} fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: space.md,
    marginTop: space.sm,
    borderTopWidth: 1,
  },
  riskBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  outreachBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  welfareIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
