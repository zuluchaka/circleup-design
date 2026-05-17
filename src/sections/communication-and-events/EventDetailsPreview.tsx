import { EventDetails } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function EventDetailsPreview() {
  const event = data.events[0] as any
  const registration = data.eventRegistrations.find((r: any) => r.eventId === event.id) as any
  const attendees = data.eventRegistrations.filter((r: any) => r.eventId === event.id) as any

  return (
    <EventDetails
      event={event}
      registration={registration}
      attendees={attendees}
      currentUserId="user-001"
      onRegister={() => {}}
      onUpdateRSVP={() => {}}
      onCancelRegistration={() => {}}
      onShare={() => {}}
      onAddToCalendar={() => {}}
    />
  )
}
