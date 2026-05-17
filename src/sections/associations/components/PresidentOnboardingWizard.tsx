import { useState } from 'react'

interface PresidentOnboardingWizardProps {
  associationId: string
  onComplete: () => void
}

interface StepDef { id: string; title: string; description: string; optional: boolean }

const steps: StepDef[] = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with CircleUp', optional: false },
  { id: 'profile', title: 'Your Profile', description: 'Set up your contact details', optional: false },
  { id: 'association', title: 'Association Details', description: 'Customize your association', optional: false },
  { id: 'bank', title: 'Bank Account', description: 'Link your payment account', optional: true },
  { id: 'circle', title: 'First Circle', description: 'Create your first savings circle', optional: true },
  { id: 'invite', title: 'Invite Members', description: 'Bring your community onboard', optional: true },
  { id: 'complete', title: 'All Done!', description: 'Your association is ready', optional: false },
]

export function PresidentOnboardingWizard({ associationId, onComplete }: PresidentOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [, setCompleted] = useState<Set<string>>(new Set())
  const [form, setForm] = useState({ bio: '', description: '', visibility: 'private', iban: '', circleName: '', amount: '100', frequency: 'monthly', members: '12', emails: '' })

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  const next = () => {
    setCompleted(prev => new Set(prev).add(step.id))
    if (isLast) {
      fetch(`/api/v1/associations/${associationId}/complete_onboarding`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
      }).then(() => onComplete())
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const back = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1) }
  const skip = () => { setCurrentStep(prev => prev + 1) }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 16px' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s.id} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= currentStep ? '#E63946' : '#e5e7eb' }} />
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 32 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Step {currentStep + 1} of {steps.length}</div>
        <h2 style={{ margin: '0 0 8px' }}>{step.title}</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>{step.description}</p>

        {step.id === 'welcome' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#127881;</div>
            <h3>Welcome to CircleUp!</h3>
            <p style={{ color: '#666' }}>Let's set up your association in a few quick steps. You can always come back and change things later.</p>
          </div>
        )}

        {step.id === 'profile' && (
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell members about yourself..."
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, minHeight: 80, boxSizing: 'border-box' }} />
          </div>
        )}

        {step.id === 'association' && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your association..."
                style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, minHeight: 80, boxSizing: 'border-box' }} />
            </div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Visibility</label>
            <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="invite_only">Invite Only</option>
            </select>
          </div>
        )}

        {step.id === 'bank' && (
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>PostFinance IBAN</label>
            <input value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} placeholder="CH..."
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Optional — you can add this later in Settings.</p>
          </div>
        )}

        {step.id === 'circle' && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Circle Name</label>
              <input value={form.circleName} onChange={e => setForm({ ...form, circleName: e.target.value })} placeholder="My First Circle"
                style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Amount (CHF)</label>
                <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Frequency</label>
                <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}
                  style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Members</label>
                <input type="number" value={form.members} onChange={e => setForm({ ...form, members: e.target.value })}
                  style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {step.id === 'invite' && (
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Member Emails (comma-separated)</label>
            <textarea value={form.emails} onChange={e => setForm({ ...form, emails: e.target.value })} placeholder="member1@example.com, member2@example.com"
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, minHeight: 80, boxSizing: 'border-box' }} />
            <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Or import members later from CSV in the Members section.</p>
          </div>
        )}

        {step.id === 'complete' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
            <h3>You're All Set!</h3>
            <p style={{ color: '#666' }}>Your association is ready. Head to your dashboard to start managing circles and members.</p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
          <button onClick={back} disabled={currentStep === 0}
            style={{ background: '#f3f4f6', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.3 : 1 }}>
            Back
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {step.optional && (
              <button onClick={skip} style={{ background: '#f3f4f6', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
                Skip
              </button>
            )}
            <button onClick={next}
              style={{ background: '#E63946', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              {isLast ? 'Go to Dashboard' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
