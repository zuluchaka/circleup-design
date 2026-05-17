import { AdminEventsOverview } from './components/AdminEventsOverview'

export default function AdminEventsOverviewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminEventsOverview associationId="assoc-001" />
    </div>
  )
}
