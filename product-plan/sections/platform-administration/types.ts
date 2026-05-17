// Platform Administration Types

// Enums
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
export type TicketChannel = 'app' | 'email' | 'chat' | 'phone'
export type TicketCategory =
  | 'payment_issue'
  | 'payout_issue'
  | 'account_access'
  | 'circle_question'
  | 'feature_request'
  | 'bug_report'
  | 'compliance'
  | 'other'

export type DisputeType = 'payment' | 'payout' | 'membership' | 'fee' | 'other'
export type DisputeStatus = 'open' | 'investigating' | 'awaiting_response' | 'resolved' | 'appealed'
export type DisputeDecision = 'favor_requester' | 'favor_respondent' | 'split' | 'dismissed' | null

export type AlertType = 'aml' | 'fraud' | 'velocity' | 'pattern' | 'kyc' | 'sanction'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive' | 'escalated'

export type ReportType = 'monthly' | 'quarterly' | 'annual' | 'ad_hoc'
export type ReportStatus = 'draft' | 'pending_review' | 'submitted' | 'accepted' | 'rejected'

export type GDPRRequestType = 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
export type GDPRRequestStatus = 'received' | 'verifying' | 'processing' | 'completed' | 'rejected'

export type ServiceStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance'

// Interfaces

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  subject: string
  description: string
  channel: TicketChannel
  assignedTo: string | null
  assignedToName?: string
  slaDeadline: string
  tags: string[]
  messages: TicketMessage[]
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  satisfactionRating?: number
}

export interface TicketMessage {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  authorType: 'user' | 'agent' | 'system'
  content: string
  attachments: Attachment[]
  isInternal: boolean
  createdAt: string
}

export interface Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
}

export interface Dispute {
  id: string
  ticketId: string
  type: DisputeType
  amount: number
  currency: string
  parties: DisputeParty[]
  status: DisputeStatus
  decision: DisputeDecision
  resolution?: string
  evidence: Evidence[]
  timeline: DisputeEvent[]
  createdAt: string
  resolvedAt: string | null
  resolvedBy: string | null
}

export interface DisputeParty {
  userId: string
  userName: string
  role: 'requester' | 'respondent'
  statement?: string
}

export interface Evidence {
  id: string
  submittedBy: string
  type: 'document' | 'screenshot' | 'transaction' | 'communication'
  description: string
  fileUrl?: string
  transactionId?: string
  createdAt: string
}

export interface DisputeEvent {
  id: string
  type: 'created' | 'evidence_added' | 'status_changed' | 'decision_made' | 'appealed'
  description: string
  actorId: string
  actorName: string
  createdAt: string
}

export interface ComplianceAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  status: AlertStatus
  userId?: string
  userName?: string
  transactionId?: string
  transactionAmount?: number
  description: string
  riskScore: number
  indicators: string[]
  assignedTo: string | null
  assignedToName?: string
  notes: AlertNote[]
  resolution?: string
  createdAt: string
  resolvedAt: string | null
}

export interface AlertNote {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resourceType: string
  resourceId: string
  changes: Record<string, { before: unknown; after: unknown }>
  ipAddress: string
  userAgent: string
  timestamp: string
}

export interface RegulatoryReport {
  id: string
  type: ReportType
  name: string
  reportingPeriod: {
    start: string
    end: string
  }
  status: ReportStatus
  submittedAt: string | null
  submittedBy: string | null
  fileUrl: string | null
  regulatorResponse?: string
  dueDate: string
  createdAt: string
}

export interface GDPRRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  requestType: GDPRRequestType
  status: GDPRRequestStatus
  description?: string
  deadline: string
  assignedTo: string | null
  dataExportUrl?: string
  completedAt: string | null
  createdAt: string
}

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  targeting: FlagTargeting
  rolloutPercentage: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface FlagTargeting {
  userIds?: string[]
  associationIds?: string[]
  userSegments?: string[]
  countries?: string[]
}

export interface ServiceHealth {
  id: string
  name: string
  description: string
  status: ServiceStatus
  uptime: number
  lastIncident?: string
  metrics: ServiceMetrics
}

export interface ServiceMetrics {
  responseTime: number
  errorRate: number
  requestsPerMinute: number
}

export interface SystemMetrics {
  activeUsers: number
  totalTransactions: number
  transactionVolume: number
  openTickets: number
  openAlerts: number
  systemLoad: number
  databaseConnections: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'platform_admin' | 'compliance_officer' | 'support_agent' | 'support_manager' | 'devops'
  permissions: string[]
  lastActive: string
}

// =============================================================================
// RBAC Types
// =============================================================================

export type AccessMode = 'none' | 'read' | 'write' | 'read_write'
export type PermissionScope = 'federation' | 'association' | 'circle'
export type AccessRoleName = 'admin' | 'standard_user' | 'invitee'
export type OverrideStatus = 'active' | 'expired' | 'revoked'
export type AccessRequestStatus = 'pending' | 'approved' | 'denied' | 'expired'
export type RBACActionType =
  | 'role_assigned'
  | 'role_removed'
  | 'permission_changed'
  | 'override_created'
  | 'override_revoked'
  | 'template_applied'
  | 'access_requested'
  | 'access_granted'
  | 'access_denied'
  | 'review_completed'
  | 'emergency_access'
  | 'delegation_created'
export type ReviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue'

export interface AccessRole {
  id: string
  name: AccessRoleName
  label: string
  description: string
  ceilingPermissions: Record<string, AccessMode>
  userCount: number
  isSystem: boolean
  color: string
}

export interface ContextualRole {
  id: string
  name: string
  label: string
  description: string
  scope: PermissionScope
  permissions: Record<string, AccessMode>
  isCustom: boolean
  isSystem: boolean
  createdBy: string | null
  userCount: number
  createdAt: string
}

export interface FeatureDefinition {
  id: string
  name: string
  slug: string
  scope: PermissionScope
  category: string
  parentId: string | null
  description: string
  defaultMode: AccessMode
  containsPersonalData: boolean
  children?: FeatureDefinition[]
}

export interface PermissionMatrixCell {
  featureId: string
  accessMode: AccessMode
  isInherited: boolean
  overriddenFrom?: AccessMode
}

export interface PermissionMatrixRow {
  roleId: string
  roleName: string
  roleLabel: string
  cells: Record<string, PermissionMatrixCell>
}

export interface PermissionMatrix {
  scope: PermissionScope
  features: FeatureDefinition[]
  rows: PermissionMatrixRow[]
}

export interface PermissionOverride {
  id: string
  userId: string
  userName: string
  featureId: string
  featureName: string
  scopeType: PermissionScope
  scopeId: string
  scopeName: string
  accessMode: AccessMode
  previousMode: AccessMode
  reason: string
  grantedBy: string
  grantedByName: string
  expiresAt: string | null
  isTemporary: boolean
  status: OverrideStatus
  createdAt: string
}

export interface PermissionTemplate {
  id: string
  name: string
  description: string
  scope: PermissionScope
  permissions: Record<string, AccessMode>
  version: number
  createdBy: string
  createdByName: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface AccessRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  requesterAvatar?: string
  featureId: string
  featureName: string
  scopeType: PermissionScope
  scopeId: string
  scopeName: string
  currentMode: AccessMode
  requestedMode: AccessMode
  justification: string
  status: AccessRequestStatus
  reviewerId: string | null
  reviewerName: string | null
  reviewerComment: string | null
  isTemporary: boolean
  expiresAt: string | null
  createdAt: string
  reviewedAt: string | null
}

export interface RBACauditEntry {
  id: string
  actorId: string
  actorName: string
  actionType: RBACActionType
  targetType: 'user' | 'role' | 'feature' | 'template' | 'override'
  targetId: string
  targetName: string
  changes: Record<string, { before: unknown; after: unknown }>
  reason: string | null
  scope: PermissionScope | null
  scopeId: string | null
  scopeName: string | null
  timestamp: string
}

export interface PeriodicReview {
  id: string
  name: string
  scope: PermissionScope
  status: ReviewStatus
  startDate: string
  dueDate: string
  reviewerId: string
  reviewerName: string
  totalItems: number
  completedItems: number
  findings: ReviewFinding[]
  createdAt: string
}

export interface ReviewFinding {
  userId: string
  userName: string
  action: 'confirmed' | 'modified' | 'revoked'
  featureId: string
  featureName: string
  previousMode: AccessMode
  newMode: AccessMode | null
  note: string
}

export interface SoDRule {
  id: string
  name: string
  description: string
  conflictingPermissions: [string, string]
  scope: PermissionScope
  enforced: boolean
  violations: number
  lastChecked: string
}

export interface PermissionAnomaly {
  id: string
  type: 'accumulation' | 'dormant_elevated' | 'rapid_changes' | 'unusual_pattern'
  severity: 'low' | 'medium' | 'high'
  userId: string
  userName: string
  description: string
  detectedAt: string
  acknowledged: boolean
  acknowledgedBy: string | null
}

export interface UserPermissionSummary {
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  accessRole: AccessRoleName
  accessRoleLabel: string
  contextualRoles: {
    roleId: string
    roleName: string
    scope: PermissionScope
    scopeId: string
    scopeName: string
  }[]
  overrideCount: number
  temporaryGrantCount: number
  lastPermissionChange: string
  anomalyCount: number
}

export interface RBACMetrics {
  totalAccessRoles: number
  totalContextualRoles: number
  totalFeatures: number
  totalOverrides: number
  activeTemporaryGrants: number
  pendingAccessRequests: number
  pendingReviews: number
  sodViolations: number
  anomaliesDetected: number
  usersPerAccessRole: Record<AccessRoleName, number>
  recentChanges: number
  cacheHitRate: number
}

export interface PermissionSimulation {
  id: string
  userId: string
  userName: string
  proposedChanges: {
    featureId: string
    featureName: string
    currentMode: AccessMode
    proposedMode: AccessMode
  }[]
  effectiveBefore: Record<string, AccessMode>
  effectiveAfter: Record<string, AccessMode>
  gainedFeatures: string[]
  lostFeatures: string[]
  conflicts: string[]
  createdAt: string
  createdBy: string
}

// =============================================================================
// Component Props
// =============================================================================

// Component Props (existing)

export interface AdminDashboardProps {
  metrics: SystemMetrics
  recentAlerts: ComplianceAlert[]
  recentTickets: SupportTicket[]
  services: ServiceHealth[]
  onAlertClick?: (alertId: string) => void
  onTicketClick?: (ticketId: string) => void
}

export interface UserManagementProps {
  onSearch?: (query: string) => void
  onUserSelect?: (userId: string) => void
  onUserAction?: (userId: string, action: string) => void
}

export interface ComplianceDashboardProps {
  alerts: ComplianceAlert[]
  gdprRequests: GDPRRequest[]
  reports: RegulatoryReport[]
  onAlertClick?: (alertId: string) => void
  onRequestClick?: (requestId: string) => void
  onGenerateReport?: (type: ReportType) => void
}

export interface SupportInboxProps {
  tickets: SupportTicket[]
  currentAgent: AdminUser
  onTicketSelect?: (ticketId: string) => void
  onAssign?: (ticketId: string, agentId: string) => void
  onReply?: (ticketId: string, message: string) => void
  onResolve?: (ticketId: string) => void
}

export interface DisputeCenterProps {
  disputes: Dispute[]
  onDisputeSelect?: (disputeId: string) => void
  onAddEvidence?: (disputeId: string, evidence: Partial<Evidence>) => void
  onMakeDecision?: (disputeId: string, decision: DisputeDecision, resolution: string) => void
}

export interface SystemHealthProps {
  services: ServiceHealth[]
  metrics: SystemMetrics
  onServiceClick?: (serviceId: string) => void
  onCreateIncident?: () => void
}

export interface FeatureFlagsProps {
  flags: FeatureFlag[]
  onToggle?: (flagId: string, enabled: boolean) => void
  onCreate?: () => void
  onEdit?: (flagId: string) => void
}

// RBAC Component Props

export interface RBACDashboardProps {
  metrics: RBACMetrics
  recentAuditEntries: RBACauditEntry[]
  anomalies: PermissionAnomaly[]
  pendingRequests: AccessRequest[]
  pendingReviews: PeriodicReview[]
  onViewAuditTrail?: () => void
  onViewRequests?: () => void
  onViewAnomalies?: () => void
  onStartReview?: () => void
}

export interface PermissionMatrixProps {
  matrix: PermissionMatrix
  accessRoles: AccessRole[]
  templates: PermissionTemplate[]
  onCellChange?: (roleId: string, featureId: string, mode: AccessMode) => void
  onSave?: () => void
  onDiscard?: () => void
  onApplyTemplate?: (templateId: string, roleId: string) => void
  onExport?: () => void
  onImport?: () => void
}

export interface RoleManagerProps {
  accessRoles: AccessRole[]
  contextualRoles: ContextualRole[]
  sodRules: SoDRule[]
  onEditAccessRole?: (roleId: string) => void
  onCreateContextualRole?: () => void
  onEditContextualRole?: (roleId: string) => void
  onDeleteContextualRole?: (roleId: string) => void
  onBulkAssign?: () => void
  onCompareRoles?: (roleIds: string[]) => void
}

export interface UserPermissionsProps {
  user: UserPermissionSummary
  effectivePermissions: Record<string, AccessMode>
  overrides: PermissionOverride[]
  permissionSources: Record<string, { source: string; mode: AccessMode }[]>
  auditEntries: RBACauditEntry[]
  onCreateOverride?: (featureId: string, mode: AccessMode, reason: string) => void
  onRevokeOverride?: (overrideId: string) => void
  onCreateTemporaryGrant?: (featureId: string, mode: AccessMode, expiresAt: string, reason: string) => void
}

export interface RBACAuditTrailProps {
  entries: RBACauditEntry[]
  reviews: PeriodicReview[]
  sodRules: SoDRule[]
  onExport?: (format: 'csv' | 'pdf') => void
  onStartReview?: () => void
  onViewReview?: (reviewId: string) => void
}

export interface AccessRequestsProps {
  requests: AccessRequest[]
  features: FeatureDefinition[]
  onApprove?: (requestId: string, comment: string, isTemporary: boolean, expiresAt?: string) => void
  onDeny?: (requestId: string, comment: string) => void
  onCreateRequest?: () => void
}

export interface PermissionSimulatorProps {
  users: UserPermissionSummary[]
  features: FeatureDefinition[]
  simulation: PermissionSimulation | null
  onSelectUser?: (userId: string) => void
  onAddChange?: (featureId: string, mode: AccessMode) => void
  onRunSimulation?: () => void
  onApplySimulation?: () => void
  onClear?: () => void
}
