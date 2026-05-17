import data from '@/../product/sections/federations/data.json'
import { FederationList } from './components/FederationList'

export default function FederationListPreview() {
  return (
    <FederationList
      federations={data.federations}
      onSelectFederation={(id) => console.log('Select federation:', id)}
      onCreateFederation={() => console.log('Create federation')}
    />
  )
}
