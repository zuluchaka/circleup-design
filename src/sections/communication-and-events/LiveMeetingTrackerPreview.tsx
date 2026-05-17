import LiveMeetingTracker from './components/LiveMeetingTracker'

export default function LiveMeetingTrackerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LiveMeetingTracker associationId="assoc-001" />
    </div>
  )
}
