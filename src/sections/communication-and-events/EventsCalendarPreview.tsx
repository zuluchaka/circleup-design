import { EventsCalendar } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function EventsCalendarPreview() {
  // Use January 2025 to match the sample data dates
  const selectedDate = new Date('2025-01-15').toISOString()

  return (
    <EventsCalendar
      events={data.events as any}
      view="month"
      selectedDate={selectedDate}
      onViewChange={() => {}}
      onDateChange={() => {}}
      onEventClick={() => {}}
      onCreateEvent={() => {}}
    />
  )
}
