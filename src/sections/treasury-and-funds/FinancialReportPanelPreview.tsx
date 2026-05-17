import FinancialReportPanel from './components/FinancialReportPanel'

export default function FinancialReportPanelPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <FinancialReportPanel associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
