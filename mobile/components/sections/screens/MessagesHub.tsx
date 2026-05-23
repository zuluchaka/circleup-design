import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  Megaphone,
  MessageSquare,
  Bell,
  ChevronRight,
  Pencil,
  Users,
  Pin,
  CheckCheck,
  AtSign,
  Paperclip,
  Phone,
  Video,
  Calendar,
  QrCode,
  Settings as SettingsIcon,
  Filter as FilterIcon,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

const ROUTES = {
  thread: "/sections/communication-and-events/thread",
  events: "/sections/communication-and-events/events",
  qr: "/sections/communication-and-events/qr",
  composer: "/sections/communication-and-events/announcement-composer",
} as const;

type Filter = "All" | "Chats" | "Groups" | "Announcements" | "Notifications";

const FILTERS: Filter[] = ["All", "Chats", "Groups", "Announcements", "Notifications"];

type InboxItem = {
  id: string;
  kind: string;
  title: string;
  preview: string;
  at: string;
  unread: boolean;
  channel: string;
};

const PRESENCE = [
  { name: "Amara Ofori", hue: "#10b981", status: "online" as const, unread: 2 },
  { name: "Kofi Mensah", hue: "#4f46e5", status: "online" as const, unread: 0 },
  { name: "Mariam Sow", hue: "#ec4899", status: "online" as const, unread: 1 },
  { name: "Olusegun A.", hue: "#f59e0b", status: "away" as const, unread: 0 },
  { name: "Linh Pham", hue: "#0ea5e9", status: "offline" as const, unread: 0 },
  { name: "Selam Haile", hue: "#8b5cf6", status: "online" as const, unread: 0 },
];

const PINNED = [
  {
    id: "grp_main_chf",
    title: "Main CHF Circle",
    preview: "Mariam: budget draft v3 attached.",
    at: "10:14",
    unreadCount: 4,
    isGroup: true,
    memberCount: 12,
    hue: "#4f46e5",
  },
  {
    id: "grp_treasury",
    title: "Treasury · committee",
    preview: "Kofi: reconciled — ready for sign-off.",
    at: "09:58",
    unreadCount: 0,
    isGroup: true,
    memberCount: 5,
    hue: "#10b981",
  },
];

function matchesFilter(item: InboxItem, filter: Filter): boolean {
  if (filter === "All") return true;
  if (filter === "Chats") return item.kind === "thread";
  if (filter === "Announcements") return item.kind === "announcement";
  if (filter === "Notifications") return item.kind === "system";
  return false;
}

export function MessagesHub() {
  const t = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const openInboxItem = (item: InboxItem) => {
    if (item.kind === "thread") router.push(ROUTES.thread);
    else if (item.kind === "announcement") router.push(ROUTES.composer);
    // System rows have no detail view — tapping is a no-op for now.
  };

  const inbox = comms.inbox as InboxItem[];
  const unreadCount = inbox.filter((i) => i.unread).length;
  const threadsCount = inbox.filter((i) => i.kind === "thread").length;
  const announcementsCount = inbox.filter((i) => i.kind === "announcement").length;
  const notificationsCount = inbox.filter((i) => i.kind === "system").length;

  const filteredInbox = inbox.filter((row) => {
    if (!matchesFilter(row, filter)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return row.title.toLowerCase().includes(q) || row.preview.toLowerCase().includes(q);
  });

  const showPinned = filter === "All" || filter === "Groups" || filter === "Chats";
  const showPresence = filter === "All" || filter === "Chats" || filter === "Groups";

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Messages"
        subtitle={unreadCount > 0 ? `${unreadCount} unread · all channels` : "All channels"}
        trailing={
          <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
            <HeaderIconButton onPress={() => router.push(ROUTES.events)}>
              <Calendar size={20} color={t.textSecondary} />
            </HeaderIconButton>
            <HeaderIconButton onPress={() => router.push(ROUTES.qr)}>
              <QrCode size={20} color={t.textSecondary} />
            </HeaderIconButton>
            <HeaderIconButton>
              <SettingsIcon size={20} color={t.textSecondary} />
            </HeaderIconButton>
          </View>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <View style={[styles.searchRow, { backgroundColor: t.bgMuted }]}>
            <Search size={16} color={t.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search chats, people, announcements"
              placeholderTextColor={t.textMuted}
              style={{ flex: 1, color: t.textPrimary, fontSize: 14, paddingVertical: 0 }}
            />
            <Pressable hitSlop={6}>
              <FilterIcon size={16} color={t.textMuted} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: space.lg,
            paddingVertical: space.md,
            gap: space.sm,
          }}
        >
          <StatTile
            label="Unread"
            value={String(unreadCount)}
            icon={<MessageSquare size={14} color={t.primary} />}
            tone="primary"
          />
          <StatTile
            label="Chats"
            value={String(threadsCount)}
            icon={<MessageSquare size={14} color={t.textSecondary} />}
          />
          <StatTile
            label="Announcements"
            value={String(announcementsCount)}
            icon={<Megaphone size={14} color={t.warning} />}
            tone="warning"
          />
          <StatTile
            label="Notifications"
            value={String(notificationsCount)}
            icon={<Bell size={14} color={t.info} />}
            tone="info"
          />
        </ScrollView>

        {showPresence ? (
          <View>
            <View style={styles.sectionHead}>
              <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6 }}>
                ACTIVE NOW · {PRESENCE.filter((p) => p.status === "online").length}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: space.lg,
                gap: space.md,
                paddingBottom: space.md,
              }}
            >
              <Pressable onPress={() => router.push(ROUTES.thread)} style={styles.presenceItem}>
                <View
                  style={[
                    styles.presenceAvatarWrap,
                    {
                      borderColor: t.border,
                      backgroundColor: t.bgMuted,
                      borderStyle: "dashed",
                    },
                  ]}
                >
                  <Pencil size={18} color={t.primary} />
                </View>
                <Text variant="micro" weight="semibold" style={{ color: t.textSecondary }} numberOfLines={1}>
                  New
                </Text>
              </Pressable>
              {PRESENCE.map((p) => (
                <Pressable
                  key={p.name}
                  onPress={() => router.push(ROUTES.thread)}
                  style={styles.presenceItem}
                >
                  <View style={styles.presenceAvatarWrap}>
                    <Avatar name={p.name} hue={p.hue} size="md" />
                    <View
                      style={[
                        styles.presenceDot,
                        {
                          backgroundColor:
                            p.status === "online"
                              ? palette.emerald[500]
                              : p.status === "away"
                                ? palette.amber[500]
                                : palette.slate[400],
                          borderColor: t.bg,
                        },
                      ]}
                    />
                    {p.unread > 0 ? (
                      <View
                        style={[
                          styles.presenceBadge,
                          { backgroundColor: t.primary, borderColor: t.bg },
                        ]}
                      >
                        <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                          {p.unread}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text
                    variant="micro"
                    weight="semibold"
                    style={{ color: t.textSecondary, maxWidth: 56 }}
                    numberOfLines={1}
                  >
                    {p.name.split(" ")[0]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: space.lg,
            gap: space.sm,
            paddingBottom: space.sm,
          }}
        >
          {FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? t.primary : t.surface,
                    borderColor: isActive ? t.primary : t.border,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  weight="semibold"
                  style={{ color: isActive ? "#fff" : t.textSecondary }}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {showPinned ? (
          <View>
            <View style={styles.sectionHead}>
              <Pin size={12} color={t.textMuted} />
              <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6 }}>
                PINNED
              </Text>
            </View>
            {PINNED.map((p) => (
              <Pressable key={p.id} onPress={() => router.push(ROUTES.thread)}>
                <View style={[styles.row, { borderBottomColor: t.border }]}>
                  <View
                    style={[
                      styles.groupIcon,
                      { backgroundColor: p.hue + "22", borderColor: p.hue + "55" },
                    ]}
                  >
                    <Users size={18} color={p.hue} />
                  </View>
                  <View style={{ flex: 1, marginLeft: space.md, gap: 2 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text
                        variant="body"
                        weight={p.unreadCount > 0 ? "bold" : "semibold"}
                        style={{ flex: 1 }}
                        numberOfLines={1}
                      >
                        {p.title}
                      </Text>
                      <Text variant="caption" tone="muted">
                        {p.at}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <CheckCheck size={12} color={t.success} />
                      <Text
                        variant="bodySmall"
                        tone={p.unreadCount > 0 ? "primary" : "secondary"}
                        numberOfLines={1}
                        style={{ flex: 1 }}
                      >
                        {p.preview}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 6, marginTop: 2 }}>
                      <StatChip label={`${p.memberCount} members`} tone="neutral" compact />
                      <StatChip label="Group" tone="primary" compact />
                    </View>
                  </View>
                  {p.unreadCount > 0 ? (
                    <View style={[styles.unreadBadge, { backgroundColor: t.primary }]}>
                      <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                        {p.unreadCount}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View>
          <View style={styles.sectionHead}>
            <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6 }}>
              {filter === "All" ? "RECENT" : filter.toUpperCase()} · {filteredInbox.length}
            </Text>
            <Pressable>
              <Text variant="caption" weight="semibold" style={{ color: t.primary }}>
                Mark all read
              </Text>
            </Pressable>
          </View>
          {filteredInbox.length === 0 ? (
            <View style={[styles.empty, { borderColor: t.border, backgroundColor: t.surface }]}>
              <Bell size={20} color={t.textMuted} />
              <Text variant="bodySmall" tone="muted" align="center">
                No {filter.toLowerCase()} match your search.
              </Text>
            </View>
          ) : (
            filteredInbox.map((row) => {
              const iconBg =
                row.kind === "announcement"
                  ? t.warningSoft
                  : row.kind === "system"
                    ? t.bgMuted
                    : t.primarySoft;
              const iconColor =
                row.kind === "announcement"
                  ? t.warning
                  : row.kind === "system"
                    ? t.textSecondary
                    : t.primary;
              const Icon =
                row.kind === "announcement"
                  ? Megaphone
                  : row.kind === "system"
                    ? Bell
                    : MessageSquare;
              return (
                <Pressable key={row.id} onPress={() => openInboxItem(row)}>
                  <View
                    style={[
                      styles.row,
                      {
                        borderBottomColor: t.border,
                        backgroundColor: row.unread ? t.surface : "transparent",
                      },
                    ]}
                  >
                    {row.kind === "thread" ? (
                      <View style={{ position: "relative" }}>
                        <Avatar name={row.title} size="md" />
                        <View
                          style={[
                            styles.presenceDot,
                            {
                              backgroundColor: palette.emerald[500],
                              borderColor: t.bg,
                              right: -2,
                              bottom: -2,
                            },
                          ]}
                        />
                      </View>
                    ) : (
                      <View style={[styles.iconBubble, { backgroundColor: iconBg }]}>
                        <Icon size={18} color={iconColor} />
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: space.md, gap: 2 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text
                          variant="body"
                          weight={row.unread ? "bold" : "semibold"}
                          style={{ flex: 1 }}
                          numberOfLines={1}
                        >
                          {row.title}
                        </Text>
                        <Text variant="caption" tone="muted">
                          {row.at}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        {row.kind === "thread" && !row.unread ? (
                          <CheckCheck size={12} color={t.textMuted} />
                        ) : null}
                        {row.kind === "thread" && row.preview.includes("@") ? (
                          <AtSign size={12} color={t.primary} />
                        ) : null}
                        <Text
                          variant="bodySmall"
                          tone={row.unread ? "primary" : "secondary"}
                          numberOfLines={1}
                          style={{ flex: 1 }}
                        >
                          {row.preview}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: 6, marginTop: 2 }}>
                        <StatChip label={row.channel} tone="neutral" compact />
                        {row.kind === "announcement" ? (
                          <StatChip label="Broadcast" tone="warning" compact />
                        ) : null}
                        {row.kind === "system" ? (
                          <StatChip label="System" tone="info" compact />
                        ) : null}
                      </View>
                    </View>
                    {row.unread ? (
                      <View style={[styles.unreadDot, { backgroundColor: t.primary }]} />
                    ) : (
                      <ChevronRight size={16} color={t.textMuted} style={{ marginLeft: space.xs }} />
                    )}
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        <View
          style={[
            styles.quickActions,
            { backgroundColor: t.surface, borderColor: t.border },
          ]}
        >
          <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6 }}>
            QUICK ACTIONS
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.sm }}>
            <QuickAction
              icon={<Pencil size={14} color={t.primary} />}
              label="New chat"
              onPress={() => router.push(ROUTES.thread)}
            />
            <QuickAction
              icon={<Users size={14} color={t.primary} />}
              label="New group"
              onPress={() => router.push(ROUTES.thread)}
            />
            <QuickAction
              icon={<Megaphone size={14} color={t.warning} />}
              label="Announcement"
              onPress={() => router.push(ROUTES.composer)}
            />
            <QuickAction
              icon={<Calendar size={14} color={t.success} />}
              label="Events"
              onPress={() => router.push(ROUTES.events)}
            />
            <QuickAction
              icon={<QrCode size={14} color={t.info} />}
              label="QR check-in"
              onPress={() => router.push(ROUTES.qr)}
            />
            <QuickAction
              icon={<Paperclip size={14} color={t.textSecondary} />}
              label="Share file"
            />
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push(ROUTES.composer)}
        style={[styles.fab, { backgroundColor: t.primary, shadowColor: t.shadow }]}
      >
        <Pencil size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

function StatTile({
  label,
  value,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "neutral" | "primary" | "warning" | "info";
}) {
  const t = useTheme();
  const accent =
    tone === "primary"
      ? t.primary
      : tone === "warning"
        ? t.warning
        : tone === "info"
          ? t.info
          : t.textSecondary;
  return (
    <View style={[styles.statTile, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon}
        <Text variant="caption" weight="semibold" tone="muted">
          {label}
        </Text>
      </View>
      <Text variant="h3" weight="bold" style={{ color: accent, marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.quickAction,
        { backgroundColor: t.bgMuted, borderColor: t.border },
      ]}
    >
      {icon}
      <Text variant="caption" weight="semibold" style={{ color: t.textPrimary }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xs,
    gap: 6,
  },
  statTile: {
    minWidth: 120,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  presenceItem: {
    alignItems: "center",
    gap: 6,
    width: 64,
  },
  presenceAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    position: "relative",
  },
  presenceDot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  presenceBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  empty: {
    margin: space.lg,
    padding: space.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    gap: space.sm,
  },
  quickActions: {
    marginHorizontal: space.lg,
    marginTop: space.lg,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  fab: {
    position: "absolute",
    right: space.lg,
    bottom: 88,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
