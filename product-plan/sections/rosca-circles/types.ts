// =============================================================================
// Enums & Union Types
// =============================================================================

export type CircleStatus = 'forming' | 'active' | 'completed' | 'cancelled'
export type CircleFrequency = 'weekly' | 'bi_weekly' | 'monthly'
export type PayoutMethod = 'fixed' | 'random' | 'bidding' | 'lottery' | 'trust_score' | 'need_based'
export type CircleVisibility = 'public' | 'private' | 'invite_only'

export type ParticipantRole = 'organizer' | 'member'
export type ParticipantStatus = 'active' | 'suspended' | 'removed'

export type ContributionStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type PaymentMethodType = 'card' | 'bank_account' | 'sepa_debit' | 'mobile_money'

export type PayoutStatus = 'scheduled' | 'processing' | 'completed' | 'failed'
export type PayoutScheduleStatus = 'completed' | 'upcoming' | 'scheduled'

export type InterventionStatus = 'pending' | 'active' | 'repaid' | 'written_off'
export type SwapRequestStatus = 'pending' | 'approved' | 'rejected'
export type BidStatus = 'winning' | 'outbid' | 'withdrawn'
export type DisputeStatus = 'open' | 'acknowledged' | 'escalated' | 'resolved'
export type DisputePriority = 'low' | 'medium' | 'high'
export type DisputeType = 'payment_dispute' | 'conduct' | 'fraud' | 'other'
export type RiskLevel = 'low' | 'medium' | 'high'
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired'
export type InvitationChannel = 'email' | 'sms' | 'whatsapp' | 'qr_code'

// =============================================================================
// Core Data Types
// =============================================================================

export interface Circle {
  id: string
  name: string
  description: string
  contributionAmount: number
  currency: string
  frequency: CircleFrequency
  duration: number
  maxParticipants: number
  currentParticipants: number
  currentCycle: number
  status: CircleStatus
  payoutMethod: PayoutMethod
  emergencyFundRate: number
  visibility: CircleVisibility
  language: string
  startDate: string
  nextPayoutDate: string | null
  nextContributionDue: string | null
  totalCollected: number
  totalDisbursed: number
  emergencyFundBalance: number
  organizerId: string
  organizerName: string
  organizerAvatar: string | null
  organizerTrustScore: number
  associationId: string
  associationName: string
  latePenaltyPercent: number
  gracePeriodDays: number
  createdAt: string
}

export interface PaymentStats {
  onTime: number
  late: number
  missed: number
}

export interface Participant {
  id: string
  circleId: string
  userId: string
  name: string
  avatar: string | null
  email: string
  phone: string
  role: ParticipantRole
  payoutPosition: number | null
  trustScore: number
  status: ParticipantStatus
  paymentStats: PaymentStats
  totalContributed: number
  payoutReceived: boolean
  payoutReceivedDate: string | null
  joinedAt: string
}

export interface Contribution {
  id: string
  circleId: string
  participantId: string
  participantName: string
  cycle: number
  amount: number
  emergencyFundPortion: number
  platformFee: number
  dueDate: string
  paidDate: string | null
  status: ContributionStatus
  isLate: boolean
  retryCount: number
  paymentMethod: PaymentMethodType
  paymentMethodLast4: string
  stripePaymentIntentId: string | null
  isPartialPayment?: boolean
  remainingBalance?: number
  failureReason?: string
}

export interface Payout {
  id: string
  circleId: string
  recipientId: string
  recipientName: string
  cycle: number
  grossAmount: number
  platformFee: number
  netAmount: number
  status: PayoutStatus
  scheduledDate: string
  disbursedAt: string | null
  payoutMethod: PaymentMethodType
  payoutAccountLast4: string
  stripeTransferId: string | null
  winningBidDiscount?: number
  lotteryWinner?: boolean
}

export interface Repayment {
  amount: number
  paidAt: string
  method: 'auto_debit' | 'manual' | 'card'
}

export interface EmergencyFundIntervention {
  id: string
  circleId: string
  defaultingParticipantId: string
  defaultingParticipantName: string
  contributionId: string
  cycle: number
  coveredAmount: number
  debtAmount: number
  debtRemaining: number
  status: InterventionStatus
  createdAt: string
  repaymentDueDate: string
  repaidAt?: string
  repayments: Repayment[]
}

export interface PayoutScheduleEntry {
  circleId: string
  cycle: number
  recipientId: string
  recipientName: string
  recipientAvatar: string | null
  scheduledDate: string
  status: PayoutScheduleStatus
  amount: number
  isCurrent?: boolean
}

export interface PositionSwapRequest {
  id: string
  circleId: string
  requesterId: string
  requesterName: string
  requesterPosition: number
  targetId: string
  targetName: string
  targetPosition: number
  reason: string
  status: SwapRequestStatus
  createdAt: string
  respondedAt: string | null
  rejectionReason?: string
  organizerApprovalRequired: boolean
  organizerApproved: boolean | null
}

export interface Bid {
  id: string
  circleId: string
  cycle: number
  participantId: string
  participantName: string
  bidAmount: number
  discountPercent: number
  reason: string | null
  status: BidStatus
  submittedAt: string
  biddingEndsAt: string
}

export interface DisputeEvidence {
  id: string
  type: 'document' | 'screenshot' | 'video' | 'other'
  filename: string
  uploadedAt: string
}

export interface DisputeTimelineEntry {
  action: 'filed' | 'acknowledged' | 'escalated' | 'resolved'
  actor: string
  timestamp: string
  note: string
}

export interface Dispute {
  id: string
  circleId: string
  filedById: string
  filedByName: string
  againstId: string
  againstName: string
  type: DisputeType
  subject: string
  description: string
  status: DisputeStatus
  priority: DisputePriority
  evidence: DisputeEvidence[]
  timeline: DisputeTimelineEntry[]
  resolution: string | null
  createdAt: string
  updatedAt: string
}

export interface RiskFactor {
  score: number
  weight: number
  description: string
}

export interface MemberRiskScore {
  id: string
  memberId: string
  memberName: string
  memberAvatar: string | null
  memberEmail: string
  riskScore: number
  riskLevel: RiskLevel
  factors: {
    paymentHistory: RiskFactor
    verificationLevel: RiskFactor
    tenure: RiskFactor
    engagement: RiskFactor
    network: RiskFactor
    external: RiskFactor
  }
  recommendation: string
  previousCircles: number
  completedCircles: number
  defaultCount: number
  assessedAt: string
}

export interface CashCollectionRecord {
  id: string
  circleId: string
  participantId: string
  participantName: string
  collectedById: string
  collectedByName: string
  cycle: number
  amount: number
  collectedAt: string
  location: string
  receiptNumber: string
  notes: string | null
  reconciled: boolean
  reconciledAt: string | null
}

export interface CircleInvitation {
  id: string
  circleId: string
  circleName: string
  invitedEmail: string
  invitedPhone: string | null
  invitedName: string
  invitedById: string
  invitedByName: string
  message: string | null
  status: InvitationStatus
  sentAt: string
  acceptedAt?: string
  declinedAt?: string
  declineReason?: string
  expiresAt: string
  channel: InvitationChannel
}

export interface WaitlistEntry {
  id: string
  circleId: string
  userId: string
  userName: string
  userAvatar: string | null
  userTrustScore: number
  position: number
  joinedWaitlistAt: string
  notifyOnOpening: boolean
}

// =============================================================================
// Dashboard & Analytics Types
// =============================================================================

export interface TreasurerBalances {
  totalCollected: number
  totalDisbursed: number
  emergencyFundBalance: number
  pendingContributions: number
  availableForPayout: number
}

export interface PendingTransaction {
  type: 'contribution' | 'payout'
  participantName: string
  amount: number
  dueDate: string
  status: string
}

export interface CycleVariance {
  expected: number
  actual: number
  variance: number
  varianceReason?: string
}

export interface CashFlowEntry {
  month: string
  inflow: number
  outflow: number
  balance: number
}

export interface TreasurerDashboard {
  circleId: string
  asOfDate: string
  balances: TreasurerBalances
  pendingTransactions: PendingTransaction[]
  expectedVsActual: Record<string, CycleVariance>
  cashFlowProjection: CashFlowEntry[]
  collectionRate: number
  onTimePaymentRate: number
}

export interface CircleRecommendation {
  circleId: string
  circleName: string
  matchScore: number
  matchReasons: string[]
  contributionAmount: number
  frequency: CircleFrequency
  spotsAvailable: number
  organizerTrustScore: number
}

export interface AIConfigSuggestions {
  forContributionAmount: number
  forFrequency: CircleFrequency
  forDuration: number
  suggestions: {
    recommendedMaxParticipants: number
    recommendedPayoutMethod: PayoutMethod
    recommendedEmergencyFundRate: number
    recommendedGracePeriod: number
    recommendedPenaltyRate: number
    successProbability: number
    similarSuccessfulCircles: number
    riskFactors: string[]
    improvements: string[]
  }
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the Circle Discovery / Browse view */
export interface CircleDiscoveryProps {
  circles: Circle[]
  recommendations?: CircleRecommendation[]
  onViewCircle?: (id: string) => void
  onJoinCircle?: (id: string) => void
  onJoinWaitlist?: (id: string) => void
  onFilter?: (filters: CircleFilters) => void
  onSearch?: (query: string) => void
}

export interface CircleFilters {
  minAmount?: number
  maxAmount?: number
  frequency?: CircleFrequency
  status?: CircleStatus
  payoutMethod?: PayoutMethod
  language?: string
}

/** Props for the My Circles Dashboard */
export interface MyCirclesProps {
  circles: Circle[]
  participations: Participant[]
  onViewCircle?: (id: string) => void
  onMakeContribution?: (circleId: string) => void
  onCreate?: () => void
}

/** Props for the Circle Detail view */
export interface CircleDetailProps {
  circle: Circle
  participants: Participant[]
  payoutSchedule: PayoutScheduleEntry[]
  contributions: Contribution[]
  emergencyFundInterventions: EmergencyFundIntervention[]
  currentUserId: string
  currentUserRole: ParticipantRole
  onMakeContribution?: () => void
  onViewParticipant?: (id: string) => void
  onInviteMembers?: () => void
  onManageCircle?: () => void
  onExportCalendar?: () => void
}

/** Props for the Create Circle wizard */
export interface CreateCircleProps {
  aiSuggestions?: AIConfigSuggestions
  onSubmit?: (circle: Partial<Circle>) => void
  onCancel?: () => void
  onGetSuggestions?: (params: { amount: number; frequency: CircleFrequency; duration: number }) => void
}

/** Props for the Contribution Flow */
export interface ContributionFlowProps {
  circle: Circle
  participant: Participant
  contribution: Contribution
  paymentMethods: PaymentMethod[]
  onSubmitPayment?: (paymentMethodId: string, amount: number) => void
  onPartialPayment?: (paymentMethodId: string, amount: number) => void
  onPayForMember?: (memberId: string, amount: number) => void
  onSetupAutoPay?: () => void
  onCancel?: () => void
}

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  last4: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

/** Props for the Payout Schedule view */
export interface PayoutScheduleProps {
  circle: Circle
  schedule: PayoutScheduleEntry[]
  currentUserId: string
  onRequestSwap?: (targetParticipantId: string) => void
  onExportCalendar?: () => void
}

/** Props for the Position Swap Modal */
export interface PositionSwapProps {
  circleId: string
  participants: Participant[]
  currentUserId: string
  pendingRequests: PositionSwapRequest[]
  onSubmitRequest?: (targetId: string, reason: string) => void
  onRespondToRequest?: (requestId: string, approved: boolean, reason?: string) => void
}

/** Props for the Bidding Interface */
export interface BiddingProps {
  circle: Circle
  cycle: number
  bids: Bid[]
  currentUserId: string
  biddingEndsAt: string
  minimumBid: number
  onSubmitBid?: (amount: number, reason?: string) => void
  onWithdrawBid?: (bidId: string) => void
}

/** Props for Circle Management (Organizer) */
export interface CircleManagementProps {
  circle: Circle
  participants: Participant[]
  waitlist: WaitlistEntry[]
  invitations: CircleInvitation[]
  disputes: Dispute[]
  onPauseCircle?: () => void
  onExtendCircle?: (additionalCycles: number) => void
  onRemoveMember?: (participantId: string, reason: string) => void
  onSuspendMember?: (participantId: string, reason: string) => void
  onPromoteFromWaitlist?: (waitlistEntryId: string) => void
  onSendInvitation?: (email: string, phone?: string, message?: string) => void
  onCancelInvitation?: (invitationId: string) => void
}

/** Props for Cash Collection Form (Organizer) */
export interface CashCollectionProps {
  circle: Circle
  participants: Participant[]
  currentCycle: number
  records: CashCollectionRecord[]
  onRecordCollection?: (participantId: string, amount: number, location: string, notes?: string) => void
  onReconcile?: (recordId: string) => void
  onPrintReceipt?: (recordId: string) => void
}

/** Props for Treasurer Dashboard */
export interface TreasurerDashboardProps {
  dashboard: TreasurerDashboard
  circle: Circle
  onExportReport?: (format: 'pdf' | 'csv') => void
  onViewTransaction?: (id: string) => void
}

/** Props for Member Risk Scores panel (Organizer) */
export interface MemberRiskScoresProps {
  riskScores: MemberRiskScore[]
  onViewMember?: (memberId: string) => void
  onApprove?: (memberId: string) => void
  onReject?: (memberId: string, reason: string) => void
  onRequestMoreInfo?: (memberId: string) => void
}

/** Props for Dispute Management */
export interface DisputeManagementProps {
  disputes: Dispute[]
  currentUserId: string
  isOrganizer: boolean
  onFileDispute?: (againstId: string, type: DisputeType, subject: string, description: string) => void
  onAddEvidence?: (disputeId: string, file: File) => void
  onAcknowledge?: (disputeId: string, note: string) => void
  onEscalate?: (disputeId: string, note: string) => void
  onResolve?: (disputeId: string, resolution: string) => void
}

/** Props for Emergency Fund Panel */
export interface EmergencyFundProps {
  circle: Circle
  interventions: EmergencyFundIntervention[]
  currentUserId: string
  onMakeRepayment?: (interventionId: string, amount: number) => void
  onViewDetails?: (interventionId: string) => void
}

/** Props for Waitlist Management */
export interface WaitlistManagementProps {
  circle: Circle
  waitlist: WaitlistEntry[]
  onPromote?: (entryId: string) => void
  onRemove?: (entryId: string) => void
  onNotify?: (entryId: string) => void
  onReorder?: (entryId: string, newPosition: number) => void
}

/** Props for Invite Members flow */
export interface InviteMembersProps {
  circle: Circle
  invitations: CircleInvitation[]
  onSendInvitation?: (email: string, phone?: string, channel: InvitationChannel, message?: string) => void
  onResend?: (invitationId: string) => void
  onCancel?: (invitationId: string) => void
  onGenerateQRCode?: () => void
  onShareLink?: (channel: 'whatsapp' | 'email' | 'sms' | 'copy') => void
}
