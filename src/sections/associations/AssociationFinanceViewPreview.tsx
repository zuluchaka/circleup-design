import { AssociationFinanceView } from './components/AssociationFinanceView'

export default function AssociationFinanceViewPreview() {
  return (
    <AssociationFinanceView
      associationId="assoc-001"
      associationName="Nigerian Swiss Association"
      onBack={() => console.log('Back')}
    />
  )
}
