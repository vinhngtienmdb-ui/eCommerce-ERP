import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Target, GraduationCap, Settings, Edit, Trash2, Plus, BarChart, BookOpen, Award } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface KPI {
  id: string
  title: string
  progress: number
  target: number
}

interface Review {
  id: string
  empId: string
  cycle: string
  reviewer: string
  rating: string
  type: "Self" | "Manager" | "Peer"
}

interface TrainingCourse {
  id: string
  title: string
  enrolled: number
  completed: number
}

export function Performance() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [userRole, setUserRole] = useState<"Admin" | "HR Manager" | "Employee">("HR Manager")
  const canEdit = userRole === "Admin" || userRole === "HR Manager"

  const [kpis] = useState<KPI[]>([
    { id: "KPI-001", title: "Q4 2023 Sales Target", progress: 75, target: 100 },
    { id: "KPI-002", title: "Customer Satisfaction Score", progress: 90, target: 95 },
    { id: "KPI-003", title: "Product Launch Success", progress: 40, target: 100 },
  ])

  const [reviews, setReviews] = useState<Review[]>([
    { id: "REV-001", empId: employees[0]?.id || "EMP-001", cycle: "Q3 2023", reviewer: "Manager X", rating: "exceeds", type: "Manager" },
    { id: "REV-002", empId: employees[1]?.id || "EMP-002", cycle: "Q3 2023", reviewer: "Director Y", rating: "outstanding", type: "Manager" },
    { id: "REV-003", empId: employees[2]?.id || "EMP-003", cycle: "Q3 2023", reviewer: "Self", rating: "meets", type: "Self" },
    { id: "REV-004", empId: employees[0]?.id || "EMP-001", cycle: "Q3 2023", reviewer: employees[1]?.name || "Tran Thi B", rating: "outstanding", type: "Peer" },
  ])

  const [trainings] = useState<TrainingCourse[]>([
    { id: "TR-001", title: "Security Awareness 2023", enrolled: 1200, completed: 800 },
    { id: "TR-002", title: "Advanced React Patterns", enrolled: 50, completed: 10 },
    { id: "TR-003", title: "Effective Communication", enrolled: 300, completed: 250 },
  ])

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [newReview, setNewReview] = useState({
    empId: "",
    cycle: "Q4 2023",
    reviewer: "",
    rating: "meets",
    type: "Manager" as "Self" | "Manager" | "Peer",
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleCreateReview = () => {
    if (!newReview.empId || !newReview.reviewer) {
      toast.error(t("hr.performance.toasts.fillInfo"))
      return
    }

    const record: Review = {
      id: `REV-${(reviews.length + 1).toString().padStart(3, '0')}`,
      ...newReview
    }

    setReviews([record, ...reviews])
    setIsReviewModalOpen(false)
    setNewReview({
      empId: "",
      cycle: "Q4 2023",
      reviewer: "",
      rating: "meets",
      type: "Manager",
    })
    toast.success(t("hr.performance.toasts.addSuccess"))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.performance")}</h1>
          <p className="text-muted-foreground">{t("hr.performance.kpiDesc")}</p>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("hr.performance.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("hr.performance.tabs.reviews")}</TabsTrigger>
          <TabsTrigger value="training">{t("hr.performance.tabs.training")}</TabsTrigger>
          <TabsTrigger value="goals">{t("hr.performance.tabs.goals")}</TabsTrigger>
          <TabsTrigger value="configuration">{t("hr.performance.tabs.config")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("hr.performance.kpiTitle")}</CardTitle>
                <CardDescription>{t("hr.performance.kpiDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpis.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.title}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-4">
                    <Target className="mr-2 h-4 w-4" />
                    {t("hr.performance.manageKPIs")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("hr.performance.stats.training")}</CardTitle>
                <CardDescription>{t("hr.performance.stats.trainingDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("hr.performance.stats.ongoingCourses")}</p>
                        <p className="text-2xl font-bold">5</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("hr.performance.stats.certificatesIssued")}</p>
                        <p className="text-2xl font-bold">128</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("hr.performance.reviews")}</CardTitle>
                <CardDescription>{t("hr.performance.kpiDesc")}</CardDescription>
              </div>
              {canEdit && (
                <Button size="sm" onClick={() => setIsReviewModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("hr.performance.reviewModal.save")}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("hr.performance.reviewModal.title")}</DialogTitle>
                    <DialogDescription>
                      {t("hr.performance.reviewModal.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empId" className="text-right">{t("hr.performance.reviewModal.employee")}</Label>
                      <Select value={newReview.empId} onValueChange={(val) => setNewReview({...newReview, empId: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.performance.reviewModal.selectEmployee")} />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cycle" className="text-right">{t("hr.performance.reviewModal.cycle")}</Label>
                      <Input 
                        id="cycle" 
                        value={newReview.cycle} 
                        onChange={(e) => setNewReview({...newReview, cycle: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.performance.reviewModal.cyclePlaceholder")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reviewer" className="text-right">{t("hr.performance.reviewModal.reviewer")}</Label>
                      <Input 
                        id="reviewer" 
                        value={newReview.reviewer} 
                        onChange={(e) => setNewReview({...newReview, reviewer: e.target.value})}
                        className="col-span-3" 
                        placeholder={t("hr.performance.reviewModal.reviewerPlaceholder")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">{t("hr.performance.reviewModal.type")}</Label>
                      <Select value={newReview.type} onValueChange={(val: "Self" | "Manager" | "Peer") => setNewReview({...newReview, type: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.performance.reviewModal.selectType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manager">{t("hr.performance.managerReview")}</SelectItem>
                          <SelectItem value="Self">{t("hr.performance.selfReview")}</SelectItem>
                          <SelectItem value="Peer">{t("hr.performance.peerReview")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rating" className="text-right">{t("hr.performance.reviewModal.rating")}</Label>
                      <Select value={newReview.rating} onValueChange={(val) => setNewReview({...newReview, rating: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t("hr.performance.reviewModal.selectRating")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outstanding">{t("hr.performance.reviewModal.outstanding")}</SelectItem>
                          <SelectItem value="exceeds">{t("hr.performance.reviewModal.exceeds")}</SelectItem>
                          <SelectItem value="meets">{t("hr.performance.reviewModal.meets")}</SelectItem>
                          <SelectItem value="needsImprovement">{t("hr.performance.reviewModal.needsImprovement")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>{t("hr.performance.reviewModal.cancel")}</Button>
                    <Button onClick={handleCreateReview}>{t("hr.performance.reviewModal.save")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.performance.reviewCycle")}</TableHead>
                    <TableHead>{t("hr.performance.reviewer")}</TableHead>
                    <TableHead>{t("hr.performance.reviewModal.type")}</TableHead>
                    <TableHead>{t("hr.performance.rating")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                      <TableCell>{item.cycle}</TableCell>
                      <TableCell>{item.reviewer}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === "Manager" ? "default" : item.type === "Self" ? "secondary" : "outline"}>
                          {item.type === "Manager" ? t("hr.performance.managerReview") : item.type === "Self" ? t("hr.performance.selfReview") : t("hr.performance.peerReview")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.rating === "outstanding" ? t("hr.performance.reviewModal.outstanding") :
                           item.rating === "exceeds" ? t("hr.performance.reviewModal.exceeds") :
                           item.rating === "meets" ? t("hr.performance.reviewModal.meets") :
                           item.rating === "needsImprovement" ? t("hr.performance.reviewModal.needsImprovement") :
                           item.rating}
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

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.training.title")}</CardTitle>
              <CardDescription>{t("hr.training.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainings.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.completed}/{item.enrolled} {t("hr.training.completed")}</div>
                    </div>
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  {t("hr.training.courseCatalog")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.performance.goalsTab.title")}</CardTitle>
              <CardDescription>{t("hr.performance.goalsTab.description")}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <Target className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">{t("hr.performance.goalsTab.updating")}</h3>
                <p className="text-sm text-muted-foreground">{t("hr.performance.goalsTab.featureDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="configuration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t("hr.performance.configTab.cycles")}</CardTitle>
                <CardDescription>{t("hr.performance.configTab.cyclesDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Q1 2024</span>
                  <Badge variant="outline">{t("hr.performance.configTab.upcoming")}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Q4 2023</span>
                  <Badge className="bg-green-500">{t("hr.performance.configTab.inProgress")}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Q3 2023</span>
                  <Badge variant="secondary">{t("hr.performance.configTab.closed")}</Badge>
                </div>
                <Button className="w-full mt-2" variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> {t("hr.performance.configTab.newCycle")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("hr.performance.configTab.scales")}</CardTitle>
                <CardDescription>{t("hr.performance.configTab.scalesDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>5 - {t("hr.performance.reviewModal.outstanding")}</span>
                  <Badge>A+</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>4 - {t("hr.performance.reviewModal.exceeds")}</span>
                  <Badge>A</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>3 - {t("hr.performance.reviewModal.meets")}</span>
                  <Badge>B</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>2 - {t("hr.performance.reviewModal.needsImprovement")}</span>
                  <Badge variant="destructive">C</Badge>
                </div>
                <Button className="w-full mt-2" variant="outline">
                  <Settings className="mr-2 h-4 w-4" /> {t("hr.performance.configTab.editScales")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("hr.performance.configTab.weights")}</CardTitle>
                <CardDescription>{t("hr.performance.configTab.weightsDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{t("hr.performance.configTab.workResults")}</span>
                    <span>70%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{t("hr.performance.configTab.coreCompetencies")}</span>
                    <span>20%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{t("hr.performance.configTab.trainingDevelopment")}</span>
                    <span>10%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
                <Button className="w-full mt-2" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> {t("hr.performance.configTab.editWeights")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
