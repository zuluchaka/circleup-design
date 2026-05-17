import AttendanceHistory from './components/AttendanceHistory'

export default function AttendanceHistoryPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AttendanceHistory associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
