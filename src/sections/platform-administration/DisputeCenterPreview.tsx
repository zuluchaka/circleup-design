import { DisputeCenter } from './components/DisputeCenter'

export default function DisputeCenterPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DisputeCenter associationId="assoc-001" />
    </div>
  )
}
