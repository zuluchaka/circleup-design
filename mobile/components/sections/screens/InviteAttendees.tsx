import { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet, Switch } from "react-native";
import {
  Mail,
  MessageCircle,
  Phone,
  Bell as BellIcon,
  Inbox,
  Send,
  Check,
  Clock,
  Lock,
  Users,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

type ChannelId = "whatsapp" | "sms" | "email" | "push" | "in_app";

type Audience = {
  id: string;
  label: string;
  hint: string;
  estimatedReach: number;
};

type ChannelOption = {
  id: ChannelId;
  label: string;
  hint: string;
};

function channelIcon(id: ChannelId) {
  if (id === "whatsapp") return MessageCircle;
  if (id === "sms") return Phone;
  if (id === "email") return Mail;
  if (id === "push") return BellIcon;
  return Inbox;
}

export function InviteAttendees() {
  const t = useTheme();
  const panel = comms.inviteAttendeesPanel as {
    eventId: string;
    audiences: Audience[];
    channels: ChannelOption[];
    defaultMessage: string;
  };
  const eventDetail = comms.eventDetail as any;

  const [audienceId, setAudienceId] = useState<string>(panel.audiences[0].id);
  const [channels, setChannels] = useState<Record<ChannelId, boolean>>({
    whatsapp: true,
    sms: false,
    email: true,
    push: true,
    in_app: false,
  });
  const [message, setMessage] = useState(panel.defaultMessage);
  const [scheduleLater, setScheduleLater] = useState(false);

  const audience = useMemo(() => panel.audiences.find((a) => a.id === audienceId)!, [panel.audiences, audienceId]);
  const activeChannels = (Object.keys(channels) as ChannelId[]).filter((k) => channels[k]);
  const channelLabel = activeChannels.length === 0 ? "Pick at least one channel" : activeChannels.length === 1 ? panel.channels.find((c) => c.id === activeChannels[0])?.label : `${activeChannels.length} channels`;

  const toggle = (id: ChannelId) => setChannels((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Invite attendees"
        subtitle={eventDetail.title}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Event preview chip */}
        <View style={[styles.eventPill, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.eventDot, { backgroundColor: eventDetail.accent }]} />
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" numberOfLines={1}>{eventDetail.title}</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
              {new Date(eventDetail.date).toLocaleDateString("en-CH", { weekday: "short", day: "numeric", month: "short" })} · {eventDetail.location.venue}
            </Text>
          </View>
          <Text variant="micro" tone="muted" weight="semibold">
            {eventDetail.rsvp.yes}/{eventDetail.capacity}
          </Text>
        </View>

        {/* Audience selector */}
        <View>
          <FieldLabel>Audience</FieldLabel>
          <View style={{ gap: space.sm }}>
            {panel.audiences.map((a) => (
              <AudienceRow
                key={a.id}
                a={a}
                active={a.id === audienceId}
                onSelect={() => setAudienceId(a.id)}
                t={t}
              />
            ))}
          </View>
        </View>

        {/* Channels */}
        <View>
          <FieldLabel>Channels</FieldLabel>
          <Text variant="micro" tone="secondary" style={{ marginBottom: space.sm, lineHeight: 14 }}>
            Mix channels for redundancy — picking 2 boosts open rate by ~30%.
          </Text>
          <View style={{ gap: space.sm }}>
            {panel.channels.map((c) => (
              <ChannelRow
                key={c.id}
                c={c}
                active={channels[c.id]}
                onToggle={() => toggle(c.id)}
                t={t}
              />
            ))}
          </View>
        </View>

        {/* Message composer */}
        <View>
          <FieldLabel>Message</FieldLabel>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Add a personal note. Will be inserted before the auto-generated RSVP link."
            placeholderTextColor={t.textMuted}
            multiline
            maxLength={400}
            style={[
              styles.input,
              {
                minHeight: 120,
                color: t.textPrimary,
                backgroundColor: t.surface,
                borderColor: t.border,
                textAlignVertical: "top",
              },
            ]}
          />
          <Text variant="micro" tone="muted" align="right">{message.length}/400</Text>
        </View>

        {/* Preview */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            PREVIEW · {channelLabel?.toUpperCase()}
          </Text>
          <View style={[styles.previewBox, { backgroundColor: t.bgMuted }]}>
            <Text variant="caption" weight="bold">Mariama Sow · Secretary</Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 4, lineHeight: 18 }}>
              {message || "(empty message)"}
            </Text>
            <View style={[styles.previewLink, { borderColor: t.border, backgroundColor: t.surface }]}>
              <Text variant="micro" weight="bold" tone="accent" style={{ fontFamily: "Menlo" }}>
                circleup.ch/e/summerfest?token=…
              </Text>
            </View>
          </View>
        </Card>

        {/* Schedule */}
        <Pressable
          onPress={() => setScheduleLater(!scheduleLater)}
          style={[
            styles.toggle,
            {
              backgroundColor: scheduleLater ? t.warningSoft : t.surface,
              borderColor: scheduleLater ? t.warning : t.border,
              borderWidth: scheduleLater ? 1.5 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: scheduleLater ? t.warning : "transparent",
                borderColor: scheduleLater ? t.warning : t.borderStrong,
              },
            ]}
          >
            {scheduleLater ? <Check size={11} color="#fff" strokeWidth={3} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold">Schedule for later</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
              Default sends immediately. Toggle to pick a date/time.
            </Text>
          </View>
          <Clock size={16} color={scheduleLater ? t.warning : t.textMuted} />
        </Pressable>

        {/* Compliance */}
        <View style={[styles.compliance, { backgroundColor: t.bgMuted }]}>
          <Lock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted" weight="semibold" style={{ flex: 1, lineHeight: 14 }}>
            Members can opt out of any channel from their notification settings. SMS is rate-limited to 2/week.
          </Text>
        </View>
      </ScrollView>

      {/* CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Users size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            Sending to <Text variant="micro" weight="bold">{audience.estimatedReach}</Text> · via {channelLabel}
          </Text>
        </View>
        <Button
          label={scheduleLater ? "Schedule invitations" : `Send to ${audience.estimatedReach} ${audience.estimatedReach === 1 ? "person" : "people"}`}
          fullWidth
          size="lg"
          disabled={activeChannels.length === 0}
          trailingIcon={<Send size={16} color="#fff" />}
        />
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

function AudienceRow({
  a,
  active,
  onSelect,
  t,
}: {
  a: Audience;
  active: boolean;
  onSelect: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.audienceRow,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.audienceIcon, { backgroundColor: active ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
        <Users size={14} color={active ? t.primary : t.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold">{a.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{a.hint}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>REACH</Text>
        <Text variant="caption" weight="bold">{a.estimatedReach}</Text>
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

function ChannelRow({
  c,
  active,
  onToggle,
  t,
}: {
  c: ChannelOption;
  active: boolean;
  onToggle: () => void;
  t: AppTheme;
}) {
  const Icon = channelIcon(c.id);
  return (
    <Pressable
      onPress={onToggle}
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
        <Text variant="bodySmall" weight="bold">{c.label}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{c.hint}</Text>
      </View>
      <Switch
        value={active}
        onValueChange={onToggle}
        trackColor={{ false: t.bgMuted, true: t.primarySoft }}
        thumbColor={active ? t.primary : t.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eventPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  audienceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  audienceIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
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
  input: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
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
  previewBox: {
    padding: space.md,
    borderRadius: radius.md,
  },
  previewLink: {
    marginTop: space.sm,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  compliance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
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
