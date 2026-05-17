import PastEventsView from './components/PastEventsView'

export default function PastEventsViewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PastEventsView associationId="assoc-001" />
    </div>
  )
}
