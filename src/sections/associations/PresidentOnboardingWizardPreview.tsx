import { PresidentOnboardingWizard } from './components/PresidentOnboardingWizard'

export default function PresidentOnboardingWizardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PresidentOnboardingWizard
        associationId="assoc-001"
        onComplete={() => console.log('Onboarding complete')}
      />
    </div>
  )
}
