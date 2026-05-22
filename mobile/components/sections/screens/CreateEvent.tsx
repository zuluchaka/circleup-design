import { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StyleSheet, Switch } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Banknote,
  Users,
  Globe2,
  Lock,
  Sparkles,
  Camera,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Button } from "@/components/shared/Button";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import comms from "@/product/sections/06-communication-and-events/data.json";

type Step = 1 | 2 | 3;
type Category = "cultural" | "agm" | "workshop" | "fundraiser" | "meetup" | "info_session" | "social";
type LocationKind = "in_person" | "online";
type Audience = "public" | "all_members" | "circle" | "committee" | "custom";

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Basics" },
  { n: 2, label: "When & where" },
  { n: 3, label: "Tickets & audience" },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "cultural",     label: "Cultural" },
  { id: "agm",          label: "AGM" },
  { id: "workshop",     label: "Workshop" },
  { id: "fundraiser",   label: "Fundraiser" },
  { id: "meetup",       label: "Meetup" },
  { id: "info_session", label: "Info session" },
  { id: "social",       label: "Social" },
];

const ACCENT_PALETTE = ["#10b981", "#4f46e5", "#f59e0b", "#ec4899", "#0ea5e9", "#8b5cf6", "#f43f5e", "#64748b"];

export function CreateEvent() {
  const t = useTheme();
  const draft = comms.createEventDraft as any;

  const [step, setStep] = useState<Step>(1);
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);
  const [category, setCategory] = useState<Category>(draft.category as Category);
  const [accent, setAccent] = useState<string>(draft.accent);
  const [date, setDate] = useState(draft.date);
  const [startTime, setStartTime] = useState(draft.startTime);
  const [endTime, setEndTime] = useState(draft.endTime);
  const [locationKind, setLocationKind] = useState<LocationKind>(draft.locationKind as LocationKind);
  const [venue, setVenue] = useState(draft.venue);
  const [address, setAddress] = useState(draft.address);
  const [onlineUrl, setOnlineUrl] = useState(draft.onlineUrl);
  const [capacity, setCapacity] = useState(draft.capacity);
  const [price, setPrice] = useState(draft.price);
  const [isPublic, setIsPublic] = useState(draft.isPublic);
  const [audience, setAudience] = useState<Audience>(draft.audience as Audience);

  const goBack = () => (step > 1 ? setStep((step - 1) as Step) : router.back());
  const goNext = () => step < 3 && setStep((step + 1) as Step);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="New event"
        subtitle={`Step ${step} of 3 · ${STEPS[step - 1].label}`}
        onBack={goBack}
      />

      {/* Progress dots */}
      <View style={[styles.dots, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        {STEPS.map((s) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <View key={s.n} style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View style={[styles.dot, { backgroundColor: done ? t.success : active ? t.primary : t.bgMuted }]}>
                {done ? (
                  <Check size={10} color="#fff" strokeWidth={3} />
                ) : (
                  <Text variant="micro" weight="bold" style={{ color: active ? "#fff" : t.textMuted }}>{s.n}</Text>
                )}
              </View>
              <Text
                variant="micro"
                weight={active ? "bold" : "semibold"}
                tone={active ? "accent" : done ? "primary" : "muted"}
                style={{ letterSpacing: 0.4, fontSize: 9 }}
              >
                {s.label.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 140, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <Step1Basics
            title={title} setTitle={setTitle}
            description={description} setDescription={setDescription}
            category={category} setCategory={setCategory}
            accent={accent} setAccent={setAccent}
            t={t}
          />
        ) : step === 2 ? (
          <Step2When
            date={date} setDate={setDate}
            startTime={startTime} setStartTime={setStartTime}
            endTime={endTime} setEndTime={setEndTime}
            locationKind={locationKind} setLocationKind={setLocationKind}
            venue={venue} setVenue={setVenue}
            address={address} setAddress={setAddress}
            onlineUrl={onlineUrl} setOnlineUrl={setOnlineUrl}
            t={t}
          />
        ) : (
          <Step3Audience
            capacity={capacity} setCapacity={setCapacity}
            price={price} setPrice={setPrice}
            isPublic={isPublic} setIsPublic={setIsPublic}
            audience={audience} setAudience={setAudience}
            t={t}
          />
        )}
      </ScrollView>

      <View style={[styles.ctaDock, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          {step > 1 ? (
            <Pressable
              onPress={goBack}
              style={[styles.secondaryBtn, { borderColor: t.borderStrong, backgroundColor: t.surface }]}
            >
              <ChevronLeft size={16} color={t.textPrimary} />
              <Text variant="bodySmall" weight="semibold">Back</Text>
            </Pressable>
          ) : null}
          <View style={{ flex: 1 }}>
            <Button
              label={step < 3 ? `Continue to ${STEPS[step].label}` : "Publish event"}
              onPress={step < 3 ? goNext : undefined}
              fullWidth
              size="lg"
              trailingIcon={
                step < 3 ? <ChevronRight size={16} color="#fff" /> : <Check size={16} color="#fff" strokeWidth={3} />
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Basics
// ---------------------------------------------------------------------------

function Step1Basics({
  title, setTitle,
  description, setDescription,
  category, setCategory,
  accent, setAccent,
  t,
}: {
  title: string; setTitle: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  category: Category; setCategory: (v: Category) => void;
  accent: string; setAccent: (v: string) => void;
  t: AppTheme;
}) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Event basics</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Title, what it's about, and a category. You can polish copy after publishing.
        </Text>
      </View>

      <FieldLabel>Title</FieldLabel>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Summer Cultural Festival"
        placeholderTextColor={t.textMuted}
        style={[styles.input, { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border }]}
      />

      <FieldLabel>Description</FieldLabel>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Tell members what to expect, what to bring, who to ask."
        placeholderTextColor={t.textMuted}
        multiline
        maxLength={400}
        style={[styles.input, { minHeight: 110, color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border, textAlignVertical: "top" }]}
      />
      <Text variant="micro" tone="muted" align="right">{description.length}/400</Text>

      <FieldLabel>Category</FieldLabel>
      <View style={styles.catGrid}>
        {CATEGORIES.map((c) => {
          const active = c.id === category;
          return (
            <Pressable
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[
                styles.catTile,
                {
                  backgroundColor: active ? t.primarySoft : t.surface,
                  borderColor: active ? t.primary : t.border,
                  borderWidth: active ? 1.5 : 1,
                },
              ]}
            >
              <Text variant="caption" weight={active ? "bold" : "semibold"} tone={active ? "primary" : "secondary"}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FieldLabel>Accent colour</FieldLabel>
      <View style={[styles.accentRow, { backgroundColor: t.surface, borderColor: t.border }]}>
        {ACCENT_PALETTE.map((hex) => {
          const active = hex === accent;
          return (
            <Pressable
              key={hex}
              onPress={() => setAccent(hex)}
              style={[
                styles.accentDot,
                {
                  backgroundColor: hex,
                  borderColor: active ? t.textPrimary : "transparent",
                  borderWidth: active ? 3 : 0,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Cover preview */}
      <View style={[styles.coverPreview, { backgroundColor: accent }]}>
        <Camera size={14} color="rgba(255,255,255,0.85)" />
        <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 1, marginTop: space.sm }}>
          COVER PREVIEW
        </Text>
        <Text variant="h3" weight="bold" style={{ color: "#fff", marginTop: 2 }} numberOfLines={2}>
          {title || "Event title"}
        </Text>
        <Text variant="micro" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
          {CATEGORIES.find((c) => c.id === category)?.label ?? ""}
        </Text>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — When & where
// ---------------------------------------------------------------------------

function Step2When({
  date, setDate,
  startTime, setStartTime,
  endTime, setEndTime,
  locationKind, setLocationKind,
  venue, setVenue,
  address, setAddress,
  onlineUrl, setOnlineUrl,
  t,
}: {
  date: string; setDate: (v: string) => void;
  startTime: string; setStartTime: (v: string) => void;
  endTime: string; setEndTime: (v: string) => void;
  locationKind: LocationKind; setLocationKind: (v: LocationKind) => void;
  venue: string; setVenue: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  onlineUrl: string; setOnlineUrl: (v: string) => void;
  t: AppTheme;
}) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">When &amp; where</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Pick a date, a window, and either a venue or a meeting link.
        </Text>
      </View>

      <FieldLabel>Date</FieldLabel>
      <View style={[styles.input, { flexDirection: "row", alignItems: "center", gap: space.sm, backgroundColor: t.surface, borderColor: t.border }]}>
        <Calendar size={16} color={t.textSecondary} />
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="2026-06-15"
          placeholderTextColor={t.textMuted}
          style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: space.md }}>
        <View style={{ flex: 1 }}>
          <FieldLabel>Starts</FieldLabel>
          <View style={[styles.input, { flexDirection: "row", alignItems: "center", gap: space.sm, backgroundColor: t.surface, borderColor: t.border }]}>
            <Clock size={16} color={t.textSecondary} />
            <TextInput
              value={startTime}
              onChangeText={setStartTime}
              placeholder="18:30"
              placeholderTextColor={t.textMuted}
              style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FieldLabel>Ends</FieldLabel>
          <View style={[styles.input, { flexDirection: "row", alignItems: "center", gap: space.sm, backgroundColor: t.surface, borderColor: t.border }]}>
            <Clock size={16} color={t.textSecondary} />
            <TextInput
              value={endTime}
              onChangeText={setEndTime}
              placeholder="20:30"
              placeholderTextColor={t.textMuted}
              style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
            />
          </View>
        </View>
      </View>

      <FieldLabel>Location</FieldLabel>
      <View style={[styles.segment, { backgroundColor: t.bgMuted }]}>
        <Pressable
          onPress={() => setLocationKind("in_person")}
          style={[styles.segBtn, locationKind === "in_person" ? { backgroundColor: t.surface, borderColor: t.border } : null]}
        >
          <MapPin size={12} color={locationKind === "in_person" ? t.primary : t.textSecondary} />
          <Text variant="caption" weight={locationKind === "in_person" ? "bold" : "semibold"} tone={locationKind === "in_person" ? "primary" : "secondary"}>
            In person
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setLocationKind("online")}
          style={[styles.segBtn, locationKind === "online" ? { backgroundColor: t.surface, borderColor: t.border } : null]}
        >
          <ExternalLink size={12} color={locationKind === "online" ? t.primary : t.textSecondary} />
          <Text variant="caption" weight={locationKind === "online" ? "bold" : "semibold"} tone={locationKind === "online" ? "primary" : "secondary"}>
            Online
          </Text>
        </Pressable>
      </View>

      {locationKind === "in_person" ? (
        <>
          <FieldLabel>Venue</FieldLabel>
          <TextInput
            value={venue}
            onChangeText={setVenue}
            placeholder="Maison Internationale"
            placeholderTextColor={t.textMuted}
            style={[styles.input, { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border }]}
          />
          <FieldLabel>Address</FieldLabel>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Rue des Pâquis 9, Geneva"
            placeholderTextColor={t.textMuted}
            style={[styles.input, { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border }]}
          />
        </>
      ) : (
        <>
          <FieldLabel>Meeting link</FieldLabel>
          <TextInput
            value={onlineUrl}
            onChangeText={setOnlineUrl}
            placeholder="https://zoom.us/j/…"
            placeholderTextColor={t.textMuted}
            autoCapitalize="none"
            style={[styles.input, { color: t.textPrimary, backgroundColor: t.surface, borderColor: t.border, fontFamily: "Menlo" }]}
          />
          <View style={[styles.disclosure, { backgroundColor: t.infoSoft }]}>
            <ExternalLink size={11} color={t.info} />
            <Text variant="micro" style={{ color: t.info, flex: 1, lineHeight: 14 }}>
              Link is hidden until a member RSVPs Going. Recording can be shared in the follow-up.
            </Text>
          </View>
        </>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Tickets & audience
// ---------------------------------------------------------------------------

function Step3Audience({
  capacity, setCapacity,
  price, setPrice,
  isPublic, setIsPublic,
  audience, setAudience,
  t,
}: {
  capacity: number; setCapacity: (v: number) => void;
  price: number; setPrice: (v: number) => void;
  isPublic: boolean; setIsPublic: (v: boolean) => void;
  audience: Audience; setAudience: (v: Audience) => void;
  t: AppTheme;
}) {
  return (
    <>
      <View>
        <Text variant="h2" weight="bold">Tickets &amp; audience</Text>
        <Text variant="bodySmall" tone="secondary" style={{ marginTop: 4, lineHeight: 19 }}>
          Cap the headcount, set a price (or keep it free), and pick who can see and join.
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: space.md }}>
        <View style={{ flex: 1 }}>
          <FieldLabel>Capacity</FieldLabel>
          <View style={[styles.input, { flexDirection: "row", alignItems: "center", gap: space.sm, backgroundColor: t.surface, borderColor: t.border }]}>
            <Users size={16} color={t.textSecondary} />
            <TextInput
              value={String(capacity)}
              onChangeText={(v) => setCapacity(Math.max(0, parseInt(v.replace(/[^0-9]/g, "") || "0", 10)))}
              keyboardType="number-pad"
              style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
            />
            <Text variant="micro" tone="muted">seats</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FieldLabel>Price</FieldLabel>
          <View style={[styles.input, { flexDirection: "row", alignItems: "center", gap: space.sm, backgroundColor: t.surface, borderColor: t.border }]}>
            <Banknote size={16} color={t.textSecondary} />
            <TextInput
              value={String(price)}
              onChangeText={(v) => setPrice(Math.max(0, parseInt(v.replace(/[^0-9]/g, "") || "0", 10)))}
              keyboardType="number-pad"
              style={{ flex: 1, color: t.textPrimary, fontSize: 14 }}
            />
            <Text variant="micro" tone="muted">CHF</Text>
          </View>
        </View>
      </View>

      {/* Public toggle */}
      <Pressable
        onPress={() => setIsPublic(!isPublic)}
        style={[
          styles.publicCard,
          {
            backgroundColor: isPublic ? t.primarySoft : t.surface,
            borderColor: isPublic ? t.primary : t.border,
            borderWidth: isPublic ? 1.5 : 1,
          },
        ]}
      >
        <View style={[styles.publicIcon, { backgroundColor: isPublic ? "rgba(255,255,255,0.6)" : t.bgMuted }]}>
          {isPublic ? <Globe2 size={18} color={t.primary} /> : <Lock size={18} color={t.textSecondary} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="bold">
            {isPublic ? "Public event" : "Private event"}
          </Text>
          <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>
            {isPublic
              ? "Shows up in Discover for non-members. Anyone can RSVP."
              : "Hidden from Discover. Visible only to the audience you pick below."}
          </Text>
        </View>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
          trackColor={{ false: t.bgMuted, true: t.primarySoft }}
          thumbColor={isPublic ? t.primary : t.textMuted}
        />
      </Pressable>

      <FieldLabel>Audience</FieldLabel>
      <View style={{ gap: space.sm }}>
        <AudienceRow id="public"       title="Public"            body="Listed in Discover. Anyone on the network can find and RSVP." active={audience === "public"}       onSelect={() => setAudience("public")} t={t} />
        <AudienceRow id="all_members"  title="All members"        body="Every member of this association is invited." active={audience === "all_members"}  onSelect={() => setAudience("all_members")} t={t} />
        <AudienceRow id="circle"       title="A specific circle"   body="Members of one circle only — useful for circle-bound socials." active={audience === "circle"}       onSelect={() => setAudience("circle")} t={t} />
        <AudienceRow id="committee"    title="Committee only"     body="Just the board / signers / treasurer chat." active={audience === "committee"}    onSelect={() => setAudience("committee")} t={t} />
        <AudienceRow id="custom"       title="Custom list"        body="Pick specific members or external contacts." active={audience === "custom"}       onSelect={() => setAudience("custom")} t={t} />
      </View>

      <View style={[styles.disclosure, { backgroundColor: t.bgMuted }]}>
        <Sparkles size={11} color={t.textMuted} />
        <Text variant="micro" tone="muted" style={{ flex: 1, lineHeight: 14 }}>
          After publishing you'll be sent to Invite Attendees to compose and send the first invitations.
        </Text>
      </View>
    </>
  );
}

function AudienceRow({
  id,
  title,
  body,
  active,
  onSelect,
  t,
}: {
  id: Audience;
  title: string;
  body: string;
  active: boolean;
  onSelect: () => void;
  t: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.audienceRow,
        {
          backgroundColor: active ? t.primarySoft : t.surface,
          borderColor: active ? t.primary : t.border,
          borderWidth: active ? 1.5 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="bold">{title}</Text>
        <Text variant="micro" tone="secondary" style={{ marginTop: 2, lineHeight: 14 }}>{body}</Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: active ? t.primary : t.borderStrong,
            backgroundColor: active ? t.primary : "transparent",
          },
        ]}
      >
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm, marginTop: space.xs }}>
      {String(children).toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: "row",
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: space.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  catTile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  accentRow: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  accentDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  coverPreview: {
    padding: space.lg,
    borderRadius: radius.lg,
    marginTop: space.sm,
  },
  segment: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
  },
  segBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  publicCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  publicIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  audienceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
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
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
