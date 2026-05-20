// Reusable lifecycle bottom sheets for Business Relationships.
// Used by both the BR detail screen and the BR list cards.

import { useState } from "react";
import { View, Pressable, TextInput, StyleSheet } from "react-native";
import {
  Check,
  Pause,
  XCircle,
  RefreshCcw,
  Download,
  AlertTriangle,
  Sparkles,
  CalendarClock,
  Mail,
  Receipt,
  Banknote,
  Users,
  FileText,
  Scale,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { useTheme, space, radius } from "@/theme";
import type {
  BrDataExportStatus,
  BusinessRelationshipDetail,
} from "@/data/businessRelationships";

// ============================================================================
// Helpers
// ============================================================================

function fmt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SheetFooter({
  cancelLabel = "Cancel",
  confirmLabel,
  confirmTone = "primary",
  onCancel,
  onConfirm,
  disabled,
  Icon,
}: {
  cancelLabel?: string;
  confirmLabel: string;
  confirmTone?: "primary" | "danger" | "warning" | "success";
  onCancel: () => void;
  onConfirm: () => void;
  disabled?: boolean;
  Icon?: typeof Check;
}) {
  const t = useTheme();
  const toneMap = {
    primary: t.primary,
    danger: t.danger,
    warning: t.warning,
    success: t.success,
  } as const;
  return (
    <>
      <Pressable
        onPress={onCancel}
        style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}
      >
        <Text variant="bodySmall" weight="semibold">
          {cancelLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={onConfirm}
        disabled={disabled}
        style={[
          styles.btnPrimary,
          { backgroundColor: toneMap[confirmTone], opacity: disabled ? 0.5 : 1 },
        ]}
      >
        {Icon ? <Icon size={15} color="#fff" /> : null}
        <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
          {confirmLabel}
        </Text>
      </Pressable>
    </>
  );
}

function PresetChips<T extends string | number>({
  options,
  value,
  onChange,
  tone = "primary",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  tone?: "primary" | "warning" | "danger";
}) {
  const t = useTheme();
  const toneMap = { primary: t.primary, warning: t.warning, danger: t.danger } as const;
  return (
    <View style={{ flexDirection: "row", gap: space.sm, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onChange(opt.value)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? toneMap[tone] : t.bgMuted,
                borderColor: active ? toneMap[tone] : t.border,
              },
            ]}
          >
            <Text variant="caption" weight="bold" style={{ color: active ? "#fff" : t.textSecondary }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ConsequenceRow({ icon: Icon, text }: { icon: typeof Check; text: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
      <View style={[styles.consequenceIcon, { backgroundColor: t.primarySoft }]}>
        <Icon size={12} color={t.primary} />
      </View>
      <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

// ============================================================================
// Activate
// ============================================================================

export function ActivateSheet({
  open,
  onClose,
  brReference,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  brReference: string;
  onConfirm: () => void;
}) {
  const t = useTheme();
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Activate relationship"
      subtitle={`Reference · ${brReference}`}
      footer={
        <SheetFooter
          confirmLabel="Activate"
          confirmTone="success"
          onCancel={onClose}
          onConfirm={onConfirm}
          Icon={Check}
        />
      }
    >
      <View style={[styles.info, { backgroundColor: t.successSoft, borderColor: t.success }]}>
        <Sparkles size={14} color={t.success} />
        <Text variant="caption" weight="semibold" style={{ color: t.success, flex: 1 }}>
          Activating triggers Account auto-provisioning.
        </Text>
      </View>
      <View style={{ marginTop: space.md, gap: space.sm }}>
        <ConsequenceRow icon={Banknote} text="Association Account ASS-XXXX-PRI created with CHF 0.00 balance" />
        <ConsequenceRow icon={Sparkles} text="3 default fund categories: General · Welfare · Reserve" />
        <ConsequenceRow icon={Receipt} text="First billing cycle starts today" />
        <ConsequenceRow icon={Mail} text="President notified by email" />
      </View>
    </BottomSheet>
  );
}

// ============================================================================
// Suspend
// ============================================================================

export function SuspendSheet({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, graceDays: number) => void;
}) {
  const t = useTheme();
  const [reason, setReason] = useState("");
  const [graceDays, setGraceDays] = useState<number>(30);
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Suspend relationship"
      subtitle="The association keeps read-only access during grace period."
      footer={
        <SheetFooter
          confirmLabel="Suspend"
          confirmTone="warning"
          onCancel={onClose}
          onConfirm={() => onConfirm(reason || "Unspecified reason", graceDays)}
          Icon={Pause}
        />
      }
    >
      <View style={[styles.info, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
        <AlertTriangle size={14} color={t.warning} />
        <Text variant="caption" weight="semibold" style={{ color: t.warning, flex: 1 }}>
          Grace period auto-terminates the BR if not resolved.
        </Text>
      </View>

      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.md, marginBottom: space.sm }}>
        REASON
      </Text>
      <View style={[styles.inputWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="e.g. Unpaid invoices ×2"
          placeholderTextColor={t.textMuted}
          style={[styles.input, { color: t.textPrimary }]}
          multiline
        />
      </View>

      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.md, marginBottom: space.sm }}>
        GRACE PERIOD
      </Text>
      <PresetChips
        tone="warning"
        options={[
          { value: 7, label: "7 days" },
          { value: 14, label: "14 days" },
          { value: 30, label: "30 days" },
          { value: 60, label: "60 days" },
        ]}
        value={graceDays}
        onChange={setGraceDays}
      />
      <Text variant="micro" tone="muted" style={{ marginTop: space.sm }}>
        Default 30 days per BR-US003. Auto-terminates via BrExpiryJob if grace expires.
      </Text>
    </BottomSheet>
  );
}

// ============================================================================
// Renew
// ============================================================================

export function RenewSheet({
  open,
  onClose,
  currentEndIso,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  currentEndIso: string | null;
  onConfirm: (newEndIso: string, autoRenew: boolean) => void;
}) {
  const t = useTheme();
  const [months, setMonths] = useState<number>(12);
  const [autoRenew, setAutoRenew] = useState(true);

  const baseEnd = currentEndIso ? new Date(currentEndIso) : new Date();
  const newEnd = new Date(baseEnd);
  newEnd.setMonth(newEnd.getMonth() + months);
  const newEndIso = newEnd.toISOString().slice(0, 10);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Initiate renewal"
      subtitle={`Current end · ${fmt(currentEndIso)}`}
      footer={
        <SheetFooter
          confirmLabel="Initiate renewal"
          confirmTone="primary"
          onCancel={onClose}
          onConfirm={() => onConfirm(newEndIso, autoRenew)}
          Icon={RefreshCcw}
        />
      }
    >
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginBottom: space.sm }}>
        EXTEND BY
      </Text>
      <PresetChips
        options={[
          { value: 6, label: "+6 months" },
          { value: 12, label: "+12 months" },
          { value: 24, label: "+24 months" },
          { value: 36, label: "+36 months" },
        ]}
        value={months}
        onChange={setMonths}
      />

      <View style={[styles.summary, { backgroundColor: t.primarySoft, borderColor: t.primary, marginTop: space.md }]}>
        <CalendarClock size={14} color={t.primary} />
        <View style={{ flex: 1 }}>
          <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.5 }}>
            NEW CONTRACT END
          </Text>
          <Text variant="bodySmall" weight="bold" style={{ color: t.primary }}>
            {fmt(newEndIso)}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => setAutoRenew((v) => !v)}
        style={[
          styles.toggleRow,
          {
            backgroundColor: autoRenew ? t.successSoft : t.bgMuted,
            borderColor: autoRenew ? t.success : t.border,
          },
        ]}
      >
        <View
          style={[
            styles.toggleBox,
            {
              backgroundColor: autoRenew ? t.success : "transparent",
              borderColor: autoRenew ? t.success : t.border,
            },
          ]}
        >
          {autoRenew ? <Check size={11} color="#fff" /> : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="semibold">
            Auto-renew at next term
          </Text>
          <Text variant="micro" tone="secondary">
            Skip manual sign-off if both parties are still active.
          </Text>
        </View>
      </Pressable>
    </BottomSheet>
  );
}

// ============================================================================
// Data export
// ============================================================================

export function DataExportSheet({
  open,
  onClose,
  status,
  onRequest,
  onDownload,
}: {
  open: boolean;
  onClose: () => void;
  status: BrDataExportStatus;
  onRequest: () => void;
  onDownload: () => void;
}) {
  const t = useTheme();
  const isReady = status === "ready";
  const isRequested = status === "requested" || status === "processing";

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Data export"
      subtitle="30-day download window per BR-US005."
      footer={
        <SheetFooter
          confirmLabel={isReady ? "Download" : isRequested ? "Close" : "Request export"}
          confirmTone={isReady ? "success" : "primary"}
          onCancel={onClose}
          onConfirm={isReady ? onDownload : isRequested ? onClose : onRequest}
          Icon={Download}
        />
      }
    >
      <View
        style={[
          styles.info,
          {
            backgroundColor: isReady ? t.successSoft : isRequested ? t.warningSoft : t.primarySoft,
            borderColor: isReady ? t.success : isRequested ? t.warning : t.primary,
          },
        ]}
      >
        <Download size={14} color={isReady ? t.success : isRequested ? t.warning : t.primary} />
        <Text
          variant="caption"
          weight="semibold"
          style={{
            color: isReady ? t.success : isRequested ? t.warning : t.primary,
            flex: 1,
          }}
        >
          {isReady
            ? "Your export is ready. Download within 30 days."
            : isRequested
            ? "Export queued. We'll notify you when ready."
            : "Request a snapshot before terminating to keep your records."}
        </Text>
      </View>

      <View style={{ marginTop: space.md, gap: space.sm }}>
        <ConsequenceRow icon={Banknote} text="Full ledger entries with running balances" />
        <ConsequenceRow icon={Receipt} text="Billing records + payment history" />
        <ConsequenceRow icon={Users} text="Members + governance roles snapshot" />
        <ConsequenceRow icon={FileText} text="Signed contract + amendments" />
      </View>
    </BottomSheet>
  );
}

// ============================================================================
// Terminate
// ============================================================================

export function TerminateSheet({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (noticeDays: number, legalReview: boolean) => void;
}) {
  const t = useTheme();
  const [noticeDays, setNoticeDays] = useState<number>(30);
  const [legalReview, setLegalReview] = useState(false);
  const effective = new Date(Date.now() + noticeDays * 24 * 60 * 60 * 1000).toISOString();

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Terminate with notice"
      subtitle="Per BR-US004 · termination is irreversible."
      footer={
        <SheetFooter
          confirmLabel="Schedule termination"
          confirmTone="danger"
          onCancel={onClose}
          onConfirm={() => onConfirm(noticeDays, legalReview)}
          Icon={XCircle}
        />
      }
    >
      <View style={[styles.info, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
        <AlertTriangle size={14} color={t.danger} />
        <Text variant="caption" weight="semibold" style={{ color: t.danger, flex: 1 }}>
          Members keep read-only access until the effective date.
        </Text>
      </View>

      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8, marginTop: space.md, marginBottom: space.sm }}>
        NOTICE PERIOD
      </Text>
      <PresetChips
        tone="danger"
        options={[
          { value: 30, label: "30 days" },
          { value: 60, label: "60 days" },
          { value: 90, label: "90 days" },
        ]}
        value={noticeDays}
        onChange={setNoticeDays}
      />

      <View style={[styles.summary, { backgroundColor: t.dangerSoft, borderColor: t.danger, marginTop: space.md }]}>
        <CalendarClock size={14} color={t.danger} />
        <View style={{ flex: 1 }}>
          <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.5 }}>
            EFFECTIVE
          </Text>
          <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
            {fmt(effective)}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => setLegalReview((v) => !v)}
        style={[
          styles.toggleRow,
          {
            backgroundColor: legalReview ? t.infoSoft : t.bgMuted,
            borderColor: legalReview ? t.info : t.border,
            marginTop: space.md,
          },
        ]}
      >
        <View
          style={[
            styles.toggleBox,
            {
              backgroundColor: legalReview ? t.info : "transparent",
              borderColor: legalReview ? t.info : t.border,
            },
          ]}
        >
          {legalReview ? <Check size={11} color="#fff" /> : null}
        </View>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Scale size={13} color={legalReview ? t.info : t.textMuted} />
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="semibold">
              Require legal review
            </Text>
            <Text variant="micro" tone="secondary">
              Holds termination until counsel signs off.
            </Text>
          </View>
        </View>
      </Pressable>
    </BottomSheet>
  );
}

// ============================================================================
// Lifecycle helpers — apply confirmed action to a BR object
// ============================================================================

export function applyActivate(br: BusinessRelationshipDetail): BusinessRelationshipDetail {
  return { ...br, status: "active", startedAt: new Date().toISOString().slice(0, 10) };
}

export function applySuspend(
  br: BusinessRelationshipDetail,
  reason: string,
  graceDays: number,
): BusinessRelationshipDetail {
  const grace = new Date(Date.now() + graceDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return {
    ...br,
    status: "suspended",
    suspensionReason: reason,
    suspensionEffectiveAt: new Date().toISOString(),
    gracePeriodEnd: grace,
    graceDaysLeft: graceDays,
    isChurnRisk: true,
  };
}

export function applyTerminate(
  br: BusinessRelationshipDetail,
  noticeDays: number,
  legalReview: boolean,
): BusinessRelationshipDetail {
  const eff = new Date(Date.now() + noticeDays * 24 * 60 * 60 * 1000).toISOString();
  return {
    ...br,
    terminationNoticeDate: new Date().toISOString(),
    terminationEffectiveAt: eff,
    legalReviewRequired: legalReview,
  };
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  inputWrap: {
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: {
    fontSize: 14,
    padding: 0,
    minHeight: 56,
  },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  consequenceIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: space.md,
  },
  toggleBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhost: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
});
