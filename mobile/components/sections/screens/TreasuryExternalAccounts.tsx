import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Building2,
  CreditCard,
  Smartphone,
  RefreshCw,
  Plus,
  Check,
  Clock,
  AlertCircle,
  ShieldCheck,
  Link2,
  Eye,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Kind = "bank" | "card_processor" | "wallet";
type Status = "linked" | "reauth_needed" | "expired" | "pending";

type Account = {
  id: string;
  bank: string;
  accountMask: string;
  kind: Kind;
  status: Status;
  defaultCurrency: string;
  lastSync: string;
  syncFrequency: string;
  notes: string | null;
  rolesAllowed: string[];
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function kindMeta(k: Kind) {
  if (k === "bank")            return { Icon: Building2,  label: "Bank" };
  if (k === "card_processor")  return { Icon: CreditCard, label: "Card processor" };
  return { Icon: Smartphone, label: "Wallet" };
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "linked")         return { color: t.success, bg: t.successSoft, Icon: Check,        label: "LINKED" };
  if (s === "reauth_needed")  return { color: t.warning, bg: t.warningSoft, Icon: RefreshCw,    label: "RE-AUTH" };
  if (s === "expired")        return { color: t.danger,  bg: t.dangerSoft,  Icon: AlertCircle,  label: "EXPIRED" };
  return { color: t.info, bg: t.infoSoft, Icon: Clock, label: "PENDING" };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryExternalAccounts() {
  const t = useTheme();
  const panel = treasury.externalAccountsPanel as {
    totals: { linked: number; needsAttention: number };
    accounts: Account[];
  };

  const sorted = [...panel.accounts].sort((a, b) => {
    const order: Record<Status, number> = { reauth_needed: 0, expired: 1, pending: 2, linked: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="External accounts"
        subtitle="Diaspora Circle Geneva"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header summary */}
        <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
              LINKED
            </Text>
            <Text variant="h2" weight="bold" style={{ color: t.success, marginTop: 2 }}>
              {panel.totals.linked}
            </Text>
          </View>
          <View style={[styles.sumSep, { backgroundColor: t.border }]} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
              NEEDS ATTENTION
            </Text>
            <Text
              variant="h2"
              weight="bold"
              style={{ color: panel.totals.needsAttention > 0 ? t.warning : t.textPrimary, marginTop: 2 }}
            >
              {panel.totals.needsAttention}
            </Text>
          </View>
        </View>

        {/* Attention banner */}
        {panel.totals.needsAttention > 0 ? (
          <View style={[styles.attentionBanner, { backgroundColor: t.warningSoft }]}>
            <View style={[styles.attentionIcon, { backgroundColor: t.surface }]}>
              <AlertCircle size={14} color={t.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.warning }}>
                {panel.totals.needsAttention} account{panel.totals.needsAttention === 1 ? "" : "s"} need attention
              </Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
                Reconnect to keep imports and reconciliation flowing.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Accounts list */}
        <View style={{ gap: space.md }}>
          {sorted.map((a) => (
            <AccountCard key={a.id} a={a} t={t} />
          ))}
        </View>

        {/* Compliance footer */}
        <View style={[styles.compliance, { backgroundColor: t.bgMuted }]}>
          <ShieldCheck size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted" style={{ flex: 1, lineHeight: 14 }}>
            CircleUp never stores raw credentials. Auth happens over OAuth or PSD2 with audit logging on every sync.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label="Link a new account"
          fullWidth
          size="lg"
          trailingIcon={<Plus size={16} color="#fff" />}
        />
      </View>
    </View>
  );
}

function AccountCard({ a, t }: { a: Account; t: AppTheme }) {
  const kind = kindMeta(a.kind);
  const KindIcon = kind.Icon;
  const status = statusMeta(a.status, t);
  const StatusIcon = status.Icon;
  const needsAttention = a.status === "reauth_needed" || a.status === "expired";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.surface,
          borderColor: needsAttention ? status.color : t.border,
          borderWidth: needsAttention ? 1.5 : 1,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.bankIcon, { backgroundColor: t.bgMuted }]}>
          <KindIcon size={18} color={t.textPrimary} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Text variant="bodySmall" weight="bold">{a.bank}</Text>
            <View style={[styles.kindPill, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
                {kind.label.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text variant="micro" tone="secondary" style={{ fontFamily: "Menlo" }}>{a.accountMask}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <StatusIcon size={10} color={status.color} strokeWidth={3} />
          <Text variant="micro" weight="bold" style={{ color: status.color, letterSpacing: 0.5 }}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Meta row */}
      <View style={[styles.meta, { backgroundColor: t.bgMuted }]}>
        <MetaCell label="Default" value={a.defaultCurrency} t={t} />
        <Sep t={t} />
        <MetaCell label="Last sync" value={timeAgo(a.lastSync)} t={t} />
        <Sep t={t} />
        <MetaCell label="Cadence" value={a.syncFrequency.replace("Every ", "")} t={t} />
      </View>

      {/* Roles allowed */}
      {a.rolesAllowed.length > 0 ? (
        <View style={styles.roles}>
          {a.rolesAllowed.map((r) => (
            <View key={r} style={[styles.rolePill, { backgroundColor: t.primarySoft }]}>
              <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.5 }}>
                {r.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Notes */}
      {a.notes ? (
        <Text variant="micro" tone="secondary" style={{ paddingHorizontal: space.md, lineHeight: 14 }}>
          {a.notes}
        </Text>
      ) : null}

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: t.border }]}>
        {needsAttention ? (
          <Pressable style={[styles.primaryBtn, { backgroundColor: status.color }]}>
            <RefreshCw size={12} color="#fff" />
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
              {a.status === "expired" ? "Re-link account" : "Re-authenticate"}
            </Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}>
            <Eye size={12} color={t.textPrimary} />
            <Text variant="caption" weight="bold">View statements</Text>
          </Pressable>
        )}
        <Pressable style={[styles.linkBtn, { backgroundColor: t.bgMuted }]}>
          <Link2 size={11} color={t.textPrimary} />
          <Text variant="micro" weight="bold">Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MetaCell({ label, value, t }: { label: string; value: string; t: AppTheme }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.5, fontSize: 9 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="caption" weight="bold" style={{ marginTop: 2 }} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function Sep({ t }: { t: AppTheme }) {
  return <View style={{ width: 1, height: 24, backgroundColor: t.border }} />;
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  sumSep: {
    width: 1,
    height: 36,
  },
  attentionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  attentionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: radius.md,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  kindPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
  },
  roles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    marginTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  compliance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
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
