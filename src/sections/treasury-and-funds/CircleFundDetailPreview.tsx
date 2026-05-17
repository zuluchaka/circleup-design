import { CircleFundDetail } from './components/CircleFundDetail'

export default function CircleFundDetailPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CircleFundDetail associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
