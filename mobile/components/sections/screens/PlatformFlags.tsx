// Feature flag console for /sections/platform-administration/flags.
// Flag list with state, cohort, rollout %, owner. Toggleable for engineering;
// read-only for support per RBAC.

import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Switch } from "react-native";
import {
  Flag, Search, Plus, ChevronRight, Lock, Users, GitBranch, Activity,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type FlagState = "on" | "off" | "partial";

const FLAGS: { id: string; name: string; description: string; state: FlagState; cohort: string; rollout: number; owner: string; sdks: string[]; sticky: boolean }[] = [
  { id: "f_multi_share_v2",  name: "multi_share_v2",         description: "Section 12 redesigned share-request flow",          state: "partial", cohort: "Pro tier",       rollout: 25,  owner: "growth",       sdks: ["iOS", "Android"], sticky: true },
  { id: "f_ai_assistant",    name: "ai_assistant",            description: "Section 10 AI assistant chat",                       state: "on",      cohort: "All members",     rollout: 100, owner: "ai",           sdks: ["iOS", "Android"], sticky: true },
  { id: "f_federation_lite", name: "federation_lite",         description: "Lightweight federations UI (no consolidated)",       state: "off",     cohort: "Internal only",   rollout: 0,   owner: "federations",  sdks: ["iOS", "Android"], sticky: false },
  { id: "f_bureau_v2",       name: "bureau_v2",               description: "Section 9 TransUnion CH integration v2",             state: "partial", cohort: "Switzerland",     rollout: 50,  owner: "fintech",      sdks: ["iOS"],            sticky: true },
  { id: "f_dark_mode_default",name:"dark_mode_default",       description: "Default new accounts to System theme",               state: "on",      cohort: "All members",     rollout: 100, owner: "design",       sdks: ["iOS", "Android"], sticky: false },
];

function stateVisual(s: FlagState, t: any) {
  if (s === "on")      return { bg: t.successSoft, fg: t.success, label: "ON" };
  if (s === "partial") return { bg: t.warningSoft, fg: t.warning, label: "PARTIAL" };
  return                       { bg: t.bgMuted,    fg: t.textMuted, label: "OFF" };
}

export function PlatformFlags() {
  const t = useTheme();
  const [flags, setFlags] = useState(FLAGS);

  const toggle = (id: string) => setFlags((arr) => arr.map((f) => f.id === id
    ? { ...f, state: f.state === "on" ? "off" : "on", rollout: f.state === "on" ? 0 : 100 }
    : f
  ));

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Feature flags" subtitle="Section 14 · Platform Admin" />

      <View style={[styles.staffBanner, { backgroundColor: palette.slate[800] }]}>
        <Lock size={11} color={palette.amber[300]} />
        <Text variant="micro" weight="bold" style={{ color: "#fff", flex: 1 }}>STAFF · ENGINEER ROLE · toggles live</Text>
      </View>

      <View style={{ paddingHorizontal: space.lg, paddingTop: space.sm }}>
        <View style={[styles.search, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
          <Search size={14} color={t.textMuted} />
          <Text variant="caption" tone="muted" style={{ flex: 1 }}>Search by flag name, cohort, owner…</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.sm }}>
        {flags.map((f) => {
          const v = stateVisual(f.state, t);
          return (
            <View key={f.id} style={[styles.flagCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.sm }}>
                <View style={[styles.flagIcon, { backgroundColor: v.bg }]}>
                  <Flag size={16} color={v.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text variant="bodySmall" weight="bold" style={{ fontFamily: "monospace" }}>{f.name}</Text>
                    <View style={[styles.statePill, { backgroundColor: v.bg }]}>
                      <Text variant="micro" weight="bold" style={{ color: v.fg }}>{v.label}</Text>
                    </View>
                  </View>
                  <Text variant="caption" tone="secondary" style={{ marginTop: 2, lineHeight: 16 }}>{f.description}</Text>
                </View>
                <Switch value={f.state === "on"} onValueChange={() => toggle(f.id)} />
              </View>

              <View style={{ marginTop: space.md }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text variant="micro" tone="muted" weight="semibold">ROLLOUT</Text>
                  <Text variant="micro" weight="bold">{f.rollout}% · {f.cohort}</Text>
                </View>
                <ProgressBar value={f.rollout} tone={f.rollout >= 75 ? "success" : "primary"} />
              </View>

              <View style={[styles.metaRow, { borderTopColor: t.border }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Users size={11} color={t.textMuted} />
                  <Text variant="micro" tone="secondary" weight="semibold">{f.owner}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <GitBranch size={11} color={t.textMuted} />
                  <Text variant="micro" tone="secondary" weight="semibold">{f.sdks.join(" · ")}</Text>
                </View>
                {f.sticky ? (
                  <View style={[styles.stickyPill, { backgroundColor: t.infoSoft }]}>
                    <Text variant="micro" weight="bold" style={{ color: t.info }}>STICKY</Text>
                  </View>
                ) : null}
                <ChevronRight size={12} color={t.textMuted} style={{ marginLeft: "auto" }} />
              </View>
            </View>
          );
        })}

        <Pressable style={[styles.newBtn, { backgroundColor: t.surface, borderColor: t.primary }]}>
          <Plus size={14} color={t.primary} />
          <Text variant="bodySmall" weight="bold" tone="accent">New flag</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  staffBanner: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: space.md, paddingVertical: 6 },
  search: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: space.md, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1 },
  flagCard: { padding: space.md, borderRadius: radius.md, borderWidth: 1 },
  flagIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  statePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
  metaRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingTop: space.sm, marginTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth },
  stickyPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
  newBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderStyle: "dashed" },
});
