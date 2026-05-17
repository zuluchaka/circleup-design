import { AssociationLedgerDashboard } from './components/AssociationLedgerDashboard'

export default function AssociationLedgerDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AssociationLedgerDashboard
        associationId="assoc-001"
        onNavigate={(view: string) => console.log('Navigate:', view)}
        subscriptionTier="basic"
        subscriptionCurrency="CHF"
        subscriptionPaidUntil="2026-12-31"
        recentBillingRecords={[]}
        onSubscriptionPaid={() => console.log('Subscription paid')}
      />
    </div>
  )
}
