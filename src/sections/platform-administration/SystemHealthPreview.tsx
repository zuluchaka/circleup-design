import { SystemHealth } from './components/SystemHealth'

export default function SystemHealthPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SystemHealth associationId="assoc-001" />
    </div>
  )
}
