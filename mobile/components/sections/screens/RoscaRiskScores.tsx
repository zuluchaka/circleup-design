import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Band = "low" | "medium" | "high";

type Factor = {
  id: string;
  label: string;
  weight: number;
  contribution: number;
  signal: "positive" | "negative" | "neutral";
};

type Score = {
  memberId: string;
  name: string;
  trust: number;
  score: number;
  band: Band;
  recommendation: string;
  factors: Factor[];
};

type Filter = "all" | "high" | "medium" | "low";

function bandMeta(band: Band, t: AppTheme) {
  if (band === "high") return { color: t.danger, bg: t.dangerSoft, label: "HIGH RISK" };
  if (band === "medium") return { color: t.warning, bg: t.warningSoft, label: "MEDIUM" };
  return { color: t.success, bg: t.successSoft, label: "LOW" };
}

function RiskGauge({ score, color, t, size = 64, thickness = 7 }: { score: number; color: string; t: AppTheme; size?: number; thickness?: number }) {
  const value = Math.min(1, score / 100);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = value * c;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <SvgCircle cx={size / 2} cy={size / 2} r={r} stroke={t.bgMuted} strokeWidth={thickness} fill="none" />
        <SvgCircle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={thickness} strokeLinecap="round" fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text variant="h3" weight="bold">{score}</Text>
    </View>
  );
}

export function RoscaRiskScores() {
  const t = useTheme();
  const data = rosca.riskSummary as {
    totalAssessed: number;
    averageRisk: number;
    high: number;
    medium: number;
    low: number;
    scores: Score[];
  };

  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(data.scores[0]?.memberId ?? null);

  const visible = useMemo(() => {
    const sorted = [...data.scores].sort((a, b) => b.score - a.score);
    if (filter === "all") return sorted;
    return sorted.filter((s) => s.band === filter);
  }, [filter, data.scores]);

  const counts: Record<Filter, number> = {
    all: data.totalAssessed,
    high: data.high,
    medium: data.medium,
    low: data.low,
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Member risk"
        subtitle="Main CHF Circle"
        onBack={() => router.back()}
        trailing={
          <Pressable hitSlop={10}>
            <Search size={20} color={t.textPrimary} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <RiskGauge score={data.averageRisk} color={t.success} t={t} size={80} thickness={9} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                AVERAGE RISK
              </Text>
              <Text variant="bodySmall" weight="semibold" tone="secondary">
                {data.totalAssessed} members assessed by AI
              </Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 4, lineHeight: 14 }}>
                Lower is better. Scores blend payment history, verification, tenure, engagement, network, and external signals.
              </Text>
            </View>
          </View>

          <View style={[styles.summaryBar, { backgroundColor: t.bgMuted, marginTop: space.md }]}>
            <View style={{ flex: data.low,    backgroundColor: t.success }} />
            <View style={{ flex: data.medium, backgroundColor: t.warning }} />
            <View style={{ flex: data.high,   backgroundColor: t.danger }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
            <BandPill label="Low" count={data.low} color={t.success} />
            <BandPill label="Medium" count={data.medium} color={t.warning} />
            <BandPill label="High" count={data.high} color={t.danger} />
          </View>
        </Card>

        {/* Filter tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          {(["all", "high", "medium", "low"] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.tab, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
              >
                <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
                <View style={[styles.tabCount, { backgroundColor: active ? t.primarySoft : "transparent" }]}>
                  <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textMuted }}>
                    {counts[f]}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Score list */}
        <View style={{ gap: space.sm }}>
          {visible.map((s) => (
            <ScoreCard
              key={s.memberId}
              score={s}
              expanded={expandedId === s.memberId}
              onToggle={() => setExpandedId(expandedId === s.memberId ? null : s.memberId)}
              t={t}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label="Re-assess all members"
          fullWidth
          size="lg"
          variant="secondary"
          trailingIcon={<RefreshCw size={16} color={t.textPrimary} />}
        />
      </View>
    </View>
  );
}

function BandPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text variant="micro" weight="bold">{count}</Text>
      <Text variant="micro" tone="secondary" weight="semibold">{label}</Text>
    </View>
  );
}

function ScoreCard({
  score,
  expanded,
  onToggle,
  t,
}: {
  score: Score;
  expanded: boolean;
  onToggle: () => void;
  t: AppTheme;
}) {
  const meta = bandMeta(score.band, t);

  return (
    <View style={[styles.scoreCard, { backgroundColor: t.surface, borderColor: expanded ? meta.color : t.border, borderWidth: expanded ? 1.5 : 1 }]}>
      <Pressable onPress={onToggle} style={styles.scoreHeader}>
        <RiskGauge score={score.score} color={meta.color} t={t} size={56} thickness={6} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Text variant="bodySmall" weight="bold">{score.name}</Text>
            <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
                T·{score.trust}
              </Text>
            </View>
          </View>
          <View style={[styles.bandPill, { backgroundColor: meta.bg }]}>
            {score.band === "high" ? <ShieldAlert size={10} color={meta.color} /> : <ShieldCheck size={10} color={meta.color} />}
            <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
              {meta.label}
            </Text>
          </View>
        </View>
        {expanded ? <ChevronUp size={16} color={t.textMuted} /> : <ChevronDown size={16} color={t.textMuted} />}
      </Pressable>

      {expanded ? (
        <View style={[styles.scoreBody, { borderTopColor: t.border }]}>
          <View style={[styles.reco, { backgroundColor: t.bgMuted }]}>
            <Sparkles size={12} color={t.textSecondary} />
            <Text variant="caption" tone="secondary" style={{ flex: 1, lineHeight: 16 }}>
              <Text variant="caption" weight="bold">Recommendation: </Text>{score.recommendation}
            </Text>
          </View>

          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginTop: space.md, marginBottom: space.sm }}>
            FACTOR BREAKDOWN
          </Text>
          {score.factors.map((f) => (
            <FactorRow key={f.id} factor={f} t={t} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function FactorRow({ factor, t }: { factor: Factor; t: AppTheme }) {
  const signalColor =
    factor.signal === "positive" ? t.success :
    factor.signal === "negative" ? t.danger : t.textMuted;
  const max = 25;
  const pct = Math.min(1, factor.contribution / max);

  return (
    <View style={{ marginBottom: space.sm }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="caption" weight="semibold">{factor.label}</Text>
          <Text variant="micro" tone="muted">
            (weight {Math.round(factor.weight * 100)}%)
          </Text>
        </View>
        <Text variant="caption" weight="bold" style={{ color: signalColor }}>
          +{factor.contribution}
        </Text>
      </View>
      <View style={[styles.factorBar, { backgroundColor: t.bgMuted }]}>
        <View style={[styles.factorFill, { width: `${pct * 100}%`, backgroundColor: signalColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
  },
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  scoreCard: {
    borderRadius: radius.md,
    padding: space.md,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  bandPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  scoreBody: {
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  reco: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  factorBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  factorFill: {
    height: "100%",
    borderRadius: 3,
  },
  ctaDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
