import data from '../../../product/sections/governance-and-voting/data.json'
import { DecisionArchive } from './components/DecisionArchive'

export default function DecisionArchivePreview() {
  return (
    <DecisionArchive
      decisions={data.decisions}
      onViewDecision={(id) => console.log('View decision:', id)}
      onExport={(format, ids) => console.log('Export:', format, ids)}
      onFilter={(filters) => console.log('Filter:', filters)}
    />
  )
}
