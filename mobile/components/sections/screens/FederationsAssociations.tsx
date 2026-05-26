// Federated-associations list for /sections/federations/associations.
// Per spec: each association with status (active/onboarding/leaving), contact
// organiser, quick-link to that association's hub.

import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Building2, Users, ChevronRight, Plus, AlertCircle, CheckCircle2, Clock, LogOut,
  Phone, Mail,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type AssocStatus = "active" | "onboarding" | "leaving" | "overdue";

type FederatedAssociation = {
  id: string;
  name: string;
  city: string;
  brandHue: string;
  status: AssocStatus;
  members: number;
  circles: number;
  duesMonthly: number;
  outstanding: number;
  organiser: { name: string; role: string; phone: string; email: string };
  joinedAt: string;
};

const ASSOCIATIONS: FederatedAssociation[] = [
  {
    id: "assoc_diaspora_geneva",
    name: "Diaspora Circle Geneva",
    city: "Geneva, CH",
    brandHue: palette.indigo[600],
    status: "active",
    members: 184,
    circles: 3,
    duesMonthly: 200,
    outstanding: 0,
    organiser: { name: "Aminata Diallo", role: "Treasurer", phone: "+41 79 ••• 41 28", email: "aminata.d@example.ch" },
    joinedAt: "2024-06-15",
  },
  {
    id: "assoc_lausanne",
    name: "Lausanne Cultural Circle",
    city: "Lausanne, CH",
    brandHue: palette.rose[500],
    status: "overdue",
    members: 224,
    circles: 4,
    duesMonthly: 200,
    outstanding: 400,
    organiser: { name: "Mehdi Karam", role: "President", phone: "+41 78 ••• 09 02", email: "m.karam@example.ch" },
    joinedAt: "2024-08-21",
  },
  {
    id: "assoc_vevey",
    name: "Vevey Susu Network",
    city: "Vevey, CH",
    brandHue: palette.emerald[500],
    status: "active",
    members: 142,
    circles: 2,
    duesMonthly: 150,
    outstanding: 0,
    organiser: { name: "Ngozi Okeke", role: "Organiser", phone: "+41 76 ••• 88 11", email: "ngozi.o@example.ch" },
    joinedAt: "2024-09-04",
  },
  {
    id: "assoc_fribourg",
    name: "Fribourg Welfare Ring",
    city: "Fribourg, CH",
    brandHue: palette.amber[500],
    status: "onboarding",
    members: 0,
    circles: 0,
    duesMonthly: 200,
    outstanding: 0,
    organiser: { name: "Linh Pham", role: "President", phone: "+41 77 ••• 12 45", email: "linh.p@example.ch" },
    joinedAt: "2026-05-12",
  },
  {
    id: "assoc_neuchatel",
    name: "Neuchâtel Diaspora Hub",
    city: "Neuchâtel, CH",
    brandHue: palette.slate[600],
    status: "leaving",
    members: 92,
    circles: 1,
    duesMonthly: 150,
    outstanding: 150,
    organiser: { name: "Felipe Rosa", role: "Secretary", phone: "+41 79 ••• 30 67", email: "felipe.r@example.ch" },
    joinedAt: "2023-11-30",
  },
];

function statusVisual(s: AssocStatus, t: any) {
  switch (s) {
    case "active":     return { bg: t.successSoft, fg: t.success, label: "Active",      Icon: CheckCircle2 };
    case "onboarding": return { bg: t.infoSoft,    fg: t.info,    label: "Onboarding",  Icon: Clock };
    case "leaving":    return { bg: t.bgMuted,     fg: t.textMuted, label: "Leaving",   Icon: LogOut };
    case "overdue":    return { bg: t.dangerSoft,  fg: t.danger,  label: "Dues overdue", Icon: AlertCircle };
  }
}

export function FederationsAssociations() {
  const t = useTheme();

  const counts = {
    active:     ASSOCIATIONS.filter((a) => a.status === "active").length,
    onboarding: ASSOCIATIONS.filter((a) => a.status === "onboarding").length,
    overdue:    ASSOCIATIONS.filter((a) => a.status === "overdue").length,
    leaving:    ASSOCIATIONS.filter((a) => a.status === "leaving").length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Federated associations" subtitle={`Swiss West Diaspora · ${ASSOCIATIONS.length} associations`} />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        {/* Summary strip */}
        <View style={{ paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.sm, flexDirection: "row", gap: space.sm }}>
          <SummaryCell label="Active" value={counts.active} color={t.success} t={t} />
          <SummaryCell label="Onboard." value={counts.onboarding} color={t.info} t={t} />
          <SummaryCell label="Overdue" value={counts.overdue} color={t.danger} t={t} />
          <SummaryCell label="Leaving" value={counts.leaving} color={t.textMuted} t={t} />
        </View>

        <View style={{ paddingHorizontal: space.lg, paddingTop: space.md, gap: space.md }}>
          {ASSOCIATIONS.map((a) => {
            const v = statusVisual(a.status, t);
            return (
              <Pressable key={a.id} style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
                <LinearGradient
                  colors={[a.brandHue, palette.slate[800]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.accent}
                />
                <View style={{ padding: space.lg, gap: space.md }}>
                  <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
                    <View style={[styles.logo, { backgroundColor: `${a.brandHue}22`, borderColor: a.brandHue }]}>
                      <Building2 size={20} color={a.brandHue} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="h3" weight="bold" numberOfLines={1}>{a.name}</Text>
                      <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{a.city}</Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: v.bg }]}>
                      <v.Icon size={11} color={v.fg} />
                      <Text variant="micro" weight="bold" style={{ color: v.fg }}>{v.label}</Text>
                    </View>
                  </View>

                  <View style={[styles.statsRow, { borderTopColor: t.border, borderBottomColor: t.border }]}>
                    <Stat label="Members" value={String(a.members)} t={t} />
                    <Sep t={t} />
                    <Stat label="Circles" value={String(a.circles)} t={t} />
                    <Sep t={t} />
                    <Stat label="Dues / mo" value={`CHF ${a.duesMonthly}`} t={t} />
                  </View>

                  {a.outstanding > 0 ? (
                    <View style={[styles.outstanding, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
                      <AlertCircle size={14} color={t.danger} />
                      <Text variant="caption" weight="bold" style={{ color: t.danger, flex: 1 }}>
                        CHF {a.outstanding} federation dues outstanding
                      </Text>
                    </View>
                  ) : null}

                  <View style={[styles.organiserRow, { backgroundColor: t.bgMuted }]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>CONTACT ORGANISER</Text>
                      <Text variant="bodySmall" weight="semibold">{a.organiser.name}</Text>
                      <Text variant="caption" tone="secondary">{a.organiser.role}</Text>
                    </View>
                    <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
                      <Phone size={14} color={t.textPrimary} />
                    </Pressable>
                    <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
                      <Mail size={14} color={t.textPrimary} />
                    </Pressable>
                  </View>

                  <Pressable style={[styles.openBtn, { backgroundColor: t.primary }]}>
                    <Text variant="bodySmall" weight="bold" style={{ color: "#fff" }}>Open association hub</Text>
                    <ChevronRight size={14} color="#fff" />
                  </Pressable>
                </View>
              </Pressable>
            );
          })}

          <Pressable style={[styles.addCard, { backgroundColor: t.surface, borderColor: t.primary }]}>
            <View style={[styles.addIcon, { backgroundColor: t.primarySoft }]}>
              <Plus size={18} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" tone="accent">Link a new association</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                Send an invitation to an existing association's president or secretary.
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryCell({ label, value, color, t }: { label: string; value: number; color: string; t: any }) {
  return (
    <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Text variant="h2" weight="bold" style={{ color }}>{value}</Text>
      <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.4 }}>{label.toUpperCase()}</Text>
    </View>
  );
}

function Stat({ label, value, t }: { label: string; value: string; t: any }) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
      <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.4 }}>{label.toUpperCase()}</Text>
      <Text variant="bodySmall" weight="bold">{value}</Text>
    </View>
  );
}

function Sep({ t }: { t: any }) {
  return <View style={{ width: 1, backgroundColor: t.border }} />;
}

const styles = StyleSheet.create({
  summary: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  accent: {
    height: 4,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: space.sm,
  },
  outstanding: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  organiserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  openBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
