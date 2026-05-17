import { PayoutSchedule } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, PayoutScheduleEntry } from '@/../product/sections/rosca-circles/types'

export default function PayoutSchedulePreview() {
  const circle = sampleData.circles[0] as Circle

  const handleRequestSwap = (targetParticipantId: string) => {
    console.log('Request swap with:', targetParticipantId)
  }

  const handleExportCalendar = () => {
    console.log('Export calendar')
  }

  return (
    <PayoutSchedule
      circle={circle}
      schedule={sampleData.payoutSchedule as PayoutScheduleEntry[]}
      currentUserId="user-1"
      onRequestSwap={handleRequestSwap}
      onExportCalendar={handleExportCalendar}
    />
  )
}
