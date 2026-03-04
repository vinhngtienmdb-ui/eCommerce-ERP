import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Target, GraduationCap } from "lucide-react"

interface KPI {
  id: string
  title: string
  progress: number
  target: number
}

interface Review {
  id: string
  empName: string
  cycle: string
  reviewer: string
  rating: string
}

interface TrainingCourse {
  id: string
  title: string
  enrolled: number
  completed: number
}

export function Performance() {
  const { t } = useTranslation()

  const [kpis] = useState<KPI[]>([
    { id: "KPI-001", title: "Q4 2023 Sales Target", progress: 75, target: 100 },
    { id: "KPI-002", title: "Customer Satisfaction Score", progress: 90, target: 95 },
    { id: "KPI-003", title: "Product Launch Success", progress: 40, target: 100 },
  ])

  const [reviews] = useState<Review[]>([
    { id: "REV-001", empName: "Nguyen Van A", cycle: "Q3 2023", reviewer: "Manager X", rating: "Exceeds Expectations" },
    { id: "REV-002", empName: "Tran Thi B", cycle: "Q3 2023", reviewer: "Director Y", rating: "Outstanding" },
  ])

  const [trainings] = useState<TrainingCourse[]>([
    { id: "TR-001", title: "Security Awareness 2023", enrolled: 1200, completed: 800 },
    { id: "TR-002", title: "Advanced React Patterns", enrolled: 50, completed: 10 },
    { id: "TR-003", title: "Effective Communication", enrolled: 300, completed: 250 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.performance")}</h1>
          <p className="text-muted-foreground">{t("hr.performance.kpiDesc")}</p>
        </div>
      </div>

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
            <CardTitle>{t("hr.performance.reviews")}</CardTitle>
            <CardDescription>Employee performance reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("hr.core.name")}</TableHead>
                  <TableHead>{t("hr.performance.reviewCycle")}</TableHead>
                  <TableHead>{t("hr.performance.rating")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.empName}</TableCell>
                    <TableCell>{item.cycle}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.rating}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
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
      </div>
    </div>
  )
}
