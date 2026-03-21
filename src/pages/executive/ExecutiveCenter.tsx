import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { DecisionLog } from "@/src/components/executive/DecisionLog"
import { ResourceSimulator } from "@/src/components/executive/ResourceSimulator"
import { MarketIntel } from "@/src/components/executive/MarketIntel"
import { KnowledgeHub } from "@/src/components/executive/KnowledgeHub"

import { 
  TrendingUp, 
  Target, 
  Compass, 
  BarChart3,
  ArrowUpRight,
  Users,
  Globe,
  Zap,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lightbulb,
  BrainCircuit,
  Loader2,
  Clock
} from "lucide-react"
import { GoogleGenAI } from "@google/genai"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"

import Markdown from "react-markdown"

const ExecutiveCenter = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("direction")
  const [aiAdvice, setAiAdvice] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isScenarioLoading, setIsScenarioLoading] = useState(false)
  const [scenarioAnalysis, setScenarioAnalysis] = useState<string | null>(null)

  const generateAiStrategy = async () => {
    setIsAiLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following SWOT for an e-commerce platform:
        Strengths: Proprietary AI, strong engineering.
        Weaknesses: Limited rural distribution.
        Opportunities: B2B integration, emerging markets.
        Threats: Regulatory changes, price wars.
        
        Goal: Reach $2B GMV by 2026.
        
        Provide 3-4 high-level strategic recommendations in Markdown format.
        Include:
        1. **Strategic Pillar**: The core focus area.
        2. **Key Initiatives**: Specific actions to take.
        3. **Expected Impact**: How it helps reach the $2B goal.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setAiAdvice(response.text || null)
    } catch (error) {
      console.error("AI Strategy Error:", error)
      setAiAdvice(t("executive.ai.strategyError"))
    } finally {
      setIsAiLoading(false)
    }
  }

  const runScenarioPlanning = async () => {
    setIsScenarioLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Run a strategic scenario planning for an e-commerce platform.
        Scenario: "Aggressive competitor entry with 50% lower prices".
        
        Provide a response in Markdown format.
        Include:
        1. **Risk Assessment**: Impact on market share and margins.
        2. **Defensive Strategy**: How to protect current customer base.
        3. **Counter-Offensive**: Opportunities to exploit competitor weaknesses.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setScenarioAnalysis(response.text || null)
    } catch (error) {
      console.error("Scenario Planning Error:", error)
      setScenarioAnalysis(t("executive.ai.scenarioError"))
    } finally {
      setIsScenarioLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pt-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section - Editorial Style */}
        <section className="space-y-4 pt-10">
          <div className="flex items-center space-x-2 text-[#F27D26] font-mono text-xs tracking-[0.2em] uppercase">
            <Activity className="h-4 w-4" />
            <span>Executive Intelligence Unit</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
            {t("executive.title")}
          </h1>
          <p className="text-xl text-white/50 max-w-2xl font-light leading-relaxed">
            {t("executive.description")}
          </p>
        </section>

        <Tabs defaultValue="direction" className="space-y-12" onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-auto p-0 space-x-8">
            <TabsTrigger 
              value="direction" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F27D26] data-[state=active]:bg-transparent text-lg font-medium pb-4 px-0"
            >
              {t("executive.tabs.direction")}
            </TabsTrigger>
            <TabsTrigger 
              value="strategy" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F27D26] data-[state=active]:bg-transparent text-lg font-medium pb-4 px-0"
            >
              {t("executive.tabs.strategy")}
            </TabsTrigger>
            <TabsTrigger 
              value="decision-log" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F27D26] data-[state=active]:bg-transparent text-lg font-medium pb-4 px-0"
            >
              {t("executive.tabs.decisionLog")}
            </TabsTrigger>
            <TabsTrigger 
              value="simulator" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F27D26] data-[state=active]:bg-transparent text-lg font-medium pb-4 px-0"
            >
              {t("executive.tabs.simulator")}
            </TabsTrigger>
            <TabsTrigger 
              value="market-intel" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F27D26] data-[state=active]:bg-transparent text-lg font-medium pb-4 px-0"
            >
              {t("executive.tabs.marketIntel")}
            </TabsTrigger>
            <TabsTrigger 
              value="knowledge-hub" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F27D26] data-[state=active]:bg-transparent text-lg font-medium pb-4 px-0"
            >
              {t("executive.tabs.knowledgeHub")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direction" className="space-y-12 mt-0">
            {/* ... existing content ... */}
          </TabsContent>

          <TabsContent value="strategy" className="space-y-12 mt-0">
            {/* ... existing content ... */}
          </TabsContent>

          <TabsContent value="decision-log" className="space-y-12 mt-0">
            <DecisionLog />
          </TabsContent>

          <TabsContent value="simulator" className="space-y-12 mt-0">
            <ResourceSimulator />
          </TabsContent>

          <TabsContent value="market-intel" className="space-y-12 mt-0">
            <MarketIntel />
          </TabsContent>

          <TabsContent value="knowledge-hub" className="space-y-12 mt-0">
            <KnowledgeHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ExecutiveCenter
