import { EventTranslationEditor } from './components/EventTranslationEditor'

export default function EventTranslationEditorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <EventTranslationEditor associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
