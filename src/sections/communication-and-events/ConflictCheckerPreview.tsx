import { ConflictChecker } from './components/ConflictChecker'

export default function ConflictCheckerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ConflictChecker associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
