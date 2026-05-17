import { CircleEventManager } from './components/CircleEventManager'

export default function CircleEventManagerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CircleEventManager associationId="assoc-001" />
    </div>
  )
}
