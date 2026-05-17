// =============================================================================
// Multi-Share Circle Configuration Types
// =============================================================================

export type ShareApprovalMode = 'auto_approve' | 'organizer_approval'
export type SharePayoutMode = 'consolidated' | 'distributed'
export type MinimumHoldPeriod = 'none' | '2_cycles' | '3_cycles' | 'until_payout'
export type CircleStatus = 'forming' | 'active' | 'completed' | 'cancelled'
export type ContributionFrequency = 'weekly' | 'bi_weekly' | 'monthly'

export interface ShareLockPeriod {
  startLockCycles: number
  endLockCycles: number
}

export interface MultiShareConfig {
  enabled: boolean
  maxSharesPerMember: number
  approvalMode: ShareApprovalMode
  totalSharesLimit: number
  currentTotalShares: number
  shareLockPeriod: ShareLockPeriod
  minimumHoldPeriod: MinimumHoldPeriod
  allowTransfers: boolean
  payoutMode: SharePayoutMode
}

export interface Circle {
  id: string
  name: string
  associationId: string
  associationName: string
  status: CircleStatus
  baseContribution: number
  currency: string
  frequency: ContributionFrequency
  totalCycles: number
  currentCycle: number
  maxMembers: number
  currentMemberCount: number
  multiShareConfig: MultiShareConfig
  emergencyFundRate: number
  emergencyFundBalance: number
  totalCollected: number
  totalDisbursed: number
  createdAt: string
  startedAt: string | null
}

// =============================================================================
// Member & Participant Types
// =============================================================================

export type MemberRole = 'organizer' | 'member'
export type PayoutStatus = 'pending' | 'received'
export type KycStatus = 'none' | 'pending' | 'basic' | 'enhanced'

export interface ContributionStats {
  onTime: number
  late: number
  missed: number
}

export interface PendingShareRequest {
  requestId: string
  type: 'increase' | 'reduction' | 'transfer'
  requestedShares: number
  status: 'pending' | 'approved' | 'rejected'
}

export interface Member {
  id: string
  circleId: string
  userId: string
  name: string
  email: string
  avatarUrl: string
  role: MemberRole
  shares: number
  maxEligibleShares: number
  trustScore: number
  kycStatus: KycStatus
  payoutPosition: number
  payoutStatus: PayoutStatus
  contributionStats: ContributionStats
  totalContributed: number
  payoutReceived?: number
  payoutDate?: string
  joinedAt: string
  sharePercentage: number
  pendingShareRequest?: PendingShareRequest
}

// =============================================================================
// Share Request Types
// =============================================================================

export type ShareRequestType = 'increase' | 'reduction' | 'transfer'
export type ShareRequestStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled'
export type RejectionReason = 'circle_balance' | 'trust_concerns' | 'capacity_limit' | 'other'
export type EmergencyReason = 'job_loss' | 'medical' | 'family_emergency' | 'other'

export interface ImpactCalculation {
  currentAmount: number
  newAmount: number
  difference: number
}

export interface ShareRequest {
  id: string
  circleId: string
  circleName: string
  memberId: string
  memberName: string
  memberAvatar: string
  memberTrustScore: number
  type: ShareRequestType
  currentShares: number
  requestedShares: number
  newTotal: number
  status: ShareRequestStatus
  isEmergency?: boolean
  emergencyReason?: EmergencyReason
  emergencyDocumentation?: string
  contributionImpact: ImpactCalculation
  payoutImpact: ImpactCalculation
  requestedAt: string
  decidedAt?: string
  decidedBy?: string
  rejectionReason?: RejectionReason
  rejectionNote?: string
  effectiveFrom?: string
  expiresAt?: string
  notes?: string
}

// =============================================================================
// Share History Types
// =============================================================================

export type ShareEventType =
  | 'initial_allocation'
  | 'increase_requested'
  | 'increase_approved'
  | 'increase_rejected'
  | 'reduction_requested'
  | 'reduction_approved'
  | 'emergency_reduction'
  | 'transfer_sent'
  | 'transfer_received'
  | 'cancelled'

export interface ShareHistoryEntry {
  id: string
  circleId: string
  memberId: string
  memberName: string
  eventType: ShareEventType
  previousShares: number
  newShares: number
  change: number
  timestamp: string
  cycle: number
  requestId?: string
  approvedBy?: string
  rejectedBy?: string
  reason?: string
  note?: string
}

// =============================================================================
// Contribution Types
// =============================================================================

export type ContributionStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ContributionBreakdown {
  sharesContribution: number
  emergencyFund: number
  platformFee: number
  totalDue: number
}

export interface Contribution {
  id: string
  circleId: string
  memberId: string
  memberName: string
  cycle: number
  shareCount: number
  baseAmount: number
  breakdown: ContributionBreakdown
  status: ContributionStatus
  dueDate: string
  paidAt: string | null
  paymentMethod?: string
  transactionRef?: string
  isLate: boolean
  daysLate?: number
  reminderSent?: boolean
  reminderSentAt?: string
}

// =============================================================================
// Payout Types
// =============================================================================

export type PayoutProcessingStatus = 'pending' | 'scheduled' | 'processing' | 'completed' | 'failed'

export interface PayoutCalculation {
  cyclePool: number
  memberPortion: number
  platformFee: number
  netPayout: number
}

export interface Payout {
  id: string
  circleId: string
  memberId: string
  memberName: string
  cycle: number
  position: number
  shareCount: number
  totalCircleShares: number
  sharePercentage: number
  calculation: PayoutCalculation
  status: PayoutProcessingStatus
  scheduledDate: string
  disbursedAt: string | null
  bankAccount?: string
  transferRef?: string
}

// =============================================================================
// Waitlist & Transfer Types
// =============================================================================

export type WaitlistStatus = 'waiting' | 'offer_pending' | 'claimed' | 'expired' | 'left'
export type TransferStatus = 'pending_acceptance' | 'accepted' | 'rejected' | 'expired' | 'cancelled'

export interface AvailableShare {
  fromMemberId: string
  fromMemberName: string
  reason: string
}

export interface ShareWaitlistEntry {
  id: string
  circleId: string
  memberId: string
  memberName: string
  memberTrustScore: number
  position: number
  requestedShares: number
  joinedWaitlistAt: string
  status: WaitlistStatus
  notifiedOfAvailability: boolean
  notifiedAt?: string
  expiresAt: string | null
  availableShare?: AvailableShare
}

export interface ShareTransfer {
  id: string
  circleId: string
  fromMemberId: string
  fromMemberName: string
  toMemberId: string
  toMemberName: string
  shareCount: number
  status: TransferStatus
  initiatedAt: string
  expiresAt: string
  fromMemberCurrentShares: number
  fromMemberNewShares: number
  toMemberCurrentShares: number
  toMemberNewShares: number
  reason?: string
}

// =============================================================================
// Platform Configuration Types
// =============================================================================

export interface TrustScoreTier {
  minShares: number
  maxShares: number
  minTrustScore: number
}

export interface KycRequirement {
  sharesThreshold: number
  requiredLevel: KycStatus
}

export interface DefaultLockPeriods {
  startCycles: number
  endCycles: number
}

export interface PlatformConfig {
  globalMaxSharesPerMember: number
  globalMaxSharesPerCircle: number
  multiShareFeatureEnabled: boolean
  trustScoreTiers: TrustScoreTier[]
  kycRequirements: KycRequirement
  defaultLockPeriods: DefaultLockPeriods
  defaultMinimumHoldPeriod: MinimumHoldPeriod
  emergencyReductionEnabled: boolean
  shareTransfersEnabled: boolean
  waitlistEnabled: boolean
  updatedAt: string
  updatedBy: string
}

// =============================================================================
// Platform Metrics Types
// =============================================================================

export interface MetricsOverview {
  totalCircles: number
  multiShareEnabledCircles: number
  multiShareAdoptionRate: number
  totalPlatformShares: number
  averageSharesPerMember: number
  totalAUM: number
}

export interface ShareRequestMetrics {
  totalRequests: number
  increaseRequests: number
  reductionRequests: number
  transferRequests: number
  approvalRate: number
  averageProcessingTimeHours: number
  pendingRequests: number
}

export interface ConcentrationMetrics {
  circlesWithHighConcentration: number
  averageGiniCoefficient: number
  membersAtMaxShares: number
}

export interface DefaultMetrics {
  multiShareDefaultRate: number
  singleShareDefaultRate: number
  emergencyFundUtilization: number
  totalDefaultsCovered: number
}

export interface TrendMetrics {
  monthlyShareGrowth: number
  newMultiShareCircles: number
  membersAddingShares: number
}

export interface PlatformMetrics {
  period: string
  overview: MetricsOverview
  shareRequests: ShareRequestMetrics
  concentration: ConcentrationMetrics
  defaults: DefaultMetrics
  trends: TrendMetrics
}

// =============================================================================
// Compliance Alert Types
// =============================================================================

export type AlertType =
  | 'rapid_accumulation'
  | 'payout_reduce_pattern'
  | 'related_accounts'
  | 'suspicious_transfer_timing'
  | 'high_concentration'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertStatus = 'open' | 'investigating' | 'resolved' | 'dismissed'

export interface AlertNote {
  author: string
  authorName: string
  content: string
  timestamp: string
}

export interface AlertDetails {
  sharesAdded?: number
  timeframeDays?: number
  totalCommitment?: number
  occurrences?: number
  totalPayoutsReceived?: number
  totalSharesReduced?: number
  sharedIPAddresses?: boolean
  sharedPaymentMethod?: boolean
  combinedSharePercentage?: number
  patternScore: number
}

export interface ComplianceAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  status: AlertStatus
  title: string
  description: string
  memberId?: string
  memberName?: string
  memberTrustScore?: number
  circleId?: string
  circleName?: string
  affectedCircles?: string[]
  affectedMembers?: string[]
  detectedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolution?: string
  details: AlertDetails
  assignedTo: string | null
  assignedAt?: string
  notes: AlertNote[]
}

// =============================================================================
// Education Content Types
// =============================================================================

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  explanation: string
  category: string
}

export interface OnboardingTip {
  id: string
  trigger: string
  title: string
  message: string
  icon: string
}

export interface SimulatorDefaults {
  baseContribution: number
  shareCount: number
  circleSize: number
  frequency: ContributionFrequency
  totalCycles: number
}

export interface EducationContent {
  quizQuestions: QuizQuestion[]
  onboardingTips: OnboardingTip[]
  simulatorDefaults: SimulatorDefaults
}

// =============================================================================
// Calculator & Visualization Types
// =============================================================================

export interface ScenarioConfig {
  baseContribution: number
  shares: number
  members: number
  cycles: number
  frequency: ContributionFrequency
}

export interface ScenarioProjections {
  monthlyContribution: number
  totalContributed: number
  expectedPayout: number
  emergencyFundContribution: number
}

export interface CalculatorScenario {
  id: string
  name: string
  description: string
  config: ScenarioConfig
  projections: ScenarioProjections
}

export interface ShareDistributionMember {
  name: string
  shares: number
  percentage: number
  color: string
}

export interface ConcentrationAnalysis {
  giniCoefficient: number
  topMemberPercentage: number
  top3MembersPercentage: number
  isBalanced: boolean
  warning: string | null
}

export interface ShareDistribution {
  circleId: string
  totalShares: number
  members: ShareDistributionMember[]
  concentrationMetrics: ConcentrationAnalysis
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for circle configuration screen during creation */
export interface MultiShareConfigurationProps {
  /** Current circle configuration */
  circle: Partial<Circle>
  /** Platform-wide configuration limits */
  platformConfig: PlatformConfig
  /** Calculator scenarios for preview */
  calculatorScenarios: CalculatorScenario[]
  /** Called when multi-share is toggled on/off */
  onMultiShareToggle?: (enabled: boolean) => void
  /** Called when max shares setting changes */
  onMaxSharesChange?: (maxShares: number) => void
  /** Called when approval mode changes */
  onApprovalModeChange?: (mode: ShareApprovalMode) => void
  /** Called when lock period settings change */
  onLockPeriodChange?: (lockPeriod: ShareLockPeriod) => void
  /** Called when payout mode changes */
  onPayoutModeChange?: (mode: SharePayoutMode) => void
  /** Called when configuration is saved */
  onSave?: () => void
}

/** Props for member's share request modal */
export interface ShareRequestModalProps {
  /** The member making the request */
  member: Member
  /** The circle configuration */
  circle: Circle
  /** Called when request is submitted */
  onSubmit?: (requestedShares: number, notes?: string) => void
  /** Called when modal is closed */
  onClose?: () => void
}

/** Props for organizer's share request review */
export interface ShareRequestReviewProps {
  /** The share request being reviewed */
  request: ShareRequest
  /** The circle configuration */
  circle: Circle
  /** All circle members for context */
  members: Member[]
  /** Called when request is approved */
  onApprove?: (requestId: string) => void
  /** Called when request is rejected */
  onReject?: (requestId: string, reason: RejectionReason, note?: string) => void
}

/** Props for share requests queue (organizer dashboard) */
export interface ShareRequestQueueProps {
  /** List of pending requests */
  requests: ShareRequest[]
  /** Called when a request is selected for review */
  onSelectRequest?: (requestId: string) => void
  /** Called when request is approved inline */
  onApprove?: (requestId: string) => void
  /** Called when request is rejected inline */
  onReject?: (requestId: string, reason: RejectionReason, note?: string) => void
}

/** Props for member's share history timeline */
export interface ShareHistoryProps {
  /** History entries for this member */
  history: ShareHistoryEntry[]
  /** Called when exporting history */
  onExport?: (format: 'csv' | 'pdf') => void
}

/** Props for contribution payment screen */
export interface ContributionPaymentProps {
  /** The contribution to pay */
  contribution: Contribution
  /** Member's share count */
  shareCount: number
  /** Base contribution amount */
  baseAmount: number
  /** Called when payment is initiated */
  onPay?: () => void
  /** Called when split payment is configured */
  onConfigureSplitPayment?: (schedule: { date: string; amount: number }[]) => void
}

/** Props for payout projection display */
export interface PayoutProjectionProps {
  /** Member's current shares */
  shares: number
  /** Total shares in circle */
  totalShares: number
  /** Expected cycle pool */
  cyclePool: number
  /** Member's payout position */
  position: number
  /** Expected payout date */
  expectedDate: string
  /** Pending share request (if any) */
  pendingRequest?: ShareRequest
}

/** Props for share distribution visualization */
export interface ShareDistributionChartProps {
  /** Distribution data */
  distribution: ShareDistribution
  /** Called when a member segment is clicked */
  onMemberClick?: (memberId: string) => void
}

/** Props for circle pool status display */
export interface CirclePoolStatusProps {
  /** Current cycle number */
  cycle: number
  /** Total shares in circle */
  totalShares: number
  /** Shares that have contributed */
  contributedShares: number
  /** Total amount collected */
  amountCollected: number
  /** Target amount for full collection */
  targetAmount: number
  /** List of member contribution statuses */
  memberStatuses: {
    memberId: string
    name: string
    shares: number
    contributed: boolean
    amount: number
  }[]
}

/** Props for waitlist display and management */
export interface ShareWaitlistProps {
  /** Waitlist entries */
  waitlist: ShareWaitlistEntry[]
  /** Called when member joins waitlist */
  onJoinWaitlist?: (requestedShares: number) => void
  /** Called when member leaves waitlist */
  onLeaveWaitlist?: () => void
  /** Called when member claims available share */
  onClaimShare?: (waitlistId: string) => void
}

/** Props for share transfer modal */
export interface ShareTransferModalProps {
  /** Member initiating transfer */
  fromMember: Member
  /** Eligible recipients */
  eligibleRecipients: Member[]
  /** Called when transfer is initiated */
  onInitiateTransfer?: (toMemberId: string, shareCount: number, reason?: string) => void
  /** Called when modal is closed */
  onClose?: () => void
}

/** Props for pending transfer display */
export interface PendingTransferProps {
  /** The pending transfer */
  transfer: ShareTransfer
  /** Whether current user is the recipient */
  isRecipient: boolean
  /** Called when transfer is accepted */
  onAccept?: () => void
  /** Called when transfer is rejected */
  onReject?: () => void
  /** Called when transfer is cancelled by sender */
  onCancel?: () => void
}

/** Props for platform admin configuration screen */
export interface PlatformConfigurationProps {
  /** Current platform config */
  config: PlatformConfig
  /** Called when config is updated */
  onUpdate?: (updates: Partial<PlatformConfig>) => void
  /** Called when feature is toggled globally */
  onFeatureToggle?: (enabled: boolean) => void
}

/** Props for platform metrics dashboard */
export interface PlatformMetricsDashboardProps {
  /** Current period metrics */
  metrics: PlatformMetrics
  /** Historical metrics for trends */
  historicalMetrics?: PlatformMetrics[]
  /** Called when date range changes */
  onPeriodChange?: (period: string) => void
  /** Called when exporting report */
  onExportReport?: (type: 'summary' | 'detailed' | 'compliance') => void
}

/** Props for compliance alerts dashboard */
export interface ComplianceAlertsProps {
  /** List of alerts */
  alerts: ComplianceAlert[]
  /** Called when alert is selected for investigation */
  onSelectAlert?: (alertId: string) => void
  /** Called when alert is assigned */
  onAssign?: (alertId: string, adminId: string) => void
  /** Called when alert is resolved */
  onResolve?: (alertId: string, resolution: string) => void
  /** Called when note is added to alert */
  onAddNote?: (alertId: string, content: string) => void
}

/** Props for education quiz */
export interface MultiShareQuizProps {
  /** Quiz questions */
  questions: QuizQuestion[]
  /** Called when quiz is started */
  onStart?: () => void
  /** Called when answer is submitted */
  onAnswer?: (questionId: string, answerId: string, isCorrect: boolean) => void
  /** Called when quiz is completed */
  onComplete?: (score: number, totalQuestions: number) => void
}

/** Props for share scenario simulator */
export interface ShareSimulatorProps {
  /** Default values for simulator */
  defaults: SimulatorDefaults
  /** Pre-built scenarios */
  scenarios: CalculatorScenario[]
  /** Called when simulation is run */
  onSimulate?: (config: ScenarioConfig) => ScenarioProjections
  /** Called when scenario is saved */
  onSaveScenario?: (scenario: CalculatorScenario) => void
  /** Called when user wants to find matching circle */
  onFindMatchingCircle?: (config: ScenarioConfig) => void
}

/** Props for personal multi-share summary (across all circles) */
export interface PersonalShareSummaryProps {
  /** Member's circles with share info */
  circles: {
    circle: Circle
    memberData: Member
  }[]
  /** Pending requests across all circles */
  pendingRequests: ShareRequest[]
  /** Total monthly commitment */
  totalMonthlyCommitment: number
  /** Total expected payouts */
  totalExpectedPayouts: number
  /** Called when navigating to a circle */
  onCircleClick?: (circleId: string) => void
  /** Called when exporting annual summary */
  onExportAnnualSummary?: () => void
}
