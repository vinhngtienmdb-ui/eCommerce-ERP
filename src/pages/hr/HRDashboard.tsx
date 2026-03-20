import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { 
  Users, 
  Clock, 
  Banknote, 
  Award, 
  Briefcase,
  Star,
  HelpCircle,
  UserCheck,
  CalendarCheck,
  MoreHorizontal,
  Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"

export function HRDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hrModules = [
    { 
      id: "hrPayroll", 
      title: "nav.hrPayroll", 
      description: "hrDashboard.hrPayrollDesc", 
      icon: Banknote, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      href: "/hr/payroll"
    },
    { 
      id: "hrSocialInsurance", 
      title: "nav.hrSocialInsurance", 
      description: "hrDashboard.hrSocialInsuranceDesc", 
      icon: Briefcase, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      href: "/hr/social-insurance"
    },
    { 
      id: "hrRecruitment", 
      title: "nav.hrRecruitment", 
      description: "hrDashboard.hrRecruitmentDesc", 
      icon: UserCheck, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      href: "/hr/recruitment"
    },
    { 
      id: "hrEmployees", 
      title: "nav.hrEmployees", 
      description: "hrDashboard.hrEmployeesDesc", 
      icon: Users, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50",
      href: "/hr/employees"
    },
    { 
      id: "hrTimeAttendance", 
      title: "nav.hrTimeAttendance", 
      description: "hrDashboard.hrTimeAttendanceDesc", 
      icon: Clock, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      href: "/hr/time-attendance"
    },
    { 
      id: "hrLeave", 
      title: "hr.core.leaveManagement", 
      description: "hr.core.leaveManagementDesc", 
      icon: CalendarCheck, 
      color: "text-pink-600", 
      bg: "bg-pink-50",
      href: "/hr/leave"
    },
    { 
      id: "hrPerformance", 
      title: "nav.hrPerformance", 
      description: "hrDashboard.hrPerformanceDesc", 
      icon: Award, 
      color: "text-yellow-600", 
      bg: "bg-yellow-50",
      href: "/hr/performance"
    },
    { 
      id: "hrPit", 
      title: "nav.hrPit", 
      description: "hrDashboard.hrPitDesc", 
      icon: Banknote, 
      color: "text-rose-600", 
      bg: "bg-rose-50",
      href: "/hr/pit"
    },
    { 
      id: "hrGoals", 
      title: "nav.hrGoals", 
      description: "hrDashboard.hrGoalsDesc", 
      icon: Star, 
      color: "text-teal-600", 
      bg: "bg-teal-50",
      href: "/hr/goals"
    },
    { 
      id: "hrInfo", 
      title: "nav.hrInfo", 
      description: "hrDashboard.hrInfoDesc", 
      icon: HelpCircle, 
      color: "text-slate-600", 
      bg: "bg-slate-100",
      href: "/hr/info"
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 p-8 pt-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t("nav.hr")}</h2>
          <p className="text-slate-500 mt-1">
            {t("hrDashboard.description")}
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200">
          {t("common.create")}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t("hrDashboard.totalEmployees"), value: "124", desc: t("hrDashboard.activeEmployees"), icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { title: t("hrDashboard.onLeaveToday"), value: "3", desc: t("hrDashboard.leaveDetails"), icon: CalendarCheck, color: "text-purple-600", bg: "bg-purple-100" },
          { title: t("hrDashboard.openPositions"), value: "5", desc: t("hrDashboard.hiringInProgress"), icon: Briefcase, color: "text-orange-600", bg: "bg-orange-100" },
          { title: t("hrDashboard.newHires"), value: "2", desc: t("hrDashboard.onboardingCompleted"), icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
        ].map((stat, i) => (
          <Card key={i} className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500">{stat.title}</CardTitle>
              <div className={`p-2 ${stat.bg} rounded-xl`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">{t("hrDashboard.modules")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {hrModules.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-md transition-all cursor-pointer rounded-2xl border-slate-100 group"
              onClick={() => navigate(item.href)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-2xl ${item.bg}`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">{t(item.title)}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{t(item.description)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="font-bold">{t("hrDashboard.recentActivity")}</CardTitle>
            <CardDescription>{t("hrDashboard.recentActivityDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100", title: t("hrDashboard.newEmployeeJoined", { name: "Lê Văn C" }), desc: t("hrDashboard.onboardingCompleted"), time: t("hrDashboard.timeAgo", { count: 2 }) },
              { icon: CalendarCheck, color: "text-purple-600", bg: "bg-purple-100", title: t("hrDashboard.leaveApproved", { name: "Phạm Thị D" }), desc: t("hrDashboard.approvedByManager"), time: t("hrDashboard.timeAgo", { count: 5 }) },
              { icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100", title: t("hrDashboard.recruitmentFrontend"), desc: t("hrDashboard.newCandidates"), time: t("hrDashboard.timeAgo", { count: 24 }) },
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`p-2.5 ${act.bg} rounded-xl`}>
                  <act.icon className={`w-5 h-5 ${act.color}`} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 leading-none">{act.title}</p>
                  <p className="text-xs text-slate-500">{act.desc}</p>
                </div>
                <div className="text-xs font-medium text-slate-400">{act.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="font-bold">{t("hrDashboard.upcomingTasks")}</CardTitle>
            <CardDescription>{t("hrDashboard.upcomingTasksDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { color: "bg-rose-500", title: t("hrDashboard.payrollDeadline"), desc: t("hrDashboard.deadlineDate", { date: "25/11/2023" }) },
              { color: "bg-amber-500", title: t("hrDashboard.performanceReview"), desc: t("hrDashboard.startDate", { date: "01/12/2023" }) },
              { color: "bg-blue-500", title: t("hrDashboard.contractRenewal", { name: "Trần Thị B" }), desc: t("hrDashboard.expiryDate", { date: "15/12/2023" }) },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-2 h-2 ${task.color} rounded-full`}></div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 leading-none">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.desc}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-slate-200">{t("hrDashboard.process")}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
