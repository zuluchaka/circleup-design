import { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";
import {
  Mail,
  MessageCircle,
  Phone,
  QrCode,
  Link2,
  Send,
  Check,
  Clock,
  X,
  Copy,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type ChannelId = "email" | "sms" | "whatsapp" | "qr" | "link";

type Sent = {
  id: string;
  recipient: string;
  channel: "Email" | "SMS" | "WhatsApp" | "QR" | "Link";
  status: "pending" | "delivered" | "opened" | "accepted" | "declined" | "expired";
  sentAt: string;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function channelIcon(id: ChannelId) {
  if (id === "email") return Mail;
  if (id === "sms") return Phone;
  if (id === "whatsapp") return MessageCircle;
  if (id === "qr") return QrCode;
  return Link2;
}

function statusMeta(s: Sent["status"], t: AppTheme) {
  if (s === "accepted")  return { color: t.success, bg: t.successSoft, Icon: Check,  label: "Accepted" };
  if (s === "opened")    return { color: t.primary, bg: t.primarySoft, Icon: Check,  label: "Opened" };
  if (s === "delivered") return { color: t.info,    bg: t.infoSoft,    Icon: Check,  label: "Delivered" };
  if (s === "pending")   return { color: t.warning, bg: t.warningSoft, Icon: Clock,  label: "Pending" };
  if (s === "declined")  return { color: t.danger,  bg: t.dangerSoft,  Icon: X,      label: "Declined" };
  return { color: t.textMuted, bg: t.bgMuted, Icon: Clock, label: "Expired" };
}

// ---------------------------------------------------------------------------
// Simple QR placeholder (5x5 random-ish pattern)
// ---------------------------------------------------------------------------

function QrPlaceholder({ size = 180, color }: { size?: number; color: string }) {
  const grid = 21;
  const cell = size / grid;
  // Deterministic-ish pattern using bit shuffles
  const pattern: number[][] = Array.from({ length: grid }, (_, y) =>
    Array.from({ length: grid }, (_, x) => ((x * 31 + y * 7 + (x ^ y)) >>> 0) % 3 === 0 ? 1 : 0),
  );
  // Position-detection squares (corners)
  const drawCorner = (x0: number, y0: number) => (
    <>
      <Rect x={x0 * cell} y={y0 * cell} width={cell * 7} height={cell * 7} fill={color} />
      <Rect x={(x0 + 1) * cell} y={(y0 + 1) * cell} width={cell * 5} height={cell * 5} fill="#fff" />
      <Rect x={(x0 + 2) * cell} y={(y0 + 2) * cell} width={cell * 3} height={cell * 3} fill={color} />
    </>
  );
  return (
    <Svg width={size} height={size}>
      <Rect x={0} y={0} width={size} height={size} fill="#fff" />
      {pattern.map((row, y) =>
        row.map((v, x) =>
          v ? <Rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color} /> : null,
        ),
      )}
      {drawCorner(0, 0)}
      {drawCorner(grid - 7, 0)}
      {drawCorner(0, grid - 7)}
    </Svg>
  );
}

export function RoscaInvite() {
  const t = useTheme();
  const panel = rosca.invitePanel as {
    channels: { id: ChannelId; label: string; hint: string; active: boolean }[];
    recentSent: Sent[];
    qrCode: string;
    inviteLink: string;
  };

  const [channelId, setChannelId] = useState<ChannelId>("email");
  const [recipients, setRecipients] = useState("leyla.tahar@example.ch\nharu.tanaka@example.ch");
  const [message, setMessage] = useState("Hi — joining our Main CHF Circle. We meet once a month, contribute CHF 200, and you get the pot when your turn comes around.");

  const Channel = channelIcon(channelId);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Invite members"
        subtitle="Main CHF Circle"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Channel selector */}
        <View>
          <FieldLabel>Channel</FieldLabel>
          <View style={[styles.channelRow, { backgroundColor: t.bgMuted }]}>
            {panel.channels.map((c) => {
              const Icon = channelIcon(c.id);
              const active = c.id === channelId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setChannelId(c.id)}
                  style={[
                    styles.channelBtn,
                    active ? { backgroundColor: t.surface, borderColor: t.border } : null,
                  ]}
                >
                  <Icon size={14} color={active ? t.primary : t.textSecondary} />
                  <Text variant="micro" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Channel body */}
        {channelId === "qr" ? (
          <Card padded>
            <Text variant="micro" tone="muted" weight="bold" align="center" style={{ letterSpacing: 1 }}>
              SCAN TO JOIN
            </Text>
            <View style={[styles.qrFrame, { borderColor: t.border, backgroundColor: t.surface }]}>
              <QrPlaceholder color={t.textPrimary} />
            </View>
            <Text variant="bodySmall" weight="bold" align="center" style={{ marginTop: space.sm }}>
              Main CHF Circle
            </Text>
            <Text variant="micro" tone="secondary" align="center" style={{ marginTop: 4 }}>
              CHF 200 · Monthly · 12-cycle rotation
            </Text>
          </Card>
        ) : channelId === "link" ? (
          <Card padded>
            <FieldLabel>Invite link</FieldLabel>
            <View style={[styles.linkBox, { backgroundColor: t.bgMuted }]}>
              <Link2 size={14} color={t.textSecondary} />
              <Text variant="caption" weight="semibold" style={{ flex: 1, fontFamily: "Menlo" }} numberOfLines={1}>
                {panel.inviteLink}
              </Text>
              <Pressable style={[styles.copyBtn, { backgroundColor: t.surface }]}>
                <Copy size={11} color={t.primary} />
                <Text variant="micro" weight="bold" tone="accent">COPY</Text>
              </Pressable>
            </View>
            <Text variant="micro" tone="muted" style={{ marginTop: space.sm, lineHeight: 14 }}>
              Anyone with this link can request to join. Expires after 14 days.
            </Text>
          </Card>
        ) : (
          <>
            <View>
              <FieldLabel>
                {channelId === "email" ? "Recipients" : channelId === "sms" ? "Phone numbers" : "WhatsApp numbers"}
              </FieldLabel>
              <TextInput
                value={recipients}
                onChangeText={setRecipients}
                placeholder={channelId === "email" ? "Comma or newline separated" : "+41 78 555…"}
                placeholderTextColor={t.textMuted}
                multiline
                style={[
                  styles.input,
                  { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border },
                ]}
              />
              <Text variant="micro" tone="muted" style={{ marginTop: 4 }}>
                {recipients.split(/[\n,]+/).filter(Boolean).length} recipient{recipients.split(/[\n,]+/).filter(Boolean).length === 1 ? "" : "s"} · sent in one batch
              </Text>
            </View>

            <View>
              <FieldLabel>Message</FieldLabel>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Tell them what the circle is about."
                placeholderTextColor={t.textMuted}
                multiline
                maxLength={280}
                style={[
                  styles.input,
                  { minHeight: 110, color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border },
                ]}
              />
              <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
                {message.length}/280
              </Text>
            </View>
          </>
        )}

        {/* Recent sent */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Recently sent</Text>
            <Text variant="caption" tone="secondary">{panel.recentSent.length}</Text>
          </View>
          <Card padded={false}>
            {panel.recentSent.map((s, i) => (
              <SentRow key={s.id} s={s} t={t} last={i === panel.recentSent.length - 1} />
            ))}
          </Card>
        </View>
      </ScrollView>

      {channelId !== "qr" && channelId !== "link" ? (
        <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
          <Button
            label={`Send via ${channelId === "email" ? "Email" : channelId === "sms" ? "SMS" : "WhatsApp"}`}
            fullWidth
            size="lg"
            trailingIcon={<Send size={16} color="#fff" />}
          />
        </View>
      ) : null}
    </View>
  );
}

function SentRow({ s, t, last }: { s: Sent; t: AppTheme; last: boolean }) {
  const meta = statusMeta(s.status, t);
  const Icon = meta.Icon;
  return (
    <View style={[styles.sentRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.chDot, { backgroundColor: t.bgMuted }]}>
        {(() => {
          const Ic = channelIcon(s.channel.toLowerCase() as ChannelId);
          return <Ic size={12} color={t.textSecondary} />;
        })()}
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="caption" weight="bold" numberOfLines={1}>{s.recipient}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          {s.channel} · {timeSince(s.sentAt)}
        </Text>
      </View>
      <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
        <Icon size={10} color={meta.color} strokeWidth={3} />
        <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
          {meta.label.toUpperCase()}
        </Text>
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
  channelRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  channelBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    minHeight: 80,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
    textAlignVertical: "top",
  },
  qrFrame: {
    alignSelf: "center",
    marginTop: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  sentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
  },
  chDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
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
});
