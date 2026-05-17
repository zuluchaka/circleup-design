import data from '@/../product/sections/associations/data.json'
import { DiscoverAssociations } from './components/DiscoverAssociations'

export default function DiscoverAssociationsPreview() {
  return (
    <DiscoverAssociations
      associations={data.discoverableAssociations}
      onRequestToJoin={(id) => console.log('Request to join:', id)}
      onSearch={(query) => console.log('Search:', query)}
      onBack={() => console.log('Go back')}
    />
  )
}
