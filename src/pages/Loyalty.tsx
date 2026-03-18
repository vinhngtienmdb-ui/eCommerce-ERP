import React from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
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
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "sonner"

const Loyalty = () => {
  const { t } = useTranslation()

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
        <section className="relative overflow-hidden rounded-3xl bg-indigo-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 space-y-6 max-w-2xl">
            <Badge className="bg-indigo-500/30 text-indigo-100 border-none px-4 py-1">Loyalty Program v2.0</Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
              {t("loyalty.title")}
            </h1>
            <p className="text-indigo-100 text-lg opacity-80">
              {t("loyalty.description")}
            </p>
            <div className="flex gap-4">
              <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 py-6 rounded-xl" onClick={() => toast.success(t("common.manageSuccess", "Đã mở giao diện quản lý phần thưởng"))}>
                {t("loyalty.manageRewards")}
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-6 rounded-xl" onClick={() => toast.success(t("common.viewAnalyticsSuccess", "Đã mở giao diện phân tích"))}>
                {t("loyalty.viewAnalytics")}
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Trophy className="w-full h-full transform translate-x-1/4 -translate-y-1/4 rotate-12" />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tier Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Crown className="text-yellow-500 h-6 w-6" /> {t("loyalty.tiers.title")}
              </h2>
              <Button variant="ghost" className="text-indigo-600 font-semibold">{t("loyalty.tiers.editStructure")} <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {tiers.map((tier) => (
                <Card key={tier.name} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${tier.color} group-hover:scale-110 transition-transform`}>
                      <tier.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{tier.name}</h3>
                      <p className="text-sm text-slate-500">{t("loyalty.tiers.minSpend", { amount: tier.minSpend })}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6 pt-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="text-red-500 h-6 w-6" /> {t("loyalty.missions.title")}
              </h2>
              <div className="space-y-4">
                {missions.map((mission) => (
                  <Card key={mission.id} className="border-none shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900">{mission.title}</h3>
                          <p className="text-sm text-slate-500">{mission.description}</p>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold">
                          {mission.reward}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-slate-400">
                          <span>{t("loyalty.missions.progress")}</span>
                          <span>{mission.progress}%</span>
                        </div>
                        <Progress value={mission.progress} className="h-2 bg-slate-100" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats & Mini-games */}
          <div className="space-y-6">
            <Card className="bg-indigo-50 border-none">
              <CardHeader>
                <CardTitle className="text-indigo-900">{t("loyalty.health.title")}</CardTitle>
                <CardDescription className="text-indigo-600/70">{t("loyalty.health.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="text-indigo-600 h-5 w-5" />
                    <span className="text-sm font-medium text-slate-600">{t("loyalty.health.activeMembers")}</span>
                  </div>
                  <span className="font-bold text-indigo-900">12,482</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-emerald-600 h-5 w-5" />
                    <span className="text-sm font-medium text-slate-600">{t("loyalty.health.redemptionRate")}</span>
                  </div>
                  <span className="font-bold text-emerald-600">24.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="text-orange-600 h-5 w-5" />
                    <span className="text-sm font-medium text-slate-600">{t("loyalty.health.pointsIssued")}</span>
                  </div>
                  <span className="font-bold text-orange-600">1.2M</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none overflow-hidden relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" /> {t("loyalty.games.title")}
                </CardTitle>
                <CardDescription className="text-purple-100">{t("loyalty.games.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="font-medium">{t("loyalty.games.luckyWheel")}</span>
                  <Button size="sm" variant="secondary" className="text-xs h-7">{t("loyalty.games.status.active")}</Button>
                </div>
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="font-medium">{t("loyalty.games.dailyCheckin")}</span>
                  <Button size="sm" variant="secondary" className="text-xs h-7">{t("loyalty.games.status.active")}</Button>
                </div>
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between opacity-50">
                  <span className="font-medium">{t("loyalty.games.priceGuessing")}</span>
                  <Button size="sm" variant="secondary" className="text-xs h-7">{t("loyalty.games.status.paused")}</Button>
                </div>
              </CardContent>
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <Zap className="h-32 w-32" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loyalty
