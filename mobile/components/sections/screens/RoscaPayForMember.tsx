import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  Banknote,
  Heart,
  HandCoins,
  ShieldCheck,
  Check,
  Lock,
  AlertCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Member = {
  memberId: string;
  name: string;
  slot: number;
  trust: number;
  status: string;
  amount: number;
};

type Mode = "gift" | "loan";

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

export function RoscaPayForMember() {
  const t = useTheme();
  const data = rosca.cycleProgress as { perMember: number; currency: string; members: Member[] };
  const outstanding = useMemo(
    () => data.members.filter((m) => m.status === "Pending" || m.status === "Failed" || m.status === "Late"),
    [data.members],
  );

  const [memberId, setMemberId] = useState(outstanding[0]?.memberId ?? data.members[0].memberId);
  const [amount, setAmount] = useState(data.perMember);
  const [mode, setMode] = useState<Mode>("gift");

  const selected = data.members.find((m) => m.memberId === memberId)!;
  const partial = amount < data.perMember;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Pay for a member"
        subtitle="Main CHF Circle · Cycle 8"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text variant="h2" weight="bold">Help cover a contribution</Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
            Pay another member's contribution on their behalf. You decide whether it's a gift or a loan.
          </Text>
        </View>

        {/* Member picker */}
        <View>
          <FieldLabel>Choose a member</FieldLabel>
          <View style={{ gap: space.sm }}>
            {outstanding.map((m) => {
              const active = m.memberId === memberId;
              return (
                <Pressable
                  key={m.memberId}
                  onPress={() => setMemberId(m.memberId)}
                  style={[
                    styles.memberRow,
                    {
                      backgroundColor: active ? t.primarySoft : t.surface,
                      borderColor: active ? t.primary : t.border,
                      borderWidth: active ? 1.5 : 1,
                    },
                  ]}
                >
                  <Avatar name={m.name} size="md" />
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text variant="bodySmall" weight="bold">{m.name}</Text>
                      <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
                        <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
                          T·{m.trust}
                        </Text>
                      </View>
                    </View>
                    <Text variant="micro" tone="secondary">
                      Slot #{m.slot} · {m.status} · {formatCurrency(m.amount, data.currency)} due
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

        {/* Amount */}
        <View>
          <FieldLabel>Amount</FieldLabel>
          <View style={[styles.amountCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Banknote size={20} color={t.textSecondary} />
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
              {data.currency}
            </Text>
            <TextInput
              value={String(amount)}
              onChangeText={(v) => setAmount(Math.max(0, parseInt(v.replace(/[^0-9]/g, "") || "0", 10)))}
              keyboardType="number-pad"
              style={[styles.amountInput, { color: t.textPrimary }]}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 6, marginTop: space.sm }}>
            <Pressable
              onPress={() => setAmount(data.perMember)}
              style={[styles.chip, { backgroundColor: amount === data.perMember ? t.primarySoft : t.bgMuted }]}
            >
              <Text variant="micro" weight="bold" style={{ color: amount === data.perMember ? t.primary : t.textSecondary }}>
                Full · {formatCurrency(data.perMember, data.currency)}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAmount(Math.round(data.perMember / 2))}
              style={[styles.chip, { backgroundColor: t.bgMuted }]}
            >
              <Text variant="micro" weight="bold" tone="secondary">Half</Text>
            </Pressable>
          </View>
          {partial ? (
            <View style={[styles.partial, { backgroundColor: t.warningSoft }]}>
              <AlertCircle size={12} color={t.warning} />
              <Text variant="micro" weight="semibold" style={{ color: t.warning, flex: 1 }}>
                Partial · {formatCurrency(data.perMember - amount, data.currency)} still owed by {selected.name.split(" ")[0]}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Mode */}
        <View>
          <FieldLabel>Attribution</FieldLabel>
          <View style={{ gap: space.sm }}>
            <ModeRow
              Icon={Heart}
              title="Gift"
              body="No repayment expected. Recorded as a generous contribution."
              active={mode === "gift"}
              onSelect={() => setMode("gift")}
              t={t}
            />
            <ModeRow
              Icon={HandCoins}
              title="Loan"
              body={`${selected.name.split(" ")[0]} owes you ${formatCurrency(amount, data.currency)}. Auto-debits from her next payout when possible.`}
              active={mode === "loan"}
              onSelect={() => setMode("loan")}
              t={t}
            />
          </View>
        </View>

        {/* Disclosure */}
        <View style={[styles.disclosure, { backgroundColor: t.infoSoft }]}>
          <ShieldCheck size={14} color={t.info} />
          <Text variant="micro" style={{ color: t.info, flex: 1, lineHeight: 14 }}>
            {selected.name.split(" ")[0]} gets a notification with your name attached. The treasurer and the organiser also see this entry.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            Your usual payment method on file. Confirm on the next screen.
          </Text>
        </View>
        <Button
          label={`Pay ${formatCurrency(amount, data.currency)} for ${selected.name.split(" ")[0]}`}
          fullWidth
          size="lg"
          trailingIcon={<Check size={18} color="#fff" strokeWidth={3} />}
        />
      </View>
    </View>
  );
}

function ModeRow({
  Icon,
  title,
  body,
  active,
  onSelect,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  body: string;
  active: boolean;
  onSelect: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.modeRow,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.modeIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Icon size={16} color={active ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold">{title}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{body}</Text>
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
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
      {String(children).toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  memberRow: {
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
  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700",
    padding: 0,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  partial: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  modeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  disclosure: {
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
