// Invite members flow for /sections/members-and-trust/invite.
// Channel picker (link / email / SMS / QR), editable message preview, and a
// recent-invites list.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  Link2, Mail, MessageCircle, QrCode, Copy, Send, ChevronRight, Clock,
  CheckCircle2, X,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const SHAREABLE_LINK = "circleup.app/join/dgg-7K2N";
const MESSAGE_PREVIEW =
  "Salut! Je t'invite à rejoindre Diaspora Circle Geneva sur CircleUp. C'est notre nouvelle plateforme pour gérer la tontine. Inscris-toi ici: " + SHAREABLE_LINK;

const CHANNELS = [
  { id: "link",  label: "Shareable link", sub: "Anyone with the link can join",   Icon: Link2,         tone: "primary" as const },
  { id: "email", label: "Email",          sub: "Personal message + auto subject", Icon: Mail,          tone: "info"    as const },
  { id: "sms",   label: "SMS",            sub: "Short link, mobile-optimised",    Icon: MessageCircle, tone: "info"    as const },
  { id: "qr",    label: "QR code",        sub: "Print or display in person",      Icon: QrCode,        tone: "primary" as const },
];

const RECENT = [
  { name: "Felipe Rosa",     email: "felipe@example.ch",    status: "joined",   when: "today"      },
  { name: "Mariam Boukhalfa", email: "mariam@example.ch",   status: "viewed",   when: "2h ago"     },
  { name: "Linh Pham",       email: "+41 78 …",             status: "pending",  when: "Yesterday"  },
  { name: "Ousmane Sy",      email: "ousmane@example.fr",   status: "expired",  when: "5 days ago" },
];

function statusVisual(s: string, t: any) {
  switch (s) {
    case "joined":  return { bg: t.successSoft, fg: t.success,   label: "Joined",       Icon: CheckCircle2 };
    case "viewed":  return { bg: t.infoSoft,    fg: t.info,      label: "Viewed",       Icon: Clock };
    case "pending": return { bg: t.warningSoft, fg: t.warning,   label: "Pending",      Icon: Clock };
    case "expired": return { bg: t.bgMuted,     fg: t.textMuted, label: "Expired",      Icon: X };
    default:         return { bg: t.bgMuted,    fg: t.textMuted, label: s,              Icon: Clock };
  }
}

export function MembersInvite() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Invite members" subtitle="Diaspora Circle Geneva" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            CHANNEL
          </Text>
          <View style={{ gap: space.sm }}>
            {CHANNELS.map((c) => {
              const Icon = c.Icon;
              const tones = { primary: { bg: t.primarySoft, fg: t.primary }, info: { bg: t.infoSoft, fg: t.info } };
              const tone = tones[c.tone];
              return (
                <Pressable
                  key={c.id}
                  style={[styles.channelRow, { backgroundColor: t.surface, borderColor: t.border }]}
                >
                  <View style={[styles.channelIcon, { backgroundColor: tone.bg }]}>
                    <Icon size={18} color={tone.fg} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{c.label}</Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{c.sub}</Text>
                  </View>
                  <ChevronRight size={16} color={t.textMuted} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            SHAREABLE LINK
          </Text>
          <View style={[styles.linkRow, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
            <Link2 size={16} color={t.textSecondary} />
            <Text variant="bodySmall" weight="semibold" numberOfLines={1} style={{ flex: 1, fontFamily: "monospace" }}>
              {SHAREABLE_LINK}
            </Text>
            <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Copy size={14} color={t.textPrimary} />
            </Pressable>
          </View>
          <Text variant="micro" tone="muted" style={{ marginTop: 4 }}>
            Link expires after 7 days. Anyone you share it with can request to join.
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>MESSAGE PREVIEW</Text>
            <Text variant="caption" weight="semibold" tone="accent">Edit</Text>
          </View>
          <View style={[styles.previewCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text variant="bodySmall" style={{ lineHeight: 20 }}>{MESSAGE_PREVIEW}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: space.sm }}>
              <View style={[styles.langChip, { backgroundColor: t.primarySoft }]}>
                <Text variant="micro" weight="bold" tone="accent">🇫🇷 FR</Text>
              </View>
              <View style={[styles.langChip, { backgroundColor: t.bgMuted }]}>
                <Text variant="micro" weight="semibold" tone="secondary">🇬🇧 EN</Text>
              </View>
              <View style={[styles.langChip, { backgroundColor: t.bgMuted }]}>
                <Text variant="micro" weight="semibold" tone="secondary">🇵🇹 PT</Text>
              </View>
            </View>
          </View>
        </View>

        <Button label="Send invite" leadingIcon={<Send size={16} color="#fff" />} fullWidth size="lg" />

        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>RECENT INVITES</Text>
            <Text variant="caption" weight="semibold" tone="accent">See all</Text>
          </View>
          <Card padded={false}>
            {RECENT.map((r, i) => {
              const v = statusVisual(r.status, t);
              return (
                <View
                  key={r.email}
                  style={[
                    styles.inviteRow,
                    i < RECENT.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{r.name}</Text>
                    <Text variant="caption" tone="secondary" numberOfLines={1}>{r.email}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: v.bg }]}>
                    <v.Icon size={11} color={v.fg} />
                    <Text variant="micro" weight="bold" style={{ color: v.fg }}>{v.label}</Text>
                  </View>
                  <Text variant="micro" tone="muted" style={{ width: 64, textAlign: "right" }}>{r.when}</Text>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  previewCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  langChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
