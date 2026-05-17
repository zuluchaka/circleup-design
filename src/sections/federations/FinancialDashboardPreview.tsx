import { FinancialDashboard } from './components/FinancialDashboard'

export default function FinancialDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <FinancialDashboard associationId="assoc-001" />
    </div>
  )
}
