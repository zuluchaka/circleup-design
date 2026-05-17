import { AttendeeTracker } from './components/AttendeeTracker'

export default function AttendeeTrackerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AttendeeTracker associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
