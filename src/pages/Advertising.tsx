import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
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
  Target,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Eye,
  Plus,
  Search,
  ChevronRight,
  Megaphone,
  BarChart3,
  Wallet
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { toast } from "sonner"

export function Advertising() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("bidding")

  const campaigns = [
    { id: "CAMP-001", name: "Sale 3.3 Top Search", type: t("advertising.bidding.topSearch"), keyword: "áo thun nam", bid: 5000, budget: 500000, status: "active" },
    { id: "CAMP-002", name: "Banner Home Spring", type: t("advertising.bidding.homeBanner"), keyword: "-", bid: 15000, budget: 2000000, status: "active" },
    { id: "CAMP-003", name: "Giày Sneaker Category", type: t("advertising.bidding.categoryBanner"), keyword: "giày thể thao", bid: 3000, budget: 300000, status: "paused" },
  ]

  const analytics = [
    { id: "CAMP-001", name: "Sale 3.3 Top Search", impressions: 15400, clicks: 1250, ctr: "8.1%", spend: 450000, revenue: 3500000, roas: "7.7x" },
    { id: "CAMP-002", name: "Banner Home Spring", impressions: 45000, clicks: 3100, ctr: "6.8%", spend: 1800000, revenue: 12500000, roas: "6.9x" },
  ]

  const navItems = [
    { id: "bidding", label: t("advertising.tabs.bidding"), icon: Megaphone },
    { id: "analytics", label: t("advertising.tabs.analytics"), icon: BarChart3 },
    { id: "revenue", label: t("advertising.tabs.revenue"), icon: Wallet },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("advertising.title")}</h1>
          <p className="text-muted-foreground">
            {t("advertising.description")}
          </p>
        </div>
        <Button onClick={() => toast.success(t("common.createSuccess", "Đã mở giao diện tạo chiến dịch quảng cáo"))}>
          <Plus className="mr-2 h-4 w-4" />
          {t("advertising.bidding.createCampaign")}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-6">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border shadow-sm p-6 min-h-[600px]">
            {activeTab === "bidding" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t("common.search")} className="pl-8" />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("advertising.bidding.campaignName")}</TableHead>
                      <TableHead>{t("advertising.bidding.position")}</TableHead>
                      <TableHead>{t("advertising.bidding.keyword")}</TableHead>
                      <TableHead className="text-right">{t("advertising.bidding.bidPrice")}</TableHead>
                      <TableHead className="text-right">{t("advertising.bidding.budget")}</TableHead>
                      <TableHead>{t("advertising.bidding.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((camp) => (
                      <TableRow key={camp.id}>
                        <TableCell className="font-medium">{camp.name}</TableCell>
                        <TableCell>{camp.type}</TableCell>
                        <TableCell>{camp.keyword}</TableCell>
                        <TableCell className="text-right">{camp.bid.toLocaleString()} ₫</TableCell>
                        <TableCell className="text-right">{camp.budget.toLocaleString()} ₫</TableCell>
                        <TableCell>
                          <Badge variant={camp.status === 'active' ? 'default' : 'secondary'}>
                            {camp.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("advertising.analytics.impressions")}</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">60.4K</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("advertising.analytics.clicks")}</CardTitle>
                      <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4,350</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("advertising.analytics.spend")}</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,250,000 ₫</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. ROAS</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">7.1x</div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("advertising.analytics.campaign")}</TableHead>
                      <TableHead className="text-right">{t("advertising.analytics.impressions")}</TableHead>
                      <TableHead className="text-right">{t("advertising.analytics.clicks")}</TableHead>
                      <TableHead className="text-right">{t("advertising.analytics.ctr")}</TableHead>
                      <TableHead className="text-right">{t("advertising.analytics.spend")}</TableHead>
                      <TableHead className="text-right">{t("advertising.analytics.revenue")}</TableHead>
                      <TableHead className="text-right">{t("advertising.analytics.roas")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.ctr}</TableCell>
                        <TableCell className="text-right">{item.spend.toLocaleString()} ₫</TableCell>
                        <TableCell className="text-right text-emerald-600">{item.revenue.toLocaleString()} ₫</TableCell>
                        <TableCell className="text-right font-bold text-blue-600">{item.roas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === "revenue" && (
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("advertising.revenue.totalAdRevenue")}</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">125,000,000 ₫</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("advertising.revenue.activeCampaigns")}</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,432</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("advertising.revenue.topSellers")}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
