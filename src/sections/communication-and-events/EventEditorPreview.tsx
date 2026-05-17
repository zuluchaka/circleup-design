import { EventEditor } from './components/EventEditor'

export default function EventEditorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <EventEditor associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
