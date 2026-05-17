import type { AssociationType } from '../types'

interface AssociationTypeBadgeProps {
  type: AssociationType
}

const typeConfig: Record<AssociationType, { label: string; icon: string }> = {
  cultural: { label: 'Cultural', icon: '🎭' },
  religious: { label: 'Religious', icon: '🕊️' },
  professional: { label: 'Professional', icon: '💼' },
  savings: { label: 'Savings', icon: '💰' },
  social: { label: 'Social', icon: '🤝' },
  family: { label: 'Family', icon: '👨‍👩‍👧‍👦' },
}

export function AssociationTypeBadge({ type }: AssociationTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full">
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
