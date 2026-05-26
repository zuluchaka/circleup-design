// KYC review queue for /sections/platform-administration/kyc.
// List of risk-scored applicants, filters, expand to documents + decision.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  ShieldCheck, AlertTriangle, Clock, MapPin, FileText, Filter, ChevronRight,
  Check, X, Eye, Lock,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const FILTERS = ["All · 38", "Low risk", "Medium", "High", "Overdue"];

const QUEUE = [
  { id: "kyc_18", name: "Olusegun Adebayo", country: "CH", risk: 18, age: "2h",  docs: ["Passport", "Selfie", "Address"], reco: "approve" as const },
  { id: "kyc_22", name: "Mei Tanaka",       country: "CH", risk: 22, age: "5h",  docs: ["ID card", "Selfie"],              reco: "approve" as const },
  { id: "kyc_57", name: "Joseph Banda",     country: "ZM", risk: 57, age: "1d",  docs: ["Passport"],                       reco: "review" as const  },
  { id: "kyc_71", name: "Carmen Reyes",     country: "MX", risk: 71, age: "1d",  docs: ["Passport", "Address"],            reco: "review" as const  },
  { id: "kyc_88", name: "Yusuf Khan",       country: "PK", risk: 88, age: "3d",  docs: ["Passport", "Selfie"],             reco: "deny" as const    },
];

function riskTone(r: number, t: any) {
  if (r >= 70) return { bg: t.dangerSoft,  fg: t.danger,  label: "HIGH"   };
  if (r >= 40) return { bg: t.warningSoft, fg: t.warning, label: "MEDIUM" };
  return { bg: t.successSoft, fg: t.success, label: "LOW" };
}

function recoVisual(r: "approve" | "review" | "deny", t: any) {
  if (r === "approve") return { fg: t.success,   label: "Auto-approve", Icon: Check };
  if (r === "deny")    return { fg: t.danger,    label: "Recommend deny", Icon: X };
  return                       { fg: t.warning,   label: "Manual review", Icon: Eye };
}

export function PlatformKyc() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="KYC review queue" subtitle="Section 14 · Platform Admin" />

      <View style={[styles.staffBanner, { backgroundColor: palette.slate[800] }]}>
        <Lock size={11} color={palette.amber[300]} />
        <Text variant="micro" weight="bold" style={{ color: "#fff", flex: 1 }}>STAFF · 38 in queue · 3 overdue</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f, i) => (
          <View
            key={f}
            style={[
              styles.filterChip,
              { backgroundColor: i === 0 ? t.primary : t.surface, borderColor: i === 0 ? t.primary : t.border },
            ]}
          >
            <Text variant="caption" weight="semibold" style={{ color: i === 0 ? "#fff" : t.textSecondary }}>{f}</Text>
          </View>
        ))}
        <Pressable style={[styles.filterChip, { backgroundColor: t.surface, borderColor: t.border, flexDirection: "row", alignItems: "center", gap: 4 }]}>
          <Filter size={11} color={t.textSecondary} />
          <Text variant="caption" weight="semibold" tone="secondary">Sort</Text>
        </Pressable>
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.sm }}>
        {QUEUE.map((a) => {
          const r = riskTone(a.risk, t);
          const v = recoVisual(a.reco, t);
          const overdue = a.age.includes("d") && Number(a.age.replace("d", "")) >= 3;
          return (
            <Pressable key={a.id} style={[styles.row, { backgroundColor: t.surface, borderColor: overdue ? t.danger : t.border, borderWidth: overdue ? 2 : 1 }]}>
              <Avatar name={a.name} size="md" />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
                  <Text variant="bodySmall" weight="bold" numberOfLines={1} style={{ flex: 1 }}>{a.name}</Text>
                  <View style={[styles.riskPill, { backgroundColor: r.bg }]}>
                    <Text variant="micro" weight="bold" style={{ color: r.fg }}>{r.label} · {a.risk}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: space.md, marginTop: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MapPin size={11} color={t.textMuted} />
                    <Text variant="caption" tone="secondary">{a.country}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Clock size={11} color={overdue ? t.danger : t.textMuted} />
                    <Text variant="caption" weight={overdue ? "bold" : "regular"} style={{ color: overdue ? t.danger : t.textSecondary }}>
                      {overdue ? `OVERDUE · ${a.age}` : a.age}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {a.docs.map((d) => (
                    <View key={d} style={[styles.docChip, { backgroundColor: t.bgMuted }]}>
                      <FileText size={10} color={t.textSecondary} />
                      <Text variant="micro" weight="semibold" tone="secondary">{d}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
                  <v.Icon size={11} color={v.fg} />
                  <Text variant="caption" weight="bold" style={{ color: v.fg }}>{v.label}</Text>
                </View>
              </View>
              <ChevronRight size={14} color={t.textMuted} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  staffBanner: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: space.md, paddingVertical: 6 },
  filters: { paddingHorizontal: space.lg, paddingVertical: space.sm, gap: space.sm },
  filterChip: { paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md },
  riskPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
  docChip: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: radius.sm },
});
