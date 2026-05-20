import { View, ScrollView, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Star, Settings, LogOut } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme, space, radius, palette } from "@/theme";

export default function ProfileRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop" }}
            style={styles.avatar}
          />
          <Text variant="h1" weight="bold" style={{ color: "#fff", marginTop: space.md }}>
            Aminata Diallo
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)" }}>
            Senegalese Diaspora · Geneva
          </Text>
          <View style={styles.trustWrap}>
            <Star size={14} color={palette.amber[300]} fill={palette.amber[300]} />
            <Text variant="body" weight="bold" style={{ color: "#fff" }}>
              945
            </Text>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.75)" }}>
              Trust Score
            </Text>
          </View>
        </LinearGradient>

        <View style={{ padding: space.lg, gap: space.md }}>
          <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Settings size={18} color={t.primary} />
            <Text variant="body" weight="semibold" style={{ flex: 1 }}>
              Account settings
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
            <LogOut size={18} color={t.danger} />
            <Text variant="body" weight="semibold" style={{ flex: 1, color: t.danger }}>
              Sign out
            </Text>
          </View>
          <Text variant="caption" tone="muted" align="center" style={{ marginTop: space.lg }}>
            More profile screens coming soon.
          </Text>
        </View>
      </ScrollView>
      <AppTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 72,
    paddingBottom: space.xxl,
    paddingHorizontal: space.lg,
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: palette.slate[300],
  },
  trustWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: space.md,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
