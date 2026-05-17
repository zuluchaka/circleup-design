import { ContributionFlow } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, Participant, Contribution, PaymentMethod } from '@/../product/sections/rosca-circles/types'

export default function ContributionFlowPreview() {
  const circle = sampleData.circles[0] as Circle
  const participant = sampleData.participants[0] as Participant
  const contribution = sampleData.contributions[0] as Contribution

  // Sample payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 'pm-1', type: 'card', last4: '4242', brand: 'Visa', expiryMonth: 12, expiryYear: 2025, isDefault: true },
    { id: 'pm-2', type: 'bank_account', last4: '6789', isDefault: false },
    { id: 'pm-3', type: 'mobile_money', last4: '1234', isDefault: false },
  ]

  const handleSubmitPayment = (paymentMethodId: string, amount: number) => {
    console.log('Submit payment:', { paymentMethodId, amount })
  }

  const handlePartialPayment = (paymentMethodId: string, amount: number) => {
    console.log('Partial payment:', { paymentMethodId, amount })
  }

  const handlePayForMember = (memberId: string, amount: number) => {
    console.log('Pay for member:', { memberId, amount })
  }

  const handleSetupAutoPay = () => {
    console.log('Setup auto-pay')
  }

  const handleCancel = () => {
    console.log('Cancel contribution')
  }

  return (
    <ContributionFlow
      circle={circle}
      participant={participant}
      contribution={contribution}
      paymentMethods={paymentMethods}
      onSubmitPayment={handleSubmitPayment}
      onPartialPayment={handlePartialPayment}
      onPayForMember={handlePayForMember}
      onSetupAutoPay={handleSetupAutoPay}
      onCancel={handleCancel}
    />
  )
}
