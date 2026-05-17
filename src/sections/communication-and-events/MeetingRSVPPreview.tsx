import MeetingRSVP from './components/MeetingRSVP'

export default function MeetingRSVPPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MeetingRSVP associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
