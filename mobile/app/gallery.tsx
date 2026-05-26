import { ScrollView, View, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { sectionsCatalog } from "@/data/sectionsCatalog";
import { useTheme, space, radius } from "@/theme";
import { Text } from "@/components/shared/Text";

export default function GalleryIndex() {
  const t = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg }}
      contentContainerStyle={{ paddingTop: 48, paddingBottom: 64, gap: space.lg }}
    >
      <View style={{ paddingHorizontal: space.xl, gap: 4 }}>
        <Text variant="caption" tone="accent" weight="bold">CIRCLEUP MOBILE</Text>
        <Text variant="display" weight="bold">Section Gallery</Text>
        <Text variant="bodySmall" tone="secondary">
          {sectionsCatalog.length} sections · Android-first · used for design review and screenshot capture.
        </Text>
      </View>

      <View style={{ paddingHorizontal: space.xl, gap: space.sm }}>
        {sectionsCatalog.map((section) => (
          <View key={section.slug} style={[styles.section, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginBottom: space.sm }}>
              <View style={[styles.idx, { backgroundColor: t.primarySoft }]}>
                <Text variant="caption" weight="bold" tone="accent">
                  {String(section.index).padStart(2, "0")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="h3" weight="bold">{section.title}</Text>
                <Text variant="caption" tone="secondary">{section.blurb}</Text>
              </View>
            </View>
            <View style={{ gap: 2 }}>
              {section.screens.map((screen) => (
                <Link
                  key={screen.slug}
                  href={(section.routes?.[screen.slug] ?? `/sections/${section.slug}/${screen.slug}`) as never}
                  asChild
                >
                  <Pressable style={[styles.row, { borderTopColor: t.border }]}>
                    <Text variant="bodySmall">{screen.label}</Text>
                    <ChevronRight size={16} color={t.textMuted} />
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.lg,
  },
  idx: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
