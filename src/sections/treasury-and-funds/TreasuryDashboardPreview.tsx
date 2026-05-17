import { TreasuryDashboard } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { Fund, Transaction, DashboardSummary } from '@/../product/sections/treasury-and-funds/types'

export default function TreasuryDashboardPreview() {
  const handleViewFund = (fundId: string) => {
    console.log('View fund:', fundId)
  }

  const handleTransfer = () => {
    console.log('Initiate transfer')
  }

  const handleReconcile = () => {
    console.log('Open reconciliation')
  }

  const handleGenerateReport = () => {
    console.log('Generate report')
  }

  return (
    <TreasuryDashboard
      summary={sampleData.dashboardSummary as DashboardSummary}
      funds={sampleData.funds as Fund[]}
      recentTransactions={sampleData.transactions as Transaction[]}
      onViewFund={handleViewFund}
      onTransfer={handleTransfer}
      onReconcile={handleReconcile}
      onGenerateReport={handleGenerateReport}
    />
  )
}
