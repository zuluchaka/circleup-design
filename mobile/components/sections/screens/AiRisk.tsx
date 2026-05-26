// Risk & Fraud dashboard for /sections/ai-insights/risk.
// KPI tiles (default risk, anomalies, fraud) + active alerts list with action.

import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  ShieldAlert, AlertOctagon, Activity, ChevronRight, MapPin, Smartphone, MessageCircle, Eye, Lock,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

const TILES = [
  { id: "default", label: "Members at default risk", value: "2", tone: "warning" as const, Icon: ShieldAlert,  detail: "Both predicted <80% confidence" },
  { id: "anomaly", label: "Anomalous contributions", value: "1", tone: "warning" as const, Icon: Activity,     detail: "1 sequence outlier this cycle" },
  { id: "fraud",   label: "Suspicious logins",       value: "1", tone: "danger"  as const, Icon: AlertOctagon, detail: "1 active session revoked" },
];

const ALERTS = [
  {
    id: "alert_kofi",
    kind: "Fraud",
    severity: "high",
    title: "Login from new device · Kofi Mensah",
    body: "Lagos, Nigeria · device fingerprint not seen before. Session revoked. Verification link sent to Kofi's primary email.",
    inputs: ["IP geolocation", "Device fingerprint", "Behavior baseline"],
    primaryAction: "Force re-auth",
    metadata: [
      { Icon: MapPin,     label: "Lagos, NG · 11.4km from baseline" },
      { Icon: Smartphone, label: "Samsung S23 Android 14 (new)" },
    ],
  },
  {
    id: "alert_linh",
    kind: "Risk",
    severity: "medium",
    title: "Linh P. likely to miss June contribution",
    body: "Payment latency rising over the last 3 cycles. Predicted June miss probability: 64%. Recommended action: friendly outreach in the next 5 days.",
    inputs: ["Cycle history", "Engagement signals", "Welfare draws"],
    primaryAction: "Open thread",
    metadata: [],
  },
];

function sevColor(sev: string, t: any) {
  if (sev === "high")   return { bg: t.dangerSoft,  fg: t.danger  };
  if (sev === "medium") return { bg: t.warningSoft, fg: t.warning };
  return { bg: t.infoSoft, fg: t.info };
}

export function AiRisk() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Risk & fraud" subtitle="Section 10 · AI Insights" />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {/* Tiles */}
        <View style={{ gap: space.sm }}>
          {TILES.map((tile) => {
            const tonePalette = tile.tone === "danger"
              ? { bg: t.dangerSoft, fg: t.danger }
              : { bg: t.warningSoft, fg: t.warning };
            const Icon = tile.Icon;
            return (
              <View key={tile.id} style={[styles.tile, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={[styles.tileIcon, { backgroundColor: tonePalette.bg }]}>
                  <Icon size={20} color={tonePalette.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.4 }}>
                    {tile.label.toUpperCase()}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.xs, marginTop: 2 }}>
                    <Text variant="h1" weight="bold">{tile.value}</Text>
                    <Text variant="caption" tone="secondary">active</Text>
                  </View>
                  <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>{tile.detail}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Active alerts */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
            <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>ACTIVE ALERTS · {ALERTS.length}</Text>
            <Text variant="caption" weight="semibold" tone="accent">History</Text>
          </View>
          <View style={{ gap: space.sm }}>
            {ALERTS.map((a) => {
              const sev = sevColor(a.severity, t);
              return (
                <Card key={a.id} padded>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
                    <View style={[styles.kindPill, { backgroundColor: sev.bg }]}>
                      <Text variant="micro" weight="bold" style={{ color: sev.fg, letterSpacing: 0.6 }}>
                        {a.kind.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.sevDot, { backgroundColor: sev.fg }]} />
                    <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.4 }}>
                      {a.severity.toUpperCase()} SEVERITY
                    </Text>
                  </View>
                  <Text variant="h3" weight="bold">{a.title}</Text>
                  <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.xs, lineHeight: 18 }}>{a.body}</Text>

                  {a.metadata.length > 0 ? (
                    <View style={{ marginTop: space.sm, gap: 4 }}>
                      {a.metadata.map((m, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <m.Icon size={11} color={t.textMuted} />
                          <Text variant="caption" tone="secondary">{m.label}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  <Pressable style={{ flexDirection: "row", alignItems: "center", marginTop: space.sm }}>
                    <Eye size={12} color={t.textMuted} />
                    <Text variant="caption" tone="muted" style={{ marginLeft: 4 }}>
                      Why? {a.inputs.join(", ")}.
                    </Text>
                  </Pressable>

                  <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
                    <Button
                      label={a.primaryAction}
                      variant={a.severity === "high" ? "danger" : "primary"}
                      trailingIcon={a.kind === "Fraud" ? <Lock size={14} color="#fff" /> : <MessageCircle size={14} color="#fff" />}
                    />
                    <Pressable style={[styles.dismiss, { backgroundColor: t.surface, borderColor: t.border }]}>
                      <Text variant="caption" weight="semibold" tone="secondary">Snooze 24h</Text>
                    </Pressable>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        <View style={[styles.tip, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
          <ShieldAlert size={16} color={t.info} />
          <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 16 }}>
            Risk models retrain weekly on your association's data. Lower-confidence (&lt; 70%) signals are filtered out by default — opt in from Notification preferences.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  kindPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  sevDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dismiss: {
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
