import data from '@/../product/sections/ai-insights/data.json'
import { AiSupportChat } from './components/FinancialHealthChat'

export default function AiSupportChatPreview() {
  // The aiChatMessages is an array, get the first conversation
  const conversation = data.aiChatMessages[0]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AiSupportChat
        conversation={conversation}
        onSendMessage={(message) => console.log('Send message:', message)}
        onRateResponse={(messageId, helpful) => console.log('Rate response:', messageId, helpful)}
        onEscalateToHuman={(conversationId) => console.log('Escalate to human:', conversationId)}
      />
    </div>
  )
}
