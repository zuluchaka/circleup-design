import { TreasurerDashboard } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, TreasurerDashboard as TreasurerDashboardType } from '@/../product/sections/rosca-circles/types'

export default function TreasurerDashboardPreview() {
  const circle = sampleData.circles[0] as Circle

  const handleExportReport = (format: 'pdf' | 'csv') => {
    console.log('Export report:', format)
  }

  const handleViewTransaction = (id: string) => {
    console.log('View transaction:', id)
  }

  return (
    <TreasurerDashboard
      dashboard={sampleData.treasurerDashboard as TreasurerDashboardType}
      circle={circle}
      onExportReport={handleExportReport}
      onViewTransaction={handleViewTransaction}
    />
  )
}
