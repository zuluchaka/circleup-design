import { useMemo, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  CheckCheck,
  Image as ImageIcon,
  AtSign,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { useTheme, space, radius, palette } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

type Message = {
  id: string;
  from: string;
  body: string;
  at: string;
  mine: boolean;
  attachment?: { kind: "image" | "file"; label: string; meta?: string };
  status?: "sent" | "delivered" | "read";
};

const SYSTEM_NOTE = {
  id: "sys_note",
  body: "Today",
};

export function CommsThread() {
  const t = useTheme();
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView | null>(null);

  const thread = comms.thread;

  const messages = useMemo<Message[]>(() => {
    return thread.messages.map((m, i) => ({
      ...m,
      status: m.mine ? (i === thread.messages.length - 1 ? "delivered" : "read") : undefined,
      attachment:
        m.id === "m4"
          ? { kind: "image", label: "Reconciliation_May.png", meta: "240 KB · PNG" }
          : undefined,
    }));
  }, [thread]);

  const peer = { name: thread.title, hue: "#10b981", status: "online" as const };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={[styles.header, { backgroundColor: t.bgElevated, borderBottomColor: t.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.headerBack}>
          <ArrowLeft size={22} color={t.textPrimary} />
        </Pressable>
        <Pressable style={styles.headerPeer}>
          <View style={{ position: "relative" }}>
            <Avatar name={peer.name} hue={peer.hue} size="sm" />
            <View
              style={[
                styles.headerDot,
                { backgroundColor: palette.emerald[500], borderColor: t.bgElevated },
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="body" weight="bold" numberOfLines={1}>
              {peer.name}
            </Text>
            <Text variant="micro" tone="muted" numberOfLines={1}>
              Online · typing…
            </Text>
          </View>
        </Pressable>
        <Pressable hitSlop={10} style={styles.headerAction}>
          <Phone size={18} color={t.textSecondary} />
        </Pressable>
        <Pressable hitSlop={10} style={styles.headerAction}>
          <Video size={18} color={t.textSecondary} />
        </Pressable>
        <Pressable hitSlop={10} style={styles.headerAction}>
          <MoreVertical size={18} color={t.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: space.lg, gap: space.sm, paddingBottom: space.xl }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View style={styles.systemRow}>
          <View style={[styles.systemPill, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
            <Text variant="micro" weight="semibold" tone="muted">
              {SYSTEM_NOTE.body}
            </Text>
          </View>
        </View>

        {messages.map((m, idx) => {
          const prev = messages[idx - 1];
          const showAvatar = !m.mine && (!prev || prev.from !== m.from);
          const showName = showAvatar;
          return (
            <View
              key={m.id}
              style={[
                styles.row,
                { justifyContent: m.mine ? "flex-end" : "flex-start" },
                showAvatar ? { marginTop: space.sm } : null,
              ]}
            >
              {!m.mine ? (
                <View style={styles.avatarSlot}>
                  {showAvatar ? <Avatar name={m.from} hue={peer.hue} size="xs" /> : null}
                </View>
              ) : null}
              <View style={[styles.bubbleWrap, m.mine ? { alignItems: "flex-end" } : null]}>
                {showName ? (
                  <Text variant="micro" weight="semibold" tone="muted" style={{ marginBottom: 2 }}>
                    {m.from}
                  </Text>
                ) : null}
                <View
                  style={[
                    styles.bubble,
                    m.mine
                      ? {
                          backgroundColor: t.primary,
                          borderTopRightRadius: 4,
                        }
                      : {
                          backgroundColor: t.surface,
                          borderColor: t.border,
                          borderWidth: 1,
                          borderTopLeftRadius: 4,
                        },
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    style={{
                      color: m.mine ? "#fff" : t.textPrimary,
                      lineHeight: 20,
                    }}
                  >
                    {m.body}
                  </Text>
                  {m.attachment ? (
                    <View
                      style={[
                        styles.attachment,
                        {
                          backgroundColor: m.mine ? "rgba(255,255,255,0.14)" : t.bgMuted,
                          borderColor: m.mine ? "rgba(255,255,255,0.24)" : t.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.attachmentIcon,
                          {
                            backgroundColor: m.mine ? "rgba(255,255,255,0.2)" : t.primarySoft,
                          },
                        ]}
                      >
                        <ImageIcon size={14} color={m.mine ? "#fff" : t.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          variant="caption"
                          weight="semibold"
                          style={{ color: m.mine ? "#fff" : t.textPrimary }}
                          numberOfLines={1}
                        >
                          {m.attachment.label}
                        </Text>
                        {m.attachment.meta ? (
                          <Text
                            variant="micro"
                            style={{
                              color: m.mine ? "rgba(255,255,255,0.78)" : t.textSecondary,
                            }}
                          >
                            {m.attachment.meta}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                </View>
                <View style={styles.metaRow}>
                  <Text variant="micro" tone="muted">
                    {m.at}
                  </Text>
                  {m.mine ? (
                    <CheckCheck
                      size={12}
                      color={m.status === "read" ? t.primary : t.textMuted}
                    />
                  ) : null}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.composer, { backgroundColor: t.bgElevated, borderTopColor: t.border }]}>
        <Pressable hitSlop={6} style={styles.composerIcon}>
          <Paperclip size={20} color={t.textSecondary} />
        </Pressable>
        <View style={[styles.composerInputWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message Amara…"
            placeholderTextColor={t.textMuted}
            style={{ flex: 1, color: t.textPrimary, fontSize: 14, paddingVertical: 0 }}
            multiline
          />
          <Pressable hitSlop={6}>
            <AtSign size={16} color={t.textMuted} />
          </Pressable>
          <Pressable hitSlop={6}>
            <Smile size={16} color={t.textMuted} />
          </Pressable>
        </View>
        <Pressable
          hitSlop={6}
          style={[
            styles.sendBtn,
            { backgroundColor: draft.trim() ? t.primary : t.bgMuted },
          ]}
        >
          <Send size={16} color={draft.trim() ? "#fff" : t.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    gap: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: {
    width: 28,
    alignItems: "flex-start",
  },
  headerPeer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  headerDot: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  headerAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  systemRow: {
    alignItems: "center",
    paddingVertical: space.sm,
  },
  systemPill: {
    paddingHorizontal: space.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  avatarSlot: {
    width: 26,
    alignItems: "center",
  },
  bubbleWrap: {
    maxWidth: "78%",
  },
  bubble: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.lg,
    gap: space.sm,
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  attachmentIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  composerIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  composerInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    minHeight: 36,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
