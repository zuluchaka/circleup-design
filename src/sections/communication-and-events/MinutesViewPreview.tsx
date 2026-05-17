import MinutesView from './components/MinutesView'

export default function MinutesViewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MinutesView associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
