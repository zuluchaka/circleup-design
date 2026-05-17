import { ReconciliationConsole } from './components/ReconciliationConsole'

export default function ReconciliationConsolePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ReconciliationConsole associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
