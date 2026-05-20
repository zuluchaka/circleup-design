import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { Search, UserPlus } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import members from "@/product/sections/02-members-and-trust/data.json";

export function MembersDirectory() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Members"
        subtitle={`${members.members.length} of 184`}
        trailing={<HeaderIconButton><UserPlus size={20} color={t.primary} /></HeaderIconButton>}
      />
      <View style={{ paddingHorizontal: space.lg, paddingBottom: space.sm }}>
        <View style={[styles.searchRow, { backgroundColor: t.bgMuted }]}>
          <Search size={16} color={t.textMuted} />
          <TextInput
            placeholder="Search members by name or role"
            placeholderTextColor={t.textMuted}
            style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
          />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm, paddingBottom: space.sm }}>
        {members.filters.map((f, idx) => (
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
        {members.members.map((m) => (
          <Pressable key={m.id}>
            <View style={[styles.row, { borderBottomColor: t.border }]}>
              <Avatar name={m.name} size="md" />
              <View style={{ flex: 1, marginLeft: space.md, gap: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, flexWrap: "wrap" }}>
                  <Text variant="body" weight="semibold">{m.name}</Text>
                  <RoleBadge role={m.role} />
                </View>
                <Text variant="caption" tone="muted">
                  {m.city} · {m.contributions} contributions · {m.missed} missed
                </Text>
              </View>
              <TrustScoreBadge score={m.trust} compact />
            </View>
          </Pressable>
        ))}
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
    gap: space.sm,
  },
});
