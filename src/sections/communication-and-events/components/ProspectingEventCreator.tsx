import { useState } from 'react'

// ============================================
// Prospecting Event Types (Phase 6 — CM Events)
// ============================================

export interface ProspectingEventTemplate {
  id: string
  name: string
  description: string
  eventDefaults: Record<string, unknown>
  isActive: boolean
  usageCount: number
}

interface ProspectingEventCreatorProps {
  templates: ProspectingEventTemplate[]
  onSave: (data: Record<string, unknown>) => void
  onCancel: () => void
}

export function ProspectingEventCreator({
  templates,
  onSave,
  onCancel,
}: ProspectingEventCreatorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventEndDate, setEventEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [budget, setBudget] = useState('')
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeTemplates = templates.filter(t => t.isActive)

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    if (!templateId) return

    const template = templates.find(t => t.id === templateId)
    if (!template) return

    const defaults = template.eventDefaults
    if (defaults.title && typeof defaults.title === 'string') setTitle(defaults.title)
    if (defaults.description && typeof defaults.description === 'string') setDescription(defaults.description)
    if (defaults.location && typeof defaults.location === 'string') setLocation(defaults.location)
    if (defaults.targetAudience && typeof defaults.targetAudience === 'string') setTargetAudience(defaults.targetAudience)
    if (defaults.budget !== undefined && defaults.budget !== null) setBudget(String(defaults.budget))
  }

  const collectFormData = (): Record<string, unknown> => ({
    title,
    description,
    event_date: eventDate,
    event_end_date: eventEndDate || null,
    location,
    target_audience: targetAudience,
    budget: budget ? parseFloat(budget) : 0,
    template_id: selectedTemplateId || null,
    save_as_template: saveAsTemplate,
    template_name: saveAsTemplate ? templateName : null,
  })

  const handleSubmit = () => {
    if (!title.trim() || !eventDate) return
    setSubmitting(true)
    onSave(collectFormData())
  }

  const isValid = title.trim().length > 0 && eventDate.length > 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create Prospecting Event
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Template Selector */}
          {activeTemplates.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Start from Template
              </h2>
              <select
                value={selectedTemplateId}
                onChange={e => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select a template (optional) --</option>
                {activeTemplates.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.usageCount} uses)
                  </option>
                ))}
              </select>
              {selectedTemplateId && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {templates.find(t => t.id === selectedTemplateId)?.description}
                </p>
              )}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Community Outreach Networking Evening"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the purpose and agenda of this prospecting event..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Date & Time
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventEndDate}
                  onChange={e => setEventEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Location & Audience */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Location & Target Audience
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Conference Room A, City Hall"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g., Small business owners, freelancers, local community leaders"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Budget
            </h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Estimated Budget (CHF)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  CHF
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Save as Template */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsTemplate}
                onChange={e => setSaveAsTemplate(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-medium text-slate-900 dark:text-white">Save as Template</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Save this configuration as a reusable template for future events
                </p>
              </div>
            </label>

            {saveAsTemplate && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Monthly Networking Mixer"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Prospecting Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
