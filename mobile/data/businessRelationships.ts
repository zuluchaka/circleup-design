// Types + sample data for Business Relationships.
// Shapes follow the Rails `BusinessRelationship` model + `app/javascript/components/b2b/types.ts`.

export type BrStatus = "pending" | "active" | "suspended" | "terminated";
export type BrTier = "free" | "basic" | "pro";
export type BrRelationshipType = "management" | "advisory" | "audit";

export type BrAssociationType =
  | "cultural"
  | "religious"
  | "professional"
  | "savings"
  | "social"
  | "family";

export type BusinessRelationship = {
  id: string;
  reference: string; // BR-XXXXXXXX
  associationName: string;
  associationLogo: string;
  associationType: BrAssociationType;
  region: string;
  memberCount: number;
  status: BrStatus;
  tier: BrTier;
  relationshipType: BrRelationshipType;
  monthlyRevenue: number;
  currency: "CHF" | "EUR";
  startedAt: string | null;
  contractEndDate: string | null;
  renewalDeadline: string | null;
  graceDaysLeft?: number;
  overdueAmount?: number;
  isExpiringSoon?: boolean;
  isChurnRisk?: boolean;
};

export type BrRenewalStatus =
  | "pending"
  | "auto_renew"
  | "manual_renew"
  | "declined"
  | "expired";

export type BrDataExportStatus =
  | "not_requested"
  | "requested"
  | "processing"
  | "ready"
  | "expired";

export type BillingStatus = "pending" | "invoiced" | "paid" | "overdue" | "cancelled" | "refunded";

export type BillingRecord = {
  id: string;
  reference: string;
  periodStart: string;
  periodEnd: string;
  subscriptionAmount: number;
  platformFeeAmount: number;
  totalAmount: number;
  currency: "CHF" | "EUR";
  status: BillingStatus;
  paidAt: string | null;
};

export type BusinessRelationshipDetail = BusinessRelationship & {
  associationLegalName: string;
  presidentName: string;
  presidentEmail: string;
  managerName: string;
  managerEmployeeId: string;
  feeAgreement: {
    percentage?: number;
    flatAmount?: number;
    currency: "CHF" | "EUR";
  };
  renewalStatus: BrRenewalStatus | null;
  suspensionReason?: string;
  suspensionEffectiveAt?: string;
  gracePeriodEnd?: string;
  terminationNoticeDate?: string;
  terminationEffectiveAt?: string;
  legalReviewRequired?: boolean;
  dataExportStatus: BrDataExportStatus;
  dataExportAvailableUntil?: string;
  associationAccountId?: string;
  associationAccountNumber?: string;
  recentBilling: BillingRecord[];
  createdAt: string;
  updatedAt: string;
};

export const BR_TIER_LABEL: Record<BrTier, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
};

export const BR_STATUS_FILTERS: { value: BrStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "terminated", label: "Terminated" },
];

export const BR_TIER_FILTERS: { value: BrTier | "all"; label: string }[] = [
  { value: "all", label: "All tiers" },
  { value: "pro", label: "Pro" },
  { value: "basic", label: "Basic" },
  { value: "free", label: "Free" },
];

export const BR_RISK_FILTERS: { value: "all" | "expiring" | "churn" | "overdue"; label: string }[] = [
  { value: "all", label: "Healthy + risk" },
  { value: "expiring", label: "Expiring ≤ 60d" },
  { value: "churn", label: "Churn risk" },
  { value: "overdue", label: "Overdue billing" },
];

export const RELATIONSHIPS: BusinessRelationship[] = [
  {
    id: "br1",
    reference: "BR-7K2NQ4XF",
    associationName: "Senegalese Union of Switzerland",
    associationLogo:
      "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=200&h=200&fit=crop",
    associationType: "cultural",
    region: "Geneva · CH",
    memberCount: 1240,
    status: "active",
    tier: "pro",
    relationshipType: "management",
    monthlyRevenue: 420,
    currency: "CHF",
    startedAt: "2025-02-10",
    contractEndDate: "2026-08-10",
    renewalDeadline: null,
    isExpiringSoon: false,
  },
  {
    id: "br2",
    reference: "BR-MT81PWQ3",
    associationName: "Latina Tanda Network",
    associationLogo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    associationType: "savings",
    region: "Lausanne · CH",
    memberCount: 480,
    status: "active",
    tier: "basic",
    relationshipType: "management",
    monthlyRevenue: 160,
    currency: "CHF",
    startedAt: "2025-09-01",
    contractEndDate: "2026-07-01",
    renewalDeadline: "2026-05-02",
    isExpiringSoon: true,
  },
  {
    id: "br3",
    reference: "BR-G4VLPQ22",
    associationName: "Indian Professionals Zurich",
    associationLogo:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop",
    associationType: "professional",
    region: "Zurich · CH",
    memberCount: 620,
    status: "pending",
    tier: "pro",
    relationshipType: "advisory",
    monthlyRevenue: 0,
    currency: "CHF",
    startedAt: null,
    contractEndDate: null,
    renewalDeadline: null,
  },
  {
    id: "br4",
    reference: "BR-ZX09RKLM",
    associationName: "Filipino Community Basel",
    associationLogo:
      "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=200&h=200&fit=crop",
    associationType: "religious",
    region: "Basel · CH",
    memberCount: 290,
    status: "suspended",
    tier: "basic",
    relationshipType: "management",
    monthlyRevenue: 0,
    currency: "CHF",
    startedAt: "2024-11-22",
    contractEndDate: "2026-11-22",
    renewalDeadline: null,
    graceDaysLeft: 12,
    overdueAmount: 320,
    isChurnRisk: true,
  },
  {
    id: "br5",
    reference: "BR-J3D9KP44",
    associationName: "Caribbean Welfare Society",
    associationLogo:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
    associationType: "social",
    region: "Geneva · CH",
    memberCount: 175,
    status: "active",
    tier: "basic",
    relationshipType: "management",
    monthlyRevenue: 80,
    currency: "CHF",
    startedAt: "2025-05-18",
    contractEndDate: "2026-05-18",
    renewalDeadline: "2026-06-17",
    isExpiringSoon: true,
  },
  {
    id: "br6",
    reference: "BR-7QM2L8RT",
    associationName: "West African Heritage Foundation",
    associationLogo:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop",
    associationType: "cultural",
    region: "Zurich HQ · CH",
    memberCount: 612,
    status: "active",
    tier: "pro",
    relationshipType: "management",
    monthlyRevenue: 540,
    currency: "CHF",
    startedAt: "2024-06-04",
    contractEndDate: "2027-06-04",
    renewalDeadline: null,
  },
  {
    id: "br7",
    reference: "BR-MX9V7PCC",
    associationName: "Geneva Diaspora Welfare",
    associationLogo:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop",
    associationType: "social",
    region: "Geneva · CH",
    memberCount: 18,
    status: "terminated",
    tier: "free",
    relationshipType: "advisory",
    monthlyRevenue: 0,
    currency: "CHF",
    startedAt: "2024-12-01",
    contractEndDate: "2026-04-30",
    renewalDeadline: null,
  },
];

// Detail-screen overrides: extend the list shape with contract + billing fixtures.
// Only a few BRs carry rich detail; the rest fall back to a generic shape.
type DetailExtras = Omit<BusinessRelationshipDetail, keyof BusinessRelationship>;

const DETAIL_EXTRAS: Record<string, DetailExtras> = {
  br1: {
    associationLegalName: "Senegalese Union of Switzerland · Geneva",
    presidentName: "Cheikh Diop",
    presidentEmail: "cheikh.diop@union-geneva.ch",
    managerName: "Aminata Diallo",
    managerEmployeeId: "MAF-0142",
    feeAgreement: { percentage: 2.0, flatAmount: 200, currency: "CHF" },
    renewalStatus: null,
    dataExportStatus: "not_requested",
    associationAccountId: "aa-sus-001",
    associationAccountNumber: "ASS-7K2N-PRI",
    recentBilling: [
      {
        id: "bil-1-may",
        reference: "BIL-J4M2P9",
        periodStart: "2026-05-01",
        periodEnd: "2026-05-31",
        subscriptionAmount: 200,
        platformFeeAmount: 220,
        totalAmount: 420,
        currency: "CHF",
        status: "paid",
        paidAt: "2026-05-03",
      },
      {
        id: "bil-1-apr",
        reference: "BIL-J4M2P8",
        periodStart: "2026-04-01",
        periodEnd: "2026-04-30",
        subscriptionAmount: 200,
        platformFeeAmount: 210,
        totalAmount: 410,
        currency: "CHF",
        status: "paid",
        paidAt: "2026-04-03",
      },
    ],
    createdAt: "2025-02-10T12:00:00Z",
    updatedAt: "2026-05-03T09:00:00Z",
  },
  br4: {
    associationLegalName: "Filipino Community Basel e.V.",
    presidentName: "Marisol Reyes",
    presidentEmail: "marisol@filcommunity-basel.ch",
    managerName: "Aminata Diallo",
    managerEmployeeId: "MAF-0142",
    feeAgreement: { percentage: 1.5, flatAmount: 80, currency: "CHF" },
    renewalStatus: null,
    suspensionReason: "Unpaid invoice ×2",
    suspensionEffectiveAt: "2026-05-07T09:30:00Z",
    gracePeriodEnd: "2026-05-31",
    dataExportStatus: "not_requested",
    associationAccountId: "aa-fcb-001",
    associationAccountNumber: "ASS-4F12-PRI",
    recentBilling: [
      {
        id: "br-4-april",
        reference: "BIL-9K3P82",
        periodStart: "2026-04-01",
        periodEnd: "2026-04-30",
        subscriptionAmount: 80,
        platformFeeAmount: 24,
        totalAmount: 104,
        currency: "CHF",
        status: "overdue",
        paidAt: null,
      },
      {
        id: "br-4-march",
        reference: "BIL-9K3P81",
        periodStart: "2026-03-01",
        periodEnd: "2026-03-31",
        subscriptionAmount: 80,
        platformFeeAmount: 22,
        totalAmount: 102,
        currency: "CHF",
        status: "overdue",
        paidAt: null,
      },
      {
        id: "br-4-feb",
        reference: "BIL-9K3P80",
        periodStart: "2026-02-01",
        periodEnd: "2026-02-28",
        subscriptionAmount: 80,
        platformFeeAmount: 19,
        totalAmount: 99,
        currency: "CHF",
        status: "paid",
        paidAt: "2026-03-04",
      },
    ],
    createdAt: "2024-11-20T10:14:00Z",
    updatedAt: "2026-05-07T09:30:00Z",
  },
};

function defaultDetailExtras(br: BusinessRelationship): DetailExtras {
  return {
    associationLegalName: br.associationName,
    presidentName: "—",
    presidentEmail: "—",
    managerName: "Aminata Diallo",
    managerEmployeeId: "MAF-0142",
    feeAgreement: { currency: br.currency },
    renewalStatus: null,
    dataExportStatus: "not_requested",
    recentBilling: [],
    createdAt: br.startedAt ?? "",
    updatedAt: br.startedAt ?? "",
  };
}

export function findRelationshipDetail(id: string): BusinessRelationshipDetail | undefined {
  const br = RELATIONSHIPS.find((r) => r.id === id);
  if (!br) return undefined;
  return { ...br, ...(DETAIL_EXTRAS[id] ?? defaultDetailExtras(br)) };
}
