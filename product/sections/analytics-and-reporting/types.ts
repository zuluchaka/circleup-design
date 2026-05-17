// =============================================================================
// Data Types
// =============================================================================

export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: 'member' | 'organizer' | 'admin' | 'federation_admin'
  trustScore: number
  memberSince: string
}

export interface ComparedToPreviousYear {
  contributions: number
  payouts: number
  netSavings: number
}

export interface PersonalDashboard {
  totalSavings: number
  totalContributions: number
  totalPayoutsReceived: number
  netSavingsThisYear: number
  activeCircles: number
  completedCircles: number
  onTimePaymentRate: number
  trustScoreTrend: 'up' | 'down' | 'stable'
  trustScoreChange: number
  nextPayoutAmount: number
  nextPayoutDate: string
  nextPayoutCircle: string
  savingsGrowthPercent: number
  comparedToPreviousYear: ComparedToPreviousYear
}

export interface ContributionHistoryItem {
  month: string
  amount: number
  onTime: boolean
}

export interface UpcomingPayout {
  id: string
  circleId: string
  circleName: string
  amount: number
  scheduledDate: string
  position: number
  totalPositions: number
  status: 'scheduled' | 'processing' | 'completed'
}

export interface CircleParticipation {
  circleId: string
  circleName: string
  associationName: string
  contributionAmount: number
  frequency: 'weekly' | 'bi_weekly' | 'monthly'
  status: 'forming' | 'active' | 'completed' | 'cancelled'
  currentCycle: number
  totalCycles: number
  myPosition: number
  totalContributed: number
  payoutReceived: boolean
  payoutReceivedDate?: string
  payoutAmount?: number
  expectedPayoutDate?: string
  onTimeRate: number
  nextDueDate: string
}

export interface GoalMilestone {
  amount: number
  reached: boolean
  reachedDate: string | null
}

export interface SavingsGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  createdAt: string
  status: 'on_track' | 'at_risk' | 'behind' | 'completed'
  progressPercent: number
  monthlyTarget: number
  actualMonthlyAverage: number
  milestones: GoalMilestone[]
  linkedCircles: string[]
}

export interface BenchmarkComparison {
  collectionRate: { value: number; benchmark: number; status: 'above' | 'below' | 'at' }
  onTimePayment: { value: number; benchmark: number; status: 'above' | 'below' | 'at' }
  engagement: { value: number; benchmark: number; status: 'above' | 'below' | 'at' }
}

export interface MonthlyTrend {
  month: string
  collectionRate: number
  onTimeRate: number
}

export interface RiskIndicators {
  membersAtRisk: number
  latePaymentsThisMonth: number
  emergencyFundUsage: number
}

export interface CircleHealthMetrics {
  circleId: string
  circleName: string
  associationName: string
  status: 'forming' | 'active' | 'completed' | 'cancelled'
  currentCycle: number
  totalCycles: number
  memberCount: number
  collectionRate: number
  collectionRateTrend: 'up' | 'down' | 'stable'
  onTimePaymentRate: number
  onTimePaymentTrend: 'up' | 'down' | 'stable'
  totalCollected: number
  totalDisbursed: number
  emergencyFundBalance: number
  averageEngagementScore: number
  benchmarkComparison: BenchmarkComparison
  monthlyTrends: MonthlyTrend[]
  riskIndicators: RiskIndicators
}

export interface MemberContribution {
  userId: string
  name: string
  avatar: string | null
  role: 'organizer' | 'member'
  totalContributed: number
  onTimePayments: number
  latePayments: number
  missedPayments: number
  onTimeRate: number
  payoutReceived: boolean
  payoutPosition: number
  trustScore: number
  status: 'excellent' | 'good' | 'at_risk' | 'defaulted'
}

export interface TopPerformingCircle {
  id: string
  name: string
  collectionRate: number
}

export interface CircleNeedingAttention {
  id: string
  name: string
  issue: string
  collectionRate: number
}

export interface AssociationMonthlyTrend {
  month: string
  contributions: number
  payouts: number
  members: number
}

export interface AssociationMetrics {
  associationId: string
  associationName: string
  totalMembers: number
  activeMembers: number
  totalCircles: number
  activeCircles: number
  completedCircles: number
  totalFundsUnderManagement: number
  totalContributionsThisYear: number
  totalPayoutsThisYear: number
  averageCollectionRate: number
  averageOnTimeRate: number
  defaultRate: number
  defaultRateTrend: 'up' | 'down' | 'stable'
  emergencyFundBalance: number
  emergencyFundUsageThisYear: number
  memberGrowthRate: number
  topPerformingCircles: TopPerformingCircle[]
  circlesNeedingAttention: CircleNeedingAttention[]
  monthlyTrends: AssociationMonthlyTrend[]
}

export interface RegionalBreakdown {
  region: string
  associations: number
  members: number
  fundsUnderManagement: number
  collectionRate: number
}

export interface GrowthTrends {
  memberGrowthRate: number
  associationGrowthRate: number
  fundsGrowthRate: number
}

export interface ComplianceStatus {
  associationsFullyCompliant: number
  associationsPendingReview: number
  associationsRequiringAction: number
}

export interface FederationMetrics {
  federationName: string
  totalAssociations: number
  totalCircles: number
  totalMembers: number
  totalFundsUnderManagement: number
  totalContributionsThisYear: number
  totalPayoutsThisYear: number
  averageCollectionRate: number
  averageDefaultRate: number
  kycCompletionRate: number
  regionalBreakdown: RegionalBreakdown[]
  growthTrends: GrowthTrends
  complianceStatus: ComplianceStatus
}

export interface AssociationBenchmark {
  associationId: string
  associationName: string
  region: string
  members: number
  circles: number
  collectionRate: number
  onTimeRate: number
  defaultRate: number
  engagementScore: number
  kycCompletionRate: number
  rank: number
}

export interface StatementSummary {
  totalContributions: number
  totalPayoutsReceived: number
  netSavings: number
  transactionCount: number
}

export interface Statement {
  id: string
  title: string
  type: 'monthly' | 'quarterly' | 'annual' | 'custom'
  startDate: string
  endDate: string
  generatedAt: string
  format: 'pdf' | 'csv' | 'xlsx'
  fileSize: string
  downloadUrl: string
  summary: StatementSummary
}

export interface ScheduledReport {
  id: string
  name: string
  type: 'personal_statement' | 'circle_health' | 'contribution_summary' | 'association_summary' | 'compliance' | 'federation_overview'
  circleId?: string
  circleName?: string
  associationId?: string
  associationName?: string
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  dayOfWeek?: string
  dayOfMonth?: number
  monthOfQuarter?: number
  monthOfYear?: number
  format: 'pdf' | 'csv' | 'xlsx'
  recipients: string[]
  lastGenerated: string
  nextGeneration: string
  status: 'active' | 'paused'
  createdBy: string
}

export interface InsightAction {
  label: string
  type: 'adjust_contribution' | 'edit_goal' | 'verify_payment_method' | 'view_details'
  circleId?: string
  goalId?: string
}

export interface AIInsight {
  id: string
  type: 'savings_projection' | 'contribution_optimization' | 'risk_alert' | 'payout_reminder' | 'year_end_summary' | 'recommendation'
  title: string
  description: string
  priority: 'positive' | 'suggestion' | 'warning' | 'info'
  actionable: boolean
  action?: InsightAction
  createdAt: string
  relatedGoalId?: string
  relatedCircleId?: string
}

export interface ReportType {
  id: string
  name: string
  description: string
}

export interface ExportFormat {
  id: string
  name: string
  description: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface PersonalDashboardProps {
  /** Current logged-in user */
  currentUser: User
  /** Aggregated dashboard metrics */
  dashboard: PersonalDashboard
  /** Monthly contribution history for chart */
  contributionHistory: ContributionHistoryItem[]
  /** List of upcoming payouts */
  upcomingPayouts: UpcomingPayout[]
  /** User's circle participations */
  circleParticipations: CircleParticipation[]
  /** AI-powered insights and recommendations */
  aiInsights: AIInsight[]
  /** Called when user wants to view a circle's details */
  onViewCircle?: (circleId: string) => void
  /** Called when user clicks an insight action */
  onInsightAction?: (insight: AIInsight) => void
  /** Called when user wants to download a statement */
  onDownloadStatement?: (type: 'monthly' | 'quarterly' | 'annual') => void
}

export interface SavingsGoalsProps {
  /** User's savings goals */
  goals: SavingsGoal[]
  /** User's circle participations for linking */
  circleParticipations: CircleParticipation[]
  /** AI insights related to goals */
  aiInsights: AIInsight[]
  /** Called when user wants to create a new goal */
  onCreateGoal?: () => void
  /** Called when user wants to edit a goal */
  onEditGoal?: (goalId: string) => void
  /** Called when user wants to delete a goal */
  onDeleteGoal?: (goalId: string) => void
  /** Called when user wants to link a circle to a goal */
  onLinkCircle?: (goalId: string, circleId: string) => void
  /** Called when user clicks an insight action */
  onInsightAction?: (insight: AIInsight) => void
}

export interface CircleHealthDashboardProps {
  /** Circle health metrics */
  metrics: CircleHealthMetrics
  /** Per-member contribution data */
  memberContributions: MemberContribution[]
  /** Called when user wants to view a member's profile */
  onViewMember?: (userId: string) => void
  /** Called when user wants to send a reminder to a member */
  onSendReminder?: (userId: string) => void
  /** Called when user wants to export the report */
  onExportReport?: (format: 'pdf' | 'csv' | 'xlsx') => void
  /** Called when user wants to schedule a report */
  onScheduleReport?: () => void
}

export interface AssociationDashboardProps {
  /** Association-level metrics */
  metrics: AssociationMetrics
  /** Called when user wants to view a circle's details */
  onViewCircle?: (circleId: string) => void
  /** Called when user wants to export the report */
  onExportReport?: (format: 'pdf' | 'csv' | 'xlsx') => void
  /** Called when user wants to view circles needing attention */
  onViewAtRiskCircles?: () => void
}

export interface FederationDashboardProps {
  /** Federation-level metrics */
  metrics: FederationMetrics
  /** Association benchmarks for comparison */
  benchmarks: AssociationBenchmark[]
  /** Called when user wants to view an association's details */
  onViewAssociation?: (associationId: string) => void
  /** Called when user wants to export the report */
  onExportReport?: (format: 'pdf' | 'csv' | 'xlsx') => void
  /** Called when user wants to view compliance details */
  onViewComplianceDetails?: () => void
}

export interface StatementsProps {
  /** List of generated statements */
  statements: Statement[]
  /** Available report types */
  reportTypes: ReportType[]
  /** Available export formats */
  exportFormats: ExportFormat[]
  /** Called when user wants to generate a new statement */
  onGenerateStatement?: (type: string, startDate: string, endDate: string, format: string) => void
  /** Called when user wants to download a statement */
  onDownloadStatement?: (statementId: string) => void
  /** Called when user wants to delete a statement */
  onDeleteStatement?: (statementId: string) => void
  /** Called when user wants to share a statement */
  onShareStatement?: (statementId: string, email: string) => void
}

export interface ReportsCenterProps {
  /** List of scheduled reports */
  scheduledReports: ScheduledReport[]
  /** Available report types */
  reportTypes: ReportType[]
  /** Available export formats */
  exportFormats: ExportFormat[]
  /** User's circles for report configuration */
  circleParticipations: CircleParticipation[]
  /** Called when user wants to create a new scheduled report */
  onCreateReport?: () => void
  /** Called when user wants to edit a scheduled report */
  onEditReport?: (reportId: string) => void
  /** Called when user wants to delete a scheduled report */
  onDeleteReport?: (reportId: string) => void
  /** Called when user wants to pause/resume a report */
  onToggleReportStatus?: (reportId: string) => void
  /** Called when user wants to run a report immediately */
  onRunReportNow?: (reportId: string) => void
}
