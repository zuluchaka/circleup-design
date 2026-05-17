import { useState, useMemo } from 'react'
import { Megaphone, Plus, Search, Filter } from 'lucide-react'
import { AnnouncementCard } from './AnnouncementCard'
import type { Announcement, AnnouncementPriority } from '@/../product/sections/associations/types'

type PriorityFilter = 'all' | AnnouncementPriority

interface AnnouncementsDashboardProps {
  association: { id: string; name: string }
  announcements: Announcement[]
  canManage?: boolean
  onCreateAnnouncement?: (data: { title: string; content: string; priority: string }) => void
  onEditAnnouncement?: (id: string) => void
  onDeleteAnnouncement?: (id: string) => void
  onBack?: () => void
}

const priorityFilters: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'Important' },
  { value: 'medium', label: 'Notice' },
  { value: 'low', label: 'Info' },
]

export function AnnouncementsDashboard({
  association,
  announcements,
  canManage = false,
  onCreateAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onBack,
}: AnnouncementsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newPriority, setNewPriority] = useState<AnnouncementPriority>('medium')

  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = selectedPriority === 'all' || a.priority === selectedPriority
      return matchesSearch && matchesPriority
    })
  }, [announcements, searchQuery, selectedPriority])

  const stats = useMemo(() => ({
    total: announcements.length,
    high: announcements.filter((a) => a.priority === 'high').length,
    medium: announcements.filter((a) => a.priority === 'medium').length,
    low: announcements.filter((a) => a.priority === 'low').length,
  }), [announcements])

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return
    onCreateAnnouncement?.({ title: newTitle, content: newContent, priority: newPriority })
    setNewTitle('')
    setNewContent('')
    setNewPriority('medium')
    setShowCreateForm(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-indigo-500" />
                  Announcements
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {association.name}
                </p>
              </div>
            </div>
            {canManage && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Announcement
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
              { label: 'Important', value: stats.high, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
              { label: 'Notices', value: stats.medium, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
              { label: 'Info', value: stats.low, color: 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium mt-0.5 opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {priorityFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSelectedPriority(f.value)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    selectedPriority === f.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Create form */}
      {showCreateForm && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Create Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Announcement title"
                  className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <div className="flex gap-2">
                  {(['high', 'medium', 'low'] as AnnouncementPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                        newPriority === p
                          ? p === 'high' ? 'bg-red-600 text-white'
                            : p === 'medium' ? 'bg-amber-500 text-white'
                            : 'bg-slate-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p === 'high' ? 'Important' : p === 'medium' ? 'Notice' : 'Info'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements list */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {announcements.length === 0 ? (
                <Megaphone className="w-8 h-8 text-slate-400" />
              ) : (
                <Filter className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {announcements.length === 0 ? 'No announcements yet' : 'No announcements found'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {announcements.length === 0
                ? canManage ? 'Create the first announcement for your association.' : 'Check back later for updates.'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              {filtered.length} {filtered.length === 1 ? 'announcement' : 'announcements'}
              {selectedPriority !== 'all' || searchQuery ? ' found' : ''}
            </p>
            <div className="space-y-4">
              {filtered.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={canManage ? () => onEditAnnouncement?.(announcement.id) : undefined}
                  onDelete={canManage ? () => onDeleteAnnouncement?.(announcement.id) : undefined}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
