import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import {
  Users,
  DollarSign,
  MousePointerClick,
  Link as LinkIcon,
  Plus,
  Copy,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function Affiliate() {
  const { t } = useTranslation();

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
  ];

  const [trackingUrl, setTrackingUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [campaignSource, setCampaignSource] = useState("");
  const [campaignMedium, setCampaignMedium] = useState("");
  const [campaignName, setCampaignName] = useState("");

  const generateTrackingLink = () => {
    if (!sourceUrl) return;
    const url = new URL(sourceUrl);
    if (campaignSource) url.searchParams.set("utm_source", campaignSource);
    if (campaignMedium) url.searchParams.set("utm_medium", campaignMedium);
    if (campaignName) url.searchParams.set("utm_campaign", campaignName);
    setTrackingUrl(url.toString());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingUrl);
    // In a real app, show a toast here
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("affiliate.title")}
          </h2>
          <p className="text-muted-foreground">{t("affiliate.description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("affiliate.publishers.invite")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("affiliate.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="publishers">
            {t("affiliate.tabs.publishers")}
          </TabsTrigger>
          <TabsTrigger value="commissions">
            {t("affiliate.tabs.commissions")}
          </TabsTrigger>
          <TabsTrigger value="tracking">
            {t("affiliate.tabs.tracking")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
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
                  +20.1% from last month
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
                  +15 new this month
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
                  14.2% of revenue
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
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Publishers Tab */}
        <TabsContent value="publishers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("affiliate.tabs.publishers")}</CardTitle>
              <CardDescription>
                Manage your network of publishers and KOLs.
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
                          {pub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("affiliate.commissions.title")}</CardTitle>
              <CardDescription>
                {t("affiliate.commissions.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <Button variant="outline" size="sm">
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
                      <TableCell>Electronics</TableCell>
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
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fashion</TableCell>
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
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t("affiliate.commissions.save")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("affiliate.tracking.title")}</CardTitle>
              <CardDescription>
                {t("affiliate.tracking.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
