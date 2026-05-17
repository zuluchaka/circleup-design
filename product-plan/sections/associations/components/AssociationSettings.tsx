import { useState } from 'react'
import type { Association, AssociationType, AssociationVisibility } from '../types'

export interface AssociationSettingsProps {
  association: Association
  onSave?: (updates: Partial<Association>) => void
  onUploadLogo?: () => void
  onUploadCover?: () => void
  onBack?: () => void
}

type Tab = 'general' | 'branding' | 'language' | 'privacy'

const tabs: { id: Tab; label: string; icon: string }[] = [
  {
    id: 'general',
    label: 'General',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    id: 'language',
    label: 'Language & Culture',
    icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
]

const typeOptions: { value: AssociationType; label: string; icon: string }[] = [
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'religious', label: 'Religious', icon: '🕊️' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'savings', label: 'Savings', icon: '💰' },
  { value: 'social', label: 'Social', icon: '🤝' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
]

const visibilityOptions: { value: AssociationVisibility; label: string; description: string }[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can find and request to join',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Hidden from search, invite only',
  },
  {
    value: 'invite_only',
    label: 'Invite Only',
    description: 'Visible but requires invitation to join',
  },
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
]

const terminologyOptions = [
  { value: 'circle', label: 'Circle' },
  { value: 'susu', label: 'Susu (West African)' },
  { value: 'tontine', label: 'Tontine (French-speaking Africa)' },
  { value: 'ekub', label: 'Ekub (Ethiopian)' },
  { value: 'chit', label: 'Chit Fund (South Asian)' },
  { value: 'paluwagan', label: 'Paluwagan (Filipino)' },
]

export function AssociationSettings({
  association,
  onSave,
  onUploadLogo,
  onUploadCover,
  onBack,
}: AssociationSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [formData, setFormData] = useState({
    name: association.name,
    description: association.description,
    type: association.type,
    visibility: association.visibility,
    language: association.language,
    culturalTerminology: association.settings.culturalTerminology,
    allowPublicJoin: association.settings.allowPublicJoin,
    requireApproval: association.settings.requireApproval,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave?.({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      visibility: formData.visibility,
      language: formData.language,
      settings: {
        culturalTerminology: formData.culturalTerminology,
        allowPublicJoin: formData.allowPublicJoin,
        requireApproval: formData.requireApproval,
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Settings
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Manage your association settings
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs */}
          <nav className="lg:w-56 flex-shrink-0">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Association Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Association Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleChange('type', option.value)}
                        className={`
                          p-4 rounded-xl border-2 transition-colors text-left
                          ${
                            formData.type === option.value
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }
                        `}
                      >
                        <span className="text-2xl block mb-1">{option.icon}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Logo
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {association.logo ? (
                        <img
                          src={association.logo}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                          {association.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={onUploadLogo}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                      >
                        Upload New Logo
                      </button>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Cover Image
                  </label>
                  <div className="space-y-4">
                    <div className="aspect-[3/1] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {association.coverImage ? (
                        <img
                          src={association.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={onUploadCover}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                      >
                        Upload New Cover
                      </button>
                      <p className="text-xs text-slate-500 dark:text-slate-500 self-center">
                        Recommended: 1200x400px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Primary Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                    This determines the default language for announcements and communications
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Cultural Terminology
                  </label>
                  <select
                    value={formData.culturalTerminology}
                    onChange={(e) => handleChange('culturalTerminology', e.target.value)}
                    className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {terminologyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                    Choose terminology that resonates with your community's traditions
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Visibility
                  </label>
                  <div className="space-y-3">
                    {visibilityOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`
                          flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors
                          ${
                            formData.visibility === option.value
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.visibility === option.value}
                          onChange={(e) => handleChange('visibility', e.target.value)}
                          className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                        />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {option.label}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-500">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Allow public join requests
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        Let users request to join without an invitation
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange('allowPublicJoin', !formData.allowPublicJoin)}
                      className={`
                        relative w-12 h-7 rounded-full transition-colors
                        ${formData.allowPublicJoin ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}
                      `}
                    >
                      <span
                        className={`
                          absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform
                          ${formData.allowPublicJoin ? 'translate-x-5' : ''}
                        `}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Require approval for new members
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        Admins must approve all new membership requests
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange('requireApproval', !formData.requireApproval)}
                      className={`
                        relative w-12 h-7 rounded-full transition-colors
                        ${formData.requireApproval ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}
                      `}
                    >
                      <span
                        className={`
                          absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform
                          ${formData.requireApproval ? 'translate-x-5' : ''}
                        `}
                      />
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
