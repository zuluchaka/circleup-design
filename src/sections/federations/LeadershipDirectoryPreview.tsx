import { LeadershipDirectory } from './components/LeadershipDirectory'

export default function LeadershipDirectoryPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LeadershipDirectory associationId="assoc-001" />
    </div>
  )
}
