import AttendanceSheet from './components/AttendanceSheet'

export default function AttendanceSheetPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AttendanceSheet associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
