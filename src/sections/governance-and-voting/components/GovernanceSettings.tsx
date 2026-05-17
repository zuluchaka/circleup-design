import React from 'react'
import type {
  GovernanceSettings as GovernanceSettingsType,
  GovernanceSettingsProps,
  VotingModel,
  CulturalPreset,
} from '@/../product/sections/governance-and-voting/types'

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Constants
const votingModelDescriptions: Record<VotingModel, { name: string; description: string }> = {
  simple_majority: {
    name: 'Simple Majority',
    description: 'More than 50% of votes needed to pass. Best for routine decisions.',
  },
  supermajority: {
    name: 'Supermajority (2/3)',
    description: 'At least 66.7% of votes needed. Used for significant decisions.',
  },
  ranked_choice: {
    name: 'Ranked Choice',
    description: 'Voters rank candidates in order of preference. Eliminates need for runoffs.',
  },
  consensus: {
    name: 'Consensus',
    description: 'All members must agree or not object. Emphasizes discussion and compromise.',
  },
  weighted: {
    name: 'Weighted Voting',
    description: 'Votes carry different weights based on member criteria.',
  },
}

const culturalPresetDescriptions: Record<CulturalPreset, { name: string; description: string; defaults: Partial<GovernanceSettingsType> }> = {
  parliamentary: {
    name: 'Parliamentary',
    description: 'Formal structure with motions, seconds, and Robert\'s Rules of Order.',
    defaults: {
      votingModel: 'simple_majority',
      quorumPercentage: 50,
      defaultVotingPeriodDays: 7,
      secretBallotDefault: true,
    },
  },
  consensus: {
    name: 'Consensus-Based',
    description: 'Emphasizes discussion and agreement. Decisions require group harmony.',
    defaults: {
      votingModel: 'consensus',
      quorumPercentage: 75,
      defaultVotingPeriodDays: 14,
      secretBallotDefault: false,
    },
  },
  elder_council: {
    name: 'Elder Council',
    description: 'Respects traditional leadership structures with weighted input from elders.',
    defaults: {
      votingModel: 'weighted',
      quorumPercentage: 60,
      defaultVotingPeriodDays: 10,
      secretBallotDefault: false,
    },
  },
  custom: {
    name: 'Custom',
    description: 'Configure your own governance rules to match your unique needs.',
    defaults: {},
  },
}

// Sub-components
function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{title}</h2>
      {children}
    </div>
  )
}

function CulturalPresetCard({
  preset,
  isSelected,
  onSelect,
}: {
  preset: CulturalPreset
  isSelected: boolean
  onSelect: () => void
}) {
  const config = culturalPresetDescriptions[preset]

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSelected
            ? 'bg-indigo-500 text-white'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        }`}>
          {preset === 'parliamentary' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
          {preset === 'consensus' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {preset === 'elder_council' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          {preset === 'custom' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-1 ${
            isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'
          }`}>{config.name}</h3>
          <p className={`text-sm ${
            isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'
          }`}>{config.description}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
          isSelected
            ? 'border-indigo-500 bg-indigo-500'
            : 'border-slate-300 dark:border-slate-600'
        }`}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

function VotingModelSelector({
  value,
  onChange,
}: {
  value: VotingModel
  onChange: (model: VotingModel) => void
}) {
  return (
    <div className="space-y-3">
      {(Object.keys(votingModelDescriptions) as VotingModel[]).map(model => {
        const config = votingModelDescriptions[model]
        const isSelected = value === model

        return (
          <label
            key={model}
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <input
              type="radio"
              name="votingModel"
              value={model}
              checked={isSelected}
              onChange={() => onChange(model)}
              className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <div>
              <p className={`font-medium ${
                isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'
              }`}>{config.name}</p>
              <p className={`text-sm ${
                isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'
              }`}>{config.description}</p>
            </div>
          </label>
        )
      })}
    </div>
  )
}

function NumberSetting({
  label,
  description,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  suffix?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
          min={min}
          max={max}
          className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {suffix && <span className="text-sm text-slate-600 dark:text-slate-400">{suffix}</span>}
      </div>
    </div>
  )
}

function ToggleSetting({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          value ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

// Main component
export function GovernanceSettings({
  settings,
  onUpdateSettings,
  onSelectPreset,
}: GovernanceSettingsProps) {
  const [localSettings, setLocalSettings] = React.useState(settings)
  const [hasChanges, setHasChanges] = React.useState(false)

  const handleUpdate = <K extends keyof GovernanceSettingsType>(
    key: K,
    value: GovernanceSettingsType[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handlePresetSelect = (preset: CulturalPreset) => {
    const presetDefaults = culturalPresetDescriptions[preset].defaults
    setLocalSettings(prev => ({ ...prev, ...presetDefaults, culturalPreset: preset }))
    setHasChanges(true)
    onSelectPreset?.(preset)
  }

  const handleSave = () => {
    onUpdateSettings?.(localSettings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setLocalSettings(settings)
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Governance Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Configure voting rules, quorum requirements, and governance preferences for {settings.associationName}
          </p>
        </div>

        <div className="space-y-6">
          {/* Cultural Presets */}
          <SettingSection title="Governance Style">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Choose a preset that matches your organization's decision-making culture, or customize your own.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {(Object.keys(culturalPresetDescriptions) as CulturalPreset[]).map(preset => (
                <CulturalPresetCard
                  key={preset}
                  preset={preset}
                  isSelected={localSettings.culturalPreset === preset}
                  onSelect={() => handlePresetSelect(preset)}
                />
              ))}
            </div>
          </SettingSection>

          {/* Voting Model */}
          <SettingSection title="Voting Model">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Select the default voting method for elections and proposals.
            </p>
            <VotingModelSelector
              value={localSettings.votingModel}
              onChange={(model) => handleUpdate('votingModel', model)}
            />
          </SettingSection>

          {/* Quorum & Thresholds */}
          <SettingSection title="Quorum & Thresholds">
            <NumberSetting
              label="Quorum Percentage"
              description="Minimum voter participation required for a valid vote"
              value={localSettings.quorumPercentage}
              onChange={(value) => handleUpdate('quorumPercentage', value)}
              min={10}
              max={100}
              suffix="%"
            />
            <NumberSetting
              label="Amendment Threshold"
              description="Percentage needed to pass amendments to existing rules"
              value={localSettings.amendmentThreshold}
              onChange={(value) => handleUpdate('amendmentThreshold', value)}
              min={50}
              max={100}
              suffix="%"
            />
            <NumberSetting
              label="Constitutional Change Threshold"
              description="Percentage needed for major organizational changes"
              value={localSettings.constitutionalChangeThreshold}
              onChange={(value) => handleUpdate('constitutionalChangeThreshold', value)}
              min={50}
              max={100}
              suffix="%"
            />
          </SettingSection>

          {/* Time Periods */}
          <SettingSection title="Default Time Periods">
            <NumberSetting
              label="Discussion Period"
              description="Default days for proposal discussion before voting"
              value={localSettings.defaultDiscussionPeriodDays}
              onChange={(value) => handleUpdate('defaultDiscussionPeriodDays', value)}
              min={1}
              max={90}
              suffix="days"
            />
            <NumberSetting
              label="Voting Period"
              description="Default days for voting on elections and proposals"
              value={localSettings.defaultVotingPeriodDays}
              onChange={(value) => handleUpdate('defaultVotingPeriodDays', value)}
              min={1}
              max={30}
              suffix="days"
            />
          </SettingSection>

          {/* Voting Options */}
          <SettingSection title="Voting Options">
            <ToggleSetting
              label="Secret Ballot by Default"
              description="Hide individual votes on elections and proposals"
              value={localSettings.secretBallotDefault}
              onChange={(value) => handleUpdate('secretBallotDefault', value)}
            />
            <ToggleSetting
              label="Allow Proxy Voting"
              description="Let members authorize others to vote on their behalf"
              value={localSettings.proxyVotingEnabled}
              onChange={(value) => handleUpdate('proxyVotingEnabled', value)}
            />
          </SettingSection>

          {/* Term Limits */}
          <SettingSection title="Term Limits">
            <ToggleSetting
              label="Enable Term Limits"
              description="Limit how many consecutive terms a member can hold a position"
              value={localSettings.termLimitEnabled}
              onChange={(value) => handleUpdate('termLimitEnabled', value)}
            />
            {localSettings.termLimitEnabled && (
              <NumberSetting
                label="Maximum Consecutive Terms"
                description="How many terms a member can serve in the same position"
                value={localSettings.maxConsecutiveTerms || 2}
                onChange={(value) => handleUpdate('maxConsecutiveTerms', value)}
                min={1}
                max={10}
                suffix="terms"
              />
            )}
          </SettingSection>

          {/* Last Updated */}
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Last updated {formatDate(settings.updatedAt)} by {settings.updatedBy}
          </div>
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You have unsaved changes
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
