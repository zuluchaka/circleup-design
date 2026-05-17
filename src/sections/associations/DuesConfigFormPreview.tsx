import { DuesConfigForm } from './components/DuesConfigForm'

export default function DuesConfigFormPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DuesConfigForm associationId="assoc-001" />
    </div>
  )
}
