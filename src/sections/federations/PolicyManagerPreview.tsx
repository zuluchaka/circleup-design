import { PolicyManager } from './components/PolicyManager'

export default function PolicyManagerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PolicyManager associationId="assoc-001" />
    </div>
  )
}
