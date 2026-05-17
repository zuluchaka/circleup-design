import QRCheckin from './components/QRCheckin'

export default function QRCheckinPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <QRCheckin associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
