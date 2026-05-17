import { CircleFundDetail } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { Fund, Transaction, ReportFormat } from '@/../product/sections/treasury-and-funds/types'

export default function CircleFundDetailPreview() {
  const fund = sampleData.funds[0] as Fund
  const transactions = (sampleData.transactions as Transaction[]).filter(
    (t) => t.fundId === fund.id
  )

  const handleFilterTransactions = (filters: unknown) => {
    console.log('Filter transactions:', filters)
  }

  const handleExportStatement = (format: ReportFormat) => {
    console.log('Export statement as:', format)
  }

  const handleBack = () => {
    console.log('Navigate back')
  }

  return (
    <CircleFundDetail
      fund={fund}
      transactions={transactions}
      onFilterTransactions={handleFilterTransactions}
      onExportStatement={handleExportStatement}
      onBack={handleBack}
    />
  )
}
