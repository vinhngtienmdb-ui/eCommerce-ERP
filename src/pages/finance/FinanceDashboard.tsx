import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { 
  Wallet, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  DollarSign,
  ShieldAlert,
  LineChart,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { GoogleGenAI } from "@google/genai"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"

import Markdown from "react-markdown"

export function FinanceDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [financeForecast, setFinanceForecast] = useState<string | null>(null)
  const [isAnomalyLoading, setIsAnomalyLoading] = useState(false)
  const [anomalyReport, setAnomalyReport] = useState<string | null>(null)

  const generateFinanceForecast = async () => {
    setIsAiLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze financial data for an e-commerce seller.
        Revenue: 850M, Expenses: 320M, Growth: 12%.
        
        Provide a strategic profit forecast in Markdown format.
        Include:
        1. **Profit Projection**: Estimated net profit for next month.
        2. **Cost Optimization**: 2 specific areas to reduce expenses.
        3. **Investment Advice**: Where to reinvest profits for maximum growth.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setFinanceForecast(response.text || null)
    } catch (error) {
      console.error("Finance Forecast Error:", error)
      setFinanceForecast(t("finance.ai.forecastError"))
    } finally {
      setIsAiLoading(false)
    }
  }

  const detectAnomalies = async () => {
    setIsAnomalyLoading(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze recent transactions for potential anomalies or fraud.
        Context: E-commerce seller dashboard.
        
        Provide a brief report in Markdown format.
        Include:
        1. **Risk Level**: Low, Medium, or High.
        2. **Detected Anomalies**: List 2-3 suspicious patterns (e.g., unusual refund rates, velocity spikes).
        3. **Recommended Actions**: Immediate steps to secure the account.
        
        Language: ${t("languageCode") || "English"}.`,
      })
      const response = await model
      setAnomalyReport(response.text || null)
    } catch (error) {
      console.error("Anomaly Detection Error:", error)
      setAnomalyReport(t("finance.ai.anomalyError"))
    } finally {
      setIsAnomalyLoading(false)
    }
  }

  const financeModules = [
    { 
      id: "accounting", 
      title: "nav.accounting", 
      description: "financeDashboard.accountingDesc", 
      icon: Wallet, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      href: "/finance/accounting"
    },
    { 
      id: "invoices", 
      title: "nav.invoices", 
      description: "financeDashboard.invoicesDesc", 
      icon: FileText, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50",
      href: "/finance/invoices"
    },
    { 
      id: "reconciliation", 
      title: "nav.reconciliation", 
      description: "financeDashboard.reconciliationDesc", 
      icon: FileText, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      href: "/finance/reconciliation"
    },
    { 
      id: "pnl", 
      title: "nav.pnl", 
      description: "financeDashboard.pnlDesc", 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      href: "/finance/pnl"
    },
    { 
      id: "paymentWallet", 
      title: "nav.paymentWallet", 
      description: "financeDashboard.paymentWalletDesc", 
      icon: CreditCard, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      href: "/finance/payment-wallet"
    },
    { 
      id: "sellerFinance", 
      title: "nav.sellerFinance", 
      description: "financeDashboard.sellerFinanceDesc", 
      icon: Users, 
      color: "text-pink-600", 
      bg: "bg-pink-50",
      href: "/finance/seller-finance"
    },
    { 
      id: "reports", 
      title: "nav.reports", 
      description: "financeDashboard.reportsDesc", 
      icon: FileText, 
      color: "text-cyan-600", 
      bg: "bg-cyan-50",
      href: "/finance/reports"
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 p-8 pt-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t("nav.finance")}</h2>
          <p className="text-slate-500 mt-1">
            {t("financeDashboard.description")}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t("financeDashboard.totalBalance"), value: "2,500,000,000đ", trend: "+12%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
          { title: t("financeDashboard.pendingReconciliation"), value: "15", desc: t("financeDashboard.transactionsToReview"), icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
          { title: t("financeDashboard.monthlyRevenue"), value: "850,000,000đ", trend: "+8%", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
          { title: t("financeDashboard.expenses"), value: "320,000,000đ", trend: "+5%", icon: ArrowDown, color: "text-rose-600", bg: "bg-rose-100" },
        ].map((stat, i) => (
          <Card key={i} className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500">{stat.title}</CardTitle>
              <div className={`p-2 ${stat.bg} rounded-xl`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              {stat.trend && (
                <p className="text-xs text-slate-400 mt-1 font-medium flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1 text-emerald-500" />
                  {stat.trend} {t("dashboard.fromLastMonth")}
                </p>
              )}
              {stat.desc && (
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {stat.desc}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-emerald-100 bg-emerald-50/30 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-emerald-700">
                <LineChart className="h-5 w-5" />
                AI Profit Forecast
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={generateFinanceForecast}
                disabled={isAiLoading}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-xl"
              >
                {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription className="text-emerald-600/80">
              Dự báo dòng tiền và lợi nhuận ròng dựa trên xu hướng thị trường.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAiLoading ? (
              <div className="flex items-center gap-2 text-emerald-500/60 italic py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("finance.ai.calculating")}
              </div>
            ) : financeForecast ? (
              <div className="space-y-4">
                <div className="text-sm text-slate-700 leading-relaxed markdown-body bg-white/50 p-4 rounded-xl border border-emerald-100">
                  <Markdown>{financeForecast}</Markdown>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 rounded-lg">
                    Expected ROI: +18%
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Button 
                  variant="outline" 
                  onClick={generateFinanceForecast}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t("finance.ai.generateForecast")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-rose-100 bg-rose-50/30 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-700">
                <ShieldAlert className="h-5 w-5" />
                {t("finance.ai.anomalyDetection")}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={detectAnomalies}
                disabled={isAnomalyLoading}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-100 rounded-xl"
              >
                {isAnomalyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription className="text-rose-600/80">
              {t("finance.ai.anomalyDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnomalyLoading ? (
              <div className="flex items-center gap-2 text-rose-500/60 italic py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("finance.ai.scanning")}
              </div>
            ) : anomalyReport ? (
              <div className="text-sm text-slate-700 leading-relaxed markdown-body bg-white/50 p-4 rounded-xl border border-rose-100">
                <Markdown>{anomalyReport}</Markdown>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { id: 1, type: "High Value", desc: "Giao dịch 50tr từ IP lạ", status: "Reviewing" },
                  { id: 2, type: "Velocity", desc: "10 đơn hàng/phút từ 1 user", status: "Blocked" },
                ].map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={alert.status === 'Blocked' ? 'bg-rose-100 p-1.5 rounded-full' : 'bg-amber-100 p-1.5 rounded-full'}>
                        <ShieldAlert className={alert.status === 'Blocked' ? 'h-4 w-4 text-rose-600' : 'h-4 w-4 text-amber-600'} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{alert.type}</p>
                        <p className="text-xs text-slate-500">{alert.desc}</p>
                      </div>
                    </div>
                    <Badge variant={alert.status === 'Blocked' ? 'destructive' : 'outline'} className="rounded-lg">
                      {alert.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="link" className="w-full text-xs text-rose-600 font-bold" onClick={detectAnomalies}>
                  {t("finance.ai.runFullScan")} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">{t("financeDashboard.modules")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {financeModules.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-md transition-all cursor-pointer rounded-2xl border-slate-100 group"
              onClick={() => navigate(item.href)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-2xl ${item.bg}`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">{t(item.title)}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{t(item.description)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
