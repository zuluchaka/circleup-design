import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { FileText, Plus, Lock, ChevronRight, FolderOpen, Upload } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { StatChip } from "@/components/shared/StatChip";
import { Button } from "@/components/shared/Button";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius } from "@/theme";
import docs from "@/product/sections/07-documents/data.json";

const visTone = (v: string) =>
  v === "Public link" ? "info" : v === "Committee" ? "warning" : v === "Organisers" ? "danger" : "neutral";

type DocsData = typeof docs;

export function DocumentsLibraryEmpty() {
  return <DocumentsLibrary data={{ ...docs, documents: [] }} />;
}

export function DocumentsLibrary({
  data = docs,
}: { data?: DocsData } = {}) {
  const t = useTheme();
  const isEmpty = data.documents.length === 0;

  if (isEmpty) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <AppHeader
          title="Documents"
          subtitle="No files yet"
          trailing={<HeaderIconButton><Plus size={20} color={t.primary} /></HeaderIconButton>}
        />
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
          <Card padded bordered>
            <View style={{ alignItems: "center", paddingVertical: space.xl }}>
              <View style={[styles.emptyIcon, { backgroundColor: t.primarySoft }]}>
                <FolderOpen size={28} color={t.primary} />
              </View>
              <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md }}>
                No documents yet
              </Text>
              <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm, lineHeight: 18, paddingHorizontal: space.md }}>
                Upload your association charter, AGM minutes, fee schedules, and member rosters here. Set visibility per file: All members, committee, organisers, or a public link.
              </Text>
              <View style={{ marginTop: space.lg, width: "100%" }}>
                <Button label="Upload first document" leadingIcon={<Upload size={16} color="#fff" />} fullWidth />
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Documents"
        subtitle={`${data.documents.length} files`}
        trailing={<HeaderIconButton><Plus size={20} color={t.primary} /></HeaderIconButton>}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm, paddingVertical: space.sm }}>
        {data.categories.map((c, i) => (
          <View
            key={c}
            style={[
              styles.chip,
              { backgroundColor: i === 0 ? t.primary : t.surface, borderColor: i === 0 ? t.primary : t.border },
            ]}
          >
            <Text variant="caption" weight="semibold" style={{ color: i === 0 ? "#fff" : t.textSecondary }}>{c}</Text>
          </View>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.sm }}>
        {data.documents.map((d) => (
          <Pressable key={d.id}>
            <Card padded>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                <View style={[styles.iconBubble, { backgroundColor: t.primarySoft }]}>
                  <FileText size={18} color={t.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="body" weight="semibold">{d.title}</Text>
                  <View style={{ flexDirection: "row", gap: space.sm, flexWrap: "wrap" }}>
                    <Text variant="caption" tone="muted">{d.category} · v{d.version}</Text>
                    <Text variant="caption" tone="muted">· {d.size}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                    <StatChip
                      label={d.visibility}
                      tone={visTone(d.visibility) as "info" | "warning" | "danger" | "neutral"}
                      compact
                    />
                    {d.visibility !== "All members" && d.visibility !== "Public link" ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                        <Lock size={10} color={t.textMuted} />
                        <Text variant="micro" tone="muted">restricted</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <ChevronRight size={16} color={t.textMuted} />
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
