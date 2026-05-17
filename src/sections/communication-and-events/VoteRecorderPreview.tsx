import { VoteRecorder } from './components/VoteRecorder'

export default function VoteRecorderPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <VoteRecorder associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
