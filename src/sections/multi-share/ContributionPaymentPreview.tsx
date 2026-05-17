import { ContributionPayment } from './components/ContributionPayment'

export default function ContributionPaymentPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ContributionPayment associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
