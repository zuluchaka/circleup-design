import { TreasuryDashboard } from './components/TreasuryDashboard'

export default function TreasuryDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TreasuryDashboard associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
