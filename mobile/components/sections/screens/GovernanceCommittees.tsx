// Committees list for /sections/governance-and-voting/committees.
// Each committee with chair, member roster, term-end, charter link.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  Users, Crown, Calendar, ChevronRight, FileText, Plus, ShieldCheck,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const COMMITTEES = [
  { id: "com_finance",    name: "Finance",        accent: palette.indigo[500],  chair: "Amara Ofori",    role: "Treasurer", members: ["Mariam Rahimi", "Zara Bekele", "Kofi Mensah"], termEnd: "2026-12-31", meetingCadence: "Monthly · 2nd Tuesday", charter: "Reviews monthly P&L, approves welfare disbursements, signs off audits." },
  { id: "com_membership", name: "Membership",     accent: palette.emerald[500], chair: "Ngozi Okafor",   role: "Organiser", members: ["Selam Haile", "Linh Pham"],                    termEnd: "2026-12-31", meetingCadence: "Bi-weekly · Thursday", charter: "Vets applicants, manages onboarding, handles member disputes." },
  { id: "com_events",     name: "Events",         accent: palette.amber[500],   chair: "Zara Bekele",    role: "Secretary", members: ["Aïssatou Dembélé", "Selam Haile"],             termEnd: "2026-12-31", meetingCadence: "Ad hoc",            charter: "Plans the AGM, cultural events, and member workshops." },
  { id: "com_audit",      name: "Audit",          accent: palette.rose[500],    chair: "Mariam Rahimi",  role: "Auditor",   members: ["Kofi Mensah"],                                  termEnd: "2026-06-30", meetingCadence: "Quarterly",         charter: "Independent review of treasury operations and FINMA filings." },
];

export function GovernanceCommittees() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Committees" subtitle="Section 05 · Governance & Voting" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Users size={14} color={t.primary} />
            <Text variant="h2" weight="bold">{COMMITTEES.length}</Text>
            <Text variant="micro" tone="muted" weight="semibold">COMMITTEES</Text>
          </View>
          <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Crown size={14} color={t.warning} />
            <Text variant="h2" weight="bold">{COMMITTEES.length}</Text>
            <Text variant="micro" tone="muted" weight="semibold">CHAIRS</Text>
          </View>
          <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Calendar size={14} color={t.warning} />
            <Text variant="h2" weight="bold">1</Text>
            <Text variant="micro" tone="muted" weight="semibold">EXPIRES SOON</Text>
          </View>
        </View>

        {COMMITTEES.map((c) => {
          const monthsToExpire = Math.ceil(
            (new Date(c.termEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30),
          );
          const expiringSoon = monthsToExpire <= 3;
          return (
            <Pressable key={c.id} style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
              <View style={[styles.accent, { backgroundColor: c.accent }]} />
              <View style={{ padding: space.lg, gap: space.md }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
                  <View style={[styles.committeeIcon, { backgroundColor: `${c.accent}22`, borderColor: c.accent }]}>
                    <ShieldCheck size={18} color={c.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="h3" weight="bold">{c.name}</Text>
                    <Text variant="caption" tone="secondary">{c.meetingCadence}</Text>
                  </View>
                  {expiringSoon ? (
                    <View style={[styles.expiringPill, { backgroundColor: t.warningSoft }]}>
                      <Text variant="micro" weight="bold" style={{ color: t.warning }}>
                        EXPIRES IN {monthsToExpire}M
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text variant="bodySmall" tone="secondary" style={{ lineHeight: 18 }}>
                  {c.charter}
                </Text>

                {/* Chair */}
                <View style={[styles.chairRow, { backgroundColor: t.bgMuted }]}>
                  <Avatar name={c.chair} size="md" />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Text variant="bodySmall" weight="semibold">{c.chair}</Text>
                      <Crown size={12} color={t.warning} />
                    </View>
                    <Text variant="caption" tone="secondary">{c.role} · Chair</Text>
                  </View>
                </View>

                {/* Members */}
                <View>
                  <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.6, marginBottom: space.xs }}>
                    MEMBERS · {c.members.length}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.xs }}>
                    {c.members.map((m) => (
                      <View key={m} style={[styles.memberChip, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
                        <Avatar name={m} size="sm" />
                        <Text variant="caption" weight="semibold">{m}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={[styles.footerRow, { borderTopColor: t.border }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
                    <Calendar size={11} color={t.textMuted} />
                    <Text variant="caption" tone="secondary">
                      Term ends {new Date(c.termEnd).toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" })}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <FileText size={11} color={t.primary} />
                    <Text variant="caption" weight="semibold" tone="accent">Charter</Text>
                  </View>
                  <ChevronRight size={14} color={t.textMuted} />
                </View>
              </View>
            </Pressable>
          );
        })}

        <Button label="New committee" leadingIcon={<Plus size={16} color="#fff" />} fullWidth />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flex: 1, alignItems: "center", paddingVertical: space.md, borderRadius: radius.md, borderWidth: 1, gap: 4 },
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: "hidden" },
  accent: { height: 4 },
  committeeIcon: { width: 40, height: 40, borderRadius: radius.md, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  expiringPill: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: radius.sm },
  chairRow: { flexDirection: "row", alignItems: "center", gap: space.sm, padding: space.sm, borderRadius: radius.md },
  memberChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1 },
  footerRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingTop: space.md, borderTopWidth: 1 },
});
