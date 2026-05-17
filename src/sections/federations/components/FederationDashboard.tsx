import { useState } from 'react'
import type { JSX } from 'react'
import type { FederationDashboardProps } from '@/../product/sections/federations/types'
import { StatsRow } from './StatsRow'
import { AlertPanel } from './AlertPanel'
import { AssociationCards } from './AssociationCards'
import { LeadershipDirectory } from './LeadershipDirectory'
import { PolicyManager } from './PolicyManager'
import { FinancialDashboard } from './FinancialDashboard'
import { MemberDirectory } from './MemberDirectory'
import { ElectionManager } from './ElectionManager'
import { EventsAnnouncements } from './EventsAnnouncements'
import { ReportsCenter } from './ReportsCenter'

type TabId = 'overview' | 'associations' | 'leadership' | 'governance' | 'finance' | 'members' | 'elections' | 'events' | 'reports'

interface TabDef {
  id: TabId
  label: string
  shortLabel: string
  icon: JSX.Element
}

const tabs: TabDef[] = [
  {
    id: 'overview',
    label: 'Overview',
    shortLabel: 'Overview',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    id: 'associations',
    label: 'Associations',
    shortLabel: 'Assoc.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    id: 'leadership',
    label: 'Leadership',
    shortLabel: 'Leaders',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    id: 'governance',
    label: 'Governance',
    shortLabel: 'Gov.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" />
      </svg>
    ),
  },
  {
    id: 'finance',
    label: 'Finance',
    shortLabel: 'Finance',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    id: 'members',
    label: 'Members',
    shortLabel: 'Members',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    id: 'elections',
    label: 'Elections',
    shortLabel: 'Elections',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'Events',
    shortLabel: 'Events',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    shortLabel: 'Reports',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
]

export function FederationDashboard({
  federation,
  childAssociations,
  leaders,
  funds,
  alerts,
  announcements,
  events,
  cashFlowHistory,
  policies,
  duesInvoices,
  duesConfig,
  budget,
  transfers,
  elections,
  candidates,
  reports,
  aggregatedMembers,
  complianceItems,
  onViewAssociation,
  onCompareAssociations,
  onAddAssociation,
  onUnlinkAssociation,
  onAcknowledgeAlert,
  onCreatePolicy,
  onEditPolicy,
  onAssignRole,
  onTransferRole,
  onConfigureDues,
  onCreateTransfer,
  onApproveTransfer,
  onCreateElection,
  onCreateEvent,
  onCreateAnnouncement,
  onGenerateReport,
  onScheduleReport,
  onExportMembers,
  onSearchMember,
  onCreateBudget,
  onEditFederation,
}: FederationDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start gap-4">
            <img
              src={federation.logo}
              alt={federation.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white/20 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{federation.name}</h1>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  federation.status === 'active'
                    ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                    : federation.status === 'forming'
                    ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
                    : 'bg-red-400/20 text-red-200 border border-red-400/30'
                }`}>
                  {federation.status}
                </span>
              </div>
              <p className="text-sm text-indigo-200 mt-1 line-clamp-1">{federation.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-indigo-300">
                <span>Founded {new Date(federation.foundedAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
                <span className="capitalize">{federation.governanceType} governance</span>
                <button
                  onClick={onEditFederation}
                  className="text-indigo-200 hover:text-white transition-colors underline underline-offset-2"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 lg:top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-0 overflow-x-auto scrollbar-none -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {tab.id === 'overview' && unacknowledgedAlerts > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {unacknowledgedAlerts}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StatsRow federation={federation} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AssociationCards
                  associations={childAssociations.slice(0, 6)}
                  onViewAssociation={onViewAssociation}
                  onCompareAssociations={onCompareAssociations}
                  onAddAssociation={onAddAssociation}
                  onUnlinkAssociation={onUnlinkAssociation}
                />
              </div>
              <div className="space-y-6">
                <AlertPanel alerts={alerts} onAcknowledgeAlert={onAcknowledgeAlert} />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Upcoming Events</h3>
                  {events.filter((e) => e.status === 'upcoming').slice(0, 3).map((evt) => (
                    <div key={evt.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{evt.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(evt.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })} &middot; {evt.location}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Latest Announcements</h3>
                  {announcements.slice(0, 2).map((ann) => (
                    <div key={ann.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[7px] font-bold uppercase px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">Fed</span>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{ann.title}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'associations' && (
          <AssociationCards
            associations={childAssociations}
            onViewAssociation={onViewAssociation}
            onCompareAssociations={onCompareAssociations}
            onAddAssociation={onAddAssociation}
            onUnlinkAssociation={onUnlinkAssociation}
          />
        )}

        {activeTab === 'leadership' && (
          <LeadershipDirectory leaders={leaders} onAssignRole={onAssignRole} onTransferRole={onTransferRole} />
        )}

        {activeTab === 'governance' && (
          <PolicyManager
            policies={policies}
            complianceItems={complianceItems}
            onCreatePolicy={onCreatePolicy}
            onEditPolicy={onEditPolicy}
          />
        )}

        {activeTab === 'finance' && (
          <FinancialDashboard
            funds={funds}
            duesConfig={duesConfig}
            duesInvoices={duesInvoices}
            budget={budget}
            transfers={transfers}
            cashFlowHistory={cashFlowHistory}
            currency={federation.currency}
            onConfigureDues={onConfigureDues}
            onCreateTransfer={onCreateTransfer}
            onApproveTransfer={onApproveTransfer}
            onCreateBudget={onCreateBudget}
          />
        )}

        {activeTab === 'members' && (
          <MemberDirectory
            members={aggregatedMembers}
            onExportMembers={onExportMembers}
            onSearchMember={onSearchMember}
          />
        )}

        {activeTab === 'elections' && (
          <ElectionManager elections={elections} candidates={candidates} onCreateElection={onCreateElection} />
        )}

        {activeTab === 'events' && (
          <EventsAnnouncements
            events={events}
            announcements={announcements}
            onCreateEvent={onCreateEvent}
            onCreateAnnouncement={onCreateAnnouncement}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsCenter reports={reports} onGenerateReport={onGenerateReport} onScheduleReport={onScheduleReport} />
        )}
      </div>
    </div>
  )
}
