import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Switch } from "react-native";
import {
  Landmark,
  CreditCard,
  Smartphone,
  Calendar,
  ShieldCheck,
  Check,
  Sparkles,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Method = {
  id: string;
  label: string;
  kind: "bank" | "card" | "wallet";
  default: boolean;
};

type AutoPay = {
  enabled: boolean;
  primaryMethodId: string;
  backupMethodId: string | null;
  nextChargeDate: string;
  nextChargeAmount: number;
  currency: string;
  scheduleNote: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function methodIcon(kind: Method["kind"]) {
  return kind === "bank" ? Landmark : kind === "card" ? CreditCard : Smartphone;
}

export function RoscaAutoPay() {
  const t = useTheme();
  const setup = rosca.autoPay as AutoPay;
  const methods = rosca.paymentMethods as Method[];

  const [enabled, setEnabled] = useState(setup.enabled);
  const [primaryId, setPrimaryId] = useState(setup.primaryMethodId);
  const [backupId, setBackupId] = useState<string | null>(setup.backupMethodId);

  const primary = methods.find((m) => m.id === primaryId)!;
  const backup = backupId ? methods.find((m) => m.id === backupId) : null;
  const noBackupRisk = enabled && !backup;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Auto-pay"
        subtitle="Main CHF Circle"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status hero */}
        <View style={[styles.hero, { backgroundColor: enabled ? t.success : t.bgMuted }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {enabled ? <PlayCircle size={14} color="#fff" /> : <PauseCircle size={14} color={t.textSecondary} />}
              <Text variant="micro" weight="bold" style={{ color: enabled ? "rgba(255,255,255,0.85)" : t.textSecondary, letterSpacing: 1.5 }}>
                {enabled ? "ACTIVE" : "PAUSED"}
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: "rgba(0,0,0,0.15)", true: "rgba(255,255,255,0.45)" }}
              thumbColor={enabled ? "#fff" : t.textMuted}
            />
          </View>
          <Text variant="h2" weight="bold" style={{ color: enabled ? "#fff" : t.textPrimary, marginTop: space.sm }}>
            {enabled ? "You're set" : "Auto-pay is off"}
          </Text>
          <Text variant="bodySmall" style={{ color: enabled ? "rgba(255,255,255,0.92)" : t.textSecondary, marginTop: 4, lineHeight: 19 }}>
            {enabled
              ? `Next charge ${formatCurrency(setup.nextChargeAmount, setup.currency)} on ${fullDate(setup.nextChargeDate)}.`
              : "Turn this on to never miss a contribution. You can pause anytime."}
          </Text>
        </View>

        {/* Primary method */}
        <View>
          <FieldLabel>Primary method</FieldLabel>
          <View style={{ gap: space.sm }}>
            {methods.map((m) => (
              <MethodRow
                key={m.id}
                method={m}
                selected={primaryId === m.id}
                onSelect={() => {
                  setPrimaryId(m.id);
                  if (backupId === m.id) setBackupId(null);
                }}
                role="primary"
                t={t}
              />
            ))}
          </View>
        </View>

        {/* Backup method */}
        <View>
          <FieldLabel>Backup method</FieldLabel>
          <Text variant="micro" tone="secondary" style={{ marginBottom: space.sm, lineHeight: 14 }}>
            Used automatically if the primary method fails. Highly recommended.
          </Text>
          <View style={{ gap: space.sm }}>
            <NoBackupRow active={backupId === null} onSelect={() => setBackupId(null)} t={t} />
            {methods
              .filter((m) => m.id !== primaryId)
              .map((m) => (
                <MethodRow
                  key={m.id}
                  method={m}
                  selected={backupId === m.id}
                  onSelect={() => setBackupId(m.id)}
                  role="backup"
                  t={t}
                />
              ))}
          </View>
        </View>

        {/* Risk warning when no backup */}
        {noBackupRisk ? (
          <View style={[styles.warn, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
            <AlertTriangle size={14} color={t.warning} />
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" style={{ color: t.warning }}>
                No backup method
              </Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
                If {primary.label} declines, your contribution falls into the Emergency Fund's queue.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Schedule summary */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            SCHEDULE
          </Text>
          <View style={styles.row}>
            <Calendar size={14} color={t.textSecondary} />
            <Text variant="bodySmall" tone="secondary" style={{ flex: 1 }}>Next charge</Text>
            <Text variant="bodySmall" weight="bold">{fullDate(setup.nextChargeDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" tone="secondary" style={{ flex: 1, paddingLeft: 22 }}>Amount</Text>
            <Text variant="bodySmall" weight="bold">
              {formatCurrency(setup.nextChargeAmount, setup.currency)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" tone="secondary" style={{ flex: 1, paddingLeft: 22 }}>Primary</Text>
            <Text variant="bodySmall" weight="bold">{primary.label}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" tone="secondary" style={{ flex: 1, paddingLeft: 22 }}>Backup</Text>
            <Text variant="bodySmall" weight="bold" style={{ color: backup ? t.textPrimary : t.warning }}>
              {backup ? backup.label : "None set"}
            </Text>
          </View>
          <View style={[styles.note, { backgroundColor: t.bgMuted }]}>
            <Sparkles size={11} color={t.textMuted} />
            <Text variant="micro" tone="muted" style={{ flex: 1, lineHeight: 14 }}>
              {setup.scheduleNote}
            </Text>
          </View>
        </Card>

        {/* Reassurance */}
        <View style={[styles.disclosure, { backgroundColor: t.successSoft }]}>
          <ShieldCheck size={14} color={t.success} />
          <Text variant="micro" style={{ color: t.success, flex: 1, lineHeight: 14 }}>
            You can pause or cancel auto-pay at any time. Your status updates immediately.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label={enabled ? "Save changes" : "Turn on auto-pay"}
          fullWidth
          size="lg"
          trailingIcon={<Check size={18} color="#fff" strokeWidth={3} />}
        />
      </View>
    </View>
  );
}

function MethodRow({
  method,
  selected,
  onSelect,
  role,
  t,
}: {
  method: Method;
  selected: boolean;
  onSelect: () => void;
  role: "primary" | "backup";
  t: AppTheme;
}) {
  const Icon = methodIcon(method.kind);
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.methodRow,
        {
          backgroundColor: selected ? t.primarySoft : t.surface,
          borderColor: selected ? t.primary : t.border,
          borderWidth: selected ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.methodIcon, { backgroundColor: selected ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Icon size={16} color={selected ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="bodySmall" weight="bold">{method.label}</Text>
          {method.default ? (
            <View style={[styles.miniPill, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>DEFAULT</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          {method.kind === "bank" ? "1–2 business days · No fees" :
           method.kind === "card" ? "Instant · 1.4% processing fee" :
           "Instant · No fees"}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? t.primary : t.borderStrong,
            backgroundColor: selected ? t.primary : "transparent",
          },
        ]}
      >
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function NoBackupRow({ active, onSelect, t }: { active: boolean; onSelect: () => void; t: AppTheme }) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.methodRow,
        {
          backgroundColor: active ? t.warningSoft : t.surface,
          borderColor: active ? t.warning : t.border,
          borderWidth: active ? 1.5 : 1,
          borderStyle: "dashed",
        },
      ]}
    >
      <View style={[styles.methodIcon, { backgroundColor: t.bgMuted }]}>
        <AlertTriangle size={16} color={active ? t.warning : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold">No backup (not recommended)</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          Auto-pay won't retry if the primary method fails.
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: active ? t.warning : t.borderStrong,
            backgroundColor: active ? t.warning : "transparent",
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
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  miniPill: {
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
  warn: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: 6,
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
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
