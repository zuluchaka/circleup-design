import { ConsolidatedCalendar } from './components/ConsolidatedCalendar'

export default function ConsolidatedCalendarPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ConsolidatedCalendar associationId="assoc-001" />
    </div>
  )
}
