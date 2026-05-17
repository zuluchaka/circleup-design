import type { MemberRole } from '@/../product/sections/members-and-trust/types'
import { Crown, Landmark, FileText, Shield, User } from 'lucide-react'

interface RoleBadgeProps {
  role: MemberRole
  size?: 'sm' | 'md'
}

const roleConfig: Record<MemberRole, { label: string; icon: React.ReactNode; className: string }> = {
  president: {
    label: 'President',
    icon: <Crown className="w-3 h-3" />,
    className: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50'
  },
  treasurer: {
    label: 'Treasurer',
    icon: <Landmark className="w-3 h-3" />,
    className: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50'
  },
  secretary: {
    label: 'Secretary',
    icon: <FileText className="w-3 h-3" />,
    className: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50'
  },
  organizer: {
    label: 'Organizer',
    icon: <Shield className="w-3 h-3" />,
    className: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50'
  },
  member: {
    label: 'Member',
    icon: <User className="w-3 h-3" />,
    className: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
  }
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const config = roleConfig[role] ?? roleConfig.member
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-1 gap-1.5'

  return (
    <span className={`inline-flex items-center rounded-md font-medium ${config.className} ${sizeClasses}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  )
}
