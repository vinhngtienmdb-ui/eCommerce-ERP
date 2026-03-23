import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { BarChart, LineChart, PieChart, ShieldAlert, Users, Zap, DollarSign, Download, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";

export function Analytics() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{t("analytics.title")}</h2>
          <p className="text-muted-foreground/70 text-base font-medium">{t("analytics.description")}</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-10 px-6 font-semibold shadow-lg shadow-primary/10 transition-all active:scale-95"
          onClick={() => toast.success(t("common.exportSuccess", "Đã xuất báo cáo thành công"))}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("common.exportReport")}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <div className="rounded-[32px] border-none bg-white shadow-2xl shadow-slate-200/30 overflow-hidden">
          <div className="border-b border-slate-100 px-8 bg-slate-50/30">
            <TabsList className="flex h-auto p-0 bg-transparent gap-8 overflow-x-auto scrollbar-hide">
              {[
                { id: "overview", label: t("analytics.tabs.overview"), icon: BarChart },
                { id: "customers", label: t("analytics.tabs.customers"), icon: Users },
                { id: "platform", label: t("analytics.tabs.platform"), icon: Zap },
                { id: "sellers", label: t("analytics.tabs.sellers"), icon: PieChart },
                { id: "fraud", label: t("analytics.tabs.fraud"), icon: ShieldAlert },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "py-5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap flex items-center gap-2 rounded-none border-b-2 border-transparent",
                    "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent",
                    "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="m-0 p-8 space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: t("analytics.stats.totalRevenue"), value: "$45,231.89", icon: DollarSign, color: "emerald", trend: "+12.5%", isUp: true },
                { title: t("analytics.stats.activeUsers"), value: "1,234", icon: Users, color: "blue", trend: "+5.2%", isUp: true },
                { title: t("analytics.stats.conversionRate"), value: "3.2%", icon: Zap, color: "amber", trend: "-0.4%", isUp: false },
                { title: t("analytics.stats.avgOrderValue"), value: "$120", icon: BarChart, color: "purple", trend: "+2.1%", isUp: true },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-xl shadow-slate-200/20 rounded-[24px] overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.title}</CardTitle>
                    <div className={cn(
                      "p-3 rounded-xl transition-transform group-hover:scale-110 duration-500",
                      stat.color === "emerald" && "bg-emerald-50/50 text-emerald-600",
                      stat.color === "blue" && "bg-blue-50/50 text-blue-600",
                      stat.color === "amber" && "bg-amber-50/50 text-amber-600",
                      stat.color === "purple" && "bg-purple-50/50 text-purple-600"
                    )}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</div>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.isUp ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-rose-500" />}
                      <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider",
                        stat.isUp ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {stat.trend}
                      </span>
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">{t("common.vsLastMonth", "so với tháng trước")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/20 rounded-[32px] overflow-hidden bg-slate-50/30">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-semibold text-slate-900">{t("analytics.revenueChart.title", "Biểu đồ doanh thu")}</CardTitle>
                <CardDescription className="text-slate-500/70 font-medium text-sm">{t("analytics.revenueChart.desc", "Phân tích doanh thu theo thời gian")}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-[24px] bg-white/50">
                  <TrendingUp className="h-12 w-12 text-slate-200 mb-4" />
                  <p className="font-semibold uppercase tracking-[0.2em] text-slate-400 text-[10px]">{t("analytics.chartPlaceholder", "Dữ liệu biểu đồ đang được xử lý")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="m-0 p-8 space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/20 rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-semibold text-slate-900">{t("analytics.rfm.title")}</CardTitle>
                <CardDescription className="text-slate-500/70 font-medium text-sm">{t("analytics.rfm.description")}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-[24px] bg-slate-50/30">
                  <Users className="h-12 w-12 text-slate-200 mb-4" />
                  <p className="font-semibold uppercase tracking-[0.2em] text-slate-400 text-[10px]">{t("analytics.rfm.placeholder")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform" className="m-0 p-8 space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/20 rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-semibold text-slate-900">{t("analytics.platform.title")}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    { label: t("analytics.platform.aov"), value: "$120", color: "blue" },
                    { label: t("analytics.platform.clv"), value: "$450", color: "purple" },
                    { label: t("analytics.platform.cac"), value: "$15", color: "rose" },
                  ].map((item, i) => (
                    <div key={i} className="p-8 rounded-[24px] bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">{item.label}</div>
                      <div className={cn(
                        "text-3xl font-semibold tracking-tight",
                        item.color === "blue" && "text-blue-600",
                        item.color === "purple" && "text-purple-600",
                        item.color === "rose" && "text-rose-600"
                      )}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fraud" className="m-0 p-8 space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/20 rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4 flex flex-row items-center gap-4">
                <div className="p-3 bg-rose-50/50 rounded-xl">
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">{t("analytics.fraud.title")}</CardTitle>
                  <CardDescription className="text-slate-500/70 font-medium text-sm">{t("analytics.fraud.desc", "Giám sát các hoạt động bất thường")}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="space-y-4">
                  {[
                    { label: t("analytics.fraud.buffOrders"), count: 12 },
                    { label: t("analytics.fraud.spamVoucher"), count: 5 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-xl bg-rose-50/30 border border-rose-100 group hover:bg-rose-50/50 transition-all">
                      <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                      <Badge className="bg-rose-100/50 text-rose-700 border-none font-semibold px-3 py-1 rounded-lg text-[10px]">
                        {t("analytics.fraud.detected", { count: item.count })}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
