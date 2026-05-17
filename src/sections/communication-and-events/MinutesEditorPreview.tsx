import MinutesEditor from './components/MinutesEditor'

export default function MinutesEditorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MinutesEditor associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
