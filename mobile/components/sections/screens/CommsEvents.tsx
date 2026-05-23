import { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  Plus,
  Clock,
  CheckCircle2,
  CircleHelp,
  Sparkles,
  Filter as FilterIcon,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Avatar } from "@/components/shared/Avatar";
import { StatChip } from "@/components/shared/StatChip";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, palette } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

type Event = (typeof comms.events)[number];
type Bucket = "Today" | "This week" | "Later" | "Past";
type Filter = "All" | "Going" | "Maybe" | "Free" | "Paid";

const BUCKET_ORDER: Bucket[] = ["Today", "This week", "Later", "Past"];
const FILTERS: Filter[] = ["All", "Going", "Maybe", "Free", "Paid"];

// Anchor "now" so Today's events show plausible countdowns against the static demo data.
const NOW = new Date("2026-05-22T14:30:00");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startsIn(date: string): string {
  const target = new Date(date);
  const diff = (target.getTime() - NOW.getTime()) / 1000;
  if (diff < -1800) return "Ended";
  if (diff < 0) return "Live now";
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  if (hours <= 0) return `Starts in ${minutes}m`;
  if (hours < 6) return `Starts in ${hours}h ${minutes.toString().padStart(2, "0")}m`;
  return `Starts in ${hours}h`;
}

function fmtDate(iso: string, withTime = true): string {
  const d = new Date(iso);
  const date = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  if (!withTime) return date;
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${date} · ${hh}:${mm}`;
}

function matchesFilter(ev: Event, f: Filter): boolean {
  if (f === "All") return true;
  if (f === "Going") return ev.yourRsvp === "yes";
  if (f === "Maybe") return ev.yourRsvp === "maybe";
  if (f === "Free") return ev.price === 0;
  if (f === "Paid") return ev.price > 0;
  return true;
}

export function CommsEvents() {
  const t = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");

  const events = comms.events as Event[];

  const grouped = useMemo(() => {
    const filtered = events.filter((e) => matchesFilter(e, filter));
    const buckets: Record<Bucket, Event[]> = {
      Today: [],
      "This week": [],
      Later: [],
      Past: [],
    };
    for (const ev of filtered) {
      const key = (ev.bucket as Bucket) ?? "Later";
      if (buckets[key]) buckets[key].push(ev);
    }
    return buckets;
  }, [events, filter]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      going: events.filter((e) => e.yourRsvp === "yes").length,
      today: events.filter((e) => e.bucket === "Today").length,
    };
  }, [events]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Events"
        subtitle={`${stats.today} today · ${stats.going} going`}
        onBack={() => router.back()}
        trailing={
          <HeaderIconButton
            onPress={() => router.push("/sections/communication-and-events/create-event")}
          >
            <Plus size={20} color={t.textPrimary} />
          </HeaderIconButton>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View style={{ paddingHorizontal: space.lg, paddingTop: space.md, gap: space.md }}>
          <View
            style={[
              styles.summary,
              { backgroundColor: t.surface, borderColor: t.border },
            ]}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="caption" weight="semibold" tone="muted">
                NEXT UP
              </Text>
              {grouped.Today[0] ? (
                <>
                  <Text variant="body" weight="bold" numberOfLines={1}>
                    {grouped.Today[0].title}
                  </Text>
                  <Text variant="bodySmall" tone="secondary" numberOfLines={1}>
                    {grouped.Today[0].associationName}
                  </Text>
                </>
              ) : (
                <Text variant="body" weight="semibold" tone="secondary">
                  No events today
                </Text>
              )}
            </View>
            {grouped.Today[0] ? (
              <View
                style={[
                  styles.countdown,
                  { backgroundColor: (grouped.Today[0].accent ?? t.primary) + "22" },
                ]}
              >
                <Clock size={14} color={grouped.Today[0].accent ?? t.primary} />
                <Text
                  variant="caption"
                  weight="bold"
                  style={{ color: grouped.Today[0].accent ?? t.primary }}
                >
                  {startsIn(grouped.Today[0].date)}
                </Text>
              </View>
            ) : (
              <Sparkles size={20} color={t.textMuted} />
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: space.lg,
            paddingTop: space.md,
            gap: space.sm,
          }}
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? t.primary : t.surface,
                    borderColor: active ? t.primary : t.border,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  weight="semibold"
                  style={{ color: active ? "#fff" : t.textSecondary }}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            style={[
              styles.filterChip,
              { backgroundColor: t.surface, borderColor: t.border, flexDirection: "row", gap: 4 },
            ]}
          >
            <FilterIcon size={12} color={t.textSecondary} />
            <Text variant="caption" weight="semibold" tone="secondary">
              More
            </Text>
          </Pressable>
        </ScrollView>

        {BUCKET_ORDER.map((bucket) => {
          const rows = grouped[bucket];
          if (rows.length === 0) return null;
          return (
            <View key={bucket} style={{ marginTop: space.md }}>
              <View style={styles.sectionHead}>
                <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 0.6 }}>
                  {bucket.toUpperCase()} · {rows.length}
                </Text>
                {bucket === "Today" && rows.length > 0 ? (
                  <View style={[styles.liveDot, { backgroundColor: palette.rose[500] }]} />
                ) : null}
              </View>

              {rows.map((ev) => {
                const isPast = ev.status === "past" || bucket === "Past";
                const isSoldOut = ev.status === "sold_out";
                const accent = ev.accent ?? t.primary;
                const venue = ev.location.kind === "online" ? "Online" : ev.location.venue;
                const VenueIcon = ev.location.kind === "online" ? Globe : MapPin;
                const capacityPct = Math.round((ev.rsvp.yes / ev.capacity) * 100);
                return (
                  <Pressable
                    key={ev.id}
                    onPress={() => router.push("/sections/communication-and-events/event-detail")}
                    style={[
                      styles.card,
                      {
                        backgroundColor: t.surface,
                        borderColor: t.border,
                        opacity: isPast ? 0.7 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.accentStripe, { backgroundColor: accent }]} />
                    <View style={{ flex: 1, padding: space.md, gap: 6 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <View style={[styles.dateBadge, { backgroundColor: accent + "1f" }]}>
                          <Calendar size={12} color={accent} />
                          <Text variant="micro" weight="bold" style={{ color: accent }}>
                            {bucket === "Today" ? startsIn(ev.date) : fmtDate(ev.date)}
                          </Text>
                        </View>
                        {ev.yourRsvp === "yes" ? (
                          <View style={[styles.rsvpPill, { backgroundColor: t.successSoft }]}>
                            <CheckCircle2 size={11} color={t.success} />
                            <Text variant="micro" weight="bold" style={{ color: t.success }}>
                              Going
                            </Text>
                          </View>
                        ) : ev.yourRsvp === "maybe" ? (
                          <View style={[styles.rsvpPill, { backgroundColor: t.warningSoft }]}>
                            <CircleHelp size={11} color={t.warning} />
                            <Text variant="micro" weight="bold" style={{ color: t.warning }}>
                              Maybe
                            </Text>
                          </View>
                        ) : null}
                        {isSoldOut ? (
                          <StatChip label="Sold out" tone="danger" compact />
                        ) : null}
                      </View>

                      <Text variant="body" weight="bold" numberOfLines={2}>
                        {ev.title}
                      </Text>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Avatar
                          name={ev.associationName}
                          hue={ev.secretaryHue ?? undefined}
                          size="xs"
                        />
                        <Text variant="caption" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>
                          {ev.associationName}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <VenueIcon size={12} color={t.textMuted} />
                        <Text variant="caption" tone="muted" numberOfLines={1} style={{ flex: 1 }}>
                          {venue} · {ev.associationCity}
                        </Text>
                      </View>

                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Users size={12} color={t.textMuted} />
                          <Text variant="micro" tone="secondary">
                            {ev.rsvp.yes}/{ev.capacity}
                          </Text>
                        </View>
                        <View style={[styles.capacityTrack, { backgroundColor: t.bgMuted }]}>
                          <View
                            style={[
                              styles.capacityFill,
                              {
                                width: `${Math.min(capacityPct, 100)}%`,
                                backgroundColor: accent,
                              },
                            ]}
                          />
                        </View>
                        {ev.price > 0 ? (
                          <View
                            style={[styles.priceChip, { backgroundColor: t.bgMuted, borderColor: t.border }]}
                          >
                            <Text variant="micro" weight="bold" tone="secondary">
                              {ev.currency} {ev.price}
                            </Text>
                          </View>
                        ) : (
                          <Text variant="micro" weight="bold" tone="success">
                            Free
                          </Text>
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={() => router.push("/sections/communication-and-events/create-event")}
        style={[styles.fab, { backgroundColor: t.primary, shadowColor: t.shadow }]}
      >
        <Plus size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  countdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  filterChip: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xs,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    flexDirection: "row",
    marginHorizontal: space.lg,
    marginTop: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  accentStripe: {
    width: 4,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  rsvpPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  capacityTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  capacityFill: {
    height: "100%",
  },
  priceChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  fab: {
    position: "absolute",
    right: space.lg,
    bottom: space.xl,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
