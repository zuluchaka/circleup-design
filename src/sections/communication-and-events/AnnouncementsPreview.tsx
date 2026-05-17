import { Announcements } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function AnnouncementsPreview() {
  return (
    <Announcements
      announcements={data.announcements as any}
      onAcknowledge={() => {}}
      onView={() => {}}
    />
  )
}
