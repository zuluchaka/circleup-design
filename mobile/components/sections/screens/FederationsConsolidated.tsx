// Consolidated finance for /sections/federations/consolidated.
// Per spec: tabs (Dues / Transfers / Federation Fund). Dues row shows each
// association's monthly contribution + overdue amount.

import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Wallet, ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle2, ChevronRight,
  PiggyBank, TrendingUp,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";

type Tab = "Dues" | "Transfers" | "Federation Fund";

const DUES = [
  { id: "geneva",    name: "Diaspora Circle Geneva",   monthly: 200, outstanding: 0,    status: "OK"   as const },
  { id: "lausanne",  name: "Lausanne Cultural Circle", monthly: 200, outstanding: 400,  status: "Late" as const },
  { id: "vevey",     name: "Vevey Susu Network",       monthly: 150, outstanding: 0,    status: "OK"   as const },
  { id: "fribourg",  name: "Fribourg Welfare Ring",    monthly: 200, outstanding: 0,    status: "OK"   as const },
  { id: "neuchatel", name: "Neuchâtel Diaspora Hub",   monthly: 150, outstanding: 150,  status: "Late" as const },
];

const TRANSFERS = [
  { id: "t1", date: "2026-05-21", from: "Federation Fund", to: "Lausanne Cultural Circle", amount: 1200, kind: "Emergency Fund top-up", direction: "out" as const },
  { id: "t2", date: "2026-05-18", from: "Diaspora Circle Geneva", to: "Federation Fund", amount: 200, kind: "Monthly dues", direction: "in" as const },
  { id: "t3", date: "2026-05-18", from: "Vevey Susu Network", to: "Federation Fund", amount: 150, kind: "Monthly dues", direction: "in" as const },
  { id: "t4", date: "2026-05-10", from: "Federation Fund", to: "Fribourg Welfare Ring", amount: 500, kind: "Onboarding grant", direction: "out" as const },
  { id: "t5", date: "2026-05-04", from: "Diaspora Circle Geneva", to: "Vevey Susu Network", amount: 350, kind: "Inter-association loan", direction: "out" as const },
];

const FED_FUND = {
  balance: 8_420,
  currency: "CHF",
  ytdIn: 12_600,
  ytdOut: 7_280,
  reserve: 3_000,
  earmarks: [
    { label: "Emergency reserves", amount: 3_000, color: palette.emerald[500] },
    { label: "Onboarding grants",  amount: 2_500, color: palette.indigo[500] },
    { label: "Annual conference",  amount: 1_500, color: palette.amber[500] },
    { label: "Unallocated",        amount: 1_420, color: palette.slate[500] },
  ],
};

export function FederationsConsolidated() {
  const t = useTheme();
  const [tab, setTab] = useState<Tab>("Dues");

  const totalMonthly = DUES.reduce((s, d) => s + d.monthly, 0);
  const totalOverdue = DUES.reduce((s, d) => s + d.outstanding, 0);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title="Consolidated finance" subtitle="Swiss West Diaspora Federation" />

      <LinearGradient
        colors={[palette.indigo[700], palette.indigo[900]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 1.2 }}>
          FEDERATION FUND BALANCE
        </Text>
        <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
          CHF {FED_FUND.balance.toLocaleString("de-CH")}
        </Text>
        <View style={{ flexDirection: "row", gap: space.md, marginTop: space.md }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <ArrowDownLeft size={12} color={palette.emerald[400]} />
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)" }}>
              CHF {FED_FUND.ytdIn.toLocaleString("de-CH")} YTD in
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <ArrowUpRight size={12} color={palette.rose[400]} />
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)" }}>
              CHF {FED_FUND.ytdOut.toLocaleString("de-CH")} YTD out
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.tabsRow, { borderBottomColor: t.border }]}>
        {(["Dues", "Transfers", "Federation Fund"] as Tab[]).map((opt) => {
          const sel = tab === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => setTab(opt)}
              style={[styles.tab, sel && { borderBottomColor: t.primary, borderBottomWidth: 2 }]}
            >
              <Text variant="bodySmall" weight={sel ? "bold" : "semibold"} style={{ color: sel ? t.primary : t.textSecondary }}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}>
        {tab === "Dues" && (
          <>
            <View style={{ flexDirection: "row", gap: space.sm }}>
              <View style={[styles.summary, { backgroundColor: t.successSoft, borderColor: t.success }]}>
                <Text variant="caption" weight="bold" style={{ color: t.success, letterSpacing: 0.6 }}>EXPECTED / MO</Text>
                <Text variant="h2" weight="bold" style={{ color: t.success }}>CHF {totalMonthly}</Text>
              </View>
              <View style={[styles.summary, { backgroundColor: totalOverdue > 0 ? t.dangerSoft : t.bgMuted, borderColor: totalOverdue > 0 ? t.danger : t.border }]}>
                <Text variant="caption" weight="bold" style={{ color: totalOverdue > 0 ? t.danger : t.textMuted, letterSpacing: 0.6 }}>OVERDUE</Text>
                <Text variant="h2" weight="bold" style={{ color: totalOverdue > 0 ? t.danger : t.textMuted }}>CHF {totalOverdue}</Text>
              </View>
            </View>

            <Card padded={false}>
              {DUES.map((d, i) => {
                const late = d.status === "Late";
                return (
                  <View
                    key={d.id}
                    style={[
                      styles.row,
                      i < DUES.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                    ]}
                  >
                    <View style={[styles.dot, { backgroundColor: late ? t.danger : t.success }]} />
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{d.name}</Text>
                      <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                        CHF {d.monthly} / month
                      </Text>
                    </View>
                    {late ? (
                      <View style={[styles.statusPill, { backgroundColor: t.dangerSoft }]}>
                        <Text variant="micro" weight="bold" style={{ color: t.danger }}>
                          CHF {d.outstanding} late
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.statusPill, { backgroundColor: t.successSoft }]}>
                        <CheckCircle2 size={11} color={t.success} />
                        <Text variant="micro" weight="bold" style={{ color: t.success }}>OK</Text>
                      </View>
                    )}
                    <ChevronRight size={16} color={t.textMuted} />
                  </View>
                );
              })}
            </Card>
          </>
        )}

        {tab === "Transfers" && (
          <Card padded={false}>
            {TRANSFERS.map((tr, i) => {
              const inflow = tr.direction === "in";
              return (
                <View
                  key={tr.id}
                  style={[
                    styles.row,
                    i < TRANSFERS.length - 1 && { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={[styles.txIcon, { backgroundColor: inflow ? t.successSoft : t.dangerSoft }]}>
                    {inflow ? <ArrowDownLeft size={14} color={t.success} /> : <ArrowUpRight size={14} color={t.danger} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" weight="semibold" numberOfLines={1}>{tr.kind}</Text>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 2 }} numberOfLines={1}>
                      {tr.from} → {tr.to}
                    </Text>
                    <Text variant="micro" tone="muted" style={{ marginTop: 2 }}>
                      {new Date(tr.date).toLocaleDateString("en-CH", { day: "numeric", month: "short" })}
                    </Text>
                  </View>
                  <Text variant="bodySmall" weight="bold" style={{ color: inflow ? t.success : t.danger }}>
                    {inflow ? "+" : "-"}CHF {tr.amount.toLocaleString("de-CH")}
                  </Text>
                </View>
              );
            })}
          </Card>
        )}

        {tab === "Federation Fund" && (
          <>
            <Card padded>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                <View style={[styles.fundIcon, { backgroundColor: t.primarySoft }]}>
                  <PiggyBank size={20} color={t.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 0.6 }}>BALANCE</Text>
                  <Text variant="h2" weight="bold">CHF {FED_FUND.balance.toLocaleString("de-CH")}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <TrendingUp size={11} color={t.success} />
                    <Text variant="micro" weight="bold" style={{ color: t.success }}>+42%</Text>
                  </View>
                  <Text variant="micro" tone="muted">vs Q4 2025</Text>
                </View>
              </View>
            </Card>

            <View>
              <Text variant="caption" weight="bold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
                EARMARKS
              </Text>
              <Card padded>
                {FED_FUND.earmarks.map((e, i) => {
                  const pct = (e.amount / FED_FUND.balance) * 100;
                  return (
                    <View key={e.label} style={{ marginTop: i === 0 ? 0 : space.md }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <View style={[styles.dot, { backgroundColor: e.color }]} />
                          <Text variant="bodySmall" weight="semibold">{e.label}</Text>
                        </View>
                        <Text variant="bodySmall" weight="bold">CHF {e.amount.toLocaleString("de-CH")}</Text>
                      </View>
                      <View style={[styles.bar, { backgroundColor: t.bgMuted }]}>
                        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: e.color, borderRadius: 3 }} />
                      </View>
                    </View>
                  );
                })}
              </Card>
            </View>

            <View style={[styles.notice, { backgroundColor: t.infoSoft, borderColor: t.info }]}>
              <Wallet size={16} color={t.info} />
              <Text variant="caption" style={{ color: t.info, flex: 1, lineHeight: 18 }}>
                Reserves of CHF {FED_FUND.reserve.toLocaleString("de-CH")} are locked by federation governance vote. Tap a vote in Section 5 to motion a release.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    marginHorizontal: space.lg,
    marginTop: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
  },
  tabsRow: {
    flexDirection: "row",
    marginTop: space.lg,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  summary: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  txIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fundIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
