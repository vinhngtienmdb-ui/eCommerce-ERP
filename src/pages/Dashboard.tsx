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
  Lightbulb
} from "lucide-react"
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
          <p className="text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isCustomizing ? "default" : "outline"} 
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            {isCustomizing ? "Lưu cấu hình" : "Tùy chỉnh Dashboard"}
          </Button>
        </div>
      </div>

      {isCustomizing && (
        <Card className="bg-slate-50 border-dashed border-2">
          <CardContent className="p-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.aiBriefing} onChange={(e) => setVisibleWidgets(p => ({...p, aiBriefing: e.target.checked}))} />
              AI Briefing
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.stats} onChange={(e) => setVisibleWidgets(p => ({...p, stats: e.target.checked}))} />
              Chỉ số tổng quan
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.quickAccess} onChange={(e) => setVisibleWidgets(p => ({...p, quickAccess: e.target.checked}))} />
              Truy cập nhanh
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.charts} onChange={(e) => setVisibleWidgets(p => ({...p, charts: e.target.checked}))} />
              Biểu đồ
            </label>
          </CardContent>
        </Card>
      )}

      {visibleWidgets.aiBriefing && (
      <Card className="bg-primary text-primary-foreground border border-primary-foreground/20 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-primary-foreground">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              {t("dashboard.aiBriefing.title")}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchAiBriefing} 
              disabled={isAiLoading}
              className="hover:bg-primary-foreground/20 text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              aria-label="Refresh AI Briefing"
            >
              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <TrendingUp className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </div>
          <CardDescription className="text-primary-foreground/90 font-medium">
            {t("dashboard.aiBriefing.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAiLoading ? (
            <div className="flex items-center gap-2 text-primary-foreground/90 italic py-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t("dashboard.aiBriefing.loading")}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-primary-foreground font-medium">
                {aiBriefing || t("dashboard.aiBriefing.placeholder")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary-foreground text-primary border-none hover:bg-primary-foreground/90 font-semibold">
                  <Lightbulb className="h-3 w-3 mr-1" aria-hidden="true" /> {t("dashboard.aiBriefing.tip1")}
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground text-primary border-none hover:bg-primary-foreground/90 font-semibold">
                  <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" /> {t("dashboard.aiBriefing.tip2")}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {visibleWidgets.stats && (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">{t("dashboard.totalRevenue")}</CardTitle>
            <div className="p-2.5 bg-muted rounded-md border border-border">
              <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatVND(1250431000)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1 font-medium">
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" aria-hidden="true" />
                +20.1%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">{t("dashboard.activeSellers")}</CardTitle>
            <div className="p-2.5 bg-muted rounded-md border border-border">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.350</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1 font-medium">
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" aria-hidden="true" />
                +180.1%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">{t("dashboard.totalOrders")}</CardTitle>
            <div className="p-2.5 bg-muted rounded-md border border-border">
              <ShoppingCart className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.234</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1 font-medium">
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" aria-hidden="true" />
                +19%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">{t("dashboard.activeProducts")}</CardTitle>
            <div className="p-2.5 bg-muted rounded-md border border-border">
              <Package className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount !== null ? productCount : "..."}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1 font-medium">
              {t("dashboard.activeProductsDesc")}
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {visibleWidgets.quickAccess && (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">{t("dashboard.quickAccess")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((item) => (
            <Card
              key={item.title}
              className="hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => navigate(item.href)}
            >
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400 cursor-pointer" onClick={(e) => { e.stopPropagation(); toast.success(t("dashboard.addedToFavorites", "Đã thêm vào mục yêu thích")); }} />
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-blue-400 cursor-pointer" onClick={(e) => { e.stopPropagation(); toast.info(t("dashboard.helpClicked", "Đang mở hướng dẫn sử dụng")); }} />
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{t(item.title)}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
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
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("dashboard.revenueOverview")}</CardTitle>
            <CardDescription>
              {t("dashboard.revenueDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip
                    formatter={(value: any) => formatVND(value)}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.weeklyOrders")}</CardTitle>
            <CardDescription>
              {t("dashboard.weeklyOrdersDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
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
