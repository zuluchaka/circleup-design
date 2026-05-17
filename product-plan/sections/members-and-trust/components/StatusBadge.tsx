import type { MemberStatus } from '../types'

interface StatusBadgeProps {
  status: MemberStatus
}

const statusConfig: Record<MemberStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50'
  },
  pending: {
    label: 'Pending',
    className: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50'
  },
  suspended: {
    label: 'Suspended',
    className: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50'
  },
  removed: {
    label: 'Removed',
    className: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center rounded-full text-xs font-medium px-2 py-0.5 ${config.className}`}>
      {config.label}
    </span>
  )
}
