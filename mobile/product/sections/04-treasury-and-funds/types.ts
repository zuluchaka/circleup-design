export type FundKind = "operating" | "welfare" | "emergency" | "project";

export type Fund = {
  id: string;
  name: string;
  kind: FundKind;
  balance: number;
  currency: string;
  trend: number[];
  maxDisbursement: number;
  signersRequired: number;
  autoCover?: boolean;
};

export type LedgerEntry = {
  id: string;
  at: string;
  kind: "credit" | "debit";
  amount: number;
  label: string;
};

export type WelfareRequestStatus =
  | "Draft"
  | "Submitted"
  | "In review"
  | "Approved"
  | "Disbursed"
  | "Declined";

export type WelfareRequest = {
  id: string;
  member: string;
  amount: number;
  reason: string;
  quorum: string;
  submitted: string;
  status: WelfareRequestStatus;
};
