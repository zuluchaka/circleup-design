import { LedgerReportViewer } from './components/LedgerReportViewer'

export default function LedgerReportViewerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LedgerReportViewer associationId="assoc-001" />
    </div>
  )
}
