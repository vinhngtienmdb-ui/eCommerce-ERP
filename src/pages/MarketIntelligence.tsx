import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { 
  Globe, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  ExternalLink,
  Plus,
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { GoogleGenAI } from "@google/genai"
import Markdown from "react-markdown"

const MarketIntelligence = () => {
  const { t } = useTranslation()
  const [competitorUrl, setCompetitorUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const analyzeCompetitor = async () => {
    if (!competitorUrl) return
    setIsAnalyzing(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the competitor at this URL: ${competitorUrl}. 
        Since you cannot browse live, provide a STRATEGIC FRAMEWORK for analyzing an e-commerce competitor in this niche.
        Include:
        1. **Pricing Strategy Analysis**: How to evaluate their price positioning.
        2. **UX/UI Strengths**: What to look for in their conversion funnel.
        3. **Marketing Channels**: Likely traffic sources (SEO, Social, Paid).
        4. **Counter-Strategy**: 3 actionable steps to outperform them.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setAnalysisResult(response.text || null)
    } catch (error) {
      console.error("Analysis Error:", error)
      setAnalysisResult("Unable to complete analysis at this time.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-emerald-500 font-mono text-xs tracking-widest uppercase">
            <Globe className="h-4 w-4" />
            <span>Market Intelligence Unit</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none">
            Competitor <span className="text-emerald-500">Radar</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl font-light">
            Track competitor movements, pricing shifts, and strategic pivots in real-time.
          </p>
        </section>

        {/* Search Bar */}
        <div className="flex gap-4 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input 
              placeholder="Enter competitor URL (e.g., https://competitor.com)" 
              className="pl-10 bg-white/5 border-white/10 h-12 focus:border-emerald-500/50 transition-all"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
            />
          </div>
          <Button 
            className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700"
            onClick={analyzeCompetitor}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Analysis Area */}
          <div className="md:col-span-2 space-y-8">
            {analysisResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-emerald-500" />
                    Strategic Analysis
                  </h2>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">AI Generated</Badge>
                </div>
                <div className="markdown-body text-white/80 leading-relaxed">
                  <Markdown>{analysisResult}</Markdown>
                </div>
              </motion.div>
            ) : (
              <div className="h-[400px] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/20 space-y-4">
                <Globe className="h-16 w-16" />
                <p>Enter a URL above to begin deep market analysis</p>
              </div>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest opacity-50">Market Share Shift</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">+2.4%</p>
                    <p className="text-xs text-emerald-500">Your Growth</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[65%]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest opacity-50">Price Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { item: "Wireless Earbuds", change: "-15%", comp: "TechStore" },
                  { item: "Smart Watch S3", change: "+5%", comp: "GlobalGadget" }
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{alert.item}</p>
                      <p className="text-[10px] opacity-50">{alert.comp}</p>
                    </div>
                    <span className={alert.change.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}>
                      {alert.change}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-orange-500">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-bold uppercase text-xs">Risk Alert</span>
              </div>
              <p className="text-sm text-white/80">
                Competitor "MegaMart" has launched a loyalty program that targets your top 10% customers.
              </p>
              <Button variant="link" className="text-orange-500 p-0 h-auto text-xs">
                View Response Plan <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketIntelligence
