import data from '@/../product/sections/federations/data.json'
import type { FederationBudget, CashFlowHistory } from '@/../product/sections/federations/types'
import { FederationOverview } from './components/FederationOverview'

export default function FederationOverviewPreview() {
  return (
    <FederationOverview
      federations={data.federations}
      childAssociations={data.childAssociations}
      leaders={data.leaders}
      funds={data.funds}
      alerts={data.alerts}
      announcements={data.announcements}
      events={data.events}
      cashFlowHistories={data.cashFlowHistories as unknown as CashFlowHistory[]}
      policies={data.policies}
      duesInvoices={data.duesInvoices}
      budgets={data.budgets as unknown as FederationBudget[]}
      transfers={data.transfers}
      elections={data.elections}
      reports={data.reports}
      aggregatedMembers={data.aggregatedMembers}
      complianceItems={data.complianceItems}
      onSelectFederation={(id) => console.log('Select federation:', id)}
      onCreateFederation={() => console.log('Create federation')}
      onAcknowledgeAlert={(id) => console.log('Acknowledge alert:', id)}
      onGenerateReport={(type) => console.log('Generate report:', type)}
    />
  )
}
