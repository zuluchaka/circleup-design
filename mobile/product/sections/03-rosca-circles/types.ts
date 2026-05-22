export type Cadence = "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly";
export type MemberCycleStatus = "Paid" | "Due" | "Overdue" | "EF";
export type PayoutSlotStatus = "Paid" | "Upcoming" | "Projected" | "Skipped";

export type Circle = {
  id: string;
  name: string;
  contribution: number;
  currency: string;
  cadence: Cadence;
  members: number;
  cycle: number;
  cycleLength: number;
  yourStatus: MemberCycleStatus;
  yourDueAmount: number;
  nextDue: string;
  nextPayoutTo: string;
  nextPayoutAmount: number;
  nextPayoutDate: string;
  collectionRate: number;
  emergencyFund: number;
  accent: string;
};

export type RosterSlot = {
  id: string;
  name: string;
  trust: number;
  status: MemberCycleStatus;
  slot: number;
  paidAt: string | null;
};

export type PaymentMethod = {
  id: string;
  label: string;
  kind: "bank" | "card" | "wallet";
  default: boolean;
};

export type PayoutSlot = {
  cycle: number;
  to: string;
  amount: number;
  date: string;
  status: PayoutSlotStatus;
};

export type TreasurerException = {
  id: string;
  memberId: string;
  name: string;
  issue: string;
  trust: number;
};

// ---------------------------------------------------------------------------
// Phase 2 — discovery & joining
// ---------------------------------------------------------------------------

export type EligibilityStatus = "ok" | "blocker" | "warning";

export type EligibilityCheck = {
  id: string;
  label: string;
  detail: string;
  status: EligibilityStatus;
};

export type JoinEligibility = {
  circleId: string;
  canJoin: boolean;
  isFull: boolean;
  checks: EligibilityCheck[];
};

export type WaitlistEntry = {
  circleId: string;
  position: number;
  totalAhead: number;
  joinedAt: string;
  expectedPromotion: string;
  notifyOnPromotion: boolean;
};

export type CircleInvitation = {
  id: string;
  circleId: string;
  circleName: string;
  circleAccent: string;
  contribution: number;
  currency: string;
  cadence: Cadence;
  inviterId: string;
  inviterName: string;
  inviterTrust: number;
  inviterRole: "Organizer" | "Treasurer" | "Member";
  associationName: string;
  channel: "WhatsApp" | "SMS" | "Email" | "Direct";
  message: string | null;
  sentAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
};
