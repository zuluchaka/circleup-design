// =============================================================================
// Hero Section Types
// =============================================================================

export interface CtaButton {
  text: string
  href: string
}

export interface HeroContent {
  headline: string
  subHeadline: string
  primaryCta: CtaButton
  secondaryCta: CtaButton
  backgroundVideoUrl: string
  trustBadgeIds: string[]
}

// =============================================================================
// Trust & Credibility Types
// =============================================================================

export interface TrustBadge {
  id: string
  name: string
  icon: string
  description: string
  detailsUrl: string
}

export type PersonaType = 'member' | 'organizer' | 'both'

export interface Benefit {
  id: string
  title: string
  description: string
  icon: string
  forPersona: PersonaType
}

export interface MemberTestimonial {
  id: string
  name: string
  role: 'member'
  avatar: string
  community: string
  quote: string
  memberSince: string
  savingsAchieved: number
  circlesCompleted: number
  featured: boolean
}

export interface OrganizerTestimonial {
  id: string
  name: string
  role: 'organizer'
  avatar: string
  community: string
  quote: string
  memberSince: string
  circlesManaged: number
  membersManaged: number
  hoursWeeklySaved: number
  onTimePaymentRate: number
  featured: boolean
}

export type Testimonial = MemberTestimonial | OrganizerTestimonial

export interface PlatformStat {
  id: string
  label: string
  value: number
  prefix?: string
  suffix?: string
  icon: string
}

export type PartnerType = 'payment' | 'banking' | 'verification' | 'infrastructure'

export interface Partner {
  id: string
  name: string
  logo: string
  type: PartnerType
  description: string
}

// =============================================================================
// FAQ Types
// =============================================================================

export type FaqCategory = 'trust' | 'member' | 'organizer' | 'account'

export interface Faq {
  id: string
  category: FaqCategory
  question: string
  answer: string
}

// =============================================================================
// ROSCA Education Types
// =============================================================================

export interface HowItWorksStep {
  step: number
  title: string
  description: string
  icon: string
}

export interface ComparisonCategory {
  name: string
  traditional: string
  circleup: string
}

export interface RoscaComparison {
  categories: ComparisonCategory[]
}

export type CircleFrequency = 'weekly' | 'bi-weekly' | 'monthly'
export type TrustRequirement = 'low' | 'medium' | 'high'

export interface CircleExample {
  id: string
  name: string
  description: string
  members: number
  contribution: number
  frequency: CircleFrequency
  duration: string
  totalPayout: number
  icon: string
  trustRequirement: TrustRequirement
}

export interface CulturalCommunity {
  id: string
  name: string
  localName: string
  countries: string[]
  description: string
  image: string
  memberCount: number
  testimonialId: string | null
}

// =============================================================================
// Association Features Types
// =============================================================================

export interface AssociationFeature {
  id: string
  title: string
  description: string
  icon: string
  capabilities: string[]
}

// =============================================================================
// Pricing Types
// =============================================================================

export type BillingPeriod = 'forever' | 'month' | 'year' | 'custom'

export interface PricingTier {
  id: string
  name: string
  price: number | null
  billingPeriod: BillingPeriod
  platformFee: number
  description: string
  features: string[]
  limitations: string[]
  ctaText: string
  highlighted: boolean
}

export interface FeeItem {
  id: string
  name: string
  description: string
  rate: string
  appliesTo: string
  example: string
}

// =============================================================================
// Quiz Types
// =============================================================================

export interface QuizOption {
  id: string
  text: string
  correct: boolean
}

export interface QuizFeedback {
  correct: string
  incorrect: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  feedback: QuizFeedback
}

export interface QuizQuestions {
  member: QuizQuestion[]
  organizer: QuizQuestion[]
}

// =============================================================================
// Activity Feed Types
// =============================================================================

export type ActivityType =
  | 'payout_completed'
  | 'circle_created'
  | 'member_joined'
  | 'circle_completed'
  | 'contribution_milestone'
  | 'trust_score_milestone'

export interface ActivityFeedItem {
  id: string
  type: ActivityType
  message: string
  community: string
  timestamp: string
  icon: string
}

// =============================================================================
// Ambassador Types
// =============================================================================

export interface Ambassador {
  id: string
  name: string
  title: string
  avatar: string
  community: string
  story: string
  circlesManaged: number
  membersBrought: number
  totalFacilitated: number
  joinedDate: string
}

// =============================================================================
// Referral Program Types
// =============================================================================

export interface ReferralTier {
  name: string
  referralsRequired: number
  rewardPerReferral: number
  bonusReward: number
}

export interface ReferralProgram {
  description: string
  tiers: ReferralTier[]
  conditions: string[]
  referralBonusForNewUser: number
}

// =============================================================================
// Mobile Features Types
// =============================================================================

export interface MobileFeature {
  id: string
  title: string
  description: string
  icon: string
}

// =============================================================================
// Impact Metrics Types
// =============================================================================

export interface GoalBreakdown {
  goal: string
  percentage: number
}

export interface ImpactMetrics {
  totalSaved: number
  familiesHelped: number
  goalsAchieved: number
  circlesCompleted: number
  countriesReached: number
  averageSavingsGoal: number
  emergencyFundPayouts: number
  emergencyFundCoverage: number
  topGoals: GoalBreakdown[]
}

// =============================================================================
// Demo Booking Types
// =============================================================================

export interface DemoSlot {
  id: string
  date: string
  time: string
  timezone: string
  available: boolean
  language: string
}

// =============================================================================
// Localization Types
// =============================================================================

export interface Language {
  code: string
  name: string
  flag: string
  default: boolean
}

// =============================================================================
// App Download Types
// =============================================================================

export interface AppStoreLink {
  url: string
  badge: string
}

export interface AppDownload {
  ios: AppStoreLink
  android: AppStoreLink
  qrCode: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface HomepageProps {
  // Hero Section
  heroContent: HeroContent
  trustBadges: TrustBadge[]

  // Trust & Credibility
  benefits: Benefit[]
  testimonials: Testimonial[]
  platformStats: PlatformStat[]
  partners: Partner[]
  faqs: Faq[]

  // ROSCA Education
  howItWorks: HowItWorksStep[]
  roscaComparison: RoscaComparison
  circleExamples: CircleExample[]
  culturalCommunities: CulturalCommunity[]

  // Association Features
  associationFeatures: AssociationFeature[]

  // Pricing
  pricingTiers: PricingTier[]
  feeStructure: FeeItem[]

  // Quiz
  quizQuestions: QuizQuestions

  // Activity & Social
  activityFeed: ActivityFeedItem[]
  ambassadors: Ambassador[]
  referralProgram: ReferralProgram

  // Mobile
  mobileFeatures: MobileFeature[]
  appDownload: AppDownload

  // Impact & Metrics
  impactMetrics: ImpactMetrics

  // Booking & Localization
  demoSlots: DemoSlot[]
  languages: Language[]

  // Callbacks - Navigation
  /** Called when user clicks primary CTA */
  onPrimaryCtaClick?: () => void
  /** Called when user clicks secondary CTA (Watch Demo) */
  onSecondaryCtaClick?: () => void
  /** Called when user clicks a section-specific CTA */
  onCtaClick?: (ctaId: string, section: string) => void

  // Callbacks - Video
  /** Called when user plays the explainer video */
  onVideoPlay?: (videoId: string) => void
  /** Called when video completes */
  onVideoComplete?: (videoId: string) => void

  // Callbacks - Trust & Social Proof
  /** Called when user clicks to view testimonial details */
  onViewTestimonial?: (testimonialId: string) => void
  /** Called when user clicks a partner logo */
  onPartnerClick?: (partnerId: string) => void
  /** Called when user expands an FAQ item */
  onFaqExpand?: (faqId: string) => void

  // Callbacks - Persona Selection
  /** Called when user selects member or organizer path */
  onPersonaSelect?: (persona: 'member' | 'organizer') => void

  // Callbacks - Calculator Tools
  /** Called when user uses the savings goal calculator */
  onCalculatorSubmit?: (type: 'savings' | 'circle-size', values: Record<string, number>) => void

  // Callbacks - Quiz
  /** Called when user starts a quiz */
  onQuizStart?: (quizType: 'member' | 'organizer') => void
  /** Called when user answers a quiz question */
  onQuizAnswer?: (questionId: string, optionId: string, correct: boolean) => void
  /** Called when user completes a quiz */
  onQuizComplete?: (quizType: 'member' | 'organizer', score: number, maxScore: number) => void

  // Callbacks - Pricing
  /** Called when user selects a pricing tier */
  onSelectTier?: (tierId: string) => void
  /** Called when user clicks to contact sales */
  onContactSales?: () => void

  // Callbacks - Support
  /** Called when user opens live chat */
  onChatOpen?: () => void
  /** Called when user submits contact form */
  onContactSubmit?: (data: { name: string; email: string; category: string; message: string }) => void
  /** Called when user books a demo slot */
  onDemoBook?: (slotId: string) => void
  /** Called when user subscribes to newsletter */
  onNewsletterSubscribe?: (email: string) => void

  // Callbacks - Registration
  /** Called when user starts registration */
  onRegisterStart?: () => void
  /** Called when user completes registration */
  onRegisterComplete?: (method: 'email' | 'google' | 'apple') => void
  /** Called when user enters referral code */
  onReferralCodeEnter?: (code: string) => void

  // Callbacks - Localization
  /** Called when user changes language */
  onLanguageChange?: (languageCode: string) => void

  // Callbacks - App Download
  /** Called when user clicks app download link */
  onAppDownload?: (platform: 'ios' | 'android') => void

  // Callbacks - Exit Intent
  /** Called when exit intent modal is shown */
  onExitIntentShow?: () => void
  /** Called when user dismisses exit intent modal */
  onExitIntentDismiss?: () => void
  /** Called when user takes action from exit intent modal */
  onExitIntentAction?: (action: 'newsletter' | 'download-guide') => void

  // Callbacks - Interactive Features
  /** Called when user explores demo sandbox */
  onSandboxStart?: () => void
  /** Called when user views a circle example */
  onCircleExampleClick?: (exampleId: string) => void
  /** Called when user clicks a cultural community */
  onCommunityClick?: (communityId: string) => void
  /** Called when user views an ambassador profile */
  onAmbassadorClick?: (ambassadorId: string) => void
}

// =============================================================================
// Sub-Component Props
// =============================================================================

export interface HeroSectionProps {
  content: HeroContent
  trustBadges: TrustBadge[]
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  onViewTestimonial?: (id: string) => void
}

export interface PricingTableProps {
  tiers: PricingTier[]
  feeStructure: FeeItem[]
  onSelectTier?: (tierId: string) => void
  onContactSales?: () => void
}

export interface QuizComponentProps {
  questions: QuizQuestion[]
  quizType: 'member' | 'organizer'
  onStart?: () => void
  onAnswer?: (questionId: string, optionId: string, correct: boolean) => void
  onComplete?: (score: number, maxScore: number) => void
}

export interface FaqAccordionProps {
  faqs: Faq[]
  defaultCategory?: FaqCategory
  onExpand?: (faqId: string) => void
}

export interface ComparisonTableProps {
  comparison: RoscaComparison
}

export interface ActivityFeedProps {
  items: ActivityFeedItem[]
  maxItems?: number
}

export interface DemoBookingProps {
  slots: DemoSlot[]
  onBook?: (slotId: string) => void
}

export interface CalculatorProps {
  type: 'savings' | 'circle-size'
  circleExamples: CircleExample[]
  onSubmit?: (values: Record<string, number>) => void
  onCreateCircle?: (config: Partial<CircleExample>) => void
}

export interface PersonaSelectorProps {
  benefits: Benefit[]
  onSelect?: (persona: 'member' | 'organizer') => void
  onQuizStart?: () => void
}

export interface LanguageSelectorProps {
  languages: Language[]
  currentLanguage: string
  onChange?: (languageCode: string) => void
}

export interface AppDownloadSectionProps {
  appDownload: AppDownload
  mobileFeatures: MobileFeature[]
  onDownload?: (platform: 'ios' | 'android') => void
}

export interface ImpactDashboardProps {
  metrics: ImpactMetrics
}

export interface AmbassadorSpotlightProps {
  ambassadors: Ambassador[]
  onClick?: (ambassadorId: string) => void
}

export interface ReferralPreviewProps {
  program: ReferralProgram
  onLearnMore?: () => void
}

export interface CommunityShowcaseProps {
  communities: CulturalCommunity[]
  testimonials: Testimonial[]
  onClick?: (communityId: string) => void
}

export interface RegistrationFormProps {
  referralProgram: ReferralProgram
  onSubmit?: (data: { email: string; password: string; name: string; referralCode?: string }) => void
  onSocialLogin?: (provider: 'google' | 'apple') => void
}

export interface ExitIntentModalProps {
  onDismiss?: () => void
  onNewsletter?: (email: string) => void
  onDownloadGuide?: () => void
}
