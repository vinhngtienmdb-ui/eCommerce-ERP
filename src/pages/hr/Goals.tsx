import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Plus, Target, Settings, Edit, Trash2, GitMerge, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface Goal {
  id: string
  title: string
  level: "Company" | "Division" | "Department" | "Individual"
  timeframe: "Daily" | "Weekly" | "Monthly" | "Yearly"
  progress: number
  empId: string
}

export function Goals() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [goals, setGoals] = useState<Goal[]>([
    { id: "G-001", title: "Đạt doanh thu 100 tỷ VNĐ", level: "Company", timeframe: "Yearly", progress: 75, empId: employees[0]?.id || "EMP-001" },
    { id: "G-002", title: "Tăng trưởng 20% khách hàng mới", level: "Division", timeframe: "Monthly", progress: 40, empId: employees[1]?.id || "EMP-002" },
    { id: "G-003", title: "Tuyển dụng 50 nhân sự IT", level: "Department", timeframe: "Monthly", progress: 90, empId: employees[2]?.id || "EMP-003" },
    { id: "G-004", title: "Hoàn thành tính năng X", level: "Individual", timeframe: "Weekly", progress: 100, empId: employees[0]?.id || "EMP-001" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    level: "Individual" as Goal["level"],
    timeframe: "Monthly" as Goal["timeframe"],
    empId: "",
    progress: "0"
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.empId) {
      toast.error(t("hr.goals.toasts.fillInfo"))
      return
    }

    const progress = parseInt(newGoal.progress) || 0

    const record: Goal = {
      id: `G-${(goals.length + 1).toString().padStart(3, '0')}`,
      title: newGoal.title,
      level: newGoal.level,
      timeframe: newGoal.timeframe,
      empId: newGoal.empId,
      progress: progress > 100 ? 100 : progress < 0 ? 0 : progress
    }

    setGoals([record, ...goals])
    setIsModalOpen(false)
    setNewGoal({ title: "", level: "Individual", timeframe: "Monthly", empId: "", progress: "0" })
    toast.success(t("hr.goals.toasts.addSuccess"))
  }

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
              <SelectValue placeholder={t("hr.core.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">{t("hr.core.admin")}</SelectItem>
              <SelectItem value="HR Manager">{t("hr.core.hrManager")}</SelectItem>
              <SelectItem value="Employee">{t("hr.core.employee")}</SelectItem>
            </SelectContent>
          </Select>
          
          {canEdit && (
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {t("hr.core.config")}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">{t("hr.goals.tabs.list")}</TabsTrigger>
          <TabsTrigger value="alignment">{t("hr.goals.tabs.alignment")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("hr.goals.tabs.reviews")}</TabsTrigger>
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
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("hr.goals.list.create")}
                  </Button>
                )}
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("hr.goals.list.createTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("hr.goals.list.createDesc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">{t("hr.goals.list.goal")}</Label>
                      <Input 
                        id="title" 
                        value={newGoal.title} 
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.goals.list.goal")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="level" className="text-right">{t("hr.goals.list.level")}</Label>
                      <Select value={newGoal.level} onValueChange={(val: any) => setNewGoal({...newGoal, level: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.goals.list.selectLevel")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Company">{t("hr.goals.company")}</SelectItem>
                          <SelectItem value="Division">{t("hr.goals.division")}</SelectItem>
                          <SelectItem value="Department">{t("hr.goals.department")}</SelectItem>
                          <SelectItem value="Individual">{t("hr.goals.individual")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="timeframe" className="text-right">{t("hr.goals.list.timeframe")}</Label>
                      <Select value={newGoal.timeframe} onValueChange={(val: any) => setNewGoal({...newGoal, timeframe: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.goals.list.selectTimeframe")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">{t("hr.goals.daily")}</SelectItem>
                          <SelectItem value="Weekly">{t("hr.goals.weekly")}</SelectItem>
                          <SelectItem value="Monthly">{t("hr.goals.monthly")}</SelectItem>
                          <SelectItem value="Yearly">{t("hr.goals.yearly")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empId" className="text-right">{t("hr.goals.list.responsible")}</Label>
                      <Select value={newGoal.empId} onValueChange={(val) => setNewGoal({...newGoal, empId: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.goals.list.selectResponsible")} />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="progress" className="text-right">{t("hr.goals.list.progress")}</Label>
                      <Input 
                        id="progress" 
                        type="number"
                        min="0"
                        max="100"
                        value={newGoal.progress} 
                        onChange={(e) => setNewGoal({...newGoal, progress: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("hr.goals.list.cancel")}</Button>
                    <Button onClick={handleCreateGoal}>{t("hr.goals.list.save")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.goals.list.goal")}</TableHead>
                    <TableHead>{t("hr.goals.level")}</TableHead>
                    <TableHead>{t("hr.goals.timeframe")}</TableHead>
                    <TableHead>{t("hr.goals.list.responsible")}</TableHead>
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
                      <TableCell>{getEmployeeName(item.empId)}</TableCell>
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
              <CardTitle>{t("hr.goals.goalAlignment")}</CardTitle>
              <CardDescription>{t("hr.goals.goalAlignmentDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <GitMerge className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.goals.alignmentUpdating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.goals.alignmentFeatureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.goals.checkIn")}</CardTitle>
              <CardDescription>{t("hr.goals.checkInDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.goals.checkInUpdating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.goals.checkInFeatureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
