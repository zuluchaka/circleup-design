import data from '@/../product/sections/federations/data.json'
import type { DuesConfig, FederationBudget, CashFlowEntry } from '@/../product/sections/federations/types'
import { FederationDashboard } from './components/FederationDashboard'

export default function FederationDashboardPreview() {
  // Use the first federation (Swiss African Diaspora Federation) for the preview
  const federation = data.federations[0]
  const fedId = federation.id

  // Filter all entities by federationId
  const childAssociations = data.childAssociations.filter((a) => a.federationId === fedId)
  const leaders = data.leaders.filter((l) => l.federationId === fedId)
  const policies = data.policies.filter((p) => p.federationId === fedId)
  const funds = data.funds.filter((f) => f.federationId === fedId)
  const duesConfig = data.duesConfigs.find((d) => d.federationId === fedId) as unknown as DuesConfig
  const duesInvoices = data.duesInvoices.filter((i) => i.federationId === fedId)
  const budget = data.budgets.find((b) => b.federationId === fedId) as unknown as FederationBudget
  const transfers = data.transfers.filter((t) => t.federationId === fedId)
  const elections = data.elections.filter((e) => e.federationId === fedId)
  const candidates = data.candidates.filter((c) => c.federationId === fedId)
  const events = data.events.filter((e) => e.federationId === fedId)
  const announcements = data.announcements.filter((a) => a.federationId === fedId)
  const reports = data.reports.filter((r) => r.federationId === fedId)
  const alerts = data.alerts.filter((a) => a.federationId === fedId)
  const aggregatedMembers = data.aggregatedMembers.filter((m) => m.federationId === fedId)
  const complianceItems = data.complianceItems.filter((c) => c.federationId === fedId)
  const cashFlowHistory = (data.cashFlowHistories.find((h) => h.federationId === fedId)?.entries || []) as CashFlowEntry[]

  return (
    <FederationDashboard
      federation={federation}
      childAssociations={childAssociations}
      leaders={leaders}
      funds={funds}
      alerts={alerts}
      announcements={announcements}
      events={events}
      cashFlowHistory={cashFlowHistory}
      policies={policies}
      duesInvoices={duesInvoices}
      duesConfig={duesConfig}
      budget={budget}
      transfers={transfers}
      elections={elections}
      candidates={candidates}
      reports={reports}
      aggregatedMembers={aggregatedMembers}
      complianceItems={complianceItems}
      onViewAssociation={(id) => console.log('View association:', id)}
      onCompareAssociations={(ids) => console.log('Compare associations:', ids)}
      onAddAssociation={() => console.log('Add association')}
      onUnlinkAssociation={(id) => console.log('Unlink association:', id)}
      onAcknowledgeAlert={(id) => console.log('Acknowledge alert:', id)}
      onCreatePolicy={() => console.log('Create policy')}
      onEditPolicy={(id) => console.log('Edit policy:', id)}
      onAssignRole={() => console.log('Assign role')}
      onTransferRole={(id) => console.log('Transfer role:', id)}
      onConfigureDues={() => console.log('Configure dues')}
      onCreateTransfer={() => console.log('Create transfer')}
      onApproveTransfer={(id) => console.log('Approve transfer:', id)}
      onCreateElection={() => console.log('Create election')}
      onCreateEvent={() => console.log('Create event')}
      onCreateAnnouncement={() => console.log('Create announcement')}
      onGenerateReport={(type) => console.log('Generate report:', type)}
      onScheduleReport={(type) => console.log('Schedule report:', type)}
      onExportMembers={(format) => console.log('Export members:', format)}
      onSearchMember={(query) => console.log('Search member:', query)}
      onCreateBudget={() => console.log('Create budget')}
      onEditFederation={() => console.log('Edit federation')}
    />
  )
}
