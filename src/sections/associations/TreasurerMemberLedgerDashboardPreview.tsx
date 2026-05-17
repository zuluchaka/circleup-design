import TreasurerMemberLedgerDashboard from './components/TreasurerMemberLedgerDashboard'

export default function TreasurerMemberLedgerDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TreasurerMemberLedgerDashboard associationId="assoc-001" />
    </div>
  )
}
