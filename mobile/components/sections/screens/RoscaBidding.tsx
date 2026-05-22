import { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet, Switch } from "react-native";
import {
  Clock,
  TrendingUp,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Gavel,
  Trophy,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Bid = {
  bidderId: string;
  bidderInitial: string;
  amount: number;
  isYou: boolean;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - NOW;
  if (diff <= 0) return "Closed";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

export function RoscaBidding() {
  const t = useTheme();
  const data = rosca.bidding as {
    cycle: number;
    payoutAmount: number;
    currency: string;
    deadline: string;
    minimumBid: number;
    yourCurrentBid: number | null;
    yourMaxBid: number;
    transparencyMode: "open" | "blind";
    bids: Bid[];
  };

  const [bid, setBid] = useState(data.yourCurrentBid ?? data.minimumBid);
  const [showOthers, setShowOthers] = useState(data.transparencyMode === "open");

  const sorted = [...data.bids].sort((a, b) => b.amount - a.amount);
  const topBid = sorted[0];
  const yourRank = sorted.findIndex((b) => b.isYou) + 1;
  const isLeading = sorted[0]?.isYou;
  const netPayout = data.payoutAmount - bid;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Bid for the payout"
        subtitle={`Cycle ${data.cycle} · Main CHF Circle`}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Countdown hero */}
        <View style={[styles.hero, { backgroundColor: t.primary }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Gavel size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              BIDDING OPEN
            </Text>
          </View>
          <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 40, lineHeight: 44, marginTop: space.sm }}>
            {timeUntil(data.deadline)}
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
            Closes {new Date(data.deadline).toLocaleString("en-CH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </Text>
          <View style={{ flexDirection: "row", marginTop: space.md, gap: space.md }}>
            <HeroStat label="POT" value={formatCurrency(data.payoutAmount, data.currency)} sub="up for grabs" />
            <View style={[styles.heroSep, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
            <HeroStat label="MIN BID" value={formatCurrency(data.minimumBid, data.currency)} sub="floor for cycle 8" />
          </View>
        </View>

        {/* Your bid */}
        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              YOUR BID
            </Text>
            {isLeading ? (
              <View style={[styles.leadingPill, { backgroundColor: t.successSoft }]}>
                <Trophy size={10} color={t.success} />
                <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.5 }}>LEADING</Text>
              </View>
            ) : (
              <Text variant="micro" tone="muted" weight="semibold">
                Rank #{yourRank || "—"} of {sorted.length}
              </Text>
            )}
          </View>

          <View style={[styles.bidInput, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
              {data.currency}
            </Text>
            <TextInput
              value={String(bid)}
              onChangeText={(v) => setBid(Math.max(0, parseInt(v.replace(/[^0-9]/g, "") || "0", 10)))}
              keyboardType="number-pad"
              style={[styles.bidText, { color: t.textPrimary }]}
            />
          </View>

          {/* Quick raises */}
          <View style={{ flexDirection: "row", gap: 6, marginTop: space.sm }}>
            {[10, 25, 50, 100].map((bump) => (
              <Pressable
                key={bump}
                onPress={() => setBid(Math.min(data.yourMaxBid, bid + bump))}
                style={[styles.bumpChip, { backgroundColor: t.bgMuted }]}
              >
                <TrendingUp size={10} color={t.textPrimary} />
                <Text variant="micro" weight="bold">+{bump}</Text>
              </Pressable>
            ))}
          </View>

          {/* Net payout summary */}
          <View style={[styles.netRow, { borderTopColor: t.border, marginTop: space.md }]}>
            <Text variant="caption" tone="secondary" style={{ flex: 1 }}>If you win this cycle</Text>
            <Text variant="bodySmall" weight="bold" style={{ color: t.success }}>
              Net payout {formatCurrency(netPayout, data.currency)}
            </Text>
          </View>
          <Text variant="micro" tone="muted" style={{ marginTop: 4 }}>
            Your bid is added to the pot for the others.
          </Text>

          {bid > data.yourMaxBid ? (
            <View style={[styles.warn, { backgroundColor: t.dangerSoft }]}>
              <AlertTriangle size={12} color={t.danger} />
              <Text variant="micro" weight="semibold" style={{ color: t.danger, flex: 1 }}>
                Bid exceeds your max of {formatCurrency(data.yourMaxBid, data.currency)}
              </Text>
            </View>
          ) : null}
        </Card>

        {/* Transparency toggle */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={[styles.eyeIcon, { backgroundColor: t.bgMuted }]}>
              {showOthers ? <Eye size={16} color={t.textSecondary} /> : <EyeOff size={16} color={t.textSecondary} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold">Show other bids</Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
                Circle setting is {data.transparencyMode === "open" ? "open" : "blind"} — you control your own view.
              </Text>
            </View>
            <Switch
              value={showOthers}
              onValueChange={setShowOthers}
              trackColor={{ false: t.bgMuted, true: t.primarySoft }}
              thumbColor={showOthers ? t.primary : t.textMuted}
            />
          </View>
        </Card>

        {/* Current bids */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Current bids</Text>
            <Text variant="caption" tone="secondary">{sorted.length} bidders</Text>
          </View>
          <Card padded={false}>
            {sorted.map((b, i) => {
              const isLast = i === sorted.length - 1;
              const isTop = i === 0;
              const hidden = !showOthers && !b.isYou;
              return (
                <View
                  key={b.bidderId}
                  style={[
                    styles.bidRow,
                    isLast ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth },
                    b.isYou ? { backgroundColor: t.primarySoft } : null,
                  ]}
                >
                  <View style={[styles.rankPill, { backgroundColor: isTop ? t.successSoft : t.bgMuted }]}>
                    <Text variant="micro" weight="bold" style={{ color: isTop ? t.success : t.textSecondary }}>
                      #{i + 1}
                    </Text>
                  </View>
                  <Avatar name={b.bidderInitial + " ?"} size="sm" hue={b.isYou ? t.primary : undefined} />
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" weight="bold">
                      {b.isYou ? "You · Aminata" : `Member ${b.bidderInitial}.`}
                    </Text>
                    {isTop ? (
                      <Text variant="micro" weight="semibold" style={{ color: t.success, marginTop: 1 }}>
                        Top bid
                      </Text>
                    ) : null}
                  </View>
                  <Text variant="bodySmall" weight="bold" style={{ color: b.isYou ? t.primary : t.textPrimary }}>
                    {hidden ? "•••" : formatCurrency(b.amount, data.currency)}
                  </Text>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
          <Clock size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted">
            You can change or withdraw your bid until {new Date(data.deadline).toLocaleString("en-CH", { hour: "2-digit", minute: "2-digit" })}.
          </Text>
        </View>
        <Button
          label={data.yourCurrentBid === bid ? "Bid placed" : `Submit bid · ${formatCurrency(bid, data.currency)}`}
          fullWidth
          size="lg"
          disabled={data.yourCurrentBid === bid}
          trailingIcon={<Check size={18} color="#fff" strokeWidth={3} />}
        />
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
      <Text variant="h3" weight="bold" style={{ color: "#fff", marginTop: 2 }}>{value}</Text>
      <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  heroSep: {
    width: 1,
    height: 36,
  },
  leadingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  bidInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bidText: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
    padding: 0,
  },
  bumpChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  netRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  warn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  eyeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  bidRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
  },
  rankPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    minWidth: 28,
    alignItems: "center",
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
