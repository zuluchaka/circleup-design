import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Calendar,
  Sparkles,
  Trophy,
  Check,
  Clock,
  CircleDashed,
  Download,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type SlotStatus = "Paid" | "Upcoming" | "Projected" | "Skipped";

type PayoutSlot = {
  cycle: number;
  to: string;
  amount: number;
  date: string;
  status: SlotStatus;
};

type Circle = {
  id: string;
  name: string;
  currency: string;
  cadence: string;
  cycle: number;
  cycleLength: number;
  yourPosition?: number;
  emergencyFund: number;
  accent: string;
};

type Filter = "all" | "past" | "upcoming";

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function monthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { month: "short", year: "numeric" });
}

function dayMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

function diffInMonths(future: string, ref: string) {
  const a = new Date(future);
  const b = new Date(ref);
  return (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
}

// ---------------------------------------------------------------------------
// Hero — "Your turn" card
// ---------------------------------------------------------------------------

function YourTurnCard({
  yourSlot,
  totalAmountSoFar,
  circle,
  t,
}: {
  yourSlot: PayoutSlot | undefined;
  totalAmountSoFar: number;
  circle: Circle;
  t: AppTheme;
}) {
  if (!yourSlot) return null;
  const nowIso = "2026-05-22";
  const monthsAway = diffInMonths(yourSlot.date, nowIso);
  return (
    <View style={[styles.heroCard, { backgroundColor: circle.accent }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.sm }}>
        <Trophy size={16} color="#fff" />
        <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
          YOUR TURN
        </Text>
      </View>
      <Text variant="display" weight="bold" style={{ color: "#fff", fontSize: 38, lineHeight: 42 }}>
        {formatCurrency(yourSlot.amount, circle.currency)}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: space.xs }}>
        <Calendar size={12} color="rgba(255,255,255,0.85)" />
        <Text variant="caption" weight="semibold" style={{ color: "rgba(255,255,255,0.92)" }}>
          {monthYear(yourSlot.date)} · Cycle {yourSlot.cycle} of {circle.cycleLength}
        </Text>
      </View>
      <View style={[styles.heroFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
        <View style={{ flex: 1 }}>
          <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
            CONTRIBUTED SO FAR
          </Text>
          <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
            {formatCurrency(totalAmountSoFar, circle.currency)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
            COUNTDOWN
          </Text>
          <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
            {monthsAway > 0 ? `${monthsAway} months away` : "This month"}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// FilterTabs
// ---------------------------------------------------------------------------

function FilterTabs({
  active,
  onChange,
  counts,
  t,
}: {
  active: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
  t: AppTheme;
}) {
  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "past", label: "Past" },
    { id: "upcoming", label: "Upcoming" },
  ];
  return (
    <View style={[styles.tabsRow, { backgroundColor: t.bgMuted }]}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[
              styles.tabBtn,
              isActive ? { backgroundColor: t.surface, borderColor: t.border } : null,
            ]}
          >
            <Text
              variant="caption"
              weight={isActive ? "bold" : "semibold"}
              tone={isActive ? "primary" : "secondary"}
            >
              {tab.label}
            </Text>
            <View style={[styles.tabCount, { backgroundColor: isActive ? t.primarySoft : "transparent" }]}>
              <Text
                variant="micro"
                weight="bold"
                style={{ color: isActive ? t.primary : t.textMuted }}
              >
                {counts[tab.id]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// TimelineRow
// ---------------------------------------------------------------------------

function statusMeta(status: SlotStatus, t: AppTheme): { color: string; bg: string; label: string; Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> } {
  if (status === "Paid") return { color: t.success, bg: t.successSoft, label: "Paid", Icon: Check };
  if (status === "Upcoming") return { color: t.primary, bg: t.primarySoft, label: "Upcoming", Icon: Clock };
  if (status === "Skipped") return { color: t.danger, bg: t.dangerSoft, label: "Skipped", Icon: Clock };
  return { color: t.textMuted, bg: t.bgMuted, label: "Projected", Icon: CircleDashed };
}

function TimelineRow({
  slot,
  isFirst,
  isLast,
  isYou,
  circleAccent,
  currency,
  t,
}: {
  slot: PayoutSlot;
  isFirst: boolean;
  isLast: boolean;
  isYou: boolean;
  circleAccent: string;
  currency: string;
  t: AppTheme;
}) {
  const meta = statusMeta(slot.status, t);
  const dotColor = isYou ? circleAccent : meta.color;
  const cardBg = isYou ? circleAccent : t.surface;
  const labelColor = isYou ? "#fff" : t.textPrimary;
  const subColor = isYou ? "rgba(255,255,255,0.85)" : t.textSecondary;

  return (
    <View style={styles.timelineRow}>
      {/* Rail */}
      <View style={styles.timelineRail}>
        <View
          style={[
            styles.rail,
            {
              backgroundColor: isFirst ? "transparent" : meta.color,
              opacity: slot.status === "Projected" ? 0.35 : 0.7,
            },
          ]}
        />
        <View
          style={[
            styles.dotOuter,
            {
              backgroundColor: isYou ? circleAccent : meta.bg,
              borderColor: dotColor,
              borderWidth: isYou ? 0 : 2,
            },
          ]}
        >
          {slot.status === "Paid" ? (
            <Check size={12} color={isYou ? "#fff" : meta.color} strokeWidth={3} />
          ) : isYou ? (
            <Trophy size={11} color="#fff" />
          ) : (
            <View style={[styles.dotInner, { backgroundColor: dotColor }]} />
          )}
        </View>
        <View
          style={[
            styles.rail,
            {
              backgroundColor: isLast ? "transparent" : meta.color,
              opacity: slot.status === "Projected" ? 0.25 : 0.55,
            },
          ]}
        />
      </View>

      {/* Card */}
      <View
        style={[
          styles.slotCard,
          {
            backgroundColor: cardBg,
            borderColor: isYou ? circleAccent : t.border,
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Text variant="micro" weight="bold" style={{ color: subColor, letterSpacing: 1 }}>
                CYCLE {slot.cycle}
              </Text>
              <View style={[styles.dotSep, { backgroundColor: subColor, opacity: 0.6 }]} />
              <Text variant="micro" weight="semibold" style={{ color: subColor }}>
                {monthYear(slot.date)}
              </Text>
              {isYou ? (
                <View style={[styles.youPill, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
                  <Sparkles size={9} color="#fff" />
                  <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.5 }}>YOUR SLOT</Text>
                </View>
              ) : (
                <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                  <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
                    {meta.label.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 }}>
              <Avatar name={slot.to.replace("You · ", "")} size="sm" hue={isYou ? "rgba(255,255,255,0.18)" : undefined} />
              <View style={{ flex: 1 }}>
                <Text
                  variant="bodySmall"
                  weight="bold"
                  style={{ color: labelColor }}
                  numberOfLines={1}
                >
                  {slot.to}
                </Text>
                <Text variant="micro" style={{ color: subColor, marginTop: 1 }}>
                  Receives on {dayMonth(slot.date)}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text variant="h3" weight="bold" style={{ color: labelColor }}>
              {formatCurrency(slot.amount, currency)}
            </Text>
            <Text variant="micro" style={{ color: subColor, marginTop: 2 }}>
              {slot.status === "Projected" ? "Projected" : "Net payout"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaPayouts() {
  const t = useTheme();
  const circle = (rosca.circles as Circle[])[0]; // Main CHF Circle
  const schedule = rosca.payoutSchedule as PayoutSlot[];

  const [filter, setFilter] = useState<Filter>("all");

  const yourSlot = useMemo(
    () => schedule.find((s) => s.to.toLowerCase().includes("you")),
    [schedule],
  );
  const totalSoFar = useMemo(
    () => schedule.filter((s) => s.status === "Paid").reduce((acc, s) => acc + 200, 0),
    [schedule],
  );

  const counts: Record<Filter, number> = {
    all: schedule.length,
    past: schedule.filter((s) => s.status === "Paid").length,
    upcoming: schedule.filter((s) => s.status !== "Paid").length,
  };

  const visible = useMemo(() => {
    if (filter === "past") return schedule.filter((s) => s.status === "Paid");
    if (filter === "upcoming") return schedule.filter((s) => s.status !== "Paid");
    return schedule;
  }, [filter, schedule]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Payout schedule"
        subtitle={circle.name}
        onBack={() => router.back()}
        trailing={
          <Pressable hitSlop={10}>
            <Download size={20} color={t.textPrimary} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{
          padding: space.lg,
          paddingBottom: space.xxxl,
          gap: space.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <YourTurnCard yourSlot={yourSlot} totalAmountSoFar={totalSoFar} circle={circle} t={t} />

        {/* Summary strip */}
        <View style={[styles.summaryStrip, { backgroundColor: t.surface, borderColor: t.border }]}>
          <SummaryCell label="Rotation" value={`${circle.cycleLength} months`} t={t} />
          <View style={[styles.summarySep, { backgroundColor: t.border }]} />
          <SummaryCell label="Per cycle" value={formatCurrency(circle.cycleLength * 200, circle.currency)} t={t} />
          <View style={[styles.summarySep, { backgroundColor: t.border }]} />
          <SummaryCell label="Next" value={dayMonth(schedule[circle.cycle - 1].date)} t={t} />
        </View>

        <FilterTabs active={filter} onChange={setFilter} counts={counts} t={t} />

        {/* Timeline */}
        <View style={{ gap: 0 }}>
          {visible.map((slot, i) => {
            const isYou = slot.to.toLowerCase().includes("you");
            return (
              <TimelineRow
                key={slot.cycle}
                slot={slot}
                isFirst={i === 0}
                isLast={i === visible.length - 1}
                isYou={isYou}
                circleAccent={circle.accent}
                currency={circle.currency}
                t={t}
              />
            );
          })}
        </View>

        {/* Footnote */}
        <View style={[styles.footnote, { backgroundColor: t.bgMuted }]}>
          <Text variant="micro" tone="secondary" style={{ lineHeight: 14 }}>
            Projected dates and amounts assume full collection. The Emergency Fund covers any shortfall, so payouts go out on time even if a member is late.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryCell({ label, value, t }: { label: string; value: string; t: AppTheme }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  heroFooter: {
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: space.md,
  },
  summaryStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  summarySep: {
    width: 1,
    height: 28,
    marginHorizontal: space.xs,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  timelineRail: {
    width: 32,
    alignItems: "center",
  },
  rail: {
    flex: 1,
    width: 2,
  },
  dotOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slotCard: {
    flex: 1,
    marginVertical: space.xs,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  youPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  dotSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  footnote: {
    padding: space.md,
    borderRadius: radius.md,
  },
});
