import { FinancialOverview } from './components/FinancialOverview'

export default function FinancialOverviewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <FinancialOverview
        associationId="assoc-001"
        onNavigate={(view: string) => console.log('Navigate:', view)}
      />
    </div>
  )
}
