// Document viewer for /sections/documents/viewer.
// Renders a Bylaws v3.2 preview with version timeline + visibility + actions.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  FileText, Download, Share2, ChevronRight, Eye, Lock, History, MoreHorizontal,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const DOC = {
  title: "Bylaws · Diaspora Circle Geneva",
  category: "Governance",
  version: "3.2",
  updatedAt: "2026-02-14",
  size: "412 KB",
  pages: 14,
  visibility: "All members",
  owner: "Kofi Mensah · President",
  preview: [
    "Article 1 — Name & Purpose",
    "The association is named Diaspora Circle Geneva (\"the Association\") and operates as a rotating savings and credit association under Swiss federation law.",
    "",
    "Article 2 — Membership",
    "Membership is open to adults aged 18+ resident in Geneva or surrounding cantons, subject to approval by the Membership Committee.",
    "",
    "Article 3 — Quorum & Voting",
    "Quorum for general resolutions is two-thirds of active members. Special resolutions (bylaws amendments, dissolution) require three-quarters.",
  ],
  versionTimeline: [
    { version: "3.2", at: "2026-02-14", by: "Kofi Mensah",  change: "Clarified quorum rules for special elections." },
    { version: "3.1", at: "2025-09-05", by: "Kofi Mensah",  change: "Added Welfare Fund eligibility section." },
    { version: "3.0", at: "2025-01-10", by: "Kofi Mensah",  change: "Major rewrite for Swiss federation compliance." },
    { version: "2.4", at: "2023-06-22", by: "Ngozi Okafor", change: "Updated registered address." },
  ],
};

export function DocumentsViewer() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Document" subtitle={DOC.category} />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        {/* Doc thumbnail */}
        <View style={[styles.thumbWrap, { backgroundColor: t.bgMuted }]}>
          <View style={[styles.thumb, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={[styles.thumbHead, { backgroundColor: palette.indigo[600] }]}>
              <FileText size={14} color="#fff" />
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.8 }}>
                BYLAWS · v{DOC.version}
              </Text>
            </View>
            <View style={{ padding: space.md, gap: 6 }}>
              {DOC.preview.map((line, i) => (
                <Text
                  key={i}
                  variant="micro"
                  weight={line.startsWith("Article") ? "bold" : "regular"}
                  numberOfLines={1}
                  style={{ color: line.startsWith("Article") ? t.textPrimary : t.textSecondary, fontFamily: line.startsWith("Article") ? undefined : "monospace", fontSize: 8 }}
                >
                  {line || " "}
                </Text>
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <View key={i} style={[styles.fakeLine, { backgroundColor: t.bgMuted, width: `${60 + ((i * 7) % 40)}%` }]} />
              ))}
            </View>
          </View>
          <Text variant="micro" tone="muted" align="center" style={{ marginTop: space.sm }}>
            Page 1 of {DOC.pages} · Tap to open full viewer
          </Text>
        </View>

        <View style={{ padding: space.lg, gap: space.lg }}>
          <View>
            <Text variant="h1" weight="bold">{DOC.title}</Text>
            <Text variant="caption" tone="secondary" style={{ marginTop: 4 }}>
              Updated {new Date(DOC.updatedAt).toLocaleDateString("en-CH", { day: "numeric", month: "long", year: "numeric" })} by {DOC.owner}
            </Text>
          </View>

          {/* Actions */}
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Pressable style={[styles.actionBtn, { backgroundColor: t.primary }]}>
              <Eye size={16} color="#fff" />
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>Open</Text>
            </Pressable>
            <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Download size={16} color={t.textPrimary} />
            </Pressable>
            <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Share2 size={16} color={t.textPrimary} />
            </Pressable>
            <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
              <MoreHorizontal size={16} color={t.textPrimary} />
            </Pressable>
          </View>

          {/* Metadata */}
          <Card padded={false}>
            <Meta label="Category"   value={DOC.category} t={t} />
            <Meta label="Version"    value={`v${DOC.version}`} t={t} />
            <Meta label="Size"       value={DOC.size} t={t} />
            <Meta label="Pages"      value={`${DOC.pages}`} t={t} />
            <Meta label="Visibility" value={DOC.visibility} t={t} icon={Lock} last />
          </Card>

          {/* Version timeline */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
              <History size={14} color={t.textMuted} />
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>VERSION TIMELINE</Text>
            </View>
            <View style={{ gap: space.sm }}>
              {DOC.versionTimeline.map((v, i) => (
                <View key={v.version} style={{ flexDirection: "row", gap: space.md }}>
                  <View style={{ alignItems: "center" }}>
                    <View
                      style={[
                        styles.versionDot,
                        {
                          backgroundColor: i === 0 ? t.primary : t.bgMuted,
                          borderColor: i === 0 ? t.primary : t.border,
                        },
                      ]}
                    >
                      <Text variant="micro" weight="bold" style={{ color: i === 0 ? "#fff" : t.textSecondary }}>
                        v{v.version}
                      </Text>
                    </View>
                    {i < DOC.versionTimeline.length - 1 ? (
                      <View style={[styles.timelineLine, { backgroundColor: t.border }]} />
                    ) : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: i < DOC.versionTimeline.length - 1 ? space.md : 0 }}>
                    <Text variant="bodySmall" weight="semibold">{v.change}</Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                      {new Date(v.at).toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" })} · {v.by}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Meta({ label, value, t, icon: Icon, last }: { label: string; value: string; t: any; icon?: React.ComponentType<{ size?: number; color?: string }>; last?: boolean }) {
  return (
    <View
      style={[
        styles.metaRow,
        !last && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <Text variant="bodySmall" tone="secondary">{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        {Icon ? <Icon size={12} color={t.textMuted} /> : null}
        <Text variant="bodySmall" weight="semibold">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thumbWrap: {
    paddingTop: space.xl,
    paddingBottom: space.lg,
    paddingHorizontal: space.xxxl,
    alignItems: "center",
  },
  thumb: {
    width: "100%",
    minHeight: 240,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  thumbHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
  },
  fakeLine: {
    height: 4,
    borderRadius: 2,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.lg,
    paddingVertical: 12,
    borderRadius: radius.md,
    flex: 1,
    justifyContent: "center",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  versionDot: {
    minWidth: 40,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
});
