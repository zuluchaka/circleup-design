import { CircleDiscovery } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, CircleRecommendation, CircleFilters } from '@/../product/sections/rosca-circles/types'

export default function CircleDiscoveryPreview() {
  const handleViewCircle = (id: string) => {
    console.log('View circle:', id)
  }

  const handleJoinCircle = (id: string) => {
    console.log('Join circle:', id)
  }

  const handleJoinWaitlist = (id: string) => {
    console.log('Join waitlist:', id)
  }

  const handleFilter = (filters: CircleFilters) => {
    console.log('Apply filters:', filters)
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  return (
    <CircleDiscovery
      circles={sampleData.circles as Circle[]}
      recommendations={sampleData.circleRecommendations as CircleRecommendation[]}
      onViewCircle={handleViewCircle}
      onJoinCircle={handleJoinCircle}
      onJoinWaitlist={handleJoinWaitlist}
      onFilter={handleFilter}
      onSearch={handleSearch}
    />
  )
}
