import { useState } from 'react'
import type {
  MigrationDashboardProps,
  PhaseStatus,
  ImportedMember,
  ImportedCircle,
  ColumnMapping,
  RoleMapping,
  ValidationReport,
  MemberVerification,
  GoLiveConfig,
  InvitationFunnel,
  ImportedContribution,
  ImportedPayout,
  CheckStatus,
} from '../types'

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
// Shared UI Helpers
// =============================================================================

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required,
  hint,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  hint?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
      />
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function CardOption({
  selected,
  onClick,
  icon,
  label,
  description,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md shadow-indigo-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <p className="font-medium text-slate-900 dark:text-white text-sm">{label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
    </button>
  )
}

function FileUploadZone({ label, accept, onFile }: { label: string; accept: string; onFile?: () => void }) {
  const [dragging, setDragging] = useState(false)
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); onFile?.() }}
      onClick={onFile}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'
      }`}
    >
      <svg className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Drag & drop or click to browse &middot; {accept}</p>
    </div>
  )
}

function StatusBadge({ status, label }: { status: 'success' | 'warning' | 'error' | 'info' | 'neutral'; label: string }) {
  const colors = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    error: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
    info: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${colors[status]}`}>
      {label}
    </span>
  )
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${value >= 0.9 ? 'bg-emerald-500' : value >= 0.7 ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-[11px] font-medium text-slate-500 w-8 text-right">{Math.round(value * 100)}%</span>
    </div>
  )
}

// =============================================================================
// PHASE 1: Association Setup Steps
// =============================================================================

function AssociationProfileStep({ association }: { association: MigrationWizardProps['association'] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Association Profile" description="Basic information about your association." />
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {association.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Upload a logo or we'll use an initial</p>
          <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Change logo</button>
        </div>
      </div>
      <InputField label="Association Name" value={association.name} onChange={() => {}} required placeholder="e.g., Cameroon Community Lausanne" />
      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">Description <span className="text-rose-500">*</span></label>
        <textarea
          value={association.description}
          readOnly
          rows={3}
          className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Association Type"
          value={association.type}
          onChange={() => {}}
          options={[
            { value: 'cultural', label: 'Cultural' },
            { value: 'religious', label: 'Religious' },
            { value: 'professional', label: 'Professional' },
            { value: 'savings', label: 'Savings' },
            { value: 'social', label: 'Social' },
            { value: 'family', label: 'Family' },
          ]}
        />
        <SelectField
          label="Primary Language"
          value={association.primaryLanguage}
          onChange={() => {}}
          options={[
            { value: 'fr', label: 'French' },
            { value: 'en', label: 'English' },
            { value: 'de', label: 'German' },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Country" value={association.country} onChange={() => {}} />
        <InputField label="City" value={association.city} onChange={() => {}} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Website" value={association.website || ''} onChange={() => {}} placeholder="https://" />
        <InputField label="Contact Email" value={association.contactEmail} onChange={() => {}} />
      </div>

      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Profile {association.profileCompleteness}% complete</span>
        </div>
      </div>
    </div>
  )
}

function GovernanceRolesStep({ association }: { association: MigrationWizardProps['association'] }) {
  const gov = association.governance
  return (
    <div className="space-y-5">
      <SectionHeader title="Governance & Roles" description="Define the leadership structure and membership rules." />

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Role Hierarchy</h3>
        <div className="space-y-2">
          {gov.roles.map((role, i) => (
            <div key={role.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{role.name}</p>
                <p className="text-xs text-slate-400">{role.permissions.join(', ')}</p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{role.memberCount} member{role.memberCount !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      </div>

      {gov.committees.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Committees</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gov.committees.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.description}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">{c.memberCount} members</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Approval Workflow"
          value={gov.approvalWorkflow}
          onChange={() => {}}
          options={[
            { value: 'auto_approve', label: 'Auto Approve' },
            { value: 'admin_approval', label: 'Admin Approval' },
            { value: 'committee_vote', label: 'Committee Vote' },
            { value: 'invitation_only', label: 'Invitation Only' },
          ]}
        />
        <SelectField
          label="Dues Frequency"
          value={gov.duesFrequency}
          onChange={() => {}}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'annual', label: 'Annual' },
          ]}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <InputField label="Dues Amount" value={String(gov.duesAmount)} onChange={() => {}} />
        <InputField label="Currency" value={gov.duesCurrency} onChange={() => {}} />
        <InputField label="Grace Period (days)" value={String(gov.duesGracePeriod)} onChange={() => {}} />
      </div>
    </div>
  )
}

function RulesBylawsStep({ association }: { association: MigrationWizardProps['association'] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Rules & Bylaws" description="Upload your governing documents or enter them directly." />
      <FileUploadZone label="Upload bylaws, constitution, or code of conduct" accept="PDF, DOCX, TXT" />

      {association.documents.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Uploaded Documents</h3>
          <div className="space-y-2">
            {association.documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.name}</p>
                  <p className="text-xs text-slate-400">{doc.category.replace('_', ' ')} &middot; {(doc.fileSize / 1024).toFixed(0)} KB</p>
                </div>
                <StatusBadge status="success" label={doc.fileType.toUpperCase()} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PrivacyVisibilityStep({ association }: { association: MigrationWizardProps['association'] }) {
  const ps = association.privacySettings
  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: '🌐', description: 'Anyone can find and request to join' },
    { value: 'semi_private', label: 'Semi-Private', icon: '🔗', description: 'Visible via link or QR code only' },
    { value: 'private', label: 'Private', icon: '🔒', description: 'Hidden from search, invite only' },
  ]
  return (
    <div className="space-y-5">
      <SectionHeader title="Privacy & Visibility" description="Control who can discover and access your association." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {visibilityOptions.map((opt) => (
          <CardOption
            key={opt.value}
            selected={association.visibility === opt.value}
            onClick={() => {}}
            icon={<span className="text-2xl">{opt.icon}</span>}
            label={opt.label}
            description={opt.description}
          />
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Access Controls</h3>
        {[
          { label: 'Listed in directory', value: ps.directoryListed },
          { label: 'Invitation link enabled', value: ps.invitationLink },
          { label: 'QR code enabled', value: ps.qrCode },
        ].map((toggle) => (
          <div key={toggle.label} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-sm text-slate-700 dark:text-slate-300">{toggle.label}</span>
            <div className={`w-10 h-6 rounded-full transition-colors ${toggle.value ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${toggle.value ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SelectField
          label="Member List Visibility"
          value={ps.memberListVisibility}
          onChange={() => {}}
          options={[
            { value: 'all_members', label: 'All Members' },
            { value: 'admins_only', label: 'Admins Only' },
            { value: 'hidden', label: 'Hidden' },
          ]}
        />
        <SelectField
          label="Financial Data Access"
          value={ps.financialDataAccess}
          onChange={() => {}}
          options={[
            { value: 'all_members', label: 'All Members' },
            { value: 'admins_only', label: 'Admins Only' },
            { value: 'hidden', label: 'Hidden' },
          ]}
        />
        <SelectField
          label="Event Visibility"
          value={ps.eventVisibility}
          onChange={() => {}}
          options={[
            { value: 'public', label: 'Public' },
            { value: 'members_only', label: 'Members Only' },
            { value: 'admins_only', label: 'Admins Only' },
          ]}
        />
      </div>
    </div>
  )
}

function CommunicationStep({ association }: { association: MigrationWizardProps['association'] }) {
  const comm = association.communication
  const channelLabels: Record<string, string> = { in_app: 'In-App', email: 'Email', sms: 'SMS', whatsapp: 'WhatsApp' }
  return (
    <div className="space-y-5">
      <SectionHeader title="Communication" description="Set up notification channels and meeting schedule." />

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Notification Channels</h3>
        <div className="flex flex-wrap gap-2">
          {['in_app', 'email', 'sms', 'whatsapp'].map((ch) => (
            <button
              key={ch}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                comm.defaultChannels.includes(ch)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {channelLabels[ch] || ch}
            </button>
          ))}
        </div>
      </div>

      <SelectField
        label="Announcement Permissions"
        value={comm.announcementPermission}
        onChange={() => {}}
        options={[
          { value: 'all_members', label: 'All Members' },
          { value: 'admins_moderators', label: 'Admins & Moderators' },
          { value: 'admins_only', label: 'Admins Only' },
        ]}
      />

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Regular Meeting Schedule</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SelectField label="Frequency" value={comm.meetingSchedule.frequency} onChange={() => {}} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'bi_weekly', label: 'Bi-Weekly' }, { value: 'weekly', label: 'Weekly' }]} />
          <SelectField label="Week" value={comm.meetingSchedule.week} onChange={() => {}} options={[{ value: 'first', label: 'First' }, { value: 'second', label: 'Second' }, { value: 'third', label: 'Third' }, { value: 'last', label: 'Last' }]} />
          <SelectField label="Day" value={comm.meetingSchedule.day} onChange={() => {}} options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => ({ value: d, label: d }))} />
          <InputField label="Time" value={comm.meetingSchedule.time} onChange={() => {}} type="time" />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// PHASE 2: Member Import Steps
// =============================================================================

function MemberUploadStep({ members }: { members: ImportedMember[] }) {
  const fileMembers = members.filter((m) => m.importSource === 'file')
  return (
    <div className="space-y-5">
      <SectionHeader title="Upload Member File" description="Import your member roster from a CSV or Excel file." />
      <FileUploadZone label="Drop your member file here" accept="CSV, XLSX, XLS" />

      {fileMembers.length > 0 && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">File processed — {fileMembers.length} members found</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-emerald-200 dark:border-emerald-800/50">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-emerald-100/50 dark:bg-emerald-900/30">
                  <th className="text-left px-3 py-2 font-semibold text-emerald-800 dark:text-emerald-300">Name</th>
                  <th className="text-left px-3 py-2 font-semibold text-emerald-800 dark:text-emerald-300 hidden sm:table-cell">Email</th>
                  <th className="text-left px-3 py-2 font-semibold text-emerald-800 dark:text-emerald-300 hidden sm:table-cell">Phone</th>
                  <th className="text-left px-3 py-2 font-semibold text-emerald-800 dark:text-emerald-300">Role</th>
                </tr>
              </thead>
              <tbody>
                {fileMembers.slice(0, 5).map((m) => (
                  <tr key={m.id} className="border-t border-emerald-100 dark:border-emerald-900/30">
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{m.firstName} {m.lastName}</td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{m.email || '—'}</td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{m.phone}</td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{m.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fileMembers.length > 5 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 text-center">+ {fileMembers.length - 5} more rows</p>
          )}
        </div>
      )}
    </div>
  )
}

function ColumnMappingStep({ mappings }: { mappings: ColumnMapping[] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Map Columns" description="Match your file columns to CircleUp member fields." />
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Source Column</th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 w-8" />
              <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Target Field</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 hidden sm:table-cell">Confidence</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 hidden md:table-cell">Sample</th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{m.sourceColumn}</td>
                <td className="px-2 py-3 text-center">
                  <svg className="w-4 h-4 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-400">{m.targetField}</td>
                <td className="px-4 py-3 hidden sm:table-cell w-32"><ConfidenceBar value={m.confidence} /></td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-slate-400 truncate block max-w-[150px]">{m.sampleValues.filter(Boolean).join(', ')}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    status={m.status === 'confirmed' ? 'success' : m.status === 'auto_detected' ? 'info' : 'warning'}
                    label={m.status === 'confirmed' ? 'Confirmed' : m.status === 'auto_detected' ? 'Auto' : 'Review'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
        Confirm all mappings
      </button>
    </div>
  )
}

function RoleAssignmentStep({ roleMapping }: { roleMapping: RoleMapping[] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Assign Roles" description="Review AI-detected role mappings and confirm or adjust." />
      <div className="space-y-3">
        {roleMapping.map((rm) => (
          <div key={rm.sourceValue} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{rm.sourceValue}</span>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">{rm.targetRole}</span>
              </div>
              <div className="mt-1.5 w-40"><ConfidenceBar value={rm.confidence} /></div>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">{rm.memberCount} member{rm.memberCount !== 1 ? 's' : ''}</span>
            <StatusBadge
              status={rm.status === 'confirmed' ? 'success' : rm.status === 'auto_mapped' ? 'info' : 'warning'}
              label={rm.status === 'confirmed' ? 'Confirmed' : rm.status === 'auto_mapped' ? 'Auto' : 'Review'}
            />
          </div>
        ))}
      </div>
      <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
        Confirm all role mappings
      </button>
    </div>
  )
}

function InvitationStep({ members, funnel }: { members: ImportedMember[]; funnel: InvitationFunnel }) {
  const channels = [
    { id: 'email', label: 'Email', icon: '✉️', count: members.filter((m) => m.email).length },
    { id: 'email_sms', label: 'Email + SMS', icon: '📱', count: members.filter((m) => m.email && m.phone).length },
    { id: 'invitation_code', label: 'Invitation Code', icon: '🔑', count: members.length },
  ]
  const stages = [
    { label: 'Total', value: funnel.total, color: 'bg-slate-400' },
    { label: 'Invited', value: funnel.invited, color: 'bg-indigo-400' },
    { label: 'Delivered', value: funnel.delivered, color: 'bg-indigo-500' },
    { label: 'Opened', value: funnel.opened, color: 'bg-amber-400' },
    { label: 'Registered', value: funnel.registered, color: 'bg-emerald-400' },
    { label: 'Active', value: funnel.active, color: 'bg-emerald-600' },
  ]
  const max = stages[0].value || 1
  return (
    <div className="space-y-5">
      <SectionHeader title="Send Invitations" description="Choose how to invite members to join CircleUp." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {channels.map((ch) => (
          <CardOption
            key={ch.id}
            selected={ch.id === 'email'}
            onClick={() => {}}
            icon={<span className="text-2xl">{ch.icon}</span>}
            label={ch.label}
            description={`${ch.count} members eligible`}
          />
        ))}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Invitation Funnel Preview</h3>
        <div className="space-y-2">
          {stages.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 w-20 text-right font-medium">{s.label}</span>
              <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${s.color} rounded-full flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max((s.value / max) * 100, 8)}%` }}
                >
                  <span className="text-[10px] font-bold text-white">{s.value}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 w-10 text-right">{Math.round((s.value / max) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25">
        Send Invitations to {members.filter((m) => m.invitationStatus === 'not_sent').length || 'All'} Members
      </button>
    </div>
  )
}

function ManualAddStep({ members }: { members: ImportedMember[] }) {
  const manualMembers = members.filter((m) => m.importSource === 'manual')
  return (
    <div className="space-y-5">
      <SectionHeader title="Add Members Manually" description="Add members who weren't in the uploaded file." />

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField label="First Name" value="" onChange={() => {}} required placeholder="Jean" />
          <InputField label="Last Name" value="" onChange={() => {}} required placeholder="Mbarga" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Email" value="" onChange={() => {}} placeholder="jean@example.com" />
          <InputField label="Phone" value="" onChange={() => {}} placeholder="+41 79 123 4567" />
        </div>
        <SelectField label="Role" value="member" onChange={() => {}} options={[
          { value: 'member', label: 'Membre' },
          { value: 'admin', label: 'Admin' },
          { value: 'treasurer', label: 'Trésorier' },
        ]} />
        <button className="w-full py-2.5 border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors">
          + Add Member
        </button>
      </div>

      {manualMembers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Manually Added ({manualMembers.length})</h3>
          <div className="space-y-2">
            {manualMembers.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400">
                  {m.firstName[0]}{m.lastName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{m.firstName} {m.lastName}</p>
                  <p className="text-xs text-slate-400">{m.email || m.phone}</p>
                </div>
                <StatusBadge status="info" label="Manual" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// PHASE 3: Circle Import Steps
// =============================================================================

function CircleConfigStep({ circles }: { circles: ImportedCircle[] }) {
  const circle = circles[0]
  if (!circle) return <div className="text-center py-12 text-slate-400">No circles to configure</div>
  return (
    <div className="space-y-5">
      <SectionHeader title="Circle Configuration" description="Define the circle's contribution rules and payout method." />

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Circle Name" value={circle.name} onChange={() => {}} required />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Amount" value={String(circle.contributionAmount)} onChange={() => {}} required />
          <InputField label="Currency" value={circle.currency} onChange={() => {}} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <SelectField label="Frequency" value={circle.frequency} onChange={() => {}} options={[
          { value: 'weekly', label: 'Weekly' },
          { value: 'bi_weekly', label: 'Bi-Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]} />
        <InputField label="Total Positions" value={String(circle.totalPositions)} onChange={() => {}} required />
        <SelectField label="Payout Method" value={circle.payoutMethod} onChange={() => {}} options={[
          { value: 'fixed', label: 'Fixed Order' },
          { value: 'random', label: 'Random' },
          { value: 'bidding', label: 'Bidding' },
          { value: 'trust_score', label: 'Trust Score' },
        ]} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InputField label="Grace Period (days)" value={String(circle.gracePeriod)} onChange={() => {}} />
        <SelectField label="Late Fee Type" value={circle.lateFeeType} onChange={() => {}} options={[
          { value: 'none', label: 'None' },
          { value: 'fixed', label: 'Fixed Amount' },
          { value: 'percentage', label: 'Percentage' },
        ]} />
        <InputField label="Emergency Fund %" value={String(circle.emergencyFundRate)} onChange={() => {}} />
      </div>

      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/50">
        <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Calculated Values</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{circle.currency} {circle.calculatedValues.totalCircleValue.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-wider text-indigo-500">Total Value</p>
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{circle.currency} {circle.calculatedValues.payoutPerCycle.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-wider text-indigo-500">Per Payout</p>
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{circle.calculatedValues.totalDuration}</p>
            <p className="text-[10px] uppercase tracking-wider text-indigo-500">Duration</p>
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{new Date(circle.calculatedValues.estimatedEndDate).toLocaleDateString('en-CH', { month: 'short', year: 'numeric' })}</p>
            <p className="text-[10px] uppercase tracking-wider text-indigo-500">End Date</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CircleMembersStep({ circles, members }: { circles: ImportedCircle[]; members: ImportedMember[] }) {
  const circle = circles[0]
  if (!circle) return null
  return (
    <div className="space-y-5">
      <SectionHeader title="Members & Positions" description="Select members and arrange the payout order." />

      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {circle.positions.length} of {circle.totalPositions} positions filled
        </span>
        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(circle.positions.length / circle.totalPositions) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {circle.positions.map((pos) => {
          const member = members.find((m) => m.id === pos.memberId)
          return (
            <div key={pos.position} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {pos.position}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{pos.memberName}</p>
                <p className="text-xs text-slate-400">{member?.email || member?.phone || ''}</p>
              </div>
              <StatusBadge
                status={pos.status === 'paid_out' ? 'success' : 'neutral'}
                label={pos.status === 'paid_out' ? 'Paid Out' : 'Pending'}
              />
              <div className="flex gap-1">
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                </button>
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MidCycleStep({ circles }: { circles: ImportedCircle[] }) {
  const circle = circles[0]
  if (!circle) return null
  const completedPositions = circle.positions.filter((p) => p.status === 'paid_out')
  return (
    <div className="space-y-5">
      <SectionHeader title="Mid-Cycle State" description="If this circle is already running, mark which payouts have been completed." />

      {circle.isMidCycle ? (
        <>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Mid-cycle import — currently on cycle {circle.currentCycle} of {circle.totalPositions}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {circle.positions.map((pos) => (
              <div
                key={pos.position}
                title={`${pos.memberName} — Position ${pos.position}`}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  pos.status === 'paid_out'
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                    : pos.position === circle.currentCycle
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pos.position}
              </div>
            ))}
          </div>

          {completedPositions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Completed Payouts ({completedPositions.length})</h3>
              {completedPositions.map((pos) => (
                <div key={pos.position} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">#{pos.position}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{pos.memberName}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {pos.payoutAmount ? `CHF ${pos.payoutAmount.toLocaleString()}` : 'Paid'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400">This circle is starting fresh — no mid-cycle state needed.</p>
        </div>
      )}
    </div>
  )
}

function CircleOverviewStep({ circles }: { circles: ImportedCircle[] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Circle Overview" description="Review all imported circles before proceeding." />

      <div className="grid grid-cols-1 gap-4">
        {circles.map((circle) => {
          const completedPositions = circle.positions.filter((p) => p.status === 'paid_out').length
          const progress = (completedPositions / circle.totalPositions) * 100
          return (
            <div key={circle.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{circle.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {circle.currency} {circle.contributionAmount.toLocaleString()} &middot;{' '}
                    {circle.frequency === 'weekly' ? 'Weekly' : circle.frequency === 'bi_weekly' ? 'Bi-weekly' : 'Monthly'} &middot;{' '}
                    {circle.totalPositions} positions
                  </p>
                </div>
                <StatusBadge
                  status={circle.importStatus === 'validated' ? 'success' : circle.importStatus === 'active' ? 'info' : 'neutral'}
                  label={circle.importStatus === 'validated' ? 'Validated' : circle.importStatus === 'active' ? 'Active' : 'Draft'}
                />
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>Cycle {circle.currentCycle} of {circle.totalPositions}</span>
                  <span>{completedPositions} paid out</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Collected</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{circle.currency} {circle.financialSummary.totalCollected.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Paid Out</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{circle.currency} {circle.financialSummary.totalPaidOut.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Emergency</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{circle.currency} {circle.financialSummary.emergencyFundBalance}</p>
                </div>
              </div>
              {circle.validationWarnings.filter((w) => !w.acknowledged).length > 0 && (
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    {circle.validationWarnings.filter((w) => !w.acknowledged).length} unacknowledged warning(s)
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button className="w-full py-3 border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors">
        + Add Another Circle
      </button>
    </div>
  )
}

// =============================================================================
// PHASE 4: Financial History Steps
// =============================================================================

function ContributionHistoryStep({ contributions, circles }: { contributions: ImportedContribution[]; circles: ImportedCircle[] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Contribution History" description="Upload past contribution records to build financial context." />
      <FileUploadZone label="Upload contribution records" accept="CSV, XLSX" />

      {contributions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{contributions.length} contribution records imported</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Member</th>
                  <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">Circle</th>
                  <th className="text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Amount</th>
                  <th className="text-center px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Cycle</th>
                  <th className="text-center px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.slice(0, 5).map((c) => {
                  const circle = circles.find((ci) => ci.id === c.circleId)
                  return (
                    <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{c.memberName}</td>
                      <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{circle?.name || c.circleId}</td>
                      <td className="px-3 py-2.5 text-right font-medium text-slate-900 dark:text-white">CHF {c.amount}</td>
                      <td className="px-3 py-2.5 text-center text-slate-500">{c.cycle}</td>
                      <td className="px-3 py-2.5 text-center">
                        <StatusBadge
                          status={c.status === 'completed' ? 'success' : c.status === 'late' ? 'warning' : 'error'}
                          label={c.status === 'completed' ? 'Completed' : c.status === 'late' ? 'Late' : 'Partial'}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {contributions.length > 5 && (
            <p className="text-xs text-slate-400 mt-2 text-center">+ {contributions.length - 5} more records</p>
          )}
        </div>
      )}
    </div>
  )
}

function PayoutHistoryStep({ payouts, circles }: { payouts: ImportedPayout[]; circles: ImportedCircle[] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Payout History" description="Upload past payout records for verification." />
      <FileUploadZone label="Upload payout records" accept="CSV, XLSX" />

      {payouts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{payouts.length} payout records imported</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Member</th>
                  <th className="text-center px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Pos.</th>
                  <th className="text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Expected</th>
                  <th className="text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Actual</th>
                  <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.slice(0, 6).map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{p.memberName}</td>
                    <td className="px-3 py-2.5 text-center text-slate-500">#{p.position}</td>
                    <td className="px-3 py-2.5 text-right text-slate-500">CHF {p.expectedAmount.toLocaleString()}</td>
                    <td className={`px-3 py-2.5 text-right font-medium ${p.actualAmount < p.expectedAmount ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                      CHF {p.actualAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 hidden sm:table-cell">{new Date(p.payoutDate).toLocaleDateString('en-CH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function DuesRecordsStep({ members }: { members: ImportedMember[] }) {
  const withDues = members.filter((m) => m.duesStatus !== 'no_history')
  return (
    <div className="space-y-5">
      <SectionHeader title="Dues & Fees" description="Import dues standing for each member." />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['paid_up', 'partially_paid', 'overdue', 'no_history'] as const).map((status) => {
          const count = members.filter((m) => m.duesStatus === status).length
          const colors = { paid_up: 'emerald', partially_paid: 'amber', overdue: 'rose', no_history: 'slate' } as const
          const labels = { paid_up: 'Paid Up', partially_paid: 'Partial', overdue: 'Overdue', no_history: 'No Data' }
          return (
            <div key={status} className={`p-3 rounded-xl border text-center bg-${colors[status]}-50 dark:bg-${colors[status]}-950/20 border-${colors[status]}-200 dark:border-${colors[status]}-900/50`}>
              <p className={`text-2xl font-bold text-${colors[status]}-600 dark:text-${colors[status]}-400`}>{count}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{labels[status]}</p>
            </div>
          )
        })}
      </div>

      {withDues.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Member</th>
                <th className="text-center px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">Paid Through</th>
                <th className="text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Owed</th>
              </tr>
            </thead>
            <tbody>
              {withDues.slice(0, 8).map((m) => (
                <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{m.firstName} {m.lastName}</td>
                  <td className="px-3 py-2.5 text-center">
                    <StatusBadge
                      status={m.duesStatus === 'paid_up' ? 'success' : m.duesStatus === 'partially_paid' ? 'warning' : 'error'}
                      label={m.duesStatus === 'paid_up' ? 'Paid Up' : m.duesStatus === 'partially_paid' ? 'Partial' : 'Overdue'}
                    />
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 hidden sm:table-cell">{m.duesPaidThrough ? new Date(m.duesPaidThrough).toLocaleDateString('en-CH', { month: 'short', year: 'numeric' }) : '—'}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-slate-900 dark:text-white">{m.duesOwedAmount ? `CHF ${m.duesOwedAmount}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TrustScoreStep({ members }: { members: ImportedMember[] }) {
  const withScores = members.filter((m) => m.bootstrappedTrustScore !== null)
  const avgScore = withScores.length > 0
    ? Math.round(withScores.reduce((sum, m) => sum + (m.bootstrappedTrustScore || 0), 0) / withScores.length)
    : 0
  return (
    <div className="space-y-5">
      <SectionHeader title="Trust Scores" description="Preview bootstrapped trust scores based on imported history." />

      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/50 text-center">
        <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{avgScore}</p>
        <p className="text-xs text-indigo-500 uppercase tracking-wider font-medium mt-1">Average Trust Score</p>
        <p className="text-xs text-slate-500 mt-1">{withScores.length} members with bootstrapped scores</p>
      </div>

      <div className="space-y-2">
        {members.slice(0, 10).map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {m.firstName[0]}{m.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{m.firstName} {m.lastName}</p>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (m.bootstrappedTrustScore || 0) >= 80 ? 'bg-emerald-500' :
                        (m.bootstrappedTrustScore || 0) >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${m.bootstrappedTrustScore || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-8 text-right">
                    {m.bootstrappedTrustScore ?? '—'}
                  </span>
                </div>
              </div>
            </div>
            <StatusBadge
              status={m.trustScoreBadge === 'verified' ? 'success' : m.trustScoreBadge === 'bootstrapped' ? 'info' : 'neutral'}
              label={m.trustScoreBadge === 'verified' ? 'Verified' : m.trustScoreBadge === 'bootstrapped' ? 'Bootstrapped' : 'New'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// PHASE 5: Validation & Go-Live Steps
// =============================================================================

function ValidationReportStep({ report, onRunValidation, onAcknowledgeWarning }: {
  report: ValidationReport | null
  onRunValidation?: () => void
  onAcknowledgeWarning?: (id: string, reason: string) => void
}) {
  const checkIcon = (status: CheckStatus) => {
    if (status === 'passed') return <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    if (status === 'warning') return <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
    return <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
  }

  if (!report) {
    return (
      <div className="space-y-5">
        <SectionHeader title="Validation Report" description="Run a comprehensive check before going live." />
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Validation hasn't been run yet</p>
          <button onClick={onRunValidation} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
            Run Final Validation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="Validation Report" description="Pre-go-live checks across all imported data." />

      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          report.overallStatus === 'all_passed' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
          report.overallStatus === 'warnings_present' ? 'bg-amber-100 dark:bg-amber-900/40' :
          'bg-rose-100 dark:bg-rose-900/40'
        }`}>
          {checkIcon(report.overallStatus === 'all_passed' ? 'passed' : report.overallStatus === 'warnings_present' ? 'warning' : 'error')}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{report.passed} of {report.totalChecks} checks passed</p>
          <p className="text-xs text-slate-500">
            {report.blockingErrors > 0 && <span className="text-rose-500">{report.blockingErrors} blocking</span>}
            {report.blockingErrors > 0 && report.warnings > 0 && ' · '}
            {report.warnings > 0 && <span className="text-amber-500">{report.warnings} warnings</span>}
            {report.blockingErrors === 0 && report.warnings === 0 && <span className="text-emerald-500">All clear</span>}
          </p>
        </div>
      </div>

      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            report.overallStatus === 'all_passed' ? 'bg-emerald-500' :
            report.overallStatus === 'warnings_present' ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${(report.passed / report.totalChecks) * 100}%` }}
        />
      </div>

      <div className="space-y-4">
        {report.sections.map((section) => (
          <div key={section.name} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{section.name}</h4>
              <span className={`text-[11px] font-semibold ${
                section.status === 'passed' ? 'text-emerald-500' :
                section.status === 'has_warnings' ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {section.checks.filter((c) => c.status === 'passed').length}/{section.checks.length} passed
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {section.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-3 px-4 py-2.5">
                  <div className="mt-0.5">{checkIcon(check.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{check.description}</p>
                    {check.details && <p className="text-xs text-slate-500 mt-0.5">{check.details}</p>}
                  </div>
                  {check.status === 'warning' && !check.acknowledged && (
                    <button onClick={() => onAcknowledgeWarning?.(check.id, '')} className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline whitespace-nowrap">
                      Acknowledge
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MemberVerificationStep({ verifications, onResolveDispute }: {
  verifications: MemberVerification[]
  onResolveDispute?: (disputeId: string, accepted: boolean, resolution: string) => void
}) {
  const verified = verifications.filter((v) => v.status === 'verified').length
  const disputed = verifications.filter((v) => v.status === 'disputed').length
  const pending = verifications.filter((v) => v.status === 'pending').length
  return (
    <div className="space-y-5">
      <SectionHeader title="Member Verification" description="Track member self-verification status." />

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{verified}</p>
          <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">Verified</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pending}</p>
          <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">Pending</p>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-center">
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{disputed}</p>
          <p className="text-[10px] uppercase tracking-wider text-rose-600 font-semibold">Disputed</p>
        </div>
      </div>

      <div className="space-y-3">
        {verifications.map((v) => (
          <div key={v.id} className={`rounded-xl border p-4 ${
            v.status === 'disputed'
              ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20'
              : v.status === 'verified'
                ? 'border-slate-200 dark:border-slate-700'
                : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {v.memberName.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="font-medium text-sm text-slate-900 dark:text-white">{v.memberName}</span>
              </div>
              <StatusBadge
                status={v.status === 'verified' ? 'success' : v.status === 'disputed' ? 'error' : 'warning'}
                label={v.status === 'verified' ? 'Verified' : v.status === 'disputed' ? 'Disputed' : 'Pending'}
              />
            </div>
            {v.disputes.length > 0 && v.disputes.map((d) => (
              <div key={d.id} className="mt-3 pt-3 border-t border-rose-200 dark:border-rose-800/50">
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">{d.field}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Current: {d.currentValue}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic mb-2">"{d.memberClaim}"</p>
                {d.status === 'pending_review' && (
                  <div className="flex gap-2">
                    <button onClick={() => onResolveDispute?.(d.id, true, '')} className="px-3 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-md hover:bg-emerald-200 transition-colors">Accept</button>
                    <button onClick={() => onResolveDispute?.(d.id, false, '')} className="px-3 py-1 text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md hover:bg-slate-200 transition-colors">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function GoLiveStep({ config, readinessSummary, onGoLive, onScheduleGoLive, onEmergencyPause }: {
  config: GoLiveConfig
  readinessSummary?: {
    associationName: string
    totalMembers: number
    registeredMembers: number
    activeCircles: number
    totalMonthlyContributions: number
    estimatedFirstPaymentDate: string
  }
  onGoLive?: () => void
  onScheduleGoLive?: (date: string) => void
  onEmergencyPause?: () => void
}) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Go Live" description="Everything's ready — activate your association on CircleUp." />

      {readinessSummary && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Readiness Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{readinessSummary.registeredMembers}/{readinessSummary.totalMembers}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{readinessSummary.activeCircles}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Circles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">CHF {readinessSummary.totalMonthlyContributions.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Monthly</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{new Date(readinessSummary.estimatedFirstPaymentDate).toLocaleDateString('en-CH', { month: 'short', day: 'numeric' })}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">First Payment</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Post-Migration Checklist</h4>
        <div className="space-y-2.5">
          {config.postMigrationChecklist.map((item) => (
            <div key={item.item} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
                item.status === 'in_progress' ? 'bg-indigo-100 dark:bg-indigo-900/40' :
                'bg-slate-100 dark:bg-slate-800'
              }`}>
                {item.status === 'completed' ? (
                  <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : item.status === 'in_progress' ? (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.item}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onGoLive}
          disabled={!config.readyToGoLive}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            config.readyToGoLive
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {config.readyToGoLive ? 'Go Live Now' : `Go Live (${config.blockingIssues} issues remaining)`}
        </button>
        <button
          onClick={() => onScheduleGoLive?.('')}
          disabled={!config.readyToGoLive}
          className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
            config.readyToGoLive
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
              : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          Schedule Go-Live
        </button>
      </div>
      {config.emergencyPauseAvailable && (
        <button
          onClick={onEmergencyPause}
          className="w-full py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/50"
        >
          Emergency: Pause Migration
        </button>
      )}
    </div>
  )
}

// =============================================================================
// Main MigrationWizard Component
// =============================================================================

export function MigrationWizard(props: MigrationWizardProps) {
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
  } = props

  const [currentIndex, setCurrentIndex] = useState(0)
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

      {/* Mobile stepper */}
      <WizardMobileStepper currentIndex={currentIndex} />

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
