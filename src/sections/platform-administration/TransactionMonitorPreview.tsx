import { TransactionMonitor } from './components/TransactionMonitor'

export default function TransactionMonitorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TransactionMonitor associationId="assoc-001" />
    </div>
  )
}
