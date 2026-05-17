import { EventsAnnouncements } from './components/EventsAnnouncements'

export default function EventsAnnouncementsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <EventsAnnouncements associationId="assoc-001" />
    </div>
  )
}
