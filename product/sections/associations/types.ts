// =============================================================================
// Data Types
// =============================================================================

export type AssociationType = 'cultural' | 'religious' | 'professional' | 'savings' | 'social' | 'family'

export type AssociationVisibility = 'public' | 'private' | 'invite_only'

export type MemberRole = 'president' | 'organizer' | 'treasurer' | 'secretary' | 'admin' | 'member'

export type MemberStatus = 'pending' | 'active' | 'suspended' | 'removed'

export type MembershipType = 'regular' | 'student' | 'senior' | 'honorary' | 'family'

export type AnnouncementPriority = 'high' | 'medium' | 'low'

export type ActivityType = 'member_joined' | 'member_removed' | 'member_suspended' | 'announcement_posted' | 'circle_created' | 'circle_completed' | 'payout_completed' | 'emergency_payout' | 'role_changed' | 'fund_transfer'

export type InvitationChannel = 'email' | 'sms' | 'whatsapp'

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected'

export interface AssociationSettings {
  culturalTerminology: string
  allowPublicJoin: boolean
  requireApproval: boolean
  duesAmount?: number
  duesFrequency?: string
  duesCurrency?: string
  fiscalYearStartMonth?: number
}

export type AssociationStatus = 'draft' | 'active' | 'suspended' | 'dissolved'

export interface Association {
  id: string
  name: string
  description: string
  logo: string | null
  coverImage: string | null
  type: AssociationType
  visibility: AssociationVisibility
  status?: AssociationStatus
  country: string
  language: string
  memberCount: number
  activeCircles: number
  totalFunds: number
  currency: string
  createdAt: string
  myRole: MemberRole
  hasUnreadActivity: boolean
  settings: AssociationSettings
  // Address
  street?: string
  postalCode?: string
  city?: string
  // Contact
  website?: string
  contactEmail?: string
  contactPhone?: string
  // Financial
  postfinanceIban?: string
  bankName?: string
  accountHolderName?: string
  hasPostfinanceConfigured?: boolean
  // Details
  foundedAt?: string | null
  registrationNumber?: string
  // B2B Relationship
  businessRelationship?: {
    id: string
    reference: string
    status: string
    relationshipType: string
    circleManagerName: string
    circleManagerId: string
    subscriptionTier: string
    subscriptionPaidUntil: string | null
    startedAt: string | null
    feeAgreement: Record<string, unknown>
    recentBillingRecords?: {
      id: string
      reference: string
      status: string
      amount: number
      currency: string
      paymentMethod: string
      periodStart: string | null
      periodEnd: string | null
      paidAt: string | null
      description: string
      createdAt: string
    }[]
  } | null
  associationAccount?: {
    id: string
    accountNumber: string
    accountType: string
    currency: string
    balance: number
    status: string
  } | null
}

export interface Member {
  id: string
  userId: string
  associationId: string
  name: string
  email: string
  avatarUrl: string | null
  role: MemberRole
  status: MemberStatus
  membershipType: MembershipType
  joinedAt: string
  duesPaidUntil: string | null
}

export interface Announcement {
  id: string
  associationId: string
  title: string
  content: string
  priority: AnnouncementPriority
  authorId: string
  authorName: string
  publishedAt: string
  expiresAt: string | null
}

export interface ActivityItem {
  id: string
  associationId: string
  type: ActivityType
  title: string
  description: string
  actorName: string
  actorAvatarUrl: string | null
  timestamp: string
  isRead: boolean
}

export interface PendingInvitation {
  id: string
  associationId: string
  email: string | null
  phone: string | null
  invitedName: string | null
  invitedBy: string
  invitedAt: string
  expiresAt: string
  channel: InvitationChannel
  status: InvitationStatus
  role?: MemberRole
  membershipType?: MembershipType
  message?: string
  resendCount?: number
  lastResentAt?: string | null
}

export type EligibilityCheckStatus = 'passed' | 'warning' | 'failed' | 'manual'

export interface EligibilityCheck {
  id: string
  label: string
  status: EligibilityCheckStatus
  detail?: string
}

export interface JoinRequest {
  id: string
  associationId: string
  userId: string
  userName: string
  userEmail: string
  userAvatarUrl: string | null
  message: string
  requestedAt: string
  status: JoinRequestStatus
  trustScore?: number
  location?: string
  mutualMembersCount?: number
  eligibilityChecks?: EligibilityCheck[]
}

export interface ReceivedInvitation {
  id: string
  associationId: string
  associationName: string
  associationLogo: string | null
  associationType: AssociationType
  associationMemberCount: number
  role: MemberRole
  membershipType: MembershipType
  invitedBy: string
  invitedAt: string
  status: InvitationStatus
  message?: string | null
}

export interface SentJoinRequest {
  id: string
  associationId: string
  associationName: string
  associationLogo: string | null
  associationType: AssociationType
  associationMemberCount: number
  associationCountry?: string
  associationLanguage?: string
  message: string
  requestedAt: string
  status: JoinRequestStatus
  expiresAt?: string | null
}

export interface DiscoverableAssociation {
  id: string
  name: string
  description: string
  logo: string | null
  type: AssociationType
  visibility: AssociationVisibility
  status?: AssociationStatus
  country: string
  language: string
  memberCount: number
  activeCircles: number
  isMember?: boolean
  isPending?: boolean
  reference?: string
  isVerified?: boolean
  verifiedSince?: string | null
  subscriptionTier?: string
  circleManagerName?: string | null
}

// =============================================================================
// Federation Types
// =============================================================================

export type FederationType = 'national' | 'regional' | 'international' | 'thematic'

export type FederationStatus = 'active' | 'forming' | 'dissolved'

export type FederationMembershipStatus = 'pending' | 'active' | 'suspended' | 'withdrawn'

export type FederationMembershipRole = 'chapter' | 'affiliate' | 'observer'

export type FederationPolicyCategory = 'governance' | 'finance' | 'membership' | 'operations'

export interface Federation {
  id: string
  name: string
  description: string
  logo: string | null
  type: FederationType
  status: FederationStatus
  parentFederationId: string | null
  chapterCount: number
  totalMembers: number
  totalCircles: number
  foundedAt: string
  createdAt: string
}

export interface FederationMembership {
  id: string
  federationId: string
  associationId: string
  associationName: string
  associationLogo: string | null
  status: FederationMembershipStatus
  role: FederationMembershipRole
  memberCount: number
  activeCircles: number
  joinedAt: string
  chapterAdminId: string
  chapterAdminName: string
}

export interface FederationPolicy {
  id: string
  federationId: string
  title: string
  content: string
  category: FederationPolicyCategory
  isRequired: boolean
  effectiveDate: string
  version: number
  acknowledgments: number
  totalChapters: number
  createdAt: string
  updatedAt: string
}

export interface FederationAnnouncement {
  id: string
  federationId: string
  title: string
  content: string
  authorId: string
  authorName: string
  targetChapters: string[] | 'all'
  publishedAt: string
  readCount: number
}

export interface FederationMetrics {
  federationId: string
  period: string
  totalMembers: number
  memberGrowth: number
  activeCircles: number
  totalContributions: number
  averageCircleHealth: number
  chapterPerformance: ChapterPerformance[]
}

export interface ChapterPerformance {
  associationId: string
  associationName: string
  memberCount: number
  activeCircles: number
  contributions: number
  healthScore: number
}

// =============================================================================
// Analytics Types
// =============================================================================

export interface AssociationAnalytics {
  associationId: string
  period: string
  memberGrowth: MemberGrowthData[]
  circleActivity: CircleActivityData[]
  engagementMetrics: EngagementMetrics
  topContributors: TopContributor[]
  recentActivity: ActivitySummary[]
}

export interface MemberGrowthData {
  month: string
  totalMembers: number
  newMembers: number
  churnedMembers: number
}

export interface CircleActivityData {
  month: string
  activeCircles: number
  totalContributions: number
  averageContribution: number
}

export interface EngagementMetrics {
  averageLoginFrequency: number
  activeMembers: number
  inactiveMembers: number
  participationRate: number
}

export interface TopContributor {
  memberId: string
  memberName: string
  avatarUrl: string | null
  totalContributions: number
  circlesParticipating: number
}

export interface ActivitySummary {
  date: string
  type: ActivityType
  count: number
  description: string
}

// =============================================================================
// Association Account Ledger Types (AA-US001 to AA-US006)
// =============================================================================

export type FundCategoryStatus = 'active' | 'archived'
export type DuesInvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'waived'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type ApprovalType = 'expense' | 'transfer' | 'high_value'
export type DuesDisputeStatus = 'open' | 'investigating' | 'resolved' | 'dismissed'
export type DuesConfigFrequency = 'monthly' | 'quarterly' | 'annually'
export type LedgerEntryType = 'dues_collected' | 'circle_transfer' | 'fee_payment' | 'adjustment' | 'management_fee' | 'platform_fee' | 'opening_balance' | 'expense' | 'income' | 'late_fee' | 'fund_transfer' | 'welfare_payment' | 'event_revenue'

export interface FundCategory {
  id: string
  name: string
  slug: string
  purpose: string
  balance: number
  currency: string
  targetAmount: number | null
  varianceFromTarget: number | null
  targetPercentage: number | null
  isDefault: boolean
  status: FundCategoryStatus
  sortOrder: number
}

export interface LedgerEntry {
  id: string
  entryType: LedgerEntryType
  direction: 'credit' | 'debit'
  amount: number
  currency: string
  description: string | null
  runningBalance: number
  postedAt: string
  fundCategory: string | null
  recordedBy: string | null
  approvalStatus: string | null
  category: string | null
}

export interface AccountSummary {
  accountNumber: string
  balance: number
  currency: string
  status: string
  isRestricted: boolean
  approvalThreshold: number | null
  fundCategories: FundCategory[]
  recentEntries: LedgerEntry[]
}

export interface DuesConfig {
  id: string
  amount: number
  frequency: DuesConfigFrequency
  dueDay: number
  gracePeriodDays: number
  lateFeeAmount: number
  lateFeePercentage: number
  currency: string
  fundCategorySlug: string | null
  active: boolean
}

export interface MemberDuesInvoice {
  id: string
  reference: string
  memberName: string
  memberEmail: string
  amount: number
  lateFee: number
  totalAmount: number
  currency: string
  period: string
  dueDate: string
  graceEndDate: string | null
  status: DuesInvoiceStatus
  paidAt: string | null
  paymentMethod: string | null
  daysOverdue: number
  hasQrBill?: boolean
}

export interface TransactionApproval {
  id: string
  approvalType: ApprovalType
  amount: number
  description: string | null
  status: ApprovalStatus
  requestedByName: string
  approvedByName: string | null
  createdAt: string
  decidedAt: string | null
  rejectionReason: string | null
}

export interface DuesDisputeItem {
  id: string
  memberName: string
  invoiceReference: string | null
  disputedAmount: number
  description: string
  status: DuesDisputeStatus
  resolutionNote: string | null
  resolvedByName: string | null
  createdAt: string
  resolvedAt: string | null
}

export interface IncomeExpenseReport {
  reportType: 'income_expense'
  period: { startDate: string; endDate: string }
  totalIncome: number
  totalExpenses: number
  netSurplus: number
  incomeByCategory: Record<string, number>
  expenseByCategory: Record<string, number>
  fundBreakdown: Array<{ name: string; slug: string; credits: number; debits: number; net: number }>
  transactionCount: number
}

export interface MemberStandingReport {
  reportType: 'member_standing'
  generatedAt: string
  totalMembers: number
  current: number
  dueSoon: number
  overdue: number
  members: Array<{
    memberId: string
    memberName: string
    memberEmail: string
    duesStatus: 'current' | 'due_soon' | 'overdue'
    duesPaidUntil: string | null
    paidYtd: number
    outstanding: number
    daysOverdue: number
  }>
}

export interface FundBalanceReport {
  reportType: 'fund_balance'
  period: { startDate: string; endDate: string }
  accountBalance: number
  funds: Array<{
    name: string
    slug: string
    openingBalance: number
    totalCredits: number
    totalDebits: number
    closingBalance: number
    targetAmount: number | null
    varianceFromTarget: number | null
    targetPercentage: number | null
  }>
}

// =============================================================================
// President Dashboard Types (AP-US010 to AP-US021)
// =============================================================================

export type PresidentNotificationType = 'renewal' | 'suspension' | 'transaction' | 'membership' | 'succession' | 'compliance' | 'system'
export type PresidentNotificationPriority = 'high' | 'medium' | 'low'
export type SuccessionStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'
export type SubscriptionTier = 'free' | 'basic' | 'pro'
export type ComplianceDocType = 'bylaws' | 'agm_minutes' | 'audit_certificate' | 'annual_report' | 'contract' | 'amendment'
export type ComplianceDocStatus = 'draft' | 'active' | 'archived' | 'pending_signature'

export interface PresidentNotification {
  id: string
  type: PresidentNotificationType
  priority: PresidentNotificationPriority
  title: string
  message: string
  createdAt: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export interface PresidentDashboardBrData {
  id: string
  status: string
  reference: string
  subscriptionTier: string
  contractEndDate: string | null
  renewalDeadline: string | null
  renewalStatus: string | null
  daysUntilRenewal: number | null
}

export interface PresidentDashboardCmData {
  id: string
  name: string
  email: string
  phone: string | null
  responseSla: string
}

export interface PresidentDashboardAccountData {
  totalBalance: number
  currency: string
  fundBreakdown: { name: string; balance: number }[]
}

export interface PresidentDashboardCircleSummary {
  id: string
  name: string
  status: string
  currentCycle: number
  totalCycles: number
  memberCount: number
  organizerName: string
}

export interface PresidentDashboardData {
  businessRelationship: PresidentDashboardBrData | null
  circleManager: PresidentDashboardCmData | null
  accountSummary: PresidentDashboardAccountData | null
  circles: PresidentDashboardCircleSummary[]
}

export interface OrganizerMetrics {
  organizerId: string
  name: string
  circlesManaged: number
  collectionRate: number
  onTimePayouts: number
  memberCount: number
  status: 'active' | 'probation' | 'suspended'
  appointedAt: string
}

export interface HealthDimensionScore {
  score: number
  trend: 'up' | 'down' | 'stable'
  details?: string
  rate?: number
  activeCircles?: number
  balance?: number
}

export interface HealthData {
  overall: number
  dimensions: {
    memberEngagement: HealthDimensionScore
    duesCollection: HealthDimensionScore
    circleActivity: HealthDimensionScore
    financialHealth: HealthDimensionScore
  }
  recommendations: string[]
}

export interface ComplianceDocument {
  id: number
  type: ComplianceDocType
  title: string
  version: number
  status: ComplianceDocStatus
  uploadedAt: string
  uploadedBy: string
  signedAt?: string
  signedBy?: string
  fileUrl?: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface FederationDashboardProps {
  federation: Federation
  chapters: FederationMembership[]
  policies: FederationPolicy[]
  announcements: FederationAnnouncement[]
  metrics: FederationMetrics
  onChapterClick?: (associationId: string) => void
  onCreatePolicy?: () => void
  onBroadcast?: () => void
  onInviteChapter?: () => void
  onViewReports?: () => void
}

export interface ChapterDirectoryProps {
  chapters: FederationMembership[]
  onChapterClick?: (associationId: string) => void
  onApprove?: (membershipId: string) => void
  onSuspend?: (membershipId: string) => void
  onRemove?: (membershipId: string) => void
}

export interface PolicyManagerProps {
  policies: FederationPolicy[]
  onCreatePolicy?: () => void
  onEditPolicy?: (policyId: string) => void
  onViewAcknowledgments?: (policyId: string) => void
  onArchivePolicy?: (policyId: string) => void
}

export interface AssociationAdministrationAlert {
  id: string
  type: 'warning' | 'info' | 'success'
  title: string
  description: string
  timestamp: string
  actionLabel?: string
  actionId?: string
}

export interface AssociationAdministrationProps {
  association: Association
  members: Member[]
  pendingInvitations: PendingInvitation[]
  joinRequests: JoinRequest[]
  alerts: AssociationAdministrationAlert[]
  federationMembership?: FederationMembership | null

  // Navigation callbacks
  onManageMembers?: () => void
  onManageSettings?: () => void
  onManageBranding?: () => void
  onViewInvitations?: () => void
  onViewJoinRequests?: () => void
  onViewAnalytics?: () => void
  onManageCommunication?: () => void
  onViewFederation?: () => void
  onInviteMembers?: () => void

  // Alert actions
  onAlertAction?: (alertId: string, actionId: string) => void
  onDismissAlert?: (alertId: string) => void

  // Quick actions
  onCreateAnnouncement?: () => void
  onExportData?: () => void
  onViewAuditLog?: () => void

  onBack?: () => void
}

export interface AssociationAnalyticsProps {
  association: Association
  analytics: AssociationAnalytics
  onExportReport?: () => void
  onViewMember?: (memberId: string) => void
  onBack?: () => void
}

export interface FederationAnalyticsProps {
  federation: Federation
  chapters: FederationMembership[]
  metrics: FederationMetrics
  onExportReport?: () => void
  onViewChapter?: (associationId: string) => void
  onBack?: () => void
}

export interface AssociationsProps {
  /** List of associations the current user belongs to */
  associations: Association[]
  /** Members of the currently selected association */
  members: Member[]
  /** Announcements for the currently selected association */
  announcements: Announcement[]
  /** Recent activity items for the currently selected association */
  activityItems: ActivityItem[]
  /** Pending invitations for the currently selected association */
  pendingInvitations: PendingInvitation[]
  /** Join requests awaiting approval */
  joinRequests: JoinRequest[]
  /** Public associations available for discovery */
  discoverableAssociations: DiscoverableAssociation[]

  // Association actions
  /** Called when user wants to view an association's dashboard */
  onViewAssociation?: (id: string) => void
  /** Called when user wants to create a new association */
  onCreateAssociation?: () => void
  /** Called when user wants to edit association settings */
  onEditAssociation?: (id: string) => void
  /** Called when user wants to archive/delete an association */
  onArchiveAssociation?: (id: string) => void

  // Member actions
  /** Called when user wants to view a member's profile */
  onViewMember?: (id: string) => void
  /** Called when user wants to change a member's role */
  onChangeMemberRole?: (memberId: string, newRole: MemberRole) => void
  /** Called when user wants to remove a member */
  onRemoveMember?: (id: string) => void
  /** Called when user wants to suspend a member */
  onSuspendMember?: (id: string) => void

  // Invitation actions
  /** Called when user wants to invite new members */
  onInviteMembers?: () => void
  /** Called when user wants to cancel a pending invitation */
  onCancelInvitation?: (id: string) => void
  /** Called when user wants to resend an invitation */
  onResendInvitation?: (id: string) => void

  // Join request actions
  /** Called when user approves a join request */
  onApproveJoinRequest?: (id: string) => void
  /** Called when user rejects a join request */
  onRejectJoinRequest?: (id: string) => void

  // Announcement actions
  /** Called when user wants to create a new announcement */
  onCreateAnnouncement?: (data: { title: string; content: string; priority: string }) => void
  /** Called when user wants to edit an announcement */
  onEditAnnouncement?: (id: string) => void
  /** Called when user wants to delete an announcement */
  onDeleteAnnouncement?: (id: string) => void

  // Discovery actions
  /** Called when user wants to request to join a public association */
  onRequestToJoin?: (id: string) => void
  /** Called when user searches for associations */
  onSearchAssociations?: (query: string) => void
}

// =============================================================================
// Import & Migration Types
// =============================================================================

export type MigrationStatus = 'not_started' | 'in_progress' | 'paused' | 'completed' | 'cancelled'
export type PhaseStatus = 'locked' | 'in_progress' | 'completed'
export type ValidationStatus = 'valid' | 'warning' | 'error'
export type MigrationInvitationStatus = 'not_sent' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'registered' | 'bounced' | 'code_generated'
export type VerificationStatus = 'not_started' | 'pending' | 'verified' | 'disputed'
export type PaymentStatus = 'paid' | 'late' | 'missed' | 'partial'
export type PayoutPositionStatus = 'paid_out' | 'pending'
export type CircleImportStatus = 'draft' | 'validated' | 'active'
export type DuesStatus = 'paid_up' | 'partially_paid' | 'overdue' | 'no_history'
export type TrustScoreBadge = 'bootstrapped' | 'verified' | 'new_member'
export type Visibility = 'public' | 'semi_private' | 'private'
export type PayoutMethod = 'fixed' | 'random' | 'bidding' | 'trust_score'
export type CircleFrequency = 'weekly' | 'bi_weekly' | 'monthly'
export type LateFeeType = 'none' | 'fixed' | 'percentage'
export type ApprovalWorkflow = 'auto_approve' | 'admin_approval' | 'committee_vote' | 'invitation_only'
export type DuesFrequency = 'monthly' | 'quarterly' | 'annual'
export type MigrationInvitationChannel = 'email' | 'email_sms' | 'invitation_code' | null
export type DocumentCategory = 'bylaws' | 'constitution' | 'code_of_conduct' | 'financial_policy' | 'other'
export type CheckStatus = 'passed' | 'warning' | 'error'
export type DisputeStatus = 'pending_review' | 'accepted' | 'rejected'
export type ColumnMappingStatus = 'auto_detected' | 'confirmed' | 'needs_review' | 'skipped'
export type RoleMappingStatus = 'auto_mapped' | 'confirmed' | 'needs_review'
export type FilePurpose = 'member_roster' | 'contribution_history' | 'payout_history' | 'dues_history'

// Migration Session

export interface MigrationPhase {
  phase: number
  name: string
  status: PhaseStatus
  completedAt: string | null
}

export interface SourceFile {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  sha256: string
  rowCount: number
  purpose: FilePurpose
}

export interface MigrationSession {
  id: string
  organizerId: string
  organizerName: string
  status: MigrationStatus
  currentPhase: number
  phases: MigrationPhase[]
  createdAt: string
  scheduledGoLive: string | null
  totalMembers: number
  totalCircles: number
  sourceFiles: SourceFile[]
}

// Association Import

export interface GovernanceRole {
  id: string
  name: string
  permissions: string[]
  hierarchy: number
  memberCount: number
}

export interface Committee {
  id: string
  name: string
  description: string
  memberCount: number
}

export interface GovernanceConfig {
  roles: GovernanceRole[]
  committees: Committee[]
  approvalWorkflow: ApprovalWorkflow
  duesAmount: number
  duesCurrency: string
  duesFrequency: DuesFrequency
  duesGracePeriod: number
}

export interface PrivacySettings {
  directoryListed: boolean
  invitationLink: boolean
  qrCode: boolean
  memberListVisibility: 'all_members' | 'admins_only' | 'hidden'
  financialDataAccess: 'all_members' | 'admins_only' | 'hidden'
  eventVisibility: 'public' | 'members_only' | 'admins_only'
}

export interface CommunicationConfig {
  defaultChannels: string[]
  announcementPermission: 'all_members' | 'admins_moderators' | 'admins_only'
  meetingSchedule: {
    day: string
    frequency: string
    time: string
    week: string
  }
}

export interface ImportedDocument {
  id: string
  name: string
  category: DocumentCategory
  fileType: string
  fileSize: number
  uploadedAt: string
  versionDate: string
}

export interface ImportedAssociation {
  id: string
  migrationId: string
  name: string
  description: string
  type: AssociationType
  logo: string
  primaryLanguage: string
  secondaryLanguages: string[]
  website: string
  contactEmail: string
  country: string
  city: string
  profileCompleteness: number
  visibility: Visibility
  privacySettings: PrivacySettings
  governance: GovernanceConfig
  communication: CommunicationConfig
  documents: ImportedDocument[]
  status: 'importing' | 'active'
}

// Column Mapping

export interface ColumnMapping {
  id: string
  fileId: string
  sourceColumn: string
  targetField: string
  confidence: number
  sampleValues: string[]
  status: ColumnMappingStatus
}

// Member Import

export interface ImportedMember {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  mappedRole: string
  joinDate: string
  importSource: 'file' | 'manual'
  validationStatus: ValidationStatus
  validationErrors: string[]
  invitationStatus: MigrationInvitationStatus
  invitationChannel: MigrationInvitationChannel
  invitationCode?: string
  invitationSentAt: string | null
  registeredAt: string | null
  verificationStatus: VerificationStatus
  circles: string[]
  duesStatus: DuesStatus
  duesPaidThrough?: string
  duesOwedAmount?: number
  duesOwedSince?: string
  bootstrappedTrustScore: number | null
  trustScoreBadge: TrustScoreBadge
  notes: string
}

// Circle Import

export interface PayoutPosition {
  position: number
  memberId: string
  memberName: string
  status: PayoutPositionStatus
  payoutDate: string | null
  payoutAmount: number | null
  note: string
}

export interface OutstandingObligation {
  memberId: string
  memberName: string
  amount: number
  cycle: number
  status: 'missed' | 'partial'
  reason: string
}

export interface CircleFinancialSummary {
  totalCollected: number
  totalPaidOut: number
  emergencyFundBalance: number
  outstandingObligations: OutstandingObligation[]
  expectedEmergencyFund: number
  emergencyFundDiscrepancy: number
  emergencyFundDiscrepancyReason: string | null
}

export interface CircleCalculatedValues {
  totalCircleValue: number
  payoutPerCycle: number
  emergencyFundPerMember: number
  totalDuration: string
  estimatedEndDate: string
}

export interface ValidationWarning {
  code: string
  message: string
  acknowledged: boolean
  acknowledgedBy: string | null
  acknowledgedReason: string | null
  acknowledgedAt: string | null
}

export interface ImportedCircle {
  id: string
  migrationId: string
  name: string
  contributionAmount: number
  currency: string
  frequency: CircleFrequency
  totalPositions: number
  payoutMethod: PayoutMethod
  startDate: string
  isMidCycle: boolean
  currentCycle: number
  nextPaymentDueDate: string
  gracePeriod: number
  lateFeeType: LateFeeType
  lateFeeAmount: number
  maxLateOccurrences: number
  emergencyFundCoversLate: boolean
  emergencyFundRate: number
  customRules: string[]
  calculatedValues: CircleCalculatedValues
  positions: PayoutPosition[]
  financialSummary: CircleFinancialSummary
  importStatus: CircleImportStatus
  validationErrors: string[]
  validationWarnings: ValidationWarning[]
}

// Payment Matrix

export interface PaymentMatrixEntry {
  circleId: string
  memberId: string
  memberName: string
  cycle: number
  status: PaymentStatus
  amount: number
  paidDate: string | null
}

// Historical Financial Data

export interface ImportedContribution {
  id: string
  circleId: string
  memberId: string
  memberName: string
  cycle: number
  amount: number
  paymentDate: string
  paymentMethod: string
  status: 'completed' | 'late' | 'partial'
  tag: 'imported'
  sourceFile: string
  sourceRow: number
}

export interface ImportedPayout {
  id: string
  circleId: string
  memberId: string
  memberName: string
  position: number
  expectedAmount: number
  actualAmount: number
  payoutDate: string
  paymentMethod: string
  discrepancyReason: string | null
}

// Validation Report

export interface ValidationCheck {
  id: string
  description: string
  status: CheckStatus
  details?: string
  fixLink?: string
  acknowledged?: boolean
  acknowledgedBy?: string
  acknowledgedReason?: string
}

export interface ValidationSection {
  name: string
  status: 'passed' | 'has_warnings' | 'has_errors'
  checks: ValidationCheck[]
}

export interface ReadinessSummary {
  associationName: string
  totalMembers: number
  registeredMembers: number
  pendingMembers: number
  activeCircles: number
  totalMonthlyContributions: number
  totalFinancialObligations: number
  estimatedFirstPaymentDate: string
}

export interface ValidationReport {
  id: string
  migrationId: string
  runAt: string
  overallStatus: 'all_passed' | 'warnings_present' | 'errors_present'
  totalChecks: number
  passed: number
  warnings: number
  blockingErrors: number
  sections: ValidationSection[]
  readinessSummary: ReadinessSummary
}

// Member Verification

export interface VerificationDispute {
  id: string
  section: string
  field: string
  currentValue: string
  memberClaim: string
  status: DisputeStatus
  submittedAt: string
  resolvedAt: string | null
  resolution: string | null
}

export interface VerificationSection {
  name: string
  status: 'confirmed' | 'disputed' | 'pending'
}

export interface MemberVerification {
  id: string
  memberId: string
  memberName: string
  status: VerificationStatus
  verifiedAt: string | null
  sections: VerificationSection[]
  trustScoreBoost: number
  disputes: VerificationDispute[]
}

// Audit Trail

export interface AuditEntry {
  id: string
  action: string
  description: string
  actor: string
  timestamp: string
  details: Record<string, unknown> | null
}

// Invitation Funnel

export interface InvitationFunnel {
  total: number
  invited: number
  delivered: number
  opened: number
  clicked: number
  registered: number
  profileComplete: number
  active: number
  notInvited: number
  bounced: number
  codeGenerated: number
}

// Go-Live Configuration

export interface PostMigrationChecklistItem {
  item: string
  status: 'not_started' | 'in_progress' | 'completed'
  detail: string
}

export interface GoLiveConfig {
  readyToGoLive: boolean
  blockingIssues: number
  acknowledgedWarnings: number
  unacknowledgedWarnings: number
  scheduledDate: string | null
  emergencyPauseAvailable: boolean
  gracePeriodDays: number
  postMigrationChecklist: PostMigrationChecklistItem[]
}

// Role Mapping

export interface RoleMapping {
  sourceValue: string
  targetRole: string
  confidence: number
  memberCount: number
  status: RoleMappingStatus
}

// Migration Dashboard Props

export interface MigrationDashboardProps {
  session: MigrationSession
  association: ImportedAssociation
  columnMappings: ColumnMapping[]
  members: ImportedMember[]
  circles: ImportedCircle[]
  paymentMatrix: PaymentMatrixEntry[]
  contributions: ImportedContribution[]
  payouts: ImportedPayout[]
  validationReport: ValidationReport | null
  verifications: MemberVerification[]
  auditTrail: AuditEntry[]
  invitationFunnel: InvitationFunnel
  goLiveConfig: GoLiveConfig
  roleMapping: RoleMapping[]
  onSaveAssociation?: (data: Partial<ImportedAssociation>) => void
  onUploadLogo?: (file: File) => void
  onUploadDocument?: (file: File, category: DocumentCategory) => void
  onSaveGovernance?: (config: GovernanceConfig) => void
  onSavePrivacy?: (settings: PrivacySettings) => void
  onUploadMemberFile?: (file: File) => void
  onConfirmMapping?: (mappings: ColumnMapping[]) => void
  onEditMember?: (memberId: string, field: string, value: string) => void
  onAddMember?: (member: Partial<ImportedMember>) => void
  onConfirmRoles?: (roleMapping: RoleMapping[]) => void
  onSendInvitations?: (memberIds: string[], channel: MigrationInvitationChannel) => void
  onResendInvitation?: (memberId: string, channel: MigrationInvitationChannel) => void
  onGenerateCode?: (memberId: string) => void
  onSaveCircle?: (circle: Partial<ImportedCircle>) => void
  onConfirmPositions?: (circleId: string, positions: PayoutPosition[]) => void
  onUpdatePaymentCell?: (circleId: string, memberId: string, cycle: number, status: PaymentStatus, amount: number) => void
  onConfirmCircleState?: (circleId: string) => void
  onImportAnotherCircle?: () => void
  onFinalizeAllCircles?: () => void
  onUploadContributions?: (circleId: string, file: File) => void
  onSavePayoutHistory?: (circleId: string, payouts: ImportedPayout[]) => void
  onSaveDuesHistory?: (memberDues: Array<{ memberId: string; status: DuesStatus; paidThrough?: string; owedAmount?: number }>) => void
  onRunValidation?: () => void
  onAcknowledgeWarning?: (checkId: string, reason: string) => void
  onVerifyMemberData?: (memberId: string, sections: VerificationSection[]) => void
  onDisputeData?: (memberId: string, dispute: Omit<VerificationDispute, 'id' | 'status' | 'submittedAt' | 'resolvedAt' | 'resolution'>) => void
  onResolveDispute?: (disputeId: string, accepted: boolean, resolution: string) => void
  onGoLive?: () => void
  onScheduleGoLive?: (date: string) => void
  onEmergencyPause?: () => void
  onNavigatePhase?: (phase: number) => void
  onExportReport?: (format: 'csv' | 'xlsx' | 'pdf') => void
}
