import data from '@/../product/sections/ai-insights/data.json'
import { FraudAnalytics } from './components/FraudAnalytics'

export default function FraudAnalyticsPreview() {
  return (
    <FraudAnalytics
      fraudAlerts={data.fraudAlerts}
      behaviorClusters={data.behaviorClusters}
      onInvestigateAlert={(id) => console.log('Investigate alert:', id)}
      onResolveAlert={(id, resolution) => console.log('Resolve alert:', id, resolution)}
      onEscalateAlert={(id, team) => console.log('Escalate alert:', id, team)}
      onViewClusterDetails={(id) => console.log('View cluster details:', id)}
      onExportClusterData={(id) => console.log('Export cluster data:', id)}
    />
  )
}
