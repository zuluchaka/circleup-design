import { ProspectingDashboard } from './components/ProspectingDashboard'

export default function ProspectingDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ProspectingDashboard associationId="assoc-001" />
    </div>
  )
}
