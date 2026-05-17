import { MyCirclesDashboard } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, Participant } from '@/../product/sections/rosca-circles/types'

export default function MyCirclesDashboardPreview() {
  const handleViewCircle = (id: string) => {
    console.log('View circle:', id)
  }

  const handleMakeContribution = (circleId: string) => {
    console.log('Make contribution for circle:', circleId)
  }

  const handleCreate = () => {
    console.log('Create new circle')
  }

  return (
    <MyCirclesDashboard
      circles={sampleData.circles as Circle[]}
      participations={sampleData.participants as Participant[]}
      onViewCircle={handleViewCircle}
      onMakeContribution={handleMakeContribution}
      onCreate={handleCreate}
    />
  )
}
