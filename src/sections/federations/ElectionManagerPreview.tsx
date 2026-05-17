import { ElectionManager } from './components/ElectionManager'

export default function ElectionManagerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ElectionManager associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
