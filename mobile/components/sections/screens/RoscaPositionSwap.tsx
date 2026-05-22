import { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  ArrowLeftRight,
  Check,
  Lock,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Candidate = {
  memberId: string;
  name: string;
  trust: number;
  currentSlot: number;
  cyclesAway: number;
  willingnessHint: string;
};

export function RoscaPositionSwap() {
  const t = useTheme();
  const candidates = rosca.positionSwapCandidates as Candidate[];
  const yourSlot = 11;
  const yourCyclesAway = 3;

  const [targetId, setTargetId] = useState(candidates[1]?.memberId ?? candidates[0].memberId);
  const [reason, setReason] = useState("");

  const target = candidates.find((c) => c.memberId === targetId)!;
  const requiresOrgApproval = target.currentSlot <= yourSlot - 4; // simple heuristic for design

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Request a swap"
        subtitle={`Your slot · #${yourSlot}`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Swap preview */}
        <View style={[styles.swapPreview, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.swapSide}>
            <Avatar name="Aminata Diallo" size="lg" hue="#4f46e5" />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.xs }}>
              YOU
            </Text>
            <Text variant="bodySmall" weight="bold">#{yourSlot}</Text>
            <Text variant="micro" tone="secondary">in {yourCyclesAway} cycles</Text>
          </View>
          <View style={[styles.swapBetween, { backgroundColor: t.bgMuted }]}>
            <ArrowLeftRight size={18} color={t.textSecondary} />
          </View>
          <View style={styles.swapSide}>
            <Avatar name={target.name} size="lg" />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.xs }}>
              {target.name.split(" ")[0].toUpperCase()}
            </Text>
            <Text variant="bodySmall" weight="bold">#{target.currentSlot}</Text>
            <Text variant="micro" tone="secondary">
              {target.cyclesAway < 0 ? `${Math.abs(target.cyclesAway)} cycle${Math.abs(target.cyclesAway) === 1 ? "" : "s"} ago` : `in ${target.cyclesAway} cycles`}
            </Text>
          </View>
        </View>

        {/* Direction summary */}
        <View style={[styles.directionCard, { backgroundColor: t.primarySoft }]}>
          <Sparkles size={14} color={t.primary} />
          <Text variant="caption" weight="semibold" style={{ color: t.primary, flex: 1, lineHeight: 16 }}>
            {target.cyclesAway < yourCyclesAway
              ? `Earlier payout: jump from cycle ${yourSlot} to cycle ${target.currentSlot}.`
              : `Later payout: wait ${target.cyclesAway - yourCyclesAway} more cycles for the pot.`}
          </Text>
        </View>

        {/* Candidate picker */}
        <View>
          <FieldLabel>Choose a partner</FieldLabel>
          <View style={{ gap: space.sm }}>
            {candidates.map((c) => {
              const active = c.memberId === targetId;
              const directionLabel = c.cyclesAway < yourCyclesAway ? "Earlier" : "Later";
              const directionColor = c.cyclesAway < yourCyclesAway ? t.success : t.warning;
              return (
                <Pressable
                  key={c.memberId}
                  onPress={() => setTargetId(c.memberId)}
                  style={[
                    styles.candidateRow,
                    {
                      backgroundColor: active ? t.primarySoft : t.surface,
                      borderColor: active ? t.primary : t.border,
                      borderWidth: active ? 1.5 : 1,
                    },
                  ]}
                >
                  <Avatar name={c.name} size="md" />
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <Text variant="bodySmall" weight="bold">{c.name}</Text>
                      <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
                        <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
                          T·{c.trust}
                        </Text>
                      </View>
                      <View style={[styles.directionPill, { backgroundColor: `${directionColor}22` }]}>
                        <Text variant="micro" weight="bold" style={{ color: directionColor, letterSpacing: 0.5 }}>
                          {directionLabel.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text variant="micro" tone="secondary" style={{ lineHeight: 14 }}>
                      Slot #{c.currentSlot} · {c.willingnessHint}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: active ? t.primary : t.borderStrong,
                        backgroundColor: active ? t.primary : "transparent",
                      },
                    ]}
                  >
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Reason */}
        <View>
          <FieldLabel>Reason</FieldLabel>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="A short reason helps your partner say yes faster…"
            placeholderTextColor={t.textMuted}
            multiline
            maxLength={200}
            style={[
              styles.reasonInput,
              { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border },
            ]}
          />
          <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
            {reason.length}/200
          </Text>
        </View>

        {/* Approval requirement */}
        <View style={[styles.approval, { backgroundColor: requiresOrgApproval ? t.warningSoft : t.successSoft }]}>
          {requiresOrgApproval ? (
            <AlertTriangle size={14} color={t.warning} />
          ) : (
            <ShieldCheck size={14} color={t.success} />
          )}
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: requiresOrgApproval ? t.warning : t.success }}>
              {requiresOrgApproval ? "Organiser approval required" : "Member-to-member only"}
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              {requiresOrgApproval
                ? "Big-jump swaps need the organiser to sign off before locking the new order."
                : "Once your partner accepts, the order updates immediately."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            Audit-logged. {target.name.split(" ")[0]} sees this request immediately.
          </Text>
        </View>
        <Button
          label={`Send swap to ${target.name.split(" ")[0]}`}
          fullWidth
          size="lg"
          trailingIcon={<Check size={18} color="#fff" strokeWidth={3} />}
        />
      </View>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
      {String(children).toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  swapPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  swapSide: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  swapBetween: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  directionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: space.md,
    borderRadius: radius.md,
  },
  candidateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  directionPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  reasonInput: {
    minHeight: 88,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
    textAlignVertical: "top",
  },
  approval: {
    flexDirection: "row",
    alignItems: "flex-start",
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
