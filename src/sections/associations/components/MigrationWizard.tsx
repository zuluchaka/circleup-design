import { useState, useEffect, useRef } from 'react'
import { WizardProgressDots } from '@/components/shared/WizardProgressDots'
import type {
  MigrationDashboardProps,
  PhaseStatus,
} from '@/../product/sections/associations/types'

// Phase step components
import { AssociationProfileStep, GovernanceRolesStep, RulesBylawsStep, PrivacyVisibilityStep, CommunicationStep } from './migration/Phase1Steps'
import { MemberUploadStep, ColumnMappingStep, RoleAssignmentStep, InvitationStep, ManualAddStep } from './migration/Phase2Steps'
import { CircleConfigStep, CircleMembersStep, MidCycleStep, CircleOverviewStep } from './migration/Phase3Steps'
import { ContributionHistoryStep, PayoutHistoryStep, DuesRecordsStep, TrustScoreStep } from './migration/Phase4Steps'
import { ValidationReportStep, MemberVerificationStep, GoLiveStep } from './migration/Phase5Steps'

// =============================================================================
// Types & Step Definitions
// =============================================================================

export interface MigrationWizardProps extends MigrationDashboardProps {
  onCancel?: () => void
}

interface SubStep {
  id: string
  title: string
  description: string
  optional?: boolean
}

interface Phase {
  id: number
  title: string
  steps: SubStep[]
}

const PHASES: Phase[] = [
  {
    id: 1,
    title: 'Association Setup',
    steps: [
      { id: '1-1', title: 'Association Profile', description: 'Name, description, type, logo, and languages' },
      { id: '1-2', title: 'Governance & Roles', description: 'Role templates, approval workflow, and dues' },
      { id: '1-3', title: 'Rules & Bylaws', description: 'Upload or enter governing documents', optional: true },
      { id: '1-4', title: 'Privacy & Visibility', description: 'Control who can find and access your association' },
      { id: '1-5', title: 'Communication', description: 'Notification channels and meeting schedule', optional: true },
    ],
  },
  {
    id: 2,
    title: 'Member Import',
    steps: [
      { id: '2-1', title: 'Upload Member File', description: 'Import your member roster from CSV or Excel' },
      { id: '2-2', title: 'Map Columns', description: 'Match source columns to member fields' },
      { id: '2-3', title: 'Assign Roles', description: 'AI-assisted role matching with bulk confirm' },
      { id: '2-4', title: 'Send Invitations', description: 'Invite members via email, SMS, or code' },
      { id: '2-5', title: 'Add Manually', description: 'Quick-add members not in the file', optional: true },
    ],
  },
  {
    id: 3,
    title: 'Circle Import',
    steps: [
      { id: '3-1', title: 'Circle Configuration', description: 'Name, amount, frequency, and payout rules' },
      { id: '3-2', title: 'Members & Positions', description: 'Select members and set payout order' },
      { id: '3-3', title: 'Mid-Cycle State', description: 'Mark completed payouts if joining mid-cycle' },
      { id: '3-4', title: 'Circle Overview', description: 'Review all circles and finalize' },
    ],
  },
  {
    id: 4,
    title: 'Financial History',
    steps: [
      { id: '4-1', title: 'Contribution History', description: 'Upload past contribution records' },
      { id: '4-2', title: 'Payout History', description: 'Upload past payout records' },
      { id: '4-3', title: 'Dues & Fees', description: 'Import dues standing for each member', optional: true },
      { id: '4-4', title: 'Trust Scores', description: 'Preview bootstrapped trust scores' },
    ],
  },
  {
    id: 5,
    title: 'Validation & Go-Live',
    steps: [
      { id: '5-1', title: 'Validation Report', description: 'Aggregated pre-go-live checks' },
      { id: '5-2', title: 'Member Verification', description: 'Self-verification status tracker' },
      { id: '5-3', title: 'Go Live', description: 'Activate your association on CircleUp' },
    ],
  },
]

function getAllSteps(): { phase: Phase; step: SubStep; globalIndex: number }[] {
  const result: { phase: Phase; step: SubStep; globalIndex: number }[] = []
  let idx = 0
  for (const phase of PHASES) {
    for (const step of phase.steps) {
      result.push({ phase, step, globalIndex: idx })
      idx++
    }
  }
  return result
}

const ALL_STEPS = getAllSteps()
const TOTAL_STEPS = ALL_STEPS.length

// =============================================================================
// Sidebar
// =============================================================================

function WizardSidebar({
  currentIndex,
  onNavigate,
}: {
  currentIndex: number
  onNavigate: (index: number) => void
}) {
  return (
    <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
      <div className="p-4 space-y-1">
        {PHASES.map((phase) => {
          const phaseSteps = ALL_STEPS.filter((s) => s.phase.id === phase.id)
          const firstIdx = phaseSteps[0].globalIndex
          const lastIdx = phaseSteps[phaseSteps.length - 1].globalIndex
          const phaseStatus: PhaseStatus =
            currentIndex > lastIdx ? 'completed' : currentIndex >= firstIdx ? 'in_progress' : 'locked'

          return (
            <div key={phase.id} className="mb-2">
              <div className="flex items-center gap-2.5 px-3 py-2">
                <PhaseIcon phase={phase.id} status={phaseStatus} size="sm" />
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    phaseStatus === 'in_progress'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : phaseStatus === 'completed'
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {phase.title}
                </span>
              </div>
              <div className="ml-4 border-l-2 border-slate-100 dark:border-slate-800 pl-4 space-y-0.5">
                {phaseSteps.map(({ step, globalIndex }) => {
                  const isActive = globalIndex === currentIndex
                  const isDone = globalIndex < currentIndex
                  const isLocked = phaseStatus === 'locked'
                  return (
                    <button
                      key={step.id}
                      onClick={() => !isLocked && isDone && onNavigate(globalIndex)}
                      disabled={isLocked || (!isDone && !isActive)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-sm transition-all ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-medium'
                          : isDone
                            ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
                            : 'text-slate-400 dark:text-slate-600 cursor-default'
                      }`}
                    >
                      {isDone ? (
                        <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{step.title}</span>
                      {step.optional && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">opt</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

// =============================================================================
// Mobile Stepper
// =============================================================================

function WizardMobileStepper({
  currentIndex,
}: {
  currentIndex: number
}) {
  const current = ALL_STEPS[currentIndex]
  return (
    <div className="md:hidden px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-1.5 mb-2">
        {PHASES.map((phase) => {
          const phaseSteps = ALL_STEPS.filter((s) => s.phase.id === phase.id)
          const lastIdx = phaseSteps[phaseSteps.length - 1].globalIndex
          const firstIdx = phaseSteps[0].globalIndex
          const isDone = currentIndex > lastIdx
          const isActive = currentIndex >= firstIdx && currentIndex <= lastIdx
          return (
            <div key={phase.id} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  isDone ? 'bg-emerald-500' : isActive ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          Phase {current.phase.id}: {current.phase.title}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Step {currentIndex + 1} of {TOTAL_STEPS}
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// Phase Icon (reused)
// =============================================================================

function PhaseIcon({ phase, status, size = 'md' }: { phase: number; status: PhaseStatus; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-9 h-9 text-sm'
  const base = `${s} rounded-full flex items-center justify-center font-semibold transition-all`
  if (status === 'completed')
    return (
      <span className={`${base} bg-emerald-500 text-white`}>
        <svg className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  if (status === 'in_progress')
    return <span className={`${base} bg-indigo-600 text-white ring-4 ring-indigo-500/20`}>{phase}</span>
  return <span className={`${base} bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500`}>{phase}</span>
}

// =============================================================================
// Footer
// =============================================================================

function WizardFooter({
  currentIndex,
  isOptional,
  onBack,
  onNext,
  onSkip,
  canContinue,
  isLastStep,
}: {
  currentIndex: number
  isOptional: boolean
  onBack: () => void
  onNext: () => void
  onSkip: () => void
  canContinue: boolean
  isLastStep: boolean
}) {
  return (
    <footer className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          {isOptional && (
            <button
              onClick={onSkip}
              className="px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Skip
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canContinue}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-indigo-500/25 disabled:shadow-none"
          >
            {isLastStep ? 'Go Live' : 'Continue'}
          </button>
        </div>
      </div>
    </footer>
  )
}

// =============================================================================
// Main MigrationWizard Component
// =============================================================================

export function MigrationWizard(props: MigrationWizardProps & {
  /** Initial step index synced from URL */
  initialStep?: string | null
  /** Called when the wizard step changes, for URL sync */
  onStepChange?: (stepIndex: number) => void
}) {
  const {
    association,
    columnMappings,
    members,
    circles,
    contributions,
    payouts,
    validationReport,
    verifications,
    invitationFunnel,
    goLiveConfig,
    roleMapping,
    onCancel,
    onRunValidation,
    onAcknowledgeWarning,
    onResolveDispute,
    onGoLive,
    onScheduleGoLive,
    onEmergencyPause,
    initialStep,
    onStepChange,
  } = props

  const resolvedInitial = (() => {
    if (initialStep != null) {
      const idx = Number(initialStep)
      if (!isNaN(idx) && idx >= 0 && idx < TOTAL_STEPS) return idx
    }
    return 0
  })()
  const [currentIndex, setCurrentIndex] = useState(resolvedInitial)

  // Notify parent of step changes for URL sync (ref avoids infinite re-render loop)
  const onStepChangeRef = useRef(onStepChange)
  onStepChangeRef.current = onStepChange
  useEffect(() => {
    onStepChangeRef.current?.(currentIndex)
  }, [currentIndex])
  const currentStepInfo = ALL_STEPS[currentIndex]

  const goNext = () => {
    if (currentIndex < TOTAL_STEPS - 1) setCurrentIndex(currentIndex + 1)
  }
  const goBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }
  const goTo = (index: number) => {
    if (index >= 0 && index < TOTAL_STEPS && index <= currentIndex) setCurrentIndex(index)
  }

  const renderStep = () => {
    const stepId = currentStepInfo.step.id
    switch (stepId) {
      // Phase 1
      case '1-1': return <AssociationProfileStep association={association} />
      case '1-2': return <GovernanceRolesStep association={association} />
      case '1-3': return <RulesBylawsStep association={association} />
      case '1-4': return <PrivacyVisibilityStep association={association} />
      case '1-5': return <CommunicationStep association={association} />
      // Phase 2
      case '2-1': return <MemberUploadStep members={members} />
      case '2-2': return <ColumnMappingStep mappings={columnMappings} />
      case '2-3': return <RoleAssignmentStep roleMapping={roleMapping} />
      case '2-4': return <InvitationStep members={members} funnel={invitationFunnel} />
      case '2-5': return <ManualAddStep members={members} />
      // Phase 3
      case '3-1': return <CircleConfigStep circles={circles} />
      case '3-2': return <CircleMembersStep circles={circles} members={members} />
      case '3-3': return <MidCycleStep circles={circles} />
      case '3-4': return <CircleOverviewStep circles={circles} />
      // Phase 4
      case '4-1': return <ContributionHistoryStep contributions={contributions} circles={circles} />
      case '4-2': return <PayoutHistoryStep payouts={payouts} circles={circles} />
      case '4-3': return <DuesRecordsStep members={members} />
      case '4-4': return <TrustScoreStep members={members} />
      // Phase 5
      case '5-1': return <ValidationReportStep report={validationReport} onRunValidation={onRunValidation} onAcknowledgeWarning={onAcknowledgeWarning} />
      case '5-2': return <MemberVerificationStep verifications={verifications} onResolveDispute={onResolveDispute} />
      case '5-3': return (
        <GoLiveStep
          config={goLiveConfig}
          readinessSummary={validationReport?.readinessSummary}
          onGoLive={onGoLive}
          onScheduleGoLive={onScheduleGoLive}
          onEmergencyPause={onEmergencyPause}
        />
      )
      default: return <div>Unknown step</div>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Import Existing Association</h1>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile stepper - progress dots for small screens, phase bars for medium */}
      <div className="md:hidden">
        <div className="sm:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <WizardProgressDots
            totalSteps={PHASES.length}
            currentStep={PHASES.findIndex((p) => {
              const phaseSteps = ALL_STEPS.filter((s) => s.phase.id === p.id)
              return currentIndex >= phaseSteps[0].globalIndex && currentIndex <= phaseSteps[phaseSteps.length - 1].globalIndex
            })}
            labels={PHASES.map((p) => p.title)}
          />
          <div className="px-4 pb-2 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Step {currentIndex + 1} of {TOTAL_STEPS}
            </span>
          </div>
        </div>
        <div className="hidden sm:block">
          <WizardMobileStepper currentIndex={currentIndex} />
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="flex-1 flex overflow-hidden">
        <WizardSidebar currentIndex={currentIndex} onNavigate={goTo} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              {renderStep()}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <WizardFooter
        currentIndex={currentIndex}
        isOptional={!!currentStepInfo.step.optional}
        onBack={goBack}
        onNext={goNext}
        onSkip={goNext}
        canContinue={true}
        isLastStep={currentIndex === TOTAL_STEPS - 1}
      />
    </div>
  )
}
