import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  Download,
  Pin,
  Plus,
  Receipt,
  Scroll,
  FileCheck2,
  Calendar,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type FolderKind = "charter" | "receipts" | "statements" | "agreements" | "minutes";
type DocKind = "pdf" | "image" | "spreadsheet" | "document";

type FolderItem = {
  id: string;
  label: string;
  kind: FolderKind;
  itemCount: number;
  lastUpdated: string;
};

type DocItem = {
  id: string;
  folderId: string;
  label: string;
  kind: DocKind;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  pinned: boolean;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function folderMeta(kind: FolderKind, t: AppTheme) {
  if (kind === "charter")    return { color: t.primary, bg: t.primarySoft, Icon: Scroll };
  if (kind === "receipts")   return { color: t.success, bg: t.successSoft, Icon: Receipt };
  if (kind === "statements") return { color: t.warning, bg: t.warningSoft, Icon: FileText };
  if (kind === "agreements") return { color: t.info,    bg: t.infoSoft,    Icon: FileCheck2 };
  return { color: t.textSecondary, bg: t.bgMuted, Icon: Calendar };
}

function docMeta(kind: DocKind, t: AppTheme) {
  if (kind === "pdf")         return { color: t.danger,  Icon: FileText };
  if (kind === "image")       return { color: t.primary, Icon: ImageIcon };
  if (kind === "spreadsheet") return { color: t.success, Icon: FileSpreadsheet };
  return { color: t.textSecondary, Icon: File };
}

export function RoscaDocuments() {
  const t = useTheme();
  const panel = rosca.documentsPanel as {
    folders: FolderItem[];
    recent: DocItem[];
    storageUsed: number;
    storageLimit: number;
  };

  const pinned = panel.recent.filter((d) => d.pinned);
  const others = panel.recent.filter((d) => !d.pinned);
  const storagePct = panel.storageUsed / panel.storageLimit;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Documents"
        subtitle="Main CHF Circle"
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Plus size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Storage bar */}
        <View style={[styles.storage, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
              STORAGE
            </Text>
            <Text variant="caption" weight="bold">
              {panel.storageUsed} / {panel.storageLimit} MB
            </Text>
          </View>
          <View style={[styles.storageBar, { backgroundColor: t.bgMuted }]}>
            <View style={[styles.storageFill, { width: `${storagePct * 100}%`, backgroundColor: t.primary }]} />
          </View>
        </View>

        {/* Folders grid */}
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: space.sm }}>Folders</Text>
          <View style={styles.foldersGrid}>
            {panel.folders.map((f) => (
              <FolderTile key={f.id} f={f} t={t} />
            ))}
          </View>
        </View>

        {/* Pinned */}
        {pinned.length > 0 ? (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
              <Pin size={14} color={t.warning} />
              <Text variant="h3" weight="bold">Pinned</Text>
            </View>
            <Card padded={false}>
              {pinned.map((d, i) => (
                <DocRow key={d.id} d={d} folderLabel={panel.folders.find((f) => f.id === d.folderId)?.label ?? ""} t={t} last={i === pinned.length - 1} />
              ))}
            </Card>
          </View>
        ) : null}

        {/* Recent activity */}
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: space.sm }}>Recent activity</Text>
          <Card padded={false}>
            {others.map((d, i) => (
              <DocRow key={d.id} d={d} folderLabel={panel.folders.find((f) => f.id === d.folderId)?.label ?? ""} t={t} last={i === others.length - 1} />
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function FolderTile({ f, t }: { f: FolderItem; t: AppTheme }) {
  const meta = folderMeta(f.kind, t);
  const Icon = meta.Icon;
  return (
    <Pressable style={[styles.folder, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.folderIcon, { backgroundColor: meta.bg }]}>
        <Icon size={20} color={meta.color} />
      </View>
      <Text variant="bodySmall" weight="bold" numberOfLines={2} style={{ marginTop: space.sm, lineHeight: 17 }}>
        {f.label}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <Text variant="micro" tone="secondary" weight="semibold">
          {f.itemCount} file{f.itemCount === 1 ? "" : "s"}
        </Text>
        <Text variant="micro" tone="muted">
          {timeSince(f.lastUpdated)}
        </Text>
      </View>
    </Pressable>
  );
}

function DocRow({ d, folderLabel, t, last }: { d: DocItem; folderLabel: string; t: AppTheme; last: boolean }) {
  const meta = docMeta(d.kind, t);
  const Icon = meta.Icon;
  return (
    <Pressable
      style={[styles.docRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
    >
      <View style={[styles.docIcon, { backgroundColor: `${meta.color}22` }]}>
        <Icon size={16} color={meta.color} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="caption" weight="bold" numberOfLines={1} style={{ flex: 1 }}>
            {d.label}
          </Text>
          {d.pinned ? <Pin size={10} color={t.warning} /> : null}
        </View>
        <Text variant="micro" tone="secondary">
          {folderLabel} · {d.size} · {d.uploadedBy} · {timeSince(d.uploadedAt)}
        </Text>
      </View>
      <Pressable style={[styles.dlBtn, { backgroundColor: t.bgMuted }]}>
        <Download size={12} color={t.textPrimary} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  storage: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  storageBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  storageFill: {
    height: "100%",
    borderRadius: 3,
  },
  foldersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  folder: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 110,
  },
  folderIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  docIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  dlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
