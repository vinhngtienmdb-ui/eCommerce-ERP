import { LegalAIAgent } from "@/src/components/legal/LegalAIAgent"

export function LegalAIAgentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Trợ lý AI</h1>
      <LegalAIAgent />
    </div>
  )
}
