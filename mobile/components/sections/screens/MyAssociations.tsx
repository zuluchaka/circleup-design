import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronRight,
  Users,
  Wallet,
  CircleDot,
  Crown,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Bell,
  Clock,
  TrendingUp,
} from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { useTheme, space, radius, palette, type AppTheme } from "@/theme";

// ============================================================================
// Logged-in user's associations
// ============================================================================

type AssocStatus = "active" | "draft" | "suspended";

type MyAssociation = {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  brand: [string, string];
  role: "President" | "Treasurer" | "Secretary" | "Organizer" | "Member";
  status: AssocStatus;
  memberCount: number;
  activeCircles: number;
  totalFunds: number;
  currency: "CHF" | "EUR";
  unread: number;
  nextEvent?: string;
  pendingActions?: number;
};

const MY_ASSOCIATIONS: MyAssociation[] = [
  {
    id: "ma1",
    name: "Senegalese Union of Switzerland",
    tagline: "Geneva chapter · Founded 2014",
    logo: "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=200&h=200&fit=crop",
    brand: [palette.indigo[600], palette.amber[400]],
    role: "Treasurer",
    status: "active",
    memberCount: 248,
    activeCircles: 4,
    totalFunds: 86400,
    currency: "CHF",
    unread: 3,
    nextEvent: "Quarterly meeting · Sun 24 May",
    pendingActions: 2,
  },
  {
    id: "ma2",
    name: "Latina Tanda Network",
    tagline: "Women's savings collective",
    logo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    brand: [palette.rose[500], palette.amber[400]],
    role: "Member",
    status: "active",
    memberCount: 142,
    activeCircles: 3,
    totalFunds: 24800,
    currency: "CHF",
    unread: 0,
    nextEvent: "Next tanda payout · Fri 22 May",
  },
  {
    id: "ma3",
    name: "Geneva Diaspora Welfare",
    tagline: "Welfare & emergency fund",
    logo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop",
    brand: [palette.emerald[600], palette.indigo[500]],
    role: "Secretary",
    status: "draft",
    memberCount: 18,
    activeCircles: 0,
    totalFunds: 0,
    currency: "CHF",
    unread: 1,
    pendingActions: 4,
  },
  {
    id: "ma4",
    name: "West African Heritage Foundation",
    tagline: "Pan-diaspora federation · Zurich HQ",
    logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop",
    brand: [palette.amber[500], palette.indigo[700]],
    role: "President",
    status: "active",
    memberCount: 612,
    activeCircles: 11,
    totalFunds: 184500,
    currency: "CHF",
    unread: 8,
    nextEvent: "Board approval · Wed 21 May",
    pendingActions: 6,
  },
];

type Invitation = {
  id: string;
  associationName: string;
  invitedBy: string;
  logo: string;
  expiresIn: string;
};

const PENDING_INVITATIONS: Invitation[] = [
  {
    id: "inv1",
    associationName: "Caribbean Welfare Society",
    invitedBy: "Marie-Claire Dupont",
    logo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
    expiresIn: "Expires in 4 days",
  },
];

type RequestStatus = "pending" | "approved" | "rejected";

type SentRequest = {
  id: string;
  associationName: string;
  logo: string;
  sentLabel: string;
  message: string;
  status: RequestStatus;
  expiresIn?: string;
  decisionLabel?: string;
  rejectionReason?: string;
};

const PENDING_REQUESTS: SentRequest[] = [
  {
    id: "sreq1",
    associationName: "Congolese Community Lausanne",
    logo: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=200&h=200&fit=crop",
    sentLabel: "Sent May 2",
    message:
      "Bonjour, je viens de m'installer à Lausanne et j'aimerais rejoindre la communauté.",
    status: "pending",
    expiresIn: "Expires in 14 days",
  },
  {
    id: "sreq2",
    associationName: "East African Entrepreneurs Hub",
    logo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop",
    sentLabel: "Sent May 11",
    message:
      "I run a logistics startup in Geneva and would like to connect with other founders.",
    status: "pending",
    expiresIn: "Expires in 23 days",
  },
  {
    id: "sreq3",
    associationName: "Cape Verdean Mutual Aid",
    logo: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=200&h=200&fit=crop",
    sentLabel: "Sent May 15",
    message: "I lived in Praia for 5 years and would love to stay connected with the community here.",
    status: "approved",
    decisionLabel: "Approved May 19 by Jorge Brito",
  },
  {
    id: "sreq4",
    associationName: "Eritrean Welfare Geneva",
    logo: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop",
    sentLabel: "Sent May 9",
    message: "Hi, I would like to join your circle.",
    status: "rejected",
    decisionLabel: "Declined May 18 by Saba Tesfay",
    rejectionReason:
      "Membership currently limited to families with ties to the Asmara region — we'd welcome a referral from an existing member.",
  },
];

// ============================================================================
// Helpers
// ============================================================================

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function statusStyle(s: AssocStatus, t: AppTheme) {
  switch (s) {
    case "active":
      return { dot: t.success, fg: t.success, bg: t.successSoft, label: "Active" };
    case "draft":
      return { dot: t.warning, fg: t.warning, bg: t.warningSoft, label: "Setting up" };
    case "suspended":
      return { dot: t.danger, fg: t.danger, bg: t.dangerSoft, label: "Suspended" };
  }
}

// ============================================================================
// Sub-components
// ============================================================================

function SummaryCard({
  Icon,
  label,
  value,
  sub,
  toneColor,
  t,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  sub?: string;
  toneColor: string;
  t: AppTheme;
}) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={[styles.summaryIcon, { backgroundColor: `${toneColor}22` }]}>
        <Icon size={16} color={toneColor} />
      </View>
      <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.6, marginTop: space.sm }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h2" weight="bold" style={{ marginTop: 2 }}>
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

function AssociationRow({ a, t }: { a: MyAssociation; t: AppTheme }) {
  const status = statusStyle(a.status, t);
  const isLeader = a.role === "President" || a.role === "Treasurer" || a.role === "Secretary" || a.role === "Organizer";
  const open = () => router.push(`/associations/${a.id}` as never);

  return (
    <Pressable onPress={open} style={[styles.assocCard, { backgroundColor: t.surface, borderColor: t.border }]}>
      <LinearGradient colors={a.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardAccent} />

      <View style={{ padding: space.lg, gap: space.md }}>
        <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
          <View style={[styles.logoRing, { borderColor: t.border }]}>
            <Image source={{ uri: a.logo }} style={styles.logo} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text variant="h3" weight="semibold" numberOfLines={1} style={{ flex: 1 }}>
                {a.name}
              </Text>
              {isLeader ? <Crown size={14} color={t.warning} /> : null}
            </View>
            <Text variant="caption" tone="secondary" numberOfLines={1}>
              {a.tagline}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.xs, marginTop: 4 }}>
              <RoleBadge role={a.role} />
              <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
                <Text variant="micro" weight="semibold" style={{ color: status.fg }}>
                  {status.label}
                </Text>
              </View>
              {a.unread > 0 ? (
                <View style={[styles.unreadDot, { backgroundColor: t.danger }]}>
                  <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                    {a.unread}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={[styles.statsRow, { borderTopColor: t.border, borderBottomColor: t.border }]}>
          <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Users size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">MEMBERS</Text>
            </View>
            <Text variant="bodySmall" weight="bold">
              {a.memberCount}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: t.border }} />
          <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <CircleDot size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">CIRCLES</Text>
            </View>
            <Text variant="bodySmall" weight="bold">
              {a.activeCircles}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: t.border }} />
          <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Wallet size={12} color={t.textMuted} />
              <Text variant="micro" tone="muted" weight="semibold">FUNDS</Text>
            </View>
            <Text variant="bodySmall" weight="bold" style={{ color: t.success }}>
              {a.totalFunds > 0 ? formatCurrency(a.totalFunds, a.currency) : "—"}
            </Text>
          </View>
        </View>

        {a.nextEvent || a.pendingActions ? (
          <View style={{ gap: space.xs }}>
            {a.nextEvent ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Bell size={12} color={t.info} />
                <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
                  {a.nextEvent}
                </Text>
              </View>
            ) : null}
            {a.pendingActions ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Sparkles size={12} color={t.warning} />
                <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
                  {a.pendingActions} pending action{a.pendingActions === 1 ? "" : "s"} for you
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <Pressable style={[styles.btnGhost, { backgroundColor: t.bgMuted, borderColor: t.border }]}>
            <Text variant="caption" weight="semibold">
              Quick actions
            </Text>
          </Pressable>
          <Pressable onPress={open} style={[styles.btnPrimary, { backgroundColor: t.primary }]}>
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
              Open
            </Text>
            <ChevronRight size={14} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function InvitationCard({ inv, t }: { inv: Invitation; t: AppTheme }) {
  return (
    <View style={[styles.invCard, { backgroundColor: t.primarySoft, borderColor: t.primary }]}>
      <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
        <Image source={{ uri: inv.logo }} style={styles.invLogo} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="micro" weight="bold" style={{ color: t.primary, letterSpacing: 1 }}>
            INVITATION
          </Text>
          <Text variant="bodySmall" weight="semibold">
            {inv.associationName}
          </Text>
          <Text variant="caption" tone="secondary">
            From {inv.invitedBy} · {inv.expiresIn}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
        <Pressable style={[styles.btnGhost, { backgroundColor: t.bgElevated, borderColor: t.border }]}>
          <X size={13} color={t.textSecondary} />
          <Text variant="caption" weight="semibold" tone="secondary">
            Decline
          </Text>
        </Pressable>
        <Pressable style={[styles.btnPrimary, { backgroundColor: t.primary }]}>
          <Check size={14} color="#fff" />
          <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
            Accept
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function RequestCard({ req, t }: { req: SentRequest; t: AppTheme }) {
  if (req.status === "approved") {
    return (
      <View style={[styles.invCard, { backgroundColor: t.successSoft, borderColor: t.success }]}>
        <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
          <Image source={{ uri: req.logo }} style={styles.invLogo} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Check size={11} color={t.success} />
              <Text variant="micro" weight="bold" style={{ color: t.success, letterSpacing: 1 }}>
                REQUEST APPROVED
              </Text>
            </View>
            <Text variant="bodySmall" weight="semibold">
              {req.associationName}
            </Text>
            <Text variant="caption" tone="secondary">
              {req.decisionLabel ?? "Approved"} · You're now a member
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
          <Pressable style={[styles.btnGhost, { backgroundColor: t.bgElevated, borderColor: t.border }]}>
            <Text variant="caption" weight="semibold" tone="secondary">
              Dismiss
            </Text>
          </Pressable>
          <Pressable style={[styles.btnPrimary, { backgroundColor: t.success }]}>
            <Text variant="caption" weight="bold" style={{ color: "#fff" }}>
              Open association
            </Text>
            <ChevronRight size={13} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  }

  if (req.status === "rejected") {
    return (
      <View style={[styles.invCard, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}>
        <View style={{ flexDirection: "row", gap: space.md, alignItems: "flex-start" }}>
          <Image source={{ uri: req.logo }} style={styles.invLogo} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <X size={11} color={t.danger} />
              <Text variant="micro" weight="bold" style={{ color: t.danger, letterSpacing: 1 }}>
                REQUEST DECLINED
              </Text>
            </View>
            <Text variant="bodySmall" weight="semibold">
              {req.associationName}
            </Text>
            <Text variant="caption" tone="secondary">
              {req.decisionLabel ?? "Declined"}
            </Text>
          </View>
        </View>
        {req.rejectionReason ? (
          <View
            style={{
              marginTop: space.sm,
              backgroundColor: t.bgElevated,
              borderLeftWidth: 2,
              borderLeftColor: t.danger,
              paddingHorizontal: space.sm,
              paddingVertical: space.xs,
              borderRadius: radius.sm,
            }}
          >
            <Text variant="micro" weight="bold" style={{ color: t.danger, marginBottom: 2 }}>
              REASON
            </Text>
            <Text variant="caption" tone="secondary">
              {req.rejectionReason}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
          <Pressable style={[styles.btnGhost, { backgroundColor: t.bgElevated, borderColor: t.border }]}>
            <Text variant="caption" weight="semibold" tone="secondary">
              Dismiss
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Pending
  return (
    <View style={[styles.invCard, { backgroundColor: t.warningSoft, borderColor: t.warning }]}>
      <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
        <Image source={{ uri: req.logo }} style={styles.invLogo} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="micro" weight="bold" style={{ color: t.warning, letterSpacing: 1 }}>
            REQUEST SENT
          </Text>
          <Text variant="bodySmall" weight="semibold">
            {req.associationName}
          </Text>
          <Text variant="caption" tone="secondary">
            {req.sentLabel} · Awaiting approval{req.expiresIn ? ` · ${req.expiresIn}` : ""}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: space.sm,
          backgroundColor: t.bgElevated,
          borderLeftWidth: 2,
          borderLeftColor: t.warning,
          paddingHorizontal: space.sm,
          paddingVertical: space.xs,
          borderRadius: radius.sm,
        }}
      >
        <Text variant="caption" tone="secondary" style={{ fontStyle: "italic" }}>
          "{req.message}"
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
        <Pressable style={[styles.btnGhost, { backgroundColor: t.bgElevated, borderColor: t.border }]}>
          <X size={13} color={t.textSecondary} />
          <Text variant="caption" weight="semibold" tone="secondary">
            Cancel request
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ============================================================================
// Main
// ============================================================================

export function MyAssociations() {
  const t = useTheme();

  const active = MY_ASSOCIATIONS.filter((a) => a.status === "active");
  const leadership = MY_ASSOCIATIONS.filter((a) =>
    ["President", "Treasurer", "Secretary", "Organizer"].includes(a.role)
  );
  const totalMembers = MY_ASSOCIATIONS.reduce((s, a) => s + a.memberCount, 0);
  const totalFunds = MY_ASSOCIATIONS.reduce((s, a) => s + a.totalFunds, 0);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Header */}
        <LinearGradient
          colors={[palette.indigo[700], palette.indigo[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text variant="micro" weight="bold" style={{ color: palette.amber[200], letterSpacing: 1.2 }}>
            MEMBER OF · {MY_ASSOCIATIONS.length} ASSOCIATIONS
          </Text>
          <Text variant="display" weight="bold" style={{ color: "#fff", marginTop: space.xs }}>
            My Associations
          </Text>
          <Text variant="body" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
            Belong, lead, and stay in sync with the communities that matter to you.
          </Text>
        </LinearGradient>

        {/* Summary stats */}
        <View style={styles.summaryRow}>
          <SummaryCard
            Icon={ShieldCheck}
            label="Active"
            value={String(active.length)}
            sub="of 3 total"
            toneColor={t.success}
            t={t}
          />
          <SummaryCard
            Icon={Crown}
            label="Leadership"
            value={String(leadership.length)}
            sub="role(s)"
            toneColor={t.warning}
            t={t}
          />
          <SummaryCard
            Icon={Users}
            label="Members"
            value={totalMembers.toLocaleString()}
            sub="across all"
            toneColor={t.primary}
            t={t}
          />
        </View>

        <View style={styles.summaryRow2}>
          <View style={[styles.fundsCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <View style={[styles.summaryIcon, { backgroundColor: t.successSoft }]}>
                <TrendingUp size={16} color={t.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="micro" tone="muted" weight="semibold" style={{ letterSpacing: 0.6 }}>
                  TOTAL FUNDS UNDER YOUR ROLES
                </Text>
                <Text variant="h1" weight="bold" style={{ color: t.success, marginTop: 2 }}>
                  CHF {totalFunds.toLocaleString("en-CH")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pending invitations */}
        {PENDING_INVITATIONS.length > 0 ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Bell size={16} color={t.primary} />
              <Text variant="h3" weight="bold">
                Pending invitations
              </Text>
              <View style={[styles.countDot, { backgroundColor: t.primary }]}>
                <Text variant="micro" weight="bold" style={{ color: t.primaryOn }}>
                  {PENDING_INVITATIONS.length}
                </Text>
              </View>
            </View>
            {PENDING_INVITATIONS.map((inv) => (
              <InvitationCard key={inv.id} inv={inv} t={t} />
            ))}
          </View>
        ) : null}

        {/* Join requests (outbound, all states) */}
        {PENDING_REQUESTS.length > 0 ? (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, gap: space.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Clock size={16} color={t.warning} />
              <Text variant="h3" weight="bold">
                Join requests
              </Text>
              <View style={[styles.countDot, { backgroundColor: t.warning }]}>
                <Text variant="micro" weight="bold" style={{ color: "#fff" }}>
                  {PENDING_REQUESTS.length}
                </Text>
              </View>
            </View>
            {PENDING_REQUESTS.map((req) => (
              <RequestCard key={req.id} req={req} t={t} />
            ))}
          </View>
        ) : null}

        {/* Association list */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text variant="h3" weight="bold">
            Your associations
          </Text>
          <Text variant="caption" tone="accent" weight="semibold">
            Sort: Recent
          </Text>
        </View>

        <View style={{ paddingHorizontal: space.lg, marginTop: space.md, gap: space.md }}>
          {MY_ASSOCIATIONS.map((a) => (
            <AssociationRow key={a.id} a={a} t={t} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    paddingTop: 72,
    paddingBottom: space.xl,
    paddingHorizontal: space.lg,
  },

  summaryRow: {
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.lg,
    marginTop: -space.lg,
  },
  summaryRow2: {
    paddingHorizontal: space.lg,
    marginTop: space.sm,
  },
  summaryCard: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fundsCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  countDot: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },

  assocCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardAccent: {
    height: 4,
    width: "100%",
  },
  logoRing: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 2,
    padding: 2,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: radius.sm,
    backgroundColor: palette.slate[200],
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unreadDot: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btnGhost: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 11,
    borderRadius: radius.md,
  },

  invCard: {
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  invLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.slate[200],
  },
});
