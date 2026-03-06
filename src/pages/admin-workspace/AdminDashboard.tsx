import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { 
  Box, 
  PenTool, 
  Calendar, 
  FileQuestion, 
  Star,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  ArrowUpRight,
  Plus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"

export function AdminDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const adminModules = [
    { 
      id: "assets", 
      title: "nav.assets", 
      description: "adminDashboard.assetsDesc", 
      icon: Box, 
      color: "text-blue-500", 
      bg: "bg-blue-100",
      href: "/admin-workspace/assets"
    },
    { 
      id: "stationery", 
      title: "nav.stationery", 
      description: "adminDashboard.stationeryDesc", 
      icon: PenTool, 
      color: "text-purple-500", 
      bg: "bg-purple-100",
      href: "/admin-workspace/stationery"
    },
    { 
      id: "booking", 
      title: "nav.booking", 
      description: "adminDashboard.bookingDesc", 
      icon: Calendar, 
      color: "text-green-500", 
      bg: "bg-green-100",
      href: "/admin-workspace/booking"
    },
    { 
      id: "requests", 
      title: "nav.requests", 
      description: "adminDashboard.requestsDesc", 
      icon: FileQuestion, 
      color: "text-orange-500", 
      bg: "bg-orange-100",
      href: "/admin-workspace/requests"
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("nav.adminWorkspace")}</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {t("adminDashboard.description")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <Clock className="mr-2 h-4 w-4" /> {t("common.history")}
          </Button>
          <Button size="sm" className="flex-1 md:flex-none">
            <Plus className="mr-2 h-4 w-4" /> {t("common.create")}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("adminDashboard.totalAssets")}</CardTitle>
            <Box className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12
              </span>
              <span className="text-xs text-muted-foreground ml-2">{t("adminDashboard.thisMonth")}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("adminDashboard.pendingRequests")}</CardTitle>
            <FileQuestion className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-orange-500 font-medium">{t("adminDashboard.urgent")}: 3</span>
              <span className="text-xs text-muted-foreground ml-2">{t("adminDashboard.awaitingApproval")}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("adminDashboard.roomBookings")}</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 font-medium">85%</span>
              <span className="text-xs text-muted-foreground ml-2">{t("adminDashboard.occupancyRate")}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("adminDashboard.stationeryOrders")}</CardTitle>
            <PenTool className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-purple-500 font-medium">$450</span>
              <span className="text-xs text-muted-foreground ml-2">{t("adminDashboard.spentThisWeek")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Resource Utilization */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>{t("adminDashboard.resourceUtilization")}</CardTitle>
            <CardDescription>{t("adminDashboard.utilizationDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full flex items-end justify-around pb-2 overflow-x-auto gap-2">
              {[
                { label: "Meeting Rooms", value: 85, color: "bg-blue-500" },
                { label: "Workstations", value: 92, color: "bg-green-500" },
                { label: "Parking", value: 65, color: "bg-orange-500" },
                { label: "Equipment", value: 78, color: "bg-purple-500" },
                { label: "Storage", value: 45, color: "bg-slate-500" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[60px] flex-1">
                  <div className="relative w-8 md:w-12 bg-muted rounded-t-lg overflow-hidden h-48">
                    <div 
                      className={`absolute bottom-0 left-0 w-full ${item.color} transition-all duration-500`} 
                      style={{ height: `${item.value}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-center font-medium uppercase truncate w-full px-1">{item.label}</span>
                  <span className="text-xs font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("adminDashboard.recentActivity")}</CardTitle>
            <CardDescription>{t("adminDashboard.activityDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "John Doe", action: "booked Room A", time: "10 mins ago", icon: Calendar, color: "text-blue-500" },
                { user: "Jane Smith", action: "requested Stationery", time: "25 mins ago", icon: PenTool, color: "text-purple-500" },
                { user: "System", action: "Asset AST-004 in maintenance", time: "1 hour ago", icon: Box, color: "text-orange-500" },
                { user: "Admin", action: "approved Request #452", time: "2 hours ago", icon: CheckCircle2, color: "text-green-500" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-full bg-muted`}>
                    <activity.icon className={`h-3.5 w-3.5 ${activity.color}`} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs" size="sm">
              {t("common.viewAll")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">{t("adminDashboard.modules")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminModules.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-md transition-all cursor-pointer relative group border-t-2 border-t-transparent hover:border-t-blue-500"
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
