import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  FileText, 
  Target, 
  Wallet, 
  User, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Settings
} from "lucide-react"

export function EmployeePortal() {
  const { t } = useTranslation()
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [visibleWidgets, setVisibleWidgets] = useState({
    stats: true,
    quickActions: true,
    recentRequests: true,
    announcements: true,
    kpi: true
  })

  return (
    <div className="p-4 md:p-8 bg-[#F8F9FA] min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            VN
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t("hr.portal.welcome", { name: "Vinh Nguyen" })}</h1>
            <p className="text-slate-500">Chuyên viên Marketing • Phòng Marketing</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isCustomizing ? "default" : "outline"} 
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="mr-2 h-4 w-4" /> {isCustomizing ? t("hr.portal.saveConfig") : t("hr.portal.customize")}
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Clock className="mr-2 h-4 w-4" /> {t("hr.portal.checkIn")}
          </Button>
        </div>
      </div>

      {isCustomizing && (
        <Card className="bg-slate-50 border-dashed border-2">
          <CardContent className="p-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.stats} onChange={(e) => setVisibleWidgets(p => ({...p, stats: e.target.checked}))} />
              {t("hr.portal.widgets.stats")}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.quickActions} onChange={(e) => setVisibleWidgets(p => ({...p, quickActions: e.target.checked}))} />
              {t("hr.portal.widgets.quickActions")}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.recentRequests} onChange={(e) => setVisibleWidgets(p => ({...p, recentRequests: e.target.checked}))} />
              {t("hr.portal.widgets.recentRequests")}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.announcements} onChange={(e) => setVisibleWidgets(p => ({...p, announcements: e.target.checked}))} />
              {t("hr.portal.widgets.announcements")}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visibleWidgets.kpi} onChange={(e) => setVisibleWidgets(p => ({...p, kpi: e.target.checked}))} />
              {t("hr.portal.widgets.kpi")}
            </label>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {visibleWidgets.stats && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">{t("hr.portal.stats.leaveBalance")}</p>
              <p className="text-2xl font-bold text-slate-900">12.5 <span className="text-sm font-normal text-slate-500">{t("hr.portal.stats.days")}</span></p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">{t("hr.portal.stats.workHours")}</p>
              <p className="text-2xl font-bold text-slate-900">142 <span className="text-sm font-normal text-slate-500">{t("hr.portal.stats.hours")}</span></p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">{t("hr.portal.stats.kpiProgress")}</p>
              <p className="text-2xl font-bold text-slate-900">85%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">{t("hr.portal.stats.netSalary")}</p>
              <p className="text-2xl font-bold text-slate-900">0 <span className="text-sm font-normal text-slate-500">VNĐ</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Recent */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          {visibleWidgets.quickActions && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t("hr.portal.quickActions.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: t("hr.portal.quickActions.leaveRequest"), icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { title: t("hr.portal.quickActions.overtime"), icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
                  { title: t("hr.portal.quickActions.payslip"), icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
                  { title: t("hr.portal.quickActions.updateInfo"), icon: User, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((action, i) => (
                  <Button key={i} variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${action.bg} ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          )}

          {/* Recent Requests */}
          {visibleWidgets.recentRequests && (
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("hr.portal.recentRequests.title")}</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600">{t("hr.portal.recentRequests.viewAll")} <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: t("hr.portal.recentRequests.annualLeave") + " (2 ngày)", date: "18/03/2026", status: t("hr.portal.recentRequests.approved"), icon: CheckCircle2, color: "text-emerald-600" },
                  { title: t("hr.portal.recentRequests.overtime"), date: "15/03/2026", status: t("hr.portal.recentRequests.pending"), icon: AlertCircle, color: "text-orange-600" },
                  { title: t("hr.portal.recentRequests.sickLeave"), date: "10/03/2026", status: t("hr.portal.recentRequests.approved"), icon: CheckCircle2, color: "text-emerald-600" },
                ].map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center ${req.color}`}>
                        <req.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{req.title}</p>
                        <p className="text-xs text-slate-500">{req.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={req.status === t("hr.portal.recentRequests.approved") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}>
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Right Column: Announcements & KPI */}
        <div className="space-y-8">
          {visibleWidgets.announcements && (
          <Card className="border-none shadow-sm bg-gradient-to-b from-indigo-900 to-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg text-white">{t("hr.portal.announcements.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <Badge className="bg-rose-500 hover:bg-rose-600 mb-2">Quan trọng</Badge>
                <h3 className="font-bold mb-1">{t("hr.portal.announcements.holidayNotice")}</h3>
                <p className="text-sm text-slate-300">Vui lòng đọc kỹ các thay đổi về phụ cấp và giờ làm việc áp dụng từ 01/04.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <Badge className="bg-blue-500 hover:bg-blue-600 mb-2">Sự kiện</Badge>
                <h3 className="font-bold mb-1">{t("hr.portal.announcements.teamBuilding")}</h3>
                <p className="text-sm text-slate-300">Đăng ký tham gia chuyến đi Phú Quốc trước ngày 25/03.</p>
              </div>
            </CardContent>
          </Card>
          )}

          {visibleWidgets.kpi && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t("hr.portal.widgets.kpi")} Tháng 3</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Doanh thu mang về</span>
                  <span className="text-indigo-600">85%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[85%]" />
                </div>
                <p className="text-xs text-slate-500 text-right">850M / 1B VNĐ</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Khách hàng mới</span>
                  <span className="text-emerald-600">100%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-full" />
                </div>
                <p className="text-xs text-slate-500 text-right">50 / 50 Khách</p>
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>
  )
}
