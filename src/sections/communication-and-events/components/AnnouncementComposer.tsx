import type { AnnouncementComposerProps } from '@/../product/sections/communication-and-events/types'

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function AnnouncementComposer({
  announcement,
  templates,
  onSave,
  onPublish,
  onSchedule,
  onCancel,
}: AnnouncementComposerProps) {
  const isEditing = !!announcement

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
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Announcement' : 'New Announcement'}
              </h1>
              {announcement?.status === 'draft' && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Draft saved {formatDateTime(announcement.updatedAt)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSave({})}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => onPublish({})}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Publish Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter announcement title..."
                defaultValue={announcement?.title}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 text-lg font-medium"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content
              </label>

              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-t-xl border-b border-slate-200 dark:border-slate-600">
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <svg className="w-4 h-4 font-bold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  </svg>
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors italic">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 5v2h2.586L8.707 19H6v2h8v-2h-2.586l3.879-12H18V5z" />
                  </svg>
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <textarea
                placeholder="Write your announcement content here..."
                defaultValue={announcement?.content}
                rows={12}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-b-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Priority */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Priority
              </label>
              <div className="space-y-2">
                {(['normal', 'high', 'urgent'] as const).map((priority) => (
                  <label
                    key={priority}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      (announcement?.priority || 'normal') === priority
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      defaultChecked={(announcement?.priority || 'normal') === priority}
                      className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white capitalize">
                        {priority}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {priority === 'urgent'
                          ? 'Critical updates requiring immediate attention'
                          : priority === 'high'
                          ? 'Important announcements members should see'
                          : 'Regular community updates'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Target Audience
              </label>
              <select
                defaultValue={announcement?.targetAudience?.type || 'all'}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Members</option>
                <option value="roles">Specific Roles</option>
                <option value="circles">Specific Circles</option>
              </select>
            </div>

            {/* Acknowledgment */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={announcement?.requiresAcknowledgment}
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">
                    Require Acknowledgment
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Members must confirm they've read this
                  </p>
                </div>
              </label>
            </div>

            {/* Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Schedule
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Publish Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Expiration Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    defaultValue={announcement?.expiresAt?.slice(0, 16)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => onSchedule({}, '')}
                className="w-full mt-4 px-4 py-2 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                Schedule for Later
              </button>
            </div>

            {/* Templates */}
            {templates.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Use Template
                </label>
                <div className="space-y-2">
                  {templates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <p className="font-medium text-slate-900 dark:text-white text-sm">
                        {template.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {template.category}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
