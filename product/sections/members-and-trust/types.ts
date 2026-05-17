// =============================================================================
// Data Types
// =============================================================================

export type MemberRole = 'president' | 'organizer' | 'treasurer' | 'secretary' | 'admin' | 'member'

export type MemberStatus = 'pending' | 'active' | 'suspended' | 'removed'

export type MembershipType = 'regular' | 'student' | 'senior' | 'honorary' | 'family'

export type KycStatus = 'none' | 'pending' | 'basic' | 'enhanced'

export type ScoreTrend = 'up' | 'down' | 'stable'

export type RiskLevel = 'low' | 'medium' | 'high'

export type AlertStatus = 'open' | 'acknowledged' | 'escalated' | 'resolved'

export type DisputeType = 'payment_dispute' | 'conduct_dispute' | 'service_dispute' | 'other'

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed'

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  avatar: string | null
  role: MemberRole
  status: MemberStatus
  membershipType: MembershipType
  kycStatus: KycStatus
  joinedAt: string
  duesPaidUntil: string | null
  circlesActive: number
  circlesCompleted: number
  totalContributed: number
  onTimePayments: number
  latePayments: number
  missedPayments: number
}

export interface TrustScoreFactor {
  score: number
  weight: number
  label: string
}

export interface TrustScoreFactors {
  paymentHistory: TrustScoreFactor
  verification: TrustScoreFactor
  tenure: TrustScoreFactor
  engagement: TrustScoreFactor
  network: TrustScoreFactor
  external: TrustScoreFactor
}

export interface TrustScore {
  memberId: string
  score: number
  trend: ScoreTrend
  factors: TrustScoreFactors
  lastCalculated: string
  modelVersion: string
}

export interface Reference {
  id: string
  fromMemberId: string
  fromMemberName: string
  toMemberId: string
  toMemberName: string
  relationship: string
  text: string
  createdAt: string
}

export interface AtRiskAlert {
  id: string
  memberId: string
  memberName: string
  riskLevel: RiskLevel
  riskIndicators: string[]
  recommendedActions: string[]
  createdAt: string
  status: AlertStatus
}

export interface DisputeParty {
  id: string
  name: string
}

export interface DisputeEvidence {
  type: string
  name: string
  uploadedAt: string
}

export interface DisputeTimelineEvent {
  date: string
  action: string
  actor: string
}

export interface Dispute {
  id: string
  filedBy: DisputeParty
  against: DisputeParty
  type: DisputeType
  subject: string
  description: string
  evidence: DisputeEvidence[]
  status: DisputeStatus
  resolution?: string
  timeline: DisputeTimelineEvent[]
  createdAt: string
  resolvedAt?: string
}

export interface Feedback {
  id: string
  fromMemberId: string
  fromMemberName: string
  circleId: string
  circleName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ScoreImprovementTip {
  factor: keyof TrustScoreFactors
  tip: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface MemberDirectoryProps {
  /** List of members to display in the directory */
  members: Member[]
  /** Trust scores for each member (keyed by memberId) */
  trustScores: TrustScore[]
  /** Called when user wants to view a member's profile */
  onViewMember?: (id: string) => void
  /** Called when user wants to edit a member's role */
  onEditRole?: (id: string, newRole: MemberRole) => void
  /** Called when user wants to suspend a member */
  onSuspendMember?: (id: string) => void
  /** Called when user wants to remove a member */
  onRemoveMember?: (id: string) => void
  /** Called when user wants to invite new members */
  onInviteMembers?: () => void
}

export interface MemberProfileProps {
  /** The member whose profile is being viewed */
  member: Member
  /** The member's trust score with factor breakdown */
  trustScore: TrustScore
  /** References received by this member */
  referencesReceived: Reference[]
  /** References given by this member */
  referencesGiven: Reference[]
  /** Feedback submitted by this member */
  feedback: Feedback[]
  /** Tips for improving the trust score */
  improvementTips: ScoreImprovementTip[]
  /** Documents relevant to this member */
  documents: MemberDocument[]
  /** Called when user wants to give a reference for this member */
  onGiveReference?: (memberId: string) => void
  /** Called when user wants to request a reference from this member */
  onRequestReference?: (memberId: string) => void
  /** Called when user wants to message this member */
  onMessage?: (memberId: string) => void
  /** Called when user wants to view a document */
  onViewDocument?: (documentId: string) => void
  /** Called when user wants to go back to the directory */
  onBack?: () => void
  /** Payment methods linked to this member */
  paymentMethods?: PaymentMethodInfo[]
  /** Whether the member has completed card verification */
  verificationStatus?: 'unverified' | 'verified'
  /** Called when user wants to add a new card */
  onAddCard?: () => void
  /** Called when user wants to remove a card */
  onRemoveCard?: (id: string) => void
}

export interface TrustScoreCardProps {
  /** The trust score to display */
  trustScore: TrustScore
  /** Tips for improving each factor */
  improvementTips?: ScoreImprovementTip[]
  /** Whether this is the current user's own score (shows improvement tips) */
  isOwnScore?: boolean
  /** Called when user wants to learn more about a factor */
  onFactorClick?: (factor: keyof TrustScoreFactors) => void
}

export interface AtRiskPanelProps {
  /** List of at-risk alerts to display */
  alerts: AtRiskAlert[]
  /** Called when organizer acknowledges an alert */
  onAcknowledge?: (alertId: string) => void
  /** Called when organizer escalates an alert */
  onEscalate?: (alertId: string) => void
  /** Called when organizer resolves an alert */
  onResolve?: (alertId: string) => void
  /** Called when organizer wants to contact the member */
  onContactMember?: (memberId: string) => void
}

export interface ReferencesListProps {
  /** References to display */
  references: Reference[]
  /** Whether to show the "Give Reference" button */
  showGiveButton?: boolean
  /** Called when user wants to give a new reference */
  onGiveReference?: () => void
  /** Called when user wants to request a reference */
  onRequestReference?: () => void
}

export interface DisputeListProps {
  /** List of disputes to display */
  disputes: Dispute[]
  /** Called when user wants to view dispute details */
  onViewDispute?: (id: string) => void
  /** Called when user wants to file a new dispute */
  onFileDispute?: () => void
}

export interface DisputeDetailProps {
  /** The dispute to display */
  dispute: Dispute
  /** Called when user submits additional evidence */
  onSubmitEvidence?: (disputeId: string, evidence: File) => void
  /** Called when admin resolves the dispute */
  onResolve?: (disputeId: string, resolution: string) => void
  /** Called when user wants to go back */
  onBack?: () => void
}

export interface MemberDocument {
  id: string
  title: string
  fileName: string
  fileSize: number
  category: 'agreements' | 'minutes' | 'financial' | 'policies' | 'forms' | 'personal'
  circleName: string
  uploadedByName: string
  isAutoGenerated?: boolean
  acknowledged?: boolean
  signed?: boolean
  requiresAcknowledgment: boolean
  requiresSignature: boolean
  url?: string
  createdAt: string
}

export interface VerificationCharge {
  amount: string
  chargedAt: string
  refundStatus: 'pending' | 'refunded'
  refundedAt: string | null
}

export interface PaymentMethodInfo {
  id: string
  methodType: 'card' | 'bank_transfer' | 'mobile_money'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  status: string
  verificationCharge?: VerificationCharge
}

export interface ProfilePayment {
  id: string
  type: 'contribution' | 'payout' | 'late_fee' | 'emergency_fund' | 'refund' | 'verification'
  typeLabel: string
  direction: 'credit' | 'debit'
  amount: number
  currency: string
  status: string
  statusLabel: string
  circleName?: string
  description?: string
  roundNumber?: number
  paymentMethod?: string
  referenceNumber?: string
  dueDate?: string
  paidAt?: string
  failedAt?: string
  failureReason?: string
  chargedAt?: string
  refundedAt?: string
  isLate?: boolean
  lateFee?: number
  platformFee?: number
  createdAt: string
}

export interface ActivityItem {
  id: string
  type: 'notification' | 'payment' | 'document' | 'trust_score' | 'payment_method' | 'account' | 'membership'
  icon: string
  title: string
  description?: string
  category?: string
  priority?: string
  status?: string
  amount?: number
  currency?: string
  score?: number
  trend?: string
  isRead?: boolean
  actionUrl?: string
  timestamp: string
}

export interface FeedbackFormProps {
  /** The circle to provide feedback for */
  circleId: string
  circleName: string
  /** Called when feedback is submitted */
  onSubmit?: (rating: number, comment: string) => void
  /** Called when user cancels */
  onCancel?: () => void
}
