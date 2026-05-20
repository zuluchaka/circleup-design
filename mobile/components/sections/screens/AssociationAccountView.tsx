import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  AlertTriangle,
  ShieldCheck,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  Snowflake,
  Lock,
  Target,
  ScrollText,
  Building2,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import {
  findAssociationAccountByNumber,
  ENTRY_TYPE_LABEL,
  type AccountStatus,
  type AssociationAccount,
  type AssociationAccountEntry,
  type FundCategory,
} from "@/data/associationAccounts";

// ============================================================================
// Helpers
// ============================================================================

function fmtMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtRelative(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return fmtDate(iso);
}

function statusPill(s: AccountStatus, t: AppTheme) {
  switch (s) {
    case "active":
      return { bg: t.successSoft, fg: t.success, label: "Active" };
    case "frozen":
      return { bg: t.infoSoft, fg: t.info, label: "Frozen" };
    case "closed":
      return { bg: t.bgMuted, fg: t.textSecondary, label: "Closed" };
  }
}

// ============================================================================
// Sub-components
// ============================================================================

function FundCard({ fc }: { fc: FundCategory }) {
  const t = useTheme();
  const pct = fc.targetAmount && fc.targetAmount > 0 ? Math.min(fc.balance / fc.targetAmount, 1) : null;
  const variance = fc.targetAmount ? fc.balance - fc.targetAmount : null;
  const onTrack = pct === null ? null : pct >= 0.75;
  const barColor = onTrack === null ? t.primary : onTrack ? t.success : t.warning;

  return (
    <View style={[styles.fundCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View style={[styles.fundDot, { backgroundColor: barColor }]} />
        <Text variant="caption" weight="bold" numberOfLines={1} style={{ flex: 1 }}>
          {fc.name}
        </Text>
      </View>
      <Text variant="h3" weight="bold" style={{ marginTop: space.xs }}>
        {fmtMoney(fc.balance, fc.currency)}
      </Text>
      {fc.targetAmount ? (
        <>
          <View style={[styles.fundBar, { backgroundColor: t.bgMuted, marginTop: space.sm }]}>
            <View
              style={[
                styles.fundBarFg,
                {
                  width: `${(pct ?? 0) * 100}%`,
                  backgroundColor: barColor,
                },
              ]}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
            <Text variant="micro" tone="muted">
              Target {fc.currency} {fc.targetAmount.toLocaleString("en-CH")}
            </Text>
            <Text
              variant="micro"
              weight="semibold"
              style={{ color: variance && variance >= 0 ? t.success : t.warning }}
            >
              {variance && variance >= 0 ? "+" : ""}
              {variance != null ? fmtMoney(variance, fc.currency).replace(fc.currency + " ", "") : ""}
            </Text>
          </View>
        </>
      ) : (
        <Text variant="micro" tone="muted" style={{ marginTop: space.sm }}>
          No target set
        </Text>
      )}
    </View>
  );
}

function EntryRow({ e }: { e: AssociationAccountEntry }) {
  const t = useTheme();
  const isCredit = e.direction === "credit";
  const iconBg = isCredit ? t.successSoft : t.dangerSoft;
  const iconFg = isCredit ? t.success : t.danger;
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

  return (
    <View style={[styles.entryRow, { borderColor: t.border }]}>
      <View style={[styles.entryIcon, { backgroundColor: iconBg }]}>
        <Icon size={14} color={iconFg} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="bodySmall" weight="semibold" numberOfLines={1} style={{ flex: 1 }}>
            {ENTRY_TYPE_LABEL[e.entryType]}
          </Text>
          {e.fundCategoryName ? (
            <View style={[styles.fundChip, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" weight="semibold" tone="secondary">
                {e.fundCategoryName}
              </Text>
            </View>
          ) : null}
        </View>
        {e.description ? (
          <Text variant="caption" tone="secondary" numberOfLines={1}>
            {e.description}
          </Text>
        ) : null}
        <Text variant="micro" tone="muted">
          {fmtRelative(e.postedAt)} · by {e.recordedByName ?? "—"}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          variant="bodySmall"
          weight="bold"
          style={{ color: isCredit ? t.success : t.danger }}
        >
          {isCredit ? "+" : "-"}
          {fmtMoney(e.amount, e.currency).replace(e.currency + " ", "")}
        </Text>
        <Text variant="micro" tone="muted">
          bal {e.runningBalance.toLocaleString("en-CH", { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// Main
// ============================================================================

export function AssociationAccountView({ accountNumber }: { accountNumber: string }) {
  const t = useTheme();
  const account = findAssociationAccountByNumber(accountNumber);

  if (!account) {
    return (
      <View style={[styles.notFound, { backgroundColor: t.bg }]}>
        <View style={[styles.notFoundIcon, { backgroundColor: t.bgMuted }]}>
          <Banknote size={28} color={t.textMuted} />
        </View>
        <Text variant="h3" weight="semibold" align="center">
          Account not found
        </Text>
        <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.xs }}>
          The account number {accountNumber} doesn't match any provisioned account.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.btnPrimary, { backgroundColor: t.primary, marginTop: space.lg }]}
        >
          <ChevronLeft size={14} color="#fff" />
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
            Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return <AccountDetail account={account} />;
}

function AccountDetail({ account }: { account: AssociationAccount }) {
  const t = useTheme();
  const sPill = statusPill(account.status, t);
  const isActive = account.status === "active";

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Top bar (subtle, lives above the gradient balance card) */}
        <View style={[styles.topBar, { backgroundColor: t.bg }]}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: t.bgMuted }]}>
            <ChevronLeft size={18} color={t.textPrimary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              ASSOCIATION ACCOUNT
            </Text>
            <Text variant="caption" weight="semibold" style={{ fontFamily: "monospace" }}>
              {account.accountNumber}
            </Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: sPill.bg }]}>
            <Text variant="micro" weight="bold" style={{ color: sPill.fg }}>
              {sPill.label}
            </Text>
          </View>
        </View>

        {/* Association header strip */}
        <View style={{ paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.md, flexDirection: "row", alignItems: "center", gap: space.sm }}>
          {account.associationLogo ? (
            <Image source={{ uri: account.associationLogo }} style={styles.assocLogo} />
          ) : (
            <View style={[styles.assocLogo, { backgroundColor: t.bgMuted, alignItems: "center", justifyContent: "center" }]}>
              <Building2 size={18} color={t.textMuted} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
              {account.associationName}
            </Text>
            <Text variant="micro" tone="secondary">
              {account.accountType} · {account.currency}
            </Text>
          </View>
        </View>

        {/* Balance gradient card */}
        <View style={{ paddingHorizontal: space.lg }}>
          <LinearGradient
            colors={[palette.indigo[500], palette.indigo[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
              CURRENT BALANCE
            </Text>
            <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
              {fmtMoney(account.balance, account.currency)}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: space.sm }}>
              <View style={[styles.balanceBadge]}>
                <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {account.accountType.toUpperCase()}
                </Text>
              </View>
              {account.approvalThreshold ? (
                <Text variant="micro" style={{ color: "rgba(255,255,255,0.65)" }}>
                  · Approval ≥ {account.currency} {account.approvalThreshold.toLocaleString("en-CH")}
                </Text>
              ) : null}
            </View>

            {/* Action chips */}
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.lg }}>
              <Pressable
                disabled={!isActive}
                style={[
                  styles.actionChip,
                  { backgroundColor: "rgba(255,255,255,0.18)", opacity: isActive ? 1 : 0.4 },
                ]}
              >
                <Plus size={14} color="#fff" />
                <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                  Credit
                </Text>
              </Pressable>
              <Pressable
                disabled={!isActive}
                style={[
                  styles.actionChip,
                  { backgroundColor: "rgba(255,255,255,0.18)", opacity: isActive ? 1 : 0.4 },
                ]}
              >
                <Minus size={14} color="#fff" />
                <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                  Debit
                </Text>
              </Pressable>
              <Pressable
                disabled={!isActive}
                style={[
                  styles.actionChip,
                  { backgroundColor: "rgba(255,255,255,0.18)", opacity: isActive ? 1 : 0.4 },
                ]}
              >
                <ArrowUpRight size={14} color="#fff" />
                <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                  Transfer
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Restricted banner */}
        {account.isRestricted ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
            <View style={[styles.banner, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
              <AlertTriangle size={14} color={t.danger} />
              <View style={{ flex: 1 }}>
                <Text variant="caption" weight="bold" style={{ color: t.danger }}>
                  Restricted mode
                </Text>
                <Text variant="micro" style={{ color: t.danger }}>
                  {account.restrictionReason ?? "Upstream BR suspended · only dues + fee entries allowed."}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Frozen / closed banner */}
        {account.status === "frozen" ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
            <View style={[styles.banner, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
              <Snowflake size={14} color={t.info} />
              <Text variant="caption" weight="semibold" style={{ color: t.info, flex: 1 }}>
                Account frozen · contact platform admin to thaw
              </Text>
            </View>
          </View>
        ) : null}
        {account.status === "closed" ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
            <View style={[styles.banner, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Lock size={14} color={t.textMuted} />
              <Text variant="caption" weight="semibold" tone="secondary" style={{ flex: 1 }}>
                Account closed · read-only
              </Text>
            </View>
          </View>
        ) : null}

        {/* Approvals strip */}
        {account.pendingApprovals && account.pendingApprovals > 0 ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
            <Pressable style={[styles.approvalStrip, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
              <ShieldCheck size={16} color={t.warning} />
              <View style={{ flex: 1 }}>
                <Text variant="caption" weight="bold" style={{ color: t.warning }}>
                  {account.pendingApprovals} transaction
                  {account.pendingApprovals === 1 ? "" : "s"} need president approval
                </Text>
                <Text variant="micro" style={{ color: t.warning }}>
                  Above threshold of {account.currency} {(account.approvalThreshold ?? 0).toLocaleString("en-CH")}
                </Text>
              </View>
              <ChevronRight size={16} color={t.warning} />
            </Pressable>
          </View>
        ) : null}

        {/* Fund categories */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Target size={14} color={t.textPrimary} />
            <Text variant="h3" weight="bold">
              Fund categories
            </Text>
          </View>
          <Text variant="caption" tone="accent" weight="semibold">
            Manage
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.lg, paddingVertical: space.sm, gap: space.sm }}
        >
          {account.fundCategories.map((fc) => (
            <FundCard key={fc.id} fc={fc} />
          ))}
        </ScrollView>

        {/* Entries */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ScrollText size={14} color={t.textPrimary} />
            <Text variant="h3" weight="bold">
              Recent entries
            </Text>
          </View>
          <Text variant="caption" tone="accent" weight="semibold">
            Full ledger
          </Text>
        </View>

        {account.recentEntries.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodySmall" tone="secondary" align="center">
              Account ready · waiting for first dues collection.
            </Text>
            {isActive ? (
              <Pressable style={[styles.btnPrimary, { backgroundColor: t.primary, marginTop: space.lg }]}>
                <Plus size={14} color="#fff" />
                <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                  Record opening credit
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.sm }}>
            {account.recentEntries.map((e) => (
              <EntryRow key={e.id} e={e} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 56,
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  assocLogo: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: palette.slate[200],
  },

  // Balance card
  balanceCard: {
    borderRadius: radius.lg,
    padding: space.lg,
    shadowColor: "rgba(46, 51, 138, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  balanceBadge: {
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  actionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },

  // Banners + strips
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  approvalStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  // Fund card
  fundCard: {
    width: 180,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  fundDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fundBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  fundBarFg: {
    height: "100%",
  },

  // Entry row
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  entryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fundChip: {
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },

  // Empty
  empty: {
    paddingHorizontal: space.xl,
    paddingVertical: space.xl,
    alignItems: "center",
  },

  // Not found
  notFound: {
    flex: 1,
    paddingHorizontal: space.xl,
    paddingTop: 96,
    alignItems: "center",
  },
  notFoundIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
  },
});
