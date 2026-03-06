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
import { Button } from "@/src/components/ui/button"

export function HRDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hrModules = [
    { 
      id: "hrPayroll", 
      title: "nav.hrPayroll", 
      description: "hrDashboard.hrPayrollDesc", 
      icon: Banknote, 
      color: "text-green-500", 
      bg: "bg-green-100",
      href: "/hr/payroll"
    },
    { 
      id: "hrSocialInsurance", 
      title: "nav.hrSocialInsurance", 
      description: "hrDashboard.hrSocialInsuranceDesc", 
      icon: Briefcase, 
      color: "text-blue-500", 
      bg: "bg-blue-100",
      href: "/hr/social-insurance"
    },
    { 
      id: "hrRecruitment", 
      title: "nav.hrRecruitment", 
      description: "hrDashboard.hrRecruitmentDesc", 
      icon: UserCheck, 
      color: "text-orange-500", 
      bg: "bg-orange-100",
      href: "/hr/recruitment"
    },
    { 
      id: "hrEmployees", 
      title: "nav.hrEmployees", 
      description: "hrDashboard.hrEmployeesDesc", 
      icon: Users, 
      color: "text-indigo-500", 
      bg: "bg-indigo-100",
      href: "/hr/employees"
    },
    { 
      id: "hrTimeAttendance", 
      title: "nav.hrTimeAttendance", 
      description: "hrDashboard.hrTimeAttendanceDesc", 
      icon: Clock, 
      color: "text-purple-500", 
      bg: "bg-purple-100",
      href: "/hr/time-attendance"
    },
    { 
      id: "hrLeave", 
      title: "Quản lý ngày phép", 
      description: "Cấu hình ngày nghỉ Lễ Tết, nguyên tắc phép năm và duyệt đơn xin nghỉ.", 
      icon: CalendarCheck, 
      color: "text-pink-500", 
      bg: "bg-pink-100",
      href: "/hr/leave"
    },
    { 
      id: "hrPerformance", 
      title: "nav.hrPerformance", 
      description: "hrDashboard.hrPerformanceDesc", 
      icon: Award, 
      color: "text-yellow-500", 
      bg: "bg-yellow-100",
      href: "/hr/performance"
    },
    { 
      id: "hrPit", 
      title: "nav.hrPit", 
      description: "hrDashboard.hrPitDesc", 
      icon: Banknote, 
      color: "text-red-500", 
      bg: "bg-red-100",
      href: "/hr/pit"
    },
    { 
      id: "hrGoals", 
      title: "nav.hrGoals", 
      description: "hrDashboard.hrGoalsDesc", 
      icon: Star, 
      color: "text-teal-500", 
      bg: "bg-teal-100",
      href: "/hr/goals"
    },
    { 
      id: "hrInfo", 
      title: "nav.hrInfo", 
      description: "hrDashboard.hrInfoDesc", 
      icon: HelpCircle, 
      color: "text-gray-500", 
      bg: "bg-gray-100",
      href: "/hr/info"
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các cập nhật mới nhất từ hệ thống nhân sự</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Nhân viên mới: Lê Văn C</p>
                <p className="text-sm text-muted-foreground">Đã hoàn thành thủ tục Onboarding</p>
              </div>
              <div className="text-sm text-muted-foreground">2 giờ trước</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <CalendarCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Đơn xin nghỉ phép: Phạm Thị D</p>
                <p className="text-sm text-muted-foreground">Đã được phê duyệt bởi Quản lý</p>
              </div>
              <div className="text-sm text-muted-foreground">5 giờ trước</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Tuyển dụng: Lập trình viên Frontend</p>
                <p className="text-sm text-muted-foreground">Có 3 ứng viên mới nộp hồ sơ</p>
              </div>
              <div className="text-sm text-muted-foreground">1 ngày trước</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Công việc sắp tới</CardTitle>
            <CardDescription>Các nhiệm vụ nhân sự cần xử lý</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Chốt bảng lương tháng này</p>
                <p className="text-sm text-muted-foreground">Hạn chót: 25/11/2023</p>
              </div>
              <Button variant="outline" size="sm">Xử lý</Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Đánh giá hiệu suất quý 4</p>
                <p className="text-sm text-muted-foreground">Bắt đầu từ: 01/12/2023</p>
              </div>
              <Button variant="outline" size="sm">Xem</Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Gia hạn hợp đồng: Trần Thị B</p>
                <p className="text-sm text-muted-foreground">Hết hạn: 15/12/2023</p>
              </div>
              <Button variant="outline" size="sm">Chi tiết</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
