// Sample Association Account data for design previews.
// Shapes mirror Section 18 types and the Rails `AssociationAccount` model.

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

export type AssociationAccountEntry = {
  id: string;
  entryType: EntryType;
  direction: EntryDirection;
  amount: number;
  currency: "CHF" | "EUR";
  description: string | null;
  fundCategorySlug?: string;
  fundCategoryName?: string;
  runningBalance: number;
  postedAt: string;
  recordedByName?: string;
};

export type FundCategory = {
  id: string;
  slug: string;
  name: string;
  purpose: string;
  isDefault: boolean;
  balance: number;
  targetAmount: number | null;
  currency: "CHF" | "EUR";
};

export type AssociationAccount = {
  id: string;
  accountNumber: string;
  associationId: string;
  associationName: string;
  associationLogo?: string;
  accountType: AccountType;
  currency: "CHF" | "EUR";
  balance: number;
  status: AccountStatus;
  approvalThreshold?: number;
  pendingApprovals?: number;
  isRestricted: boolean;
  restrictionReason?: string;
  fundCategories: FundCategory[];
  recentEntries: AssociationAccountEntry[];
  createdAt: string;
  updatedAt: string;
};

export const ENTRY_TYPE_LABEL: Record<EntryType, string> = {
  dues_collected: "Dues collected",
  circle_transfer: "Circle transfer",
  fee_payment: "Fee payment",
  adjustment: "Adjustment",
  contribution: "Contribution",
  payout: "Payout",
};

const ACCOUNTS: AssociationAccount[] = [
  {
    id: "aa-sus-001",
    accountNumber: "ASS-7K2N-PRI",
    associationId: "as-7k2n",
    associationName: "Senegalese Union of Switzerland",
    associationLogo:
      "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=200&h=200&fit=crop",
    accountType: "primary",
    currency: "CHF",
    balance: 12640.55,
    status: "active",
    approvalThreshold: 5000,
    pendingApprovals: 1,
    isRestricted: false,
    fundCategories: [
      {
        id: "fc-7k2n-gen",
        slug: "general",
        name: "General Fund",
        purpose: "Operations and administration",
        isDefault: true,
        balance: 7200,
        targetAmount: 10000,
        currency: "CHF",
      },
      {
        id: "fc-7k2n-wel",
        slug: "welfare",
        name: "Welfare Fund",
        purpose: "Member emergencies and support",
        isDefault: true,
        balance: 3140.55,
        targetAmount: 4000,
        currency: "CHF",
      },
      {
        id: "fc-7k2n-res",
        slug: "reserve",
        name: "Reserve Fund",
        purpose: "Long-term financial stability",
        isDefault: true,
        balance: 2300,
        targetAmount: 8000,
        currency: "CHF",
      },
    ],
    recentEntries: [
      {
        id: "ent-7k2n-1",
        entryType: "dues_collected",
        direction: "credit",
        amount: 250,
        currency: "CHF",
        description: "May dues — Aminata Diallo",
        fundCategorySlug: "general",
        fundCategoryName: "General",
        runningBalance: 12640.55,
        postedAt: "2026-05-15T08:21:00Z",
        recordedByName: "Aminata D.",
      },
      {
        id: "ent-7k2n-2",
        entryType: "circle_transfer",
        direction: "debit",
        amount: 6000,
        currency: "CHF",
        description: "Geneva Diaspora Circle · May payout to Fatou N.",
        fundCategorySlug: "general",
        fundCategoryName: "General",
        runningBalance: 12390.55,
        postedAt: "2026-05-14T15:02:00Z",
        recordedByName: "Cheikh D.",
      },
      {
        id: "ent-7k2n-3",
        entryType: "fee_payment",
        direction: "debit",
        amount: 420,
        currency: "CHF",
        description: "BR-7K2NQ4XF · April platform fee",
        fundCategorySlug: "general",
        fundCategoryName: "General",
        runningBalance: 18390.55,
        postedAt: "2026-05-03T09:00:00Z",
        recordedByName: "System",
      },
      {
        id: "ent-7k2n-4",
        entryType: "dues_collected",
        direction: "credit",
        amount: 250,
        currency: "CHF",
        description: "May dues — Cheikh Diop",
        fundCategorySlug: "general",
        fundCategoryName: "General",
        runningBalance: 18810.55,
        postedAt: "2026-05-02T14:11:00Z",
        recordedByName: "Cheikh D.",
      },
      {
        id: "ent-7k2n-5",
        entryType: "contribution",
        direction: "credit",
        amount: 1200,
        currency: "CHF",
        description: "Welfare contribution drive",
        fundCategorySlug: "welfare",
        fundCategoryName: "Welfare",
        runningBalance: 18560.55,
        postedAt: "2026-04-28T11:00:00Z",
        recordedByName: "Aminata D.",
      },
    ],
    createdAt: "2025-02-10T12:00:00Z",
    updatedAt: "2026-05-15T08:21:00Z",
  },
  {
    id: "aa-fcb-001",
    accountNumber: "ASS-4F12-PRI",
    associationId: "as-4f12",
    associationName: "Filipino Community Basel",
    associationLogo:
      "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=200&h=200&fit=crop",
    accountType: "primary",
    currency: "CHF",
    balance: 1240.55,
    status: "active",
    approvalThreshold: 2500,
    pendingApprovals: 0,
    isRestricted: true,
    restrictionReason: "BR-ZX09RKLM suspended · 12d grace remaining",
    fundCategories: [
      {
        id: "fc-4f12-gen",
        slug: "general",
        name: "General Fund",
        purpose: "Operations and administration",
        isDefault: true,
        balance: 640.55,
        targetAmount: 2500,
        currency: "CHF",
      },
      {
        id: "fc-4f12-wel",
        slug: "welfare",
        name: "Welfare Fund",
        purpose: "Member emergencies and support",
        isDefault: true,
        balance: 600,
        targetAmount: 1500,
        currency: "CHF",
      },
      {
        id: "fc-4f12-res",
        slug: "reserve",
        name: "Reserve Fund",
        purpose: "Long-term financial stability",
        isDefault: true,
        balance: 0,
        targetAmount: 3000,
        currency: "CHF",
      },
    ],
    recentEntries: [
      {
        id: "ent-4f12-1",
        entryType: "dues_collected",
        direction: "credit",
        amount: 50,
        currency: "CHF",
        description: "April dues — Marisol Reyes",
        fundCategorySlug: "general",
        fundCategoryName: "General",
        runningBalance: 1240.55,
        postedAt: "2026-05-10T07:42:00Z",
        recordedByName: "Marisol R.",
      },
      {
        id: "ent-4f12-2",
        entryType: "fee_payment",
        direction: "debit",
        amount: 102,
        currency: "CHF",
        description: "BR-ZX09RKLM · March platform fee",
        fundCategorySlug: "general",
        fundCategoryName: "General",
        runningBalance: 1190.55,
        postedAt: "2026-05-07T09:30:00Z",
        recordedByName: "System",
      },
      {
        id: "ent-4f12-3",
        entryType: "dues_collected",
        direction: "credit",
        amount: 50,
        currency: "CHF",
        description: "April dues — Pio Mendoza",
        fundCategorySlug: "general",
        fundCategoryName: "General",
        runningBalance: 1292.55,
        postedAt: "2026-04-30T18:11:00Z",
        recordedByName: "Marisol R.",
      },
      {
        id: "ent-4f12-4",
        entryType: "adjustment",
        direction: "credit",
        amount: 400,
        currency: "CHF",
        description: "Annual fundraiser proceeds",
        fundCategorySlug: "welfare",
        fundCategoryName: "Welfare",
        runningBalance: 1242.55,
        postedAt: "2026-04-22T20:00:00Z",
        recordedByName: "Marisol R.",
      },
    ],
    createdAt: "2024-11-22T09:00:00Z",
    updatedAt: "2026-05-10T07:42:00Z",
  },
];

export function findAssociationAccountByNumber(accountNumber: string): AssociationAccount | undefined {
  return ACCOUNTS.find((a) => a.accountNumber === accountNumber);
}

export function findAssociationAccountById(id: string): AssociationAccount | undefined {
  return ACCOUNTS.find((a) => a.id === id || a.accountNumber === id);
}
