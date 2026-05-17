import data from '@/../product/sections/login/data.json'
import type { User, TrustScoreConfig } from '@/../product/sections/login/types'
import { AuthFlow } from './components/AuthFlow'

export default function AuthFlowPreview() {
  const sampleUser = data.users.find((u) => u.id === 'usr-008') as unknown as User

  return (
    <AuthFlow
      heroContent={data.heroContent}
      languages={data.languages}
      passwordRequirements={data.passwordRequirements}
      onboardingSteps={data.onboardingSteps}
      trustScoreConfig={data.trustScore as unknown as TrustScoreConfig}
      sampleUser={sampleUser}
      initialView="login"
      currentLanguage="en"
      onLogin={(email, password, rememberMe) =>
        console.log('Login:', { email, password, rememberMe })
      }
      onRegister={(regData) => console.log('Register:', regData)}
      onGoogleAuth={() => console.log('Google auth')}
      onAppleAuth={() => console.log('Apple auth')}
      onForgotPassword={(email) => console.log('Forgot password:', email)}
      onResetPassword={(password) => console.log('Reset password:', password)}
      onResendVerification={() => console.log('Resend verification')}
      onOnboardingComplete={() => console.log('Onboarding complete')}
      onOnboardingSkip={() => console.log('Onboarding skipped')}
      onLanguageChange={(code) => console.log('Language changed:', code)}
    />
  )
}
