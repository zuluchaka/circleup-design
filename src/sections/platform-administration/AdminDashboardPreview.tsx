import { AdminDashboard } from './components/AdminDashboard'

export default function AdminDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminDashboard associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
