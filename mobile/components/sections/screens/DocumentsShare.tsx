// Share document for /sections/documents/share.
// Visibility picker (All members / Committee / Organisers / Public link),
// member shortlist, expiration toggle, copy/email/SMS chips.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Switch } from "react-native";
import {
  FileText, Users, Crown, ShieldCheck, Link2, Mail, MessageCircle,
  Copy, Calendar, Check, Lock,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type Vis = "all" | "committee" | "organisers" | "public";

const DOC = { title: "Bylaws · v3.2", category: "Governance", size: "412 KB" };

const VIS_OPTS: { value: Vis; label: string; sub: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { value: "all",        label: "All members",      sub: "184 members can view",         Icon: Users },
  { value: "committee",  label: "Committee",         sub: "Finance + Membership · 11",    Icon: ShieldCheck },
  { value: "organisers", label: "Organisers only",   sub: "President + Treasurer · 2",    Icon: Crown },
  { value: "public",     label: "Public link",       sub: "Anyone with the URL",          Icon: Link2 },
];

const LINK = "circleup.app/d/dgg-bylaws-v3-2";

export function DocumentsShare() {
  const t = useTheme();
  const [vis, setVis] = useState<Vis>("all");
  const [expires, setExpires] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Share document" subtitle="Section 07 · Documents" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 120, gap: space.lg }}>
        <Card padded={false}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md }}>
            <View style={[styles.docIcon, { backgroundColor: t.primarySoft }]}>
              <FileText size={20} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold">{DOC.title}</Text>
              <Text variant="caption" tone="secondary">{DOC.category} · {DOC.size}</Text>
            </View>
          </View>
        </Card>

        {/* Visibility */}
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            WHO CAN VIEW
          </Text>
          <View style={{ gap: space.sm }}>
            {VIS_OPTS.map((o) => {
              const sel = vis === o.value;
              const Icon = o.Icon;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => setVis(o.value)}
                  style={[
                    styles.visRow,
                    {
                      backgroundColor: sel ? t.primarySoft : t.surface,
                      borderColor: sel ? t.primary : t.border,
                      borderWidth: sel ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[styles.visIcon, { backgroundColor: sel ? t.primary : t.bgMuted }]}>
                    <Icon size={18} color={sel ? "#fff" : t.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold">{o.label}</Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{o.sub}</Text>
                  </View>
                  <View style={[styles.radio, { borderColor: sel ? t.primary : t.border, backgroundColor: sel ? t.primary : "transparent" }]}>
                    {sel ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Link block — only for public */}
        {vis === "public" ? (
          <View>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              PUBLIC LINK
            </Text>
            <View style={[styles.linkRow, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Link2 size={14} color={t.textSecondary} />
              <Text variant="caption" weight="semibold" style={{ flex: 1, fontFamily: "monospace" }} numberOfLines={1}>
                {LINK}
              </Text>
              <Pressable style={[styles.copyBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
                <Copy size={12} color={t.textPrimary} />
              </Pressable>
            </View>
            <View style={[styles.expiresRow, { backgroundColor: t.surface, borderColor: t.border }]}>
              <View style={[styles.expIcon, { backgroundColor: t.warningSoft }]}>
                <Calendar size={14} color={t.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="semibold">Link expires in 7 days</Text>
                <Text variant="caption" tone="secondary">Auto-revoked on 1 June 2026</Text>
              </View>
              <Switch value={expires} onValueChange={setExpires} />
            </View>
          </View>
        ) : null}

        {/* Send via */}
        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            ALSO SEND VIA
          </Text>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Pressable style={[styles.sendChip, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Mail size={16} color={t.primary} />
              <Text variant="caption" weight="semibold">Email</Text>
            </Pressable>
            <Pressable style={[styles.sendChip, { backgroundColor: t.surface, borderColor: t.border }]}>
              <MessageCircle size={16} color={t.primary} />
              <Text variant="caption" weight="semibold">SMS</Text>
            </Pressable>
            <Pressable style={[styles.sendChip, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Copy size={16} color={t.primary} />
              <Text variant="caption" weight="semibold">Copy link</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.note, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
          <Lock size={14} color={t.info} />
          <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 16 }}>
            Audit log records every view and download. You can revoke access anytime from the document detail.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.cta, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button label="Share document" fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  docIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  visRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md },
  visIcon: { width: 40, height: 40, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  linkRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingHorizontal: space.md, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1 },
  copyBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  expiresRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, marginTop: space.sm, borderRadius: radius.md, borderWidth: 1 },
  expIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sendChip: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1 },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 6, padding: space.md, borderRadius: radius.md, borderWidth: 1 },
  cta: { position: "absolute", left: 0, right: 0, bottom: 0, padding: space.lg, paddingBottom: 32, borderTopWidth: StyleSheet.hairlineWidth },
});
