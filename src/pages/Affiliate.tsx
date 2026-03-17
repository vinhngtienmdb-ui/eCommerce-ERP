import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
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
  Users,
  DollarSign,
  MousePointerClick,
  Link as LinkIcon,
  Plus,
  Copy,
  Save,
  Trash2,
  ChevronRight,
  LayoutDashboard,
  UserCog,
  Receipt,
  Target
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { toast } from "sonner"

export function Affiliate() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock Data
  const publishers = [
    {
      id: 1,
      name: "Nguyen Van A",
      type: "kol",
      followers: "1.2M",
      commissionRate: 10,
      status: "active",
    },
    {
      id: 2,
      name: "Review Cong Nghe",
      type: "content_creator",
      followers: "500K",
      commissionRate: 8,
      status: "active",
    },
    {
      id: 3,
      name: "Sandeal.vn",
      type: "coupon_site",
      followers: "N/A",
      commissionRate: 5,
      status: "active",
    },
    {
      id: 4,
      name: "HoanTien 247",
      type: "cashback",
      followers: "200K",
      commissionRate: 3,
      status: "inactive",
    },
  ]

  const [trackingUrl, setTrackingUrl] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [campaignSource, setCampaignSource] = useState("")
  const [campaignMedium, setCampaignMedium] = useState("")
  const [campaignName, setCampaignName] = useState("")

  const generateTrackingLink = () => {
    if (!sourceUrl) return;
    try {
      const url = new URL(sourceUrl);
      if (campaignSource) url.searchParams.set("utm_source", campaignSource);
      if (campaignMedium) url.searchParams.set("utm_medium", campaignMedium);
      if (campaignName) url.searchParams.set("utm_campaign", campaignName);
      setTrackingUrl(url.toString());
      toast.success(t("affiliate.tracking.generatedSuccess"));
    } catch (e) {
      toast.error(t("affiliate.tracking.invalidUrl"));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingUrl);
    toast.success(t("common.copiedToClipboard"));
  };

  const navItems = [
    { id: "overview", label: t("affiliate.tabs.overview"), icon: LayoutDashboard },
    { id: "publishers", label: t("affiliate.tabs.publishers"), icon: UserCog },
    { id: "commissions", label: t("affiliate.tabs.commissions"), icon: Receipt },
    { id: "tracking", label: t("affiliate.tabs.tracking"), icon: Target },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("affiliate.title")}
          </h2>
          <p className="text-muted-foreground">{t("affiliate.description")}</p>
        </div>
        <Button onClick={() => toast.info(t("common.featureComingSoon"))}>
          <Plus className="mr-2 h-4 w-4" /> {t("affiliate.publishers.invite")}
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
            {activeTab === "overview" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("affiliate.overview.totalRevenue")}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₫245,000,000</div>
                      <p className="text-xs text-muted-foreground">
                        {t("affiliate.overview.fromLastMonth", { percentage: "+20.1%" })}
                      </p>
                    </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("affiliate.overview.activePublishers")}
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+120</div>
                      <p className="text-xs text-muted-foreground">
                        {t("affiliate.overview.newThisMonth", { count: 15 })}
                      </p>
                    </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("affiliate.overview.totalCommissions")}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₫35,000,000</div>
                      <p className="text-xs text-muted-foreground">
                        {t("affiliate.overview.ofRevenue", { percentage: "14.2%" })}
                      </p>
                    </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("affiliate.overview.clicks")}
                    </CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45,231</div>
                      <p className="text-xs text-muted-foreground">
                        {t("affiliate.overview.fromLastMonth", { percentage: "+12%" })}
                      </p>
                    </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "publishers" && (
              <Card>
                  <CardHeader>
                    <CardTitle>{t("affiliate.tabs.publishers")}</CardTitle>
                    <CardDescription>
                      {t("affiliate.publishers.description")}
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("affiliate.publishers.name")}</TableHead>
                        <TableHead>{t("affiliate.publishers.type")}</TableHead>
                        <TableHead>{t("affiliate.publishers.followers")}</TableHead>
                        <TableHead className="text-right">
                          {t("affiliate.publishers.commissionRate")}
                        </TableHead>
                        <TableHead>{t("affiliate.publishers.status")}</TableHead>
                        <TableHead className="text-right">
                          {t("affiliate.publishers.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publishers.map((pub) => (
                        <TableRow key={pub.id}>
                          <TableCell className="font-medium">{pub.name}</TableCell>
                          <TableCell>
                            {t(`affiliate.publishers.types.${pub.type}`)}
                          </TableCell>
                          <TableCell>{pub.followers}</TableCell>
                          <TableCell className="text-right">
                            {pub.commissionRate}%
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                pub.status === "active" ? "default" : "secondary"
                              }
                            >
                              {t(`affiliate.publishers.statuses.${pub.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => toast.info(t("common.featureComingSoon"))}>
                              {t("common.edit")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "commissions" && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium">
                      {t("affiliate.commissions.defaultRate")}
                    </label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input className="w-24" defaultValue="5" type="number" />
                      <span>%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {t("affiliate.commissions.categoryRates")}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => toast.info(t("common.featureComingSoon"))}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t("affiliate.commissions.addCategory")}
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("affiliate.commissions.category")}</TableHead>
                        <TableHead className="w-[150px]">
                          {t("affiliate.commissions.rate")}
                        </TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{t("affiliate.commissions.categories.Electronics")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              className="h-8 w-20"
                              defaultValue="3"
                              type="number"
                            />
                            <span>%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => toast.info(t("common.featureComingSoon"))}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t("affiliate.commissions.categories.Fashion")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              className="h-8 w-20"
                              defaultValue="10"
                              type="number"
                            />
                            <span>%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => toast.info(t("common.featureComingSoon"))}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => toast.success(t("common.savedSuccessfully"))}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("affiliate.commissions.save")}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "tracking" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    {t("affiliate.tracking.sourceUrl")}
                  </label>
                  <Input
                    placeholder="https://yourshop.com/product/..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      {t("affiliate.tracking.campaignSource")}
                    </label>
                    <Input
                      placeholder="google, facebook, newsletter"
                      value={campaignSource}
                      onChange={(e) => setCampaignSource(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      {t("affiliate.tracking.campaignMedium")}
                    </label>
                    <Input
                      placeholder="cpc, banner, email"
                      value={campaignMedium}
                      onChange={(e) => setCampaignMedium(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      {t("affiliate.tracking.campaignName")}
                    </label>
                    <Input
                      placeholder="summer_sale, black_friday"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={generateTrackingLink} className="w-full md:w-auto">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  {t("affiliate.tracking.generate")}
                </Button>

                {trackingUrl && (
                  <div className="mt-6 rounded-lg border bg-muted p-4">
                    <label className="mb-2 block text-sm font-medium">
                      {t("affiliate.tracking.generatedUrl")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input readOnly value={trackingUrl} className="bg-white" />
                      <Button variant="outline" onClick={copyToClipboard}>
                        <Copy className="mr-2 h-4 w-4" />
                        {t("affiliate.tracking.copy")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
