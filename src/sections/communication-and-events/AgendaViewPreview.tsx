import AgendaView from './components/AgendaView'

export default function AgendaViewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AgendaView associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
