import { SurveyBuilder } from './components/SurveyBuilder'

export default function SurveyBuilderPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SurveyBuilder associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
