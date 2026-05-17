import { ReportsCenter } from './components/ReportsCenter'

export default function ReportsCenterPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ReportsCenter associationId="assoc-001" />
    </div>
  )
}
