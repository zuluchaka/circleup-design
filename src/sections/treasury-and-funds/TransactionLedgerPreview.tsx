import { TransactionLedger } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { Transaction, ReportFormat } from '@/../product/sections/treasury-and-funds/types'

export default function TransactionLedgerPreview() {
  const handleFilterChange = (filters: unknown) => {
    console.log('Filter change:', filters)
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  const handleExport = (format: ReportFormat) => {
    console.log('Export as:', format)
  }

  const handleViewTransaction = (transactionId: string) => {
    console.log('View transaction:', transactionId)
  }

  return (
    <TransactionLedger
      transactions={sampleData.transactions as Transaction[]}
      onFilterChange={handleFilterChange}
      onSearch={handleSearch}
      onExport={handleExport}
      onViewTransaction={handleViewTransaction}
    />
  )
}
