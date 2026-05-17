import type { Association } from '../types'
import { RoleBadge } from './RoleBadge'
import { AssociationTypeBadge } from './AssociationTypeBadge'

interface AssociationCardProps {
  association: Association
  onView?: () => void
  onEdit?: () => void
}

export function AssociationCard({ association, onView, onEdit }: AssociationCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <article
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700"
    >
      {/* Cover Image */}
      <div className="relative h-28 overflow-hidden">
        {association.coverImage ? (
          <img
            src={association.coverImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Unread indicator */}
        {association.hasUnreadActivity && (
          <div className="absolute top-3 right-3">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="absolute top-16 left-4">
        <div className="w-16 h-16 rounded-xl border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden bg-white dark:bg-slate-800">
          {association.logo ? (
            <img
              src={association.logo}
              alt={association.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {association.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 px-4 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {association.name}
          </h3>
          <RoleBadge role={association.myRole} />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <AssociationTypeBadge type={association.type} />
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {association.language.toUpperCase()}
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {association.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {association.memberCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Members</p>
          </div>
          <div className="text-center border-x border-slate-100 dark:border-slate-800">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {association.activeCircles}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Circles</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(association.totalFunds, association.currency)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Funds</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            View Dashboard
          </button>
          {(association.myRole === 'president' || association.myRole === 'admin') && (
            <button
              onClick={onEdit}
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
