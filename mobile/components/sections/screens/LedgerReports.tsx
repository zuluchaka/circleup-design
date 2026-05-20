import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  FileText,
  Download,
  Share2,
  Check,
  Clock,
  Calendar,
  Sparkles,
  ChevronDown,
  AlertTriangle,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";

type Format = "pdf" | "csv";
type Category = "all" | "dues" | "contributions" | "payouts" | "ef" | "subscription";

type Report = {
  id: string;
  name: string;
  range: string;
  format: Format;
  generatedAt: string;
  status: "ready" | "generating" | "failed";
  sizeKb: number;
  categories: Category[];
};

const SAVED_REPORTS: Report[] = [
  {
    id: "r1",
    name: "Q1 2026 · Full ledger",
    range: "Jan 1 – Mar 31, 2026",
    format: "pdf",
    generatedAt: "2026-04-02T14:00:00Z",
    status: "ready",
    sizeKb: 386,
    categories: ["all"],
  },
  {
    id: "r2",
    name: "April dues collection",
    range: "Apr 1 – Apr 30, 2026",
    format: "csv",
    generatedAt: "2026-05-02T09:14:00Z",
    status: "ready",
    sizeKb: 12,
    categories: ["dues"],
  },
  {
    id: "r3",
    name: "Emergency fund activity",
    range: "Jan 1 – May 18, 2026",
    format: "pdf",
    generatedAt: "2026-05-19T11:20:00Z",
    status: "generating",
    sizeKb: 0,
    categories: ["ef"],
  },
  {
    id: "r4",
    name: "Annual statement 2025",
    range: "Jan 1 – Dec 31, 2025",
    format: "pdf",
    generatedAt: "2026-01-15T08:00:00Z",
    status: "ready",
    sizeKb: 1240,
    categories: ["all"],
  },
];

const PRESETS = [
  { id: "month", label: "This month" },
  { id: "quarter", label: "This quarter" },
  { id: "ytd", label: "Year to date" },
  { id: "year", label: "Last year" },
  { id: "custom", label: "Custom range" },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All categories" },
  { id: "dues", label: "Dues" },
  { id: "contributions", label: "Contributions" },
  { id: "payouts", label: "Payouts" },
  { id: "ef", label: "Emergency Fund" },
  { id: "subscription", label: "Subscription" },
];

function relativeTime(iso: string, now = new Date()) {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString("en-CH", { day: "2-digit", month: "short", year: "numeric" });
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function statusTone(s: Report["status"], t: AppTheme) {
  switch (s) {
    case "ready":
      return { fg: t.success, bg: t.successSoft, label: "Ready" };
    case "generating":
      return { fg: t.warning, bg: t.warningSoft, label: "Generating" };
    case "failed":
      return { fg: t.danger, bg: t.dangerSoft, label: "Failed" };
  }
}

export function LedgerReports({ associationId }: { associationId: string }) {
  const t = useTheme();
  const [preset, setPreset] = useState("quarter");
  const [format, setFormat] = useState<Format>("pdf");
  const [category, setCategory] = useState<Category>("all");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
              <ChevronLeft size={22} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable hitSlop={12} style={styles.iconBtn}>
              <Calendar size={16} color="#fff" />
            </Pressable>
          </View>
          <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2, marginTop: space.md }}>
            LEDGER REPORTS · {associationId.toUpperCase()}
          </Text>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: 4 }}>
            Reports
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            Generate, download, and share financial reports for audit, tax, or board review.
          </Text>
        </LinearGradient>

        {/* Generate new */}
        <View style={{ paddingHorizontal: space.lg, marginTop: -space.lg }}>
          <View style={[styles.genCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} color={t.primary} />
              <Text variant="caption" weight="bold" style={{ color: t.primary, letterSpacing: 0.8 }}>
                GENERATE NEW REPORT
              </Text>
            </View>

            {/* Date range presets */}
            <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6, marginTop: space.lg, marginBottom: space.sm }}>
              DATE RANGE
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
              {PRESETS.map((p) => {
                const selected = preset === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setPreset(p.id)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? t.primary : t.bgMuted,
                        borderColor: selected ? t.primary : t.border,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      weight="semibold"
                      style={{ color: selected ? "#fff" : t.textSecondary }}
                    >
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Category */}
            <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6, marginTop: space.lg, marginBottom: space.sm }}>
              CATEGORIES
            </Text>
            <Pressable style={[styles.selectRow, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
              <Text variant="bodySmall" weight="semibold" style={{ flex: 1 }}>
                {CATEGORIES.find((c) => c.id === category)?.label}
              </Text>
              <ChevronDown size={16} color={t.textMuted} />
            </Pressable>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: space.sm }}>
              {CATEGORIES.map((c) => {
                const selected = category === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCategory(c.id)}
                    style={[
                      styles.smallChip,
                      {
                        backgroundColor: selected ? t.primarySoft : "transparent",
                        borderColor: selected ? t.primary : t.border,
                      },
                    ]}
                  >
                    <Text
                      variant="micro"
                      weight="semibold"
                      style={{ color: selected ? t.primary : t.textSecondary }}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Format */}
            <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6, marginTop: space.lg, marginBottom: space.sm }}>
              FORMAT
            </Text>
            <View style={{ flexDirection: "row", gap: space.sm }}>
              <FormatBtn label="PDF" hint="Print-ready, signed" selected={format === "pdf"} onPress={() => setFormat("pdf")} t={t} />
              <FormatBtn label="CSV" hint="For accounting tools" selected={format === "csv"} onPress={() => setFormat("csv")} t={t} />
            </View>

            {/* Disclaimer */}
            <View style={[styles.disclaimer, { backgroundColor: t.bgMuted, borderColor: t.border, marginTop: space.md }]}>
              <AlertTriangle size={13} color={t.warning} />
              <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
                Reports are immutable once generated and stamped with your signature.
              </Text>
            </View>

            <Pressable
              onPress={handleGenerate}
              disabled={generating}
              style={[
                styles.generateBtn,
                { backgroundColor: generating ? t.bgMuted : t.primary, marginTop: space.lg },
              ]}
            >
              {generating ? (
                <>
                  <Clock size={16} color={t.textMuted} />
                  <Text variant="bodySmall" weight="bold" style={{ color: t.textMuted }}>
                    Generating...
                  </Text>
                </>
              ) : (
                <>
                  <Sparkles size={16} color="#fff" />
                  <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>
                    Generate report
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* Saved reports */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">
              Saved reports
            </Text>
            <Text variant="caption" tone="muted" weight="semibold">
              {SAVED_REPORTS.length} reports
            </Text>
          </View>
          <View style={{ gap: space.sm }}>
            {SAVED_REPORTS.map((r) => {
              const status = statusTone(r.status, t);
              return (
                <View
                  key={r.id}
                  style={[styles.reportCard, { backgroundColor: t.surface, borderColor: t.border }]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                    <View
                      style={[
                        styles.fileIcon,
                        { backgroundColor: r.format === "pdf" ? t.dangerSoft : t.successSoft },
                      ]}
                    >
                      <FileText size={18} color={r.format === "pdf" ? t.danger : t.success} />
                      <Text variant="micro" weight="bold" style={{ color: r.format === "pdf" ? t.danger : t.success, marginTop: 2 }}>
                        {r.format.toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
                        {r.name}
                      </Text>
                      <Text variant="caption" tone="secondary" numberOfLines={1}>
                        {r.range}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                          {r.status === "ready" ? (
                            <Check size={9} color={status.fg} />
                          ) : r.status === "generating" ? (
                            <Clock size={9} color={status.fg} />
                          ) : (
                            <AlertTriangle size={9} color={status.fg} />
                          )}
                          <Text variant="micro" weight="bold" style={{ color: status.fg }}>
                            {status.label}
                          </Text>
                        </View>
                        <Text variant="micro" tone="muted">
                          {r.status === "ready" ? `${formatSize(r.sizeKb)} · ` : ""}
                          {relativeTime(r.generatedAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {r.status === "ready" ? (
                    <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
                      <Pressable style={[styles.actionBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
                        <Share2 size={13} color={t.textSecondary} />
                        <Text variant="caption" weight="semibold" tone="secondary">
                          Share
                        </Text>
                      </Pressable>
                      <Pressable style={[styles.actionBtnPrimary, { backgroundColor: t.primary }]}>
                        <Download size={13} color="#fff" />
                        <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                          Download
                        </Text>
                      </Pressable>
                    </View>
                  ) : r.status === "generating" ? (
                    <View style={{ marginTop: space.md }}>
                      <View style={[styles.progressBar, { backgroundColor: t.bgMuted }]}>
                        <View style={[styles.progressFill, { width: "62%", backgroundColor: t.warning }]} />
                      </View>
                      <Text variant="micro" tone="muted" style={{ marginTop: 4 }}>
                        About 12 seconds remaining
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FormatBtn({
  label,
  hint,
  selected,
  onPress,
  t,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.formatBtn,
        {
          backgroundColor: selected ? t.primarySoft : t.bgMuted,
          borderColor: selected ? t.primary : t.border,
        },
      ]}
    >
      <Text variant="body" weight="bold" style={{ color: selected ? t.primary : t.textPrimary }}>
        {label}
      </Text>
      <Text variant="micro" tone={selected ? "accent" : "secondary"}>
        {hint}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 56,
    paddingBottom: space.xl + space.lg,
    paddingHorizontal: space.lg,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  genCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  smallChip: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  formatBtn: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: radius.md,
  },

  reportCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 9,
    borderRadius: radius.md,
  },
});
