import { CircleAttendancePatterns } from './components/CircleAttendancePatterns'

export default function CircleAttendancePatternsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CircleAttendancePatterns associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
