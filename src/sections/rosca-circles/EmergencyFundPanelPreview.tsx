import { EmergencyFundPanel } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, EmergencyFundIntervention } from '@/../product/sections/rosca-circles/types'

export default function EmergencyFundPanelPreview() {
  const circle = sampleData.circles[0] as Circle

  const handleMakeRepayment = (interventionId: string, amount: number) => {
    console.log('Make repayment:', { interventionId, amount })
  }

  const handleViewDetails = (interventionId: string) => {
    console.log('View intervention details:', interventionId)
  }

  return (
    <EmergencyFundPanel
      circle={circle}
      interventions={sampleData.emergencyFundInterventions as EmergencyFundIntervention[]}
      currentUserId="user-1"
      onMakeRepayment={handleMakeRepayment}
      onViewDetails={handleViewDetails}
    />
  )
}
