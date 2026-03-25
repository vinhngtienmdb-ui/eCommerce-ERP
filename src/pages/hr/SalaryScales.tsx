import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Search, Plus, DollarSign, TrendingUp, Edit, Trash2, Calculator } from "lucide-react"
import { useDataStore, SalaryScale } from "@/src/store/useDataStore"
import { toast } from "sonner"

export function SalaryScales() {
  const { t } = useTranslation()
  const { salaryScales, addSalaryScale, updateSalaryScale } = useDataStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingScale, setEditingScale] = useState<SalaryScale | null>(null)
  const [newScale, setNewScale] = useState<Partial<SalaryScale>>({
    grade: "",
    level: "1",
    baseSalary: 0,
    allowances: [],
    description: ""
  })

  const handleSaveScale = () => {
    if (!newScale.grade || !newScale.level || newScale.baseSalary === undefined) {
      toast.error(t("hr.core.toasts.requiredFields"))
      return
    }

    if (editingScale) {
      updateSalaryScale(editingScale.id, newScale)
      toast.success(t("hr.salaryScales.updateSuccess"))
    } else {
      const id = `SS-${(salaryScales.length + 1).toString().padStart(3, '0')}`
      addSalaryScale({ ...newScale, id } as SalaryScale)
      toast.success(t("hr.salaryScales.addSuccess"))
    }

    setIsModalOpen(false)
    setEditingScale(null)
    setNewScale({
      grade: "",
      level: "1",
      baseSalary: 0,
      allowances: [],
      description: ""
    })
  }

  const handleEdit = (scale: SalaryScale) => {
    setEditingScale(scale)
    setNewScale(scale)
    setIsModalOpen(true)
  }

  const filteredScales = salaryScales.filter(s => 
    s.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.level.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.salaryScales.title")}</h1>
          <p className="text-muted-foreground">{t("hr.salaryScales.description")}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("hr.salaryScales.add")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.salaryScales.avgSalary")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salaryScales.reduce((acc, s) => acc + s.baseSalary, 0) / salaryScales.length)}</div>
            <p className="text-xs text-muted-foreground">+2.5% {t("hr.salaryScales.vsLastYear")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.salaryScales.totalGrades")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(salaryScales.map(s => s.grade)).size}</div>
            <p className="text-xs text-muted-foreground">{t("hr.salaryScales.activeGrades")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("hr.salaryScales.budgetImpact")}</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2%</div>
            <p className="text-xs text-muted-foreground">{t("hr.salaryScales.ofRevenue")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("hr.salaryScales.listTitle")}</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("common.search")} 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("hr.salaryScales.grade")}</TableHead>
                <TableHead>{t("hr.salaryScales.level")}</TableHead>
                <TableHead>{t("hr.salaryScales.baseSalary")}</TableHead>
                <TableHead>{t("hr.salaryScales.allowances")}</TableHead>
                <TableHead>{t("hr.salaryScales.total")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScales.map((scale) => {
                const totalAllowances = scale.allowances.reduce((acc, a) => acc + a.amount, 0)
                return (
                  <TableRow key={scale.id}>
                    <TableCell className="font-medium">{scale.grade}</TableCell>
                    <TableCell>{scale.level}</TableCell>
                    <TableCell>{formatCurrency(scale.baseSalary)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {scale.allowances.map((a, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] w-fit">
                            {a.name}: {formatCurrency(a.amount)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{formatCurrency(scale.baseSalary + totalAllowances)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(scale)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open)
        if (!open) {
          setEditingScale(null)
          setNewScale({
            grade: "",
            level: "1",
            baseSalary: 0,
            allowances: [],
            description: ""
          })
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingScale ? t("hr.salaryScales.edit") : t("hr.salaryScales.add")}</DialogTitle>
            <DialogDescription>{t("hr.salaryScales.modalDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">{t("hr.salaryScales.grade")}</Label>
              <Input 
                id="grade" 
                value={newScale.grade} 
                onChange={(e) => setNewScale({...newScale, grade: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">{t("hr.salaryScales.level")}</Label>
              <Input 
                id="level" 
                value={newScale.level} 
                onChange={(e) => setNewScale({...newScale, level: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseSalary" className="text-right">{t("hr.salaryScales.baseSalary")}</Label>
              <Input 
                id="baseSalary" 
                type="number"
                value={newScale.baseSalary} 
                onChange={(e) => setNewScale({...newScale, baseSalary: Number(e.target.value)})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">{t("common.description")}</Label>
              <textarea 
                id="description" 
                value={newScale.description} 
                onChange={(e) => setNewScale({...newScale, description: e.target.value})}
                className="col-span-3 min-h-[100px] p-2 rounded-md border border-input bg-background" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSaveScale}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
