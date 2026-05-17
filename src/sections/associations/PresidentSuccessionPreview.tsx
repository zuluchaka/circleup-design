import { PresidentSuccession } from './components/PresidentSuccession'

export default function PresidentSuccessionPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PresidentSuccession associationId="assoc-001" currentUserId="user-001" />
    </div>
  )
}
