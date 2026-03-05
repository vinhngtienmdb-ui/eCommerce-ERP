import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { 
  Wallet, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  DollarSign,
  Star,
  HelpCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"

export function FinanceDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const financeModules = [
    { 
      id: "accounting", 
      title: "nav.accounting", 
      description: "financeDashboard.accountingDesc", 
      icon: Wallet, 
      color: "text-blue-500", 
      bg: "bg-blue-100",
      href: "/finance/accounting"
    },
    { 
      id: "reconciliation", 
      title: "nav.reconciliation", 
      description: "financeDashboard.reconciliationDesc", 
      icon: FileText, 
      color: "text-purple-500", 
      bg: "bg-purple-100",
      href: "/finance/reconciliation"
    },
    { 
      id: "pnl", 
      title: "nav.pnl", 
      description: "financeDashboard.pnlDesc", 
      icon: TrendingUp, 
      color: "text-green-500", 
      bg: "bg-green-100",
      href: "/finance/pnl"
    },
    { 
      id: "paymentWallet", 
      title: "nav.paymentWallet", 
      description: "financeDashboard.paymentWalletDesc", 
      icon: CreditCard, 
      color: "text-orange-500", 
      bg: "bg-orange-100",
      href: "/finance/payment-wallet"
    },
    { 
      id: "sellerFinance", 
      title: "nav.sellerFinance", 
      description: "financeDashboard.sellerFinanceDesc", 
      icon: Users, 
      color: "text-pink-500", 
      bg: "bg-pink-100",
      href: "/finance/seller-finance"
    },
  ]

  return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("nav.finance")}</h2>
          <p className="text-muted-foreground">
            {t("financeDashboard.description")}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("financeDashboard.totalBalance")}</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,500,000,000đ</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("financeDashboard.pendingReconciliation")}</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <FileText className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("financeDashboard.transactionsToReview")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("financeDashboard.monthlyRevenue")}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850,000,000đ</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +8%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("financeDashboard.expenses")}</CardTitle>
            <div className="p-2 bg-rose-100 rounded-full">
              <ArrowDown className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320,000,000đ</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-rose-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +5%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">{t("financeDashboard.modules")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financeModules.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => navigate(item.href)}
            >
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-blue-400 cursor-pointer" />
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{t(item.title)}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{t(item.description)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
