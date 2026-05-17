import QuorumIndicator from './components/QuorumIndicator'

export default function QuorumIndicatorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <QuorumIndicator associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
