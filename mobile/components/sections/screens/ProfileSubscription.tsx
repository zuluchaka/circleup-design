import { useEffect, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { ConfirmSheet } from "@/components/shared/ConfirmSheet";
import { useSnackbar } from "@/components/shared/Snackbar";
import { LinearGradient } from "expo-linear-gradient";
import { Crown, Check, Download, ChevronRight, Repeat, X, AlertTriangle } from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius, palette } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type { BillingEntry, SubscriptionStatus, UserProfile } from "@/product/sections/20-profile/types";

const sampleProfile = profile as unknown as UserProfile;

const STATUS_VISUAL: Record<
  SubscriptionStatus,
  { label: string; bg: string; fg: string }
> = {
  active: { label: "ACTIVE", bg: "rgba(16, 185, 129, 0.24)", fg: palette.emerald[400] },
  trial: { label: "TRIAL", bg: "rgba(99, 102, 241, 0.28)", fg: "#fff" },
  cancels_at_period_end: { label: "CANCELS SOON", bg: "rgba(245, 158, 11, 0.28)", fg: palette.amber[300] },
  past_due: { label: "PAYMENT FAILED", bg: "rgba(239, 68, 68, 0.28)", fg: palette.rose[100] },
  cancelled: { label: "CANCELLED", bg: "rgba(148, 163, 184, 0.28)", fg: "#fff" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

export function ProfileSubscription({
  data = sampleProfile,
  initialConfirm = false,
  initialCancelSnackbar = false,
}: { data?: UserProfile; initialConfirm?: boolean; initialCancelSnackbar?: boolean } = {}) {
  const t = useTheme();
  const { subscription } = data;
  const planLabel = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
  const isPastDue = subscription.status === "past_due";
  const statusVisual = STATUS_VISUAL[subscription.status];
  const [cancelOpen, setCancelOpen] = useState(initialConfirm);
  const { showSnackbar } = useSnackbar();

  const handleConfirmCancel = () => {
    setCancelOpen(false);
    showSnackbar({
      message: `Plus cancelled — renews to Free on ${formatDate(subscription.renewsOn)}.`,
      action: { label: "Undo", onPress: () => {} },
      duration: 10_000,
      bottomOffset: 24,
    });
  };

  useEffect(() => {
    if (!initialCancelSnackbar) return;
    showSnackbar({
      message: `Plus cancelled — renews to Free on ${formatDate(subscription.renewsOn)}.`,
      action: { label: "Undo", onPress: () => {} },
      duration: 0,
      bottomOffset: 24,
    });
  }, [initialCancelSnackbar, showSnackbar, subscription.renewsOn]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Subscription" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 64, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {isPastDue ? (
          <View style={[styles.pastDueBanner, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
            <AlertTriangle size={18} color={t.danger} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
                Payment failed
              </Text>
              <Text variant="caption" style={{ color: t.danger, opacity: 0.85, marginTop: 2 }}>
                Your card was declined on {formatDate(subscription.renewsOn)}. Update your payment method to keep Plus features.
              </Text>
            </View>
          </View>
        ) : null}

        <LinearGradient
          colors={
            isPastDue
              ? [palette.rose[600], palette.rose[700]]
              : [palette.indigo[600], palette.indigo[800]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planCard}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={styles.planIcon}>
              <Crown size={20} color={palette.amber[300]} fill={palette.amber[300]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.4 }}>
                CURRENT PLAN
              </Text>
              <Text variant="h1" weight="bold" style={{ color: "#fff" }}>
                CircleUp {planLabel}
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: statusVisual.bg }]}>
              <Text variant="micro" weight="bold" style={{ color: statusVisual.fg, letterSpacing: 0.4 }}>
                {statusVisual.label}
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View style={{ flex: 1 }}>
              <Text variant="display" weight="bold" style={{ color: "#fff" }}>
                CHF {subscription.amountPerCycle}
              </Text>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.78)" }}>
                per {subscription.cycle === "monthly" ? "month" : "year"} · renews {formatDate(subscription.renewsOn)}
              </Text>
            </View>
          </View>

          <View style={{ gap: 6, marginTop: space.md }}>
            {subscription.features.slice(0, 4).map((f) => (
              <View key={f} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={styles.featureDot}>
                  <Check size={10} color="#fff" strokeWidth={3} />
                </View>
                <Text variant="caption" style={{ color: "rgba(255,255,255,0.92)", flex: 1 }}>
                  {f}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable style={[styles.actionCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Repeat size={18} color={t.primary} />
            <Text variant="bodySmall" weight="semibold" style={{ marginTop: 6 }}>
              Switch plan
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
              Free · Plus · Pro
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionCard, { backgroundColor: t.surface, borderColor: t.border }]}
            onPress={() => setCancelOpen(true)}
          >
            <X size={18} color={t.danger} />
            <Text variant="bodySmall" weight="semibold" style={{ marginTop: 6, color: t.danger }}>
              Cancel subscription
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
              Keeps access until renewal
            </Text>
          </Pressable>
        </View>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            BILLING HISTORY
          </Text>
          <Card padded={false}>
            {subscription.history.map((entry, i) => (
              <BillingRow
                key={entry.id}
                entry={entry}
                last={i === subscription.history.length - 1}
              />
            ))}
          </Card>
        </View>
      </ScrollView>

      <ConfirmSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        icon={X}
        tone="danger"
        title="Cancel CircleUp Plus?"
        description={`You'll keep all Plus features until ${formatDate(subscription.renewsOn)}, then move to the Free plan. You'll lose: priority support, advanced analytics, more concurrent circles. Your data and circles stay safe.`}
        primaryLabel="Cancel subscription"
        secondaryLabel="Keep Plus"
        onPrimaryPress={handleConfirmCancel}
      />
    </View>
  );
}

function BillingRow({ entry, last }: { entry: BillingEntry; last: boolean }) {
  const t = useTheme();
  const isPaid = entry.status === "paid";
  return (
    <Pressable
      style={[
        styles.billingRow,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">
          {entry.description}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          {shortDate(entry.postedOn)} · {entry.id.toUpperCase()}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text variant="bodySmall" weight="bold">
          {entry.currency} {entry.amount.toFixed(2)}
        </Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: isPaid ? t.successSoft : t.dangerSoft, marginTop: 4 },
          ]}
        >
          <Text
            variant="micro"
            weight="bold"
            style={{ color: isPaid ? t.success : t.danger, letterSpacing: 0.4 }}
          >
            {entry.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Download size={16} color={t.textMuted} style={{ marginLeft: space.sm }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  planCard: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  planIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: space.md,
  },
  featureDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionCard: {
    flex: 1,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  billingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  pastDueBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
