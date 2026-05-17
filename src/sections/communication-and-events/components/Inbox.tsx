import { useState, useMemo } from 'react'
import type {
  InboxProps,
  InboxFilters,
  InboxItem,
  Notification,
  NotificationCategory,
} from '@/../product/sections/communication-and-events/types'
import { InboxItemRow, getCategoryIcon } from './InboxItemRow'

function getItemCategory(item: InboxItem): string | undefined {
  if (item.type === 'notification') return (item.item as Notification).category
  if (item.type === 'message') return 'messages'
  if (item.type === 'announcement') return 'announcements'
  return undefined
}

function getItemSearchText(item: InboxItem): string {
  const inner = item.item as unknown as Record<string, unknown>
  const parts: string[] = []
  if (inner.title) parts.push(String(inner.title))
  if (inner.body) parts.push(String(inner.body))
  if (inner.content) parts.push(String(inner.content))
  const sender = inner.sender as Record<string, unknown> | undefined
  if (sender?.name) parts.push(String(sender.name))
  return parts.join(' ').toLowerCase()
}

export function Inbox({
  items,
  filters: externalFilters,
  onFilterChange: externalOnFilterChange,
  onMarkRead,
  onMarkAllRead,
  onArchive,
  onDelete,
  onItemClick,
}: InboxProps) {
  // Use local filter state so filtering works even when parent passes {} and no-op
  const [localFilters, setLocalFilters] = useState<InboxFilters>({})
  const filters = externalFilters?.type || externalFilters?.category || externalFilters?.searchQuery || externalFilters?.read !== undefined
    ? externalFilters
    : localFilters
  const onFilterChange = (f: InboxFilters) => {
    setLocalFilters(f)
    externalOnFilterChange(f)
  }

  const filtered = useMemo(() => {
    let result = items
    if (filters.type) {
      result = result.filter((i) => i.type === filters.type)
    }
    if (filters.category) {
      result = result.filter((i) => getItemCategory(i) === filters.category)
    }
    if (filters.read !== undefined) {
      result = result.filter((i) => i.read === filters.read)
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter((i) => getItemSearchText(i).includes(q))
    }
    return result
  }, [items, filters])

  const unreadCount = items.filter((item) => !item.read).length
  const filterTypes = ['all', 'notification', 'message', 'announcement'] as const
  const categories: NotificationCategory[] = ['payments', 'governance', 'social', 'announcements', 'events', 'messages']

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Inbox
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
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
                placeholder="Search inbox..."
                value={filters.searchQuery || ''}
                onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {filterTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => onFilterChange({ ...filters, type: type === 'all' ? undefined : type })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    (type === 'all' && !filters.type) || filters.type === type
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Category:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    category: filters.category === category ? undefined : category,
                  })
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filters.category === category
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {getCategoryIcon(category)}
                <span className="capitalize">{category}</span>
              </button>
            ))}
          </div>

          {/* Read Status Filter */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400">Show:</span>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.read === false}
                onChange={(e) =>
                  onFilterChange({ ...filters, read: e.target.checked ? false : undefined })
                }
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">Unread only</span>
            </label>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {filtered.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((item) => (
                <InboxItemRow
                  key={item.id}
                  item={item}
                  onMarkRead={onMarkRead}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onClick={onItemClick}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                No items found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {filters.searchQuery || filters.type || filters.category
                  ? 'Try adjusting your filters'
                  : 'Your inbox is empty'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
