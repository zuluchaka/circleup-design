import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Plus,
  Minus,
  Layers,
  Check,
  Clock,
  X,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type HistoryKind = "increase" | "decrease" | "request" | "approved" | "denied";

type History = {
  id: string;
  kind: HistoryKind;
  cycle: number;
  newShareCount: number;
  at: string;
  note: string;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function historyMeta(k: HistoryKind, t: AppTheme) {
  if (k === "approved") return { color: t.success, bg: t.successSoft, Icon: Check, label: "APPROVED" };
  if (k === "denied")   return { color: t.danger,  bg: t.dangerSoft,  Icon: X,     label: "DENIED" };
  if (k === "request")  return { color: t.warning, bg: t.warningSoft, Icon: Clock, label: "REQUESTED" };
  if (k === "increase") return { color: t.primary, bg: t.primarySoft, Icon: ArrowUp, label: "INCREASED" };
  return { color: t.textSecondary, bg: t.bgMuted, Icon: ArrowDown, label: "DECREASED" };
}

export function RoscaMultiShare() {
  const t = useTheme();
  const ms = rosca.multiShare as {
    currentShares: number;
    maxShares: number;
    multiplier: number;
    baseContribution: number;
    currency: string;
    baseEfRate: number;
    pendingRequest: { requested: number; submittedAt: string; status: string } | null;
    history: History[];
  };

  const [requestShares, setRequestShares] = useState(ms.currentShares);
  const baseEf = Math.round(ms.baseContribution * ms.baseEfRate);
  const currentTotal = ms.currentShares * (ms.baseContribution + baseEf);
  const requestedTotal = requestShares * (ms.baseContribution + baseEf);
  const delta = requestShares - ms.currentShares;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Multi-share"
        subtitle="Main CHF Circle"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current shares hero */}
        <View style={[styles.hero, { backgroundColor: t.primary }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Layers size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              YOUR SHARES
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8, marginTop: space.sm }}>
            <Text style={{ fontSize: 60, lineHeight: 64, fontWeight: "700", color: "#fff" }}>
              {ms.currentShares}×
            </Text>
            <Text variant="h2" weight="semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
              of {ms.maxShares} allowed
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)", marginTop: 4 }}>
            Each share = {formatCurrency(ms.baseContribution, ms.currency)} + {formatCurrency(baseEf, ms.currency)} EF per cycle.
          </Text>

          <View style={[styles.heroFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
                CONTRIBUTION
              </Text>
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
                {formatCurrency(currentTotal, ms.currency)}/cycle
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
                PROJECTED PAYOUT
              </Text>
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
                {ms.currentShares}× rotation
              </Text>
            </View>
          </View>
        </View>

        {/* Pending request */}
        {ms.pendingRequest ? (
          <View style={[styles.pendingCard, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
            <View style={[styles.pendingIcon, { backgroundColor: t.surface }]}>
              <Clock size={14} color={t.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" style={{ color: t.warning }}>
                {ms.pendingRequest.requested}× share request pending
              </Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
                Submitted {timeSince(ms.pendingRequest.submittedAt)} · awaiting organiser approval
              </Text>
            </View>
            <Pressable style={[styles.cancelBtn, { backgroundColor: t.surface, borderColor: t.warning }]}>
              <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>CANCEL</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Request changes */}
        <View>
          <Text variant="h3" weight="bold">Request a change</Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
            Adjust how many shares you hold. Organiser approves changes that take effect from the next cycle.
          </Text>

          <View style={[styles.stepperCard, { backgroundColor: t.surface, borderColor: t.border, marginTop: space.md }]}>
            <Pressable
              onPress={() => setRequestShares(Math.max(1, requestShares - 1))}
              style={[styles.stepBtn, { backgroundColor: t.bgMuted }]}
            >
              <Minus size={18} color={t.textPrimary} />
            </Pressable>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text variant="h1" weight="bold">{requestShares}× shares</Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
                {delta === 0
                  ? "No change"
                  : delta > 0
                  ? `Add ${delta} share${delta === 1 ? "" : "s"}`
                  : `Drop ${Math.abs(delta)} share${Math.abs(delta) === 1 ? "" : "s"}`}
              </Text>
            </View>
            <Pressable
              onPress={() => setRequestShares(Math.min(ms.maxShares, requestShares + 1))}
              style={[styles.stepBtn, { backgroundColor: t.bgMuted }]}
              disabled={requestShares >= ms.maxShares}
            >
              <Plus size={18} color={t.textPrimary} />
            </Pressable>
          </View>

          {/* Side-by-side comparison */}
          <View style={[styles.compare, { backgroundColor: t.bgMuted, marginTop: space.md }]}>
            <CompareSide
              label="NOW"
              shares={ms.currentShares}
              total={currentTotal}
              currency={ms.currency}
              t={t}
            />
            <View style={[styles.compareArrow, { backgroundColor: t.surface }]}>
              <Text variant="caption" weight="bold" tone="accent">→</Text>
            </View>
            <CompareSide
              label="AFTER"
              shares={requestShares}
              total={requestedTotal}
              currency={ms.currency}
              t={t}
              highlight={delta !== 0}
            />
          </View>
        </View>

        {/* History */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Share history</Text>
            <Text variant="caption" tone="secondary">{ms.history.length} entries</Text>
          </View>
          <Card padded={false}>
            {ms.history.map((h, i) => (
              <HistoryRow key={h.id} h={h} t={t} last={i === ms.history.length - 1} />
            ))}
          </Card>
        </View>

        {/* Rules disclosure */}
        <View style={[styles.rules, { backgroundColor: t.infoSoft }]}>
          <ShieldCheck size={14} color={t.info} />
          <Text variant="micro" style={{ color: t.info, flex: 1, lineHeight: 14 }}>
            Multi-share is per-circle and capped at {ms.maxShares}× by the circle's settings. Increases take effect from the next cycle start.
          </Text>
        </View>
      </ScrollView>

      {delta !== 0 ? (
        <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
          <Button
            label={delta > 0 ? `Request +${delta} share${delta === 1 ? "" : "s"}` : `Request −${Math.abs(delta)} share${Math.abs(delta) === 1 ? "" : "s"}`}
            fullWidth
            size="lg"
            trailingIcon={<Sparkles size={16} color="#fff" />}
          />
        </View>
      ) : null}
    </View>
  );
}

function CompareSide({
  label,
  shares,
  total,
  currency,
  t,
  highlight,
}: {
  label: string;
  shares: number;
  total: number;
  currency: string;
  t: AppTheme;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.compareSide, highlight ? { backgroundColor: t.primarySoft } : null]}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
        {label}
      </Text>
      <Text variant="h2" weight="bold" style={{ color: highlight ? t.primary : t.textPrimary, marginTop: 2 }}>
        {shares}×
      </Text>
      <Text variant="caption" weight="semibold" style={{ color: highlight ? t.primary : t.textSecondary, marginTop: 2 }}>
        {formatCurrency(total, currency)}
      </Text>
    </View>
  );
}

function HistoryRow({ h, t, last }: { h: History; t: AppTheme; last: boolean }) {
  const meta = historyMeta(h.kind, t);
  const Icon = meta.Icon;
  return (
    <View style={[styles.hRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.hDot, { backgroundColor: meta.bg }]}>
        <Icon size={12} color={meta.color} strokeWidth={3} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold">{h.newShareCount}× shares</Text>
          <View style={[styles.hPill, { backgroundColor: meta.bg }]}>
            <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
              {meta.label}
            </Text>
          </View>
          <Text variant="micro" tone="muted">· cycle {h.cycle}</Text>
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{h.note}</Text>
      </View>
      <Text variant="micro" tone="muted">{timeSince(h.at)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  heroFooter: {
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: space.md,
  },
  pendingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  pendingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  stepperCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  compare: {
    flexDirection: "row",
    alignItems: "center",
    padding: space.sm,
    borderRadius: radius.md,
    gap: space.sm,
  },
  compareSide: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  compareArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  hRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  hDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  hPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  rules: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
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
