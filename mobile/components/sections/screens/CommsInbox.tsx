import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { Search, Megaphone, MessageSquare, Bell, ChevronRight } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

const filters = ["All", "Unread", "Threads", "Announcements", "System"];

export function CommsInbox() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Inbox" subtitle="3 unread" />
      <View style={{ paddingHorizontal: space.lg, paddingBottom: space.sm }}>
        <View style={[styles.searchRow, { backgroundColor: t.bgMuted }]}>
          <Search size={16} color={t.textMuted} />
          <TextInput
            placeholder="Search threads and announcements"
            placeholderTextColor={t.textMuted}
            style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
          />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm, paddingBottom: space.sm }}>
        {filters.map((f, idx) => (
          <View
            key={f}
            style={[
              styles.filterChip,
              { backgroundColor: idx === 0 ? t.primary : t.surface, borderColor: idx === 0 ? t.primary : t.border },
            ]}
          >
            <Text variant="caption" weight="semibold" style={{ color: idx === 0 ? "#fff" : t.textSecondary }}>{f}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        {comms.inbox.map((row) => {
          const iconBg =
            row.kind === "announcement" ? t.warningSoft : row.kind === "system" ? t.bgMuted : t.primarySoft;
          const iconColor =
            row.kind === "announcement" ? t.warning : row.kind === "system" ? t.textSecondary : t.primary;
          const Icon =
            row.kind === "announcement" ? Megaphone : row.kind === "system" ? Bell : MessageSquare;
          return (
            <Pressable key={row.id}>
              <View style={[styles.row, { borderBottomColor: t.border, backgroundColor: row.unread ? t.surface : "transparent" }]}>
                {row.kind === "thread" ? (
                  <Avatar name={row.title} size="md" />
                ) : (
                  <View style={[styles.iconBubble, { backgroundColor: iconBg }]}>
                    <Icon size={18} color={iconColor} />
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: space.md, gap: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text variant="body" weight={row.unread ? "bold" : "semibold"} style={{ flex: 1 }} numberOfLines={1}>
                      {row.title}
                    </Text>
                    <Text variant="caption" tone="muted">{row.at}</Text>
                  </View>
                  <Text variant="bodySmall" tone={row.unread ? "primary" : "secondary"} numberOfLines={1}>
                    {row.preview}
                  </Text>
                  <View style={{ marginTop: 2 }}>
                    <StatChip label={row.channel} tone="neutral" compact />
                  </View>
                </View>
                {row.unread ? <View style={[styles.unreadDot, { backgroundColor: t.primary }]} /> : null}
                <ChevronRight size={16} color={t.textMuted} style={{ marginLeft: space.xs }} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
