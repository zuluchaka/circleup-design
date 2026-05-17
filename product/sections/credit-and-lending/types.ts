// =============================================================================
// Core User Types
// =============================================================================

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
  kycStatus: 'none' | 'pending' | 'basic' | 'enhanced'
}

// =============================================================================
// Credit Score Types
// =============================================================================

export interface CreditScoreFactor {
  weight: number
  score: number
  label: string
  description: string
}

export interface CreditScoreHistory {
  date: string
  score: number
}

export interface CreditScore {
  userId: string
  score: number
  maxScore: number
  tier: 'poor' | 'fair' | 'good' | 'excellent'
  lastUpdated: string
  factors: {
    paymentHistory: CreditScoreFactor
    verification: CreditScoreFactor
    tenure: CreditScoreFactor
    engagement: CreditScoreFactor
    network: CreditScoreFactor
    external: CreditScoreFactor
  }
  history: CreditScoreHistory[]
  improvementTips: string[]
}

// =============================================================================
// Payout Advance Types
// =============================================================================

export type PayoutAdvanceStatus = 'eligible' | 'pending' | 'approved' | 'active' | 'repaid' | 'defaulted'

export interface PayoutAdvance {
  id: string
  userId: string
  circleId: string
  circleName: string
  payoutId: string
  scheduledPayoutDate: string
  scheduledPayoutAmount: number
  advanceAmount: number | null
  feeAmount: number | null
  feePercentage: number
  netAdvanceAmount: number | null
  status: PayoutAdvanceStatus
  requestedAt?: string
  approvedAt?: string
  disbursedAt?: string
  repaymentMethod?: 'auto_from_payout' | 'manual' | 'payment_method'
  repaymentDate?: string
  repaidAt?: string
  maxAdvanceAmount?: number
  eligibilityScore?: number
  eligibilityFactors?: string[]
}

// =============================================================================
// Loan Types
// =============================================================================

export type LoanStatus = 'pending' | 'approved' | 'active' | 'completed' | 'defaulted' | 'restructured'
export type LoanType = 'personal' | 'business' | 'education' | 'emergency'

export interface Guarantor {
  id: string
  memberId: string
  memberName: string
  memberAvatarUrl: string
  status: 'pending' | 'confirmed' | 'declined'
  guaranteedAmount: number
  confirmedAt?: string
}

export interface CircleBacking {
  circleId: string
  circleName: string
  contributionHistory: number
  onTimePercentage: number
}

export interface Loan {
  id: string
  userId: string
  type: LoanType
  purpose: string
  principalAmount: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  totalInterest: number
  totalRepayment: number
  remainingBalance: number
  paidAmount: number
  status: LoanStatus
  disbursedAt: string
  completedAt?: string
  nextPaymentDate?: string
  nextPaymentAmount?: number
  paymentsCompleted: number
  paymentsRemaining: number
  autoRepaymentEnabled: boolean
  repaymentSourceType: 'payout' | 'payment_method'
  repaymentSourceId: string
  repaymentSourceLabel: string
  guarantors: Guarantor[]
  circleBackings: CircleBacking[]
}

// =============================================================================
// Scheduled Payment Types
// =============================================================================

export type ScheduledPaymentStatus = 'paid' | 'upcoming' | 'scheduled' | 'overdue' | 'missed'

export interface ScheduledPayment {
  id: string
  loanId: string
  paymentNumber: number
  dueDate: string
  principalAmount: number
  interestAmount: number
  totalAmount: number
  status: ScheduledPaymentStatus
  paidAt: string | null
}

// =============================================================================
// Loan Application Types
// =============================================================================

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'declined' | 'withdrawn'
export type DocumentStatus = 'pending' | 'verified' | 'rejected'

export interface ApplicationDocument {
  id: string
  name: string
  fileName: string
  status: DocumentStatus
  uploadedAt: string
}

export interface ProposedTerms {
  approvedAmount: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  totalRepayment: number
}

export interface GuarantorRequest {
  id: string
  memberId: string
  memberName: string
  memberAvatarUrl: string
  guaranteeAmount: number
  status: 'pending' | 'accepted' | 'declined'
  requestedAt: string
}

export interface LoanApplication {
  id: string
  userId: string
  type: LoanType
  purpose: string
  requestedAmount: number
  requestedTermMonths: number
  status: ApplicationStatus
  submittedAt: string
  estimatedDecisionDate?: string
  documents: ApplicationDocument[]
  proposedTerms?: ProposedTerms
  guarantorRequests: GuarantorRequest[]
}

// =============================================================================
// Collective Loan Types
// =============================================================================

export type CollectiveLoanStatus = 'voting' | 'approved' | 'declined' | 'disbursed' | 'repaying' | 'completed'

export interface CollectiveLoan {
  id: string
  circleId: string
  circleName: string
  requesterId: string
  requesterName: string
  requesterAvatarUrl: string
  purpose: string
  requestedAmount: number
  proposedTermMonths: number
  interestRate: number
  monthlyRepayment: number
  status: CollectiveLoanStatus
  requestedAt: string
  votingDeadline: string
  approvedAt?: string
  disbursedAt?: string
  votesRequired: number
  votesReceived: number
  votesApproved: number
  votesDenied: number
  currentUserVoted: boolean
  collectiveGuaranteePool: number
  memberGuaranteeShare: number
  remainingBalance?: number
  paymentsCompleted?: number
}

export interface CollectiveLoanVote {
  id: string
  collectiveLoanId: string
  memberId: string
  memberName: string
  vote: 'approve' | 'deny'
  comment: string | null
  votedAt: string
}

// =============================================================================
// Pre-Qualification Types
// =============================================================================

export type PreQualificationType = 'payout_advance' | 'personal_loan' | 'business_loan' | 'partner_credit_card'
export type PreQualificationStatus = 'qualified' | 'not_qualified' | 'pending_verification'

export interface PreQualificationOffer {
  id: string
  type: PreQualificationType
  title: string
  description: string
  maxAmount: number
  minCreditScore: number
  feeRange: string
  termRange: string
  status: PreQualificationStatus
  qualificationMessage: string
  requiredScoreIncrease?: number
  partnerName?: string
}

// =============================================================================
// Credit Bureau Types
// =============================================================================

export type BureauStatus = 'pending' | 'active' | 'paused' | 'error'

export interface CreditBureau {
  id: string
  name: string
  country: string
  status: BureauStatus
  lastReportedAt: string | null
  paymentsReported: number
}

export interface CreditBuildingMilestone {
  name: string
  completedAt?: string
  progressPercent?: number
}

export interface CreditBuildingProgress {
  currentLevel: number
  maxLevel: number
  currentLevelName: string
  nextLevelName: string
  progressPercent: number
  milestonesCompleted: CreditBuildingMilestone[]
  milestonesRemaining: CreditBuildingMilestone[]
}

export interface CreditBureauStatus {
  userId: string
  optedIn: boolean
  optedInAt: string | null
  bureaus: CreditBureau[]
  creditBuildingProgress: CreditBuildingProgress
}

// =============================================================================
// Credit Tips Types
// =============================================================================

export type TipCategory = 'payment_history' | 'verification' | 'tenure' | 'engagement' | 'network' | 'external'
export type TipActionType = 'enable_autopay' | 'invite_member' | 'view_bureau_info' | 'join_circle' | null

export interface CreditTip {
  id: string
  category: TipCategory
  title: string
  description: string
  actionLabel: string | null
  actionType: TipActionType
  impactLevel: 'low' | 'medium' | 'high'
  estimatedScoreImpact: string
  completed?: boolean
}

// =============================================================================
// Simulator Types
// =============================================================================

export type SimulatorAction = 'make_on_time_payments' | 'join_new_circle' | 'complete_loan' | 'invite_members' | 'enable_autopay'

export interface SimulatorScenario {
  id: string
  action: SimulatorAction
  label: string
  currentValue: number
  targetValue: number
  scoreImpact: number
  newProjectedScore: number
}

// =============================================================================
// Admin/Portfolio Types
// =============================================================================

export type RiskLevel = 'low' | 'medium' | 'high'
export type CollectionStatus = 'first_notice_sent' | 'second_notice_sent' | 'payment_plan_offered' | 'payment_plan_active' | 'escalated' | 'legal_action'

export interface RiskDistributionItem {
  count: number
  amount: number
  percentage: number
}

export interface CollectionItem {
  id: string
  loanId: string
  borrowerName: string
  amount: number
  daysOverdue: number
  status: CollectionStatus
  lastContactAt: string
}

export interface EarlyWarningIndicator {
  id: string
  borrowerName: string
  loanId: string
  indicator: 'missed_circle_contribution' | 'credit_score_decline' | 'payment_pattern_change' | 'reduced_engagement'
  riskLevel: RiskLevel
  detectedAt: string
}

export interface PortfolioMetrics {
  totalLoansOutstanding: number
  totalActiveLoans: number
  totalAdvancesOutstanding: number
  totalActiveAdvances: number
  averageLoanAmount: number
  averageInterestRate: number
  delinquencyRate: number
  defaultRate: number
  collectionsAmount: number
  writeOffsYTD: number
  riskDistribution: {
    low: RiskDistributionItem
    medium: RiskDistributionItem
    high: RiskDistributionItem
  }
  collectionQueue: CollectionItem[]
  earlyWarningIndicators: EarlyWarningIndicator[]
}

// =============================================================================
// Partner Bank Types
// =============================================================================

export interface PartnerBank {
  id: string
  name: string
  logo: string
  description: string
  productsOffered: string[]
  minCreditScore: number
  specialOffer: string
}

// =============================================================================
// Payment Method Types
// =============================================================================

export type PaymentMethodType = 'card' | 'sepa_debit' | 'bank_account'

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  brand?: string
  bankName?: string
  last4: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

// =============================================================================
// Upcoming Payout Types
// =============================================================================

export interface UpcomingPayout {
  id: string
  circleId: string
  circleName: string
  amount: number
  scheduledDate: string
  position: number
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the Credit Score Dashboard component */
export interface CreditScoreDashboardProps {
  creditScore: CreditScore
  simulatorScenarios: SimulatorScenario[]
  creditTips: CreditTip[]
  /** Called when user wants to run a simulation scenario */
  onRunSimulation?: (scenarioId: string) => void
  /** Called when user takes action on a tip */
  onTipAction?: (tip: CreditTip) => void
}

/** Props for the Payout Advances component */
export interface PayoutAdvancesProps {
  advances: PayoutAdvance[]
  upcomingPayouts: UpcomingPayout[]
  paymentMethods: PaymentMethod[]
  /** Called when user requests an advance on a payout */
  onRequestAdvance?: (payoutId: string, amount: number) => void
  /** Called when user wants to view advance details */
  onViewAdvance?: (advanceId: string) => void
  /** Called when user calculates early repayment */
  onCalculateEarlyRepayment?: (advanceId: string) => void
  /** Called when user changes repayment settings */
  onUpdateRepaymentSettings?: (advanceId: string, settings: { method: string; sourceId?: string }) => void
}

/** Props for the Loans List component */
export interface LoansListProps {
  loans: Loan[]
  scheduledPayments: ScheduledPayment[]
  /** Called when user wants to view loan details */
  onViewLoan?: (loanId: string) => void
  /** Called when user wants to make an extra payment */
  onMakePayment?: (loanId: string, amount: number) => void
  /** Called when user calculates early repayment savings */
  onCalculateEarlyRepayment?: (loanId: string) => void
  /** Called when user requests restructuring */
  onRequestRestructuring?: (loanId: string) => void
  /** Called when user wants to refinance */
  onRefinance?: (loanId: string) => void
}

/** Props for the Loan Application component */
export interface LoanApplicationProps {
  applications: LoanApplication[]
  preQualificationOffers: PreQualificationOffer[]
  creditScore: CreditScore
  /** Called when user starts a new loan application */
  onStartApplication?: (type: LoanType, amount: number, termMonths: number, purpose: string) => void
  /** Called when user uploads a document */
  onUploadDocument?: (applicationId: string, file: File, documentType: string) => void
  /** Called when user requests a guarantor */
  onRequestGuarantor?: (applicationId: string, memberId: string, amount: number) => void
  /** Called when user accepts proposed terms */
  onAcceptTerms?: (applicationId: string) => void
  /** Called when user withdraws an application */
  onWithdrawApplication?: (applicationId: string) => void
}

/** Props for the Collective Lending component */
export interface CollectiveLendingProps {
  collectiveLoans: CollectiveLoan[]
  votes: CollectiveLoanVote[]
  /** Called when user casts a vote on a collective loan */
  onVote?: (loanId: string, vote: 'approve' | 'deny', comment?: string) => void
  /** Called when user wants to view loan details */
  onViewLoan?: (loanId: string) => void
  /** Called when user requests a new collective loan */
  onRequestCollectiveLoan?: (circleId: string, amount: number, termMonths: number, purpose: string) => void
}

/** Props for the Credit Bureau component */
export interface CreditBureauProps {
  bureauStatus: CreditBureauStatus
  /** Called when user opts in to credit bureau reporting */
  onOptIn?: () => void
  /** Called when user opts out of credit bureau reporting */
  onOptOut?: () => void
  /** Called when user wants to export loan documentation */
  onExportDocumentation?: () => void
  /** Called when user requests partner bank introduction */
  onRequestBankIntroduction?: (bankId: string) => void
}

/** Props for the Partner Banks component */
export interface PartnerBanksProps {
  partnerBanks: PartnerBank[]
  creditScore: CreditScore
  /** Called when user requests an introduction to a partner bank */
  onRequestIntroduction?: (bankId: string) => void
}

/** Props for the Admin Portfolio Dashboard component */
export interface PortfolioDashboardProps {
  metrics: PortfolioMetrics
  /** Called when admin views a loan in collection */
  onViewCollectionItem?: (itemId: string) => void
  /** Called when admin takes action on a collection item */
  onCollectionAction?: (itemId: string, action: 'call' | 'email' | 'escalate' | 'write_off') => void
  /** Called when admin views early warning details */
  onViewWarningDetails?: (warningId: string) => void
  /** Called when admin exports portfolio report */
  onExportReport?: (format: 'pdf' | 'csv' | 'excel') => void
}

/** Props for the main Credit & Lending section */
export interface CreditAndLendingProps {
  currentUser: User
  creditScore: CreditScore
  payoutAdvances: PayoutAdvance[]
  loans: Loan[]
  scheduledPayments: ScheduledPayment[]
  loanApplications: LoanApplication[]
  collectiveLoans: CollectiveLoan[]
  collectiveLoanVotes: CollectiveLoanVote[]
  preQualificationOffers: PreQualificationOffer[]
  creditBureauStatus: CreditBureauStatus
  creditTips: CreditTip[]
  simulatorScenarios: SimulatorScenario[]
  partnerBanks: PartnerBank[]
  paymentMethods: PaymentMethod[]
  upcomingPayouts: UpcomingPayout[]
  portfolioMetrics?: PortfolioMetrics
  isAdmin?: boolean
  // Credit Score actions
  onRunSimulation?: (scenarioId: string) => void
  onTipAction?: (tip: CreditTip) => void
  // Advance actions
  onRequestAdvance?: (payoutId: string, amount: number) => void
  onViewAdvance?: (advanceId: string) => void
  // Loan actions
  onViewLoan?: (loanId: string) => void
  onMakePayment?: (loanId: string, amount: number) => void
  onRequestRestructuring?: (loanId: string) => void
  onRefinance?: (loanId: string) => void
  // Application actions
  onStartApplication?: (type: LoanType, amount: number, termMonths: number, purpose: string) => void
  onUploadDocument?: (applicationId: string, file: File, documentType: string) => void
  onRequestGuarantor?: (applicationId: string, memberId: string, amount: number) => void
  onAcceptTerms?: (applicationId: string) => void
  // Collective lending actions
  onVote?: (loanId: string, vote: 'approve' | 'deny', comment?: string) => void
  onRequestCollectiveLoan?: (circleId: string, amount: number, termMonths: number, purpose: string) => void
  // Credit bureau actions
  onOptInBureau?: () => void
  onOptOutBureau?: () => void
  onExportDocumentation?: () => void
  onRequestBankIntroduction?: (bankId: string) => void
  // Admin actions
  onViewCollectionItem?: (itemId: string) => void
  onCollectionAction?: (itemId: string, action: 'call' | 'email' | 'escalate' | 'write_off') => void
  onExportReport?: (format: 'pdf' | 'csv' | 'excel') => void
}
