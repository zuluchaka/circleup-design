// =============================================================================
// Referral Types
// =============================================================================

export type ReferralStatus = 'invited' | 'joined' | 'active'
export type RewardStatus = 'pending' | 'paid'

export interface Referral {
  id: string
  referrerId: string
  referrerName: string
  referrerAvatar: string
  referralCode: string
  referralLink: string
  refereeEmail: string
  refereeName: string | null
  refereeAvatar: string | null
  status: ReferralStatus
  invitedAt: string
  joinedAt: string | null
  firstContributionAt: string | null
  rewardAmount: number
  rewardStatus: RewardStatus
  rewardPaidAt: string | null
}

export interface ReferralStats {
  userId: string
  totalInvited: number
  totalJoined: number
  totalActive: number
  totalEarnings: number
  pendingEarnings: number
  referralCode: string
  referralLink: string
}

// =============================================================================
// Badge & Achievement Types
// =============================================================================

export type BadgeCategory =
  | 'getting_started'
  | 'consistency'
  | 'savings'
  | 'completion'
  | 'trust'
  | 'referral'
  | 'mentorship'
  | 'goals'
  | 'challenges'
  | 'community'

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  tier: BadgeTier
  requirement: string
  requirementValue: number
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  badgeName: string
  badgeIcon: string
  badgeTier: BadgeTier
  unlockedAt: string
  shared: boolean
  sharedAt: string | null
}

export interface BadgeProgress {
  badgeId: string
  badgeName: string
  badgeIcon: string
  badgeTier: BadgeTier
  currentValue: number
  targetValue: number
  progressPercent: number
  description: string
}

// =============================================================================
// Leaderboard Types
// =============================================================================

export type LeaderboardCategory =
  | 'total_saved'
  | 'streak_length'
  | 'on_time_percentage'
  | 'referrals'

export type LeaderboardScope = 'platform' | 'association' | 'circle'
export type LeaderboardPeriod = 'all_time' | 'this_year' | 'this_month' | 'current_cycle'

export interface LeaderboardEntry {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rank: number
  previousRank: number
  category: LeaderboardCategory
  value: number
  displayValue: string
  scope: LeaderboardScope
  scopeId: string | null
  period: LeaderboardPeriod
}

export interface LeaderboardSettings {
  userId: string
  visibleOnLeaderboard: boolean
  showRealName: boolean
  categories: LeaderboardCategory[]
}

// =============================================================================
// Savings Challenge Types
// =============================================================================

export type ChallengeType = 'streak' | 'contribution' | 'referral' | 'savings_goal'
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'
export type ChallengeStatus = 'upcoming' | 'active' | 'completed'
export type EnrollmentStatus = 'in_progress' | 'completed' | 'failed'

export interface ChallengeReward {
  type: 'badge' | 'bonus'
  badgeId: string | null
  bonusAmount: number | null
}

export interface SavingsChallenge {
  id: string
  name: string
  description: string
  shortDescription: string
  icon: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  startDate: string
  endDate: string
  targetValue: number
  targetUnit: string
  reward: ChallengeReward
  participantCount: number
  completedCount: number
  status: ChallengeStatus
}

export interface ChallengeEnrollment {
  id: string
  userId: string
  challengeId: string
  challengeName: string
  challengeIcon: string
  enrolledAt: string
  currentValue: number
  targetValue: number
  progressPercent: number
  status: EnrollmentStatus
  completedAt: string | null
  rank: number
}

// =============================================================================
// Milestone Types
// =============================================================================

export type MilestoneType =
  | 'first_contribution'
  | 'first_payout'
  | 'savings_goal'
  | 'anniversary'
  | 'circle_completion'

export interface Milestone {
  id: string
  userId: string
  type: MilestoneType
  title: string
  description: string
  icon: string
  achievedAt: string
  value: number | null
  displayValue: string
  shared: boolean
  sharedAt: string | null
  celebrationSeen: boolean
}

// =============================================================================
// Mentorship Types
// =============================================================================

export type MentorMatchStatus = 'pending' | 'active' | 'completed' | 'declined'

export interface MenteeProgress {
  contributionsMade: number
  onTimePayments: number
  circlesJoined: number
  trustScoreChange: number
}

export interface MentorMatch {
  id: string
  mentorId: string
  mentorName: string
  mentorAvatar: string
  mentorTrustScore: number
  mentorCirclesCompleted: number
  menteeId: string
  menteeName: string
  menteeAvatar: string
  menteeTrustScore: number
  status: MentorMatchStatus
  matchedAt: string | null
  matchReason: string
  messagesCount: number
  lastMessageAt: string | null
  menteeProgress: MenteeProgress | null
}

export interface MentorProfile {
  userId: string
  isMentor: boolean
  mentorSince: string
  bio: string
  languages: string[]
  expertise: string[]
  availability: string
  menteesHelped: number
  menteesCompleted: number
  rating: number
  reviewCount: number
}

// =============================================================================
// Accountability Partner Types
// =============================================================================

export type PartnerStatus = 'pending' | 'active' | 'ended'

export interface PartnerProgress {
  totalSaved: number
  targetAmount: number
  progressPercent: number
  currentStreak: number
  lastContribution: string
}

export interface AccountabilityPartner {
  id: string
  partnerId: string
  partnerName: string
  partnerAvatar: string
  status: PartnerStatus
  pairedAt: string | null
  sharedGoal: string | null
  myProgress: PartnerProgress | null
  partnerProgress: PartnerProgress | null
  encouragementsSent: number
  encouragementsReceived: number
  lastInteraction: string | null
}

// =============================================================================
// Community Impact Types
// =============================================================================

export interface PlatformImpact {
  totalMembersSaving: number
  totalCirclesActive: number
  totalCirclesCompleted: number
  totalSaved: number
  totalPayoutsDistributed: number
  averageTrustScore: number
  countriesServed: number
  lastUpdated: string
}

export interface AssociationImpact {
  associationId: string
  associationName: string
  totalMembers: number
  activeCircles: number
  completedCircles: number
  totalSaved: number
  totalPayouts: number
  averageTrustScore: number
  topSaverName: string
  lastUpdated: string
}

export interface CommunityMilestone {
  type: string
  title: string
  description: string
  achievedAt: string
  icon: string
}

export interface CommunityImpact {
  platform: PlatformImpact
  association: AssociationImpact
  recentMilestones: CommunityMilestone[]
}

export interface SocialProofNotification {
  id: string
  type: 'contribution' | 'payout' | 'new_member' | 'milestone'
  message: string
  timestamp: string
  icon: string
}

// =============================================================================
// Success Story Types
// =============================================================================

export type StoryCategory = 'first_home' | 'education' | 'emergency_fund' | 'business' | 'family'
export type StoryStatus = 'pending' | 'approved' | 'rejected'

export interface SuccessStory {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorLocation: string
  title: string
  summary: string
  content: string
  category: StoryCategory
  amountSaved: number
  timeframe: string
  circlesCompleted: number
  featured: boolean
  status: StoryStatus
  submittedAt: string
  approvedAt: string | null
  likes: number
  shares: number
}

// =============================================================================
// Community Event Types
// =============================================================================

export type EventType = 'celebration' | 'workshop' | 'meetup' | 'fundraiser'
export type EventFormat = 'in_person' | 'virtual' | 'hybrid'
export type EventStatus = 'open' | 'full' | 'cancelled' | 'completed'
export type RsvpStatus = 'confirmed' | 'waitlisted' | 'cancelled'

export interface CommunityEvent {
  id: string
  title: string
  description: string
  type: EventType
  format: EventFormat
  location: string
  date: string
  endDate: string
  organizerId: string
  organizerName: string
  capacity: number
  registeredCount: number
  ticketPrice: number
  status: EventStatus
  rsvpDeadline: string
  imageUrl: string
}

export interface EventRsvp {
  eventId: string
  userId: string
  status: RsvpStatus
  registeredAt: string
  ticketCount: number
  totalPaid: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface ReferralDashboardProps {
  /** Current user's referral statistics */
  referralStats: ReferralStats
  /** List of referrals the user has made */
  referrals: Referral[]
  /** Called when user wants to share their referral link */
  onShareLink?: (channel: 'sms' | 'whatsapp' | 'email' | 'social') => void
  /** Called when user wants to copy their referral link */
  onCopyLink?: () => void
  /** Called when user wants to send a reminder to a pending referral */
  onSendReminder?: (referralId: string) => void
}

export interface BadgeGalleryProps {
  /** All available badges */
  badges: Badge[]
  /** Badges the user has earned */
  userBadges: UserBadge[]
  /** Progress toward locked badges */
  badgeProgress: BadgeProgress[]
  /** Called when user wants to share a badge */
  onShareBadge?: (badgeId: string) => void
  /** Called when user wants to view badge details */
  onViewBadge?: (badgeId: string) => void
}

export interface LeaderboardProps {
  /** Leaderboard entries to display */
  entries: LeaderboardEntry[]
  /** User's leaderboard visibility settings */
  settings: LeaderboardSettings
  /** Current user's ID to highlight their position */
  currentUserId: string
  /** Called when user changes their visibility settings */
  onUpdateSettings?: (settings: LeaderboardSettings) => void
  /** Called when user filters by category */
  onFilterCategory?: (category: LeaderboardCategory) => void
  /** Called when user filters by scope */
  onFilterScope?: (scope: LeaderboardScope, scopeId?: string) => void
  /** Called when user filters by period */
  onFilterPeriod?: (period: LeaderboardPeriod) => void
}

export interface SavingsChallengesProps {
  /** Available challenges to browse */
  challenges: SavingsChallenge[]
  /** User's current challenge enrollments */
  enrollments: ChallengeEnrollment[]
  /** Called when user wants to enroll in a challenge */
  onEnroll?: (challengeId: string) => void
  /** Called when user wants to view challenge details */
  onViewChallenge?: (challengeId: string) => void
  /** Called when user wants to view challenge leaderboard */
  onViewLeaderboard?: (challengeId: string) => void
}

export interface MilestonesCelebrationProps {
  /** User's achieved milestones */
  milestones: Milestone[]
  /** Called when user wants to share a milestone */
  onShareMilestone?: (milestoneId: string) => void
  /** Called when user dismisses the celebration modal */
  onDismissCelebration?: (milestoneId: string) => void
  /** Called when user wants to view milestone details */
  onViewMilestone?: (milestoneId: string) => void
}

export interface MentorshipProps {
  /** User's mentor matches (as mentor or mentee) */
  mentorMatches: MentorMatch[]
  /** User's mentor profile if they are a mentor */
  mentorProfile: MentorProfile | null
  /** Called when user wants to become a mentor */
  onBecomeMentor?: () => void
  /** Called when user wants to update their mentor profile */
  onUpdateMentorProfile?: (profile: Partial<MentorProfile>) => void
  /** Called when user wants to find a mentor */
  onFindMentor?: () => void
  /** Called when user accepts a mentorship request */
  onAcceptMentee?: (matchId: string) => void
  /** Called when user declines a mentorship request */
  onDeclineMentee?: (matchId: string) => void
  /** Called when user wants to message their mentor/mentee */
  onMessage?: (matchId: string) => void
}

export interface AccountabilityPartnersProps {
  /** User's accountability partnerships */
  partners: AccountabilityPartner[]
  /** Called when user wants to find a partner */
  onFindPartner?: () => void
  /** Called when user accepts a partnership request */
  onAcceptPartner?: (partnerId: string) => void
  /** Called when user declines a partnership request */
  onDeclinePartner?: (partnerId: string) => void
  /** Called when user sends encouragement */
  onSendEncouragement?: (partnerId: string) => void
  /** Called when user ends a partnership */
  onEndPartnership?: (partnerId: string) => void
}

export interface CommunityImpactProps {
  /** Platform and association impact statistics */
  impact: CommunityImpact
  /** Social proof notifications to display */
  socialProofNotifications: SocialProofNotification[]
  /** Called when user dismisses a notification */
  onDismissNotification?: (notificationId: string) => void
}

export interface SuccessStoriesProps {
  /** Success stories to display */
  stories: SuccessStory[]
  /** Called when user wants to submit their story */
  onSubmitStory?: () => void
  /** Called when user likes a story */
  onLikeStory?: (storyId: string) => void
  /** Called when user shares a story */
  onShareStory?: (storyId: string) => void
  /** Called when user wants to read full story */
  onViewStory?: (storyId: string) => void
  /** Called when user filters by category */
  onFilterCategory?: (category: StoryCategory) => void
}

export interface CommunityEventsProps {
  /** Events to display */
  events: CommunityEvent[]
  /** User's RSVPs */
  rsvps: EventRsvp[]
  /** Called when user RSVPs to an event */
  onRsvp?: (eventId: string, ticketCount: number) => void
  /** Called when user cancels their RSVP */
  onCancelRsvp?: (eventId: string) => void
  /** Called when user wants to view event details */
  onViewEvent?: (eventId: string) => void
  /** Called when user wants to add event to calendar */
  onAddToCalendar?: (eventId: string) => void
  /** Called when user wants to share event */
  onShareEvent?: (eventId: string) => void
  /** Called when organizer wants to create an event */
  onCreateEvent?: () => void
}

// =============================================================================
// Combined Section Props
// =============================================================================

export interface CommunitySocialProps {
  // Referrals
  referralStats: ReferralStats
  referrals: Referral[]

  // Badges
  badges: Badge[]
  userBadges: UserBadge[]
  badgeProgress: BadgeProgress[]

  // Leaderboards
  leaderboardEntries: LeaderboardEntry[]
  leaderboardSettings: LeaderboardSettings
  currentUserId: string

  // Challenges
  savingsChallenges: SavingsChallenge[]
  challengeEnrollments: ChallengeEnrollment[]

  // Milestones
  milestones: Milestone[]

  // Mentorship
  mentorMatches: MentorMatch[]
  mentorProfile: MentorProfile | null

  // Accountability
  accountabilityPartners: AccountabilityPartner[]

  // Impact
  communityImpact: CommunityImpact
  socialProofNotifications: SocialProofNotification[]

  // Stories
  successStories: SuccessStory[]

  // Events
  communityEvents: CommunityEvent[]
  eventRsvps: EventRsvp[]

  // Referral callbacks
  onShareReferralLink?: (channel: 'sms' | 'whatsapp' | 'email' | 'social') => void
  onCopyReferralLink?: () => void
  onSendReferralReminder?: (referralId: string) => void

  // Badge callbacks
  onShareBadge?: (badgeId: string) => void
  onViewBadge?: (badgeId: string) => void

  // Leaderboard callbacks
  onUpdateLeaderboardSettings?: (settings: LeaderboardSettings) => void

  // Challenge callbacks
  onEnrollChallenge?: (challengeId: string) => void
  onViewChallenge?: (challengeId: string) => void

  // Milestone callbacks
  onShareMilestone?: (milestoneId: string) => void
  onDismissCelebration?: (milestoneId: string) => void

  // Mentorship callbacks
  onBecomeMentor?: () => void
  onUpdateMentorProfile?: (profile: Partial<MentorProfile>) => void
  onFindMentor?: () => void
  onAcceptMentee?: (matchId: string) => void
  onDeclineMentee?: (matchId: string) => void
  onMessageMentor?: (matchId: string) => void

  // Accountability callbacks
  onFindPartner?: () => void
  onAcceptPartner?: (partnerId: string) => void
  onSendEncouragement?: (partnerId: string) => void
  onEndPartnership?: (partnerId: string) => void

  // Story callbacks
  onSubmitStory?: () => void
  onLikeStory?: (storyId: string) => void
  onShareStory?: (storyId: string) => void
  onViewStory?: (storyId: string) => void

  // Event callbacks
  onRsvpEvent?: (eventId: string, ticketCount: number) => void
  onCancelRsvp?: (eventId: string) => void
  onViewEvent?: (eventId: string) => void
  onAddToCalendar?: (eventId: string) => void
  onShareEvent?: (eventId: string) => void
  onCreateEvent?: () => void
}
