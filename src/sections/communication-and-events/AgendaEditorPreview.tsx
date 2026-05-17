import AgendaEditor from './components/AgendaEditor'

export default function AgendaEditorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AgendaEditor associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
