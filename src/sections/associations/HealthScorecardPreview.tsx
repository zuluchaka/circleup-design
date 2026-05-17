import { HealthScorecard } from './components/HealthScorecard'

export default function HealthScorecardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <HealthScorecard associationId="assoc-001" />
    </div>
  )
}
