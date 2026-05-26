// Request additional shares for /sections/multi-share/request.
// Slider (1-10), live eligibility checks, projected payout, governance flow
// (treasurer + auditor sign-off), confirm CTA.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  Layers, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Users,
  Minus, Plus, Info,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const BASE_CONTRIBUTION = 200; // CHF/month
const BASE_PAYOUT = 2_400; // CHF per cycle
const CIRCLE_CAP = 0.30;
const PROJECTED_CIRCLE_POT = 14_400; // total monthly pool

const CHECKS = (shares: number) => [
  { id: "trust",   label: "Trust Score ≥ 700",          ok: true,                   value: "824 / Excellent" },
  { id: "tenure",  label: "Tenure ≥ 12 months",         ok: true,                   value: "68 months" },
  { id: "missed",  label: "0 missed payments / 6 mo",   ok: true,                   value: "0 missed" },
  { id: "concent", label: "Stays under 30% circle cap", ok: shares <= 3,            value: `${(((shares * BASE_CONTRIBUTION) / PROJECTED_CIRCLE_POT) * 100).toFixed(1)}% projected` },
];

const APPROVERS = [
  { role: "Treasurer", name: "Amara Ofori",   state: "auto",     note: "Auto-recommend (Trust 824)" },
  { role: "Auditor",   name: "Mariam Rahimi", state: "pending",  note: "Will review within 24h" },
];

export function MultiShareRequest() {
  const t = useTheme();
  const [shares, setShares] = useState(2);
  const checks = CHECKS(shares);
  const allOk = checks.every((c) => c.ok);
  const monthlyContrib = shares * BASE_CONTRIBUTION;
  const projectedPayout = shares * BASE_PAYOUT;
  const concentration = ((shares * BASE_CONTRIBUTION) / PROJECTED_CIRCLE_POT) * 100;
  const capPct = CIRCLE_CAP * 100;
  const adjust = (delta: number) => setShares((s) => Math.min(10, Math.max(1, s + delta)));

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Request shares" subtitle="Main CHF Circle" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 120, gap: space.lg }}>
        <Card padded>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>HOW MANY SHARES</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.md, marginTop: space.md }}>
            <Pressable onPress={() => adjust(-1)} style={[styles.stepBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Minus size={18} color={t.textPrimary} />
            </Pressable>
            <View style={{ alignItems: "center", minWidth: 120 }}>
              <Text variant="display" weight="bold" style={{ fontSize: 56 }}>{shares}×</Text>
              <Text variant="caption" tone="muted">share{shares === 1 ? "" : "s"} of 10 max</Text>
            </View>
            <Pressable onPress={() => adjust(1)} style={[styles.stepBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Plus size={18} color={t.textPrimary} />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: 4, marginTop: space.lg }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.block,
                  {
                    backgroundColor: i < shares ? t.primary : t.bgMuted,
                    borderColor: i < shares ? t.primary : t.border,
                  },
                ]}
              />
            ))}
          </View>
        </Card>

        <Card padded tone="primarySoft" bordered={false}>
          <Text variant="caption" weight="bold" tone="accent" style={{ letterSpacing: 1 }}>PROJECTED PER CYCLE</Text>
          <View style={[styles.projectedRow, { borderTopColor: t.border, marginTop: space.md }]}>
            <View style={{ flex: 1, alignItems: "center", paddingVertical: space.md }}>
              <Text variant="micro" tone="muted" weight="semibold">CONTRIBUTION</Text>
              <Text variant="h2" weight="bold">CHF {monthlyContrib.toLocaleString("de-CH")}</Text>
            </View>
            <View style={{ width: 1, backgroundColor: t.border }} />
            <View style={{ flex: 1, alignItems: "center", paddingVertical: space.md }}>
              <Text variant="micro" tone="muted" weight="semibold">PAYOUT</Text>
              <Text variant="h2" weight="bold" style={{ color: t.success }}>CHF {projectedPayout.toLocaleString("de-CH")}</Text>
            </View>
          </View>
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text variant="caption" weight="semibold">% of circle pool</Text>
              <Text variant="caption" weight="bold">{concentration.toFixed(1)}% / {capPct.toFixed(0)}% cap</Text>
            </View>
            <ProgressBar value={(concentration / capPct) * 100} tone={concentration / capPct > 0.85 ? "warning" : "primary"} />
          </View>
        </Card>

        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            ELIGIBILITY · LIVE CHECK
          </Text>
          <Card padded={false}>
            {checks.map((c, i) => (
              <View
                key={c.id}
                style={[
                  styles.checkRow,
                  i < checks.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <View style={[styles.checkIcon, { backgroundColor: c.ok ? t.successSoft : t.dangerSoft }]}>
                  {c.ok ? <CheckCircle2 size={14} color={t.success} /> : <AlertCircle size={14} color={t.danger} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="semibold">{c.label}</Text>
                  <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{c.value}</Text>
                </View>
                <Text variant="micro" weight="bold" style={{ color: c.ok ? t.success : t.danger }}>
                  {c.ok ? "PASS" : "BLOCKED"}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            APPROVAL FLOW
          </Text>
          <Card padded={false}>
            {APPROVERS.map((a, i) => (
              <View
                key={a.role}
                style={[
                  styles.approverRow,
                  i < APPROVERS.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <View style={[styles.approverIcon, { backgroundColor: a.state === "auto" ? t.successSoft : t.warningSoft }]}>
                  <Users size={14} color={a.state === "auto" ? t.success : t.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" weight="semibold">{a.role} · {a.name}</Text>
                  <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{a.note}</Text>
                </View>
                <View style={[styles.statePill, { backgroundColor: a.state === "auto" ? t.successSoft : t.warningSoft }]}>
                  <Text variant="micro" weight="bold" style={{ color: a.state === "auto" ? t.success : t.warning }}>
                    {a.state === "auto" ? "AUTO-OK" : "PENDING"}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      <View style={[styles.cta, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label={allOk ? `Request ${shares} share${shares === 1 ? "" : "s"}` : "Adjust to pass eligibility"}
          fullWidth
          size="lg"
          variant={allOk ? "primary" : "secondary"}
          trailingIcon={allOk ? <ArrowRight size={18} color="#fff" /> : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  block: { flex: 1, height: 24, borderRadius: radius.sm, borderWidth: 1 },
  projectedRow: { flexDirection: "row", borderTopWidth: 1, marginBottom: space.md },
  checkRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md },
  checkIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  approverRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md },
  approverIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  statePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  cta: { position: "absolute", left: 0, right: 0, bottom: 0, padding: space.lg, paddingBottom: 32, borderTopWidth: StyleSheet.hairlineWidth },
});
