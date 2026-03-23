import { LoyaltyCampaignManager } from "@/src/components/loyalty/LoyaltyCampaignManager"
import { LoyaltyCustomerOverview } from "@/src/components/loyalty/LoyaltyCustomerOverview"
import { LoyaltyActivityFeed } from "@/src/components/loyalty/LoyaltyActivityFeed"
import { LoyaltyRules } from "@/src/components/loyalty/LoyaltyRules"
import { LoyaltySettings } from "@/src/components/loyalty/LoyaltySettings"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "motion/react"
import { 
  Trophy, 
  Target, 
  Gift, 
  Gamepad2, 
  Star, 
  Crown, 
  Zap, 
  ChevronRight,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Activity,
  Settings,
  LayoutDashboard,
  Sliders
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { toast } from "sonner"

const Loyalty = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")

  const tiers = [
    { name: t("loyalty.tiers.names.Bronze"), minSpend: 0, color: "bg-orange-100 text-orange-700", icon: Award },
    { name: t("loyalty.tiers.names.Silver"), minSpend: 500, color: "bg-slate-100 text-slate-700", icon: Star },
    { name: t("loyalty.tiers.names.Gold"), minSpend: 2000, color: "bg-yellow-100 text-yellow-700", icon: Crown },
    { name: t("loyalty.tiers.names.Diamond"), minSpend: 5000, color: "bg-indigo-100 text-indigo-700", icon: Trophy },
  ]

  const missions = [
    { id: 1, title: t("loyalty.missions.items.Early Bird.title"), description: t("loyalty.missions.items.Early Bird.description"), reward: "500 pts", progress: 66 },
    { id: 2, title: t("loyalty.missions.items.Review Master.title"), description: t("loyalty.missions.items.Review Master.description"), reward: "1000 pts", progress: 20 },
    { id: 3, title: t("loyalty.missions.items.Big Spender.title"), description: t("loyalty.missions.items.Big Spender.description"), reward: "Exclusive Badge", progress: 45 },
  ]

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 p-8 md:p-16 text-white shadow-2xl">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />
          <div className="relative z-10 space-y-8 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Loyalty Program v3.0 • {t("loyalty.hero.newFeatures", "Tính năng mới")}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase"
            >
              {t("loyalty.title")}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-xl opacity-90 font-medium max-w-xl"
            >
              {t("loyalty.description")}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-black px-10 py-7 rounded-2xl text-lg shadow-xl shadow-white/10" onClick={() => toast.success(t("common.manageSuccess", "Đã mở giao diện quản lý phần thưởng"))}>
                {t("loyalty.manageRewards")}
              </Button>
              <Button variant="ghost" className="border border-white/30 text-white hover:bg-white/10 font-black px-10 py-7 rounded-2xl text-lg backdrop-blur-sm" onClick={() => toast.success(t("common.viewAnalyticsSuccess", "Đã mở giao diện phân tích"))}>
                {t("loyalty.viewAnalytics")}
              </Button>
            </motion.div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Trophy className="w-full h-full transform translate-x-1/4 -translate-y-1/4 rotate-12" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-400/30 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-sky-400/30 blur-[120px] rounded-full animate-pulse delay-700" />
        </section>

        {/* Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm h-auto">
              <TabsTrigger value="dashboard" className="rounded-xl px-6 py-3 font-black text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" /> {t("common.dashboard", "Bảng điều khiển")}
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl px-6 py-3 font-black text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center gap-2">
                <Sliders className="h-4 w-4" /> {t("loyalty.settings.title")}
              </TabsTrigger>
            </TabsList>
            
            <div className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              System Online • v3.0.1
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-10 mt-0">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: t("loyalty.stats.totalMembers"), value: "12,482", trend: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                { label: t("loyalty.stats.pointsIssued"), value: "1.2M", trend: "+8%", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
                { label: t("loyalty.stats.redemptionRate"), value: "24.5%", trend: "+2.4%", icon: Gift, color: "text-orange-600", bg: "bg-orange-50" },
                { label: t("loyalty.stats.roi"), value: "3.2x", trend: "+0.5x", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                          <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-10">
                {/* Tier Management */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                      <Crown className="text-yellow-500 h-8 w-8" /> {t("loyalty.tiers.title")}
                    </h2>
                    <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl px-4">
                      {t("loyalty.tiers.editStructure")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {tiers.map((tier) => (
                      <Card key={tier.name} className="border-none shadow-sm hover:shadow-xl transition-all overflow-hidden group relative">
                        <CardContent className="p-8 flex items-center gap-6">
                          <div className={`h-20 w-20 rounded-3xl flex items-center justify-center ${tier.color} group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                            <tier.icon className="h-10 w-10" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight">{tier.name}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                              {t("loyalty.tiers.minSpend", { amount: tier.minSpend })}
                            </p>
                          </div>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-slate-300" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Rules Management */}
                <LoyaltyRules />

                {/* Missions Section */}
                <div className="space-y-6 pt-4">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                    <Target className="text-red-500 h-8 w-8" /> {t("loyalty.missions.title")}
                  </h2>
                  <div className="grid gap-6">
                    {missions.map((mission) => (
                      <Card key={mission.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                        <CardContent className="p-8 space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-black text-xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{mission.title}</h3>
                              <p className="text-slate-500 font-medium max-w-md leading-relaxed">{mission.description}</p>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-black px-4 py-2 text-sm rounded-xl">
                              {mission.reward}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                              <span>{t("loyalty.missions.progress")}</span>
                              <span>{mission.progress}%</span>
                            </div>
                            <Progress value={mission.progress} className="h-3 bg-slate-100 rounded-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Customer Overview */}
                <LoyaltyCustomerOverview />
              </div>

              {/* Sidebar Area */}
              <div className="space-y-8">
                {/* Activity Feed */}
                <LoyaltyActivityFeed />

                {/* Program Health Card */}
                <Card className="bg-indigo-50 border-none shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="h-24 w-24 text-indigo-900" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-indigo-900 font-black text-xl tracking-tight">{t("loyalty.health.title")}</CardTitle>
                    <CardDescription className="text-indigo-600/70 font-bold">{t("loyalty.health.description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <Users className="text-indigo-600 h-5 w-5" />
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{t("loyalty.health.activeMembers")}</span>
                      </div>
                      <span className="font-black text-indigo-900 text-lg">12,482</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="text-emerald-600 h-5 w-5" />
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{t("loyalty.health.redemptionRate")}</span>
                      </div>
                      <span className="font-black text-emerald-600 text-lg">24.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <Gift className="text-orange-600 h-5 w-5" />
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{t("loyalty.health.pointsIssued")}</span>
                      </div>
                      <span className="font-black text-orange-600 text-lg">1.2M</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Mini-games Card */}
                <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none overflow-hidden relative shadow-xl shadow-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-black text-xl tracking-tight">
                      <Gamepad2 className="h-6 w-6" /> {t("loyalty.games.title")}
                    </CardTitle>
                    <CardDescription className="text-purple-100 font-bold">{t("loyalty.games.description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <div className="p-5 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/20 transition-colors cursor-pointer group">
                      <span className="font-bold text-lg">{t("loyalty.games.luckyWheel")}</span>
                      <Badge className="bg-emerald-400 text-emerald-900 border-none font-black text-[10px] uppercase">{t("loyalty.games.status.active")}</Badge>
                    </div>
                    <div className="p-5 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/20 transition-colors cursor-pointer">
                      <span className="font-bold text-lg">{t("loyalty.games.dailyCheckin")}</span>
                      <Badge className="bg-emerald-400 text-emerald-900 border-none font-black text-[10px] uppercase">{t("loyalty.games.status.active")}</Badge>
                    </div>
                    <div className="p-5 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between opacity-50">
                      <span className="font-bold text-lg">{t("loyalty.games.priceGuessing")}</span>
                      <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase">{t("loyalty.games.status.paused")}</Badge>
                    </div>
                  </CardContent>
                  <div className="absolute -bottom-4 -right-4 opacity-10">
                    <Zap className="h-40 w-40" />
                  </div>
                </Card>

                {/* Campaign Manager */}
                <LoyaltyCampaignManager />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <LoyaltySettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Loyalty
