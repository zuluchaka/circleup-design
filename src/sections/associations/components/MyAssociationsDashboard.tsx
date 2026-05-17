import { useState } from 'react'
import type { Association, ReceivedInvitation } from '@/../product/sections/associations/types'
import { AssociationCard } from './AssociationCard'

export interface MyAssociationsDashboardProps {
  associations: Association[]
  receivedInvitations?: ReceivedInvitation[]
  onViewAssociation?: (id: string) => void
  onEditAssociation?: (id: string) => void
  onCreateAssociation?: () => void
  onDiscoverAssociations?: () => void
  onAcceptInvitation?: (id: string) => Promise<void> | void
  onDeclineInvitation?: (id: string) => Promise<void> | void
  canCreate?: boolean
}

export function MyAssociationsDashboard({
  associations,
  receivedInvitations = [],
  onViewAssociation,
  onEditAssociation,
  onCreateAssociation,
  onDiscoverAssociations,
  onAcceptInvitation,
  onDeclineInvitation,
  canCreate = false,
}: MyAssociationsDashboardProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [confirmDeclineId, setConfirmDeclineId] = useState<string | null>(null)
  // Compute summary stats
  const activeAssociations = associations.filter(a => a.status === 'active' || !a.status)
  const settingUpAssociations = associations.filter(a => a.status === 'draft')
  const inactiveAssociations = associations.filter(a => a.status === 'suspended' || a.status === 'dissolved')

  const totalMembers = associations.reduce((sum, a) => sum + a.memberCount, 0)
  const totalActiveCircles = associations.reduce((sum, a) => sum + a.activeCircles, 0)
  const leadershipRoles = associations.filter(a =>
    ['president', 'organizer', 'treasurer', 'secretary'].includes(a.myRole)
  ).length
  const totalFunds = associations.reduce((sum, a) => sum + a.totalFunds, 0)
  const primaryCurrency = associations[0]?.currency ?? 'CHF'

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                My Associations
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {associations.length} {associations.length === 1 ? 'association' : 'associations'} you belong to
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onDiscoverAssociations}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Discover
              </button>
              {canCreate && (
                <button
                  onClick={onCreateAssociation}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Association
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {associations.length === 0 && receivedInvitations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No associations yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {canCreate
                ? 'Join an existing association or create your own to start connecting with your community.'
                : 'Browse and join an existing association to start connecting with your community.'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onDiscoverAssociations}
                className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Browse Associations
              </button>
              {canCreate && (
                <button
                  onClick={onCreateAssociation}
                  className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
                >
                  Create Your Own
                </button>
              )}
            </div>
            {!canCreate && (
              <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Want to create your own association? Add a payment card in your{' '}
                <a href="/profile?tab=overview&action=add-card" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300">
                  profile settings
                </a>{' '}
                to unlock this feature.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Associations</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeAssociations.length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Members</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {totalMembers.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Circles</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {totalActiveCircles}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Leadership Roles</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {leadershipRoles}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Funds</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {formatCurrency(totalFunds, primaryCurrency)}
                </p>
              </div>
            </div>

            {/* Received Invitations Banner */}
            {receivedInvitations.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  You've been invited
                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full">
                    {receivedInvitations.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {receivedInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-800/50 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {inv.associationLogo ? (
                          <img src={inv.associationLogo} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                              {inv.associationName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {inv.associationName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Invited by {inv.invitedBy} &middot; {inv.associationMemberCount} members &middot; {inv.associationType}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Role: <span className="capitalize font-medium text-slate-600 dark:text-slate-300">{inv.role}</span>
                            {' '}&middot; {new Date(inv.invitedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 italic bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 border-l-2 border-indigo-300 dark:border-indigo-600">
                            "{inv.message || `Hey there! ${inv.invitedBy} would love for you to join ${inv.associationName}. Come be part of something great \u2014 we're building an amazing community and there's a spot just for you!`}"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {confirmDeclineId === inv.id ? (
                          <>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Decline?</span>
                            <button
                              onClick={() => setConfirmDeclineId(null)}
                              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              No
                            </button>
                            <button
                              onClick={async () => {
                                setProcessingId(inv.id)
                                setConfirmDeclineId(null)
                                await onDeclineInvitation?.(inv.id)
                                setProcessingId(null)
                              }}
                              disabled={processingId === inv.id}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Yes, decline
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setConfirmDeclineId(inv.id)}
                              disabled={processingId === inv.id}
                              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Decline
                            </button>
                            <button
                              onClick={async () => {
                                setProcessingId(inv.id)
                                await onAcceptInvitation?.(inv.id)
                                setProcessingId(null)
                              }}
                              disabled={processingId === inv.id}
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {processingId === inv.id ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              Accept
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Active Associations */}
            {activeAssociations.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeAssociations.map((association) => (
                    <AssociationCard
                      key={association.id}
                      association={association}
                      onView={() => onViewAssociation?.(association.id)}
                      onEdit={() => onEditAssociation?.(association.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Setting Up Associations */}
            {settingUpAssociations.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Setting Up
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {settingUpAssociations.map((association) => (
                    <AssociationCard
                      key={association.id}
                      association={association}
                      onView={() => onViewAssociation?.(association.id)}
                      onEdit={() => onEditAssociation?.(association.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Inactive Associations */}
            {inactiveAssociations.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Inactive
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75">
                  {inactiveAssociations.map((association) => (
                    <AssociationCard
                      key={association.id}
                      association={association}
                      onView={() => onViewAssociation?.(association.id)}
                      onEdit={() => onEditAssociation?.(association.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
