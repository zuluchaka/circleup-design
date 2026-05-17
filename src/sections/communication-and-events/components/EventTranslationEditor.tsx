import { useState } from 'react'

// ============================================
// Types
// ============================================

interface EventTranslation {
  id?: string
  locale: string
  title: string
  description: string
}

interface EventTranslationEditorProps {
  translations: EventTranslation[]
  onSave: (translation: EventTranslation) => void
  onDelete?: (id: string) => void
}

const LOCALES = [
  { code: 'de', label: 'Deutsch (DE)' },
  { code: 'fr', label: 'Francais (FR)' },
  { code: 'it', label: 'Italiano (IT)' },
  { code: 'en', label: 'English (EN)' },
] as const

// ============================================
// Component
// ============================================

export function EventTranslationEditor({
  translations,
  onSave,
  onDelete,
}: EventTranslationEditorProps) {
  const [activeLocale, setActiveLocale] = useState<string>('de')
  const [drafts, setDrafts] = useState<Record<string, EventTranslation>>(() => {
    const initial: Record<string, EventTranslation> = {}
    for (const locale of LOCALES) {
      const existing = translations.find((t) => t.locale === locale.code)
      initial[locale.code] = existing || { locale: locale.code, title: '', description: '' }
    }
    return initial
  })
  const [saving, setSaving] = useState<string | null>(null)

  const currentDraft = drafts[activeLocale]
  const hasExisting = (locale: string) =>
    translations.some((t) => t.locale === locale)

  const updateDraft = (field: 'title' | 'description', value: string) => {
    setDrafts({
      ...drafts,
      [activeLocale]: { ...currentDraft, [field]: value },
    })
  }

  const handleSave = async () => {
    setSaving(activeLocale)
    try {
      await onSave(currentDraft)
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = () => {
    const existing = translations.find((t) => t.locale === activeLocale)
    if (existing?.id && onDelete) {
      onDelete(existing.id)
      setDrafts({
        ...drafts,
        [activeLocale]: { locale: activeLocale, title: '', description: '' },
      })
    }
  }

  const isDirty = (locale: string) => {
    const existing = translations.find((t) => t.locale === locale)
    const draft = drafts[locale]
    if (!existing) return draft.title.trim() !== '' || draft.description.trim() !== ''
    return existing.title !== draft.title || existing.description !== draft.description
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Multilingual Event Content
      </h2>

      {/* Locale Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        {LOCALES.map((locale) => (
          <button
            key={locale.code}
            onClick={() => setActiveLocale(locale.code)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeLocale === locale.code
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {locale.code.toUpperCase()}
            {hasExisting(locale.code) && (
              <span className="ml-1.5 w-2 h-2 inline-block rounded-full bg-emerald-500" />
            )}
            {isDirty(locale.code) && (
              <span className="ml-1 text-amber-500">*</span>
            )}
          </button>
        ))}
      </div>

      {/* Translation Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title ({LOCALES.find((l) => l.code === activeLocale)?.label})
          </label>
          <input
            type="text"
            value={currentDraft.title}
            onChange={(e) => updateDraft('title', e.target.value)}
            placeholder="Event title in this language..."
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description ({LOCALES.find((l) => l.code === activeLocale)?.label})
          </label>
          <textarea
            value={currentDraft.description}
            onChange={(e) => updateDraft('description', e.target.value)}
            placeholder="Event description in this language..."
            rows={6}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div>
          {hasExisting(activeLocale) && onDelete && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove Translation
            </button>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving !== null || !currentDraft.title.trim()}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving === activeLocale
            ? 'Saving...'
            : hasExisting(activeLocale)
              ? 'Update Translation'
              : 'Save Translation'}
        </button>
      </div>
    </div>
  )
}
