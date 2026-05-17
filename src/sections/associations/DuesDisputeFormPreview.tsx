import { DuesDisputeForm } from './components/DuesDisputeForm'

export default function DuesDisputeFormPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DuesDisputeForm associationId="assoc-001" isTreasurer={true} />
    </div>
  )
}
