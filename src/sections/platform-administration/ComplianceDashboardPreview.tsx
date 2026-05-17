import { ComplianceDashboard } from './components/ComplianceDashboard'

export default function ComplianceDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ComplianceDashboard associationId="assoc-001" />
    </div>
  )
}
