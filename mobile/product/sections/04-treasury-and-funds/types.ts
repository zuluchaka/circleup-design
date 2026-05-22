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

// ---------------------------------------------------------------------------
// Phase 2 — ledger & reconciliation
// ---------------------------------------------------------------------------

export type AuditEvent = {
  id: string;
  kind: "posted" | "adjusted" | "matched" | "reconciled" | "viewed";
  actor: string;
  actorRole: string;
  at: string;
  body: string;
};

export type RelatedEntry = {
  id: string;
  label: string;
  amount: number;
  at: string;
  link: "predecessor" | "successor";
};

export type EntryDetail = {
  id: string;
  reference: string;
  fundId: string;
  fundName: string;
  kind: "credit" | "debit";
  amount: number;
  currency: string;
  category: LedgerCategory;
  label: string;
  counterparty: string;
  counterpartyId: string;
  counterpartyKind: "member" | "external" | "platform" | "circle";
  at: string;
  balanceBefore: number;
  balanceAfter: number;
  sourceDocument: {
    id: string;
    label: string;
    kind: "pdf" | "csv" | "receipt";
    size: string;
  } | null;
  related: RelatedEntry[];
  audit: AuditEvent[];
};

export type ReconciliationMatch = "matched" | "discrepancy" | "orphan";
export type ReconciliationSide = "platform" | "bank";

export type ReconciliationRow = {
  id: string;
  side: ReconciliationSide;
  date: string;
  label: string;
  amount: number;
  currency: string;
  match: ReconciliationMatch;
  matchedWith: string | null;
  variance: number | null;
};

export type ReconciliationSession = {
  id: string;
  period: string;
  fundId: string;
  bankName: string;
  importedAt: string;
  totals: {
    platform: number;
    bank: number;
    matched: number;
    discrepancy: number;
    orphan: number;
  };
  rows: ReconciliationRow[];
};

// ---------------------------------------------------------------------------
// Phase 3 — reporting & compliance
// ---------------------------------------------------------------------------

export type ReportPeriod = "month" | "quarter" | "year";
export type ReportScope = "all" | "single" | "custom";

export type ReportKpi = {
  id: string;
  label: string;
  value: number;
  trend: "up" | "down" | "flat";
  delta: string;
  toneHint: "good" | "bad" | "neutral";
};

export type BalanceSheetRow = {
  id: string;
  label: string;
  value: number;
  group: "assets" | "liabilities" | "equity";
};

export type CashFlowRow = {
  id: string;
  label: string;
  value: number;
  group: "operating" | "investing" | "financing";
};

export type ReportPreview = {
  period: ReportPeriod;
  scope: ReportScope;
  scopeLabel: string;
  rangeStart: string;
  rangeEnd: string;
  currency: string;
  kpis: ReportKpi[];
  balanceSheet: BalanceSheetRow[];
  cashFlow: CashFlowRow[];
};

export type AuditSection = {
  id: string;
  label: string;
  description: string;
  included: boolean;
  required: boolean;
};

export type SignerAttestation = {
  signerId: string;
  signerName: string;
  signerRole: string;
  signerTrust: number;
  state: "attested" | "pending" | "expired";
  attestedAt: string | null;
  lastReminded: string | null;
};

export type AuditReportSetup = {
  rangeStart: string;
  rangeEnd: string;
  scopeLabel: string;
  format: "pdf" | "csv" | "xbrl";
  sections: AuditSection[];
  attestations: SignerAttestation[];
  estimatedPages: number;
  estimatedSize: string;
};

export type StatementItem = {
  id: string;
  period: string;
  rangeStart: string;
  rangeEnd: string;
  scope: string;
  generatedBy: string;
  generatedAt: string;
  size: string;
  pages: number;
  status: "ready" | "regenerating" | "expired";
  pinned: boolean;
};

export type StatementsPanel = {
  storageUsed: number;
  storageLimit: number;
  items: StatementItem[];
};

// ---------------------------------------------------------------------------
// Phase 4 — currency & investments
// ---------------------------------------------------------------------------

export type SupportedCurrency = {
  code: string;
  name: string;
  flag: string;
  rate: number;
  symbol: string;
};

export type FxProvider = {
  id: string;
  label: string;
  rateBasis: string;
  freshness: string;
};

export type LocaleOption = {
  id: string;
  label: string;
  thousandsSeparator: string;
  decimalSeparator: string;
  example: string;
};

export type MultiCurrencySettings = {
  defaultCurrency: string;
  supported: SupportedCurrency[];
  providers: FxProvider[];
  selectedProviderId: string;
  locales: LocaleOption[];
  selectedLocaleId: string;
  preview: {
    amount: number;
    in: string;
  };
};

export type InvestmentRisk = "low" | "medium" | "high";

export type InvestmentOpportunity = {
  id: string;
  name: string;
  category: "money_market" | "bond_ladder" | "fixed_deposit" | "structured";
  provider: string;
  risk: InvestmentRisk;
  annualReturn: number;
  lockupMonths: number;
  minimumAmount: number;
  currency: string;
  description: string;
  highlights: string[];
};

export type InvestmentPortfolio = {
  idleBalance: number;
  currency: string;
  earningPotential: number;
  opportunities: InvestmentOpportunity[];
  advisorName: string;
  advisorTrust: number;
  lastReviewed: string;
};

// ---------------------------------------------------------------------------
// Phase 5 — Swiss-specific integrations
// ---------------------------------------------------------------------------

export type CsvMappingField =
  | "date"
  | "amount"
  | "description"
  | "counterparty"
  | "reference"
  | "currency"
  | "skip";

export type CsvColumn = {
  id: string;
  label: string;
  sample: string;
  mappedTo: CsvMappingField;
  confidence: "high" | "medium" | "low";
};

export type ImportEntry = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  counterparty: string;
  reference: string;
  match: "ready" | "needs_attention";
  matchReason: string | null;
};

export type PostfinanceImport = {
  step: 1 | 2 | 3 | 4;
  fileName: string;
  fileSize: string;
  bank: string;
  detection: {
    separator: string;
    decimal: string;
    dateFormat: string;
    encoding: string;
    rowCount: number;
    autoDetected: boolean;
  };
  columns: CsvColumn[];
  entries: ImportEntry[];
  summary: {
    ready: number;
    needsAttention: number;
    duplicates: number;
  };
};

export type AccountStatus = "linked" | "reauth_needed" | "expired" | "pending";

export type ExternalAccount = {
  id: string;
  bank: string;
  accountMask: string;
  kind: "bank" | "card_processor" | "wallet";
  status: AccountStatus;
  defaultCurrency: string;
  lastSync: string;
  syncFrequency: string;
  notes: string | null;
  rolesAllowed: string[];
};

export type ExternalAccountsPanel = {
  accounts: ExternalAccount[];
  totals: {
    linked: number;
    needsAttention: number;
  };
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
