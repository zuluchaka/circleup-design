import { CircleCycleProgress } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, CycleProgressData } from '@/../product/sections/rosca-circles/types'

export default function CircleCycleProgressPreview() {
  const circle = sampleData.circles[0] as Circle
  const data = sampleData.cycleProgress as CycleProgressData

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <CircleCycleProgress
          data={data}
          circle={circle}
          isOrganizer={true}
          onTriggerPayout={() => console.log('Trigger payout')}
          onRetryPayment={(memberId) => console.log('Retry payment:', memberId)}
        />
      </div>
    </div>
  )
}
