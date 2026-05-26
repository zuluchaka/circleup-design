// Statements list for /sections/analytics-and-reporting/statements.
// Scoped statements (Personal / Circle / Association) with generate-new sheet
// and download actions.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  FileText, Download, Plus, Calendar, Building2, CircleDot, User as UserIcon,
  ChevronRight, FileBarChart2,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type Scope = "Personal" | "Circle · Main CHF" | "Association";

const STATEMENTS = [
  { id: "st_personal_2026", scope: "Personal"            as Scope, period: "Jan – May 2026",       generated: "2026-05-17", format: "PDF",  size: "208 KB" },
  { id: "st_circle_q1",     scope: "Circle · Main CHF"   as Scope, period: "Q1 2026",              generated: "2026-04-05", format: "PDF",  size: "316 KB" },
  { id: "st_personal_2025", scope: "Personal"            as Scope, period: "Full year 2025",      generated: "2026-01-12", format: "PDF",  size: "412 KB" },
  { id: "st_assoc_2025",    scope: "Association"         as Scope, period: "Annual 2025",          generated: "2026-02-12", format: "PDF",  size: "1.2 MB" },
  { id: "st_circle_q4",     scope: "Circle · Main CHF"   as Scope, period: "Q4 2025",              generated: "2026-01-08", format: "CSV",  size: "84 KB"  },
  { id: "st_assoc_q4_25",   scope: "Association"         as Scope, period: "Q4 2025 tax filing",   generated: "2026-01-15", format: "PDF",  size: "892 KB" },
];

function scopeVisual(s: Scope, t: any) {
  if (s === "Personal")     return { Icon: UserIcon, bg: t.primarySoft, fg: t.primary };
  if (s === "Association")  return { Icon: Building2, bg: t.warningSoft, fg: t.warning };
  return { Icon: CircleDot, bg: t.infoSoft, fg: t.info };
}

export function AnalyticsStatements() {
  const t = useTheme();
  const counts = {
    personal: STATEMENTS.filter((s) => s.scope === "Personal").length,
    circle:   STATEMENTS.filter((s) => s.scope.startsWith("Circle")).length,
    assoc:    STATEMENTS.filter((s) => s.scope === "Association").length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Statements" subtitle="Section 08 · Analytics & Reporting" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={[styles.heroIcon, { backgroundColor: t.primary }]}>
              <FileBarChart2 size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold">Generate a statement</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                Personal, circle, or association — for tax, audit, or member records.
              </Text>
            </View>
          </View>
          <View style={{ marginTop: space.md }}>
            <Button label="New statement" leadingIcon={<Plus size={16} color="#fff" />} fullWidth />
          </View>
        </Card>

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <ScopeCount label="Personal" value={counts.personal} Icon={UserIcon}  color={t.primary} t={t} />
          <ScopeCount label="Circle"   value={counts.circle}   Icon={CircleDot} color={t.info}    t={t} />
          <ScopeCount label="Assoc."   value={counts.assoc}    Icon={Building2} color={t.warning} t={t} />
        </View>

        <View>
          <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            ALL STATEMENTS
          </Text>
          <Card padded={false}>
            {STATEMENTS.map((s, i) => {
              const v = scopeVisual(s.scope, t);
              return (
                <Pressable
                  key={s.id}
                  style={[
                    styles.row,
                    i < STATEMENTS.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={[styles.scopeIcon, { backgroundColor: v.bg }]}>
                    <v.Icon size={16} color={v.fg} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{s.period}</Text>
                    <Text variant="caption" tone="secondary" numberOfLines={1}>
                      {s.scope} · {s.format} · {s.size}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <Calendar size={10} color={t.textMuted} />
                      <Text variant="micro" tone="muted">
                        Generated {new Date(s.generated).toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" })}
                      </Text>
                    </View>
                  </View>
                  <Pressable style={[styles.downloadBtn, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
                    <Download size={14} color={t.textPrimary} />
                  </Pressable>
                </Pressable>
              );
            })}
          </Card>
        </View>

        <View style={[styles.footnote, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
          <FileText size={14} color={t.info} />
          <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 16 }}>
            Statements are signed PDF/A or CSV. Older statements are retained for 10 years per FINMA record-keeping rules.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ScopeCount({ label, value, Icon, color, t }: { label: string; value: number; Icon: React.ComponentType<{ size?: number; color?: string }>; color: string; t: any }) {
  return (
    <View style={[styles.scopeCount, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Icon size={14} color={color} />
      <Text variant="h2" weight="bold" style={{ marginTop: 4 }}>{value}</Text>
      <Text variant="micro" tone="muted" weight="semibold">{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  scopeCount: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  scopeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footnote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
