import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Check,
  X,
  MessageCircle,
  Clock,
  AlertCircle,
  Stethoscope,
  Flower2,
  BookOpen,
  Siren,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Status = "Draft" | "Submitted" | "In review" | "Approved" | "Disbursed" | "Declined";
type Decision = "approved" | "rejected" | "pending";
type Filter = "pending" | "decided";

type Signer = {
  signerId: string;
  signerName: string;
  signerTrust: number;
  decision: Decision;
  decidedAt: string | null;
  note: string | null;
};

type Request = {
  id: string;
  fundId: string;
  member: string;
  memberId: string;
  memberTrust: number;
  amount: number;
  currency: string;
  reason: string;
  reasonKind: string;
  note: string;
  submitted: string;
  deadline: string;
  status: Status;
  signers: Signer[];
  signersRequired: number;
  evidence: number;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - NOW;
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d >= 1) return `${d}d ${h}h left`;
  if (h >= 1) return `${h}h left`;
  return "<1h left";
}

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function reasonIcon(id: string) {
  if (id === "medical")   return Stethoscope;
  if (id === "funeral")   return Flower2;
  if (id === "education") return BookOpen;
  if (id === "emergency") return Siren;
  return MoreHorizontal;
}

function statusMeta(s: Status, t: AppTheme) {
  if (s === "Submitted") return { color: t.warning, bg: t.warningSoft, label: "SUBMITTED" };
  if (s === "In review") return { color: t.primary, bg: t.primarySoft, label: "IN REVIEW" };
  if (s === "Approved")  return { color: t.success, bg: t.successSoft, label: "APPROVED" };
  if (s === "Disbursed") return { color: t.success, bg: t.successSoft, label: "DISBURSED" };
  if (s === "Declined")  return { color: t.danger,  bg: t.dangerSoft,  label: "DECLINED" };
  return { color: t.textMuted, bg: t.bgMuted, label: "DRAFT" };
}

// ---------------------------------------------------------------------------
// Quorum dots
// ---------------------------------------------------------------------------

function QuorumDots({ signers, t }: { signers: Signer[]; t: AppTheme }) {
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {signers.map((s, i) => {
        const color =
          s.decision === "approved" ? t.success :
          s.decision === "rejected" ? t.danger : t.bgMuted;
        const borderColor =
          s.decision === "approved" ? t.success :
          s.decision === "rejected" ? t.danger : t.borderStrong;
        return (
          <View
            key={s.signerId}
            style={[
              styles.qDot,
              { backgroundColor: color, borderColor },
            ]}
          >
            {s.decision === "approved" ? (
              <Check size={9} color="#fff" strokeWidth={3} />
            ) : s.decision === "rejected" ? (
              <X size={9} color="#fff" strokeWidth={3} />
            ) : null}
            <Text variant="micro" weight="bold" style={{ fontSize: 8, marginLeft: s.decision === "pending" ? 0 : 2, color: s.decision === "pending" ? t.textMuted : "#fff" }}>
              {i + 1}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryApprovals() {
  const t = useTheme();
  const requests = treasury.welfareRequests as Request[];

  const [filter, setFilter] = useState<Filter>("pending");
  const [expandedId, setExpandedId] = useState<string | null>(requests.find((r) => r.status === "In review")?.id ?? requests[0].id);

  const pending = requests.filter((r) => r.status === "Submitted" || r.status === "In review");
  const decided = requests.filter((r) => r.status === "Approved" || r.status === "Disbursed" || r.status === "Declined");
  const visible = filter === "pending" ? pending : decided;

  const counts = { pending: pending.length, decided: decided.length };
  const efBalance = (treasury.overview as { efBalance: number }).efBalance;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Approvals"
        subtitle={`${pending.length} pending · Welfare Fund`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary banner */}
        <View style={[styles.banner, { backgroundColor: t.warningSoft }]}>
          <View style={[styles.bannerIcon, { backgroundColor: t.surface }]}>
            <AlertCircle size={16} color={t.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" style={{ color: t.warning }}>
              {pending.length} request{pending.length === 1 ? "" : "s"} waiting on your signature
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
              Fund balance {formatCurrency(efBalance, "CHF")} · quorum 3 signers
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          <TabBtn label="Pending"  count={counts.pending}  active={filter === "pending"}  onPress={() => setFilter("pending")} t={t} />
          <TabBtn label="Decided"  count={counts.decided}  active={filter === "decided"}  onPress={() => setFilter("decided")} t={t} />
        </View>

        {/* Request cards */}
        <View style={{ gap: space.md }}>
          {visible.map((r) => (
            <RequestCard
              key={r.id}
              r={r}
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
              t={t}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TabBtn({
  label,
  count,
  active,
  onPress,
  t,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
    >
      <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
        {label}
      </Text>
      <View style={[styles.tabCount, { backgroundColor: active ? t.primarySoft : "transparent" }]}>
        <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textMuted }}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function RequestCard({
  r,
  expanded,
  onToggle,
  t,
}: {
  r: Request;
  expanded: boolean;
  onToggle: () => void;
  t: AppTheme;
}) {
  const status = statusMeta(r.status, t);
  const Icon = reasonIcon(r.reasonKind);
  const approvedCount = r.signers.filter((s) => s.decision === "approved").length;
  const isPending = r.status === "Submitted" || r.status === "In review";
  const expiringSoon = isPending && new Date(r.deadline).getTime() - NOW < 86400000 * 2;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.surface,
          borderColor: expiringSoon ? t.warning : t.border,
          borderWidth: expiringSoon ? 1.5 : 1,
        },
      ]}
    >
      <Pressable onPress={onToggle} style={styles.cardHeader}>
        <Avatar name={r.member} size="md" />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Text variant="bodySmall" weight="bold">{r.member}</Text>
            <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{r.memberTrust}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
              <Text variant="micro" weight="bold" style={{ color: status.color, letterSpacing: 0.5 }}>
                {status.label}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon size={11} color={t.textMuted} />
            <Text variant="micro" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>{r.reason}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <Text variant="bodySmall" weight="bold">{formatCurrency(r.amount, r.currency)}</Text>
          <Text variant="micro" tone="muted">{timeSince(r.submitted)}</Text>
        </View>
      </Pressable>

      {/* Quorum strip */}
      <View style={[styles.quorumStrip, { backgroundColor: t.bgMuted }]}>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
              QUORUM · {approvedCount}/{r.signersRequired}
            </Text>
            {isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Clock size={10} color={expiringSoon ? t.warning : t.textMuted} />
                <Text variant="micro" weight="bold" style={{ color: expiringSoon ? t.warning : t.textMuted, letterSpacing: 0.5 }}>
                  {timeUntil(r.deadline).toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
          <QuorumDots signers={r.signers} t={t} />
        </View>
      </View>

      {expanded ? (
        <View style={[styles.expanded, { borderTopColor: t.border }]}>
          {/* Note */}
          {r.note ? (
            <View style={[styles.noteBlock, { borderLeftColor: t.primary }]}>
              <Text variant="caption" tone="secondary" style={{ lineHeight: 16, fontStyle: "italic" }}>
                "{r.note}"
              </Text>
            </View>
          ) : null}

          {/* Signer list */}
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginTop: space.md, marginBottom: space.xs }}>
            SIGNERS
          </Text>
          {r.signers.map((s) => (
            <SignerRow key={s.signerId} s={s} t={t} />
          ))}

          {/* Evidence summary */}
          <View style={[styles.evidence, { backgroundColor: t.infoSoft }]}>
            <ShieldCheck size={12} color={t.info} />
            <Text variant="micro" weight="semibold" style={{ color: t.info, flex: 1 }}>
              {r.evidence} evidence file{r.evidence === 1 ? "" : "s"} attached
            </Text>
          </View>

          {/* Inline actions */}
          {isPending ? (
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
              <Pressable style={[styles.infoBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}>
                <MessageCircle size={14} color={t.textPrimary} />
                <Text variant="caption" weight="semibold">Ask</Text>
              </Pressable>
              <Pressable style={[styles.rejectBtn, { borderColor: t.danger, backgroundColor: t.surface }]}>
                <X size={14} color={t.danger} strokeWidth={3} />
                <Text variant="caption" weight="bold" style={{ color: t.danger }}>Reject</Text>
              </Pressable>
              <Pressable style={[styles.approveBtn, { backgroundColor: t.success }]}>
                <Check size={14} color="#fff" strokeWidth={3} />
                <Text variant="caption" weight="bold" style={{ color: "#fff" }}>Approve</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function SignerRow({ s, t }: { s: Signer; t: AppTheme }) {
  const meta =
    s.decision === "approved" ? { color: t.success, bg: t.successSoft, Icon: Check, label: "APPROVED" } :
    s.decision === "rejected" ? { color: t.danger,  bg: t.dangerSoft,  Icon: X,     label: "REJECTED" } :
    { color: t.textMuted, bg: t.bgMuted, Icon: Clock, label: "PENDING" };
  const Icon = meta.Icon;
  return (
    <View style={styles.signerRow}>
      <Avatar name={s.signerName} size="xs" />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold">{s.signerName}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{s.signerTrust}</Text>
          </View>
        </View>
        {s.note ? (
          <Text variant="micro" tone="secondary" style={{ marginTop: 1, lineHeight: 14 }}>"{s.note}"</Text>
        ) : (
          <Text variant="micro" tone="muted" style={{ marginTop: 1 }}>
            {s.decidedAt ? `Decided ${timeSince(s.decidedAt)}` : "Awaiting decision"}
          </Text>
        )}
      </View>
      <View style={[styles.signerPill, { backgroundColor: meta.bg }]}>
        <Icon size={10} color={meta.color} strokeWidth={3} />
        <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>{meta.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
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
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  quorumStrip: {
    flexDirection: "row",
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  qDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  expanded: {
    padding: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  noteBlock: {
    paddingLeft: space.md,
    borderLeftWidth: 3,
  },
  signerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.sm,
  },
  signerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  evidence: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  infoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  approveBtn: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
});
