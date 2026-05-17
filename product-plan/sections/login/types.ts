// =============================================================================
// Data Types
// =============================================================================

export type AuthProvider = 'email' | 'google' | 'apple'

export type KycStatus = 'none' | 'pending' | 'basic' | 'enhanced'

export type PlatformRole = 'member' | 'organizer' | 'admin'

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

export type ContextualRoleScope = 'federation' | 'association' | 'circle' | 'platform'

export type ContextualRoleTitle =
  | 'president'
  | 'treasurer'
  | 'secretary'
  | 'member'
  | 'participant'
  | 'organizer'
  | 'admin'

export interface ContextualRole {
  scope: ContextualRoleScope
  title: ContextualRoleTitle
  entityName: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  profilePhoto: string | null
  bio: string | null
  location: string | null
  language: string
  platformRole: PlatformRole
  contextualRoles: ContextualRole[]
  authProvider: AuthProvider
  emailVerified: boolean
  onboardingComplete: boolean
  trustScore: number
  kycStatus: KycStatus
  failedLoginAttempts?: number
  lockedUntil?: string
  createdAt: string
  lastLoginAt: string | null
}

export interface TrustScoreFactor {
  weight: number
  label: string
}

export interface TrustScoreConfig {
  defaultScore: number
  maxScore: number
  factors: {
    paymentHistory: TrustScoreFactor
    verification: TrustScoreFactor
    tenure: TrustScoreFactor
    engagement: TrustScoreFactor
    network: TrustScoreFactor
    external: TrustScoreFactor
  }
  onboardingBonuses: {
    emailVerified: number
    profilePhoto: number
    phoneNumber: number
    bio: number
    location: number
    languagePreference: number
    referralBonus: number
  }
}

export interface OnboardingStep {
  id: string
  order: number
  title: string
  description: string
  field: string
  trustScoreBonus: number
  required: boolean
  icon: string
}

export interface Language {
  code: string
  label: string
  flag: string
}

export interface HeroStat {
  value: string
  label: string
}

export interface ValueProp {
  title: string
  description: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  avatar: string
}

export interface HeroContent {
  tagline: string
  headline: string
  description: string
  stats: HeroStat[]
  valueProps: ValueProp[]
  testimonial: Testimonial
}

export interface PasswordRequirement {
  id: string
  label: string
  regex: string
}

export interface ActiveSession {
  id: string
  deviceType: DeviceType
  browser: string
  os: string
  ipAddress: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface ReferralCode {
  code: string
  referrerId: string
  referrerName: string
  trustScoreBonus: number
  used: boolean
  usedBy?: string
  usedAt?: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface LoginPageProps {
  /** Hero content for the split-layout side panel */
  heroContent: HeroContent
  /** Available UI languages for the language selector */
  languages: Language[]
  /** Password validation rules for the strength meter */
  passwordRequirements: PasswordRequirement[]
  /** Currently selected language code */
  currentLanguage?: string
  /** Called when user submits email/password login */
  onLogin?: (email: string, password: string, rememberMe: boolean) => void
  /** Called when user initiates Google OAuth login */
  onGoogleLogin?: () => void
  /** Called when user initiates Apple Sign-In */
  onAppleLogin?: () => void
  /** Called when user clicks "Forgot Password?" */
  onForgotPassword?: () => void
  /** Called when user clicks "Sign Up" to switch to registration */
  onNavigateToRegister?: () => void
  /** Called when user changes the UI language */
  onLanguageChange?: (languageCode: string) => void
}

export interface RegisterPageProps {
  /** Hero content for the split-layout side panel */
  heroContent: HeroContent
  /** Available UI languages for the language selector */
  languages: Language[]
  /** Password validation rules for the strength meter */
  passwordRequirements: PasswordRequirement[]
  /** Currently selected language code */
  currentLanguage?: string
  /** Called when user submits email registration form */
  onRegister?: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    referralCode?: string
  }) => void
  /** Called when user initiates Google OAuth registration */
  onGoogleRegister?: () => void
  /** Called when user initiates Apple Sign-In registration */
  onAppleRegister?: () => void
  /** Called when user clicks "Log In" to switch to login */
  onNavigateToLogin?: () => void
  /** Called when user changes the UI language */
  onLanguageChange?: (languageCode: string) => void
}

export interface ForgotPasswordPageProps {
  /** Hero content for the split-layout side panel */
  heroContent: HeroContent
  /** Available UI languages for the language selector */
  languages: Language[]
  /** Currently selected language code */
  currentLanguage?: string
  /** Called when user submits email for password reset */
  onSubmit?: (email: string) => void
  /** Called when user clicks back to login */
  onNavigateToLogin?: () => void
  /** Called when user changes the UI language */
  onLanguageChange?: (languageCode: string) => void
}

export interface ResetPasswordPageProps {
  /** Password validation rules for the strength meter */
  passwordRequirements: PasswordRequirement[]
  /** Whether the reset token is valid */
  tokenValid: boolean
  /** Called when user submits new password */
  onSubmit?: (newPassword: string) => void
  /** Called when user requests a new reset link (expired token) */
  onRequestNewLink?: () => void
}

export interface VerificationPendingPageProps {
  /** The email address verification was sent to */
  email: string
  /** Number of resend attempts remaining (out of 3 per hour) */
  resendsRemaining: number
  /** Called when user clicks "Resend Email" */
  onResend?: () => void
  /** Called when user wants to change their email */
  onChangeEmail?: () => void
}

export interface OnboardingWizardProps {
  /** The user completing onboarding */
  user: User
  /** The onboarding steps to display */
  steps: OnboardingStep[]
  /** Trust Score configuration for showing bonuses */
  trustScoreConfig: TrustScoreConfig
  /** Called when user completes a step */
  onStepComplete?: (stepId: string, value: string) => void
  /** Called when user skips the wizard */
  onSkip?: () => void
  /** Called when user finishes all steps */
  onComplete?: () => void
}

export interface SessionManagementProps {
  /** List of active sessions for the current user */
  sessions: ActiveSession[]
  /** Called when user revokes a specific session */
  onRevokeSession?: (sessionId: string) => void
  /** Called when user revokes all sessions except current */
  onRevokeAllSessions?: () => void
}
