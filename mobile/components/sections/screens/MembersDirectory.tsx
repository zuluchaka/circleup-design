import { View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { Search, UserPlus, Users, Upload } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius } from "@/theme";
import members from "@/product/sections/02-members-and-trust/data.json";

type MembersData = typeof members;

export function MembersDirectoryEmpty() {
  return (
    <MembersDirectory data={{ ...members, members: [] }} totalMembers={0} />
  );
}

export function MembersDirectory({
  data = members,
  totalMembers = 184,
}: { data?: MembersData; totalMembers?: number } = {}) {
  const t = useTheme();
  const isEmpty = data.members.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Members"
        subtitle={isEmpty ? "No members yet" : `${data.members.length} of ${totalMembers}`}
        trailing={<HeaderIconButton><UserPlus size={20} color={t.primary} /></HeaderIconButton>}
      />
      {isEmpty ? (
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
          <Card padded bordered>
            <View style={{ alignItems: "center", paddingVertical: space.xl }}>
              <View style={[styles.emptyIcon, { backgroundColor: t.primarySoft }]}>
                <Users size={28} color={t.primary} />
              </View>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                No members yet
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm, lineHeight: 18, paddingHorizontal: space.md }}>
                Invite founding members by phone number, or upload a CSV of your existing roster. Trust scores and contribution history will start building from their first cycle.
              </Text>
              <View style={{ marginTop: space.lg, width: "100%", gap: space.sm }}>
                <Button label="Invite by phone number" leadingIcon={<UserPlus size={16} color="#fff" />} fullWidth />
                <Button label="Bulk import (CSV)" variant="secondary" leadingIcon={<Upload size={16} color={t.primary} />} fullWidth />
              </View>
            </View>
          </Card>
        </ScrollView>
      ) : (
        <>
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
        {data.filters.map((f, idx) => (
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
        {data.members.map((m) => (
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
        </>
      )}
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
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
