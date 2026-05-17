import { InvestmentManager } from './components/InvestmentManager'

export default function InvestmentManagerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <InvestmentManager associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
