import data from '@/../product/sections/ai-insights/data.json'
import { TrustNetwork } from './components/TrustNetwork'

export default function TrustNetworkPreview() {
  return (
    <TrustNetwork
      trustGraph={data.trustGraphNodes}
      onViewConnection={(userId) => console.log('View connection:', userId)}
      onRequestIntroduction={(userId) => console.log('Request introduction:', userId)}
    />
  )
}
