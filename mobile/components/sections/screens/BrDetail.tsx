import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  MapPin,
  Users,
  Briefcase,
  FileText,
  Receipt,
  Banknote,
  AlertTriangle,
  CalendarClock,
  Clock,
  Pause,
  XCircle,
  Download,
  RefreshCcw,
  Check,
  Sparkles,
  ClipboardList,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import {
  ActivateSheet,
  SuspendSheet,
  RenewSheet,
  DataExportSheet,
  TerminateSheet,
  applySuspend,
  applyActivate,
  applyTerminate,
} from "@/components/shared/BrLifecycleSheets";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import {
  findRelationshipDetail,
  BR_TIER_LABEL,
  type BillingRecord,
  type BillingStatus,
  type BrStatus,
  type BrTier,
  type BusinessRelationshipDetail,
} from "@/data/businessRelationships";

function statusStyle(s: BrStatus, t: AppTheme) {
  switch (s) {
    case "pending":
      return { dot: t.warning, bg: t.warningSoft, fg: t.warning, label: "Pending" };
    case "active":
      return { dot: t.success, bg: t.successSoft, fg: t.success, label: "Active" };
    case "suspended":
      return { dot: t.danger, bg: t.dangerSoft, fg: t.danger, label: "Suspended" };
    case "terminated":
      return { dot: t.textMuted, bg: t.bgMuted, fg: t.textSecondary, label: "Terminated" };
  }
}

function tierStyle(tier: BrTier, t: AppTheme) {
  switch (tier) {
    case "pro":
      return { bg: t.primarySoft, fg: t.primary };
    case "basic":
      return { bg: t.infoSoft, fg: t.info };
    case "free":
      return { bg: t.bgMuted, fg: t.textSecondary };
  }
}

function billingStyle(s: BillingStatus, t: AppTheme) {
  switch (s) {
    case "paid":
      return { bg: t.successSoft, fg: t.success, label: "Paid" };
    case "overdue":
      return { bg: t.dangerSoft, fg: t.danger, label: "Overdue" };
    case "invoiced":
      return { bg: t.infoSoft, fg: t.info, label: "Invoiced" };
    case "pending":
      return { bg: t.warningSoft, fg: t.warning, label: "Pending" };
    case "cancelled":
      return { bg: t.bgMuted, fg: t.textSecondary, label: "Cancelled" };
    case "refunded":
      return { bg: t.bgMuted, fg: t.textSecondary, label: "Refunded" };
  }
}

function fmt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Card({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>{children}</View>;
}

function SectionLabel({ icon: Icon, label }: { icon: typeof FileText; label: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
      <Icon size={14} color={t.textMuted} />
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function KvRow({ label, value, tone }: { label: string; value: string; tone?: "danger" | "muted" | "default" }) {
  const t = useTheme();
  const color =
    tone === "danger" ? t.danger : tone === "muted" ? t.textMuted : t.textPrimary;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, gap: space.md }}>
      <Text variant="bodySmall" tone="secondary">
        {label}
      </Text>
      <Text variant="bodySmall" weight="semibold" style={{ color, textAlign: "right", flex: 1 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function BillingRow({ b, t }: { b: BillingRecord; t: AppTheme }) {
  const style = billingStyle(b.status, t);
  return (
    <View style={[styles.billingRow, { borderColor: t.border }]}>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="bodySmall" weight="bold">
            {fmt(b.periodStart)} – {fmt(b.periodEnd)}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: style.bg }]}>
            <Text variant="micro" weight="semibold" style={{ color: style.fg }}>
              {style.label}
            </Text>
          </View>
        </View>
        <Text variant="micro" tone="muted" style={{ fontFamily: "monospace" }}>
          {b.reference}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text variant="bodySmall" weight="bold" style={{ color: b.status === "overdue" ? t.danger : t.textPrimary }}>
          {b.currency} {b.totalAmount.toLocaleString("en-CH")}
        </Text>
        <Text variant="micro" tone="muted">
          sub {b.subscriptionAmount} · fee {b.platformFeeAmount}
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// Main
// ============================================================================

type SheetKey = null | "activate" | "suspend" | "renew" | "dataExport" | "terminate";

export function BrDetail({ id }: { id: string }) {
  const t = useTheme();
  const initial = findRelationshipDetail(id);
  const [br, setBr] = useState<BusinessRelationshipDetail | undefined>(initial);
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!br) {
    return (
      <View style={[styles.notFound, { backgroundColor: t.bg }]}>
        <View style={[styles.notFoundIcon, { backgroundColor: t.bgMuted }]}>
          <Building2 size={28} color={t.textMuted} />
        </View>
        <Text variant="h3" weight="semibold" align="center">
          Business Relationship not found
        </Text>
        <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.xs }}>
          The relationship reference may have been removed or you don't have access.
        </Text>
        <Pressable
          onPress={() => router.replace("/business-relationships" as never)}
          style={[styles.btnPrimary, { backgroundColor: t.primary, marginTop: space.lg }]}
        >
          <ChevronLeft size={14} color="#fff" />
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
            Back to list
          </Text>
        </Pressable>
      </View>
    );
  }

  const status = statusStyle(br.status, t);
  const tier = tierStyle(br.tier, t);
  const overdueTotal = br.recentBilling
    .filter((b) => b.status === "overdue")
    .reduce((s, b) => s + b.totalAmount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Hero */}
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
                BUSINESS RELATIONSHIP
              </Text>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace", marginTop: 2 }}>
                {br.reference}
              </Text>
            </View>
            <View style={[styles.statusPillHero, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
              <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                {status.label}
              </Text>
            </View>
          </View>

          {/* Association identity */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.xl }}>
            <Image source={{ uri: br.associationLogo }} style={styles.assocLogo} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }} numberOfLines={2}>
                {br.associationName}
              </Text>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.75)" }} numberOfLines={1}>
                {br.associationLegalName}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 2, flexWrap: "wrap" }}>
                <View style={[styles.heroTag, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
                  <Briefcase size={9} color="#fff" />
                  <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.4 }}>
                    {BR_TIER_LABEL[br.tier].toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.heroTag, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
                  <MapPin size={9} color="#fff" />
                  <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {br.region}
                  </Text>
                </View>
                <View style={[styles.heroTag, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
                  <Users size={9} color="#fff" />
                  <Text variant="micro" weight="semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {br.memberCount.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Risk banner outside hero */}
        {br.isChurnRisk || br.isExpiringSoon ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
            <View
              style={[
                styles.banner,
                br.isChurnRisk
                  ? { backgroundColor: t.dangerSoft, borderColor: t.danger }
                  : { backgroundColor: t.warningSoft, borderColor: t.warning },
              ]}
            >
              {br.isChurnRisk ? (
                <>
                  <AlertTriangle size={14} color={t.danger} />
                  <Text variant="caption" weight="semibold" style={{ color: t.danger, flex: 1 }}>
                    Churn risk · {br.graceDaysLeft ? `${br.graceDaysLeft}d grace remaining` : "review now"}
                    {br.gracePeriodEnd ? ` · ends ${fmt(br.gracePeriodEnd)}` : ""}
                  </Text>
                </>
              ) : (
                <>
                  <CalendarClock size={14} color={t.warning} />
                  <Text variant="caption" weight="semibold" style={{ color: t.warning, flex: 1 }}>
                    Renewal due {fmt(br.renewalDeadline ?? br.contractEndDate)}
                  </Text>
                </>
              )}
            </View>
          </View>
        ) : null}

        {/* Tile grid: MRR / Started / Ends / Contract */}
        <View style={{ paddingHorizontal: space.lg, marginTop: br.isChurnRisk || br.isExpiringSoon ? space.lg : -space.lg }}>
          <View style={[styles.tileGrid, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={styles.tile}>
              <Text variant="micro" tone="muted" weight="bold">MRR</Text>
              <Text variant="h3" weight="bold" style={{ color: br.monthlyRevenue > 0 ? t.success : t.textSecondary }}>
                {br.monthlyRevenue > 0 ? `${br.currency} ${br.monthlyRevenue}` : "—"}
              </Text>
            </View>
            <View style={[styles.tileDivider, { backgroundColor: t.border }]} />
            <View style={styles.tile}>
              <Text variant="micro" tone="muted" weight="bold">STARTED</Text>
              <Text variant="h3" weight="bold">{fmt(br.startedAt)}</Text>
            </View>
            <View style={[styles.tileDivider, { backgroundColor: t.border }]} />
            <View style={styles.tile}>
              <Text variant="micro" tone="muted" weight="bold">ENDS</Text>
              <Text variant="h3" weight="bold">{fmt(br.contractEndDate)}</Text>
            </View>
          </View>
        </View>

        {/* Stack of detail cards */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg, gap: space.md }}>
          {/* Contract terms */}
          <Card>
            <SectionLabel icon={FileText} label="Contract terms" />
            <KvRow label="Reference" value={br.reference} />
            <KvRow label="Relationship type" value={br.relationshipType} />
            <KvRow label="Subscription tier" value={BR_TIER_LABEL[br.tier]} />
            <KvRow label="Started" value={fmt(br.startedAt)} />
            <KvRow label="Contract ends" value={fmt(br.contractEndDate)} />
            <KvRow label="Renewal deadline" value={fmt(br.renewalDeadline)} />
            {br.renewalStatus ? <KvRow label="Renewal status" value={br.renewalStatus} /> : null}
          </Card>

          {/* Fee agreement */}
          <Card>
            <SectionLabel icon={Banknote} label="Fee agreement" />
            <KvRow
              label="Subscription"
              value={
                br.feeAgreement.flatAmount
                  ? `${br.feeAgreement.currency} ${br.feeAgreement.flatAmount}/mo`
                  : "—"
              }
            />
            <KvRow
              label="Platform fee"
              value={br.feeAgreement.percentage ? `${br.feeAgreement.percentage.toFixed(2)}%` : "—"}
            />
            <KvRow label="Currency" value={br.feeAgreement.currency} />
            <KvRow label="MRR (rollup)" value={br.monthlyRevenue > 0 ? `${br.currency} ${br.monthlyRevenue}` : "—"} />
          </Card>

          {/* Lifecycle metadata (when relevant) */}
          {br.status === "suspended" ? (
            <Card>
              <SectionLabel icon={Pause} label="Suspension" />
              <KvRow label="Reason" value={br.suspensionReason ?? "—"} />
              <KvRow label="Suspended at" value={fmt(br.suspensionEffectiveAt)} />
              <KvRow label="Grace ends" value={fmt(br.gracePeriodEnd)} tone="danger" />
              <KvRow
                label="Days remaining"
                value={br.graceDaysLeft != null ? `${br.graceDaysLeft} days` : "—"}
                tone="danger"
              />
            </Card>
          ) : null}

          {/* Billing */}
          <Card>
            <SectionLabel icon={Receipt} label="Billing history" />
            {br.recentBilling.length === 0 ? (
              <Text variant="bodySmall" tone="secondary">
                No billing records yet.
              </Text>
            ) : (
              <View style={{ gap: space.sm }}>
                {br.recentBilling.map((b) => (
                  <BillingRow key={b.id} b={b} t={t} />
                ))}
                {overdueTotal > 0 ? (
                  <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderColor: t.border }}>
                    <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
                      Total overdue
                    </Text>
                    <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
                      {br.currency} {overdueTotal.toLocaleString("en-CH")}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </Card>

          {/* Account link */}
          {br.associationAccountNumber ? (
            <Pressable
              onPress={() =>
                router.push(`/association-accounts/${br.associationAccountNumber}` as never)
              }
            >
              <Card>
                <SectionLabel icon={Building2} label="Linked accounts" />
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                  <View style={[styles.acctIcon, { backgroundColor: t.primarySoft }]}>
                    <Banknote size={18} color={t.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="bold">
                      Association Account
                    </Text>
                    <Text variant="micro" tone="secondary" style={{ fontFamily: "monospace" }}>
                      {br.associationAccountNumber}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={t.textMuted} />
                </View>
              </Card>
            </Pressable>
          ) : null}

          {/* Onboarding link — shown for active and pending BRs */}
          {br.status === "active" || br.status === "pending" ? (
            <Pressable
              onPress={() => router.push(`/business-relationships/${br.id}/onboarding` as never)}
            >
              <Card>
                <SectionLabel icon={ClipboardList} label="Onboarding checklist" />
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                  <View style={[styles.acctIcon, { backgroundColor: t.warningSoft }]}>
                    <ClipboardList size={18} color={t.warning} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="bold">
                      Continue onboarding
                    </Text>
                    <Text variant="micro" tone="secondary">
                      5-step checklist · association profile → first circle
                    </Text>
                  </View>
                  <ChevronRight size={16} color={t.textMuted} />
                </View>
              </Card>
            </Pressable>
          ) : null}

          {/* Parties */}
          <Card>
            <SectionLabel icon={Users} label="Parties" />
            <KvRow label="President" value={br.presidentName} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
              <Mail size={11} color={t.textMuted} />
              <Text variant="caption" tone="secondary" style={{ flex: 1 }} numberOfLines={1}>
                {br.presidentEmail}
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: t.border, marginVertical: space.sm }} />
            <KvRow label="Circle Manager" value={br.managerName} />
            <KvRow label="Employee ID" value={br.managerEmployeeId} />
          </Card>

          {/* Danger zone — context-aware actions */}
          <Card>
            <SectionLabel icon={AlertTriangle} label="Lifecycle actions" />
            <View style={{ gap: space.sm }}>
              {br.status === "pending" ? (
                <ActionButton
                  tone="success"
                  icon={Check}
                  label="Activate relationship"
                  onPress={() => setSheet("activate")}
                />
              ) : null}

              {br.status === "active" ? (
                <>
                  <ActionButton
                    tone="warning"
                    icon={Pause}
                    label="Suspend (with grace period)"
                    onPress={() => setSheet("suspend")}
                  />
                  <ActionButton
                    tone="primary"
                    icon={RefreshCcw}
                    label="Initiate renewal"
                    onPress={() => setSheet("renew")}
                  />
                  <ActionButton
                    tone="ghost"
                    icon={Download}
                    onPress={() => setSheet("dataExport")}
                    label={
                      br.dataExportStatus === "ready"
                        ? "Download data export"
                        : br.dataExportStatus === "requested"
                        ? "Export queued · 30d window"
                        : "Request data export"
                    }
                  />
                </>
              ) : null}

              {br.status === "suspended" ? (
                <>
                  <ActionButton
                    tone="primary"
                    icon={RefreshCcw}
                    label="Reactivate"
                    onPress={() =>
                      setBr({ ...br, status: "active", suspensionReason: undefined, gracePeriodEnd: undefined, graceDaysLeft: undefined, isChurnRisk: false })
                    }
                  />
                  <ActionButton
                    tone="danger"
                    icon={XCircle}
                    label="Terminate with notice"
                    onPress={() => setSheet("terminate")}
                  />
                </>
              ) : null}

              {br.status === "terminated" ? (
                <ActionButton tone="ghost" icon={Clock} label="Lifecycle closed · view audit log" />
              ) : null}
            </View>
          </Card>
        </View>

        {/* Toast banner (lives inside scroll so it doesn't fight tabs) */}
        {toast ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md }}>
            <View style={[styles.toast, { backgroundColor: t.success, borderColor: t.success }]}>
              <Sparkles size={14} color="#fff" />
              <Text variant="caption" weight="semibold" style={{ color: "#fff", flex: 1 }}>
                {toast}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom sheets */}
      <ActivateSheet
        open={sheet === "activate"}
        onClose={() => setSheet(null)}
        brReference={br.reference}
        onConfirm={() => {
          setBr(applyActivate(br));
          setSheet(null);
          setToast("Activated · Account provisioned · routing to onboarding");
          // Defer the route push so the toast briefly renders.
          setTimeout(() => {
            router.push(`/business-relationships/${br.id}/onboarding` as never);
          }, 600);
        }}
      />
      <SuspendSheet
        open={sheet === "suspend"}
        onClose={() => setSheet(null)}
        onConfirm={(reason, graceDays) => {
          setBr(applySuspend(br, reason, graceDays));
          setSheet(null);
          setToast(`Suspended · ${graceDays}-day grace period started`);
        }}
      />
      <RenewSheet
        open={sheet === "renew"}
        onClose={() => setSheet(null)}
        currentEndIso={br.contractEndDate}
        onConfirm={(newEndIso, autoRenew) => {
          setBr({
            ...br,
            contractEndDate: newEndIso,
            renewalStatus: autoRenew ? "auto_renew" : "pending",
            renewalDeadline: null,
            isExpiringSoon: false,
          });
          setSheet(null);
          setToast(autoRenew ? "Auto-renewal armed" : "Renewal pending president sign-off");
        }}
      />
      <DataExportSheet
        open={sheet === "dataExport"}
        onClose={() => setSheet(null)}
        status={br.dataExportStatus}
        onRequest={() => {
          const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          setBr({ ...br, dataExportStatus: "requested", dataExportAvailableUntil: expiry });
          setSheet(null);
          setToast("Export queued · ready within 30 days");
        }}
        onDownload={() => {
          setSheet(null);
          setToast("Download started");
        }}
      />
      <TerminateSheet
        open={sheet === "terminate"}
        onClose={() => setSheet(null)}
        onConfirm={(noticeDays, legalReview) => {
          const updated = applyTerminate(br, noticeDays, legalReview);
          setBr(updated);
          setSheet(null);
          setToast(`Termination scheduled · ends ${fmt(updated.terminationEffectiveAt)}`);
        }}
      />
    </View>
  );
}

function ActionButton({
  tone,
  icon: Icon,
  label,
  onPress,
}: {
  tone: "success" | "warning" | "danger" | "primary" | "ghost";
  icon: typeof Check;
  label: string;
  onPress?: () => void;
}) {
  const t = useTheme();
  const map = {
    success: { bg: t.success, fg: "#fff" },
    warning: { bg: t.warning, fg: "#fff" },
    danger: { bg: t.danger, fg: "#fff" },
    primary: { bg: t.primary, fg: "#fff" },
    ghost: { bg: t.bgMuted, fg: t.textPrimary },
  } as const;
  const c = map[tone];
  return (
    <Pressable onPress={onPress} style={[styles.actionBtn, { backgroundColor: c.bg }]}>
      <Icon size={15} color={c.fg} />
      <Text variant="bodySmall" weight="bold" style={{ color: c.fg }}>
        {label}
      </Text>
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: space.xl + space.lg,
    paddingHorizontal: space.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  statusPillHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusPill: {
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  assocLogo: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  tileGrid: {
    flexDirection: "row",
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  tile: {
    flex: 1,
    paddingHorizontal: space.sm,
    gap: 2,
  },
  tileDivider: {
    width: 1,
  },

  card: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  billingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: space.md,
  },

  acctIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.md,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
  },

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

  // Toast
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

});
