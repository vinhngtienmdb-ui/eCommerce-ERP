import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  Search,
  TrendingUp,
  DollarSign,
  CreditCard,
  Percent,
  CalendarClock
} from "lucide-react"

export function SellerFinance() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("credit")

  const credits = [
    { id: "SEL-001", name: "Fashion Store VN", score: 850, performance: t("sellerFinance.credit.excellent"), limit: 500000000, status: "approved" },
    { id: "SEL-002", name: "Tech Gadgets", score: 720, performance: t("sellerFinance.credit.good"), limit: 200000000, status: "pending" },
    { id: "SEL-003", name: "Home Decor", score: 610, performance: t("sellerFinance.credit.average"), limit: 50000000, status: "rejected" },
  ]

  const payouts = [
    { id: "PAY-101", seller: "Fashion Store VN", amount: 150000000, fee: 1500000, net: 148500000, date: "2026-03-05", status: "processing" },
    { id: "PAY-102", seller: "Tech Gadgets", amount: 45000000, fee: 450000, net: 44550000, date: "2026-03-02", status: "completed" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("sellerFinance.title")}</h1>
          <p className="text-muted-foreground">
            {t("sellerFinance.description")}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="credit">{t("sellerFinance.tabs.credit")}</TabsTrigger>
          <TabsTrigger value="earlyPayout">{t("sellerFinance.tabs.earlyPayout")}</TabsTrigger>
        </TabsList>

        <TabsContent value="credit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Credit Line</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">12.5B ₫</div>
                <p className="text-xs text-muted-foreground">Across all sellers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Credit Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">745</div>
                <p className="text-xs text-muted-foreground">Good standing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">Sellers currently utilizing credit</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("sellerFinance.tabs.credit")}</CardTitle>
              <CardDescription>Seller credit scoring based on platform performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("common.search")} className="pl-8" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sellerFinance.credit.sellerName")}</TableHead>
                    <TableHead className="text-right">{t("sellerFinance.credit.creditScore")}</TableHead>
                    <TableHead>{t("sellerFinance.credit.performance")}</TableHead>
                    <TableHead className="text-right">{t("sellerFinance.credit.loanLimit")}</TableHead>
                    <TableHead>{t("sellerFinance.credit.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell className="font-medium">{credit.name}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">{credit.score}</TableCell>
                      <TableCell>{credit.performance}</TableCell>
                      <TableCell className="text-right">{credit.limit.toLocaleString()} ₫</TableCell>
                      <TableCell>
                        <Badge variant={credit.status === 'approved' ? 'default' : credit.status === 'pending' ? 'secondary' : 'destructive'}>
                          {credit.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">{t("common.viewDetails")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earlyPayout" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Early Payouts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2B ₫</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fee Revenue</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">42M ₫</div>
                <p className="text-xs text-muted-foreground">From discount fees (1%)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">18</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("sellerFinance.tabs.earlyPayout")}</CardTitle>
                <CardDescription>Manage early payout requests from sellers</CardDescription>
              </div>
              <Button>
                {t("sellerFinance.earlyPayout.requestPayout")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sellerFinance.credit.sellerName")}</TableHead>
                    <TableHead className="text-right">{t("sellerFinance.earlyPayout.amount")}</TableHead>
                    <TableHead className="text-right">{t("sellerFinance.earlyPayout.fee")}</TableHead>
                    <TableHead className="text-right">{t("sellerFinance.earlyPayout.netAmount")}</TableHead>
                    <TableHead>{t("sellerFinance.earlyPayout.payoutDate")}</TableHead>
                    <TableHead>{t("sellerFinance.earlyPayout.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.seller}</TableCell>
                      <TableCell className="text-right">{payout.amount.toLocaleString()} ₫</TableCell>
                      <TableCell className="text-right text-red-500">-{payout.fee.toLocaleString()} ₫</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">{payout.net.toLocaleString()} ₫</TableCell>
                      <TableCell>{payout.date}</TableCell>
                      <TableCell>
                        <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                          {payout.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
