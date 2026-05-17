import { ShareHistoryTimeline } from './components/ShareHistoryTimeline'

export default function ShareHistoryTimelinePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ShareHistoryTimeline associationId="assoc-001" />
    </div>
  )
}
