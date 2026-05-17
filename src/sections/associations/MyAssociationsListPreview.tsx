import data from '@/../product/sections/associations/data.json'
import { MyAssociationsList } from './components/MyAssociationsList'

export default function MyAssociationsListPreview() {
  return (
    <MyAssociationsList
      associations={data.associations}
      onViewAssociation={(id) => console.log('View association:', id)}
      onEditAssociation={(id) => console.log('Edit association:', id)}
      onCreateAssociation={() => console.log('Create new association')}
      onDiscoverAssociations={() => console.log('Discover associations')}
    />
  )
}
