import { useState } from 'react'
import type {
  HeroContent,
  Language,
  PasswordRequirement,
  OnboardingStep,
  TrustScoreConfig,
  User,
} from '@/../product/sections/login/types'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { ResetPasswordForm } from './ResetPasswordForm'
import { VerificationPending } from './VerificationPending'
import { OnboardingWizard } from './OnboardingWizard'

type AuthView =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verification-pending'
  | 'onboarding'

export interface AuthFlowProps {
  heroContent: HeroContent
  languages: Language[]
  passwordRequirements: PasswordRequirement[]
  onboardingSteps: OnboardingStep[]
  trustScoreConfig: TrustScoreConfig
  sampleUser: User
  initialView?: AuthView
  currentLanguage?: string
  onLogin?: (email: string, password: string, rememberMe: boolean) => void
  onRegister?: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    referralCode?: string
  }) => void
  onGoogleAuth?: () => void
  onAppleAuth?: () => void
  onForgotPassword?: (email: string) => void
  onResetPassword?: (newPassword: string) => void
  onResendVerification?: () => void
  onOnboardingComplete?: () => void
  onOnboardingSkip?: () => void
  onLanguageChange?: (code: string) => void
}

export function AuthFlow({
  heroContent,
  languages,
  passwordRequirements,
  onboardingSteps,
  trustScoreConfig,
  sampleUser,
  initialView = 'login',
  currentLanguage = 'en',
  onLogin,
  onRegister,
  onGoogleAuth,
  onAppleAuth,
  onForgotPassword,
  onResetPassword,
  onResendVerification,
  onOnboardingComplete,
  onOnboardingSkip,
  onLanguageChange,
}: AuthFlowProps) {
  const [view, setView] = useState<AuthView>(initialView)
  const [lang, setLang] = useState(currentLanguage)
  const [registeredEmail, setRegisteredEmail] = useState('ibrahim.silva@proton.me')

  const handleLanguageChange = (code: string) => {
    setLang(code)
    onLanguageChange?.(code)
  }

  switch (view) {
    case 'login':
      return (
        <LoginForm
          heroContent={heroContent}
          languages={languages}
          passwordRequirements={passwordRequirements}
          currentLanguage={lang}
          onLogin={(email, password, rememberMe) => {
            onLogin?.(email, password, rememberMe)
          }}
          onGoogleLogin={onGoogleAuth}
          onAppleLogin={onAppleAuth}
          onForgotPassword={() => setView('forgot-password')}
          onNavigateToRegister={() => setView('register')}
          onLanguageChange={handleLanguageChange}
        />
      )

    case 'register':
      return (
        <RegisterForm
          heroContent={heroContent}
          languages={languages}
          passwordRequirements={passwordRequirements}
          currentLanguage={lang}
          onRegister={(data) => {
            setRegisteredEmail(data.email)
            onRegister?.(data)
            setView('verification-pending')
          }}
          onGoogleRegister={onGoogleAuth}
          onAppleRegister={onAppleAuth}
          onNavigateToLogin={() => setView('login')}
          onLanguageChange={handleLanguageChange}
        />
      )

    case 'forgot-password':
      return (
        <ForgotPasswordForm
          heroContent={heroContent}
          languages={languages}
          currentLanguage={lang}
          onSubmit={(email) => onForgotPassword?.(email)}
          onNavigateToLogin={() => setView('login')}
          onLanguageChange={handleLanguageChange}
        />
      )

    case 'reset-password':
      return (
        <ResetPasswordForm
          passwordRequirements={passwordRequirements}
          tokenValid={true}
          onSubmit={(password) => onResetPassword?.(password)}
          onRequestNewLink={() => setView('forgot-password')}
        />
      )

    case 'verification-pending':
      return (
        <VerificationPending
          email={registeredEmail}
          resendsRemaining={3}
          onResend={onResendVerification}
          onChangeEmail={() => setView('register')}
        />
      )

    case 'onboarding':
      return (
        <OnboardingWizard
          user={sampleUser}
          steps={onboardingSteps}
          trustScoreConfig={trustScoreConfig}
          onStepComplete={(stepId, value) => console.log('Step complete:', stepId, value)}
          onSkip={onOnboardingSkip}
          onComplete={onOnboardingComplete}
        />
      )
  }
}
