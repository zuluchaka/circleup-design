import { SurveyResponse } from './components/SurveyResponse'

export default function SurveyResponsePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SurveyResponse associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
