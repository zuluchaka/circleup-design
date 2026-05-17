import { CircleHealthDashboard } from './components'
import data from '@/../product/sections/analytics-and-reporting/data.json'

export default function CircleHealthDashboardPreview() {
  return (
    <CircleHealthDashboard
      metrics={data.circleHealthMetrics}
      memberContributions={data.memberContributions}
      onViewMember={(userId) => console.log('View member:', userId)}
      onSendReminder={(userId) => console.log('Send reminder to:', userId)}
      onExportReport={(format) => console.log('Export report as:', format)}
      onScheduleReport={() => console.log('Schedule report')}
    />
  )
}
