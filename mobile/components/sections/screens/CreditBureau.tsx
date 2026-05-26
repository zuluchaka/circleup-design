// Bureau reporting opt-in for /sections/credit-and-lending/bureau.
// Toggle reporting your on-time contributions to TransUnion CH so they build
// your formal credit history. Discloses both upside and risk of default
// reporting.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Building2, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Calendar,
  TrendingUp,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const PARTNER = "TransUnion CH";
const STATUS = "Eligible" as const;

const BENEFITS = [
  { Icon: TrendingUp,  title: "On-time builds history", body: "Every cycle of on-time contributions is reported as a positive trade-line." },
  { Icon: ShieldCheck, title: "Welfare repayments count", body: "Welfare aid you've repaid in full strengthens your formal credit profile." },
  { Icon: CheckCircle2,title: "Bureau-wide visibility",  body: "Other Swiss lenders (banks, telcos, utilities) see your CircleUp history." },
];

const REPORTS = [
  { quarter: "Q2 2026", at: "Scheduled · 2026-06-30", state: "upcoming" },
  { quarter: "Q1 2026", at: "Reported · 2026-04-02",  state: "reported" },
  { quarter: "Q4 2025", at: "Reported · 2026-01-04",  state: "reported" },
];

export function CreditBureau() {
  const t = useTheme();
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Bureau reporting" subtitle="Section 09 · Credit & Lending" />
      <ScrollView contentContainerStyle={{ padding: 0, paddingBottom: space.xxxl }}>
        <LinearGradient
          colors={[palette.indigo[600], palette.indigo[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={styles.partnerCrest}>
              <Building2 size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.2 }}>
                BUREAU PARTNER
              </Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>{PARTNER}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: "rgba(16, 185, 129, 0.24)" }]}>
              <CheckCircle2 size={11} color={palette.emerald[400]} />
              <Text variant="micro" weight="bold" style={{ color: palette.emerald[400] }}>
                {STATUS.toUpperCase()}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.lg }}>
          {/* Toggle card */}
          <Card padded>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
              <View style={[styles.toggleIcon, { backgroundColor: enabled ? t.successSoft : t.bgMuted }]}>
                <CheckCircle2 size={20} color={enabled ? t.success : t.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold">Report to bureau</Text>
                <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  {enabled ? "Active · next report June 30" : "Disabled · history won't be shared"}
                </Text>
              </View>
              <Switch value={enabled} onValueChange={setEnabled} />
            </View>
          </Card>

          {/* Benefits */}
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              WHAT GETS REPORTED
            </Text>
            <View style={{ gap: space.sm }}>
              {BENEFITS.map((b) => {
                const Icon = b.Icon;
                return (
                  <Card key={b.title} padded>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.md }}>
                      <View style={[styles.benefitIcon, { backgroundColor: t.successSoft }]}>
                        <Icon size={16} color={t.success} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" weight="semibold">{b.title}</Text>
                        <Text variant="caption" tone="secondary" style={{ marginTop: 2, lineHeight: 16 }}>{b.body}</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>

          {/* Warning */}
          <View style={[styles.warning, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
            <AlertTriangle size={18} color={t.warning} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.warning }}>
                Defaults are also reported
              </Text>
              <Text variant="caption" style={{ color: t.warning, opacity: 0.85, marginTop: 2, lineHeight: 16 }}>
                Make sure you can sustain contributions before opting in. A reported default stays on your record for 5 years per FADP.
              </Text>
            </View>
          </View>

          {/* Report schedule */}
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              REPORTING SCHEDULE
            </Text>
            <Card padded={false}>
              {REPORTS.map((r, i) => (
                <View
                  key={r.quarter}
                  style={[
                    styles.reportRow,
                    i < REPORTS.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={[styles.reportIcon, { backgroundColor: r.state === "reported" ? t.successSoft : t.primarySoft }]}>
                    {r.state === "reported"
                      ? <CheckCircle2 size={14} color={t.success} />
                      : <Calendar size={14} color={t.primary} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{r.quarter}</Text>
                    <Text variant="caption" tone="secondary">{r.at}</Text>
                  </View>
                  {r.state === "upcoming" ? (
                    <View style={[styles.upcomingPill, { backgroundColor: t.primarySoft }]}>
                      <Text variant="micro" weight="bold" tone="accent">UPCOMING</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </Card>
          </View>

          <Pressable style={[styles.viewBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text variant="bodySmall" weight="bold" tone="accent" style={{ flex: 1 }}>
              View my TransUnion file
            </Text>
            <ArrowRight size={16} color={t.primary} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.lg,
  },
  partnerCrest: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  toggleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  warning: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  reportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  reportIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  upcomingPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
