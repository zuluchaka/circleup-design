// =============================================================================
// Treasury & Funds - Data Types
// =============================================================================

// -----------------------------------------------------------------------------
// Fund Types
// -----------------------------------------------------------------------------

export type FundStatus = 'forming' | 'active' | 'paused' | 'completed' | 'cancelled'
export type ReconciliationStatus = 'pending' | 'matched' | 'discrepancy' | 'resolved'

export interface Fund {
  id: string
  circleId: string
  circleName: string
  status: FundStatus
  currency: string
  totalBalance: number
  availableBalance: number
  heldBalance: number
  emergencyFundBalance: number
  investedBalance: number
  pendingContributions: number
  pendingPayouts: number
  lastReconciliationDate: string | null
  reconciliationStatus: ReconciliationStatus
  createdAt: string
  updatedAt: string
}

// -----------------------------------------------------------------------------
// Transaction Types
// -----------------------------------------------------------------------------

export type TransactionType =
  | 'contribution'
  | 'payout'
  | 'fee'
  | 'refund'
  | 'transfer'
  | 'welfare'
  | 'emergency_fund'
  | 'investment_return'

export type TransactionDirection = 'credit' | 'debit'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Transaction {
  id: string
  fundId: string
  type: TransactionType
  direction: TransactionDirection
  amount: number
  currency: string
  status: TransactionStatus
  description: string
  memberName: string | null
  memberId: string | null
  cycleNumber: number | null
  runningBalance: number
  stripeChargeId: string | null
  scheduledDate?: string
  failureReason?: string
  createdAt: string
  completedAt: string | null
}

// -----------------------------------------------------------------------------
// Reconciliation Types
// -----------------------------------------------------------------------------

export type DiscrepancySeverity = 'low' | 'medium' | 'high' | 'critical'
export type DiscrepancyType = 'missing_credit' | 'missing_debit' | 'amount_mismatch' | 'duplicate' | 'unmatched'

export interface Discrepancy {
  id: string
  type: DiscrepancyType
  description: string
  expectedAmount: number
  actualAmount: number
  severity: DiscrepancySeverity
  suggestedAction: string
  relatedTransactionId?: string
}

export interface ReconciliationRecord {
  id: string
  fundId: string
  date: string
  status: ReconciliationStatus
  expectedBalance: number
  actualBalance: number
  discrepancyAmount: number
  discrepancies: Discrepancy[]
  matchedTransactions: number
  unmatchedTransactions: number
  runAt: string
  resolvedAt: string | null
  resolvedBy: string | null
  notes: string | null
}

// -----------------------------------------------------------------------------
// Emergency Fund Types
// -----------------------------------------------------------------------------

export type EmergencyFundRequestStatus = 'draft' | 'voting' | 'approved' | 'denied' | 'disbursed' | 'cancelled'
export type VoteChoice = 'approve' | 'deny'

export interface SupportingDocument {
  id: string
  name: string
  url: string
  uploadedAt: string
}

export interface RepaymentPlan {
  months: number
  monthlyAmount: number
}

export interface EmergencyFundRequest {
  id: string
  fundId: string
  circleId: string
  requesterId: string
  requesterName: string
  amountRequested: number
  currency: string
  reason: string
  description: string
  supportingDocuments: SupportingDocument[]
  status: EmergencyFundRequestStatus
  votingDeadline: string
  votesRequired: number
  votesReceived: number
  votesApprove: number
  votesDeny: number
  repaymentPlan: RepaymentPlan
  createdAt: string
  decidedAt: string | null
  disbursedAt: string | null
}

export interface EmergencyFundVote {
  id: string
  requestId: string
  voterId: string
  voterName: string
  vote: VoteChoice
  comment: string | null
  votedAt: string
}

// -----------------------------------------------------------------------------
// Investment Types
// -----------------------------------------------------------------------------

export type InstrumentType = 'money_market' | 'treasury_bill' | 'cd' | 'savings_bond'
export type RiskLevel = 'very_low' | 'low' | 'medium'
export type InvestmentStatus = 'active' | 'matured' | 'withdrawn'

export interface Investment {
  id: string
  fundId: string
  instrumentType: InstrumentType
  instrumentName: string
  allocatedAmount: number
  currentValue: number
  currency: string
  annualYield: number
  riskLevel: RiskLevel
  liquidityDays: number
  maturityDate: string | null
  status: InvestmentStatus
  allocatedAt: string
  lastValueUpdate: string
}

export interface InvestmentInstrument {
  id: string
  type: InstrumentType
  name: string
  ticker: string | null
  currentYield: number
  riskLevel: RiskLevel
  liquidityDays: number
  minimumInvestment: number
  description: string
}

// -----------------------------------------------------------------------------
// Currency Types
// -----------------------------------------------------------------------------

export type PayoutMode = 'fixed' | 'floating'

export interface CurrencyPreference {
  id: string
  circleId: string
  circleName: string
  baseCurrency: string
  payoutCurrency: string
  payoutMode: PayoutMode
  enableMultiCurrency: boolean
  alternativeCurrencies?: string[]
  exchangeRateAlertThreshold: number | null
  updatedAt: string
}

export interface ExchangeRate {
  baseCurrency: string
  targetCurrency: string
  rate: number
  change24h: number
  updatedAt: string
}

// -----------------------------------------------------------------------------
// Audit Report Types
// -----------------------------------------------------------------------------

export type ReportType = 'annual_summary' | 'transaction_detail' | 'reconciliation' | 'compliance'
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type ReportFormat = 'pdf' | 'excel' | 'csv'

export interface ReportSummary {
  totalContributions: number
  totalPayouts: number
  totalFees: number
  emergencyFundDisbursements: number
  investmentReturns: number
  netChange: number
}

export interface AuditReport {
  id: string
  fundIds: string[]
  reportType: ReportType
  title: string
  dateRangeStart: string
  dateRangeEnd: string
  status: ReportStatus
  generatedAt: string
  generatedBy: string
  generatedByName: string
  fileUrl: string | null
  fileSize: number | null
  format: ReportFormat
  summary: ReportSummary | null
  estimatedCompletionAt?: string
}

// -----------------------------------------------------------------------------
// Dashboard Types
// -----------------------------------------------------------------------------

export interface DashboardSummary {
  totalPortfolioValue: number
  totalAvailableBalance: number
  totalEmergencyFunds: number
  totalInvested: number
  pendingTransactions: number
  unresolvedDiscrepancies: number
  activeEmergencyRequests: number
  last30DaysInflows: number
  last30DaysOutflows: number
  netCashFlow: number
  managedCircles: number
}

// =============================================================================
// Component Props
// =============================================================================

// -----------------------------------------------------------------------------
// Treasury Dashboard Props
// -----------------------------------------------------------------------------

export interface TreasuryDashboardProps {
  /** Summary metrics for the dashboard header */
  summary: DashboardSummary
  /** List of funds the user manages */
  funds: Fund[]
  /** Recent transactions across all funds */
  recentTransactions: Transaction[]
  /** Called when user clicks on a fund card */
  onViewFund?: (fundId: string) => void
  /** Called when user initiates a transfer */
  onTransfer?: () => void
  /** Called when user opens reconciliation */
  onReconcile?: () => void
  /** Called when user wants to generate a report */
  onGenerateReport?: () => void
}

// -----------------------------------------------------------------------------
// Circle Fund Detail Props
// -----------------------------------------------------------------------------

export interface CircleFundDetailProps {
  /** The fund to display */
  fund: Fund
  /** Transaction history for this fund */
  transactions: Transaction[]
  /** Called when user wants to filter transactions */
  onFilterTransactions?: (filters: TransactionFilters) => void
  /** Called when user exports a statement */
  onExportStatement?: (format: ReportFormat) => void
  /** Called when user navigates back */
  onBack?: () => void
}

export interface TransactionFilters {
  dateFrom?: string
  dateTo?: string
  type?: TransactionType
  status?: TransactionStatus
  memberId?: string
}

// -----------------------------------------------------------------------------
// Transaction Ledger Props
// -----------------------------------------------------------------------------

export interface TransactionLedgerProps {
  /** All transactions to display */
  transactions: Transaction[]
  /** Current filter state */
  filters?: TransactionFilters
  /** Called when filters change */
  onFilterChange?: (filters: TransactionFilters) => void
  /** Called when user searches */
  onSearch?: (query: string) => void
  /** Called when user exports transactions */
  onExport?: (format: ReportFormat) => void
  /** Called when user clicks on a transaction for details */
  onViewTransaction?: (transactionId: string) => void
}

// -----------------------------------------------------------------------------
// Reconciliation Console Props
// -----------------------------------------------------------------------------

export interface ReconciliationConsoleProps {
  /** Reconciliation records to display */
  records: ReconciliationRecord[]
  /** Called when user approves a match */
  onApproveMatch?: (discrepancyId: string) => void
  /** Called when user flags for review */
  onFlagForReview?: (discrepancyId: string, notes: string) => void
  /** Called when user makes a manual adjustment */
  onManualAdjust?: (discrepancyId: string, adjustment: number, notes: string) => void
  /** Called when user views historical reports */
  onViewHistory?: () => void
  /** Called when user configures schedule */
  onConfigureSchedule?: () => void
}

// -----------------------------------------------------------------------------
// Emergency Fund Panel Props
// -----------------------------------------------------------------------------

export interface EmergencyFundPanelProps {
  /** The fund containing the emergency reserve */
  fund: Fund
  /** Active and recent emergency fund requests */
  requests: EmergencyFundRequest[]
  /** Votes for the current user to see their vote status */
  userVotes: EmergencyFundVote[]
  /** Current user ID to determine if they've voted */
  currentUserId: string
  /** Called when user submits a new request */
  onSubmitRequest?: (request: NewEmergencyRequest) => void
  /** Called when user casts a vote */
  onVote?: (requestId: string, vote: VoteChoice, comment?: string) => void
  /** Called when user views request details */
  onViewRequest?: (requestId: string) => void
  /** Called when configuring replenishment settings */
  onConfigureReplenishment?: () => void
}

export interface NewEmergencyRequest {
  amountRequested: number
  reason: string
  description: string
  supportingDocuments: File[]
  repaymentMonths: number
}

// -----------------------------------------------------------------------------
// Investment Manager Props
// -----------------------------------------------------------------------------

export interface InvestmentManagerProps {
  /** Current investments for the fund */
  investments: Investment[]
  /** Available investment instruments */
  instruments: InvestmentInstrument[]
  /** Fund balance available for investment */
  availableBalance: number
  /** Called when user allocates funds */
  onAllocate?: (instrumentId: string, amount: number) => void
  /** Called when user withdraws from investment */
  onWithdraw?: (investmentId: string, amount: number) => void
  /** Called when user adjusts allocation */
  onAdjustAllocation?: (allocations: AllocationChange[]) => void
}

export interface AllocationChange {
  investmentId: string
  newAmount: number
}

// -----------------------------------------------------------------------------
// Multi-Currency Settings Props
// -----------------------------------------------------------------------------

export interface MultiCurrencySettingsProps {
  /** Current currency preferences */
  preferences: CurrencyPreference[]
  /** Current exchange rates */
  exchangeRates: ExchangeRate[]
  /** Called when user updates preferences */
  onUpdatePreferences?: (circleId: string, preferences: Partial<CurrencyPreference>) => void
  /** Called when user sets up an alert */
  onSetupAlert?: (circleId: string, threshold: number) => void
  /** Called when user uses the converter */
  onConvert?: (amount: number, from: string, to: string) => number
}

// -----------------------------------------------------------------------------
// Audit Report Generator Props
// -----------------------------------------------------------------------------

export interface AuditReportGeneratorProps {
  /** Available funds to include in reports */
  funds: Fund[]
  /** Previously generated reports */
  reports: AuditReport[]
  /** Called when user generates a new report */
  onGenerateReport?: (config: ReportConfig) => void
  /** Called when user downloads a report */
  onDownloadReport?: (reportId: string) => void
  /** Called when user schedules a report */
  onScheduleReport?: (config: ReportConfig, schedule: ReportSchedule) => void
}

export interface ReportConfig {
  reportType: ReportType
  fundIds: string[]
  dateRangeStart: string
  dateRangeEnd: string
  format: ReportFormat
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
}
