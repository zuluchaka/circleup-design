import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  ShieldCheck,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Pencil,
  CheckCircle2,
  Eye,
  ArrowRight,
  Hash,
  Calendar,
  Sparkles,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type AuditKind = "posted" | "adjusted" | "matched" | "reconciled" | "viewed";

type AuditEvent = {
  id: string;
  kind: AuditKind;
  actor: string;
  actorRole: string;
  at: string;
  body: string;
};

type RelatedEntry = {
  id: string;
  label: string;
  amount: number;
  at: string;
  link: "predecessor" | "successor";
};

type SourceDocument = {
  id: string;
  label: string;
  kind: "pdf" | "csv" | "receipt";
  size: string;
} | null;

type EntryDetail = {
  id: string;
  reference: string;
  fundId: string;
  fundName: string;
  kind: "credit" | "debit";
  amount: number;
  currency: string;
  category: string;
  label: string;
  counterparty: string;
  counterpartyId: string;
  counterpartyKind: "member" | "external" | "platform" | "circle";
  at: string;
  balanceBefore: number;
  balanceAfter: number;
  sourceDocument: SourceDocument;
  related: RelatedEntry[];
  audit: AuditEvent[];
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function dateLong(iso: string) {
  return new Date(iso).toLocaleString("en-CH", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  if (diff < 0) {
    const ahead = -diff;
    const days = Math.floor(ahead / 86400000);
    if (days >= 1) return `in ${days}d`;
    return "soon";
  }
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function categoryLabel(cat: string) {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function auditMeta(k: AuditKind, t: AppTheme) {
  if (k === "posted")     return { color: t.success, bg: t.successSoft, Icon: CheckCircle2 };
  if (k === "adjusted")   return { color: t.warning, bg: t.warningSoft, Icon: Pencil };
  if (k === "matched")    return { color: t.primary, bg: t.primarySoft, Icon: Sparkles };
  if (k === "reconciled") return { color: t.info,    bg: t.infoSoft,    Icon: ShieldCheck };
  return { color: t.textSecondary, bg: t.bgMuted, Icon: Eye };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryEntryDetail() {
  const t = useTheme();
  const e = treasury.entryDetail as EntryDetail;
  const isCredit = e.kind === "credit";

  const predecessors = e.related.filter((r) => r.link === "predecessor");
  const successors = e.related.filter((r) => r.link === "successor");
  const totalSuccessor = successors.reduce((s, r) => s + r.amount, 0);
  const repayPct = totalSuccessor > 0 ? Math.min(1, 0 / e.amount) : 0; // 0 paid in design state

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Ledger entry"
        subtitle={e.fundName}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt-style header */}
        <View style={[styles.receipt, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.receiptHeader, { backgroundColor: isCredit ? t.success : t.danger }]}>
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: 1.4 }}>
              {categoryLabel(e.category).toUpperCase()}
            </Text>
            <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 38, lineHeight: 42, marginTop: space.xs }}>
              {isCredit ? "+" : "−"}{formatCurrency(e.amount, e.currency)}
            </Text>
            <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)", marginTop: 2 }}>
              {e.label}
            </Text>
          </View>

          <View style={{ padding: space.lg, gap: space.sm }}>
            <Row Icon={Hash} label="Reference" value={e.reference} t={t} mono />
            <Row Icon={Calendar} label="Posted" value={dateLong(e.at)} t={t} />
            <CounterpartyRow e={e} t={t} />
            <Row
              Icon={isCredit ? ArrowDownLeft : ArrowUpRight}
              label="Direction"
              value={isCredit ? "Credit · funds in" : "Debit · funds out"}
              valueColor={isCredit ? t.success : t.danger}
              t={t}
            />
          </View>
        </View>

        {/* Balance bracket */}
        <View style={[styles.balance, { backgroundColor: t.surface, borderColor: t.border }]}>
          <BalanceCell label="Before" value={formatCurrency(e.balanceBefore, e.currency)} t={t} />
          <View style={[styles.balanceArrow, { backgroundColor: t.bgMuted }]}>
            <ArrowRight size={14} color={t.textSecondary} />
          </View>
          <BalanceCell label="After" value={formatCurrency(e.balanceAfter, e.currency)} t={t} highlight />
        </View>

        {/* Source document */}
        {e.sourceDocument ? (
          <Pressable style={[styles.docRow, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={[styles.docIcon, { backgroundColor: t.dangerSoft }]}>
              <FileText size={16} color={t.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" weight="bold" numberOfLines={1}>{e.sourceDocument.label}</Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
                {e.sourceDocument.kind.toUpperCase()} · {e.sourceDocument.size}
              </Text>
            </View>
            <Eye size={14} color={t.textMuted} />
          </Pressable>
        ) : null}

        {/* Related entries chain */}
        {e.related.length > 0 ? (
          <View>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              RELATED ENTRIES
            </Text>

            {/* Repayment progress bar */}
            {successors.length > 0 ? (
              <View style={[styles.repayCard, { backgroundColor: t.warningSoft }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <Text variant="caption" weight="bold" style={{ color: t.warning }}>
                    Repayment chain · {successors.length} installments
                  </Text>
                  <Text variant="micro" weight="bold" style={{ color: t.warning }}>
                    0% repaid
                  </Text>
                </View>
                <View style={[styles.repayBar, { backgroundColor: t.surface }]}>
                  <View style={[styles.repayFill, { width: `${repayPct * 100}%`, backgroundColor: t.warning }]} />
                </View>
                <Text variant="micro" tone="secondary" style={{ marginTop: 4 }}>
                  Sum {formatCurrency(totalSuccessor, e.currency)} across {successors.length} cycles
                </Text>
              </View>
            ) : null}

            <Card padded={false}>
              {predecessors.map((r, i) => (
                <RelatedRow key={r.id} r={r} e={e} t={t} last={i === predecessors.length - 1 && successors.length === 0} />
              ))}
              {successors.map((r, i) => (
                <RelatedRow key={r.id} r={r} e={e} t={t} last={i === successors.length - 1} />
              ))}
            </Card>
          </View>
        ) : null}

        {/* Audit trail */}
        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            AUDIT TRAIL
          </Text>
          <Card padded>
            {e.audit.map((a, i) => (
              <AuditRow key={a.id} a={a} isFirst={i === 0} isLast={i === e.audit.length - 1} t={t} />
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Pressable
          style={[styles.adjustBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
        >
          <Pencil size={14} color={t.textPrimary} />
          <Text variant="bodySmall" weight="bold">Post adjustment</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({
  Icon,
  label,
  value,
  t,
  mono,
  valueColor,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  t: AppTheme;
  mono?: boolean;
  valueColor?: string;
}) {
  return (
    <View style={styles.row}>
      <Icon size={14} color={t.textSecondary} />
      <Text variant="caption" tone="secondary" style={{ flex: 1 }}>{label}</Text>
      <Text
        variant="caption"
        weight="bold"
        style={[
          mono ? { fontFamily: "Menlo" } : null,
          { color: valueColor ?? t.textPrimary, textAlign: "right", flex: 1 },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function CounterpartyRow({ e, t }: { e: EntryDetail; t: AppTheme }) {
  return (
    <View style={styles.row}>
      <Text variant="caption" tone="secondary" style={{ flex: 1, paddingLeft: 22 }}>Counterparty</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {e.counterpartyKind === "member" ? <Avatar name={e.counterparty} size="xs" /> : null}
        <Text variant="caption" weight="bold">{e.counterparty}</Text>
        <View style={[styles.cpPill, { backgroundColor: t.bgMuted }]}>
          <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
            {e.counterpartyKind.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

function BalanceCell({ label, value, t, highlight }: { label: string; value: string; t: AppTheme; highlight?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ color: highlight ? t.primary : t.textPrimary }}>{value}</Text>
    </View>
  );
}

function RelatedRow({
  r,
  e,
  t,
  last,
}: {
  r: RelatedEntry;
  e: EntryDetail;
  t: AppTheme;
  last: boolean;
}) {
  const isSuccessor = r.link === "successor";
  return (
    <View style={[styles.relatedRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.relDot, { backgroundColor: isSuccessor ? t.warningSoft : t.primarySoft }]}>
        <Text variant="micro" weight="bold" style={{ color: isSuccessor ? t.warning : t.primary, letterSpacing: 0.5 }}>
          {isSuccessor ? "→" : "←"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="caption" weight="bold" numberOfLines={1}>{r.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          {timeSince(r.at)} · {isSuccessor ? "due" : "earlier intervention"}
        </Text>
      </View>
      <Text variant="caption" weight="bold" style={{ color: isSuccessor ? t.warning : t.textPrimary }}>
        {formatCurrency(r.amount, e.currency)}
      </Text>
    </View>
  );
}

function AuditRow({
  a,
  isFirst,
  isLast,
  t,
}: {
  a: AuditEvent;
  isFirst: boolean;
  isLast: boolean;
  t: AppTheme;
}) {
  const meta = auditMeta(a.kind, t);
  const Icon = meta.Icon;
  return (
    <View style={styles.auditRow}>
      <View style={styles.auditRail}>
        <View style={[styles.auditLine, { backgroundColor: isFirst ? "transparent" : t.border }]} />
        <View style={[styles.auditDot, { backgroundColor: meta.bg, borderColor: meta.color }]}>
          <Icon size={11} color={meta.color} strokeWidth={2.5} />
        </View>
        <View style={[styles.auditLine, { backgroundColor: isLast ? "transparent" : t.border, flex: isLast ? 0 : 1 }]} />
      </View>
      <View style={{ flex: 1, paddingBottom: isLast ? 0 : space.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold">{a.actor}</Text>
          <View style={[styles.rolePill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
              {a.actorRole.toUpperCase()}
            </Text>
          </View>
          <Text variant="micro" tone="muted">· {timeSince(a.at)}</Text>
        </View>
        <Text variant="caption" tone="secondary" style={{ marginTop: 4, lineHeight: 16 }}>{a.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  receipt: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  receiptHeader: {
    padding: space.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cpPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  balance: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  balanceArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  docIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  repayCard: {
    padding: space.md,
    borderRadius: radius.md,
    marginBottom: space.sm,
  },
  repayBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  repayFill: {
    height: "100%",
    borderRadius: 3,
  },
  relatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  relDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  auditRow: {
    flexDirection: "row",
    gap: space.sm,
    minHeight: 48,
  },
  auditRail: {
    width: 24,
    alignItems: "center",
  },
  auditLine: {
    width: 2,
    flex: 1,
    minHeight: 4,
  },
  auditDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
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
  adjustBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
