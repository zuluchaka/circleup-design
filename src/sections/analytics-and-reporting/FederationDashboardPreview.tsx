import { FederationDashboard } from './components'
import data from '@/../product/sections/analytics-and-reporting/data.json'

export default function FederationDashboardPreview() {
  return (
    <FederationDashboard
      metrics={data.federationMetrics}
      benchmarks={data.associationBenchmarks}
      onViewAssociation={(associationId) => console.log('View association:', associationId)}
      onExportReport={(format) => console.log('Export report as:', format)}
      onViewComplianceDetails={() => console.log('View compliance details')}
    />
  )
}
