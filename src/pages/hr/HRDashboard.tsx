import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { 
  Users, 
  Clock, 
  Banknote, 
  Award, 
  Briefcase,
  Star,
  HelpCircle,
  UserCheck,
  CalendarCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"

export function HRDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hrModules = [
    { 
      id: "coreHr", 
      title: "nav.coreHr", 
      description: "hrDashboard.coreHrDesc", 
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-100",
      href: "/hr/core"
    },
    { 
      id: "timeAttendance", 
      title: "nav.timeAttendance", 
      description: "hrDashboard.timeAttendanceDesc", 
      icon: Clock, 
      color: "text-purple-500", 
      bg: "bg-purple-100",
      href: "/hr/time"
    },
    { 
      id: "payroll", 
      title: "nav.payroll", 
      description: "hrDashboard.payrollDesc", 
      icon: Banknote, 
      color: "text-green-500", 
      bg: "bg-green-100",
      href: "/hr/payroll"
    },
    { 
      id: "performance", 
      title: "nav.performance", 
      description: "hrDashboard.performanceDesc", 
      icon: Award, 
      color: "text-orange-500", 
      bg: "bg-orange-100",
      href: "/hr/performance"
    },
  ]

  return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("nav.hr")}</h2>
          <p className="text-muted-foreground">
            {t("hrDashboard.description")}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hrDashboard.totalEmployees")}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("hrDashboard.activeEmployees")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hrDashboard.onLeaveToday")}</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <CalendarCheck className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("hrDashboard.leaveDetails")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hrDashboard.openPositions")}</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Briefcase className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("hrDashboard.hiringInProgress")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hrDashboard.newHires")}</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("hrDashboard.onboardingCompleted")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">{t("hrDashboard.modules")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hrModules.map((item) => (
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
