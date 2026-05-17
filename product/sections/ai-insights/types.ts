// =============================================================================
// Circle Recommendations
// =============================================================================

export interface CircleRecommendation {
  id: string
  circleId: string
  circleName: string
  matchPercentage: number
  contributionAmount: number
  frequency: 'weekly' | 'bi_weekly' | 'monthly'
  memberCount: number
  maxParticipants: number
  organizerName: string
  organizerTrustScore: number
  matchReasons: string[]
  estimatedPayoutDate: string
  riskLevel: 'low' | 'medium' | 'high'
  tags: string[]
  status: 'open' | 'full' | 'forming'
}

// =============================================================================
// Financial Health Chat
// =============================================================================

export interface ChatInsights {
  savingsRate?: number
  monthOverMonthChange?: number
  goalsOnTrack?: number
  goalsAtRisk?: number
  currentGoalProgress?: number
  projectedProgress?: number
  timelineSavedMonths?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  insights?: ChatInsights
}

export interface FinancialHealthChat {
  conversationId: string
  userId: string
  messages: ChatMessage[]
  lastUpdated: string
}

// =============================================================================
// Contribution Suggestions
// =============================================================================

export interface IncomePatterns {
  averageMonthlyIncome: number
  variability: 'low' | 'medium' | 'high'
  recentTrend: 'increasing' | 'stable' | 'decreasing'
}

export interface ImpactProjection {
  additionalSavingsPerYear: number
  goalAcceleration: string
}

export interface ContributionSuggestion {
  id: string
  userId: string
  suggestedAmount: number
  currentAmount: number
  changePercent: number
  confidence: number
  reasoning: string
  incomePatterns: IncomePatterns
  affordabilityScore: number
  impactProjection: ImpactProjection
  status: 'pending' | 'accepted' | 'dismissed'
  createdAt: string
}

// =============================================================================
// Cash Flow Alerts
// =============================================================================

export interface SuggestedAction {
  action: string
  description: string
  impact: string
  priority?: 'high' | 'medium' | 'low'
}

export interface CashFlowAlert {
  id: string
  userId: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  predictedShortfall: number
  contributionDueDate: string
  contributionAmount: number
  daysUntilDue: number
  confidence: number
  factors: string[]
  suggestedActions: SuggestedAction[]
  status: 'active' | 'resolved' | 'dismissed'
  createdAt: string
}

// =============================================================================
// Savings Opportunities
// =============================================================================

export interface AllocationSuggestion {
  allocation: string
  amount: number
  impact: string
}

export interface SavingsOpportunity {
  id: string
  userId: string
  type: 'surplus_detected' | 'income_increase' | 'expense_reduction'
  title: string
  description: string
  surplusAmount: number
  detectedDate: string
  confidence: number
  suggestions: AllocationSuggestion[]
  status: 'pending' | 'viewed' | 'acted' | 'dismissed'
  expiresAt: string
}

// =============================================================================
// Seasonal Patterns
// =============================================================================

export interface SeasonalPatternItem {
  type: 'high_spending' | 'low_spending' | 'income_spike' | 'income_dip'
  months: string[]
  averageIncrease?: number
  averageDecrease?: number
  description: string
  recommendation: string
}

export interface MonthlyTrend {
  month: string
  savingsRate: number
  spending: number
  income: number
}

export interface YearOverYearComparison {
  previousYearSavings: number
  currentYearSavings: number
  improvement: number
}

export interface SeasonalPatterns {
  userId: string
  analysisDate: string
  dataMonths: number
  patterns: SeasonalPatternItem[]
  monthlyTrends: MonthlyTrend[]
  yearOverYearComparison: YearOverYearComparison
}

// =============================================================================
// Cross-Circle Insights
// =============================================================================

export interface PortfolioSummary {
  totalCircles: number
  totalMonthlyContribution: number
  totalContributedAllTime: number
  totalPayoutsReceived: number
  totalPayoutValue: number
  netPosition: number
  averageOnTimeRate: number
  overallTrustScore: number
}

export interface CircleBreakdownItem {
  circleId: string
  circleName: string
  contribution: number
  frequency: 'weekly' | 'bi_weekly' | 'monthly'
  position: number
  totalMembers: number
  nextPayoutDate: string
  contributedToDate: number
  payoutsReceived: number
  onTimeRate: number
  healthScore: number
}

export interface ProjectedPayout {
  circleId: string
  date: string
  amount: number
}

export interface CrossCircleInsights {
  userId: string
  analysisDate: string
  summary: PortfolioSummary
  circleBreakdown: CircleBreakdownItem[]
  diversificationScore: number
  riskAssessment: string
  projectedAnnualSavings: number
  projectedPayouts2026: ProjectedPayout[]
}

// =============================================================================
// Member Risk Scores
// =============================================================================

export interface RiskFactor {
  name: string
  weight: number
  score: number
  detail: string
}

export interface MemberRiskScore {
  id: string
  applicantId: string
  applicantName: string
  circleId: string
  circleName: string
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  factors: RiskFactor[]
  recommendation: 'approve' | 'review' | 'deny'
  similarMemberComparison: string
  requestedAt: string
}

// =============================================================================
// Circle Health Scores
// =============================================================================

export interface HealthMetrics {
  collectionRate: number
  onTimePaymentRate: number
  memberEngagement: number
  organizerResponsiveness: number
  memberRetention: number
  disputeRate: number
}

export interface ImprovementArea {
  area: string
  currentValue: number
  targetValue: number
  suggestion: string
  impact: string
}

export interface CircleHealthScore {
  id: string
  circleId: string
  circleName: string
  healthScore: number
  healthLevel: 'excellent' | 'good' | 'fair' | 'poor'
  trend: 'improving' | 'stable' | 'declining'
  analysisDate: string
  metrics: HealthMetrics
  strengths: string[]
  improvements: ImprovementArea[]
  riskFactors: string[]
  comparisonToSimilar: string
}

// =============================================================================
// Churn Warnings
// =============================================================================

export interface ChurnIndicator {
  signal: string
  detail: string
}

export interface ChurnWarning {
  id: string
  memberId: string
  memberName: string
  circleId: string
  circleName: string
  churnRisk: number
  riskLevel: 'low' | 'medium' | 'high'
  predictedChurnDate: string
  confidence: number
  warningType: 'likely_to_leave' | 'likely_to_default'
  indicators: ChurnIndicator[]
  suggestedActions: SuggestedAction[]
  status: 'active' | 'resolved' | 'escalated'
  detectedAt: string
}

// =============================================================================
// Configuration Suggestions
// =============================================================================

export interface ConfigOption<T> {
  recommended: T
  range?: { min: T; max: T }
  alternatives?: T[]
  reasoning: string
}

export interface CircleConfigurationSuggestions {
  contributionAmount: ConfigOption<number>
  frequency: ConfigOption<'weekly' | 'bi_weekly' | 'monthly'>
  memberCount: ConfigOption<number>
  payoutMethod: ConfigOption<'fixed' | 'random' | 'bidding' | 'trust_score'>
  emergencyFundRate: ConfigOption<number>
}

export interface ConfigurationSuggestion {
  id: string
  circleId: string
  organizerId: string
  suggestionType: 'new_circle' | 'optimization'
  title: string
  confidence: number
  basedOn: string
  suggestions: CircleConfigurationSuggestions
  predictedSuccessRate: number
  createdAt: string
}

// =============================================================================
// Payout Order Recommendations
// =============================================================================

export interface PayoutPositionRecommendation {
  position: number
  memberId: string
  memberName: string
  needScore: number
  factors: string[]
  suggestedDiscount: number
}

export interface AlternativeOrder {
  method: string
  description: string
  fairnessScore: number
}

export interface PayoutOrderRecommendation {
  id: string
  circleId: string
  circleName: string
  cycleNumber: number
  totalMembers: number
  analysisDate: string
  fairnessScore: number
  recommendedOrder: PayoutPositionRecommendation[]
  alternativeOrders: AlternativeOrder[]
  status: 'pending_vote' | 'approved' | 'rejected'
}

// =============================================================================
// Fraud Alerts
// =============================================================================

export interface Anomaly {
  type: string
  detail: string
}

export interface FraudAlert {
  id: string
  alertType: 'account_takeover_attempt' | 'synthetic_identity' | 'unusual_transaction' | 'suspicious_pattern'
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId: string
  userName: string
  description: string
  detectedAt: string
  anomalies: Anomaly[]
  riskScore: number
  automatedActions: string[]
  recommendedActions: string[]
  status: 'new' | 'investigating' | 'pending_review' | 'monitoring' | 'resolved' | 'false_positive'
  assignedTo: string | null
}

// =============================================================================
// Behavior Clusters
// =============================================================================

export interface ClusterCharacteristics {
  averageTrustScore: number
  onTimePaymentRate: number
  averageCircles: number
  averageMonthlyContribution: number
  engagementLevel: 'low' | 'moderate' | 'high'
  churnRate: number
}

export interface BehaviorCluster {
  id: string
  name: string
  description: string
  memberCount: number
  percentageOfTotal: number
  characteristics: ClusterCharacteristics
  typicalBehaviors: string[]
  recommendedApproach: string
  conversionOpportunities: string[]
}

// =============================================================================
// Trust Graph
// =============================================================================

export interface TrustGraphNode {
  userId: string
  userName: string
  connectionStrength: number
  sharedCircles: number
  relationshipDuration: number
  trustLevel: 'developing' | 'moderate' | 'strong'
  mutualConnections: number
}

export interface SuggestedConnection {
  userId: string
  userName: string
  reason: string
  potentialStrength: number
}

export interface TrustGraph {
  centerUserId: string
  centerUserName: string
  analysisDate: string
  networkStrength: number
  totalConnections: number
  trustedConnections: number
  nodes: TrustGraphNode[]
  networkInsights: string[]
  suggestedConnections: SuggestedConnection[]
}

// =============================================================================
// AI Support Chat
// =============================================================================

export interface SupportChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  helpful?: boolean | null
  resolved?: boolean
  escalationOffered?: boolean
}

export interface AiChatConversation {
  id: string
  conversationId: string
  userId: string
  messages: SupportChatMessage[]
  status: 'active' | 'resolved' | 'escalated'
  category: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

// =============================================================================
// AI Preferences
// =============================================================================

export interface RecommendationPreferences {
  circleRecommendations: boolean
  contributionSuggestions: boolean
  savingsOpportunities: boolean
}

export interface AlertPreferences {
  cashFlowAlerts: boolean
  cashFlowAlertDays: number
  fraudAlerts: boolean
}

export interface DataConsentPreferences {
  incomeAnalysis: boolean
  spendingPatternAnalysis: boolean
  creditBureauSharing: boolean
  anonymizedResearch: boolean
}

export interface AssistantPreferences {
  proactiveInsights: boolean
  weeklyDigest: boolean
  insightFrequency: 'minimal' | 'balanced' | 'detailed'
}

export interface AiPreferences {
  userId: string
  recommendations: RecommendationPreferences
  alerts: AlertPreferences
  dataConsent: DataConsentPreferences
  assistant: AssistantPreferences
  lastUpdated: string
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the AI Insights Dashboard (member view) */
export interface AiInsightsDashboardProps {
  /** Personalized circle recommendations */
  circleRecommendations: CircleRecommendation[]
  /** Financial health chat conversation */
  financialHealthChat: FinancialHealthChat
  /** AI contribution suggestions */
  contributionSuggestions: ContributionSuggestion[]
  /** Predictive cash flow alerts */
  cashFlowAlerts: CashFlowAlert[]
  /** Detected savings opportunities */
  savingsOpportunities: SavingsOpportunity[]
  /** Seasonal spending/savings patterns */
  seasonalPatterns: SeasonalPatterns
  /** Cross-circle portfolio insights */
  crossCircleInsights: CrossCircleInsights
  /** User's AI feature preferences */
  aiPreferences: AiPreferences
  /** Called when user views a recommended circle */
  onViewRecommendation?: (circleId: string) => void
  /** Called when user joins a recommended circle */
  onJoinCircle?: (circleId: string) => void
  /** Called when user dismisses a recommendation */
  onDismissRecommendation?: (recommendationId: string) => void
  /** Called when user sends a message to AI assistant */
  onSendMessage?: (message: string) => void
  /** Called when user accepts a contribution suggestion */
  onAcceptSuggestion?: (suggestionId: string) => void
  /** Called when user dismisses a contribution suggestion */
  onDismissSuggestion?: (suggestionId: string) => void
  /** Called when user dismisses a cash flow alert */
  onDismissAlert?: (alertId: string) => void
  /** Called when user takes action on a savings opportunity */
  onActOnOpportunity?: (opportunityId: string, allocation: string) => void
  /** Called when user updates AI preferences */
  onUpdatePreferences?: (preferences: Partial<AiPreferences>) => void
}

/** Props for the Organizer Risk Assessment view */
export interface RiskAssessmentProps {
  /** Risk scores for membership applicants */
  memberRiskScores: MemberRiskScore[]
  /** Circle health scores */
  circleHealthScores: CircleHealthScore[]
  /** Churn and default warnings */
  churnWarnings: ChurnWarning[]
  /** Configuration optimization suggestions */
  configurationSuggestions: ConfigurationSuggestion[]
  /** Payout order recommendations for bidding circles */
  payoutOrderRecommendations: PayoutOrderRecommendation[]
  /** Called when organizer approves a member */
  onApproveMember?: (applicantId: string, circleId: string) => void
  /** Called when organizer denies a member */
  onDenyMember?: (applicantId: string, circleId: string, reason?: string) => void
  /** Called when organizer requests more info from applicant */
  onRequestMoreInfo?: (applicantId: string, circleId: string) => void
  /** Called when organizer views churn warning details */
  onViewChurnWarning?: (warningId: string) => void
  /** Called when organizer takes action on churn warning */
  onActOnChurnWarning?: (warningId: string, action: string) => void
  /** Called when organizer applies configuration suggestion */
  onApplyConfiguration?: (suggestionId: string) => void
  /** Called when organizer accepts payout order */
  onAcceptPayoutOrder?: (recommendationId: string) => void
  /** Called when organizer modifies payout order */
  onModifyPayoutOrder?: (recommendationId: string, newOrder: string[]) => void
}

/** Props for the Platform Admin Fraud & Analytics view */
export interface FraudAnalyticsProps {
  /** Active fraud alerts */
  fraudAlerts: FraudAlert[]
  /** Member behavior clusters */
  behaviorClusters: BehaviorCluster[]
  /** Called when admin investigates a fraud alert */
  onInvestigateAlert?: (alertId: string) => void
  /** Called when admin resolves a fraud alert */
  onResolveAlert?: (alertId: string, resolution: 'confirmed' | 'false_positive') => void
  /** Called when admin escalates a fraud alert */
  onEscalateAlert?: (alertId: string, team: string) => void
  /** Called when admin views cluster details */
  onViewClusterDetails?: (clusterId: string) => void
  /** Called when admin exports cluster data */
  onExportClusterData?: (clusterId: string) => void
}

/** Props for the Trust Graph visualization */
export interface TrustGraphProps {
  /** Trust network data */
  trustGraph: TrustGraph
  /** Called when user views a connection's profile */
  onViewConnection?: (userId: string) => void
  /** Called when user requests introduction to suggested connection */
  onRequestIntroduction?: (userId: string) => void
}

/** Props for the AI Support Chatbot */
export interface AiSupportChatProps {
  /** Chat conversation history */
  conversation: AiChatConversation
  /** Called when user sends a message */
  onSendMessage?: (message: string) => void
  /** Called when user rates a response */
  onRateResponse?: (messageId: string, helpful: boolean) => void
  /** Called when user requests human escalation */
  onEscalateToHuman?: (conversationId: string) => void
}
