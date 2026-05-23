import { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import {
  Megaphone,
  Users,
  ChevronRight,
  Send,
  Calendar,
  Image as ImageIcon,
  Paperclip,
  Pin,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Check,
  Eye,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";

type AudienceId = "all_members" | "main_circle" | "committee" | "newcomers" | "custom";
type ChannelId = "push" | "email" | "sms" | "in_app";

type Audience = {
  id: AudienceId;
  label: string;
  hint: string;
  reach: number;
};

type Channel = {
  id: ChannelId;
  label: string;
  icon: typeof Bell;
  hint: string;
};

const AUDIENCES: Audience[] = [
  { id: "all_members",  label: "All members",       hint: "Every active member of GDC",      reach: 184 },
  { id: "main_circle",  label: "Main CHF Circle",   hint: "12 active circle members",         reach: 12  },
  { id: "committee",    label: "Committee",         hint: "Treasurer, secretary, president",  reach: 5   },
  { id: "newcomers",    label: "Newcomers · 90d",   hint: "Joined since Feb 2026",            reach: 23  },
  { id: "custom",       label: "Custom list",       hint: "Pick specific members",            reach: 0   },
];

const CHANNELS: Channel[] = [
  { id: "push",   label: "Push notification", icon: Bell,         hint: "Native push to all devices" },
  { id: "email",  label: "Email",             icon: Mail,         hint: "Subject + formatted body"   },
  { id: "sms",    label: "SMS",               icon: MessageSquare, hint: "First 140 chars, RSVP link" },
  { id: "in_app", label: "In-app inbox",      icon: Smartphone,    hint: "Sticky for 14 days"         },
];

export function AnnouncementComposer() {
  const t = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState("AGM 2026 — Save the date");
  const [body, setBody] = useState(
    "Save the date for the AGM on June 8, 18:00. RSVP opens this Friday. Snacks and child-care will be provided.",
  );
  const [audience, setAudience] = useState<AudienceId>("all_members");
  const [pinned, setPinned] = useState(true);
  const [channels, setChannels] = useState<Record<ChannelId, boolean>>({
    push: true,
    email: true,
    sms: false,
    in_app: true,
  });
  const [schedule, setSchedule] = useState<"now" | "later">("now");

  const audienceMeta = AUDIENCES.find((a) => a.id === audience)!;
  const enabledChannels = (Object.keys(channels) as ChannelId[]).filter((c) => channels[c]);
  const reach = audienceMeta.reach;
  const draftBytes = body.length;
  const titleBytes = title.length;

  const channelMix = useMemo(() => enabledChannels.map((c) => CHANNELS.find((x) => x.id === c)!.label).join(" + "), [enabledChannels]);

  const ready = title.trim().length > 0 && body.trim().length > 0 && enabledChannels.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="New announcement"
        subtitle={`${reach} members · ${enabledChannels.length} channels`}
        onBack={() => router.back()}
        trailing={
          <HeaderIconButton>
            <Eye size={18} color={t.textSecondary} />
          </HeaderIconButton>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={[styles.heroCard, { backgroundColor: t.warningSoft, borderColor: t.warning + "33" }]}>
          <View style={[styles.heroIcon, { backgroundColor: t.warning + "22" }]}>
            <Megaphone size={20} color={t.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.warning, letterSpacing: 0.6 }}>
              BROADCAST DRAFT
            </Text>
            <Text variant="bodySmall" tone="secondary" style={{ marginTop: 2 }}>
              Sent to {audienceMeta.label.toLowerCase()} via {channelMix || "—"}.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="caption" weight="semibold" tone="muted" style={styles.sectionLabel}>
            TITLE
          </Text>
          <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.border }]}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Headline (max 80 chars)"
              placeholderTextColor={t.textMuted}
              style={{ color: t.textPrimary, fontSize: 16, fontWeight: "600", paddingVertical: 0 }}
            />
          </View>
          <Text variant="micro" tone="muted" align="right" style={{ marginTop: 4 }}>
            {titleBytes} / 80
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="caption" weight="semibold" tone="muted" style={styles.sectionLabel}>
            MESSAGE
          </Text>
          <View
            style={[
              styles.field,
              { backgroundColor: t.surface, borderColor: t.border, minHeight: 120 },
            ]}
          >
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="What do you want everyone to know?"
              placeholderTextColor={t.textMuted}
              multiline
              style={{
                color: t.textPrimary,
                fontSize: 14,
                lineHeight: 20,
                paddingVertical: 0,
                minHeight: 96,
                textAlignVertical: "top",
              }}
            />
          </View>
          <View style={styles.attachmentsRow}>
            <Pressable
              style={[styles.attachChip, { backgroundColor: t.bgMuted, borderColor: t.border }]}
            >
              <Paperclip size={12} color={t.textSecondary} />
              <Text variant="micro" weight="semibold" tone="secondary">
                Attach file
              </Text>
            </Pressable>
            <Pressable
              style={[styles.attachChip, { backgroundColor: t.bgMuted, borderColor: t.border }]}
            >
              <ImageIcon size={12} color={t.textSecondary} />
              <Text variant="micro" weight="semibold" tone="secondary">
                Image
              </Text>
            </Pressable>
            <Text variant="micro" tone="muted" style={{ marginLeft: "auto" }}>
              {draftBytes} chars
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="caption" weight="semibold" tone="muted" style={styles.sectionLabel}>
            AUDIENCE
          </Text>
          <View style={[styles.groupCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            {AUDIENCES.map((a, i) => {
              const active = a.id === audience;
              return (
                <Pressable
                  key={a.id}
                  onPress={() => setAudience(a.id)}
                  style={[
                    styles.audienceRow,
                    {
                      borderBottomColor: t.border,
                      borderBottomWidth: i === AUDIENCES.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: active ? t.primary : t.border,
                        backgroundColor: active ? t.primary : "transparent",
                      },
                    ]}
                  >
                    {active ? <Check size={12} color="#fff" /> : null}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="bodySmall" weight="semibold">
                      {a.label}
                    </Text>
                    <Text variant="micro" tone="muted">
                      {a.hint}
                    </Text>
                  </View>
                  <View style={[styles.reachPill, { backgroundColor: t.bgMuted }]}>
                    <Users size={11} color={t.textSecondary} />
                    <Text variant="micro" weight="bold" tone="secondary">
                      {a.reach || "—"}
                    </Text>
                  </View>
                  {a.id === "custom" ? (
                    <ChevronRight size={14} color={t.textMuted} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="caption" weight="semibold" tone="muted" style={styles.sectionLabel}>
            CHANNELS
          </Text>
          <View style={[styles.groupCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            {CHANNELS.map((c, i) => {
              const Icon = c.icon;
              const on = channels[c.id];
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setChannels((s) => ({ ...s, [c.id]: !s[c.id] }))}
                  style={[
                    styles.channelRow,
                    {
                      borderBottomColor: t.border,
                      borderBottomWidth: i === CHANNELS.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.channelIcon,
                      { backgroundColor: on ? t.primarySoft : t.bgMuted },
                    ]}
                  >
                    <Icon size={16} color={on ? t.primary : t.textMuted} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="bodySmall" weight="semibold">
                      {c.label}
                    </Text>
                    <Text variant="micro" tone="muted">
                      {c.hint}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.toggle,
                      {
                        backgroundColor: on ? t.primary : t.bgMuted,
                        borderColor: on ? t.primary : t.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleKnob,
                        {
                          backgroundColor: "#fff",
                          alignSelf: on ? "flex-end" : "flex-start",
                        },
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="caption" weight="semibold" tone="muted" style={styles.sectionLabel}>
            OPTIONS
          </Text>
          <Pressable
            onPress={() => setPinned((p) => !p)}
            style={[styles.optionRow, { backgroundColor: t.surface, borderColor: t.border }]}
          >
            <View style={[styles.channelIcon, { backgroundColor: pinned ? t.primarySoft : t.bgMuted }]}>
              <Pin size={16} color={pinned ? t.primary : t.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="semibold">
                Pin to inbox
              </Text>
              <Text variant="micro" tone="muted">
                Sticky at the top for 14 days.
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: pinned ? t.primary : t.bgMuted,
                  borderColor: pinned ? t.primary : t.border,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  { backgroundColor: "#fff", alignSelf: pinned ? "flex-end" : "flex-start" },
                ]}
              />
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text variant="caption" weight="semibold" tone="muted" style={styles.sectionLabel}>
            DELIVERY
          </Text>
          <View style={[styles.scheduleWrap, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Pressable
              onPress={() => setSchedule("now")}
              style={[
                styles.scheduleOption,
                {
                  backgroundColor: schedule === "now" ? t.primary : "transparent",
                },
              ]}
            >
              <Send size={14} color={schedule === "now" ? "#fff" : t.textSecondary} />
              <Text
                variant="caption"
                weight="bold"
                style={{ color: schedule === "now" ? "#fff" : t.textSecondary }}
              >
                Send now
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSchedule("later")}
              style={[
                styles.scheduleOption,
                {
                  backgroundColor: schedule === "later" ? t.primary : "transparent",
                },
              ]}
            >
              <Calendar size={14} color={schedule === "later" ? "#fff" : t.textSecondary} />
              <Text
                variant="caption"
                weight="bold"
                style={{ color: schedule === "later" ? "#fff" : t.textSecondary }}
              >
                Schedule
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: t.bgElevated, borderTopColor: t.border }]}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" tone="muted">
            Estimated reach
          </Text>
          <Text variant="h3" weight="bold">
            {reach} members
          </Text>
        </View>
        <Pressable
          style={[
            styles.sendBtn,
            { backgroundColor: ready ? t.primary : t.bgMuted },
          ]}
        >
          <Send size={16} color={ready ? "#fff" : t.textMuted} />
          <Text
            variant="caption"
            weight="bold"
            style={{ color: ready ? "#fff" : t.textMuted }}
          >
            {schedule === "now" ? "Send now" : "Schedule"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    marginHorizontal: space.lg,
    marginTop: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  heroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
  },
  sectionLabel: {
    letterSpacing: 0.6,
    marginBottom: space.xs,
  },
  field: {
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  attachmentsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.sm,
  },
  attachChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  groupCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  audienceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  reachPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  channelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    padding: 2,
    borderWidth: 1,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  scheduleWrap: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  scheduleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.pill,
  },
});
