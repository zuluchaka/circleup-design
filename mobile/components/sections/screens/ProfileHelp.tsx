import { View, ScrollView, Pressable, StyleSheet, TextInput } from "react-native";
import {
  Search,
  Rocket,
  Coins,
  Banknote,
  Shield,
  Scale,
  User,
  MessageCircle,
  Bug,
  ExternalLink,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import { AppHeader } from "@/components/shared/AppHeader";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { useTheme, space, radius } from "@/theme";
import profile from "@/product/sections/20-profile/data.json";
import type { FaqCategory, UserProfile } from "@/product/sections/20-profile/types";

const CATEGORY_ICONS: Record<FaqCategory["iconKey"], React.ComponentType<{ size?: number; color?: string }>> = {
  rocket: Rocket,
  coins: Coins,
  banknote: Banknote,
  shield: Shield,
  scale: Scale,
  user: User,
};

export function ProfileHelp() {
  const t = useTheme();
  const data = profile as unknown as UserProfile;
  const { help } = data;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Help & support" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 64, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchBar, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Search size={18} color={t.textMuted} />
          <TextInput
            placeholder={help.searchPlaceholder}
            placeholderTextColor={t.textMuted}
            style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
            editable={false}
          />
        </View>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            BROWSE BY TOPIC
          </Text>
          <View style={styles.grid}>
            {help.categories.map((cat) => (
              <CategoryTile key={cat.key} cat={cat} />
            ))}
          </View>
        </View>

        <View>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginLeft: space.xs, marginBottom: space.sm }}>
            STILL STUCK?
          </Text>
          <Card padded={false}>
            <ActionRow
              Icon={MessageCircle}
              tone="primary"
              title="Contact support"
              sub={`Average reply ≈ 4 hours · ${help.supportMailbox}`}
            />
            <ActionRow
              Icon={Bug}
              tone="warning"
              title="Report a bug"
              sub="Attach a screenshot · ships with device info"
            />
            <ActionRow
              Icon={ExternalLink}
              tone="info"
              title="System status"
              sub={help.statusPageUrl}
              external
              last
            />
          </Card>
        </View>

        <Text variant="micro" tone="muted" align="center" style={{ paddingHorizontal: space.lg, lineHeight: 14 }}>
          Help articles are reviewed by the Mafao team weekly. If you spot something wrong,
          tap "Report a bug" or write to {help.supportMailbox}.
        </Text>
      </ScrollView>
    </View>
  );
}

function CategoryTile({ cat }: { cat: FaqCategory }) {
  const t = useTheme();
  const Icon = CATEGORY_ICONS[cat.iconKey];
  return (
    <Pressable style={[styles.tile, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.tileIcon, { backgroundColor: t.primarySoft }]}>
        <Icon size={18} color={t.primary} />
      </View>
      <Text variant="bodySmall" weight="semibold" style={{ marginTop: space.sm }}>
        {cat.label}
      </Text>
      <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
        {cat.count} articles
      </Text>
    </Pressable>
  );
}

function ActionRow({
  Icon,
  tone,
  title,
  sub,
  external,
  last,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  tone: "primary" | "warning" | "info";
  title: string;
  sub: string;
  external?: boolean;
  last?: boolean;
}) {
  const t = useTheme();
  const tones = {
    primary: { bg: t.primarySoft, fg: t.primary },
    warning: { bg: t.warningSoft, fg: t.warning },
    info: { bg: t.infoSoft, fg: t.info },
  } as const;
  const v = tones[tone];
  return (
    <Pressable
      style={[
        styles.actionRow,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: v.bg }]}>
        <Icon size={18} color={v.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="semibold">
          {title}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
          {sub}
        </Text>
      </View>
      {external ? <ExternalLink size={16} color={t.textMuted} /> : <ChevronRight size={18} color={t.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  tile: {
    width: "48%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
