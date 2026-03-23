import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  Megaphone, 
  Wallet, 
  BarChart3, 
  UsersRound,
  Star,
  HelpCircle,
  Sparkles,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Check
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { GoogleGenAI } from "@google/genai"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { db } from "@/src/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const revenueData = [
    { name: t("common.months.jan"), total: 125000000 },
    { name: t("common.months.feb"), total: 145000000 },
    { name: t("common.months.mar"), total: 185000000 },
    { name: t("common.months.apr"), total: 165000000 },
    { name: t("common.months.may"), total: 210000000 },
    { name: t("common.months.jun"), total: 195000000 },
    { name: t("common.months.jul"), total: 245000000 },
  ]

  const ordersData = [
    { name: t("common.weekdays.mon"), orders: 120 },
    { name: t("common.weekdays.tue"), orders: 150 },
    { name: t("common.weekdays.wed"), orders: 180 },
    { name: t("common.weekdays.thu"), orders: 140 },
    { name: t("common.weekdays.fri"), orders: 200 },
    { name: t("common.weekdays.sat"), orders: 250 },
    { name: t("common.weekdays.sun"), orders: 220 },
  ]

  const [aiBriefing, setAiBriefing] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [productCount, setProductCount] = useState<number | null>(null)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [visibleWidgets, setVisibleWidgets] = useState({
    aiBriefing: true,
    stats: true,
    quickAccess: true,
    charts: true
  })

  const fetchStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      setProductCount(querySnapshot.size)
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "products")
    }
  }

  const fetchAiBriefing = async () => {
    setIsAiLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "You are an expert e-commerce analyst. Based on these mock stats: Revenue +20%, Sellers +180%, Orders +19%, Products -201. Provide a concise 3-sentence daily briefing for the admin. Focus on one positive trend, one concern, and one actionable advice. Return as plain text.",
      })
      setAiBriefing(response.text || null)
    } catch (error) {
      console.error("AI Briefing Error:", error)
      setAiBriefing(t("dashboard.aiBriefing.error"))
    } finally {
      setIsAiLoading(false)
    }
  }

  useEffect(() => {
    fetchAiBriefing()
    fetchStats()
  }, [])

  const modules = [
    { title: "nav.products", icon: Package, color: "text-blue-500", bg: "bg-blue-100", href: "/products", description: t("dashboard.modules.products") },
    { title: "nav.orders", icon: ShoppingCart, color: "text-orange-500", bg: "bg-orange-100", href: "/orders", description: t("dashboard.modules.orders") },
    { title: "nav.sellers", icon: Users, color: "text-purple-500", bg: "bg-purple-100", href: "/sellers", description: t("dashboard.modules.sellers") },
    { title: "nav.customers", icon: UsersRound, color: "text-green-500", bg: "bg-green-100", href: "/customers", description: t("dashboard.modules.customers") },
    { title: "nav.marketing", icon: Megaphone, color: "text-pink-500", bg: "bg-pink-100", href: "/marketing", description: t("dashboard.modules.marketing") },
    { title: "nav.finance", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-100", href: "/finance", description: t("dashboard.modules.finance") },
    { title: "nav.hr", icon: UsersRound, color: "text-cyan-500", bg: "bg-cyan-100", href: "/hr", description: t("dashboard.modules.hr") },
    { title: "nav.analytics", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-100", href: "/analytics", description: t("dashboard.modules.analytics") },
  ]

  return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t("dashboard.title")}</h2>
          <p className="text-slate-500 text-sm">
            {t("dashboard.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isCustomizing ? "default" : "outline"} 
            className="rounded h-9 px-4 font-medium"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            {isCustomizing ? "Lưu cấu hình" : "Tùy chỉnh Dashboard"}
          </Button>
        </div>
      </div>

      {isCustomizing && (
        <Card className="bg-white border-2 border-slate-200 rounded-none">
          <CardContent className="p-4 flex flex-wrap gap-4">
            {[
              { id: "aiBriefing", label: "AI Briefing" },
              { id: "stats", label: "Chỉ số tổng quan" },
              { id: "quickAccess", label: "Truy cập nhanh" },
              { id: "charts", label: "Biểu đồ" }
            ].map((widget) => (
              <label key={widget.id} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={visibleWidgets[widget.id as keyof typeof visibleWidgets]} 
                  onChange={(e) => setVisibleWidgets(p => ({...p, [widget.id]: e.target.checked}))}
                  className="h-4 w-4 rounded border-slate-300 text-primary"
                />
                <span className="text-sm font-medium text-slate-700">{widget.label}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      {visibleWidgets.aiBriefing && (
      <Card className="border-2 border-slate-100 rounded-none bg-white">
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              {t("dashboard.aiBriefing.title")}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchAiBriefing} 
              disabled={isAiLoading}
              className="h-8 w-8 rounded hover:bg-slate-100"
            >
              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
            </Button>
          </div>
          <CardDescription className="text-slate-500 text-sm">
            {t("dashboard.aiBriefing.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {isAiLoading ? (
            <div className="flex items-center gap-2 text-slate-400 italic py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("dashboard.aiBriefing.loading")}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-base text-slate-700">
                {aiBriefing || t("dashboard.aiBriefing.placeholder")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none rounded px-2 py-1 text-[10px] font-bold uppercase">
                  <Lightbulb className="h-3 w-3 mr-1 text-yellow-600" /> {t("dashboard.aiBriefing.tip1")}
                </Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none rounded px-2 py-1 text-[10px] font-bold uppercase">
                  <AlertTriangle className="h-3 w-3 mr-1 text-rose-600" /> {t("dashboard.aiBriefing.tip2")}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {visibleWidgets.stats && (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t("dashboard.totalRevenue"), value: formatVND(1250431000), icon: DollarSign, trend: "+20.1%", color: "blue" },
          { title: t("dashboard.activeSellers"), value: "+2.350", icon: Users, trend: "+180.1%", color: "purple" },
          { title: t("dashboard.totalOrders"), value: "+12.234", icon: ShoppingCart, trend: "+19%", color: "orange" },
          { title: t("dashboard.activeProducts"), value: productCount !== null ? productCount : "...", icon: Package, trend: "Live", color: "emerald" },
        ].map((stat, i) => (
          <Card key={i} className="border-2 border-slate-100 bg-white rounded-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</CardTitle>
              <stat.icon className={cn(
                "h-4 w-4",
                stat.color === "blue" && "text-blue-500",
                stat.color === "purple" && "text-purple-500",
                stat.color === "orange" && "text-orange-500",
                stat.color === "emerald" && "text-emerald-500"
              )} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-900">{stat.value}</div>
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-[10px] font-bold mr-1",
                  stat.trend === "Live" ? "text-emerald-500" : "text-emerald-500"
                )}>
                  {stat.trend}
                </span>
                <span className="text-[10px] text-slate-400">
                  {stat.trend === "Live" ? t("dashboard.activeProductsDesc") : t("dashboard.fromLastMonth")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {visibleWidgets.quickAccess && (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">{t("dashboard.quickAccess")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((item) => (
            <Card
              key={item.title}
              className="border-2 border-slate-100 rounded-none bg-white cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate(item.href)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded",
                    item.bg,
                    item.color
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-slate-900">{t(item.title)}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      )}

      {visibleWidgets.charts && (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-2 border-slate-100 rounded-none bg-white">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-slate-900">{t("dashboard.revenueOverview")}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: "0", 
                      border: "2px solid #f1f5f9", 
                      boxShadow: "none",
                      fontSize: "12px",
                      fontWeight: 700
                    }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-2 border-slate-100 rounded-none bg-white">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-slate-900">{t("dashboard.weeklyOrders")}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight={700}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ 
                      borderRadius: "0", 
                      border: "2px solid #f1f5f9", 
                      boxShadow: "none",
                      fontSize: "12px",
                      fontWeight: 700
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#10b981"
                    radius={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  )
}
