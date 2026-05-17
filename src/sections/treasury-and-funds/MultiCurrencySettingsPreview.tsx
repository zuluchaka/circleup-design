import { MultiCurrencySettings } from './components/MultiCurrencySettings'

export default function MultiCurrencySettingsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MultiCurrencySettings associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
