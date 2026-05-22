import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Linking } from "react-native";
import {
  Calendar,
  MapPin,
  Ticket,
  ShieldCheck,
  Share2,
  MessageCircle,
  Check,
  X,
  HelpCircle,
  Clock,
  ChevronRight,
  Crown,
  ExternalLink,
  Bell,
  Sparkles,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader, HeaderIconButton } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

type Rsvp = "yes" | "maybe" | "no";

type Attendee = {
  memberId: string;
  name: string;
  trust: number;
  hue: string | null;
  rsvp: Rsvp;
  rsvpAt: string;
  paid: boolean;
  checkedIn: boolean;
  isMember: boolean;
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("de-CH")}`;
}

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function timeRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleTimeString("en-CH", { hour: "2-digit", minute: "2-digit" })} – ${e.toLocaleTimeString("en-CH", { hour: "2-digit", minute: "2-digit" })}`;
}

function timeSince(iso: string) {
  const diff = NOW - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return `${h}h ago`;
  return "just now";
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - NOW;
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d >= 1) return `${d}d ${h}h`;
  return `${h}h`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function EventDetail() {
  const t = useTheme();
  const e = comms.eventDetail as any;

  const [rsvp, setRsvp] = useState<Rsvp | null>(e.yourRsvp);
  const [followUp, setFollowUp] = useState(false);

  const isSoldOut = e.status === "sold_out" || e.rsvp.yes >= e.capacity;
  const isPast = e.status === "past";
  const countdown = daysUntil(e.date);

  const totalAttending = e.rsvp.yes;
  const capacityPct = Math.min(1, totalAttending / e.capacity);

  const tagline = e.location.kind === "online" ? "Online · live link on RSVP" : e.location.venue;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Event"
        subtitle={e.associationName}
        onBack={() => router.back()}
        trailing={<HeaderIconButton><Share2 size={18} color={t.textPrimary} /></HeaderIconButton>}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero band */}
        <View style={[styles.hero, { backgroundColor: e.accent }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, flexWrap: "wrap" }}>
            <View style={[styles.heroChip, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                {categoryLabel(e.category).toUpperCase()}
              </Text>
            </View>
            {e.isPublic ? (
              <View style={[styles.heroChip, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
                <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>PUBLIC</Text>
              </View>
            ) : (
              <View style={[styles.heroChip, { backgroundColor: "rgba(0,0,0,0.18)" }]}>
                <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>MEMBERS ONLY</Text>
              </View>
            )}
            {countdown ? (
              <View style={[styles.heroChip, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
                <Clock size={10} color="#fff" />
                <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                  IN {countdown.toUpperCase()}
                </Text>
              </View>
            ) : (
              <View style={[styles.heroChip, { backgroundColor: "rgba(0,0,0,0.18)" }]}>
                <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>PAST</Text>
              </View>
            )}
          </View>
          <Text variant="h1" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>{e.title}</Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.92)", marginTop: 4 }}>
            {tagline} · {e.associationCity}
          </Text>
          <View style={[styles.heroFooter, { borderTopColor: "rgba(255,255,255,0.18)" }]}>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>WHEN</Text>
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }} numberOfLines={1}>
                {longDate(e.date)}
              </Text>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)", marginTop: 1 }}>
                {timeRange(e.date, e.endsAt)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 }}>TICKET</Text>
              <Text variant="bodySmall" weight="bold" style={{ color: "#fff", marginTop: 2 }}>
                {e.price === 0 ? "Free" : formatCurrency(e.price, e.currency)}
              </Text>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)", marginTop: 1 }}>
                {totalAttending} of {e.capacity} going
              </Text>
            </View>
          </View>
        </View>

        {/* RSVP segmented */}
        {!isPast ? (
          <View>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              YOUR RSVP
            </Text>
            <View style={[styles.rsvp, { backgroundColor: t.bgMuted }]}>
              <RsvpBtn label="Going"  Icon={Check}        active={rsvp === "yes"}   tone={t.success} onPress={() => setRsvp("yes")} t={t} />
              <RsvpBtn label="Maybe"  Icon={HelpCircle}   active={rsvp === "maybe"} tone={t.warning} onPress={() => setRsvp("maybe")} t={t} />
              <RsvpBtn label="No"     Icon={X}            active={rsvp === "no"}    tone={t.danger}  onPress={() => setRsvp("no")} t={t} />
            </View>
            {isSoldOut && rsvp !== "yes" ? (
              <View style={[styles.note, { backgroundColor: t.dangerSoft }]}>
                <Sparkles size={11} color={t.danger} />
                <Text variant="micro" weight="semibold" style={{ color: t.danger, flex: 1 }}>
                  Sold out — RSVP no will free a spot for the waitlist.
                </Text>
              </View>
            ) : rsvp === "yes" && e.price > 0 ? (
              <View style={[styles.note, { backgroundColor: t.warningSoft }]}>
                <Ticket size={11} color={t.warning} />
                <Text variant="micro" weight="semibold" style={{ color: t.warning, flex: 1 }}>
                  Confirm by paying {formatCurrency(e.price, e.currency)} — RSVP is held for 24 hours.
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[styles.note, { backgroundColor: t.bgMuted }]}>
            <Clock size={11} color={t.textMuted} />
            <Text variant="micro" weight="semibold" tone="secondary" style={{ flex: 1 }}>
              This event has already happened. Check-in is closed.
            </Text>
          </View>
        )}

        {/* About */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            ABOUT
          </Text>
          <Text variant="bodySmall" tone="secondary" style={{ lineHeight: 19 }}>{e.description}</Text>
          {e.tags.length > 0 ? (
            <View style={styles.tagRow}>
              {e.tags.map((tag: string) => (
                <View key={tag} style={[styles.tagPill, { backgroundColor: t.bgMuted }]}>
                  <Text variant="micro" weight="semibold" tone="secondary">{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Card>

        {/* Capacity bar */}
        <Card padded>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1 }}>CAPACITY</Text>
            <Text variant="caption" weight="semibold">
              {totalAttending} / {e.capacity}
            </Text>
          </View>
          <View style={[styles.capTrack, { backgroundColor: t.bgMuted }]}>
            <View style={[styles.capFill, { width: `${capacityPct * 100}%`, backgroundColor: e.accent }]} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: space.sm }}>
            <RsvpStat label="Going"   value={e.rsvp.yes}   color={t.success} t={t} />
            <RsvpStat label="Maybe"   value={e.rsvp.maybe} color={t.warning} t={t} />
            <RsvpStat label="Can't"   value={e.rsvp.no}    color={t.danger}  t={t} />
            <RsvpStat label="Open"    value={Math.max(0, e.capacity - totalAttending)} color={t.textSecondary} t={t} />
          </View>
        </Card>

        {/* Location card */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            WHERE
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={[styles.locIcon, { backgroundColor: t.bgMuted }]}>
              {e.location.kind === "online" ? (
                <ExternalLink size={16} color={t.textPrimary} />
              ) : (
                <MapPin size={16} color={t.textPrimary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold">{e.location.venue}</Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>{e.location.address}</Text>
            </View>
            <Pressable
              style={[styles.locBtn, { backgroundColor: t.primarySoft }]}
              onPress={() => {
                if (e.location.kind === "online" && e.location.onlineUrl) {
                  Linking.openURL(e.location.onlineUrl);
                }
              }}
            >
              <Text variant="micro" weight="bold" tone="accent">
                {e.location.kind === "online" ? "OPEN" : "MAP"}
              </Text>
            </Pressable>
          </View>
        </Card>

        {/* Agenda */}
        {e.agenda?.length ? (
          <Card padded>
            <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
              AGENDA
            </Text>
            {e.agenda.map((row: { id: string; time: string; label: string }, i: number) => (
              <View key={row.id} style={[styles.agRow, i === e.agenda.length - 1 ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                <View style={[styles.agTime, { backgroundColor: t.bgMuted }]}>
                  <Text variant="micro" weight="bold" tone="secondary">{row.time}</Text>
                </View>
                <Text variant="caption" tone="secondary" style={{ flex: 1 }}>{row.label}</Text>
              </View>
            ))}
          </Card>
        ) : null}

        {/* Secretary card */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            HOSTED BY
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Avatar name={e.secretaryName} size="md" hue={e.secretaryHue} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text variant="bodySmall" weight="bold">{e.secretaryName}</Text>
                <View style={[styles.trustPill, { backgroundColor: t.successSoft }]}>
                  <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 0.5 }}>
                    T·{e.secretaryTrust}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Crown size={10} color={t.warning} />
                <Text variant="micro" tone="secondary">
                  Secretary · {e.associationName}
                </Text>
              </View>
            </View>
            <Pressable style={[styles.contactBtn, { backgroundColor: t.bgMuted }]}>
              <MessageCircle size={14} color={t.textPrimary} />
            </Pressable>
          </View>
        </Card>

        {/* Attendees preview */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">Who's coming</Text>
            <Text variant="caption" tone="secondary">{e.attendees.length} confirmed</Text>
          </View>
          <Card padded={false}>
            {e.attendees.slice(0, 4).map((a: Attendee, i: number) => (
              <AttendeeRow key={a.memberId} a={a} t={t} last={i === Math.min(4, e.attendees.length) - 1} />
            ))}
          </Card>
          {e.attendees.length > 4 ? (
            <Pressable style={[styles.seeAll, { backgroundColor: t.bgMuted }]}>
              <Text variant="caption" weight="bold" tone="accent">See all {e.attendees.length} attendees →</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Notify follow-up */}
        <Pressable
          onPress={() => setFollowUp(!followUp)}
          style={[
            styles.notifyToggle,
            {
              backgroundColor: followUp ? t.successSoft : t.surface,
              borderColor: followUp ? t.success : t.border,
              borderWidth: followUp ? 1.5 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: followUp ? t.success : "transparent",
                borderColor: followUp ? t.success : t.borderStrong,
              },
            ]}
          >
            {followUp ? <Check size={11} color="#fff" strokeWidth={3} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold">Notify me of follow-ups</Text>
            <Text variant="micro" tone="secondary" style={{ marginTop: 2 }}>
              Recording, photos, and the secretary's wrap-up note.
            </Text>
          </View>
          <Bell size={16} color={followUp ? t.success : t.textMuted} />
        </Pressable>

        {/* Compliance / privacy note */}
        <View style={[styles.compliance, { backgroundColor: t.bgMuted }]}>
          <ShieldCheck size={12} color={t.textMuted} />
          <Text variant="micro" tone="muted" weight="semibold" style={{ flex: 1, lineHeight: 14 }}>
            Your RSVP and ticket payment are visible to the event secretary and association treasurer only.
          </Text>
        </View>
      </ScrollView>

      {/* CTA dock */}
      {!isPast ? (
        <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
          {rsvp === "yes" && e.price > 0 ? (
            <Button
              label={`Pay ${formatCurrency(e.price, e.currency)} to confirm`}
              fullWidth
              size="lg"
              trailingIcon={<Ticket size={16} color="#fff" />}
            />
          ) : rsvp === "yes" ? (
            <Button
              label="Add to calendar"
              fullWidth
              size="lg"
              trailingIcon={<Calendar size={16} color="#fff" />}
            />
          ) : (
            <Button
              label={isSoldOut ? "Join the waitlist" : "Confirm RSVP"}
              fullWidth
              size="lg"
              disabled={!rsvp}
              trailingIcon={<ChevronRight size={16} color="#fff" />}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

function RsvpBtn({
  label,
  Icon,
  active,
  tone,
  onPress,
  t,
}: {
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  active: boolean;
  tone: string;
  onPress: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.rsvpBtn,
        {
          backgroundColor: active ? tone : t.surface,
          borderColor: active ? tone : "transparent",
        },
      ]}
    >
      <Icon size={14} color={active ? "#fff" : tone} strokeWidth={3} />
      <Text variant="caption" weight="bold" style={{ color: active ? "#fff" : tone }}>
        {label}
      </Text>
    </Pressable>
  );
}

function RsvpStat({ label, value, color, t }: { label: string; value: number; color: string; t: AppTheme }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text variant="caption" weight="bold" style={{ color }}>{value}</Text>
      <Text variant="micro" tone="secondary" weight="semibold">{label}</Text>
    </View>
  );
}

function AttendeeRow({ a, t, last }: { a: Attendee; t: AppTheme; last: boolean }) {
  const meta =
    a.rsvp === "yes"   ? { color: t.success, bg: t.successSoft, label: "GOING" } :
    a.rsvp === "maybe" ? { color: t.warning, bg: t.warningSoft, label: "MAYBE" } :
    { color: t.danger, bg: t.dangerSoft, label: "NO" };
  return (
    <View style={[styles.attRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Avatar name={a.name} size="sm" hue={a.hue ?? undefined} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text variant="caption" weight="bold">{a.name}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{a.trust}</Text>
          </View>
          {!a.isMember ? (
            <View style={[styles.guestPill, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>GUEST</Text>
            </View>
          ) : null}
        </View>
        <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
          RSVP'd {timeSince(a.rsvpAt)}{a.paid ? " · paid" : a.rsvp === "yes" ? " · pending payment" : ""}
        </Text>
      </View>
      <View style={[styles.rsvpPill, { backgroundColor: meta.bg }]}>
        <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>
          {meta.label}
        </Text>
      </View>
    </View>
  );
}

function categoryLabel(c: string) {
  if (c === "agm") return "AGM";
  if (c === "info_session") return "Info session";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

const styles = StyleSheet.create({
  hero: {
    padding: space.lg,
    borderRadius: radius.lg,
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  heroFooter: {
    flexDirection: "row",
    gap: space.md,
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rsvp: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  rsvpBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1.5,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: space.sm,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  capTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  capFill: {
    height: "100%",
    borderRadius: 4,
  },
  locIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  locBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  agRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.sm,
  },
  agTime: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    minWidth: 48,
    alignItems: "center",
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  contactBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  attRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  guestPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  rsvpPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  seeAll: {
    alignItems: "center",
    padding: space.sm,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  notifyToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
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
