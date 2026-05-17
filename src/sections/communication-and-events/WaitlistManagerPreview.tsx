import { WaitlistManager } from './components/WaitlistManager'

export default function WaitlistManagerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <WaitlistManager associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
