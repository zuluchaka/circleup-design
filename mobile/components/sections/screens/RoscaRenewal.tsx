import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  Check,
  X,
  Clock,
  Repeat,
  CalendarPlus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react-native";
import { router } from "expo-router";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { Avatar } from "@/components/shared/Avatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space, radius, type AppTheme } from "@/theme";
import rosca from "@/product/sections/03-rosca-circles/data.json";

type Status = "proposed" | "voting" | "approved" | "rejected" | "cancelled" | "created";
type Vote = "opt_in" | "opt_out" | "pending";

type Voter = {
  memberId: string;
  name: string;
  trust: number;
  vote: Vote;
  votedAt: string | null;
};

type Proposal = {
  id: string;
  parentCircleId: string;
  parentCircleName: string;
  status: Status;
  proposedStart: string;
  proposedContribution: number;
  proposedCurrency: string;
  proposedDuration: number;
  proposedCadence: string;
  changesFromParent: string[];
  notes: string;
  votingDeadline: string;
  optInCount: number;
  optOutCount: number;
  pendingCount: number;
  requiredOptIns: number;
  voters: Voter[];
};

const NOW = new Date("2026-05-22T10:00:00Z").getTime();

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-CH")}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CH", { day: "numeric", month: "short", year: "numeric" });
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - NOW;
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days >= 1) return `${days}d ${hours}h left`;
  if (hours >= 1) return `${hours}h left`;
  return "<1h left";
}

function timeSince(iso: string | null) {
  if (!iso) return "—";
  const diff = NOW - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours >= 1) return `${hours}h ago`;
  return "just now";
}

function statusMeta(status: Status, t: AppTheme) {
  if (status === "voting") return { color: t.primary, bg: t.primarySoft, label: "Voting open" };
  if (status === "approved") return { color: t.success, bg: t.successSoft, label: "Approved" };
  if (status === "created") return { color: t.success, bg: t.successSoft, label: "Renewed" };
  if (status === "rejected") return { color: t.danger, bg: t.dangerSoft, label: "Rejected" };
  if (status === "cancelled") return { color: t.textMuted, bg: t.bgMuted, label: "Cancelled" };
  return { color: t.warning, bg: t.warningSoft, label: "Proposed" };
}

function voteMeta(vote: Vote, t: AppTheme) {
  if (vote === "opt_in") return { color: t.success, bg: t.successSoft, label: "OPT-IN", Icon: Check };
  if (vote === "opt_out") return { color: t.danger, bg: t.dangerSoft, label: "OPT-OUT", Icon: X };
  return { color: t.textMuted, bg: t.bgMuted, label: "PENDING", Icon: Clock };
}

// ---------------------------------------------------------------------------
// Vote progress ring
// ---------------------------------------------------------------------------

function VoteRing({
  current,
  required,
  color,
  size = 80,
  thickness = 8,
  t,
}: {
  current: number;
  required: number;
  color: string;
  size?: number;
  thickness?: number;
  t: AppTheme;
}) {
  const value = Math.min(1, current / required);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = value * c;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <SvgCircle cx={size / 2} cy={size / 2} r={r} stroke={t.bgMuted} strokeWidth={thickness} fill="none" />
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text variant="h2" weight="bold">{current}</Text>
      <Text variant="micro" tone="muted" weight="semibold">of {required}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function RoscaRenewal() {
  const t = useTheme();
  const proposal = rosca.renewalProposal as Proposal;
  const yourMemberId = "mem_aminata";
  const yourVote = proposal.voters.find((v) => v.memberId === yourMemberId);

  const [castVote, setCastVote] = useState<Vote>(yourVote?.vote ?? "pending");

  const meta = statusMeta(proposal.status, t);
  const total = proposal.optInCount + proposal.optOutCount + proposal.pendingCount;
  const optInPct = proposal.optInCount / total;
  const remainingNeeded = Math.max(0, proposal.requiredOptIns - proposal.optInCount);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader
        title="Renewal proposal"
        subtitle={proposal.parentCircleName}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: 160, gap: space.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — proposed circle preview */}
        <View style={[styles.hero, { backgroundColor: t.primary }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Repeat size={14} color="rgba(255,255,255,0.85)" />
            <Text variant="micro" weight="bold" style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.5 }}>
              PROPOSED RENEWAL
            </Text>
          </View>
          <Text variant="h1" weight="bold" style={{ color: "#fff", marginTop: space.sm }}>
            {proposal.parentCircleName} · v2
          </Text>
          <Text variant="bodySmall" style={{ color: "rgba(255,255,255,0.9)", marginTop: 4 }}>
            Starts {shortDate(proposal.proposedStart)} · {proposal.proposedDuration} cycles · {proposal.proposedCadence.toLowerCase()}
          </Text>

          <View style={{ flexDirection: "row", marginTop: space.md, gap: space.md }}>
            <HeroStat
              label="CONTRIBUTION"
              value={formatCurrency(proposal.proposedContribution, proposal.proposedCurrency)}
              sub="per cycle"
            />
            <View style={[styles.heroSep, { backgroundColor: "rgba(255,255,255,0.25)" }]} />
            <HeroStat
              label="TOTAL POT"
              value={formatCurrency(proposal.proposedContribution * proposal.proposedDuration, proposal.proposedCurrency)}
              sub={`over ${proposal.proposedDuration} cycles`}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: space.md }}>
            <View style={[styles.statusPill, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
              <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                {meta.label.toUpperCase()}
              </Text>
            </View>
            {proposal.status === "voting" ? (
              <View style={[styles.statusPill, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
                <Clock size={9} color="#fff" />
                <Text variant="micro" weight="bold" style={{ color: "#fff", letterSpacing: 0.6 }}>
                  {timeUntil(proposal.votingDeadline).toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Changes from parent */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            WHAT'S CHANGING
          </Text>
          {proposal.changesFromParent.map((c, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: i === 0 ? 0 : space.xs }}>
              <View style={[styles.changeDot, { backgroundColor: i === 0 ? t.warningSoft : t.successSoft }]}>
                {i === 0 ? (
                  <TrendingUp size={10} color={t.warning} />
                ) : (
                  <Check size={10} color={t.success} strokeWidth={3} />
                )}
              </View>
              <Text variant="caption" tone="secondary" style={{ flex: 1, lineHeight: 16 }}>{c}</Text>
            </View>
          ))}

          {proposal.notes ? (
            <View style={[styles.notes, { backgroundColor: t.bgMuted }]}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.6 }}>FROM THE ORGANISER</Text>
              <Text variant="caption" tone="secondary" style={{ marginTop: 4, lineHeight: 16, fontStyle: "italic" }}>
                "{proposal.notes}"
              </Text>
            </View>
          ) : null}
        </Card>

        {/* Vote progress */}
        <Card padded>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <VoteRing current={proposal.optInCount} required={proposal.requiredOptIns} color={t.primary} t={t} />
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 0.8 }}>
                OPT-INS NEEDED TO APPROVE
              </Text>
              <Text variant="h3" weight="bold" style={{ marginTop: 2 }}>
                {remainingNeeded === 0
                  ? "Threshold met"
                  : `${remainingNeeded} more to approve`}
              </Text>
              <Text variant="micro" tone="secondary" style={{ marginTop: 4 }}>
                Voting closes {shortDate(proposal.votingDeadline)}
              </Text>
            </View>
          </View>

          {/* Stacked bar */}
          <View style={[styles.stackBar, { backgroundColor: t.bgMuted, marginTop: space.md }]}>
            <View style={{ flex: proposal.optInCount, backgroundColor: t.success }} />
            <View style={{ flex: proposal.optOutCount, backgroundColor: t.danger }} />
            <View style={{ flex: proposal.pendingCount, backgroundColor: t.textMuted, opacity: 0.4 }} />
          </View>
          <View style={{ flexDirection: "row", gap: space.md, marginTop: space.sm }}>
            <Legend dotColor={t.success} label="Opt-in" value={proposal.optInCount} />
            <Legend dotColor={t.danger} label="Opt-out" value={proposal.optOutCount} />
            <Legend dotColor={t.textMuted} label="Pending" value={proposal.pendingCount} />
          </View>
        </Card>

        {/* Your vote */}
        <Card padded>
          <Text variant="micro" tone="muted" weight="bold" style={{ letterSpacing: 1, marginBottom: space.sm }}>
            YOUR VOTE
          </Text>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <VoteButton
              variant="opt_in"
              active={castVote === "opt_in"}
              onPress={() => setCastVote("opt_in")}
              t={t}
            />
            <VoteButton
              variant="opt_out"
              active={castVote === "opt_out"}
              onPress={() => setCastVote("opt_out")}
              t={t}
            />
          </View>
          {castVote !== "pending" ? (
            <Text variant="micro" tone="secondary" style={{ marginTop: space.sm, lineHeight: 14 }}>
              You can change your vote until {shortDate(proposal.votingDeadline)}.
            </Text>
          ) : null}
        </Card>

        {/* Voter list */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: space.sm }}>
            <Text variant="h3" weight="bold">All votes</Text>
            <Text variant="caption" tone="secondary">{proposal.voters.length} members</Text>
          </View>
          <Card padded={false}>
            {proposal.voters.map((v, i) => (
              <VoterRow key={v.memberId} v={v} t={t} last={i === proposal.voters.length - 1} />
            ))}
          </Card>
        </View>

        {/* Organiser actions */}
        <View style={[styles.orgPanel, { backgroundColor: t.warningSoft }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: space.sm }}>
            <ShieldCheck size={14} color={t.warning} />
            <Text variant="caption" weight="bold" style={{ color: t.warning, letterSpacing: 0.5 }}>
              ORGANISER ACTIONS
            </Text>
          </View>
          <Text variant="micro" tone="secondary" style={{ lineHeight: 14, marginBottom: space.sm }}>
            Available once the voting threshold is met or after the deadline closes.
          </Text>
          <Pressable
            style={[styles.orgBtn, { backgroundColor: t.surface, borderColor: t.warning }]}
            disabled
          >
            <CalendarPlus size={14} color={t.warning} />
            <Text variant="caption" weight="bold" style={{ color: t.warning }}>Create renewed circle</Text>
            <ArrowRight size={12} color={t.warning} />
          </Pressable>
        </View>
      </ScrollView>
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

function Legend({ dotColor, label, value }: { dotColor: string; label: string; value: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor }} />
      <Text variant="micro" tone="secondary" weight="semibold">{label}</Text>
      <Text variant="micro" weight="bold">{value}</Text>
    </View>
  );
}

function VoteButton({
  variant,
  active,
  onPress,
  t,
}: {
  variant: "opt_in" | "opt_out";
  active: boolean;
  onPress: () => void;
  t: AppTheme;
}) {
  const isIn = variant === "opt_in";
  const color = isIn ? t.success : t.danger;
  const Icon = isIn ? Check : X;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.voteBtn,
        {
          backgroundColor: active ? color : t.surface,
          borderColor: color,
        },
      ]}
    >
      <Icon size={16} color={active ? "#fff" : color} strokeWidth={3} />
      <Text variant="bodySmall" weight="bold" style={{ color: active ? "#fff" : color }}>
        {isIn ? "Opt in · keep going" : "Opt out · I'm done"}
      </Text>
    </Pressable>
  );
}

function VoterRow({ v, t, last }: { v: Voter; t: AppTheme; last: boolean }) {
  const meta = voteMeta(v.vote, t);
  const Icon = meta.Icon;
  return (
    <View style={[styles.voterRow, last ? null : { borderBottomColor: t.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Avatar name={v.name} size="sm" />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="caption" weight="bold">{v.name}</Text>
          <View style={[styles.trustPill, { backgroundColor: t.bgMuted }]}>
            <Text variant="micro" weight="bold" tone="secondary" style={{ letterSpacing: 0.5 }}>T·{v.trust}</Text>
          </View>
        </View>
        <Text variant="micro" tone="muted" style={{ marginTop: 1 }}>
          {v.votedAt ? `Voted ${timeSince(v.votedAt)}` : "Awaiting vote"}
        </Text>
      </View>
      <View style={[styles.votePill, { backgroundColor: meta.bg }]}>
        <Icon size={11} color={meta.color} strokeWidth={3} />
        <Text variant="micro" weight="bold" style={{ color: meta.color, letterSpacing: 0.5 }}>{meta.label}</Text>
      </View>
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
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  changeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  notes: {
    marginTop: space.md,
    padding: space.md,
    borderRadius: radius.md,
  },
  stackBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
  },
  voteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  voterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
  },
  trustPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  votePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  orgPanel: {
    padding: space.md,
    borderRadius: radius.md,
  },
  orgBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
});
