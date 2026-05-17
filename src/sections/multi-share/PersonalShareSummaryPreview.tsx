import { PersonalShareSummary } from './components/PersonalShareSummary'

export default function PersonalShareSummaryPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PersonalShareSummary associationId="assoc-001" />
    </div>
  )
}
