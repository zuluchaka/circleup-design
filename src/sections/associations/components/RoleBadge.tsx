import type { MemberRole } from '@/../product/sections/associations/types'

interface RoleBadgeProps {
  role: MemberRole
  size?: 'sm' | 'md'
}

const roleConfig: Record<MemberRole, { label: string; className: string }> = {
  president: {
    label: 'President',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ring-amber-500/20',
  },
  treasurer: {
    label: 'Treasurer',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 ring-emerald-500/20',
  },
  secretary: {
    label: 'Secretary',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300 ring-sky-500/20',
  },
  organizer: {
    label: 'Organizer',
    className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 ring-violet-500/20',
  },
  admin: {
    label: 'Admin',
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 ring-rose-500/20',
  },
  member: {
    label: 'Member',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-500/20',
  },
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const config = roleConfig[role]

  return (
    <span
      className={`
        inline-flex items-center font-medium ring-1 ring-inset
        ${size === 'sm' ? 'px-2 py-0.5 text-xs rounded-md' : 'px-2.5 py-1 text-sm rounded-lg'}
        ${config.className}
      `}
    >
      {config.label}
    </span>
  )
}
