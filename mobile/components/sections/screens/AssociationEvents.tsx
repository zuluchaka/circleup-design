import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Plus,
  Filter,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  Check,
  ChevronRight,
  ScanLine,
  Send,
  Crown,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

type Tab = "upcoming" | "past" | "drafts";

type EventRow = {
  id: string;
  title: string;
  description: string;
  associationId: string;
  associationName: string;
  category: string;
  date: string;
  endsAt: string;
  location: { kind: "in_person" | "online"; venue: string; address: string };
  accent: string;
  price: number;
  currency: string;
  capacity: number;
  rsvp: { yes: number; maybe: number; no: number };
  yourRsvp: "yes" | "maybe" | "no" | null;
  status: "draft" | "open" | "sold_out" | "past" | "cancelled";
  bucket: "Today" | "This week" | "Later" | "Past";
  isPublic: boolean;
  checkInOpen: boolean;
  tags: string[];
  secretaryName: string;
};

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" });
}

function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-CH", { hour: "2-digit", minute: "2-digit" });
}

function categoryLabel(c: string) {
  if (c === "agm") return "AGM";
  if (c === "info_session") return "Info session";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function AssociationEvents() {
  const t = useTheme();
  const allEvents = comms.events as EventRow[];
  // Filter by current association — design state uses Geneva Diaspora Circle (ma1)
  const associationId = "ma1";
  const associationName = "Geneva Diaspora Circle";
  const isSecretary = true; // role gated — design preview shows secretary actions

  const [tab, setTab] = useState<Tab>("upcoming");

  const myAssocEvents = allEvents.filter((e) => e.associationId === associationId);
  const upcoming = myAssocEvents.filter((e) => e.status !== "past" && e.status !== "draft");
  const past = myAssocEvents.filter((e) => e.status === "past");

  const visible = tab === "upcoming" ? upcoming : tab === "past" ? past : [];

  // Quick stats
  const totalRsvps = upcoming.reduce((s, e) => s + e.rsvp.yes, 0);
  const totalCapacity = upcoming.reduce((s, e) => s + e.capacity, 0);
  const fillRate = totalCapacity > 0 ? totalRsvps / totalCapacity : 0;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Events"
        subtitle={associationName}
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Filter size={20} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: isSecretary ? 140 : space.xxxl, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Secretary stats hero */}
        {isSecretary ? (
          <View style={[styles.hero, { backgroundColor: t.primary }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Crown size={14} color="rgba(255,255,255,0.85)" />
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
                SECRETARY VIEW
              </Text>
            </View>
            <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>
              {upcoming.length} upcoming · {Math.round(fillRate * 100)}% filled
            </Text>
            <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)", marginTop: 2 }}>
              {totalRsvps} RSVPs across {totalCapacity} seats. Compose invitations from any event.
            </Text>

            <View style={[styles.heroFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
              <FooterStat label="Upcoming" value={String(upcoming.length)} />
              <FooterStat label="Sold out" value={String(upcoming.filter((e) => e.status === "sold_out").length)} />
              <FooterStat label="Past" value={String(past.length)} />
            </View>
          </View>
        ) : null}

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: t.bgMuted }]}>
          <TabBtn label="Upcoming" count={upcoming.length} active={tab === "upcoming"} onPress={() => setTab("upcoming")} t={t} />
          <TabBtn label="Past"     count={past.length}     active={tab === "past"}     onPress={() => setTab("past")} t={t} />
          {isSecretary ? (
            <TabBtn label="Drafts" count={0} active={tab === "drafts"} onPress={() => setTab("drafts")} t={t} />
          ) : null}
        </View>

        {/* Empty state for drafts */}
        {tab === "drafts" ? (
          <View style={[styles.empty, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text variant="bodySmall" weight="bold">No draft events</Text>
            <Text variant="micro" tone="secondary" align="center" style={{ maxWidth: 280, lineHeight: 14 }}>
              Start a new event and save it as a draft to come back later.
            </Text>
          </View>
        ) : visible.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text variant="bodySmall" weight="bold">Nothing to show here yet</Text>
            <Text variant="micro" tone="secondary" align="center" style={{ maxWidth: 280, lineHeight: 14 }}>
              {tab === "upcoming" ? "No upcoming events for this association." : "No past events."}
            </Text>
          </View>
        ) : (
          <View style={{ gap: space.md }}>
            {visible.map((e) => (
              <EventRowCard key={e.id} e={e} isSecretary={isSecretary} t={t} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Secretary CTA dock */}
      {isSecretary && tab !== "drafts" ? (
        <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Pressable
              style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
            >
              <Send size={14} color={t.textPrimary} />
              <Text variant="caption" weight="bold">Announce</Text>
            </Pressable>
            <View style={{ flex: 1 }}>
              <Button
                label="Create event"
                fullWidth
                size="lg"
                trailingIcon={<Plus size={16} color="#fff" />}
              />
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function TabBtn({
  label,
  count,
  active,
  onPress,
  t,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active ? { backgroundColor: t.surface, borderColor: t.border } : null]}
    >
      <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
        {label}
      </Text>
      <View style={[styles.tabCount, { backgroundColor: active ? t.primarySoft : "transparent" }]}>
        <Text variant="micro" weight="bold" style={{ color: active ? t.primary : t.textMuted }}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="caption" weight="bold" style={{ color: "#fff", marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function EventRowCard({ e, isSecretary, t }: { e: EventRow; isSecretary: boolean; t: AppTheme }) {
  const isSoldOut = e.status === "sold_out" || e.rsvp.yes >= e.capacity;
  const isPast = e.status === "past";
  const capacityPct = Math.min(1, e.rsvp.yes / e.capacity);

  return (
    <Pressable
      onPress={() => router.push("/sections/communication-and-events/event-detail" as never)}
      style={[styles.row, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={[styles.rowAccent, { backgroundColor: e.accent }]} />

      <View style={{ flex: 1, padding: space.md, gap: space.sm }}>
        {/* Date column header */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space.md }}>
          {/* Big date block */}
          <View style={[styles.dateBlock, { backgroundColor: `${e.accent}22` }]}>
            <Text variant="micro" weight="bold" style={{ color: e.accent, letterSpacing: 0.6 }}>
              {new Date(e.date).toLocaleDateString("en-CH", { month: "short" }).toUpperCase()}
            </Text>
            <Text variant="h2" weight="bold" style={{ color: e.accent, marginTop: -2 }}>
              {new Date(e.date).getDate()}
            </Text>
            <Text variant="micro" weight="semibold" style={{ color: e.accent }}>
              {formatEventTime(e.date)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <View style={[styles.catPill, { backgroundColor: `${e.accent}22` }]}>
                <Text variant="micro" weight="bold" style={{ color: e.accent, letterSpacing: 0.5 }}>
                  {categoryLabel(e.category).toUpperCase()}
                </Text>
              </View>
              {!e.isPublic ? (
                <View style={[styles.miniPill, { backgroundColor: t.bgMuted }]}>
                  <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>
                    MEMBERS ONLY
                  </Text>
                </View>
              ) : null}
              {isSoldOut ? (
                <View style={[styles.miniPill, { backgroundColor: t.dangerSoft }]}>
                  <Text variant="micro" weight="bold" style={{ color: t.danger, letterSpacing: 0.5 }}>SOLD OUT</Text>
                </View>
              ) : null}
              {e.yourRsvp === "yes" && !isPast ? (
                <View style={[styles.miniPill, { backgroundColor: t.successSoft }]}>
                  <Check size={9} color={t.success} strokeWidth={3} />
                  <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.5 }}>GOING</Text>
                </View>
              ) : null}
            </View>

            <Text variant="bodySmall" weight="bold" style={{ marginTop: 4 }} numberOfLines={2}>{e.title}</Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              {e.location.kind === "online" ? <ExternalLink size={11} color={t.textMuted} /> : <MapPin size={11} color={t.textMuted} />}
              <Text variant="micro" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>
                {e.location.venue}
              </Text>
            </View>
          </View>
        </View>

        {/* Capacity bar */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Users size={10} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">
                {e.rsvp.yes} of {e.capacity}
              </Text>
            </View>
            <Text variant="micro" weight="bold" style={{ color: e.price === 0 ? t.success : t.warning }}>
              {e.price === 0 ? "Free" : `${e.currency} ${e.price}`}
            </Text>
          </View>
          <View style={[styles.bar, { backgroundColor: t.bgMuted }]}>
            <View style={[styles.barFill, { width: `${capacityPct * 100}%`, backgroundColor: e.accent }]} />
          </View>
        </View>

        {/* Secretary actions or member CTA */}
        {isSecretary && !isPast ? (
          <View style={[styles.adminRow, { borderTopColor: t.border }]}>
            <Pressable style={[styles.adminBtn, { backgroundColor: t.primarySoft }]}>
              <Send size={11} color={t.primary} />
              <Text variant="micro" weight="bold" tone="accent">Invite</Text>
            </Pressable>
            <Pressable style={[styles.adminBtn, { backgroundColor: t.bgMuted }]}>
              <Users size={11} color={t.textPrimary} />
              <Text variant="micro" weight="bold">Attendees · {e.rsvp.yes}</Text>
            </Pressable>
            {e.checkInOpen ? (
              <Pressable style={[styles.adminBtn, { backgroundColor: t.warningSoft }]}>
                <ScanLine size={11} color={t.warning} />
                <Text variant="micro" weight="bold" style={{ color: t.warning }}>Check-in</Text>
              </Pressable>
            ) : null}
            <ChevronRight size={14} color={t.textMuted} />
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Clock size={10} color={t.textMuted} />
            <Text variant="micro" tone="muted">
              {formatEventDate(e.date)}
            </Text>
            <ChevronRight size={14} color={t.textMuted} style={{ marginLeft: "auto" }} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  heroFooter: {
    flexDirection: "row",
    gap: space.md,
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabs: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: "center",
  },
  empty: {
    alignItems: "center",
    padding: space.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  rowAccent: {
    width: 4,
  },
  dateBlock: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.sm,
    borderRadius: radius.sm,
  },
  catPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  miniPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  bar: {
    height: 5,
    borderRadius: 2.5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2.5,
  },
  adminRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  adminBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
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
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
