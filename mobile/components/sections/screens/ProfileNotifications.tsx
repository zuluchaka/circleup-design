import { useState } from "react";
import { View, ScrollView, Pressable, Switch, StyleSheet } from "react-native";
import {
  Moon,
  Coins,
  Banknote,
  Vote,
  Scale,
  Megaphone,
  Sparkles,
  Bell,
  Mail,
  Smartphone,
  MessageCircle,
  ChevronDown,
} from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useTheme, space, radius } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type {
  NotificationCategory,
  NotificationCategoryKey,
  NotificationChannel,
  UserProfile,
} from "@/product/sections/20-profile/types";

const CATEGORY_ICONS: Record<NotificationCategoryKey, React.ComponentType<{ size?: number; color?: string }>> = {
  contributions_due: Coins,
  payouts: Banknote,
  votes: Vote,
  disputes: Scale,
  announcements: Megaphone,
  marketing: Sparkles,
};

const CHANNEL_META: Array<{
  key: NotificationChannel;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}> = [
  { key: "push", label: "Push", Icon: Bell },
  { key: "email", label: "Email", Icon: Mail },
  { key: "sms", label: "SMS", Icon: Smartphone },
  { key: "whatsapp", label: "WA", Icon: MessageCircle },
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function ProfileNotifications({
  initialDirty = false,
}: { initialDirty?: boolean } = {}) {
  const t = useTheme();
  const data = profile as unknown as UserProfile;
  const { notifications } = data;
  const [dirty, setDirty] = useState(initialDirty);
  const markDirty = () => setDirty(true);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Notifications" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 120, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={[styles.icon, { backgroundColor: t.primarySoft }]}>
              <Moon size={18} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="semibold">
                Quiet hours
              </Text>
              <Text variant="caption" tone="secondary">
                Push and SMS pause during this window.
              </Text>
            </View>
            <Switch value={notifications.quietHours.enabled} onValueChange={markDirty} />
          </View>

          <View style={[styles.quietRow, { backgroundColor: t.bgMuted }]}>
            <Pressable
              style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}
              onPress={markDirty}
            >
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                START
              </Text>
              <View style={styles.quietValueRow}>
                <Text variant="h2" weight="bold">
                  {pad2(notifications.quietHours.startHour)}:00
                </Text>
                <ChevronDown size={16} color={t.textMuted} />
              </View>
            </Pressable>
            <View style={[styles.quietSep, { backgroundColor: t.border }]} />
            <Pressable
              style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}
              onPress={markDirty}
            >
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                END
              </Text>
              <View style={styles.quietValueRow}>
                <Text variant="h2" weight="bold">
                  {pad2(notifications.quietHours.endHour)}:00
                </Text>
                <ChevronDown size={16} color={t.textMuted} />
              </View>
            </Pressable>
          </View>
          <Text variant="micro" tone="muted" align="center" style={{ marginTop: 6 }}>
            {notifications.quietHours.timezone.replace("_", " ")} · contributions-due alerts always come through
          </Text>
        </Card>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            BY CATEGORY
          </Text>
          <Card padded={false}>
            <View style={[styles.headerRow, { borderBottomColor: t.border }]}>
              <View style={{ flex: 1 }} />
              {CHANNEL_META.map((ch) => (
                <View key={ch.key} style={styles.channelHeader}>
                  <ch.Icon size={12} color={t.textMuted} />
                  <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
                    {ch.label.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
            {notifications.categories.map((cat, i) => (
              <CategoryRow
                key={cat.key}
                category={cat}
                last={i === notifications.categories.length - 1}
                onToggle={markDirty}
              />
            ))}
          </Card>
        </View>
      </ScrollView>

      {dirty ? (
        <View style={[styles.saveBar, { backgroundColor: t.surface, borderTopColor: t.border }]}>
          <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
            Unsaved changes — they'll apply across all your devices.
          </Text>
          <Button label="Save" variant="primary" />
        </View>
      ) : null}
    </View>
  );
}

function CategoryRow({
  category,
  last,
  onToggle,
}: {
  category: NotificationCategory;
  last: boolean;
  onToggle: () => void;
}) {
  const t = useTheme();
  const Icon = CATEGORY_ICONS[category.key];
  return (
    <View
      style={[
        styles.catRow,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, flex: 1, paddingRight: space.sm }}>
        <View style={[styles.icon, { backgroundColor: t.bgMuted, width: 30, height: 30, borderRadius: 8 }]}>
          <Icon size={14} color={t.textSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
            {category.label}
          </Text>
        </View>
      </View>
      {CHANNEL_META.map((ch) => {
        const on = category.channels[ch.key];
        return (
          <Pressable
            key={ch.key}
            onPress={onToggle}
            style={[
              styles.toggle,
              {
                backgroundColor: on ? t.primary : t.bgMuted,
                borderColor: on ? t.primary : t.border,
              },
            ]}
          >
            <Text
              variant="micro"
              weight="bold"
              style={{ color: on ? "#fff" : t.textMuted, letterSpacing: 0.4 }}
            >
              {on ? "ON" : "OFF"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  quietRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.md,
    paddingVertical: space.md,
    borderRadius: radius.md,
  },
  quietSep: {
    width: 1,
    height: 36,
  },
  quietValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  channelHeader: {
    width: 44,
    alignItems: "center",
    gap: 2,
  },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
  },
  toggle: {
    width: 44,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginLeft: 2,
  },
  saveBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    paddingBottom: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
