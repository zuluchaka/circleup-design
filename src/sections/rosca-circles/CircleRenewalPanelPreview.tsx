import { CircleRenewalPanel } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, CircleRenewal } from '@/../product/sections/rosca-circles/types'

export default function CircleRenewalPanelPreview() {
  const circle = sampleData.circles[0] as Circle
  const renewals = (sampleData.renewals || []).filter(
    (r) => r.circleId === circle.id
  ) as CircleRenewal[]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <CircleRenewalPanel
          circle={circle}
          renewals={renewals}
          isOrganizer={true}
          currentUserId="user-001"
          onPropose={(form) => console.log('Propose renewal:', form)}
          onVote={(id, vote, reason) => console.log('Vote:', id, vote, reason)}
          onStartVoting={(id) => console.log('Start voting:', id)}
          onCreateCircle={(id) => console.log('Create renewed circle:', id)}
          onCancel={(id) => console.log('Cancel renewal:', id)}
        />
      </div>
    </div>
  )
}
