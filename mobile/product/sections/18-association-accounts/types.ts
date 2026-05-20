// Section 18 — Association Accounts
//
// Portable typings for design-time screens. Shapes mirror the Rails
// `AssociationAccount`, `AssociationAccountEntry`, and `FundCategory` models.

export type AccountStatus = "active" | "frozen" | "closed";
export type AccountType = "primary" | "reserve" | "dues";

export type EntryDirection = "credit" | "debit";

export type EntryType =
  | "dues_collected"
  | "circle_transfer"
  | "fee_payment"
  | "adjustment"
  | "contribution"
  | "payout";

export interface AssociationAccountEntry {
  id: string;
  entryType: EntryType;
  direction: EntryDirection;
  amount: number;
  currency: "CHF" | "EUR" | "USD" | "GBP";
  description: string | null;
  fundCategorySlug?: string;
  fundCategoryName?: string;
  runningBalance: number;
  postedAt: string;
  referenceType?: string;
  referenceId?: string;
  recordedByName?: string;
}

export interface FundCategory {
  id: string;
  slug: string; // "general" | "welfare" | "reserve" | custom
  name: string;
  purpose: string;
  isDefault: boolean;
  balance: number;
  targetAmount: number | null;
  currency: "CHF" | "EUR" | "USD" | "GBP";
  status: "active" | "archived";
  sortOrder: number;
}

export interface AssociationAccount {
  id: string;
  accountNumber: string; // ASS-XXXX-{PRI|RES|DUE}
  associationId: string;
  associationName: string;
  associationLogo?: string;
  accountType: AccountType;
  currency: "CHF" | "EUR" | "USD" | "GBP";
  balance: number;
  status: AccountStatus;
  approvalThreshold?: number;
  pendingApprovals?: number;
  isRestricted: boolean; // upstream BR suspended → restricted entry-type set
  fundCategories: FundCategory[];
  recentEntries: AssociationAccountEntry[];
  createdAt: string;
  updatedAt: string;
}
