import { AtRiskMembers } from './components/AtRiskMembers'

export default function AtRiskMembersPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AtRiskMembers associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
