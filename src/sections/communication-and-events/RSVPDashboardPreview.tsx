import RSVPDashboard from './components/RSVPDashboard'

export default function RSVPDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <RSVPDashboard associationId="assoc-001" />
    </div>
  )
}
