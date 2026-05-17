import type { JSX } from 'react'
import type { DocumentTemplatesProps, DocumentTemplate, DocumentCategory } from '@/../product/sections/documents/types'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type CategoryFilter = DocumentCategory | 'forms' | 'all'

const categoryConfig: Record<CategoryFilter, { label: string; icon: JSX.Element; color: string }> = {
  all: {
    label: 'All Templates',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    color: 'slate',
  },
  agreements: {
    label: 'Agreements',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'indigo',
  },
  minutes: {
    label: 'Meeting Minutes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'emerald',
  },
  financial: {
    label: 'Financial',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'amber',
  },
  policies: {
    label: 'Policies',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'purple',
  },
  forms: {
    label: 'Forms',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    color: 'rose',
  },
}

function getCategoryBgColor(category: string) {
  const colorMap: Record<string, string> = {
    agreements: 'bg-indigo-100 dark:bg-indigo-900/30',
    minutes: 'bg-emerald-100 dark:bg-emerald-900/30',
    financial: 'bg-amber-100 dark:bg-amber-900/30',
    policies: 'bg-purple-100 dark:bg-purple-900/30',
    forms: 'bg-rose-100 dark:bg-rose-900/30',
  }
  return colorMap[category] || 'bg-slate-100 dark:bg-slate-700'
}

function getCategoryTextColor(category: string) {
  const colorMap: Record<string, string> = {
    agreements: 'text-indigo-600 dark:text-indigo-400',
    minutes: 'text-emerald-600 dark:text-emerald-400',
    financial: 'text-amber-600 dark:text-amber-400',
    policies: 'text-purple-600 dark:text-purple-400',
    forms: 'text-rose-600 dark:text-rose-400',
  }
  return colorMap[category] || 'text-slate-600 dark:text-slate-400'
}

function getCategoryBadgeColor(category: string) {
  const colorMap: Record<string, string> = {
    agreements: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    minutes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    financial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    policies: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    forms: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  }
  return colorMap[category] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
}

function TemplateCard({
  template,
  onUse,
  onEdit,
  onDelete,
}: {
  template: DocumentTemplate
  onUse: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryBgColor(template.category)}`}>
          <span className={getCategoryTextColor(template.category)}>
            {categoryConfig[template.category]?.icon || categoryConfig.forms.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {template.name}
            </h3>
            {template.isDefault && (
              <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded font-medium flex-shrink-0">
                Default
              </span>
            )}
          </div>
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getCategoryBadgeColor(template.category)}`}>
            {template.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
        {template.description}
      </p>

      {/* Fields */}
      {template.fields.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Fields</p>
          <div className="flex flex-wrap gap-1.5">
            {template.fields.slice(0, 4).map((field) => (
              <span
                key={field}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded"
              >
                {field}
              </span>
            ))}
            {template.fields.length > 4 && (
              <span className="px-2 py-0.5 text-slate-400 dark:text-slate-500 text-xs">
                +{template.fields.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <span>Used {template.usageCount} times</span>
        <span>{formatFileSize(template.fileSize)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUse}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Use Template
        </button>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export function DocumentTemplates({
  templates,
  selectedCategory = 'all',
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onCreateTemplate,
  onCategorySelect,
}: DocumentTemplatesProps) {
  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  // Count templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories: CategoryFilter[] = ['all', 'agreements', 'minutes', 'financial', 'policies', 'forms']

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Document Templates
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {templates.length} templates available
            </p>
          </div>
          <button
            onClick={onCreateTemplate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Template
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Categories
                </h2>
              </div>
              <div className="p-2">
                {categories.map((category) => {
                  const config = categoryConfig[category]
                  const count = category === 'all' ? templates.length : templatesByCategory[category] || 0
                  const isSelected = selectedCategory === category

                  return (
                    <button
                      key={category}
                      onClick={() => onCategorySelect?.(category)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {config.icon}
                        {config.label}
                      </span>
                      <span className="text-xs opacity-60">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800/30 p-4">
              <h3 className="font-medium text-indigo-900 dark:text-indigo-300 text-sm mb-2">
                Template Tips
              </h3>
              <ul className="space-y-2 text-xs text-indigo-700 dark:text-indigo-400">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Use default templates for common documents
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Create custom templates for your circle
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Share templates across multiple circles
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Current Category Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`p-2 rounded-lg ${getCategoryBgColor(selectedCategory === 'all' ? 'slate' : selectedCategory)}`}>
                <span className={getCategoryTextColor(selectedCategory === 'all' ? 'slate' : selectedCategory)}>
                  {categoryConfig[selectedCategory].icon}
                </span>
              </span>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {categoryConfig[selectedCategory].label}
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                ({filteredTemplates.length})
              </span>
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={() => onUseTemplate?.(template)}
                    onEdit={() => onEditTemplate?.(template.id)}
                    onDelete={() => onDeleteTemplate?.(template.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  No templates in this category
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Create a template to get started
                </p>
                <button
                  onClick={onCreateTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Template
                </button>
              </div>
            )}

            {/* Default Templates Info */}
            {filteredTemplates.some(t => t.isDefault) && (
              <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30 p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      Default templates
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Templates marked as &quot;Default&quot; are system-provided and optimized for common use cases
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
