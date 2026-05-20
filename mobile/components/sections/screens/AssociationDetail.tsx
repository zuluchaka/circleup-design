import { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  Bell,
  Crown,
  Users,
  CircleDot,
  Wallet,
  ShieldCheck,
  Megaphone,
  Calendar,
  FileText,
  Vote,
  TrendingUp,
  Settings,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Banknote,
  ChevronRight,
  Sparkles,
  Pin,
  Check,
  X,
  MapPin,
  HelpCircle,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";

// ============================================================================
// Inline catalog of associations (keyed by id)
// ============================================================================

type AssocRole = "President" | "Treasurer" | "Secretary" | "Organizer" | "Member";

type AssociationFull = {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  brand: [string, string];
  initials: string;
  city: string;
  country: string;
  founded: string;
  role: AssocRole;
  isVerified: boolean;
  members: number;
  activeCircles: number;
  totalFunds: number;
  emergencyFund: number;
  trustAvg: number;
  currency: "CHF" | "EUR";
  healthScore: number;
  upcomingEvent?: { title: string; date: string };
  announcements: { id: string; pinned: boolean; author: string; title: string; body: string; postedAt: string }[];
  activity: { id: string; type: "join" | "payout" | "dues" | "announcement" | "circle"; actor: string; message: string; at: string }[];
};

const ASSOCIATIONS: Record<string, AssociationFull> = {
  ma1: {
    id: "ma1",
    name: "Senegalese Union of Switzerland",
    tagline: "Geneva chapter · Saving and serving together since 2014",
    logo: "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=200&h=200&fit=crop",
    brand: [palette.indigo[600], palette.amber[400]],
    initials: "SUS",
    city: "Geneva",
    country: "Switzerland",
    founded: "2014",
    role: "Treasurer",
    isVerified: true,
    members: 248,
    activeCircles: 4,
    totalFunds: 86400,
    emergencyFund: 4320,
    trustAvg: 884,
    currency: "CHF",
    healthScore: 92,
    upcomingEvent: { title: "Quarterly general meeting", date: "Sun 24 May · 18:00" },
    announcements: [
      {
        id: "an1",
        pinned: true,
        author: "Aminata Diallo · President",
        title: "Annual contribution review on Sunday",
        body: "We'll vote on the 2026 contribution amounts and confirm the new emergency fund rate. Quorum is 60% — please attend or send a proxy.",
        postedAt: "2026-05-15T10:00:00Z",
      },
      {
        id: "an2",
        pinned: false,
        author: "Mariama Sow · Secretary",
        title: "New cultural night sign-ups open",
        body: "Tickets for the August cultural night are now live in the events tab. Member rate CHF 25, family rate CHF 60.",
        postedAt: "2026-05-12T14:30:00Z",
      },
    ],
    activity: [
      { id: "ac1", type: "payout", actor: "Kofi Mensah", message: "received a CHF 2,400 payout from Main CHF Circle", at: "2026-05-17T09:14:00Z" },
      { id: "ac2", type: "dues", actor: "Awa Ndiaye", message: "paid annual dues (CHF 120)", at: "2026-05-16T16:42:00Z" },
      { id: "ac3", type: "join", actor: "Ibrahima Sarr", message: "joined the Welfare Booster circle", at: "2026-05-16T08:15:00Z" },
      { id: "ac4", type: "announcement", actor: "Mariama Sow", message: "posted a new announcement", at: "2026-05-15T10:00:00Z" },
      { id: "ac5", type: "circle", actor: "Cheikh Diop", message: "created a new circle 'Youth Starter'", at: "2026-05-13T11:20:00Z" },
    ],
  },
  ma2: {
    id: "ma2",
    name: "Latina Tanda Network",
    tagline: "Women's savings collective across French-speaking Switzerland",
    logo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    brand: [palette.rose[500], palette.amber[400]],
    initials: "LTN",
    city: "Lausanne",
    country: "Switzerland",
    founded: "2019",
    role: "Member",
    isVerified: true,
    members: 142,
    activeCircles: 3,
    totalFunds: 24800,
    emergencyFund: 1240,
    trustAvg: 901,
    currency: "CHF",
    healthScore: 88,
    upcomingEvent: { title: "Tanda payout · Cycle 6", date: "Fri 22 May · 20:00" },
    announcements: [
      {
        id: "an1",
        pinned: true,
        author: "Isabella Rodriguez · Organizer",
        title: "Welcome to our 3 newest members",
        body: "Please join us in welcoming Sofia, Camila, and Valeria. They are starting in the bi-weekly tanda this cycle.",
        postedAt: "2026-05-14T18:00:00Z",
      },
    ],
    activity: [
      { id: "ac1", type: "payout", actor: "Sofia Reyes", message: "received CHF 1,200 payout", at: "2026-05-16T11:00:00Z" },
      { id: "ac2", type: "join", actor: "Valeria Cruz", message: "joined Bi-weekly Tanda Lausanne", at: "2026-05-14T17:30:00Z" },
      { id: "ac3", type: "dues", actor: "Camila Vega", message: "paid initial dues", at: "2026-05-14T17:00:00Z" },
    ],
  },
  ma4: {
    id: "ma4",
    name: "West African Heritage Foundation",
    tagline: "Pan-diaspora federation supporting 11 chapters across Switzerland",
    logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop",
    brand: [palette.amber[500], palette.indigo[700]],
    initials: "WAH",
    city: "Zurich",
    country: "Switzerland",
    founded: "2011",
    role: "President",
    isVerified: true,
    members: 612,
    activeCircles: 11,
    totalFunds: 184500,
    emergencyFund: 9220,
    trustAvg: 912,
    currency: "CHF",
    healthScore: 87,
    upcomingEvent: { title: "Board approval · Q2 budget", date: "Wed 21 May · 19:30" },
    announcements: [
      {
        id: "an1",
        pinned: true,
        author: "You · President",
        title: "Annual president's address — Saturday",
        body: "I'll present the 2026 roadmap, new chapter additions, and the federation-wide compliance plan. All chapter presidents required to attend.",
        postedAt: "2026-05-17T09:00:00Z",
      },
      {
        id: "an2",
        pinned: false,
        author: "Jeanne Kabongo · Treasurer",
        title: "Q1 financial report published",
        body: "CHF 184,500 under management across 11 circles. Collection rate 97.8%. Full report in the documents section.",
        postedAt: "2026-05-14T13:00:00Z",
      },
    ],
    activity: [
      { id: "ac1", type: "circle", actor: "Yacouba Touré", message: "submitted a new circle proposal for board review", at: "2026-05-19T08:15:00Z" },
      { id: "ac2", type: "payout", actor: "Marie Diop", message: "received CHF 4,500 payout from Pan-African Circle", at: "2026-05-18T16:00:00Z" },
      { id: "ac3", type: "announcement", actor: "Jeanne Kabongo", message: "posted Q1 financial report", at: "2026-05-14T13:00:00Z" },
      { id: "ac4", type: "join", actor: "Aïssata Konaté", message: "joined Pan-African Circle", at: "2026-05-13T11:00:00Z" },
      { id: "ac5", type: "dues", actor: "Mohamed Cissé", message: "paid annual federation dues (CHF 240)", at: "2026-05-12T09:30:00Z" },
    ],
  },
  ma3: {
    id: "ma3",
    name: "Geneva Diaspora Welfare",
    tagline: "Setting up · Welfare and emergency fund for newcomers",
    logo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop",
    brand: [palette.emerald[600], palette.indigo[500]],
    initials: "GDW",
    city: "Geneva",
    country: "Switzerland",
    founded: "2026",
    role: "Secretary",
    isVerified: false,
    members: 18,
    activeCircles: 0,
    totalFunds: 0,
    emergencyFund: 0,
    trustAvg: 720,
    currency: "CHF",
    healthScore: 64,
    announcements: [
      {
        id: "an1",
        pinned: true,
        author: "Sekou Touré · Founder",
        title: "Founding documents drafted",
        body: "The first draft of our bylaws and welfare policy is ready for review. We need 5 more founding members to ratify.",
        postedAt: "2026-05-17T20:00:00Z",
      },
    ],
    activity: [
      { id: "ac1", type: "join", actor: "Mama Diallo", message: "joined as founding member", at: "2026-05-17T20:45:00Z" },
      { id: "ac2", type: "announcement", actor: "Sekou Touré", message: "posted founding documents", at: "2026-05-17T20:00:00Z" },
    ],
  },
};

// ============================================================================
// Helpers
// ============================================================================

function relativeTime(iso: string, now = new Date()) {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString("en-CH", { day: "2-digit", month: "short" });
}

function activityIcon(type: AssociationFull["activity"][number]["type"]) {
  switch (type) {
    case "payout":
      return Banknote;
    case "dues":
      return Wallet;
    case "join":
      return UserPlus;
    case "announcement":
      return Megaphone;
    case "circle":
      return CircleDot;
  }
}

function isLeader(role: AssocRole) {
  return role === "President" || role === "Treasurer" || role === "Secretary" || role === "Organizer";
}

type EligibilityCheckStatus = "passed" | "warning" | "failed" | "manual";

type EligibilityCheck = {
  id: string;
  label: string;
  status: EligibilityCheckStatus;
  detail?: string;
};

type JoinRequest = {
  id: string;
  userName: string;
  userAvatarUrl: string;
  location: string;
  trustScore: number;
  mutualMembersCount: number;
  requestedAt: string;
  message: string;
  eligibilityChecks: EligibilityCheck[];
};

const JOIN_REQUESTS: JoinRequest[] = [
  {
    id: "req-001",
    userName: "Yohannes Tadesse",
    userAvatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    location: "Geneva, Switzerland",
    trustScore: 712,
    mutualMembersCount: 4,
    requestedAt: "Dec 29",
    message:
      "I recently moved to Geneva and would love to connect with the Ethiopian Orthodox community here. I've been a member of our church in Addis for 15 years.",
    eligibilityChecks: [
      { id: "kyc", label: "Identity verified (KYC)", status: "passed", detail: "PostFinance ID match" },
      { id: "language", label: "Speaks Amharic or English", status: "passed", detail: "Profile language: Amharic, English" },
      { id: "trust", label: "Trust Score ≥ 600", status: "passed", detail: "Trust Score 712" },
      { id: "duplicate", label: "Not already a member", status: "passed" },
      { id: "geo", label: "Resides in chapter region", status: "warning", detail: "Self-declared Geneva — not yet confirmed by document" },
      { id: "referral", label: "Referred by active member", status: "manual", detail: "Mentions Tesfaye Bekele — manual confirmation needed" },
    ],
  },
  {
    id: "req-002",
    userName: "Meron Haile",
    userAvatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    location: "Lausanne, Switzerland",
    trustScore: 645,
    mutualMembersCount: 2,
    requestedAt: "Jan 2",
    message: "Looking to join the community. Referred by Tesfaye Bekele.",
    eligibilityChecks: [
      { id: "kyc", label: "Identity verified (KYC)", status: "passed" },
      { id: "language", label: "Speaks Amharic or English", status: "passed", detail: "Profile language: English" },
      { id: "trust", label: "Trust Score ≥ 600", status: "passed", detail: "Trust Score 645" },
      { id: "duplicate", label: "Not already a member", status: "passed" },
      { id: "geo", label: "Resides in chapter region", status: "passed", detail: "Lausanne address confirmed" },
      { id: "referral", label: "Referred by active member", status: "passed", detail: "Tesfaye Bekele (member since 2019)" },
    ],
  },
  {
    id: "req-003",
    userName: "Daniel Girma",
    userAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    location: "Zürich, Switzerland",
    trustScore: 410,
    mutualMembersCount: 0,
    requestedAt: "Jan 4",
    message: "Hello — I would like to apply to join the parish.",
    eligibilityChecks: [
      { id: "kyc", label: "Identity verified (KYC)", status: "warning", detail: "KYC pending — ID upload required" },
      { id: "language", label: "Speaks Amharic or English", status: "passed" },
      { id: "trust", label: "Trust Score ≥ 600", status: "failed", detail: "Trust Score 410 — below threshold" },
      { id: "duplicate", label: "Not already a member", status: "passed" },
      { id: "geo", label: "Resides in chapter region", status: "warning", detail: "Zürich is outside Geneva chapter — federation referral possible" },
      { id: "referral", label: "Referred by active member", status: "failed", detail: "No referral on file" },
    ],
  },
];

const PRESIDENT_WIDGETS = [
  {
    id: "approvals",
    label: "Pending approvals",
    value: "6",
    sub: "3 join · 2 tx · 1 dispute",
    tone: "warning" as const,
    Icon: CheckCircle2,
  },
  {
    id: "risks",
    label: "At-risk circles",
    value: "2",
    sub: "Low collection rate",
    tone: "danger" as const,
    Icon: AlertTriangle,
  },
  {
    id: "messages",
    label: "Member messages",
    value: "12",
    sub: "Awaiting response",
    tone: "info" as const,
    Icon: Megaphone,
  },
  {
    id: "succession",
    label: "Term ends",
    value: "9mo",
    sub: "Succession plan ready",
    tone: "primary" as const,
    Icon: Crown,
  },
];

// ============================================================================
// Sub-components
// ============================================================================

function StatBlock({
  label,
  value,
  sub,
  Icon,
  t,
}: {
  label: string;
  value: string;
  sub?: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  t: AppTheme;
}) {
  return (
    <View style={[styles.statBlock, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Icon size={12} color={t.textMuted} />
        <Text variant="micro" weight="semibold" tone="muted" style={{ letterSpacing: 0.6 }}>
          {label.toUpperCase()}
        </Text>
      </View>
      <Text variant="h2" weight="bold" style={{ marginTop: 4 }}>
        {value}
      </Text>
      {sub ? (
        <Text variant="micro" tone="secondary">
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

function QuickAction({
  Icon,
  label,
  toneBg,
  toneFg,
  t,
  onPress,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  toneBg: string;
  toneFg: string;
  t: AppTheme;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.quickAction, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={[styles.quickIcon, { backgroundColor: toneBg }]}>
        <Icon size={18} color={toneFg} />
      </View>
      <Text variant="caption" weight="semibold" align="center" style={{ marginTop: space.xs }}>
        {label}
      </Text>
    </Pressable>
  );
}

function SectionLink({
  Icon,
  label,
  hint,
  count,
  t,
  onPress,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  hint?: string;
  count?: number;
  t: AppTheme;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sectionLink, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={[styles.sectionLinkIcon, { backgroundColor: t.primarySoft }]}>
        <Icon size={18} color={t.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" weight="semibold">
          {label}
        </Text>
        {hint ? (
          <Text variant="caption" tone="secondary">
            {hint}
          </Text>
        ) : null}
      </View>
      {count !== undefined ? (
        <View style={[styles.countDot, { backgroundColor: t.bgMuted }]}>
          <Text variant="caption" weight="bold" tone="secondary">
            {count}
          </Text>
        </View>
      ) : null}
      <ChevronRight size={18} color={t.textMuted} />
    </Pressable>
  );
}

// ============================================================================
// Main
// ============================================================================

export function AssociationDetail({ id }: { id: string }) {
  const t = useTheme();
  const a = ASSOCIATIONS[id] ?? ASSOCIATIONS.ma1;
  const leader = isLeader(a.role);
  const president = a.role === "President";

  const [reviewOpen, setReviewOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>(JOIN_REQUESTS);

  const widgetTone = (tone: "warning" | "danger" | "info" | "primary") => {
    switch (tone) {
      case "warning":
        return { fg: t.warning, bg: t.warningSoft };
      case "danger":
        return { fg: t.danger, bg: t.dangerSoft };
      case "info":
        return { fg: t.info, bg: t.infoSoft };
      case "primary":
        return { fg: t.primary, bg: t.primarySoft };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Branding hero */}
        <LinearGradient
          colors={a.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroBar}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
              <ChevronLeft size={22} color="#fff" />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable hitSlop={12} style={styles.iconBtn}>
              <Bell size={18} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => router.push(`/associations/${a.id}/settings` as never)}
              hitSlop={12}
              style={[styles.iconBtn, { marginLeft: space.sm }]}
            >
              <Settings size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.md }}>
            <View style={[styles.crestWrap, { borderColor: "rgba(255,255,255,0.4)" }]}>
              <Image source={{ uri: a.logo }} style={styles.crest} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                {a.isVerified ? (
                  <View style={styles.verifiedChip}>
                    <ShieldCheck size={10} color="#fff" />
                    <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                      VERIFIED
                    </Text>
                  </View>
                ) : null}
                {leader ? (
                  <View style={styles.leaderChip}>
                    <Crown size={10} color={palette.amber[300]} />
                    <Text variant="micro" weight="bold" style={{ color: palette.amber[200] }}>
                      {a.role.toUpperCase()}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text variant="h2" weight="bold" style={{ color: "#fff", marginTop: 4 }}>
                {a.name}
              </Text>
              <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)" }} numberOfLines={2}>
                {a.tagline}
              </Text>
              <Text variant="micro" style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                {a.city}, {a.country} · Est. {a.founded}
              </Text>
            </View>
          </View>

          {a.upcomingEvent ? (
            <View style={styles.eventBanner}>
              <Calendar size={14} color="#fff" />
              <View style={{ flex: 1 }}>
                <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 0.8 }}>
                  UPCOMING · {a.upcomingEvent.date}
                </Text>
                <Text variant="bodySmall" weight="semibold" style={{ color: "#fff" }}>
                  {a.upcomingEvent.title}
                </Text>
              </View>
              <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
            </View>
          ) : null}
        </LinearGradient>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <StatBlock label="Members" value={a.members.toString()} Icon={Users} t={t} />
          <StatBlock label="Circles" value={a.activeCircles.toString()} sub="active" Icon={CircleDot} t={t} />
        </View>
        <View style={[styles.statsStrip, { marginTop: space.sm }]}>
          <StatBlock
            label="Total funds"
            value={`${a.currency} ${a.totalFunds.toLocaleString("en-CH")}`}
            Icon={Wallet}
            t={t}
          />
          <StatBlock
            label="Emergency"
            value={`${a.currency} ${a.emergencyFund.toLocaleString("en-CH")}`}
            sub={`${((a.emergencyFund / Math.max(a.totalFunds, 1)) * 100).toFixed(1)}% of funds`}
            Icon={ShieldCheck}
            t={t}
          />
        </View>

        {/* Health scorecard */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.lg }}>
          <View style={[styles.healthCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
              <View style={[styles.healthRing, { borderColor: a.healthScore >= 80 ? t.success : a.healthScore >= 60 ? t.warning : t.danger }]}>
                <Text variant="h2" weight="bold" style={{ color: a.healthScore >= 80 ? t.success : a.healthScore >= 60 ? t.warning : t.danger }}>
                  {a.healthScore}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.8 }}>
                  HEALTH SCORECARD
                </Text>
                <Text variant="bodySmall" weight="semibold" style={{ marginTop: 2 }}>
                  {a.healthScore >= 80 ? "Excellent" : a.healthScore >= 60 ? "Healthy" : "Needs attention"}
                </Text>
                <Text variant="caption" tone="secondary">
                  Collection · Engagement · Disputes · EF usage · Compliance
                </Text>
              </View>
              <ChevronRight size={18} color={t.textMuted} />
            </View>
          </View>
        </View>

        {/* President dashboard widgets */}
        {president ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
              <Crown size={16} color={t.warning} />
              <Text variant="h3" weight="bold">
                President dashboard
              </Text>
              <View style={[styles.contractChip, { backgroundColor: t.successSoft }]}>
                <ShieldCheck size={10} color={t.success} />
                <Text variant="micro" weight="bold" style={{ color: t.success }}>
                  CONTRACT SIGNED
                </Text>
              </View>
            </View>
            <View style={styles.widgetGrid}>
              {PRESIDENT_WIDGETS.map((w) => {
                const tone = widgetTone(w.tone);
                const Icon = w.Icon;
                const onPress = w.id === "approvals" ? () => setReviewOpen(true) : undefined;
                const displayValue =
                  w.id === "approvals" ? String(pendingRequests.length + 3) : w.value;
                return (
                  <Pressable
                    key={w.id}
                    onPress={onPress}
                    style={[styles.widget, { backgroundColor: t.surface, borderColor: t.border }]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={[styles.widgetIcon, { backgroundColor: tone.bg }]}>
                        <Icon size={14} color={tone.fg} />
                      </View>
                      <ChevronRight size={14} color={t.textMuted} />
                    </View>
                    <Text variant="h2" weight="bold" style={{ color: tone.fg, marginTop: space.sm }}>
                      {displayValue}
                    </Text>
                    <Text variant="caption" weight="semibold">
                      {w.label}
                    </Text>
                    <Text variant="micro" tone="secondary">
                      {w.id === "approvals"
                        ? `${pendingRequests.length} join · 2 tx · 1 dispute`
                        : w.sub}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Role-aware quick actions */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
          <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            QUICK ACTIONS · {a.role.toUpperCase()}
          </Text>
          <View style={styles.actionGrid}>
            {/* Common */}
            <QuickAction Icon={Banknote} label="Pay dues" toneBg={t.successSoft} toneFg={t.success} t={t} />
            <QuickAction Icon={UserPlus} label="Invite" toneBg={t.primarySoft} toneFg={t.primary} t={t} />
            <QuickAction Icon={Calendar} label="Events" toneBg={t.infoSoft} toneFg={t.info} t={t} />
            {/* Leader-only */}
            {leader ? (
              <>
                <QuickAction Icon={Megaphone} label="Announce" toneBg={t.accentSoft} toneFg={t.warning} t={t} />
                <QuickAction Icon={Vote} label="Proposals" toneBg={t.primarySoft} toneFg={t.primary} t={t} />
                <QuickAction Icon={TrendingUp} label="Ledger" toneBg={t.successSoft} toneFg={t.success} t={t} />
              </>
            ) : null}
            {/* President-only */}
            {president ? (
              <>
                <QuickAction Icon={CheckCircle2} label="Approvals" toneBg={t.warningSoft} toneFg={t.warning} t={t} />
                <QuickAction Icon={Crown} label="Succession" toneBg={t.accentSoft} toneFg={t.warning} t={t} />
                <QuickAction Icon={TrendingUp} label="Org. perf." toneBg={t.infoSoft} toneFg={t.info} t={t} />
              </>
            ) : null}
          </View>
        </View>

        {/* Announcements */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Megaphone size={16} color={t.primary} />
              <Text variant="h3" weight="bold">
                Announcements
              </Text>
            </View>
            <Text variant="caption" tone="accent" weight="semibold">
              See all
            </Text>
          </View>
          <View style={{ gap: space.sm }}>
            {a.announcements.map((an) => (
              <View
                key={an.id}
                style={[
                  styles.annCard,
                  {
                    backgroundColor: an.pinned ? t.primarySoft : t.surface,
                    borderColor: an.pinned ? t.primary : t.border,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  {an.pinned ? <Pin size={11} color={t.primary} /> : null}
                  <Text
                    variant="micro"
                    weight="bold"
                    style={{ color: an.pinned ? t.primary : t.textMuted, letterSpacing: 0.8 }}
                  >
                    {an.pinned ? "PINNED · " : ""}
                    {an.author.toUpperCase()}
                  </Text>
                  <Text variant="micro" tone="muted" style={{ marginLeft: "auto" }}>
                    {relativeTime(an.postedAt)}
                  </Text>
                </View>
                <Text variant="body" weight="bold" style={{ marginTop: space.xs }}>
                  {an.title}
                </Text>
                <Text variant="bodySmall" tone="secondary" style={{ marginTop: 2 }} numberOfLines={3}>
                  {an.body}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section deep-links */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
          <Text variant="caption" weight="semibold" tone="muted" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            EXPLORE
          </Text>
          <View style={{ gap: space.sm }}>
            <SectionLink Icon={CircleDot} label="Circles" hint="ROSCA circles in this association" count={a.activeCircles} t={t} onPress={() => router.push("/circles" as never)} />
            <SectionLink Icon={Users} label="Members" hint="Directory, roles, Trust Scores" count={a.members} t={t} />
            {leader ? (
              <>
                <SectionLink Icon={Wallet} label="Finance & ledger" hint="Treasurer view · dues, payouts, transactions" t={t} onPress={() => router.push(`/associations/${a.id}/finance` as never)} />
                <SectionLink Icon={Vote} label="Governance" hint="Proposals, votes, elections" t={t} />
                <SectionLink Icon={FileText} label="Documents" hint="Bylaws, contracts, compliance" t={t} />
              </>
            ) : (
              <>
                <SectionLink Icon={Wallet} label="My dues" hint="Pay, history, disputes" t={t} onPress={() => router.push(`/associations/${a.id}/finance` as never)} />
                <SectionLink Icon={FileText} label="Documents" hint="Bylaws and shared files" t={t} />
              </>
            )}
            {president ? (
              <>
                <SectionLink Icon={CheckCircle2} label="Approvals queue" hint="6 transactions awaiting president co-sign" count={6} t={t} />
                <SectionLink Icon={TrendingUp} label="Organizer performance" hint="Per-organizer metrics for review" t={t} />
                <SectionLink Icon={Bell} label="Notification center" hint="Risks, escalations, finance alerts" t={t} />
                <SectionLink Icon={Crown} label="Succession plan" hint="9 months until term end · plan ready" t={t} />
              </>
            ) : null}
            <SectionLink
              Icon={Settings}
              label="Settings"
              hint="Branding, language, privacy"
              t={t}
              onPress={() => router.push(`/associations/${a.id}/settings` as never)}
            />
          </View>
        </View>

        {/* Activity feed */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Sparkles size={16} color={t.warning} />
              <Text variant="h3" weight="bold">
                Recent activity
              </Text>
            </View>
            <Text variant="caption" tone="accent" weight="semibold">
              See all
            </Text>
          </View>
          <View style={[styles.activityCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            {a.activity.map((row, idx) => {
              const Icon = activityIcon(row.type);
              return (
                <View
                  key={row.id}
                  style={[
                    styles.activityRow,
                    {
                      borderBottomColor: t.border,
                      borderBottomWidth: idx === a.activity.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View style={[styles.activityIcon, { backgroundColor: t.bgMuted }]}>
                    <Icon size={14} color={t.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall">
                      <Text variant="bodySmall" weight="semibold">
                        {row.actor}
                      </Text>{" "}
                      <Text variant="bodySmall" tone="secondary">
                        {row.message}
                      </Text>
                    </Text>
                    <Text variant="micro" tone="muted" style={{ marginTop: 2 }}>
                      {relativeTime(row.at)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer info */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
          <View style={[styles.infoCard, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <CheckCircle2 size={14} color={t.success} />
              <Text variant="caption" weight="semibold" tone="secondary" style={{ flex: 1 }}>
                Trust average · {a.trustAvg} / 1000
              </Text>
            </View>
            {a.healthScore < 70 ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 }}>
                <AlertTriangle size={14} color={t.warning} />
                <Text variant="caption" weight="semibold" tone="secondary" style={{ flex: 1 }}>
                  Setting up — complete founding documents to activate
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {president ? (
        <JoinRequestReviewSheet
          open={reviewOpen}
          requests={pendingRequests}
          onClose={() => setReviewOpen(false)}
          onApprove={(reqId) => {
            console.log("Approve join request:", reqId);
            setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
          }}
          onReject={(reqId, reason) => {
            console.log("Reject join request:", reqId, "reason:", reason);
            setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
          }}
          t={t}
        />
      ) : null}
    </View>
  );
}

// ============================================================================
// Join Request Review Sheet
// ============================================================================

function JoinRequestReviewSheet({
  open,
  requests,
  onClose,
  onApprove,
  onReject,
  t,
}: {
  open: boolean;
  requests: JoinRequest[];
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  t: AppTheme;
}) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Review join requests"
      subtitle={`${requests.length} pending · approve or reject with eligibility context`}
    >
      {requests.length === 0 ? (
        <View style={{ paddingVertical: space.xl, alignItems: "center", gap: space.sm }}>
          <CheckCircle2 size={32} color={t.success} />
          <Text variant="bodySmall" weight="semibold">
            All caught up
          </Text>
          <Text variant="caption" tone="secondary">
            No join requests waiting on your decision.
          </Text>
        </View>
      ) : (
        <View style={{ gap: space.lg, paddingTop: space.md }}>
          {requests.map((req) => (
            <JoinRequestReviewCard
              key={req.id}
              req={req}
              t={t}
              onApprove={() => onApprove(req.id)}
              onReject={() => onReject(req.id)}
            />
          ))}
        </View>
      )}
    </BottomSheet>
  );
}

function JoinRequestReviewCard({
  req,
  t,
  onApprove,
  onReject,
}: {
  req: JoinRequest;
  t: AppTheme;
  onApprove: () => void;
  onReject: () => void;
}) {
  const passed = req.eligibilityChecks.filter((c) => c.status === "passed").length;
  const warnings = req.eligibilityChecks.filter((c) => c.status === "warning" || c.status === "manual").length;
  const failed = req.eligibilityChecks.filter((c) => c.status === "failed").length;
  const verdict: "auto-approve" | "review" | "block" =
    failed > 0 ? "block" : warnings > 0 ? "review" : "auto-approve";
  const verdictTone =
    verdict === "auto-approve"
      ? { bg: t.successSoft, fg: t.success, label: "All checks passed" }
      : verdict === "review"
        ? { bg: t.warningSoft, fg: t.warning, label: "Needs review" }
        : { bg: t.dangerSoft, fg: t.danger, label: "Blocking issues" };

  return (
    <View style={[styles.reviewCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      {/* Applicant header */}
      <View style={{ flexDirection: "row", gap: space.md, alignItems: "flex-start" }}>
        <Image source={{ uri: req.userAvatarUrl }} style={styles.reviewAvatar} />
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" weight="bold" numberOfLines={1}>
            {req.userName}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <MapPin size={11} color={t.textMuted} />
            <Text variant="micro" tone="secondary">
              {req.location}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6, flexWrap: "wrap" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <ShieldCheck size={11} color={t.success} />
              <Text variant="micro" weight="semibold">
                Trust {req.trustScore}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Users size={11} color={t.textMuted} />
              <Text variant="micro" tone="secondary">
                {req.mutualMembersCount} mutual
              </Text>
            </View>
            <Text variant="micro" tone="secondary">
              · {req.requestedAt}
            </Text>
          </View>
        </View>
        <View style={[styles.verdictPill, { backgroundColor: verdictTone.bg }]}>
          <Text variant="micro" weight="bold" style={{ color: verdictTone.fg }}>
            {verdictTone.label}
          </Text>
        </View>
      </View>

      {/* Message */}
      <View
        style={{
          marginTop: space.md,
          paddingHorizontal: space.md,
          paddingVertical: space.sm,
          backgroundColor: t.bgMuted,
          borderLeftWidth: 2,
          borderLeftColor: t.border,
          borderRadius: radius.sm,
        }}
      >
        <Text variant="micro" weight="bold" tone="muted" style={{ letterSpacing: 0.8, marginBottom: 4 }}>
          APPLICANT MESSAGE
        </Text>
        <Text variant="caption" tone="secondary" style={{ fontStyle: "italic" }}>
          "{req.message}"
        </Text>
      </View>

      {/* Eligibility pre-checks */}
      <View style={{ marginTop: space.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.sm }}>
          <Text variant="caption" weight="bold">
            Eligibility pre-checks
          </Text>
          <Text variant="micro" tone="secondary">
            {passed} passed · {warnings} review · {failed} block
          </Text>
        </View>
        <View style={{ gap: 6 }}>
          {req.eligibilityChecks.map((c) => (
            <EligibilityRow key={c.id} check={c} t={t} />
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
        <Pressable
          onPress={onReject}
          style={[styles.btnGhost, { backgroundColor: t.bgElevated, borderColor: t.border }]}
        >
          <X size={13} color={t.textSecondary} />
          <Text variant="caption" weight="semibold" tone="secondary">
            Reject
          </Text>
        </Pressable>
        <Pressable onPress={onApprove} style={[styles.btnApprove, { backgroundColor: t.success }]}>
          <Check size={14} color="#fff" />
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
            Approve
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function EligibilityRow({ check, t }: { check: EligibilityCheck; t: AppTheme }) {
  const tone = (() => {
    switch (check.status) {
      case "passed":
        return { bg: t.successSoft, fg: t.success, Icon: Check, label: "PASS" };
      case "warning":
        return { bg: t.warningSoft, fg: t.warning, Icon: AlertTriangle, label: "WARN" };
      case "failed":
        return { bg: t.dangerSoft, fg: t.danger, Icon: X, label: "FAIL" };
      case "manual":
        return { bg: t.bgMuted, fg: t.textSecondary, Icon: HelpCircle, label: "MANUAL" };
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

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  hero: {
    paddingTop: 56,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
  },
  heroBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  crestWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: 3,
  },
  crest: {
    width: "100%",
    height: "100%",
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },
  verifiedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(16, 185, 129, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  leaderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(252, 211, 77, 0.3)",
  },

  eventBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.lg,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  statsStrip: {
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.lg,
    marginTop: -space.lg,
  },
  statBlock: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  healthCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  healthRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  quickAction: {
    flexBasis: "31%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  annCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  sectionLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  sectionLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  countDot: {
    minWidth: 28,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },

  activityCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: space.md,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.md,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  infoCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  widgetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  widget: {
    flexBasis: "48%",
    flexGrow: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  widgetIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  contractChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginLeft: "auto",
  },

  reviewCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },
  verdictPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  btnGhost: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  btnApprove: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
});
