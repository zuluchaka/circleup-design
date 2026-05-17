import { TransactionLedger } from './components/TransactionLedger'

export default function TransactionLedgerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TransactionLedger associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
