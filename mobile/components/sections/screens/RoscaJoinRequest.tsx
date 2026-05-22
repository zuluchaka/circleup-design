import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  Check,
  AlertTriangle,
  X,
  ShieldCheck,
  Lock,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type EligibilityStatus = "ok" | "blocker" | "warning";

type EligibilityCheck = {
  id: string;
  label: string;
  detail: string;
  status: EligibilityStatus;
};

type PublicCircle = {
  id: string;
  name: string;
  associationName: string;
  contribution: number;
  currency: string;
  cadence: string;
  emergencyFundRate: number;
  accent: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function statusMeta(s: EligibilityStatus, t: AppTheme) {
  if (s === "ok") return { color: t.success, bg: t.successSoft, Icon: Check };
  if (s === "warning") return { color: t.warning, bg: t.warningSoft, Icon: AlertTriangle };
  return { color: t.danger, bg: t.dangerSoft, Icon: X };
}

export function RoscaJoinRequest() {
  const t = useTheme();
  const eligibility = rosca.joinEligibility as { circleId: string; canJoin: boolean; isFull: boolean; checks: EligibilityCheck[] };
  const circle = (rosca.publicCircles as PublicCircle[]).find((c) => c.id === eligibility.circleId)!;
  const [reason, setReason] = useState("");

  const blockers = useMemo(() => eligibility.checks.filter((c) => c.status === "blocker"), [eligibility.checks]);
  const warnings = useMemo(() => eligibility.checks.filter((c) => c.status === "warning"), [eligibility.checks]);
  const canSubmit = blockers.length === 0;
  const efAmount = Math.round(circle.contribution * circle.emergencyFundRate);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Request to join"
        subtitle={circle.name}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary chip card */}
        <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.summaryAccent, { backgroundColor: circle.accent }]} />
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold">{circle.name}</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
              {circle.associationName} · {formatCurrency(circle.contribution, circle.currency)} {circle.cadence.toLowerCase()}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>EF</Text>
            <Text variant="caption" weight="semibold">
              +{formatCurrency(efAmount, circle.currency)}
            </Text>
          </View>
        </View>

        {/* Eligibility list */}
        <View>
          <Text variant="h3" weight="bold">Eligibility</Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4 }}>
            We run a quick pre-check before submitting your request.
          </Text>

          <View style={{ marginTop: space.md, gap: space.sm }}>
            {eligibility.checks.map((c) => (
              <EligibilityRow key={c.id} check={c} t={t} />
            ))}
          </View>
        </View>

        {/* Warnings detail */}
        {warnings.length > 0 ? (
          <View style={[styles.warningCard, { backgroundColor: t.warningSoft }]}>
            <View style={[styles.warningIcon, { backgroundColor: t.surface }]}>
              <ShieldCheck size={14} color={t.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" style={{ color: t.warning }}>
                You'll need to complete Enhanced KYC
              </Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
                We'll prompt you for ID and proof of address right after the organiser approves your request. It takes about 5 minutes.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Reason note */}
        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              MESSAGE TO ORGANISER
            </Text>
            <Text variant="micro" tone="muted">Optional</Text>
          </View>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="A short note helps the organiser approve faster…"
            placeholderTextColor={t.textMuted}
            multiline
            maxLength={280}
            style={[
              styles.textInput,
              {
                color: t.textPrimary,
                backgroundColor: t.bgMuted,
                borderColor: t.border,
              },
            ]}
          />
          <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
            {reason.length}/280
          </Text>
        </Card>

        {/* What happens next */}
        <Card padded tone="muted" bordered={false}>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            WHAT HAPPENS NEXT
          </Text>
          <NextStep n={1} title="Organiser reviews your request" body="Usually within 24 hours. You'll get a push notification." t={t} />
          <NextStep n={2} title="Enhanced KYC if needed" body="ID + proof of address verified by our partner." t={t} />
          <NextStep n={3} title="You're in the circle" body="Your slot is assigned and the first contribution date appears in My Circles." t={t} last />
        </Card>
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            By submitting you agree to the circle's terms and CircleUp's KYC policy.
          </Text>
        </View>
        <Button
          label={canSubmit ? "Send request to organiser" : `${blockers.length} blocker${blockers.length === 1 ? "" : "s"} to resolve`}
          onPress={canSubmit ? () => router.back() : undefined}
          fullWidth
          size="lg"
          disabled={!canSubmit}
          variant={canSubmit ? "primary" : "secondary"}
          trailingIcon={canSubmit ? <Check size={16} color="#fff" strokeWidth={3} /> : undefined}
        />
      </View>
    </View>
  );
}

function EligibilityRow({ check, t }: { check: EligibilityCheck; t: AppTheme }) {
  const meta = statusMeta(check.status, t);
  const Icon = meta.Icon;
  return (
    <View style={[styles.eligRow, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.eligDot, { backgroundColor: meta.bg }]}>
        <Icon size={14} color={meta.color} strokeWidth={3} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">{check.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
          {check.detail}
        </Text>
      </View>
      {check.status === "warning" ? (
        <View style={[styles.eligPill, { backgroundColor: t.warningSoft }]}>
          <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.6 }}>ACTION LATER</Text>
        </View>
      ) : check.status === "blocker" ? (
        <View style={[styles.eligPill, { backgroundColor: t.dangerSoft }]}>
          <Text variant="micro" weight="bold" style={{ color: t.danger, letterSpacing: 0.6 }}>FIX FIRST</Text>
        </View>
      ) : null}
    </View>
  );
}

function NextStep({
  n,
  title,
  body,
  t,
  last,
}: {
  n: number;
  title: string;
  body: string;
  t: AppTheme;
  last?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", gap: space.sm, paddingBottom: last ? 0 : space.sm }}>
      <View style={[styles.nextDot, { backgroundColor: t.surface, borderColor: t.border }]}>
        <Text variant="micro" weight="bold" tone="accent">{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">{title}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  summaryAccent: {
    width: 4,
    height: 36,
    borderRadius: 2,
  },
  eligRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  eligDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  eligPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  warningIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    marginTop: space.sm,
    minHeight: 88,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
    textAlignVertical: "top",
  },
  nextDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
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
