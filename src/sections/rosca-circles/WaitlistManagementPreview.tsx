import { WaitlistManagement } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, WaitlistEntry } from '@/../product/sections/rosca-circles/types'

export default function WaitlistManagementPreview() {
  const circle = sampleData.circles[0] as Circle

  const handlePromote = (entryId: string) => {
    console.log('Promote:', entryId)
  }

  const handleRemove = (entryId: string) => {
    console.log('Remove from waitlist:', entryId)
  }

  const handleNotify = (entryId: string) => {
    console.log('Notify:', entryId)
  }

  const handleReorder = (entryId: string, newPosition: number) => {
    console.log('Reorder:', { entryId, newPosition })
  }

  return (
    <WaitlistManagement
      circle={circle}
      waitlist={sampleData.waitlist as WaitlistEntry[]}
      onPromote={handlePromote}
      onRemove={handleRemove}
      onNotify={handleNotify}
      onReorder={handleReorder}
    />
  )
}
