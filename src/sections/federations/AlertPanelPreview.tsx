import { AlertPanel } from './components/AlertPanel'

export default function AlertPanelPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AlertPanel associationId="assoc-001" />
    </div>
  )
}
