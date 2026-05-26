// Cast-ballot screen for /sections/governance-and-voting/ballot.
// Vote on the active 2026 Operating Budget proposal — eligibility check,
// Yes/No/Abstain selection, quorum + vote breakdown, sticky vote bar.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  Vote, Clock, CheckCircle2, X, MinusCircle, ShieldCheck, Info, ArrowRight,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type Vote = "yes" | "no" | "abstain";

const PROP = {
  id: "prop_2026_budget",
  title: "2026 Operating Budget",
  body: "Approve a CHF 48,000 budget allocated across Welfare (CHF 18k), Events (CHF 12k), Admin (CHF 8k), Tooling (CHF 6k), and Contingency (CHF 4k).",
  proposer: "Amara Ofori · Treasurer",
  endsAt: "2026-05-25",
  quorum: { current: 124, required: 138 },
  votes: { yes: 87, no: 14, abstain: 23 },
  breakdown: [
    { label: "Welfare Fund", amount: 18000, pct: 37.5 },
    { label: "Events",       amount: 12000, pct: 25.0 },
    { label: "Admin",        amount:  8000, pct: 16.7 },
    { label: "Tooling",      amount:  6000, pct: 12.5 },
    { label: "Contingency",  amount:  4000, pct:  8.3 },
  ],
};

const OPTIONS: { value: Vote; label: string; sub: string; Icon: React.ComponentType<{ size?: number; color?: string }>; toneKey: "success" | "danger" | "neutral" }[] = [
  { value: "yes",     label: "Yes — approve",            sub: "Adopt the budget as proposed.",                     Icon: CheckCircle2, toneKey: "success" },
  { value: "no",      label: "No — reject",              sub: "Reject. Discussion reopens for 14 days.",            Icon: X,            toneKey: "danger" },
  { value: "abstain", label: "Abstain",                  sub: "Counts towards quorum but not the outcome.",         Icon: MinusCircle,  toneKey: "neutral" },
];

export function GovernanceBallot() {
  const t = useTheme();
  const [choice, setChoice] = useState<Vote | null>(null);
  const total = PROP.votes.yes + PROP.votes.no + PROP.votes.abstain;
  const quorumPct = (PROP.quorum.current / PROP.quorum.required) * 100;
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(PROP.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Cast ballot" subtitle="Section 05 · Governance & Voting" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}>
        <View style={[styles.eligible, { backgroundColor: t.successSoft, borderColor: t.success }]}>
          <ShieldCheck size={16} color={t.success} />
          <Text variant="caption" weight="bold" style={{ color: t.success, flex: 1 }}>
            You're eligible to vote · 1 of 138 members
          </Text>
        </View>

        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.sm, marginBottom: space.sm }}>
            <View style={[styles.iconBubble, { backgroundColor: t.primarySoft }]}>
              <Vote size={20} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={[styles.statusPill, { backgroundColor: t.primarySoft }]}>
                <Text variant="micro" weight="bold" tone="accent">VOTING · ENDS IN {daysLeft}D</Text>
              </View>
              <Text variant="h2" weight="bold" style={{ marginTop: 6 }}>{PROP.title}</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>Proposed by {PROP.proposer}</Text>
            </View>
          </View>
          <Text variant="bodySmall" style={{ lineHeight: 20 }}>{PROP.body}</Text>

          <View style={{ marginTop: space.lg, gap: space.sm }}>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.8 }}>BUDGET BREAKDOWN</Text>
            {PROP.breakdown.map((b) => (
              <View key={b.label}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text variant="caption" weight="semibold">{b.label}</Text>
                  <Text variant="caption" weight="bold">CHF {b.amount.toLocaleString("de-CH")} · {b.pct.toFixed(1)}%</Text>
                </View>
                <View style={{ marginTop: 4 }}>
                  <ProgressBar value={b.pct * 2.5} tone="primary" />
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text variant="caption" weight="bold" tone="muted">QUORUM</Text>
            <Text variant="caption" weight="semibold">{PROP.quorum.current} / {PROP.quorum.required}</Text>
          </View>
          <ProgressBar value={quorumPct} tone={quorumPct >= 100 ? "success" : "primary"} />
          <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
            <VoteCell label="Yes"     count={PROP.votes.yes}     total={total} color={t.success} />
            <VoteCell label="No"      count={PROP.votes.no}      total={total} color={t.danger}  />
            <VoteCell label="Abstain" count={PROP.votes.abstain} total={total} color={t.textMuted} />
          </View>
        </Card>

        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>YOUR VOTE</Text>
          <View style={{ gap: space.sm }}>
            {OPTIONS.map((o) => {
              const sel = choice === o.value;
              const tonePalette = {
                success: { fg: t.success, bg: t.successSoft, border: t.success },
                danger:  { fg: t.danger,  bg: t.dangerSoft,  border: t.danger  },
                neutral: { fg: t.textSecondary, bg: t.bgMuted, border: t.border },
              }[o.toneKey];
              const Icon = o.Icon;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => setChoice(o.value)}
                  style={[
                    styles.option,
                    {
                      backgroundColor: sel ? tonePalette.bg : t.surface,
                      borderColor: sel ? tonePalette.border : t.border,
                      borderWidth: sel ? 2 : 1,
                    },
                  ]}
                >
                  <Icon size={20} color={tonePalette.fg} />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="bold" style={{ color: sel ? tonePalette.fg : t.textPrimary }}>
                      {o.label}
                    </Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{o.sub}</Text>
                  </View>
                  <View style={[styles.radio, { borderColor: sel ? tonePalette.fg : t.border, backgroundColor: sel ? tonePalette.fg : "transparent" }]}>
                    {sel ? <CheckCircle2 size={14} color="#fff" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.note, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
          <Info size={16} color={t.info} />
          <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 16 }}>
            You can change your vote until the deadline. After {new Date(PROP.endsAt).toLocaleDateString("en-CH", { day: "numeric", month: "long" })}, results are public to the association.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.stickyBar, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label={choice ? `Submit ${choice}` : "Pick an option to vote"}
          fullWidth
          size="lg"
          variant={choice ? "primary" : "secondary"}
          trailingIcon={choice ? <ArrowRight size={16} color="#fff" /> : undefined}
        />
      </View>
    </View>
  );
}

function VoteCell({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
      <Text variant="h2" weight="bold" style={{ color }}>{count}</Text>
      <Text variant="micro" tone="muted" weight="semibold">{label.toUpperCase()} · {pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eligible: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  stickyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
