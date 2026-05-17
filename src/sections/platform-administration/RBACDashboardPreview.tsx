import { RBACDashboard } from './components/RBACDashboard'

export default function RBACDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <RBACDashboard associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
