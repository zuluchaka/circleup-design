export type FundKind = "operating" | "welfare" | "emergency" | "project";

export type FundRules = {
  allowedSources: string[];
  allowedUses: string[];
  maxSingleDisbursement: number;
  signersRequired: number;
  autoCover?: boolean;
};

export type Fund = {
  id: string;
  name: string;
  kind: FundKind;
  balance: number;
  currency: string;
  available: number;
  pending: number;
  trend: number[];
  maxDisbursement: number;
  signersRequired: number;
  rules: FundRules;
  autoCover?: boolean;
};

export type LedgerCategory =
  | "contribution"
  | "payout"
  | "ef_intervention"
  | "ef_repayment"
  | "welfare_disbursement"
  | "platform_fee"
  | "transfer_in"
  | "transfer_out";

export type LedgerEntry = {
  id: string;
  at: string;
  fundId: string;
  kind: "credit" | "debit";
  amount: number;
  currency: string;
  category: LedgerCategory;
  label: string;
  counterparty: string;
  balanceAfter: number;
  reference: string;
};

export type ActionQueueItem = {
  id: string;
  kind: "reconciliation" | "unconfirmed" | "expiring_statement" | "expiring_approval";
  label: string;
  detail: string;
  fundId: string | null;
  at: string;
  severity: "info" | "warning" | "danger";
};

export type TreasuryOverview = {
  totalBalance: number;
  available: number;
  pending: number;
  efBalance: number;
  currency: string;
  weeklyDelta: number;
  actionQueue: ActionQueueItem[];
  funds: Fund[];
  recentLedger: LedgerEntry[];
};

export type WelfareRequestStatus =
  | "Draft"
  | "Submitted"
  | "In review"
  | "Approved"
  | "Disbursed"
  | "Declined";

export type WelfareReason = {
  id: string;
  label: string;
  icon: string;
};

export type EligibilityNote = {
  maxAdvance: number;
  trustScore: number;
  tenureMonths: number;
  detail: string;
};

export type WelfareRequestDraft = {
  fundId: string;
  reasons: WelfareReason[];
  eligibility: EligibilityNote;
};

export type SignerDecision = {
  signerId: string;
  signerName: string;
  signerTrust: number;
  decision: "approved" | "rejected" | "pending";
  decidedAt: string | null;
  note: string | null;
};

export type WelfareRequest = {
  id: string;
  fundId: string;
  member: string;
  memberId: string;
  memberTrust: number;
  amount: number;
  currency: string;
  reason: string;
  reasonKind: string;
  note: string;
  submitted: string;
  deadline: string;
  status: WelfareRequestStatus;
  signers: SignerDecision[];
  signersRequired: number;
  evidence: number;
};
