// =============================================================================
// Data Types
// =============================================================================

export type FederationStatus = 'active' | 'forming' | 'dissolved'
export type GovernanceType = 'democratic' | 'representative' | 'consensus'
export type FederationRole = 'chapter' | 'affiliate' | 'observer'
export type AssociationDuesStatus = 'paid' | 'pending' | 'overdue'
export type PolicyCategory = 'governance' | 'finance' | 'membership' | 'operations'
export type PolicyEnforcementLevel = 'mandatory' | 'recommended' | 'optional'
export type PolicyStatus = 'active' | 'draft' | 'archived'
export type LeaderRole = 'president' | 'vice_president' | 'secretary_general' | 'treasurer_general' | 'committee_chair'
export type LeaderTermStatus = 'active' | 'expiring_soon' | 'expired'
export type InvoiceStatus = 'paid' | 'pending' | 'overdue'
export type TransferType = 'grant' | 'inter_fund'
export type TransferStatus = 'completed' | 'pending_approval' | 'rejected'
export type ElectionType = 'president' | 'board' | 'referendum'
export type ElectionStatus = 'upcoming' | 'nomination' | 'voting' | 'completed'
export type EventType = 'agm' | 'cultural' | 'workshop' | 'social' | 'training'
export type EventStatus = 'draft' | 'upcoming' | 'completed' | 'cancelled'
export type AnnouncementPriority = 'high' | 'medium' | 'low'
export type ReportType = 'annual' | 'financial' | 'membership' | 'circle_performance' | 'custom'
export type ReportStatus = 'completed' | 'generating' | 'failed'
export type AlertType = 'financial' | 'compliance' | 'governance' | 'membership'
export type AlertSeverity = 'high' | 'medium' | 'low'
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending_review'
export type BudgetStatus = 'draft' | 'approved' | 'closed'
export type DuesFrequency = 'annual' | 'quarterly' | 'monthly'
export type DuesType = 'flat' | 'per_member'

export interface Federation {
  id: string
  name: string
  description: string
  logo: string
  governanceType: GovernanceType
  status: FederationStatus
  foundedAt: string
  charterUrl: string
  totalMembers: number
  totalAssociations: number
  totalActiveCircles: number
  totalFunds: number
  currency: string
  healthScore: number
  createdAt: string
}

export interface ChildAssociation {
  id: string
  federationId: string
  name: string
  logo: string
  type: string
  country: string
  city: string
  language: string
  memberCount: number
  activeCircles: number
  totalFunds: number
  duesStatus: AssociationDuesStatus
  duesCollectionRate: number
  avgTrustScore: number
  memberGrowthPercent: number
  federationRole: FederationRole
  status: 'active' | 'suspended' | 'pending'
  joinedAt: string
  presidentName: string
  presidentId: string
  complianceScore: number
}

export interface FederationLeader {
  id: string
  federationId: string
  userId: string
  name: string
  email: string
  photo: string
  role: LeaderRole
  roleLabel: string
  permissions: string[]
  termStart: string
  termEnd: string
  termStatus: LeaderTermStatus
  assignedAt: string
}

export interface FederationPolicy {
  id: string
  federationId: string
  title: string
  description: string
  category: PolicyCategory
  enforcementLevel: PolicyEnforcementLevel
  effectiveDate: string
  version: number
  status: PolicyStatus
  acknowledgedCount: number
  totalAssociations: number
  compliantCount: number
  nonCompliantAssociations: string[]
  createdAt: string
  updatedAt: string
}

export interface FederationFund {
  id: string
  federationId: string
  name: string
  description: string
  balance: number
  allocationPercent: number
  minimumThreshold: number
  belowThreshold: boolean
  currency: string
  ytdIncome: number
  ytdExpenses: number
}

export interface DuesConfig {
  federationId: string
  amount: number
  type: DuesType
  ratePerMember: number
  frequency: DuesFrequency
  currency: string
  gracePeriodDays: number
  nextDueDate: string
  autoEscalation: boolean
}

export interface DuesInvoice {
  id: string
  federationId: string
  associationId: string
  associationName: string
  amount: number
  period: string
  dueDate: string
  status: InvoiceStatus
  paidAt: string | null
  receiptUrl: string | null
}

export interface BudgetCategory {
  name: string
  budgeted: number
  spent: number
  percentUsed: number
}

export interface FederationBudget {
  id: string
  federationId: string
  year: number
  status: BudgetStatus
  totalBudget: number
  totalSpent: number
  currency: string
  categories: BudgetCategory[]
  approvedAt: string | null
  approvedBy: string | null
}

export interface TransferApproval {
  role: string
  name: string
  approved: boolean
  date: string | null
}

export interface FederationTransfer {
  id: string
  federationId: string
  type: TransferType
  sourceFundId: string
  sourceFundName: string
  targetAssociationId?: string
  targetAssociationName?: string
  targetFundId?: string
  targetFundName?: string
  amount: number
  currency: string
  purpose: string
  status: TransferStatus
  approvals: TransferApproval[]
  createdAt: string
  completedAt: string | null
}

export interface ElectionResult {
  position: string
  winner: string
  votes: number
  totalVotes: number
}

export interface AssociationParticipation {
  associationName: string
  rate: number
}

export interface FederationElection {
  id: string
  federationId: string
  title: string
  type: ElectionType
  status: ElectionStatus
  nominationStart: string | null
  nominationEnd: string | null
  votingStart: string | null
  votingEnd: string | null
  eligibleVoters: number
  candidateCount: number
  participationRate: number | null
  results?: ElectionResult[]
  participationByAssociation?: AssociationParticipation[]
  createdAt: string
}

export interface ElectionCandidate {
  id: string
  federationId: string
  electionId: string
  name: string
  photo: string
  position: string
  statement: string
  endorsements: number
  associationName: string
}

export interface RsvpByAssociation {
  associationName: string
  count: number
}

export interface FederationEvent {
  id: string
  federationId: string
  title: string
  description: string
  type: EventType
  date: string
  endDate: string
  location: string
  targetAssociations: string[]
  capacity: number
  rsvpCount: number
  rsvpByAssociation: RsvpByAssociation[]
  status: EventStatus
  createdAt: string
}

export interface FederationAnnouncement {
  id: string
  federationId: string
  title: string
  content: string
  priority: AnnouncementPriority
  targetAssociations: string[]
  authorName: string
  authorRole: string
  publishedAt: string
  expiresAt: string | null
}

export interface FederationReport {
  id: string
  federationId: string
  title: string
  type: ReportType
  status: ReportStatus
  generatedAt: string | null
  period: string
  downloadUrl: string | null
  scheduled: boolean
}

export interface FederationAlert {
  id: string
  federationId: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  associationId: string | null
  associationName: string | null
  actionUrl: string
  actionLabel: string
  createdAt: string
  acknowledged: boolean
}

export interface MemberAssociation {
  name: string
  role: string
}

export interface AggregatedMember {
  id: string
  federationId: string
  name: string
  email: string
  photo: string | null
  trustScore: number
  associations: MemberAssociation[]
  federationRole: string | null
  totalCircles: number
  status: 'active' | 'suspended' | 'inactive'
}

export interface ComplianceItem {
  id: string
  federationId: string
  associationId: string
  associationName: string
  policyId: string
  policyTitle: string
  status: ComplianceStatus
  details: string
  deadline: string | null
  lastChecked: string
}

export interface CashFlowEntry {
  month: string
  income: number
  expenses: number
}

export interface CashFlowHistory {
  federationId: string
  entries: CashFlowEntry[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface FederationListProps {
  /** All federations */
  federations: Federation[]
  /** Called when user selects a federation to view */
  onSelectFederation?: (id: string) => void
  /** Called when user creates a new federation */
  onCreateFederation?: () => void
}

export interface FederationOverviewProps {
  /** All federations */
  federations: Federation[]
  /** All child associations across federations */
  childAssociations: ChildAssociation[]
  /** All leaders across federations */
  leaders: FederationLeader[]
  /** All fund accounts across federations */
  funds: FederationFund[]
  /** All alerts across federations */
  alerts: FederationAlert[]
  /** All announcements across federations */
  announcements: FederationAnnouncement[]
  /** All upcoming events across federations */
  events: FederationEvent[]
  /** Cash flow histories per federation */
  cashFlowHistories: CashFlowHistory[]
  /** All governance policies across federations */
  policies: FederationPolicy[]
  /** All dues invoices across federations */
  duesInvoices: DuesInvoice[]
  /** All budgets across federations */
  budgets: FederationBudget[]
  /** All transfers across federations */
  transfers: FederationTransfer[]
  /** All elections across federations */
  elections: FederationElection[]
  /** All reports across federations */
  reports: FederationReport[]
  /** All aggregated members across federations */
  aggregatedMembers: AggregatedMember[]
  /** All compliance items across federations */
  complianceItems: ComplianceItem[]
  /** Called when user drills into a specific federation */
  onSelectFederation?: (id: string) => void
  /** Called when user creates a new federation */
  onCreateFederation?: () => void
  /** Called when user acknowledges an alert */
  onAcknowledgeAlert?: (id: string) => void
  /** Called when user generates a cross-federation report */
  onGenerateReport?: (type: ReportType) => void
}

export interface FederationDashboardProps {
  /** The federation entity with aggregated metrics */
  federation: Federation
  /** Child associations linked to the federation */
  childAssociations: ChildAssociation[]
  /** Federation leadership team */
  leaders: FederationLeader[]
  /** Federation fund accounts */
  funds: FederationFund[]
  /** Active alerts requiring attention */
  alerts: FederationAlert[]
  /** Recent announcements */
  announcements: FederationAnnouncement[]
  /** Upcoming events */
  events: FederationEvent[]
  /** 12-month cash flow history for charts */
  cashFlowHistory: CashFlowEntry[]
  /** Governance policies */
  policies: FederationPolicy[]
  /** Dues invoices */
  duesInvoices: DuesInvoice[]
  /** Dues configuration */
  duesConfig: DuesConfig
  /** Annual budget */
  budget: FederationBudget
  /** Inter-association transfers */
  transfers: FederationTransfer[]
  /** Federation elections */
  elections: FederationElection[]
  /** Election candidates */
  candidates: ElectionCandidate[]
  /** Federation reports */
  reports: FederationReport[]
  /** Aggregated member directory */
  aggregatedMembers: AggregatedMember[]
  /** Compliance tracking items */
  complianceItems: ComplianceItem[]
  /** Called when user wants to drill into a child association */
  onViewAssociation?: (id: string) => void
  /** Called when user wants to compare associations */
  onCompareAssociations?: (ids: string[]) => void
  /** Called when user wants to invite/link a new association */
  onAddAssociation?: () => void
  /** Called when user wants to unlink an association */
  onUnlinkAssociation?: (id: string) => void
  /** Called when user acknowledges an alert */
  onAcknowledgeAlert?: (id: string) => void
  /** Called when user creates a new policy */
  onCreatePolicy?: () => void
  /** Called when user edits a policy */
  onEditPolicy?: (id: string) => void
  /** Called when user assigns a leadership role */
  onAssignRole?: () => void
  /** Called when user initiates role transfer */
  onTransferRole?: (leaderId: string) => void
  /** Called when user configures dues */
  onConfigureDues?: () => void
  /** Called when user creates a new fund transfer */
  onCreateTransfer?: () => void
  /** Called when user approves a pending transfer */
  onApproveTransfer?: (id: string) => void
  /** Called when user creates an election */
  onCreateElection?: () => void
  /** Called when user creates a federation event */
  onCreateEvent?: () => void
  /** Called when user creates a federation announcement */
  onCreateAnnouncement?: () => void
  /** Called when user generates a report */
  onGenerateReport?: (type: ReportType) => void
  /** Called when user schedules a recurring report */
  onScheduleReport?: (type: ReportType) => void
  /** Called when user exports member directory */
  onExportMembers?: (format: 'csv' | 'pdf') => void
  /** Called when user searches for a member */
  onSearchMember?: (query: string) => void
  /** Called when user creates the annual budget */
  onCreateBudget?: () => void
  /** Called when user edits the federation settings */
  onEditFederation?: () => void
}
