import AssociationCirclesView from './components/AssociationCirclesView'
import data from '@/../product/sections/associations/data.json'

export default function AssociationCirclesViewPreview() {
  const association = data.associations[0]
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AssociationCirclesView
        association={association}
        circles={[]}
        onCreateCircle={() => console.log('Create circle')}
        onViewCircle={(id: string) => console.log('View circle:', id)}
      />
    </div>
  )
}
