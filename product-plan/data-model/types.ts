// =============================================================================
// CircleUp — Core Data Model Types
// =============================================================================

// User
export interface User {
  id: string
  email: string
  phone: string
  name: string
  profilePhoto: string | null
  trustScore: number
  kycStatus: 'none' | 'pending' | 'basic' | 'enhanced'
  role: 'member' | 'organizer' | 'admin'
  stripeCustomerId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// Association
export type AssociationType = 'cultural' | 'religious' | 'professional' | 'savings' | 'social' | 'family'
export type AssociationVisibility = 'public' | 'private' | 'invite_only'

export interface Association {
  id: string
  name: string
  description: string
  logo: string | null
  type: AssociationType
  visibility: AssociationVisibility
  country: string
  language: string
  memberCount: number
  settings: Record<string, unknown>
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// Membership
export type MemberRole = 'member' | 'treasurer' | 'secretary' | 'president' | 'admin'
export type MemberStatus = 'pending' | 'active' | 'suspended' | 'removed'
export type MembershipType = 'regular' | 'student' | 'senior' | 'honorary' | 'family'

export interface Membership {
  id: string
  userId: string
  associationId: string
  role: MemberRole
  status: MemberStatus
  membershipType: MembershipType
  duesPaidUntil: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// Circle
export type CircleStatus = 'forming' | 'active' | 'completed' | 'cancelled'
export type CircleFrequency = 'weekly' | 'bi_weekly' | 'monthly'
export type PayoutMethod = 'fixed' | 'random' | 'bidding' | 'trust_score'

export interface Circle {
  id: string
  associationId: string
  name: string
  contributionAmount: number
  frequency: CircleFrequency
  duration: number
  maxParticipants: number
  currentCycle: number
  status: CircleStatus
  payoutMethod: PayoutMethod
  emergencyFundRate: number
  totalCollected: number
  totalDisbursed: number
  emergencyFundBalance: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// Participant
export interface Participant {
  id: string
  circleId: string
  userId: string
  role: 'organizer' | 'member'
  payoutPosition: number | null
  onTimePayments: number
  latePayments: number
  missedPayments: number
  totalContributed: number
  payoutReceived: boolean
  createdAt: string
  updatedAt: string
}

// Contribution
export type ContributionStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Contribution {
  id: string
  circleId: string
  participantId: string
  cycle: number
  amount: number
  emergencyFundPortion: number
  platformFee: number
  dueDate: string
  status: ContributionStatus
  isLate: boolean
  retryCount: number
  stripePaymentIntentId: string | null
  createdAt: string
  updatedAt: string
}

// Payout
export type PayoutStatus = 'scheduled' | 'processing' | 'completed' | 'failed'

export interface Payout {
  id: string
  circleId: string
  recipientId: string
  cycle: number
  grossAmount: number
  platformFee: number
  netAmount: number
  status: PayoutStatus
  scheduledDate: string
  disbursedAt: string | null
  stripeTransferId: string | null
  createdAt: string
  updatedAt: string
}

// Emergency Fund Intervention
export type InterventionStatus = 'pending' | 'active' | 'repaid' | 'written_off'

export interface EmergencyFundIntervention {
  id: string
  circleId: string
  defaultingParticipantId: string
  contributionId: string
  coveredAmount: number
  debtAmount: number
  debtRemaining: number
  status: InterventionStatus
  createdAt: string
  updatedAt: string
}

// Trust Score
export interface TrustScoreFactors {
  paymentHistory: number  // 40% weight
  verification: number    // 20% weight
  tenure: number          // 15% weight
  engagement: number      // 10% weight
  network: number         // 10% weight
  external: number        // 5% weight
}

export interface TrustScore {
  id: string
  userId: string
  score: number
  factors: TrustScoreFactors
  modelVersion: string
  calculatedAt: string
}

// Payment Method
export type PaymentMethodType = 'card' | 'bank_account' | 'sepa_debit'

export interface PaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  last4: string
  brand: string | null
  expiryMonth: number | null
  expiryYear: number | null
  isDefault: boolean
  status: 'active' | 'expired' | 'invalid'
  stripePaymentMethodId: string
  createdAt: string
}

// Transaction
export type TransactionType = 'contribution' | 'payout' | 'dues' | 'fee' | 'refund' | 'welfare'
export type TransactionDirection = 'credit' | 'debit'

export interface Transaction {
  id: string
  type: TransactionType
  direction: TransactionDirection
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'reversed'
  userId: string
  circleId: string | null
  associationId: string | null
  stripeChargeId: string | null
  createdAt: string
  updatedAt: string
}

// Welfare Fund
export interface WelfareFund {
  id: string
  associationId: string
  name: string
  contributionRate: number
  benefitTypes: string[]
  waitingPeriod: number
  claimLimit: number
  balance: number
  createdAt: string
  updatedAt: string
}

// Welfare Application
export interface WelfareApplication {
  id: string
  welfareFundId: string
  applicantId: string
  benefitType: string
  amountRequested: number
  reason: string
  supportingDocuments: string[]
  status: 'pending' | 'approved' | 'denied'
  decision: string | null
  createdAt: string
  updatedAt: string
}

// Event
export interface Event {
  id: string
  associationId: string
  title: string
  description: string
  type: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  ticketPrice: number | null
  registrationStatus: 'open' | 'closed' | 'full'
  createdAt: string
  updatedAt: string
}

// Election
export interface Election {
  id: string
  associationId: string
  positions: string[]
  nominationStart: string
  nominationEnd: string
  votingStart: string
  votingEnd: string
  votingMethod: 'majority' | 'supermajority' | 'ranked_choice'
  eligibilityCriteria: Record<string, unknown>
  status: 'nominations' | 'voting' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// Proposal
export interface Proposal {
  id: string
  associationId: string
  title: string
  description: string
  type: string
  discussionStart: string
  discussionEnd: string
  votingStart: string
  votingEnd: string
  quorumRequirement: number
  status: 'discussion' | 'voting' | 'passed' | 'rejected' | 'withdrawn'
  createdAt: string
  updatedAt: string
}

// Vote
export interface Vote {
  id: string
  electionId: string | null
  proposalId: string | null
  voterId: string
  choice: string
  createdAt: string
}

// Notification
export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push'

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  body: string
  channel: NotificationChannel
  isRead: boolean
  createdAt: string
  readAt: string | null
}

// Announcement
export interface Announcement {
  id: string
  associationId: string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  publishedAt: string
  expiresAt: string | null
  createdAt: string
}

// Message
export interface Message {
  id: string
  senderId: string
  recipientId: string | null
  conversationId: string | null
  content: string
  sentAt: string
  readAt: string | null
}

// Document
export interface Document {
  id: string
  associationId: string
  title: string
  fileUrl: string
  mimeType: string
  fileSize: number
  folderId: string | null
  uploaderId: string
  createdAt: string
  updatedAt: string
}

// Audit Log
export interface AuditLog {
  id: string
  eventType: string
  action: string
  actorId: string
  ipAddress: string
  resourceType: string
  resourceId: string
  changesBefore: Record<string, unknown> | null
  changesAfter: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  createdAt: string
}
