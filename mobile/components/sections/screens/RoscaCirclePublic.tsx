import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Calendar,
  ShieldCheck,
  Sparkles,
  Check,
  Languages,
  Banknote,
  Clock,
  MessageCircle,
  Share2,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type PublicCircle = {
  id: string;
  name: string;
  associationName: string;
  associationCountry: string;
  organizerName: string;
  organizerTrust: number;
  organizerTenure: string;
  contribution: number;
  currency: string;
  cadence: string;
  members: number;
  maxMembers: number;
  cycleLength: number;
  startsOn: string;
  language: string;
  payoutMethod: string;
  paymentMode: string;
  emergencyFundRate: number;
  gracePeriodDays: number;
  latePenalty: number;
  description: string;
  highlights: string[];
  matchScore: number;
  eligibilityHint: string;
  accent: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function startDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "long", year: "numeric" });
}

export function RoscaCirclePublic() {
  const t = useTheme();
  const circle = (rosca.publicCircles as PublicCircle[])[0]; // Zurich Tandem Circle
  const totalPot = circle.contribution * circle.cycleLength;
  const efAmount = Math.round(circle.contribution * circle.emergencyFundRate);
  const fillPct = circle.members / circle.maxMembers;
  const eligible = circle.eligibilityHint.toLowerCase().startsWith("eligible");

  const goJoin = () => router.push("/sections/rosca-circles/join-request" as never);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Circle preview"
        subtitle={circle.associationName}
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Share2 size={18} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: circle.accent }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={[styles.matchPill, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
              <Sparkles size={10} color="#fff" />
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                {Math.round(circle.matchScore * 100)}% MATCH
              </Text>
            </View>
            <View style={[styles.matchPill, { backgroundColor: eligible ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)" }]}>
              <Check size={10} color="#fff" />
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                {circle.eligibilityHint.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text variant="h1" weight="bold" style={{ color: "#fff", marginTop: space.sm }} numberOfLines={2}>
            {circle.name}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.9)", marginTop: 4 }}>
            {circle.associationName} · {circle.language}
          </Text>

          <View style={{ flexDirection: "row", marginTop: space.md, gap: space.md }}>
            <HeroStat label="CONTRIBUTION" value={formatCurrency(circle.contribution, circle.currency)} sub={circle.cadence.toLowerCase()} />
            <View style={[styles.heroSep, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
            <HeroStat label="TOTAL POT" value={formatCurrency(totalPot, circle.currency)} sub={`over ${circle.cycleLength} cycles`} />
          </View>
        </View>

        {/* Member fill */}
        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>MEMBERS JOINED</Text>
            <Text variant="caption" weight="semibold">
              {circle.members} / {circle.maxMembers}
            </Text>
          </View>
          <View style={[styles.fillTrack, { backgroundColor: t.bgMuted }]}>
            <View style={[styles.fillFg, { width: `${fillPct * 100}%`, backgroundColor: circle.accent }]} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
            <Text variant="micro" tone="secondary">
              {circle.maxMembers - circle.members} {circle.maxMembers - circle.members === 1 ? "spot" : "spots"} left
            </Text>
            <Text variant="micro" tone="secondary">
              Starts {startDate(circle.startsOn)}
            </Text>
          </View>
        </Card>

        {/* Organizer card */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            ORGANISED BY
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Avatar name={circle.organizerName} size="md" />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text variant="bodySmall" weight="bold">{circle.organizerName}</Text>
                <View style={[styles.trustPill, { backgroundColor: t.successSoft }]}>
                  <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.6 }}>
                    T·{circle.organizerTrust}
                  </Text>
                </View>
              </View>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{circle.organizerTenure}</Text>
            </View>
            <Pressable style={[styles.iconBtn, { backgroundColor: t.bgMuted }]}>
              <MessageCircle size={16} color={t.textPrimary} />
            </Pressable>
          </View>
        </Card>

        {/* About */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            ABOUT THIS CIRCLE
          </Text>
          <Text variant="bodySmall" tone="secondary" style={{ lineHeight: 19 }}>
            {circle.description}
          </Text>
          <View style={{ marginTop: space.md, gap: space.sm }}>
            {circle.highlights.map((h, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                <View style={[styles.highlightDot, { backgroundColor: t.successSoft }]}>
                  <Check size={10} color={t.success} strokeWidth={3} />
                </View>
                <Text variant="caption" tone="secondary" style={{ flex: 1, lineHeight: 16 }}>{h}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Rules at a glance */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            RULES AT A GLANCE
          </Text>
          <RuleRow Icon={Banknote} label="Payout method" value={`${cap(circle.payoutMethod)} order`} t={t} />
          <RuleRow Icon={ShieldCheck} label="Emergency Fund" value={`${Math.round(circle.emergencyFundRate * 100)}% surcharge`} sub={`+${formatCurrency(efAmount, circle.currency)}/cycle`} t={t} />
          <RuleRow Icon={Clock} label="Grace period" value={`${circle.gracePeriodDays} days`} t={t} />
          <RuleRow Icon={Calendar} label="Cycle length" value={`${circle.cycleLength} months`} t={t} />
          <RuleRow Icon={Languages} label="Meetings in" value={circle.language === "EN" ? "English" : circle.language} t={t} last />
        </Card>

        {/* Disclosure */}
        <View style={[styles.disclosure, { backgroundColor: t.warningSoft }]}>
          <ShieldCheck size={14} color={t.warning} />
          <Text variant="micro" style={{ color: t.warning, flex: 1, lineHeight: 14 }}>
            You'll need <Text variant="micro" weight="bold" style={{ color: t.warning }}>Enhanced KYC</Text> to join — contribution exceeds CHF 500/month equivalent.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA dock */}
      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flex: 1 }}>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
            YOUR CONTRIBUTION
          </Text>
          <Text variant="bodySmall" weight="bold">
            {formatCurrency(circle.contribution + efAmount, circle.currency)} {circle.cadence.toLowerCase()}
          </Text>
        </View>
        <View style={{ flex: 1.2 }}>
          <Button
            label="Request to join"
            onPress={goJoin}
            fullWidth
            size="lg"
            trailingIcon={<Check size={16} color="#fff" strokeWidth={3} />}
          />
        </View>
      </View>
    </View>
  );
}

function HeroStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>
        {label}
      </Text>
      <Text variant="h3" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
        {value}
      </Text>
      <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{sub}</Text>
    </View>
  );
}

function RuleRow({
  Icon,
  label,
  value,
  sub,
  t,
  last,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  sub?: string;
  t: AppTheme;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.ruleRow,
        last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={[styles.ruleIcon, { backgroundColor: t.bgMuted }]}>
        <Icon size={14} color={t.textSecondary} />
      </View>
      <Text variant="bodySmall" tone="secondary" style={{ flex: 1 }}>{label}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <Text variant="bodySmall" weight="semibold">{value}</Text>
        {sub ? <Text variant="micro" tone="muted">{sub}</Text> : null}
      </View>
    </View>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  matchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  heroSep: {
    width: 1,
    height: 36,
  },
  fillTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  fillFg: {
    height: "100%",
    borderRadius: 5,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.sm,
  },
  ruleIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  ctaDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
