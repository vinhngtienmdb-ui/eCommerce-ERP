import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Plus, RefreshCw, Link as LinkIcon, Settings, Edit, Trash2, Briefcase, Users, Calendar, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { toast } from "sonner"

interface JobPosition {
  id: string
  title: string
  department: string
  quantity: number
  expectedSalary: string
  status: "Open" | "Closed" | "Draft"
  candidates: number
  channels: string[]
}

export function Recruitment() {
  const { t } = useTranslation()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [positions, setPositions] = useState<JobPosition[]>([
    { id: "JOB-001", title: "Senior Frontend Developer", department: "Engineering", quantity: 2, expectedSalary: "25,000,000 - 40,000,000", status: "Open", candidates: 15, channels: ["VietnamWorks", "TopCV"] },
    { id: "JOB-002", title: "Marketing Executive", department: "Marketing", quantity: 1, expectedSalary: "12,000,000 - 18,000,000", status: "Open", candidates: 32, channels: ["TopCV", "LinkedIn"] },
    { id: "JOB-003", title: "HR Manager", department: "HR", quantity: 1, expectedSalary: "30,000,000 - 50,000,000", status: "Closed", candidates: 8, channels: ["LinkedIn"] },
  ])

  const [isSyncing, setIsSyncing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    department: "Engineering",
    quantity: "1",
    expectedSalary: "",
  })

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 2000)
  }

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.expectedSalary) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const record: JobPosition = {
      id: `JOB-${(positions.length + 1).toString().padStart(3, '0')}`,
      title: newJob.title,
      department: newJob.department,
      quantity: parseInt(newJob.quantity) || 1,
      expectedSalary: newJob.expectedSalary,
      status: "Draft",
      candidates: 0,
      channels: []
    }

    setPositions([record, ...positions])
    setIsModalOpen(false)
    setNewJob({ title: "", department: "Engineering", quantity: "1", expectedSalary: "" })
    toast.success("Đã tạo tin tuyển dụng")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.recruitment")}</h1>
          <p className="text-muted-foreground">{t("hrDashboard.hrRecruitmentDesc")}</p>
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
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="jobs">Tin tuyển dụng</TabsTrigger>
          <TabsTrigger value="candidates">Ứng viên</TabsTrigger>
          <TabsTrigger value="interviews">Phỏng vấn</TabsTrigger>
          <TabsTrigger value="configuration">Cấu hình</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("hr.recruitment.vietnamWorks")}</CardTitle>
                <LinkIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 {t("hr.recruitment.candidates")}</div>
                <p className="text-xs text-muted-foreground">{t("hr.recruitment.lastSync")}: 10 mins ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("hr.recruitment.topCv")}</CardTitle>
                <LinkIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35 {t("hr.recruitment.candidates")}</div>
                <p className="text-xs text-muted-foreground">{t("hr.recruitment.lastSync")}: 5 mins ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("hr.recruitment.linkedIn")}</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8 {t("hr.recruitment.candidates")}</div>
                <p className="text-xs text-muted-foreground">{t("hr.recruitment.lastSync")}: 1 hour ago</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.recruitment.title")}</CardTitle>
              <CardDescription>{t("hr.recruitment.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo tin tuyển dụng
                </Button>
                <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? "Đang đồng bộ..." : t("hr.recruitment.syncNow")}
                </Button>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Tạo tin tuyển dụng</DialogTitle>
                    <DialogDescription>
                      Điền thông tin để tạo tin tuyển dụng mới.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Vị trí</Label>
                      <Input 
                        id="title" 
                        value={newJob.title} 
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: Senior Frontend Developer"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">Phòng ban</Label>
                      <Select value={newJob.department} onValueChange={(val) => setNewJob({...newJob, department: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Kỹ thuật (Engineering)</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="HR">Nhân sự (HR)</SelectItem>
                          <SelectItem value="Sales">Kinh doanh (Sales)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">Số lượng</Label>
                      <Input 
                        id="quantity" 
                        type="number"
                        value={newJob.quantity} 
                        onChange={(e) => setNewJob({...newJob, quantity: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 1"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expectedSalary" className="text-right">Mức lương</Label>
                      <Input 
                        id="expectedSalary" 
                        value={newJob.expectedSalary} 
                        onChange={(e) => setNewJob({...newJob, expectedSalary: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 25,000,000 - 40,000,000"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                    <Button onClick={handleCreateJob}>Tạo tin</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.recruitment.position")}</TableHead>
                    <TableHead>{t("hr.core.department")}</TableHead>
                    <TableHead>{t("hr.recruitment.quantity")}</TableHead>
                    <TableHead>{t("hr.recruitment.expectedSalary")}</TableHead>
                    <TableHead>{t("hr.recruitment.candidates")}</TableHead>
                    <TableHead>{t("hr.recruitment.channels")}</TableHead>
                    <TableHead>{t("hr.recruitment.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.expectedSalary} ₫</TableCell>
                      <TableCell className="font-bold text-blue-600">{item.candidates}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.channels.map(c => (
                            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Open" ? "default" : item.status === "Draft" ? "secondary" : "outline"}>
                          {item.status}
                        </Badge>
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
                          <Button variant="ghost" size="sm">{t("common.viewDetails")}</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý ứng viên</CardTitle>
              <CardDescription>Theo dõi và quản lý hồ sơ ứng viên từ các nguồn</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Danh sách ứng viên đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tính năng này sẽ hiển thị danh sách ứng viên dạng Kanban hoặc danh sách.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch phỏng vấn</CardTitle>
              <CardDescription>Quản lý lịch phỏng vấn và đánh giá ứng viên</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Lịch phỏng vấn đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tính năng này sẽ tích hợp với Google Calendar để đặt lịch phỏng vấn.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="configuration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Mẫu Email (Email Templates)</CardTitle>
                <CardDescription>Cấu hình mẫu email gửi ứng viên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Thư mời phỏng vấn
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Thư mời nhận việc (Offer Letter)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Thư từ chối
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quy trình phỏng vấn</CardTitle>
                <CardDescription>Thiết lập các vòng phỏng vấn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Vòng 1: Sơ loại hồ sơ</span>
                  <Badge variant="outline">Mặc định</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Vòng 2: Phỏng vấn chuyên môn</span>
                  <Badge variant="outline">Kỹ thuật</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Vòng 3: Phỏng vấn văn hóa</span>
                  <Badge variant="outline">HR</Badge>
                </div>
                <Button className="w-full mt-2" variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> Thêm vòng phỏng vấn
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tích hợp Job Boards</CardTitle>
                <CardDescription>Kết nối API với các trang tuyển dụng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-green-500" />
                    <span>VietnamWorks</span>
                  </div>
                  <Badge className="bg-green-500">Đã kết nối</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-green-500" />
                    <span>TopCV</span>
                  </div>
                  <Badge className="bg-green-500">Đã kết nối</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <span>LinkedIn Recruiter</span>
                  </div>
                  <Button size="sm" variant="outline">Kết nối</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
