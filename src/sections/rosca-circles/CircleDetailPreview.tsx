import { CircleDetail } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type {
  Circle,
  Participant,
  PayoutScheduleEntry,
  Contribution,
  EmergencyFundIntervention,
} from '@/../product/sections/rosca-circles/types'

export default function CircleDetailPreview() {
  const circle = sampleData.circles[0] as Circle
  const participants = sampleData.participants.filter(
    (p) => p.circleId === circle.id
  ) as Participant[]

  const handleMakeContribution = () => {
    console.log('Make contribution')
  }

  const handleViewParticipant = (id: string) => {
    console.log('View participant:', id)
  }

  const handleInviteMembers = () => {
    console.log('Invite members')
  }

  const handleManageCircle = () => {
    console.log('Manage circle')
  }

  const handleExportCalendar = () => {
    console.log('Export calendar')
  }

  return (
    <CircleDetail
      circle={circle}
      participants={participants}
      payoutSchedule={sampleData.payoutSchedule as PayoutScheduleEntry[]}
      contributions={sampleData.contributions as Contribution[]}
      emergencyFundInterventions={sampleData.emergencyFundInterventions as EmergencyFundIntervention[]}
      currentUserId="user-1"
      currentUserRole="organizer"
      onMakeContribution={handleMakeContribution}
      onViewParticipant={handleViewParticipant}
      onInviteMembers={handleInviteMembers}
      onManageCircle={handleManageCircle}
      onExportCalendar={handleExportCalendar}
    />
  )
}
