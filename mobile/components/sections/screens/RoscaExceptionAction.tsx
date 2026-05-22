import { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import {
  AlertTriangle,
  Send,
  ShieldCheck,
  PauseCircle,
  MessageCircle,
  Mail,
  Phone,
  Check,
  Lock,
  TrendingDown,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Action = "remind" | "ef" | "arrears";

type Context = {
  name: string;
  trust: number;
  issue: string;
  daysOverdue: number;
  amountDue: number;
  currency: string;
  phone: string;
  whatsapp: string;
  email: string;
  cycle: number;
  efBalance: number;
  efRemainingAfter: number;
  history: {
    paidLastCycle: boolean;
    missedCyclesYear: number;
    onTimeRate: number;
  };
};

const REMINDER_TEMPLATES = [
  { id: "soft",  label: "Soft",   body: "Hi {name} — friendly reminder that the {cycle} contribution of {amount} is due. Let me know if you need anything." },
  { id: "firm",  label: "Firm",   body: "Hi {name}, your {cycle} contribution of {amount} is now {days} days late. Please send it today, or I'll have to mark you in arrears." },
  { id: "final", label: "Final notice", body: "Hi {name}, this is the final notice. The {cycle} contribution of {amount} must clear by end of day or it will be auto-covered by the Emergency Fund and recorded as arrears." },
];

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function tmpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export function RoscaExceptionAction() {
  const t = useTheme();
  const ctx = rosca.exceptionContext as Context;
  const [action, setAction] = useState<Action>("ef");
  const [templateId, setTemplateId] = useState("firm");
  const [channel, setChannel] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  const [arrearsReason, setArrearsReason] = useState("");

  const template = REMINDER_TEMPLATES.find((t) => t.id === templateId)!;
  const messageBody = tmpl(template.body, {
    name: ctx.name.split(" ")[0],
    cycle: `cycle ${ctx.cycle}`,
    amount: formatCurrency(ctx.amountDue, ctx.currency),
    days: String(ctx.daysOverdue),
  });

  const ctaLabel =
    action === "remind"
      ? `Send via ${channel === "whatsapp" ? "WhatsApp" : channel === "sms" ? "SMS" : "email"}`
      : action === "ef"
      ? `Cover ${formatCurrency(ctx.amountDue, ctx.currency)} with EF`
      : "Mark in arrears";

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Resolve exception"
        subtitle={`${ctx.name} · Cycle ${ctx.cycle}`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Member context card */}
        <View style={[styles.contextCard, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
          <Avatar name={ctx.name} size="lg" />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Text variant="bodySmall" weight="bold">{ctx.name}</Text>
              <View style={[styles.trustPill, { backgroundColor: t.surface }]}>
                <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>T·{ctx.trust}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={12} color={t.danger} />
              <Text variant="caption" weight="bold" style={{ color: t.danger }}>
                {ctx.issue}
              </Text>
            </View>
            <Text variant="micro" tone="secondary">
              {formatCurrency(ctx.amountDue, ctx.currency)} due · last on-time rate {Math.round(ctx.history.onTimeRate * 100)}%
            </Text>
          </View>
        </View>

        {/* History strip */}
        <View style={[styles.history, { backgroundColor: t.surface, borderColor: t.border }]}>
          <HistoryCell label="Last cycle" value={ctx.history.paidLastCycle ? "Paid" : "Missed"} tone={ctx.history.paidLastCycle ? "success" : "danger"} t={t} />
          <View style={[styles.histSep, { backgroundColor: t.border }]} />
          <HistoryCell label="Missed (12mo)" value={`${ctx.history.missedCyclesYear}`} tone="warning" t={t} />
          <View style={[styles.histSep, { backgroundColor: t.border }]} />
          <HistoryCell label="On-time rate" value={`${Math.round(ctx.history.onTimeRate * 100)}%`} tone="primary" t={t} />
        </View>

        {/* Choose an action */}
        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            CHOOSE AN ACTION
          </Text>
          <View style={{ gap: space.sm }}>
            <ActionTile
              id="remind"
              Icon={Send}
              title="Send reminder"
              body="Default first response. Pick a tone, channel auto-detected."
              active={action === "remind"}
              onSelect={() => setAction("remind")}
              t={t}
            />
            <ActionTile
              id="ef"
              Icon={ShieldCheck}
              title="Cover by Emergency Fund"
              body={`Debit the EF and unblock the cycle. Member repays in installments.`}
              active={action === "ef"}
              onSelect={() => setAction("ef")}
              recommended
              t={t}
            />
            <ActionTile
              id="arrears"
              Icon={PauseCircle}
              title="Mark in arrears"
              body="Pause future contributions. Use as a last resort after reminders."
              active={action === "arrears"}
              onSelect={() => setAction("arrears")}
              t={t}
              danger
            />
          </View>
        </View>

        {/* Action-specific body */}
        {action === "remind" ? (
          <RemindBody
            templates={REMINDER_TEMPLATES}
            templateId={templateId}
            setTemplateId={setTemplateId}
            channel={channel}
            setChannel={setChannel}
            messageBody={messageBody}
            ctx={ctx}
            t={t}
          />
        ) : action === "ef" ? (
          <EfBody ctx={ctx} t={t} />
        ) : (
          <ArrearsBody reason={arrearsReason} setReason={setArrearsReason} ctx={ctx} t={t} />
        )}
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            Audit-logged. {ctx.name} is notified by app push immediately.
          </Text>
        </View>
        <Button
          label={ctaLabel}
          fullWidth
          size="lg"
          variant={action === "arrears" ? "danger" : "primary"}
          trailingIcon={<Check size={18} color="#fff" strokeWidth={3} />}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Action tile
// ---------------------------------------------------------------------------

function ActionTile({
  id,
  Icon,
  title,
  body,
  active,
  onSelect,
  recommended,
  danger,
  t,
}: {
  id: Action;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  body: string;
  active: boolean;
  onSelect: () => void;
  recommended?: boolean;
  danger?: boolean;
  t: AppTheme;
}) {
  const tint = danger ? t.danger : t.primary;
  const tintSoft = danger ? t.dangerSoft : t.primarySoft;
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.actionTile,
        {
          backgroundColor: active ? tintSoft : t.surface,
          borderColor: active ? tint : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Icon size={16} color={active ? tint : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="bodySmall" weight="bold">{title}</Text>
          {recommended ? (
            <View style={[styles.recoPill, { backgroundColor: t.successSoft }]}>
              <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.5 }}>RECOMMENDED</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{body}</Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: active ? tint : t.borderStrong,
            backgroundColor: active ? tint : "transparent",
          },
        ]}
      >
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Remind body
// ---------------------------------------------------------------------------

function RemindBody({
  templates,
  templateId,
  setTemplateId,
  channel,
  setChannel,
  messageBody,
  ctx,
  t,
}: {
  templates: { id: string; label: string; body: string }[];
  templateId: string;
  setTemplateId: (v: string) => void;
  channel: "whatsapp" | "sms" | "email";
  setChannel: (v: "whatsapp" | "sms" | "email") => void;
  messageBody: string;
  ctx: Context;
  t: AppTheme;
}) {
  return (
    <>
      <View>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          TONE
        </Text>
        <View style={[styles.segment, { backgroundColor: t.bgMuted }]}>
          {templates.map((tpl) => {
            const active = tpl.id === templateId;
            return (
              <Pressable
                key={tpl.id}
                onPress={() => setTemplateId(tpl.id)}
                style={[
                  styles.segBtn,
                  active ? { backgroundColor: t.surface, borderColor: t.border } : null,
                ]}
              >
                <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
                  {tpl.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          CHANNEL
        </Text>
        <View style={{ gap: space.sm }}>
          <ChannelRow Icon={MessageCircle} label="WhatsApp" detail={ctx.whatsapp} active={channel === "whatsapp"} onPress={() => setChannel("whatsapp")} t={t} />
          <ChannelRow Icon={Phone} label="SMS" detail={ctx.phone} active={channel === "sms"} onPress={() => setChannel("sms")} t={t} />
          <ChannelRow Icon={Mail} label="Email" detail={ctx.email} active={channel === "email"} onPress={() => setChannel("email")} t={t} />
        </View>
      </View>

      <Card padded>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          PREVIEW
        </Text>
        <View style={[styles.preview, { backgroundColor: t.bgMuted }]}>
          <Text variant="caption" style={{ lineHeight: 18 }}>{messageBody}</Text>
        </View>
        <Text variant="micro" tone="muted" style={{ marginTop: space.xs }}>
          Editable before sending.
        </Text>
      </Card>
    </>
  );
}

function ChannelRow({
  Icon,
  label,
  detail,
  active,
  onPress,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  detail: string;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.channelRow,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.channelIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Icon size={14} color={active ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="caption" weight="bold">{label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{detail}</Text>
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

// ---------------------------------------------------------------------------
// EF body
// ---------------------------------------------------------------------------

function EfBody({ ctx, t }: { ctx: Context; t: AppTheme }) {
  const remainingPct = ctx.efRemainingAfter / ctx.efBalance;
  return (
    <>
      <Card padded>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          EMERGENCY FUND DEBIT
        </Text>
        <View style={styles.efRow}>
          <Text variant="bodySmall" tone="secondary" style={{ flex: 1 }}>EF balance now</Text>
          <Text variant="bodySmall" weight="bold">{formatCurrency(ctx.efBalance, ctx.currency)}</Text>
        </View>
        <View style={styles.efRow}>
          <Text variant="bodySmall" tone="secondary" style={{ flex: 1 }}>This intervention</Text>
          <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>−{formatCurrency(ctx.amountDue, ctx.currency)}</Text>
        </View>
        <View style={[styles.efDivider, { backgroundColor: t.border }]} />
        <View style={styles.efRow}>
          <Text variant="body" weight="bold" style={{ flex: 1 }}>EF after</Text>
          <Text variant="body" weight="bold" style={{ color: t.warning }}>
            {formatCurrency(ctx.efRemainingAfter, ctx.currency)}
          </Text>
        </View>
        <View style={[styles.efBar, { backgroundColor: t.bgMuted, marginTop: space.sm }]}>
          <View style={[styles.efBarFill, { width: `${remainingPct * 100}%`, backgroundColor: t.warning }]} />
        </View>
        <Text variant="micro" tone="muted" weight="semibold" style={{ marginTop: 4 }}>
          {Math.round(remainingPct * 100)}% of EF remains after this debit
        </Text>
      </Card>

      <Card padded>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          REPAYMENT PLAN
        </Text>
        <View style={styles.planRow}>
          <View style={[styles.planDot, { backgroundColor: t.primarySoft }]}>
            <Text variant="micro" weight="bold" tone="accent">5×</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold">5 monthly installments</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
              ~{formatCurrency(Math.ceil(ctx.amountDue / 5), ctx.currency)} added to each future contribution
            </Text>
          </View>
        </View>
      </Card>

      <View style={[styles.disclosure, { backgroundColor: t.warningSoft }]}>
        <ShieldCheck size={14} color={t.warning} />
        <Text variant="micro" style={{ color: t.warning, flex: 1, lineHeight: 14 }}>
          The cycle moves to 100% collection and {ctx.name} keeps her slot. She'll see a private explainer + repayment schedule.
        </Text>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Arrears body
// ---------------------------------------------------------------------------

function ArrearsBody({
  reason,
  setReason,
  ctx,
  t,
}: {
  reason: string;
  setReason: (v: string) => void;
  ctx: Context;
  t: AppTheme;
}) {
  return (
    <>
      <View style={[styles.bigWarn, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
        <TrendingDown size={16} color={t.danger} />
        <View style={{ flex: 1 }}>
          <Text variant="caption" weight="bold" style={{ color: t.danger }}>
            This is a hard pause
          </Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
            {ctx.name} stops contributing and stops being eligible for payout until the arrears are settled. The cycle continues without her this round.
          </Text>
        </View>
      </View>

      <View>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
          REASON · REQUIRED
        </Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Why you're marking arrears — visible to her, the organiser, and audit log."
          placeholderTextColor={t.textMuted}
          multiline
          maxLength={300}
          style={[
            styles.reasonInput,
            {
              color: t.textPrimary,
              backgroundColor: t.surface,
              borderColor: t.border,
            },
          ]}
        />
        <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
          {reason.length}/300
        </Text>
      </View>
    </>
  );
}

function HistoryCell({
  label,
  value,
  tone,
  t,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "danger" | "primary";
  t: AppTheme;
}) {
  const color =
    tone === "success" ? t.success :
    tone === "warning" ? t.warning :
    tone === "danger" ? t.danger : t.primary;
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ color, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contextCard: {
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
  history: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  histSep: {
    width: 1,
    height: 30,
  },
  actionTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  recoPill: {
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
  segment: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  channelIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    padding: space.md,
    borderRadius: radius.sm,
  },
  efRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  efDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.xs,
  },
  efBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  efBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  planDot: {
    width: 32,
    height: 32,
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
  bigWarn: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  reasonInput: {
    minHeight: 100,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
    textAlignVertical: "top",
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
