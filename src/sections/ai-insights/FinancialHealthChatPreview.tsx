import data from '@/../product/sections/ai-insights/data.json'
import { FinancialHealthChatComponent } from './components/FinancialHealthChat'

export default function FinancialHealthChatPreview() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <FinancialHealthChatComponent
        chat={data.financialHealthChat}
        onSendMessage={(message) => console.log('Send message:', message)}
      />
    </div>
  )
}
