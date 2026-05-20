import { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import {
  Search as SearchIcon,
  Sparkles,
  Star,
  Users,
  Coins,
  Globe,
  Lock,
  ChevronRight,
  BadgeCheck,
  Languages,
  MapPin,
  Heart,
  CircleDot,
  Building2,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
} from "lucide-react-native";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";
import { CURRENT_USER } from "@/data/currentUser";
import {
  BR_STATUS_FILTERS,
  BR_TIER_FILTERS,
  BR_RISK_FILTERS,
  RELATIONSHIPS,
  type BrStatus,
  type BrTier,
} from "@/data/businessRelationships";
import { RelationshipCard } from "@/components/shared/RelationshipCard";

// CURRENT_USER + BR data are imported from `data/` so they can be reused by
// the bottom-nav BR tab without duplicate state.

// ============================================================================
// ASSOCIATIONS DATA
// ============================================================================

type AssocType = "cultural" | "religious" | "professional" | "savings" | "social" | "family";

type EligibilityCheckStatus = "passed" | "warning" | "failed" | "manual";

type EligibilityCheck = {
  id: string;
  label: string;
  status: EligibilityCheckStatus;
  detail?: string;
};

type DiscoverableAssociation = {
  id: string;
  name: string;
  description: string;
  type: AssocType;
  logo: string;
  country: string;
  language: string;
  memberCount: number;
  activeCircles: number;
  isVerified: boolean;
  matchScore?: number;
  matchReasons?: string[];
  /** Current user's eligibility against this association's rules. */
  eligibilityPreview?: EligibilityCheck[];
};

const ASSOC_TYPE_LABEL: Record<AssocType, string> = {
  cultural: "Cultural",
  religious: "Religious",
  professional: "Professional",
  savings: "Savings",
  social: "Social",
  family: "Family",
};

const ASSOC_TYPE_FILTERS: { value: AssocType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "cultural", label: "Cultural" },
  { value: "professional", label: "Professional" },
  { value: "savings", label: "Savings" },
  { value: "religious", label: "Religious" },
  { value: "social", label: "Social" },
  { value: "family", label: "Family" },
];

const ASSOCIATIONS: DiscoverableAssociation[] = [
  {
    id: "a1",
    name: "Senegalese Union of Switzerland",
    description:
      "The umbrella organisation for Senegalese living in Switzerland. We organise tontines, cultural events, and youth mentoring.",
    type: "cultural",
    logo: "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=200&h=200&fit=crop",
    country: "Switzerland",
    language: "fr",
    memberCount: 1240,
    activeCircles: 18,
    isVerified: true,
    matchScore: 96,
    matchReasons: ["Your community", "Trusted organizer"],
    eligibilityPreview: [
      { id: "kyc", label: "Identity verified (KYC)", status: "passed", detail: "Your PostFinance ID is verified" },
      { id: "language", label: "Speaks French or Wolof", status: "passed", detail: "Profile language: French, English" },
      { id: "geo", label: "Resides in Switzerland", status: "passed", detail: "Geneva address on file" },
      { id: "duplicate", label: "Not already a member", status: "passed" },
    ],
  },
  {
    id: "a2",
    name: "Latina Tanda Network",
    description:
      "Latin American women's network running tandas, mentorship circles, and entrepreneurship programmes across French-speaking Switzerland.",
    type: "savings",
    logo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    country: "Switzerland",
    language: "es",
    memberCount: 480,
    activeCircles: 11,
    isVerified: true,
    matchScore: 88,
    matchReasons: ["Matches your language"],
  },
  {
    id: "a3",
    name: "Indian Professionals Zurich",
    description:
      "Tech and finance professionals from India and Pakistan. Career mentoring, chit funds, and tax planning workshops.",
    type: "professional",
    logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop",
    country: "Switzerland",
    language: "en",
    memberCount: 620,
    activeCircles: 9,
    isVerified: true,
    eligibilityPreview: [
      { id: "kyc", label: "Identity verified (KYC)", status: "passed" },
      { id: "trust", label: "Trust Score ≥ 700", status: "passed", detail: "Your Trust Score is 712" },
      { id: "geo", label: "Resides in Zürich canton", status: "warning", detail: "Your address is in Geneva — chapter reviews cross-canton on a case basis" },
      { id: "referral", label: "Referred by active member", status: "manual", detail: "Mention a referrer in your message if you have one" },
    ],
  },
  {
    id: "a4",
    name: "Filipino Community Basel",
    description:
      "Family-friendly community running paluwagans, weekly mass, and bayanihan support drives for newcomers.",
    type: "religious",
    logo: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=200&h=200&fit=crop",
    country: "Switzerland",
    language: "tl",
    memberCount: 290,
    activeCircles: 5,
    isVerified: false,
    eligibilityPreview: [
      { id: "kyc", label: "Identity verified (KYC)", status: "passed" },
      { id: "language", label: "Speaks Tagalog", status: "failed", detail: "Tagalog not declared on your profile — required for membership" },
      { id: "geo", label: "Resides in Basel region", status: "warning", detail: "Geneva address — federation referral possible" },
      { id: "referral", label: "Sponsored by a current member", status: "failed", detail: "No sponsor on file" },
    ],
  },
  {
    id: "a5",
    name: "Caribbean Welfare Society",
    description:
      "Caribbean diaspora welfare association: sou-sou circles, emergency fund, and quarterly social gatherings.",
    type: "social",
    logo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
    country: "Switzerland",
    language: "en",
    memberCount: 175,
    activeCircles: 4,
    isVerified: true,
  },
];

// ============================================================================
// CIRCLES DATA
// ============================================================================

type Frequency = "weekly" | "bi_weekly" | "monthly";
type Status = "forming" | "active" | "completed";

type DiscoverableCircle = {
  id: string;
  name: string;
  organizerName: string;
  organizerTrustScore: number;
  description: string;
  status: Status;
  visibility: "public" | "invite";
  frequency: Frequency;
  contributionAmount: number;
  currency: "CHF" | "EUR" | "USD";
  currentParticipants: number;
  maxParticipants: number;
  community: string;
  accent: [string, string];
  matchScore?: number;
  matchReasons?: string[];
};

const FREQ_LABEL: Record<Frequency, string> = {
  weekly: "Weekly",
  bi_weekly: "Bi-weekly",
  monthly: "Monthly",
};

const STATUS_FILTERS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "forming", label: "Forming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const FREQ_FILTERS: { value: Frequency | "all"; label: string }[] = [
  { value: "all", label: "Any pace" },
  { value: "weekly", label: "Weekly" },
  { value: "bi_weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const CIRCLES: DiscoverableCircle[] = [
  {
    id: "c1",
    name: "Geneva Diaspora Circle",
    organizerName: "Aminata Diallo",
    organizerTrustScore: 945,
    description:
      "12-member tontine for the Senegalese community. CHF 500/month, monthly payouts of CHF 6,000.",
    status: "forming",
    visibility: "public",
    frequency: "monthly",
    contributionAmount: 500,
    currency: "CHF",
    currentParticipants: 9,
    maxParticipants: 12,
    community: "Senegalese · Geneva",
    accent: [palette.indigo[500], palette.amber[400]],
    matchScore: 96,
    matchReasons: ["Your community", "Trusted organizer"],
  },
  {
    id: "c2",
    name: "Latina Tanda Lausanne",
    organizerName: "Carlos Mendoza",
    organizerTrustScore: 890,
    description:
      "Active tanda with verified members. Bi-weekly contributions, fast rotation, vetted by community.",
    status: "active",
    visibility: "invite",
    frequency: "bi_weekly",
    contributionAmount: 250,
    currency: "CHF",
    currentParticipants: 10,
    maxParticipants: 10,
    community: "Latino · Lausanne",
    accent: [palette.emerald[500], palette.sky[500]],
  },
  {
    id: "c3",
    name: "Indian Chit Fund Zurich",
    organizerName: "Priya Sharma",
    organizerTrustScore: 920,
    description:
      "Bidding-style chit fund for South Asian professionals. Monthly auctions, transparent ledger.",
    status: "active",
    visibility: "public",
    frequency: "monthly",
    contributionAmount: 1000,
    currency: "CHF",
    currentParticipants: 12,
    maxParticipants: 12,
    community: "South Asian · Zurich",
    accent: [palette.amber[500], palette.rose[500]],
  },
  {
    id: "c4",
    name: "Welfare Booster Bern",
    organizerName: "Fatou Ndiaye",
    organizerTrustScore: 870,
    description:
      "Mixed welfare circle covering emergencies, schooling, and shared fund. Newcomers welcome.",
    status: "forming",
    visibility: "public",
    frequency: "monthly",
    contributionAmount: 50,
    currency: "CHF",
    currentParticipants: 7,
    maxParticipants: 24,
    community: "West African · Bern",
    accent: [palette.sky[500], palette.indigo[500]],
    matchScore: 82,
    matchReasons: ["Low commitment"],
  },
  {
    id: "c5",
    name: "Filipino Paluwagan Basel",
    organizerName: "Marisol Reyes",
    organizerTrustScore: 815,
    description:
      "Weekly paluwagan with 8 members. CHF 100 a week — perfect for small short-term goals.",
    status: "forming",
    visibility: "public",
    frequency: "weekly",
    contributionAmount: 100,
    currency: "CHF",
    currentParticipants: 5,
    maxParticipants: 8,
    community: "Filipino · Basel",
    accent: [palette.rose[500], palette.amber[400]],
    matchScore: 88,
    matchReasons: ["Fits your budget"],
  },
  {
    id: "c6",
    name: "Caribbean Sou-Sou Geneva",
    organizerName: "Marie-Claire Dupont",
    organizerTrustScore: 860,
    description:
      "Traditional sou-sou with 15 members. Long-running circle now opening 2 spots.",
    status: "active",
    visibility: "public",
    frequency: "monthly",
    contributionAmount: 300,
    currency: "CHF",
    currentParticipants: 13,
    maxParticipants: 15,
    community: "Caribbean · Geneva",
    accent: [palette.emerald[500], palette.indigo[500]],
  },
];

// ============================================================================
// Helpers
// ============================================================================

function statusStyle(s: Status, t: AppTheme) {
  switch (s) {
    case "forming":
      return { dot: t.warning, bg: t.warningSoft, fg: t.warning, label: "Forming" };
    case "active":
      return { dot: t.success, bg: t.successSoft, fg: t.success, label: "Active" };
    case "completed":
      return { dot: t.textMuted, bg: t.bgMuted, fg: t.textSecondary, label: "Completed" };
  }
}

// ============================================================================
// Sub-components
// ============================================================================

function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; count: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const t = useTheme();
  return (
    <View style={[styles.segmentWrap, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              selected && { backgroundColor: t.bgElevated, shadowColor: t.shadow },
            ]}
          >
            <Text
              variant="bodySmall"
              weight={selected ? "bold" : "medium"}
              style={{ color: selected ? t.textPrimary : t.textSecondary }}
            >
              {opt.label}
            </Text>
            <View
              style={[
                styles.countPill,
                { backgroundColor: selected ? t.primary : t.border },
              ]}
            >
              <Text
                variant="micro"
                weight="bold"
                style={{ color: selected ? t.primaryOn : t.textSecondary }}
              >
                {opt.count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function FilterChips<T extends string>({
  options,
  value,
  onChange,
  variant = "primary",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  variant?: "primary" | "secondary";
}) {
  const t = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        const activeBg = variant === "primary" ? t.primary : t.accent;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? activeBg : t.bgElevated,
                borderColor: selected ? activeBg : t.border,
              },
            ]}
          >
            <Text
              variant="caption"
              weight="semibold"
              style={{ color: selected ? "#fff" : t.textSecondary }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ----- Association card -----

function AssociationCard({
  assoc,
  t,
  onRequestToJoin,
}: {
  assoc: DiscoverableAssociation;
  t: AppTheme;
  onRequestToJoin: (assoc: DiscoverableAssociation) => void;
}) {
  return (
    <Pressable style={[styles.assocCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", gap: space.md }}>
        <Image source={{ uri: assoc.logo }} style={styles.assocLogo} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text variant="h3" weight="semibold" numberOfLines={1} style={{ flex: 1 }}>
              {assoc.name}
            </Text>
            {assoc.isVerified ? <BadgeCheck size={16} color={t.primary} /> : null}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            <View style={[styles.tag, { backgroundColor: t.primarySoft }]}>
              <Text variant="micro" weight="semibold" style={{ color: t.primary }}>
                {ASSOC_TYPE_LABEL[assoc.type]}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: t.bgMuted, flexDirection: "row", alignItems: "center", gap: 3 }]}>
              <MapPin size={9} color={t.textSecondary} />
              <Text variant="micro" weight="semibold" tone="secondary">
                {assoc.country}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: t.bgMuted, flexDirection: "row", alignItems: "center", gap: 3 }]}>
              <Languages size={9} color={t.textSecondary} />
              <Text variant="micro" weight="semibold" tone="secondary">
                {assoc.language.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text variant="bodySmall" tone="secondary" style={{ marginTop: space.md }} numberOfLines={2}>
        {assoc.description}
      </Text>

      {assoc.matchScore ? (
        <View style={[styles.matchRow, { backgroundColor: t.primarySoft, marginTop: space.md }]}>
          <Sparkles size={12} color={t.primary} />
          <Text variant="micro" weight="bold" style={{ color: t.primary }}>
            {assoc.matchScore}% match
          </Text>
          {assoc.matchReasons?.length ? (
            <Text variant="micro" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>
              · {assoc.matchReasons.join(" · ")}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.assocStats, { borderTopColor: t.border, marginTop: space.md }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Users size={13} color={t.textSecondary} />
          <Text variant="caption" weight="semibold">
            {assoc.memberCount.toLocaleString()}
          </Text>
          <Text variant="caption" tone="secondary">members</Text>
        </View>
        <View style={{ width: 1, height: 14, backgroundColor: t.border }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <CircleDot size={13} color={t.textSecondary} />
          <Text variant="caption" weight="semibold">
            {assoc.activeCircles}
          </Text>
          <Text variant="caption" tone="secondary">circles</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => onRequestToJoin(assoc)}
          style={[styles.btnPrimaryCompact, { backgroundColor: t.primary }]}
        >
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
            Request to join
          </Text>
          <ChevronRight size={13} color="#fff" />
        </Pressable>
      </View>
    </Pressable>
  );
}

// ----- Circle card -----

function CircleCard({ circle, t }: { circle: DiscoverableCircle; t: AppTheme }) {
  const status = statusStyle(circle.status, t);
  const spotsLeft = circle.maxParticipants - circle.currentParticipants;
  const isFull = spotsLeft <= 0;
  const fillPct = circle.currentParticipants / circle.maxParticipants;

  return (
    <Pressable style={[styles.circleCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <LinearGradient colors={circle.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardAccent} />

      <View style={{ padding: space.lg, gap: space.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs }}>
            <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
            <Text variant="micro" weight="semibold" tone="secondary">
              {status.label}
            </Text>
          </View>
          <View style={[styles.visChip, { backgroundColor: circle.visibility === "public" ? t.infoSoft : t.primarySoft }]}>
            {circle.visibility === "public" ? (
              <Globe size={10} color={t.info} />
            ) : (
              <Lock size={10} color={t.primary} />
            )}
            <Text
              variant="micro"
              weight="semibold"
              style={{ color: circle.visibility === "public" ? t.info : t.primary }}
            >
              {circle.visibility === "public" ? "Public" : "Invite only"}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
          <LinearGradient
            colors={circle.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarMono}
          >
            <Text variant="h3" weight="bold" style={{ color: "#fff" }}>
              {circle.name.charAt(0)}
            </Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text variant="h3" weight="semibold" numberOfLines={1}>
              {circle.name}
            </Text>
            <Text variant="caption" tone="secondary" numberOfLines={1}>
              by {circle.organizerName}
            </Text>
          </View>
          {circle.organizerTrustScore > 0 ? (
            <View style={[styles.trustPill, { backgroundColor: t.accentSoft }]}>
              <Star size={11} color={t.warning} fill={t.warning} />
              <Text variant="micro" weight="bold" style={{ color: t.warning }}>
                {circle.organizerTrustScore}
              </Text>
            </View>
          ) : null}
        </View>

        {circle.matchScore ? (
          <View style={[styles.matchRow, { backgroundColor: t.primarySoft }]}>
            <Sparkles size={12} color={t.primary} />
            <Text variant="micro" weight="bold" style={{ color: t.primary }}>
              {circle.matchScore}% match
            </Text>
            {circle.matchReasons?.length ? (
              <Text variant="micro" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>
                · {circle.matchReasons.join(" · ")}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
          <View style={[styles.tag, { backgroundColor: t.primarySoft }]}>
            <Text variant="micro" weight="semibold" style={{ color: t.primary }}>
              {FREQ_LABEL[circle.frequency]}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="semibold" tone="secondary">
              {circle.community}
            </Text>
          </View>
        </View>

        <Text variant="bodySmall" tone="secondary" numberOfLines={2}>
          {circle.description}
        </Text>

        <View style={[styles.statsRow, { borderTopColor: t.border, borderBottomColor: t.border }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Users size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">MEMBERS</Text>
            </View>
            <Text variant="bodySmall" weight="bold">
              {circle.currentParticipants}/{circle.maxParticipants}
              <Text variant="micro" tone="secondary" weight="regular">
                {"  "}({isFull ? "full" : `${spotsLeft} open`})
              </Text>
            </Text>
            <View style={[styles.fillBar, { backgroundColor: t.bgMuted, marginTop: 2 }]}>
              <View style={[styles.fillBarFg, { width: `${fillPct * 100}%`, backgroundColor: status.dot }]} />
            </View>
          </View>
          <View style={{ width: 1, backgroundColor: t.border, marginHorizontal: space.md }} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Coins size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">CONTRIBUTION</Text>
            </View>
            <Text variant="bodySmall" weight="bold">
              {circle.currency} {circle.contributionAmount.toLocaleString()}
            </Text>
            <Text variant="micro" tone="secondary">
              per {circle.frequency === "monthly" ? "month" : circle.frequency === "weekly" ? "week" : "fortnight"}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
            <Text variant="caption" weight="semibold">View details</Text>
          </Pressable>
          <Pressable style={[styles.btnPrimary, { backgroundColor: isFull ? t.warning : t.primary }]}>
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
              {isFull ? "Join waitlist" : "Join circle"}
            </Text>
            <ChevronRight size={14} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// ============================================================================
// Main screen
// ============================================================================

type TabKey = "associations" | "circles" | "relationships";

export function DiscoverHub() {
  const t = useTheme();

  const [tab, setTab] = useState<TabKey>("associations");
  const [query, setQuery] = useState("");

  const [assocType, setAssocType] = useState<AssocType | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [circleStatus, setCircleStatus] = useState<Status | "all">("all");
  const [circleFreq, setCircleFreq] = useState<Frequency | "all">("all");

  const [brStatus, setBrStatus] = useState<BrStatus | "all">("all");
  const [brTier, setBrTier] = useState<BrTier | "all">("all");
  const [brRisk, setBrRisk] = useState<"all" | "expiring" | "churn" | "overdue">("all");

  const [preCheckAssoc, setPreCheckAssoc] = useState<DiscoverableAssociation | null>(null);
  const [preCheckMessage, setPreCheckMessage] = useState("");

  const filteredAssocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ASSOCIATIONS.filter((a) => {
      const matchesQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      const matchesType = assocType === "all" || a.type === assocType;
      const matchesVerified = !verifiedOnly || a.isVerified;
      return matchesQ && matchesType && matchesVerified;
    });
  }, [query, assocType, verifiedOnly]);

  const filteredCircles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CIRCLES.filter((c) => {
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.organizerName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.community.toLowerCase().includes(q);
      const matchesStatus = circleStatus === "all" || c.status === circleStatus;
      const matchesFreq = circleFreq === "all" || c.frequency === circleFreq;
      return matchesQ && matchesStatus && matchesFreq;
    });
  }, [query, circleStatus, circleFreq]);

  const filteredRelationships = useMemo(() => {
    if (!CURRENT_USER.isCircleManager) return [];
    const q = query.trim().toLowerCase();
    return RELATIONSHIPS.filter((br) => {
      const matchesQ =
        !q ||
        br.associationName.toLowerCase().includes(q) ||
        br.reference.toLowerCase().includes(q) ||
        br.region.toLowerCase().includes(q);
      const matchesStatus = brStatus === "all" || br.status === brStatus;
      const matchesTier = brTier === "all" || br.tier === brTier;
      const matchesRisk =
        brRisk === "all" ||
        (brRisk === "expiring" && br.isExpiringSoon) ||
        (brRisk === "churn" && br.isChurnRisk) ||
        (brRisk === "overdue" && (br.overdueAmount ?? 0) > 0);
      return matchesQ && matchesStatus && matchesTier && matchesRisk;
    });
  }, [query, brStatus, brTier, brRisk]);

  const brMrr = useMemo(
    () =>
      RELATIONSHIPS.filter((br) => br.status === "active").reduce(
        (sum, br) => sum + br.monthlyRevenue,
        0,
      ),
    [],
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Logged-in header */}
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Image source={{ uri: CURRENT_USER.avatar }} style={styles.userAvatar} />
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
                SIGNED IN
              </Text>
              <Text variant="h3" weight="bold" style={{ color: "#fff" }}>
                {CURRENT_USER.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 2 }}>
                <View style={[styles.userStat]}>
                  <Star size={10} color={palette.amber[300]} fill={palette.amber[300]} />
                  <Text variant="micro" weight="semibold" style={{ color: palette.amber[200] }}>
                    {CURRENT_USER.trustScore}
                  </Text>
                </View>
                <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)" }}>
                  · {CURRENT_USER.associations} associations
                </Text>
              </View>
            </View>
            <Pressable style={[styles.bellBtn]}>
              <Heart size={18} color="#fff" />
            </Pressable>
          </View>

          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xl }}>
            Discover
          </Text>
          <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            {CURRENT_USER.greeting}. Browse associations to belong to and circles to join.
          </Text>

          {/* Search */}
          <View style={[styles.searchWrap, { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.18)" }]}>
            <SearchIcon size={18} color="rgba(255,255,255,0.7)" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={
                tab === "associations"
                  ? "Search associations, languages, locations..."
                  : tab === "circles"
                  ? "Search circles, organizers, communities..."
                  : "Search relationships, BR-ref, association..."
              }
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.searchInput}
            />
          </View>
        </LinearGradient>

        {/* Tabs (Associations | Circles | Relationships [CM-only]) */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg }}>
          <SegmentedTabs<TabKey>
            options={[
              { value: "associations", label: "Associations", count: filteredAssocs.length },
              { value: "circles", label: "Circles", count: filteredCircles.length },
              ...(CURRENT_USER.isCircleManager
                ? [
                    {
                      value: "relationships" as TabKey,
                      label: "Relationships",
                      count: filteredRelationships.length,
                    },
                  ]
                : []),
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>

        {/* CM badge strip — surfaces the CM context the BR tab depends on */}
        {CURRENT_USER.isCircleManager && tab === "relationships" ? (
          <View
            style={[
              styles.cmStrip,
              { backgroundColor: t.primarySoft, borderColor: t.primary },
            ]}
          >
            <View style={[styles.cmIcon, { backgroundColor: t.primary }]}>
              <Building2 size={14} color={t.primaryOn} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 0.8 }}>
                CIRCLE MANAGER · {CURRENT_USER.employeeId}
              </Text>
              <Text variant="caption" tone="secondary">
                {CURRENT_USER.cmActiveCircles}/{CURRENT_USER.cmMaxCircles} circles managed · MRR CHF{" "}
                {brMrr.toLocaleString("en-CH")}
              </Text>
            </View>
          </View>
        ) : null}

        {tab === "relationships" && CURRENT_USER.isCircleManager ? (
          <View style={{ marginTop: space.lg, gap: space.md }}>
            {/* Status filter chips */}
            <FilterChips options={BR_STATUS_FILTERS} value={brStatus} onChange={setBrStatus} />
            {/* Tier filter chips */}
            <FilterChips options={BR_TIER_FILTERS} value={brTier} onChange={setBrTier} variant="secondary" />
            {/* Risk filter chips */}
            <FilterChips options={BR_RISK_FILTERS} value={brRisk} onChange={setBrRisk} variant="secondary" />

            {/* Metric cards: active, pending, suspended, total */}
            <View style={{ paddingHorizontal: space.lg, flexDirection: "row", gap: space.sm }}>
              <BrMetricCard
                t={t}
                label="Active"
                count={RELATIONSHIPS.filter((r) => r.status === "active").length}
                tone="success"
              />
              <BrMetricCard
                t={t}
                label="Pending"
                count={RELATIONSHIPS.filter((r) => r.status === "pending").length}
                tone="warning"
              />
              <BrMetricCard
                t={t}
                label="At risk"
                count={RELATIONSHIPS.filter((r) => r.isChurnRisk || r.isExpiringSoon).length}
                tone="danger"
              />
              <BrMetricCard
                t={t}
                label="MRR"
                value={`CHF ${(brMrr / 1000).toFixed(1)}k`}
                tone="primary"
              />
            </View>

            <View
              style={{
                paddingHorizontal: space.lg,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: space.sm,
              }}
            >
              <Text variant="h3" weight="bold">
                {filteredRelationships.length} {filteredRelationships.length === 1 ? "relationship" : "relationships"}
              </Text>
              <Text variant="caption" tone="accent" weight="semibold">
                Sort: Recent
              </Text>
            </View>

            {filteredRelationships.length === 0 ? (
              <EmptyState
                t={t}
                title="No relationships match your filters"
                hint="Try clearing the search or switching the status/tier filter."
                onClear={() => {
                  setQuery("");
                  setBrStatus("all");
                  setBrTier("all");
                  setBrRisk("all");
                }}
              />
            ) : (
              <View style={{ paddingHorizontal: space.lg, gap: space.md }}>
                {filteredRelationships.map((br) => (
                  <RelationshipCard key={br.id} br={br} />
                ))}
              </View>
            )}
          </View>
        ) : tab === "associations" ? (
          <View style={{ marginTop: space.lg, gap: space.md }}>
            <FilterChips options={ASSOC_TYPE_FILTERS} value={assocType} onChange={setAssocType} />
            <View style={{ paddingHorizontal: space.lg }}>
              <Pressable
                onPress={() => setVerifiedOnly((v) => !v)}
                style={[
                  styles.verifiedToggle,
                  {
                    backgroundColor: verifiedOnly ? t.successSoft : t.bgElevated,
                    borderColor: verifiedOnly ? t.success : t.border,
                  },
                ]}
              >
                <BadgeCheck size={14} color={verifiedOnly ? t.success : t.textSecondary} />
                <Text
                  variant="caption"
                  weight="semibold"
                  style={{ color: verifiedOnly ? t.success : t.textSecondary }}
                >
                  Verified only
                </Text>
              </Pressable>
            </View>

            <View style={{ paddingHorizontal: space.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: space.sm }}>
              <Text variant="h3" weight="bold">
                {filteredAssocs.length} {filteredAssocs.length === 1 ? "association" : "associations"}
              </Text>
              <Text variant="caption" tone="accent" weight="semibold">
                Sort: Best match
              </Text>
            </View>

            {filteredAssocs.length === 0 ? (
              <EmptyState
                t={t}
                title="No associations match your filters"
                hint="Try clearing the search or switching the type filter."
                onClear={() => {
                  setQuery("");
                  setAssocType("all");
                  setVerifiedOnly(false);
                }}
              />
            ) : (
              <View style={{ paddingHorizontal: space.lg, gap: space.md }}>
                {filteredAssocs.map((a) => (
                  <AssociationCard
                    key={a.id}
                    assoc={a}
                    t={t}
                    onRequestToJoin={(assoc) => {
                      setPreCheckMessage("");
                      setPreCheckAssoc(assoc);
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={{ marginTop: space.lg, gap: space.md }}>
            <FilterChips options={STATUS_FILTERS} value={circleStatus} onChange={setCircleStatus} />
            <FilterChips options={FREQ_FILTERS} value={circleFreq} onChange={setCircleFreq} variant="secondary" />

            <View style={{ paddingHorizontal: space.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: space.sm }}>
              <Text variant="h3" weight="bold">
                {filteredCircles.length} {filteredCircles.length === 1 ? "circle" : "circles"}
              </Text>
              <Text variant="caption" tone="accent" weight="semibold">
                Sort: Best match
              </Text>
            </View>

            {filteredCircles.length === 0 ? (
              <EmptyState
                t={t}
                title="No circles match your filters"
                hint="Try clearing the search or status/frequency filters."
                onClear={() => {
                  setQuery("");
                  setCircleStatus("all");
                  setCircleFreq("all");
                }}
              />
            ) : (
              <View style={{ paddingHorizontal: space.lg, gap: space.md }}>
                {filteredCircles.map((c) => (
                  <CircleCard key={c.id} circle={c} t={t} />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <PreJoinSheet
        open={preCheckAssoc !== null}
        assoc={preCheckAssoc}
        message={preCheckMessage}
        onChangeMessage={setPreCheckMessage}
        onClose={() => setPreCheckAssoc(null)}
        onSubmit={() => {
          if (!preCheckAssoc) return;
          console.log(
            "Submit join request:",
            preCheckAssoc.id,
            "message:",
            preCheckMessage.trim(),
          );
          setPreCheckAssoc(null);
          setPreCheckMessage("");
        }}
        t={t}
      />
    </View>
  );
}

// ============================================================================
// Pre-Join Sheet (member-side eligibility pre-check)
// ============================================================================

function PreJoinSheet({
  open,
  assoc,
  message,
  onChangeMessage,
  onClose,
  onSubmit,
  t,
}: {
  open: boolean;
  assoc: DiscoverableAssociation | null;
  message: string;
  onChangeMessage: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  t: AppTheme;
}) {
  if (!assoc) {
    return <BottomSheet open={open} onClose={onClose} title="Request to join">{null}</BottomSheet>;
  }
  const checks = assoc.eligibilityPreview ?? [];
  const passed = checks.filter((c) => c.status === "passed").length;
  const warnings = checks.filter((c) => c.status === "warning" || c.status === "manual").length;
  const failed = checks.filter((c) => c.status === "failed").length;
  const verdict: "auto-approve" | "review" | "block" =
    failed > 0 ? "block" : warnings > 0 ? "review" : "auto-approve";
  const verdictTone =
    verdict === "auto-approve"
      ? { bg: t.successSoft, fg: t.success, label: "You meet every rule" }
      : verdict === "review"
        ? { bg: t.warningSoft, fg: t.warning, label: "Needs human review" }
        : { bg: t.dangerSoft, fg: t.danger, label: "Blocking issues" };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Request to join"
      subtitle={`${assoc.country} · ${assoc.memberCount.toLocaleString()} members · ${assoc.activeCircles} circles`}
      footer={
        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable
            onPress={onClose}
            style={[styles.btnGhostSheet, { backgroundColor: t.bgElevated, borderColor: t.border }]}
          >
            <Text variant="caption" weight="semibold" tone="secondary">
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={onSubmit}
            disabled={verdict === "block"}
            style={[
              styles.btnPrimarySheet,
              { backgroundColor: verdict === "block" ? t.bgMuted : t.primary },
            ]}
          >
            <Text
              variant="caption"
              weight="bold"
              style={{ color: verdict === "block" ? t.textMuted : "#fff" }}
            >
              {verdict === "block" ? "Resolve issues to send" : "Submit request"}
            </Text>
          </Pressable>
        </View>
      }
    >
      <View style={{ gap: space.md, paddingTop: space.md }}>
        {/* Association header */}
        <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
          <Image source={{ uri: assoc.logo }} style={styles.preJoinLogo} />
          <View style={{ flex: 1 }}>
            <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.8 }}>
              REQUEST TO JOIN
            </Text>
            <Text variant="bodySmall" weight="bold">
              {assoc.name}
            </Text>
          </View>
        </View>

        {/* Verdict pill */}
        <View
          style={{
            backgroundColor: verdictTone.bg,
            paddingHorizontal: space.md,
            paddingVertical: space.sm,
            borderRadius: radius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: space.sm,
          }}
        >
          {verdict === "auto-approve" ? (
            <Check size={16} color={verdictTone.fg} />
          ) : verdict === "review" ? (
            <AlertTriangle size={16} color={verdictTone.fg} />
          ) : (
            <X size={16} color={verdictTone.fg} />
          )}
          <Text variant="caption" weight="bold" style={{ color: verdictTone.fg, flex: 1 }}>
            {verdictTone.label}
          </Text>
        </View>

        {/* Eligibility rows */}
        {checks.length > 0 ? (
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm }}>
              <Text variant="caption" weight="bold">
                Your eligibility
              </Text>
              <Text variant="micro" tone="secondary">
                {passed} clear · {warnings} review · {failed} block
              </Text>
            </View>
            <View style={{ gap: 6 }}>
              {checks.map((c) => (
                <PreJoinRow key={c.id} check={c} t={t} />
              ))}
            </View>
          </View>
        ) : (
          <Text variant="caption" tone="secondary">
            This association has no automated eligibility rules. The president will review your request manually.
          </Text>
        )}

        {/* Message */}
        <View>
          <Text variant="caption" weight="bold" style={{ marginBottom: 6 }}>
            Why do you want to join?
          </Text>
          <TextInput
            value={message}
            onChangeText={onChangeMessage}
            placeholder="Introduce yourself, mention any referrals or ties to the community."
            placeholderTextColor={t.textMuted}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: t.bgElevated,
              borderColor: t.border,
              borderWidth: 1,
              borderRadius: radius.md,
              padding: space.sm,
              minHeight: 80,
              textAlignVertical: "top",
              color: t.textPrimary,
            }}
          />
          <Text variant="micro" tone="secondary" style={{ marginTop: 4 }}>
            Visible to the president when reviewing your request.
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
}

function PreJoinRow({ check, t }: { check: EligibilityCheck; t: AppTheme }) {
  const tone = (() => {
    switch (check.status) {
      case "passed":
        return { bg: t.successSoft, fg: t.success, Icon: Check, label: "PASS" };
      case "warning":
        return { bg: t.warningSoft, fg: t.warning, Icon: AlertTriangle, label: "WARN" };
      case "failed":
        return { bg: t.dangerSoft, fg: t.danger, Icon: X, label: "FAIL" };
      case "manual":
        return { bg: t.bgMuted, fg: t.textSecondary, Icon: HelpCircle, label: "ACTION" };
    }
  })();
  const Icon = tone.Icon;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space.sm,
        paddingHorizontal: space.sm,
        paddingVertical: 8,
        borderRadius: radius.sm,
        backgroundColor: tone.bg,
      }}
    >
      <Icon size={13} color={tone.fg} />
      <View style={{ flex: 1 }}>
        <Text variant="caption" weight="semibold" style={{ color: tone.fg }}>
          {check.label}
        </Text>
        {check.detail ? (
          <Text variant="micro" tone="secondary" style={{ marginTop: 1 }}>
            {check.detail}
          </Text>
        ) : null}
      </View>
      <Text variant="micro" weight="bold" style={{ color: tone.fg, letterSpacing: 0.6 }}>
        {tone.label}
      </Text>
    </View>
  );
}

function BrMetricCard({
  t,
  label,
  count,
  value,
  tone,
}: {
  t: AppTheme;
  label: string;
  count?: number;
  value?: string;
  tone: "success" | "warning" | "danger" | "primary";
}) {
  const toneMap = {
    success: { bg: t.successSoft, fg: t.success },
    warning: { bg: t.warningSoft, fg: t.warning },
    danger: { bg: t.dangerSoft, fg: t.danger },
    primary: { bg: t.primarySoft, fg: t.primary },
  } as const;
  const c = toneMap[tone];

  return (
    <View style={[styles.brMetricCard, { backgroundColor: c.bg }]}>
      <Text variant="micro" weight="bold" style={{ color: c.fg, letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ color: c.fg, marginTop: 2 }}>
        {value ?? String(count ?? 0)}
      </Text>
    </View>
  );
}

function EmptyState({
  t,
  title,
  hint,
  onClear,
}: {
  t: AppTheme;
  title: string;
  hint: string;
  onClear: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: t.bgMuted }]}>
        <SearchIcon size={28} color={t.textMuted} />
      </View>
      <Text variant="h3" weight="semibold" align="center">
        {title}
      </Text>
      <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.xs }}>
        {hint}
      </Text>
      <Pressable onPress={onClear} style={[styles.btnPrimary, { backgroundColor: t.primary, marginTop: space.lg }]}>
        <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
          Clear filters
        </Text>
      </Pressable>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: palette.slate[300],
  },
  userStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: space.lg,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    padding: 0,
  },

  // Segmented tabs
  segmentWrap: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  countPill: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    alignItems: "center",
  },

  chip: {
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  verifiedToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: "flex-start",
  },

  // Association card
  assocCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.lg,
  },
  assocLogo: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  assocStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    borderTopWidth: 1,
    paddingTop: space.md,
  },
  btnPrimaryCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.md,
  },

  // Circle card
  circleCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardAccent: {
    height: 4,
    width: "100%",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  visChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  avatarMono: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  trustPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  tag: {
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fillBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  fillBarFg: {
    height: "100%",
    borderRadius: 2,
  },
  btnGhost: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },

  empty: {
    paddingHorizontal: space.xl,
    paddingVertical: space.xxxl,
    alignItems: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },

  // CM strip + status pill (shared by BR card)
  cmStrip: {
    marginHorizontal: space.lg,
    marginTop: space.md,
    padding: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  cmIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  // BR metric card (top of BR tab)
  brMetricCard: {
    flex: 1,
    paddingHorizontal: space.sm,
    paddingVertical: space.md,
    borderRadius: radius.md,
  },

  // Pre-join sheet
  preJoinLogo: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },
  btnGhostSheet: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  btnPrimarySheet: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: radius.md,
  },
});
