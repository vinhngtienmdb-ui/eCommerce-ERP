import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Plus, Target, Settings, Edit, Trash2, GitMerge, MessageSquare } from "lucide-react"

interface Goal {
  id: string
  title: string
  level: "Company" | "Division" | "Department" | "Individual"
  timeframe: "Daily" | "Weekly" | "Monthly" | "Yearly"
  progress: number
  owner: string
}

export function Goals() {
  const { t } = useTranslation()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [goals] = useState<Goal[]>([
    { id: "G-001", title: "Đạt doanh thu 100 tỷ VNĐ", level: "Company", timeframe: "Yearly", progress: 75, owner: "CEO" },
    { id: "G-002", title: "Tăng trưởng 20% khách hàng mới", level: "Division", timeframe: "Monthly", progress: 40, owner: "Sales Director" },
    { id: "G-003", title: "Tuyển dụng 50 nhân sự IT", level: "Department", timeframe: "Monthly", progress: 90, owner: "HR Manager" },
    { id: "G-004", title: "Hoàn thành tính năng X", level: "Individual", timeframe: "Weekly", progress: 100, owner: "Nguyen Van A" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.goals")}</h1>
          <p className="text-muted-foreground">{t("hrDashboard.hrGoalsDesc")}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={userRole} onValueChange={(v: any) => setUserRole(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="HR Manager">HR Manager</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
            </SelectContent>
          </Select>
          
          {canEdit && (
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Cấu hình
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Danh sách mục tiêu</TabsTrigger>
          <TabsTrigger value="alignment">Sơ đồ liên kết</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá định kỳ</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.goals.title")}</CardTitle>
              <CardDescription>{t("hr.goals.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                {canEdit && (
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo mục tiêu mới
                  </Button>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mục tiêu</TableHead>
                    <TableHead>{t("hr.goals.level")}</TableHead>
                    <TableHead>{t("hr.goals.timeframe")}</TableHead>
                    <TableHead>Người phụ trách</TableHead>
                    <TableHead>{t("hr.goals.progress")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant={item.level === "Company" ? "destructive" : item.level === "Division" ? "default" : item.level === "Department" ? "secondary" : "outline"}>
                          {item.level === "Company" ? t("hr.goals.company") : item.level === "Division" ? t("hr.goals.division") : item.level === "Department" ? t("hr.goals.department") : t("hr.goals.individual")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.timeframe === "Daily" ? t("hr.goals.daily") : item.timeframe === "Weekly" ? t("hr.goals.weekly") : item.timeframe === "Monthly" ? t("hr.goals.monthly") : t("hr.goals.yearly")}
                      </TableCell>
                      <TableCell>{item.owner}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                              style={{ width: `${item.progress}%` }} 
                            />
                          </div>
                          <span className="text-xs font-medium">{item.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {canEdit ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm"><Target className="h-4 w-4" /></Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sơ đồ liên kết mục tiêu (Goal Alignment)</CardTitle>
              <CardDescription>Trực quan hóa sự liên kết giữa mục tiêu cá nhân, phòng ban và công ty</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <GitMerge className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Sơ đồ liên kết đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tính năng này sẽ hiển thị cây mục tiêu từ cấp công ty xuống nhân viên.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá & Phản hồi (Check-in)</CardTitle>
              <CardDescription>Ghi nhận tiến độ và phản hồi định kỳ về mục tiêu</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Tính năng Check-in đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Cho phép quản lý và nhân viên trao đổi về tiến độ mục tiêu.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
