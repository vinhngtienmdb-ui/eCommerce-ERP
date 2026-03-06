import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Briefcase,
  Rocket
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"

export function BusinessPlanning() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("planning.title")}</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {t("planning.description")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> {t("planning.newPlan")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="bg-muted/50 p-1 inline-flex w-auto min-w-full md:min-w-0">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background whitespace-nowrap">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t("planning.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-background whitespace-nowrap">
              <Briefcase className="mr-2 h-4 w-4" />
              {t("planning.tabs.businessPlan")}
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-background whitespace-nowrap">
              <Rocket className="mr-2 h-4 w-4" />
              {t("planning.tabs.marketingPlan")}
            </TabsTrigger>
            <TabsTrigger value="pnl" className="data-[state=active]:bg-background whitespace-nowrap">
              <BarChart3 className="mr-2 h-4 w-4" />
              {t("planning.tabs.pnlProjection")}
            </TabsTrigger>
            <TabsTrigger value="periodic" className="data-[state=active]:bg-background whitespace-nowrap">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {t("planning.tabs.periodicGoals")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("planning.stats.targetRevenue")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 font-medium">+18%</span> {t("planning.stats.fromLastYear")}
                </p>
                <Progress value={65} className="h-1 mt-3" />
                <p className="text-[10px] text-muted-foreground mt-1">65% {t("planning.stats.achieved")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("planning.stats.projectedPnl")}</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <p className="text-xs text-muted-foreground">
                  {t("planning.stats.margin")}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">{t("planning.stats.opEx")}</p>
                    <p className="text-xs font-bold">$850K</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">{t("planning.stats.netProfit")}</p>
                    <p className="text-xs font-bold text-emerald-600">$580K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("planning.stats.activeCampaigns")}</CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  4 {t("planning.stats.startingSoon")}
                </p>
                <div className="flex -space-x-2 mt-3 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold">
                      C{i}
                    </div>
                  ))}
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold">
                    +8
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("planning.stats.goalCompletion")}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">
                  18/22 {t("planning.stats.milestonesMet")}
                </p>
                <div className="grid grid-cols-4 gap-1 mt-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className={`h-1.5 rounded-full ${i <= 6 ? 'bg-emerald-500' : 'bg-muted'}`}></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>{t("planning.overview.revenueProjection")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-end justify-between gap-1 md:gap-2 pt-4 overflow-x-auto scrollbar-hide">
                  {[45, 52, 48, 61, 55, 67, 72, 85, 78, 92, 95, 110].map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[20px] w-full group">
                      <div className="relative w-full bg-muted rounded-t-sm overflow-hidden h-64">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-blue-500/80 group-hover:bg-blue-600 transition-all" 
                          style={{ height: `${val}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">M{i+1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>{t("planning.overview.upcomingMilestones")}</CardTitle>
                <CardDescription>{t("planning.overview.next30Days")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { title: "Q1 Marketing Launch", date: "Mar 12", status: "On Track", color: "bg-blue-500" },
                    { title: "Annual P&L Review", date: "Mar 18", status: "Pending", color: "bg-amber-500" },
                    { title: "New Product Strategy", date: "Mar 25", status: "Critical", color: "bg-red-500" },
                    { title: "Hiring Plan Approval", date: "Apr 02", status: "On Track", color: "bg-emerald-500" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full ${m.color} ring-4 ring-background`}></div>
                        {i !== 3 && <div className="w-0.5 h-12 bg-muted"></div>}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">{m.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{m.date}</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1">{m.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("planning.business.strategicGoals")}</CardTitle>
              <CardDescription>{t("planning.business.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { goal: "Market Expansion - SE Asia", category: "Growth", priority: "High", progress: 45, deadline: "Dec 2026" },
                  { goal: "Operational Efficiency - Automation", category: "Operations", priority: "Medium", progress: 72, deadline: "Aug 2026" },
                  { goal: "Customer Retention Program", category: "Marketing", priority: "High", progress: 20, deadline: "Oct 2026" },
                  { goal: "Sustainability Initiative", category: "CSR", priority: "Low", progress: 90, deadline: "Jun 2026" },
                ].map((g, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">{g.goal}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">{g.category}</Badge>
                          <span className="text-[10px] text-muted-foreground">Deadline: {g.deadline}</span>
                        </div>
                      </div>
                      <Badge className={g.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                        {g.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={g.progress} className="h-2" />
                      <span className="text-xs font-bold w-8">{g.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pnl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("planning.pnl.projectionTable")}</CardTitle>
              <CardDescription>{t("planning.pnl.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto scrollbar-hide">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">{t("planning.pnl.category")}</th>
                      <th className="text-right p-3 font-medium">Q1 (Est)</th>
                      <th className="text-right p-3 font-medium">Q2 (Est)</th>
                      <th className="text-right p-3 font-medium">Q3 (Est)</th>
                      <th className="text-right p-3 font-medium">Q4 (Est)</th>
                      <th className="text-right p-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-emerald-50/30">
                      <td className="p-3 font-bold">{t("planning.pnl.totalRevenue")}</td>
                      <td className="text-right p-3">$450K</td>
                      <td className="text-right p-3">$580K</td>
                      <td className="text-right p-3">$620K</td>
                      <td className="text-right p-3">$750K</td>
                      <td className="text-right p-3 font-bold">$2.4M</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">{t("planning.pnl.cogs")}</td>
                      <td className="text-right p-3">($180K)</td>
                      <td className="text-right p-3">($232K)</td>
                      <td className="text-right p-3">($248K)</td>
                      <td className="text-right p-3">($300K)</td>
                      <td className="text-right p-3">($960K)</td>
                    </tr>
                    <tr className="border-b font-bold">
                      <td className="p-3">{t("planning.pnl.grossProfit")}</td>
                      <td className="text-right p-3">$270K</td>
                      <td className="text-right p-3">$348K</td>
                      <td className="text-right p-3">$372K</td>
                      <td className="text-right p-3">$450K</td>
                      <td className="text-right p-3">$1.44M</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">{t("planning.pnl.operatingExpenses")}</td>
                      <td className="text-right p-3">($150K)</td>
                      <td className="text-right p-3">($165K)</td>
                      <td className="text-right p-3">($170K)</td>
                      <td className="text-right p-3">($185K)</td>
                      <td className="text-right p-3">($670K)</td>
                    </tr>
                    <tr className="bg-blue-50/30 font-bold">
                      <td className="p-3">{t("planning.pnl.netIncome")}</td>
                      <td className="text-right p-3 text-emerald-600">$120K</td>
                      <td className="text-right p-3 text-emerald-600">$183K</td>
                      <td className="text-right p-3 text-emerald-600">$202K</td>
                      <td className="text-right p-3 text-emerald-600">$265K</td>
                      <td className="text-right p-3 text-emerald-600">$770K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="periodic" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Roadmap (Q1-Q4)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                    <div key={q} className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {q}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Strategic Focus: {q === 'Q1' ? 'Foundation' : q === 'Q2' ? 'Growth' : q === 'Q3' ? 'Optimization' : 'Scale'}</p>
                          <p className="text-xs text-muted-foreground">3 key milestones</p>
                        </div>
                      </div>
                      <Badge variant={q === 'Q1' ? 'default' : 'outline'}>
                        {q === 'Q1' ? t("planning.periodic.inProgress") : t("planning.periodic.completed")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Goals (March)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { goal: "Reach 50k active users", progress: 85 },
                    { goal: "Launch mobile app v2.0", progress: 60 },
                    { goal: "Reduce churn rate to 2%", progress: 40 },
                    { goal: "Onboard 10 new enterprise clients", progress: 20 },
                  ].map((g, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>{g.goal}</span>
                        <span className="font-bold">{g.progress}%</span>
                      </div>
                      <Progress value={g.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
