import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Switch } from "react-native";
import {
  Bell,
  Sparkles,
  ListOrdered,
  UserCheck,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type WaitlistEntry = {
  circleId: string;
  position: number;
  totalAhead: number;
  joinedAt: string;
  expectedPromotion: string;
  notifyOnPromotion: boolean;
};

type PublicCircle = {
  id: string;
  name: string;
  associationName: string;
  contribution: number;
  currency: string;
  cadence: string;
  members: number;
  maxMembers: number;
  cycleLength: number;
  startsOn: string;
  accent: string;
};

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "long", year: "numeric" });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short" });
}

function daysSince(iso: string) {
  const now = new Date("2026-05-22").getTime();
  const then = new Date(iso).getTime();
  return Math.max(0, Math.round((now - then) / 86400000));
}

export function RoscaWaitlist() {
  const t = useTheme();
  const entry = rosca.waitlistEntry as WaitlistEntry;
  const circle = (rosca.publicCircles as PublicCircle[]).find((c) => c.id === entry.circleId)!;
  const [notify, setNotify] = useState(entry.notifyOnPromotion);

  const queue = Array.from({ length: entry.position }, (_, i) => ({
    pos: i + 1,
    isYou: i + 1 === entry.position,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="On the waitlist"
        subtitle={circle.name}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Position hero */}
        <View style={[styles.hero, { backgroundColor: circle.accent }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ListOrdered size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              YOUR POSITION
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8, marginTop: space.sm }}>
            <Text style={{ fontSize: 72, lineHeight: 78, fontWeight: "700", color: "#fff" }}>
              #{entry.position}
            </Text>
            <Text variant="h2" weight="semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
              of {entry.totalAhead + entry.position - 1 + 1}
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.9)", marginTop: space.xs }}>
            {entry.totalAhead === 0
              ? "You're next when a spot opens."
              : `${entry.totalAhead} ${entry.totalAhead === 1 ? "person is" : "people are"} ahead of you.`}
          </Text>
          <View style={[styles.heroFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
                JOINED
              </Text>
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
                {daysSince(entry.joinedAt)} days ago
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
                EXPECTED
              </Text>
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
                {shortDate(entry.expectedPromotion)}
              </Text>
            </View>
          </View>
        </View>

        {/* Queue visualization */}
        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>
              THE QUEUE
            </Text>
            <Text variant="micro" tone="secondary">
              {entry.position === 1 ? "Front of the line" : `${entry.position - 1} ahead, then you`}
            </Text>
          </View>
          <View style={styles.queueRow}>
            {queue.map((q) => (
              <View
                key={q.pos}
                style={[
                  styles.queueDot,
                  q.isYou
                    ? { backgroundColor: circle.accent, transform: [{ scale: 1.4 }] }
                    : { backgroundColor: t.bgMuted },
                ]}
              />
            ))}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
            <Text variant="micro" tone="muted" weight="semibold">Front</Text>
            <Text variant="micro" tone="muted" weight="semibold">↑ you</Text>
          </View>
        </Card>

        {/* Circle summary */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            CIRCLE
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.md }}>
            <View style={[styles.circleDot, { backgroundColor: circle.accent }]} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold">{circle.name}</Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{circle.associationName}</Text>
            </View>
          </View>
          <View style={styles.summaryGrid}>
            <SummaryItem label="Contribution" value={formatCurrency(circle.contribution, circle.currency)} sub={circle.cadence.toLowerCase()} t={t} />
            <View style={[styles.summarySep, { backgroundColor: t.border }]} />
            <SummaryItem label="Members" value={`${circle.members} / ${circle.maxMembers}`} sub="circle is full" t={t} />
            <View style={[styles.summarySep, { backgroundColor: t.border }]} />
            <SummaryItem label="Starts" value={shortDate(circle.startsOn)} sub={fullDate(circle.startsOn).split(" ").pop()} t={t} />
          </View>
        </Card>

        {/* How spots open */}
        <View style={[styles.howCard, { backgroundColor: t.infoSoft }]}>
          <View style={[styles.howIcon, { backgroundColor: t.surface }]}>
            <Sparkles size={14} color={t.info} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" style={{ color: t.info }}>
              How spots open up
            </Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
              When a confirmed member declines or is removed before the circle starts, the next person on the waitlist is promoted automatically.
            </Text>
          </View>
        </View>

        {/* Notification toggle */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <View style={[styles.toggleIcon, { backgroundColor: t.bgMuted }]}>
              <Bell size={16} color={t.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="semibold">Notify me on promotion</Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
                Push + email when a spot opens for you.
              </Text>
            </View>
            <Switch
              value={notify}
              onValueChange={setNotify}
              trackColor={{ false: t.bgMuted, true: t.primarySoft }}
              thumbColor={notify ? t.primary : t.textMuted}
            />
          </View>
        </Card>

        {/* Actions */}
        <View style={{ gap: space.sm }}>
          <Pressable style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}>
            <UserCheck size={16} color={t.textPrimary} />
            <Text variant="bodySmall" weight="semibold">View other circles in this association</Text>
          </Pressable>
          <Pressable style={[styles.secondaryBtn, { borderColor: t.dangerSoft, backgroundColor: t.surface }]}>
            <Text variant="bodySmall" weight="semibold" tone="danger">Leave waitlist</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryItem({
  label,
  value,
  sub,
  t,
}: {
  label: string;
  value: string;
  sub?: string;
  t: AppTheme;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodySmall" weight="bold" style={{ marginTop: 2 }}>{value}</Text>
      {sub ? <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
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
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: space.sm,
  },
  queueDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  circleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  summaryGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  summarySep: {
    width: 1,
    height: 32,
  },
  howCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  howIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
