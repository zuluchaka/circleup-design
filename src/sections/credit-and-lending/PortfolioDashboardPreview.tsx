import { PortfolioDashboard } from './components'
import data from '@/../product/sections/credit-and-lending/data.json'

export default function PortfolioDashboardPreview() {
  return (
    <PortfolioDashboard
      metrics={data.portfolioMetrics}
      onViewCollectionItem={(itemId) => console.log('View collection item:', itemId)}
      onCollectionAction={(itemId, action) => console.log('Collection action:', itemId, action)}
      onViewWarningDetails={(warningId) => console.log('View warning details:', warningId)}
      onExportReport={(format) => console.log('Export report:', format)}
    />
  )
}
