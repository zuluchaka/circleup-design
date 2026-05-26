import { View, ScrollView, Image, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ShieldCheck,
  Phone,
  Mail,
  IdCard,
  Check,
  Clock,
  AlertTriangle,
  Upload,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius, palette } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type { KycChannelStatus, UserProfile, VerifiedChannel } from "@/product/sections/20-profile/types";

const sampleProfile = profile as unknown as UserProfile;

const CHANNEL_ICONS = {
  phone: Phone,
  email: Mail,
  national_id: IdCard,
} as const;

function statusVisual(status: KycChannelStatus, t: ReturnType<typeof useTheme>) {
  switch (status) {
    case "verified":
      return { Icon: Check, fg: t.success, bg: t.successSoft, label: "Verified" };
    case "pending":
      return { Icon: Clock, fg: t.warning, bg: t.warningSoft, label: "Pending review" };
    case "action_required":
      return { Icon: AlertTriangle, fg: t.warning, bg: t.warningSoft, label: "Action required" };
    case "rejected":
      return { Icon: AlertTriangle, fg: t.danger, bg: t.dangerSoft, label: "Rejected" };
  }
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProfileIdentity({ data = sampleProfile }: { data?: UserProfile } = {}) {
  const t = useTheme();
  const { kyc } = data;
  const isEnhanced = kyc.tier === "enhanced";
  const hasRejection =
    kyc.channels.some((c) => c.status === "rejected") ||
    kyc.documents.some((d) => d.status === "rejected");

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Identity & KYC" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 64, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={
            isEnhanced
              ? [palette.emerald[600], palette.emerald[700]]
              : [palette.indigo[600], palette.indigo[800]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tierCard}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={styles.tierIcon}>
              <ShieldCheck size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.4 }}>
                KYC TIER
              </Text>
              <Text variant="h2" weight="bold" style={{ color: "#fff" }}>
                {isEnhanced ? "Enhanced" : "Basic"}
              </Text>
            </View>
            <View style={styles.tierPill}>
              <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                {kyc.completion}%
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${kyc.completion}%`, backgroundColor: "rgba(255,255,255,0.85)" },
              ]}
            />
          </View>

          <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)", marginTop: space.sm, lineHeight: 16 }}>
            {isEnhanced
              ? `You can join any circle, including high-value circles above CHF 500/mo. Reviewed by ${kyc.reviewer}.`
              : "Upgrade to Enhanced to join circles with contributions above CHF 500/mo and unlock multi-share."}
          </Text>
        </LinearGradient>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm, marginLeft: space.xs }}>
            VERIFIED CHANNELS
          </Text>
          <Card padded={false}>
            {kyc.channels.map((channel, i) => (
              <ChannelRow
                key={channel.key}
                channel={channel}
                last={i === kyc.channels.length - 1}
              />
            ))}
          </Card>
        </View>

        <View>
          <View style={styles.docHeader}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              DOCUMENTS ON FILE
            </Text>
            <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Upload size={12} color={t.primary} />
              <Text variant="caption" weight="semibold" tone="accent">
                Upload new
              </Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: space.md }}
          >
            {kyc.documents.map((doc) => (
              <View
                key={doc.id}
                style={[styles.docCard, { backgroundColor: t.surface, borderColor: t.border }]}
              >
                <View>
                  <Image source={{ uri: doc.thumbnailUrl }} style={styles.docThumb} />
                  <Pressable
                    style={[
                      styles.reuploadBtn,
                      { backgroundColor: t.surface, borderColor: t.border },
                    ]}
                    accessibilityLabel={`Re-upload ${doc.label}`}
                  >
                    <RefreshCw size={12} color={t.primary} strokeWidth={2.5} />
                  </Pressable>
                </View>
                <View style={{ padding: space.sm, gap: 2 }}>
                  <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
                    {doc.label}
                  </Text>
                  <Text variant="micro" tone="secondary">
                    Uploaded {formatDate(doc.uploadedAt)}
                  </Text>
                  {doc.expiresAt ? (
                    <Text variant="micro" tone="muted">
                      Expires {formatDate(doc.expiresAt)}
                    </Text>
                  ) : null}
                  <View style={[styles.docStatus, { backgroundColor: t.successSoft }]}>
                    <Check size={10} color={t.success} strokeWidth={3} />
                    <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.4 }}>
                      VERIFIED
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {hasRejection ? (
          <View style={[styles.reviewCard, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
            <AlertTriangle size={20} color={t.danger} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.danger }}>
                Documents need attention
              </Text>
              <Text variant="caption" style={{ color: t.danger, opacity: 0.85, marginTop: 2 }}>
                The reviewer flagged your passport scan as unreadable. Re-submit a clearer copy to keep your KYC active.
              </Text>
              <View style={{ marginTop: space.md }}>
                <Button
                  label="Re-submit documents"
                  variant="primary"
                  size="md"
                  trailingIcon={<Upload size={14} color="#fff" />}
                />
              </View>
            </View>
          </View>
        ) : !isEnhanced ? (
          <View style={[styles.upgradeCard, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
            <Text variant="bodySmall" weight="bold" style={{ color: t.primaryStrong }}>
              Upgrade to Enhanced KYC
            </Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 4, lineHeight: 16 }}>
              Required for circles above CHF 500/mo. Takes about 4 minutes — passport + selfie.
            </Text>
            <View style={{ marginTop: space.md }}>
              <Button
                label="Upgrade now"
                variant="primary"
                size="md"
                trailingIcon={<ArrowUpRight size={16} color="#fff" />}
              />
            </View>
          </View>
        ) : (
          <View style={[styles.reviewCard, { backgroundColor: t.successSoft, borderColor: t.success }]}>
            <ShieldCheck size={20} color={t.success} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" style={{ color: t.success }}>
                You're fully verified
              </Text>
              <Text variant="caption" style={{ color: t.success, opacity: 0.85 }}>
                Re-verification required by 2027 (Permit B renewal).
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ChannelRow({ channel, last }: { channel: VerifiedChannel; last: boolean }) {
  const t = useTheme();
  const Icon = CHANNEL_ICONS[channel.key];
  const v = statusVisual(channel.status, t);
  return (
    <View
      style={[
        styles.channelRow,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.channelIcon, { backgroundColor: t.bgMuted }]}>
        <Icon size={18} color={t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">
          {channel.label}
        </Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
          {channel.value}
        </Text>
      </View>
      <View style={[styles.statusPill, { backgroundColor: v.bg }]}>
        <v.Icon size={11} color={v.fg} strokeWidth={3} />
        <Text variant="micro" weight="bold" style={{ color: v.fg, letterSpacing: 0.4 }}>
          {v.label.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tierCard: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  tierIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  tierPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: radius.pill,
  },
  progressTrack: {
    marginTop: space.md,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  channelIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  docHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.sm,
    paddingHorizontal: space.xs,
  },
  docCard: {
    width: 200,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  docThumb: {
    width: "100%",
    height: 100,
  },
  reuploadBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  docStatus: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginTop: 4,
  },
  upgradeCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  reviewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
