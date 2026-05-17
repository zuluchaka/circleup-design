import { CircleAnalyticsDashboard } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type {
  CircleHealthMetrics,
  MemberReliability,
  RiskAlert,
} from '@/../product/sections/rosca-circles/types'

export default function CircleAnalyticsDashboardPreview() {
  const metrics = sampleData.healthMetrics as CircleHealthMetrics
  const memberReliability = sampleData.memberReliability as MemberReliability[]
  const riskAlerts = sampleData.riskAlerts as RiskAlert[]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <CircleAnalyticsDashboard
          metrics={metrics}
          memberReliability={memberReliability}
          riskAlerts={riskAlerts}
          onBack={() => console.log('Back')}
          onExport={(format) => console.log('Export:', format)}
        />
      </div>
    </div>
  )
}
