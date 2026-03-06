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
  AlertCircle
} from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"

const ExecutiveCenter = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("direction")

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
          </TabsList>

          <TabsContent value="direction" className="space-y-12 mt-0">
            {/* Mission & Vision - Split Layout */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 text-white overflow-hidden group">
                <CardHeader className="relative z-10">
                  <div className="h-12 w-12 rounded-full bg-[#F27D26]/20 flex items-center justify-center mb-4">
                    <Compass className="h-6 w-6 text-[#F27D26]" />
                  </div>
                  <CardTitle className="text-3xl font-light">{t("executive.direction.mission")}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-xl font-serif italic text-white/80 leading-relaxed">
                    "To revolutionize the digital commerce landscape by empowering every entrepreneur with AI-driven intelligence and seamless operational excellence."
                  </p>
                </CardContent>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Compass className="h-48 w-48" />
                </div>
              </Card>

              <Card className="bg-white/5 border-white/10 text-white overflow-hidden group">
                <CardHeader className="relative z-10">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle className="text-3xl font-light">{t("executive.direction.vision")}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm uppercase tracking-wider opacity-50">
                      <span>Market Share Target</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-1 bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-2xl font-bold">10M+</p>
                      <p className="text-xs uppercase opacity-50">Active Users</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-2xl font-bold">$2B</p>
                      <p className="text-xs uppercase opacity-50">Annual GMV</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitors & SWOT - Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-2xl font-medium flex items-center">
                  <Users className="mr-3 h-6 w-6 text-[#F27D26]" />
                  {t("executive.direction.competitors")}
                </h3>
                <div className="grid gap-4">
                  {[
                    { name: "Global Giant Corp", share: "45%", trend: "down", color: "bg-red-500" },
                    { name: "Local Tech Innovators", share: "12%", trend: "up", color: "bg-emerald-500" },
                    { name: "Niche Market Players", share: "8%", trend: "stable", color: "bg-blue-500" }
                  ].map((comp) => (
                    <div key={comp.name} className="p-6 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`h-2 w-2 rounded-full ${comp.color}`} />
                        <span className="text-lg font-medium">{comp.name}</span>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <p className="text-sm opacity-50 uppercase text-[10px]">Share</p>
                          <p className="font-mono">{comp.share}</p>
                        </div>
                        <ArrowUpRight className={`h-5 w-5 ${comp.trend === 'up' ? 'text-emerald-500' : comp.trend === 'down' ? 'text-red-500' : 'text-white/30'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-medium flex items-center">
                  <Zap className="mr-3 h-6 w-6 text-yellow-500" />
                  {t("executive.direction.swot")}
                </h3>
                <div className="grid grid-cols-2 gap-2 h-full min-h-[400px]">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase text-emerald-500">Strengths</span>
                    <p className="text-xs opacity-80">Proprietary AI algorithms & strong engineering culture.</p>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase text-red-500">Weaknesses</span>
                    <p className="text-xs opacity-80">Limited physical distribution network in rural areas.</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase text-blue-500">Opportunities</span>
                    <p className="text-xs opacity-80">Emerging markets expansion & B2B integration.</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase text-orange-500">Threats</span>
                    <p className="text-xs opacity-80">New regulatory frameworks & aggressive pricing wars.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-12 mt-0">
            {/* Strategy Overview */}
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div className="p-8 bg-[#F27D26] text-black rounded-2xl space-y-4">
                  <h3 className="text-2xl font-bold leading-tight">{t("executive.strategy.plan")} 2026</h3>
                  <p className="text-sm font-medium opacity-80">"Aggressive Expansion & Operational Efficiency"</p>
                  <Button variant="secondary" className="w-full bg-black text-white hover:bg-black/80">
                    Full Document
                  </Button>
                </div>
                <div className="p-6 border border-white/10 rounded-2xl space-y-4">
                  <h4 className="text-sm uppercase tracking-widest opacity-50">{t("executive.strategy.kpiCriteria")}</h4>
                  <ul className="space-y-3">
                    {["Customer Retention > 85%", "NPS Score > 70", "Burn Rate < $1M/mo"].map(kpi => (
                      <li key={kpi} className="flex items-center text-sm">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-[#F27D26]" />
                        {kpi}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:col-span-3 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-light">{t("executive.strategy.actions")}</h3>
                  <Badge variant="outline" className="border-white/20 text-white/50">Q1 Focus</Badge>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "AI Core Integration", progress: 75, status: "On Track" },
                    { title: "Southeast Asia Expansion", progress: 40, status: "Delayed" },
                    { title: "Seller Support Ecosystem", progress: 90, status: "Near Completion" },
                    { title: "Logistics Optimization", progress: 65, status: "On Track" }
                  ].map((action) => (
                    <div key={action.title} className="p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#F27D26]/50 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-medium">{action.title}</h4>
                        <Badge className={action.status === 'Delayed' ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20'}>
                          {action.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Progress value={action.progress} className="flex-1 h-1 bg-white/10" />
                        <span className="font-mono text-sm">{action.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Evaluation Section */}
            <section className="pt-12 border-t border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light">{t("executive.strategy.evaluation")}</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">Monthly</Button>
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">Quarterly</Button>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-transparent border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest opacity-50">Financial Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end space-x-2">
                      <span className="text-4xl font-bold">A+</span>
                      <span className="text-emerald-500 text-sm mb-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> Stable</span>
                    </div>
                    <p className="text-sm opacity-60">Cash reserves sufficient for 18 months of operation at current burn rate.</p>
                  </CardContent>
                </Card>
                <Card className="bg-transparent border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest opacity-50">Operational Risk</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end space-x-2">
                      <span className="text-4xl font-bold">Low</span>
                      <Shield className="text-blue-500 h-6 w-6 mb-1" />
                    </div>
                    <p className="text-sm opacity-60">Compliance audits passed with 98% score. No major security incidents reported.</p>
                  </CardContent>
                </Card>
                <Card className="bg-transparent border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest opacity-50">Market Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end space-x-2">
                      <span className="text-4xl font-bold">Bullish</span>
                      <TrendingUp className="text-[#F27D26] h-6 w-6 mb-1" />
                    </div>
                    <p className="text-sm opacity-60">Investor confidence high following successful Series B funding round.</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ExecutiveCenter
