import { CircleDashboard } from './components/CircleDashboard'

export default function CircleDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CircleDashboard associationId="assoc-001" />
    </div>
  )
}
