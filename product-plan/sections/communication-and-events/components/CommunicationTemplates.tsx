import type {
  TemplatesManagerProps,
  MessageTemplate,
  NotificationCategory,
} from '../types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getCategoryColor(category: NotificationCategory): string {
  switch (category) {
    case 'payments':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'governance':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'social':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
    case 'announcements':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'events':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'messages':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
  }
}

function TemplateCard({
  template,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  template: MessageTemplate
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 transition-all overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
              {template.isDefault && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  Default
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {template.name}
            </h3>
          </div>

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Duplicate"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            {!template.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Subject */}
        {template.subject && (
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Subject: {template.subject}
          </p>
        )}

        {/* Preview */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
          {template.content.replace(/\{\{[^}]+\}\}/g, '[...]')}
        </p>

        {/* Variables */}
        {template.variables.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {template.variables.slice(0, 4).map((variable) => (
              <span
                key={variable}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-mono rounded"
              >
                {`{{${variable}}}`}
              </span>
            ))}
            {template.variables.length > 4 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                +{template.variables.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <img
              src={template.createdBy.avatar}
              alt=""
              className="w-5 h-5 rounded-full"
            />
            <span>{template.createdBy.name}</span>
            <span>·</span>
            <span>{formatDate(template.updatedAt)}</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase">
            {template.language}
          </span>
        </div>
      </div>

      {/* Use Template Button */}
      <button
        onClick={onSelect}
        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
      >
        Use Template
      </button>
    </div>
  )
}

export function CommunicationTemplates({
  templates,
  categories,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
  onDuplicate,
}: TemplatesManagerProps) {
  const categoryLabels: Record<NotificationCategory, string> = {
    payments: 'Payments',
    governance: 'Governance',
    social: 'Social',
    announcements: 'Announcements',
    events: 'Events',
    messages: 'Messages',
  }

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = []
    acc[template.category].push(template)
    return acc
  }, {} as Record<NotificationCategory, MessageTemplate[]>)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Message Templates
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage notification and message templates for your association
            </p>
          </div>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Template
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button className="px-3 py-2 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap transition-colors"
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates by Category */}
        {categories.map((category) => {
          const categoryTemplates = templatesByCategory[category] || []
          if (categoryTemplates.length === 0) return null

          return (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getCategoryColor(category).split(' ')[0]}`} />
                {categoryLabels[category]}
                <span className="text-sm font-normal text-slate-400 dark:text-slate-500">
                  ({categoryTemplates.length})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => onSelect(template)}
                    onEdit={() => onEdit(template)}
                    onDelete={() => onDelete(template.id)}
                    onDuplicate={() => onDuplicate(template)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
              No templates yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Create your first message template to streamline communications
            </p>
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Template
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900">
          <div className="flex gap-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl h-fit">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                Using Variables
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Templates support dynamic variables like <code className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 rounded text-xs">{'{{member_name}}'}</code> and <code className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 rounded text-xs">{'{{amount}}'}</code>. These are automatically replaced with actual values when the template is used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
