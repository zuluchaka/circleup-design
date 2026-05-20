// Section 17 — Business Relationships (CM-only)
//
// Portable typings for design-time screens. Shapes mirror the Rails
// `BusinessRelationship` model and the web `app/javascript/components/b2b/types.ts`
// but are intentionally flattened — implementors should hydrate from the
// `/api/v1/b2b/business_relationships` endpoints.

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

// Lightweight BR shape used by hub list cards and the bottom-nav hub.
export interface BusinessRelationship {
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

  // Risk + lifecycle annotations
  graceDaysLeft?: number;
  overdueAmount?: number;
  isExpiringSoon?: boolean;
  isChurnRisk?: boolean;
}

// Detail-screen extension. Carries everything the BR detail page needs
// in addition to the list shape.
export interface BusinessRelationshipDetail extends BusinessRelationship {
  // Parties
  associationLegalName: string;
  presidentName: string;
  presidentEmail: string;

  // Manager
  managerName: string;
  managerEmployeeId: string;

  // Fee agreement (mirrors Rails `fee_agreement` JSONB)
  feeAgreement: {
    percentage?: number;
    flatAmount?: number;
    currency: "CHF" | "EUR";
  };

  // Lifecycle metadata
  renewalStatus: BrRenewalStatus | null;
  suspensionReason?: string;
  suspensionEffectiveAt?: string;
  gracePeriodEnd?: string;
  terminationNoticeDate?: string;
  terminationEffectiveAt?: string;
  legalReviewRequired?: boolean;
  dataExportStatus: BrDataExportStatus;
  dataExportAvailableUntil?: string;

  // Linked surfaces
  associationAccountId?: string;
  associationAccountNumber?: string;

  // Recent billing (rolled up; full list lives in BillingRecord)
  recentBilling: BillingRecord[];

  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface BillingRecord {
  id: string;
  reference: string;
  periodStart: string;
  periodEnd: string;
  subscriptionAmount: number;
  platformFeeAmount: number;
  totalAmount: number;
  currency: "CHF" | "EUR";
  status: "pending" | "invoiced" | "paid" | "overdue" | "cancelled" | "refunded";
  paidAt: string | null;
}

// Roll-up shown in the CM hub hero.
export interface CmPortfolioSummary {
  employeeId: string;
  managerName: string;
  activeCircles: number;
  maxCircles: number;
  monthlyRevenue: number;
  currency: "CHF" | "EUR";
  activeBrs: number;
  pendingBrs: number;
  atRiskBrs: number;
}
