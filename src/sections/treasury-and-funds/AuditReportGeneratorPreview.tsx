import { AuditReportGenerator } from './components/AuditReportGenerator'

export default function AuditReportGeneratorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AuditReportGenerator associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
