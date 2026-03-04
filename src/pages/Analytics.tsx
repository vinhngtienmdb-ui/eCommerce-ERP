import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { BarChart, LineChart, PieChart, ShieldAlert } from "lucide-react";

export function Analytics() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("analytics.title")}</h2>
        <p className="text-muted-foreground">{t("analytics.description")}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("analytics.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="customers">{t("analytics.tabs.customers")}</TabsTrigger>
          <TabsTrigger value="platform">{t("analytics.tabs.platform")}</TabsTrigger>
          <TabsTrigger value="sellers">{t("analytics.tabs.sellers")}</TabsTrigger>
          <TabsTrigger value="fraud">{t("analytics.tabs.fraud")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
              </CardContent>
            </Card>
            {/* Add more summary cards */}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.rfm.title")}</CardTitle>
              <CardDescription>RFM Cohort Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-lg">
                RFM Visualization Placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.platform.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">{t("analytics.platform.aov")}</div>
                  <div className="text-2xl font-bold">$120</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">{t("analytics.platform.clv")}</div>
                  <div className="text-2xl font-bold">$450</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">{t("analytics.platform.cac")}</div>
                  <div className="text-2xl font-bold">$15</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <CardTitle>{t("analytics.fraud.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span>{t("analytics.fraud.buffOrders")}</span>
                  <span className="text-red-500 font-bold">12 detected</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span>{t("analytics.fraud.spamVoucher")}</span>
                  <span className="text-red-500 font-bold">5 detected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
