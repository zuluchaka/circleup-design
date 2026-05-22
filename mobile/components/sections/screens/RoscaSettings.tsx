import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Switch } from "react-native";
import {
  PauseCircle,
  PlayCircle,
  Calendar,
  Banknote,
  ShieldCheck,
  Languages,
  Clock,
  Eye,
  Minus,
  Plus,
  AlertTriangle,
  Lock,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function cap(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RoscaSettings() {
  const t = useTheme();
  const s = rosca.circleSettings as {
    status: "active" | "paused" | "completed";
    pausedSince: string | null;
    pauseReason: string | null;
    cyclesRemaining: number;
    maxExtendCycles: number;
    configuration: any;
  };

  const [paused, setPaused] = useState(s.status === "paused");
  const [extendBy, setExtendBy] = useState(0);

  const cfg = s.configuration;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Circle settings"
        subtitle="Organiser controls"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status header stats */}
        <View style={styles.headerStats}>
          <HeaderStat label="Status" value={paused ? "Paused" : "Active"} tone={paused ? "warning" : "success"} t={t} />
          <View style={[styles.statSep, { backgroundColor: t.border }]} />
          <HeaderStat label="Cycle" value="8 / 12" t={t} />
          <View style={[styles.statSep, { backgroundColor: t.border }]} />
          <HeaderStat label="Contribution" value={formatCurrency(cfg.contribution, cfg.currency)} t={t} />
          <View style={[styles.statSep, { backgroundColor: t.border }]} />
          <HeaderStat label="Cadence" value={cfg.cadence} t={t} />
        </View>

        {/* Pause / Resume card */}
        <View style={[styles.pauseCard, { backgroundColor: paused ? t.warningSoft : t.successSoft }]}>
          <View style={[styles.pauseIcon, { backgroundColor: t.surface }]}>
            {paused ? <PauseCircle size={20} color={t.warning} /> : <PlayCircle size={20} color={t.success} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: paused ? t.warning : t.success }}>
              {paused ? "Circle is paused" : "Circle is running"}
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              {paused
                ? "Contributions and payouts are on hold. Members are notified."
                : "Contributions auto-charge per schedule. Tap to pause."}
            </Text>
          </View>
          <Switch
            value={paused}
            onValueChange={setPaused}
            trackColor={{ false: t.bgMuted, true: t.warningSoft }}
            thumbColor={paused ? t.warning : t.success}
          />
        </View>

        {/* Configuration */}
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: space.sm }}>Configuration</Text>
          <Card padded>
            <ConfigRow Icon={Banknote}     label="Payout method"     value={cap(cfg.payoutMethod) + " order"} t={t} />
            <ConfigRow Icon={ShieldCheck}  label="Emergency Fund"    value={`${Math.round(cfg.emergencyFundRate * 100)}% surcharge`} t={t} />
            <ConfigRow Icon={Clock}        label="Grace period"      value={`${cfg.gracePeriodDays} days`} t={t} />
            <ConfigRow Icon={AlertTriangle} label="Late penalty"     value={`${Math.round(cfg.latePenalty * 100)}%`} t={t} />
            <ConfigRow Icon={Eye}          label="Visibility"        value={cap(cfg.visibility)} t={t} />
            <ConfigRow Icon={Languages}    label="Language"          value={cfg.language} t={t} last />
          </Card>
          <Text variant="micro" tone="muted" style={{ marginTop: space.sm, lineHeight: 14 }}>
            Configuration is locked once the circle starts. Use Renewal to change rules for the next round.
          </Text>
        </View>

        {/* Extend */}
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: space.sm }}>Extend the circle</Text>
          <Card padded>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              ADD CYCLES TO THIS ROUND
            </Text>
            <View style={[styles.stepperRow, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Pressable
                onPress={() => setExtendBy(Math.max(0, extendBy - 1))}
                style={[styles.stepperBtn, { backgroundColor: t.surface }]}
              >
                <Minus size={16} color={t.textPrimary} />
              </Pressable>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text variant="h2" weight="bold">+{extendBy}</Text>
                <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
                  {extendBy === 0 ? "No extension" : `Ends in ${s.cyclesRemaining + extendBy} cycles`}
                </Text>
              </View>
              <Pressable
                onPress={() => setExtendBy(Math.min(s.maxExtendCycles, extendBy + 1))}
                style={[styles.stepperBtn, { backgroundColor: t.surface }]}
              >
                <Plus size={16} color={t.textPrimary} />
              </Pressable>
            </View>
            <View style={[styles.extendNote, { backgroundColor: t.bgMuted }]}>
              <Calendar size={11} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold" style={{ flex: 1 }}>
                Max extend by {s.maxExtendCycles} cycles. Members vote on extensions over 2 cycles.
              </Text>
            </View>
            {extendBy > 0 ? (
              <Button
                label={`Propose +${extendBy} cycle${extendBy === 1 ? "" : "s"} extension`}
                fullWidth
                size="md"
                variant="primary"
              />
            ) : null}
          </Card>
        </View>

        {/* Locked operations */}
        <View style={[styles.locked, { backgroundColor: t.bgMuted }]}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted" weight="semibold" style={{ flex: 1, lineHeight: 14 }}>
            Members, invitations, disputes — handle those from <Text variant="micro" weight="bold" tone="accent">Management →</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function HeaderStat({ label, value, tone, t }: { label: string; value: string; tone?: "success" | "warning"; t: AppTheme }) {
  const color = tone === "warning" ? t.warning : tone === "success" ? t.success : t.textPrimary;
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="caption" weight="bold" style={{ color, marginTop: 2 }} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function ConfigRow({
  Icon,
  label,
  value,
  t,
  last,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  t: AppTheme;
  last?: boolean;
}) {
  return (
    <View style={[styles.configRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.configIcon, { backgroundColor: t.bgMuted }]}>
        <Icon size={14} color={t.textSecondary} />
      </View>
      <Text variant="bodySmall" tone="secondary" style={{ flex: 1 }}>{label}</Text>
      <Text variant="bodySmall" weight="semibold">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  statSep: {
    width: 1,
    height: 24,
  },
  pauseCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  pauseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  configRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.sm,
  },
  configIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: space.sm,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  extendNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
    marginBottom: space.sm,
  },
  locked: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
});
