import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  Banknote,
  MapPin,
  Hash,
  Check,
  Pencil,
  ShieldCheck,
  AlertTriangle,
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
  method: string | null;
};

type Location = {
  id: string;
  label: string;
  hint: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function genReceipt(cycle: number) {
  const stamp = "2026-05-22";
  const seq = "047";
  return `MAIN-C${cycle}-${stamp.replace(/-/g, "")}-${seq}`;
}

export function RoscaCashCollection() {
  const t = useTheme();
  const data = rosca.cycleProgress as { cycle: number; currency: string; perMember: number; members: Member[] };
  const locations = rosca.collectionLocations as Location[];

  const outstanding = useMemo(
    () => data.members.filter((m) => m.status === "Pending" || m.status === "Failed" || m.status === "Late"),
    [data.members],
  );

  const [memberId, setMemberId] = useState(outstanding[0]?.memberId ?? data.members[0].memberId);
  const [amount, setAmount] = useState(data.perMember);
  const [locationId, setLocationId] = useState(locations[0].id);
  const [notes, setNotes] = useState("");
  const [reconcileLater, setReconcileLater] = useState(false);

  const selectedMember = data.members.find((m) => m.memberId === memberId)!;
  const selectedLocation = locations.find((l) => l.id === locationId)!;
  const receipt = genReceipt(data.cycle);
  const partial = amount < data.perMember;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Record cash collection"
        subtitle={`Cycle ${data.cycle} · Main CHF Circle`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View>
          <Text variant="h2" weight="bold">Manual entry</Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
            For hybrid circles when a member pays in person. The receipt is generated automatically and the payment moves the cycle forward.
          </Text>
        </View>

        {/* Member selector — pinned outstanding row */}
        <View>
          <FieldLabel>Member</FieldLabel>
          <View style={[styles.memberCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Avatar name={selectedMember.name} size="md" />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Text variant="bodySmall" weight="bold">{selectedMember.name}</Text>
                <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
                  <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{selectedMember.trust}</Text>
                </View>
              </View>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
                Slot #{selectedMember.slot} · {selectedMember.status === "Failed" ? `${selectedMember.status} · ${formatCurrency(selectedMember.amount, data.currency)} due` : `${formatCurrency(selectedMember.amount, data.currency)} due`}
              </Text>
            </View>
            <Pressable style={[styles.chooserBtn, { backgroundColor: t.bgMuted }]}>
              <Pencil size={12} color={t.textPrimary} />
              <Text variant="micro" weight="bold" tone="primary">CHANGE</Text>
            </Pressable>
          </View>

          {/* Outstanding chips for quick swap */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: space.sm }}>
            {outstanding.slice(0, 4).map((m) => {
              const active = m.memberId === memberId;
              return (
                <Pressable
                  key={m.memberId}
                  onPress={() => setMemberId(m.memberId)}
                  style={[
                    styles.memberChip,
                    {
                      backgroundColor: active ? t.primarySoft : t.surface,
                      borderColor: active ? t.primary : t.border,
                      borderWidth: active ? 1.5 : 1,
                    },
                  ]}
                >
                  <Avatar name={m.name} size="xs" />
                  <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textPrimary }}>
                    {m.name.split(" ")[0]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Amount */}
        <View>
          <FieldLabel>Amount received</FieldLabel>
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
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="micro" tone="muted" weight="semibold">Expected</Text>
              <Text variant="caption" weight="bold">{data.perMember}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 6, marginTop: space.sm }}>
            <Pressable
              onPress={() => setAmount(data.perMember)}
              style={[styles.amountChip, { backgroundColor: amount === data.perMember ? t.primarySoft : t.bgMuted }]}
            >
              <Text variant="micro" weight="bold" style={{ color: amount === data.perMember ? t.primary : t.textSecondary }}>
                Full · {formatCurrency(data.perMember, data.currency)}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAmount(Math.round(data.perMember / 2))}
              style={[styles.amountChip, { backgroundColor: t.bgMuted }]}
            >
              <Text variant="micro" weight="bold" tone="secondary">Half</Text>
            </Pressable>
            <Pressable
              onPress={() => setAmount(0)}
              style={[styles.amountChip, { backgroundColor: t.bgMuted }]}
            >
              <Text variant="micro" weight="bold" tone="secondary">Other</Text>
            </Pressable>
          </View>

          {partial ? (
            <View style={[styles.partialNote, { backgroundColor: t.warningSoft }]}>
              <AlertTriangle size={12} color={t.warning} />
              <Text variant="micro" weight="semibold" style={{ color: t.warning, flex: 1 }}>
                Partial payment · {formatCurrency(data.perMember - amount, data.currency)} still owed
              </Text>
            </View>
          ) : null}
        </View>

        {/* Location */}
        <View>
          <FieldLabel>Where collected</FieldLabel>
          <View style={{ gap: space.sm }}>
            {locations.map((loc) => {
              const active = loc.id === locationId;
              return (
                <Pressable
                  key={loc.id}
                  onPress={() => setLocationId(loc.id)}
                  style={[
                    styles.locRow,
                    {
                      backgroundColor: active ? t.primarySoft : t.surface,
                      borderColor: active ? t.primary : t.border,
                      borderWidth: active ? 1.5 : 1,
                    },
                  ]}
                >
                  <View style={[styles.locIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
                    <MapPin size={14} color={active ? t.primary : t.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="bold">{loc.label}</Text>
                    <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{loc.hint}</Text>
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

        {/* Notes */}
        <View>
          <FieldLabel>Notes</FieldLabel>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add a short note (witness, conditions, follow-up)…"
            placeholderTextColor={t.textMuted}
            multiline
            maxLength={200}
            style={[
              styles.notesInput,
              {
                color: t.textPrimary,
                backgroundColor: t.surface,
                borderColor: t.border,
              },
            ]}
          />
          <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
            {notes.length}/200 · optional
          </Text>
        </View>

        {/* Receipt preview + reconciliation */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            RECEIPT
          </Text>
          <View style={[styles.receiptRow, { borderBottomColor: t.border }]}>
            <Hash size={14} color={t.textSecondary} />
            <Text variant="caption" tone="secondary" style={{ flex: 1 }}>Number</Text>
            <Text variant="caption" weight="bold" style={{ fontFamily: "Menlo" }}>{receipt}</Text>
          </View>
          <View style={[styles.receiptRow, { borderBottomColor: t.border }]}>
            <Text variant="caption" tone="secondary" style={{ flex: 1, paddingLeft: 22 }}>Issued to</Text>
            <Text variant="caption" weight="bold">{selectedMember.name}</Text>
          </View>
          <View style={[styles.receiptRow, { borderBottomColor: t.border }]}>
            <Text variant="caption" tone="secondary" style={{ flex: 1, paddingLeft: 22 }}>Location</Text>
            <Text variant="caption" weight="bold">{selectedLocation.label}</Text>
          </View>
          <View style={[styles.receiptRow]}>
            <Text variant="caption" tone="secondary" style={{ flex: 1, paddingLeft: 22 }}>Amount</Text>
            <Text variant="caption" weight="bold" style={{ color: t.success }}>
              {formatCurrency(amount, data.currency)}
            </Text>
          </View>
        </Card>

        {/* Reconciliation toggle */}
        <Pressable
          onPress={() => setReconcileLater(!reconcileLater)}
          style={[styles.toggle, { backgroundColor: reconcileLater ? t.warningSoft : t.successSoft }]}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: reconcileLater ? "transparent" : (reconcileLater ? t.warning : t.success),
                borderColor: reconcileLater ? t.warning : t.success,
              },
            ]}
          >
            {!reconcileLater ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: reconcileLater ? t.warning : t.success }}>
              {reconcileLater ? "Reconcile later (Holding Account)" : "Bank deposit confirmed"}
            </Text>
            <Text variant="micro" style={{ color: reconcileLater ? t.warning : t.success, marginTop: 2 }}>
              {reconcileLater
                ? "Held outside the Circle Account until you reconcile."
                : "Cash already in the safe / deposit slip on file."}
            </Text>
          </View>
        </Pressable>
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <ShieldCheck size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            This entry is logged and visible in the Circle Account ledger.
          </Text>
        </View>
        <Button
          label={`Record ${formatCurrency(amount, data.currency)} · ${selectedMember.name.split(" ")[0]}`}
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
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  chooserBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
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
  amountChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  partialNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  locIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
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
  notesInput: {
    minHeight: 80,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
    textAlignVertical: "top",
  },
  receiptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
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
