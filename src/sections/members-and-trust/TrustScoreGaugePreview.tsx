import { TrustScoreGauge } from './components/TrustScoreGauge'

export default function TrustScoreGaugePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TrustScoreGauge associationId="assoc-001" />
    </div>
  )
}
