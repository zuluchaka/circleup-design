import { CircleAccountDashboard } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { AccountDashboard } from '@/../product/sections/rosca-circles/types'

export default function CircleAccountDashboardPreview() {
  const dashboard = sampleData.accountDashboard as AccountDashboard

  return (
    <CircleAccountDashboard
      dashboard={dashboard}
      onBack={() => console.log('Back')}
      onExport={(format) => console.log('Export:', format)}
    />
  )
}
