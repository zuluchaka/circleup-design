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
