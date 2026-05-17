import { OrganizerPerformance } from './components/OrganizerPerformance'

export default function OrganizerPerformancePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <OrganizerPerformance associationId="assoc-001" />
    </div>
  )
}
