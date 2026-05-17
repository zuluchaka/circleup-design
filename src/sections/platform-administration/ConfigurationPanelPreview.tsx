import { ConfigurationPanel } from './components/ConfigurationPanel'

export default function ConfigurationPanelPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ConfigurationPanel associationId="assoc-001" />
    </div>
  )
}
