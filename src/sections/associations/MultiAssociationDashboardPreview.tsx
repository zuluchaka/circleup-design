import { MultiAssociationDashboard } from './components/MultiAssociationDashboard'

export default function MultiAssociationDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MultiAssociationDashboard
        userId="user-001"
        onSelectAssociation={(id: string) => console.log('Select:', id)}
      />
    </div>
  )
}
