import { AssociationDashboard } from './components'
import data from '@/../product/sections/analytics-and-reporting/data.json'

export default function AssociationDashboardPreview() {
  return (
    <AssociationDashboard
      metrics={data.associationMetrics}
      onViewCircle={(circleId) => console.log('View circle:', circleId)}
      onExportReport={(format) => console.log('Export report as:', format)}
      onViewAtRiskCircles={() => console.log('View at-risk circles')}
    />
  )
}
