import { FeatureFlags } from './components/FeatureFlags'

export default function FeatureFlagsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <FeatureFlags associationId="assoc-001" />
    </div>
  )
}
