import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  PiggyBank,
  TrendingUp,
  Lock,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Calendar,
  ArrowRight,
  Eye,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import treasury from "@/product/sections/04-treasury-and-funds/data.json";

type Risk = "low" | "medium" | "high";
type Category = "money_market" | "bond_ladder" | "fixed_deposit" | "structured";

type Opportunity = {
  id: string;
  name: string;
  category: Category;
  provider: string;
  risk: Risk;
  annualReturn: number;
  lockupMonths: number;
  minimumAmount: number;
  currency: string;
  description: string;
  highlights: string[];
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function timeAgo(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function riskMeta(r: Risk, t: AppTheme) {
  if (r === "low")    return { color: t.success, label: "Low risk" };
  if (r === "medium") return { color: t.warning, label: "Medium risk" };
  return { color: t.danger, label: "High risk" };
}

function categoryMeta(c: Category, t: AppTheme) {
  if (c === "money_market")  return { color: t.success, Icon: PiggyBank,   label: "Money market" };
  if (c === "bond_ladder")   return { color: t.primary, Icon: TrendingUp,  label: "Bond ladder" };
  if (c === "fixed_deposit") return { color: t.warning, Icon: Lock,        label: "Fixed deposit" };
  return { color: t.info, Icon: Sparkles, label: "Structured" };
}

function lockupLabel(months: number) {
  if (months === 0) return "No lockup";
  if (months < 12) return `${months}-month lockup`;
  return `${months / 12}-year lockup`;
}

// ---------------------------------------------------------------------------
// Risk pip
// ---------------------------------------------------------------------------

function RiskPip({ risk, t }: { risk: Risk; t: AppTheme }) {
  const filled = risk === "high" ? 3 : risk === "medium" ? 2 : 1;
  const meta = riskMeta(risk, t);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.pipDot,
            {
              backgroundColor: i <= filled ? meta.color : t.bgMuted,
            },
          ]}
        />
      ))}
      <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
        {meta.label.toUpperCase()}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function TreasuryInvestments() {
  const t = useTheme();
  const p = treasury.investmentPortfolio as {
    idleBalance: number;
    currency: string;
    earningPotential: number;
    advisorName: string;
    advisorTrust: number;
    lastReviewed: string;
    opportunities: Opportunity[];
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Investments"
        subtitle="EF balance · read-only preview"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview banner */}
        <View style={[styles.previewBanner, { backgroundColor: t.warningSoft }]}>
          <View style={[styles.previewIcon, { backgroundColor: t.surface }]}>
            <Eye size={14} color={t.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>
              V1.9 PREVIEW · READ-ONLY
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              Surfacing investment options. Allocation will be enabled in a later release once the advisor flow is complete.
            </Text>
          </View>
        </View>

        {/* Idle balance hero */}
        <View style={[styles.hero, { backgroundColor: t.warning }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <PiggyBank size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              IDLE EF BALANCE
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 40, lineHeight: 44, marginTop: space.xs }}>
            {formatCurrency(p.idleBalance, p.currency)}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)", marginTop: 2 }}>
            Earning potential · up to {formatCurrency(p.earningPotential, p.currency)}/year
          </Text>
          <View style={[styles.heroFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Avatar name={p.advisorName} size="xs" />
              <View>
                <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.6 }}>
                  ADVISOR
                </Text>
                <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
                  {p.advisorName} · T·{p.advisorTrust}
                </Text>
              </View>
            </View>
            <View>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.6 }}>
                LAST REVIEWED
              </Text>
              <Text variant="caption" weight="bold" style={{ color: "#fff" }}>{timeAgo(p.lastReviewed)}</Text>
            </View>
          </View>
        </View>

        {/* Opportunities */}
        <View>
          <Text variant="h3" weight="bold" style={{ marginBottom: space.sm }}>Conservative options</Text>
          <Text variant="bodySmall" tone="secondary" style={{ marginBottom: space.md, lineHeight: 19 }}>
            We surface only options that protect cycle continuity. Anything more aggressive needs a board vote first.
          </Text>
          <View style={{ gap: space.md }}>
            {p.opportunities.map((o) => (
              <OpportunityCard key={o.id} o={o} t={t} />
            ))}
          </View>
        </View>

        {/* Advisor card */}
        <View style={[styles.advisorCard, { backgroundColor: t.primarySoft }]}>
          <Avatar name={p.advisorName} size="md" />
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.primary, letterSpacing: 0.5 }}>
              TALK TO AN ADVISOR
            </Text>
            <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>{p.advisorName}</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 1, lineHeight: 14 }}>
              Treasurer-level conversations stay between you and the platform. No allocation happens without a board vote.
            </Text>
          </View>
        </View>

        {/* Compliance note */}
        <View style={[styles.compliance, { backgroundColor: t.bgMuted }]}>
          <ShieldCheck size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted" style={{ flex: 1, lineHeight: 14 }}>
            Past returns aren't a guarantee. The Emergency Fund's primary purpose remains cycle continuity — investments are layered on top, not replacing it.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <Button
          label="Schedule a call with the advisor"
          fullWidth
          size="lg"
          variant="primary"
          trailingIcon={<MessageCircle size={16} color="#fff" />}
        />
      </View>
    </View>
  );
}

function OpportunityCard({ o, t }: { o: Opportunity; t: AppTheme }) {
  const cat = categoryMeta(o.category, t);
  const Icon = cat.Icon;
  return (
    <View style={[styles.opp, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={styles.oppHeader}>
        <View style={[styles.oppIcon, { backgroundColor: `${cat.color}22` }]}>
          <Icon size={18} color={cat.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Text variant="bodySmall" weight="bold">{o.name}</Text>
            <View style={[styles.catPill, { backgroundColor: `${cat.color}22` }]}>
              <Text variant="micro" weight="bold" style={{ color: cat.color, letterSpacing: 0.5 }}>
                {cat.label.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>via {o.provider}</Text>
        </View>
      </View>

      <View style={[styles.oppStats, { backgroundColor: t.bgMuted }]}>
        <OppStat label="Return" value={`${(o.annualReturn * 100).toFixed(1)}%`} sub="annual" color={t.success} t={t} />
        <Sep t={t} />
        <OppStat label="Lockup" value={lockupLabel(o.lockupMonths).replace(/-(month|year)?.*/, "$&".replace("lockup", "")).trim()} sub={o.lockupMonths === 0 ? "daily access" : "minimum"} t={t} />
        <Sep t={t} />
        <OppStat label="Minimum" value={formatCurrency(o.minimumAmount, o.currency)} sub="opening" t={t} />
      </View>

      <View style={[styles.oppRisk, { borderTopColor: t.border }]}>
        <RiskPip risk={o.risk} t={t} />
      </View>

      <Text variant="caption" tone="secondary" style={{ padding: space.md, paddingTop: space.sm, lineHeight: 16 }}>
        {o.description}
      </Text>

      <View style={[styles.highlights, { borderTopColor: t.border }]}>
        {o.highlights.map((h, i) => (
          <View key={i} style={styles.highlightRow}>
            <View style={[styles.highlightDot, { backgroundColor: t.successSoft }]}>
              <ShieldCheck size={9} color={t.success} strokeWidth={3} />
            </View>
            <Text variant="micro" tone="secondary" style={{ flex: 1, lineHeight: 14 }}>{h}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.oppCta, { borderTopColor: t.border }]}>
        <Pressable style={[styles.talkBtn, { backgroundColor: t.bgMuted }]}>
          <Calendar size={11} color={t.textPrimary} />
          <Text variant="micro" weight="bold">Talk to advisor</Text>
          <ArrowRight size={11} color={t.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

function OppStat({
  label,
  value,
  sub,
  color,
  t,
}: {
  label: string;
  value: string;
  sub: string;
  color?: string;
  t: AppTheme;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ marginTop: 2, color: color ?? t.textPrimary }}>{value}</Text>
      <Text variant="micro" tone="muted" style={{ marginTop: 1 }}>{sub}</Text>
    </View>
  );
}

function Sep({ t }: { t: AppTheme }) {
  return <View style={{ width: 1, height: 36, backgroundColor: t.border }} />;
}

const styles = StyleSheet.create({
  previewBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  previewIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: space.md,
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  opp: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  oppHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  oppIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  catPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  oppStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    marginHorizontal: space.md,
    borderRadius: radius.sm,
  },
  oppRisk: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  pipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  highlights: {
    padding: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  highlightDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  oppCta: {
    padding: space.md,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  talkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  advisorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  compliance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  ctaDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
