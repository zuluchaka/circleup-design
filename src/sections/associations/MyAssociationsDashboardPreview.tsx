import { MyAssociationsDashboard } from './components/MyAssociationsDashboard'
import data from '@/../product/sections/associations/data.json'

export default function MyAssociationsDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MyAssociationsDashboard
        associations={data.associations}
        canCreate={true}
        onViewAssociation={(id: string) => console.log('View:', id)}
        onCreate={() => console.log('Create')}
        onDiscover={() => console.log('Discover')}
      />
    </div>
  )
}
