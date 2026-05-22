import { View, ScrollView, StyleSheet } from "react-native";
import Svg, { Polyline, Circle as SvgCircle, Line, Rect } from "react-native-svg";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Trophy,
  ShieldAlert,
  Download,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Trend = "up" | "down" | "flat";

type Metric = {
  id: string;
  label: string;
  value: string;
  benchmark: string;
  trend: Trend;
  delta: string;
  toneHint: "good" | "bad" | "neutral";
};

type Reliability = {
  memberId: string;
  name: string;
  trust: number;
  onTimeRate: number;
  missedCycles: number;
  direction: Trend;
};

type MonthlyPoint = { month: string; collectionRate: number; onTimeRate: number };

function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "long", year: "numeric" });
}

function trendIcon(trend: Trend) {
  return trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
}

function toneColor(tone: "good" | "bad" | "neutral", t: AppTheme) {
  if (tone === "good") return t.success;
  if (tone === "bad") return t.danger;
  return t.textSecondary;
}

// ---------------------------------------------------------------------------
// Trend sparkline
// ---------------------------------------------------------------------------

function Sparkline({ points, w = 280, h = 120, t }: { points: MonthlyPoint[]; w?: number; h?: number; t: AppTheme }) {
  const padding = 14;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const stepX = innerW / Math.max(1, points.length - 1);
  const minY = 0.7;
  const maxY = 1.0;
  const yOf = (v: number) => padding + innerH - ((v - minY) / (maxY - minY)) * innerH;
  const xOf = (i: number) => padding + i * stepX;

  const colPoints = points.map((p, i) => `${xOf(i)},${yOf(p.collectionRate)}`).join(" ");
  const onTimePoints = points.map((p, i) => `${xOf(i)},${yOf(p.onTimeRate)}`).join(" ");

  return (
    <View>
      <Svg width={w} height={h}>
        {/* Gridlines */}
        {[0.75, 0.85, 0.95].map((g) => (
          <Line
            key={g}
            x1={padding}
            x2={padding + innerW}
            y1={yOf(g)}
            y2={yOf(g)}
            stroke={t.bgMuted}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {/* On-time line */}
        <Polyline points={onTimePoints} fill="none" stroke={t.warning} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {/* Collection line */}
        <Polyline points={colPoints} fill="none" stroke={t.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* Endpoints */}
        {points.map((p, i) => (
          <SvgCircle key={`c-${i}`} cx={xOf(i)} cy={yOf(p.collectionRate)} r={3} fill={t.primary} />
        ))}
      </Svg>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: padding }}>
        {points.map((p) => (
          <Text key={p.month} variant="micro" tone="muted" weight="semibold">{p.month}</Text>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaAnalytics() {
  const t = useTheme();
  const data = rosca.analytics as {
    cycle: number;
    projectedCompletion: string;
    metrics: Metric[];
    monthlyTrend: MonthlyPoint[];
    topReliable: Reliability[];
    watchList: Reliability[];
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Circle analytics"
        subtitle={`Cycle ${data.cycle} · Main CHF Circle`}
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Download size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header context */}
        <View style={[styles.context, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={{ flex: 1 }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
              PROJECTED COMPLETION
            </Text>
            <Text variant="h3" weight="bold" style={{ marginTop: 2 }}>{fullDate(data.projectedCompletion)}</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
              On schedule · 4 cycles remaining
            </Text>
          </View>
          <Calendar size={20} color={t.textMuted} />
        </View>

        {/* Metrics grid */}
        <View style={styles.metricsGrid}>
          {data.metrics.map((m) => (
            <MetricTile key={m.id} metric={m} t={t} />
          ))}
        </View>

        {/* Trend chart */}
        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              MONTHLY TREND
            </Text>
            <View style={{ flexDirection: "row", gap: space.md }}>
              <LegendDot color={t.primary} label="Collection" />
              <LegendDot color={t.warning} label="On-time" />
            </View>
          </View>
          <Sparkline points={data.monthlyTrend} t={t} />
        </Card>

        {/* Benchmark bars */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            BENCHMARK VS PEERS
          </Text>
          {data.metrics.slice(0, 2).map((m) => (
            <BenchmarkBar key={m.id} metric={m} t={t} />
          ))}
        </Card>

        {/* Reliability lists */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Trophy size={14} color={t.success} />
              <Text variant="h3" weight="bold">Top reliable</Text>
            </View>
            <Text variant="caption" tone="secondary">{data.topReliable.length} members</Text>
          </View>
          <Card padded={false}>
            {data.topReliable.map((r, i) => (
              <ReliabilityRow key={r.memberId} r={r} t={t} last={i === data.topReliable.length - 1} />
            ))}
          </Card>
        </View>

        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <ShieldAlert size={14} color={t.danger} />
              <Text variant="h3" weight="bold">Watch list</Text>
            </View>
            <Text variant="caption" tone="secondary">{data.watchList.length} members</Text>
          </View>
          <Card padded={false}>
            {data.watchList.map((r, i) => (
              <ReliabilityRow key={r.memberId} r={r} t={t} last={i === data.watchList.length - 1} highlight />
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function MetricTile({ metric, t }: { metric: Metric; t: AppTheme }) {
  const TrendIcon = trendIcon(metric.trend);
  const color = toneColor(metric.toneHint, t);
  return (
    <View style={[styles.metric, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
          {metric.label.toUpperCase()}
        </Text>
        <View style={[styles.trendPill, { backgroundColor: `${color}22` }]}>
          <TrendIcon size={10} color={color} />
        </View>
      </View>
      <Text variant="h1" weight="bold" style={{ marginTop: space.xs }}>{metric.value}</Text>
      <Text variant="micro" weight="semibold" style={{ color, marginTop: 2 }}>{metric.delta}</Text>
      <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{metric.benchmark}</Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text variant="micro" tone="secondary" weight="semibold">{label}</Text>
    </View>
  );
}

function BenchmarkBar({ metric, t }: { metric: Metric; t: AppTheme }) {
  const valueNum = parseInt(metric.value.replace(/[^0-9]/g, ""), 10);
  const benchmarkNum = parseInt(metric.benchmark.replace(/[^0-9]/g, ""), 10);
  const max = Math.max(valueNum, benchmarkNum, 100);
  const valuePct = valueNum / max;
  const benchPct = benchmarkNum / max;

  return (
    <View style={{ marginBottom: space.md }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <Text variant="caption" weight="semibold">{metric.label}</Text>
        <Text variant="caption" weight="bold">{metric.value}</Text>
      </View>
      <View style={[styles.benchTrack, { backgroundColor: t.bgMuted }]}>
        <Svg width="100%" height={14}>
          <Rect x="0" y={2} width={`${valuePct * 100}%`} height={10} rx={5} fill={t.primary} />
          <Line
            x1={`${benchPct * 100}%`}
            x2={`${benchPct * 100}%`}
            y1={0}
            y2={14}
            stroke={t.warning}
            strokeWidth={2.5}
          />
        </Svg>
      </View>
      <Text variant="micro" tone="muted" style={{ marginTop: 2 }}>{metric.benchmark}</Text>
    </View>
  );
}

function ReliabilityRow({ r, t, last, highlight }: { r: Reliability; t: AppTheme; last: boolean; highlight?: boolean }) {
  const DirIcon = trendIcon(r.direction);
  const dirColor = r.direction === "up" ? t.success : r.direction === "down" ? t.danger : t.textSecondary;
  return (
    <View style={[styles.relRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Avatar name={r.name} size="sm" />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="caption" weight="bold">{r.name}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{r.trust}</Text>
          </View>
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          On-time {Math.round(r.onTimeRate * 100)}% · {r.missedCycles} missed
        </Text>
      </View>
      <View style={[styles.dirPill, { backgroundColor: `${dirColor}22` }]}>
        <DirIcon size={10} color={dirColor} />
        {highlight ? (
          <Text variant="micro" weight="bold" style={{ color: dirColor, letterSpacing: 0.5 }}>
            {r.direction.toUpperCase()}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  context: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  metric: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  trendPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  benchTrack: {
    height: 14,
    borderRadius: 7,
    overflow: "hidden",
  },
  relRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  dirPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
});
