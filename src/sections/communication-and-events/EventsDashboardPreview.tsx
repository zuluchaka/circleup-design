import { EventsDashboard } from './components/EventsDashboard'

export default function EventsDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <EventsDashboard associationId="assoc-001" />
    </div>
  )
}
