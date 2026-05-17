import { PlatformAdminDashboard } from './components/PlatformAdminDashboard'

export default function PlatformAdminDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PlatformAdminDashboard associationId="assoc-001" />
    </div>
  )
}
