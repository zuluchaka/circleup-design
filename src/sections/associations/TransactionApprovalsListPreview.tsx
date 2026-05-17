import { TransactionApprovalsList } from './components/TransactionApprovalsList'

export default function TransactionApprovalsListPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TransactionApprovalsList associationId="assoc-001" />
    </div>
  )
}
