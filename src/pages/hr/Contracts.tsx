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
import { Search, Plus, FileText, AlertTriangle, FileSignature, Trash2, Edit, Download } from "lucide-react"
import { useDataStore, Contract } from "@/src/store/useDataStore"
import { toast } from "sonner"
import { format, addDays, isBefore, parseISO } from "date-fns"

export function Contracts() {
  const { t } = useTranslation()
  const { employees, contracts, addContract, updateContract, deleteContract } = useDataStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    empId: "",
    type: "Labor",
    subType: "Definite Term",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    status: "Active"
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleSaveContract = () => {
    if (!newContract.empId || !newContract.startDate || !newContract.type) {
      toast.error(t("hr.core.toasts.requiredFields"))
      return
    }

    if (editingContract) {
      updateContract(editingContract.id, newContract)
      toast.success(t("hr.contracts.updateSuccess"))
    } else {
      const id = `CT-${(contracts.length + 1).toString().padStart(3, '0')}`
      addContract({ ...newContract, id } as Contract)
      toast.success(t("hr.contracts.addSuccess"))
    }

    setIsModalOpen(false)
    setEditingContract(null)
    setNewContract({
      empId: "",
      type: "Labor",
      subType: "Definite Term",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: "",
      status: "Active"
    })
  }

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract)
    setNewContract(contract)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteContract(id)
    toast.success(t("hr.contracts.deleteSuccess"))
  }

  const isExpiringSoon = (endDate: string) => {
    if (!endDate || endDate === "-") return false
    const end = parseISO(endDate)
    const thirtyDaysFromNow = addDays(new Date(), 30)
    return isBefore(end, thirtyDaysFromNow) && !isBefore(end, new Date())
  }

  const isExpired = (endDate: string) => {
    if (!endDate || endDate === "-") return false
    return isBefore(parseISO(endDate), new Date())
  }

  const filteredContracts = contracts.filter(c => 
    getEmployeeName(c.empId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.contracts.title")}</h1>
          <p className="text-muted-foreground">{t("hr.contracts.description")}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("hr.contracts.add")}
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("hr.contracts.tabs.all")}</TabsTrigger>
          <TabsTrigger value="expiring">{t("hr.contracts.tabs.expiring")}</TabsTrigger>
          <TabsTrigger value="templates">{t("hr.contracts.tabs.templates")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("hr.contracts.listTitle")}</CardTitle>
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
                    <TableHead>{t("hr.core.employee")}</TableHead>
                    <TableHead>{t("hr.contracts.type")}</TableHead>
                    <TableHead>{t("hr.contracts.startDate")}</TableHead>
                    <TableHead>{t("hr.contracts.endDate")}</TableHead>
                    <TableHead>{t("hr.core.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div className="font-medium">{getEmployeeName(contract.empId)}</div>
                        <div className="text-xs text-muted-foreground">{contract.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{t(`hr.contracts.types.${contract.type}`)}</span>
                          {contract.subType && (
                            <span className="text-xs text-muted-foreground">
                              {t(`hr.contracts.subTypes.${contract.subType}`)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contract.endDate}
                          {isExpiringSoon(contract.endDate) && (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                          {isExpired(contract.endDate) && (
                            <Badge variant="destructive" className="text-[10px] h-4 px-1">
                              {t("hr.contracts.expired")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={contract.status === "Active" ? "default" : "secondary"}>
                          {t(`hr.contracts.status.${contract.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(contract)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(contract.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.contracts.expiringTitle")}</CardTitle>
              <CardDescription>{t("hr.contracts.expiringDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.employee")}</TableHead>
                    <TableHead>{t("hr.contracts.type")}</TableHead>
                    <TableHead>{t("hr.contracts.endDate")}</TableHead>
                    <TableHead>{t("hr.contracts.daysLeft")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.filter(c => isExpiringSoon(c.endDate)).map((contract) => {
                    const daysLeft = Math.ceil((parseISO(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{getEmployeeName(contract.empId)}</TableCell>
                        <TableCell>{t(`hr.contracts.types.${contract.type}`)}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>
                          <span className="text-amber-600 font-medium">{daysLeft} {t("common.days")}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">{t("hr.contracts.renew")}</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {contracts.filter(c => isExpiringSoon(c.endDate)).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t("hr.contracts.noExpiring")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "temp-1", name: "Hợp đồng thử việc", type: "Probation", desc: "Mẫu chuẩn cho nhân viên mới" },
              { id: "temp-2", name: "Hợp đồng lao động xác định thời hạn", type: "Labor", desc: "Thời hạn 1-3 năm" },
              { id: "temp-3", name: "Hợp đồng lao động không xác định thời hạn", type: "Labor", desc: "Dành cho nhân viên chính thức lâu năm" },
              { id: "temp-4", name: "Hợp đồng dịch vụ", type: "Service", desc: "Dành cho cộng tác viên, chuyên gia" },
              { id: "temp-5", name: "Phụ lục hợp đồng", type: "Addendum", desc: "Thay đổi mức lương, vị trí" },
              { id: "temp-6", name: "Quyết định chấm dứt hợp đồng", type: "Termination", desc: "Mẫu thông báo nghỉ việc" },
            ].map((template) => (
              <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <CardTitle className="mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:bg-transparent">
                    {t("hr.contracts.useTemplate")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open)
        if (!open) {
          setEditingContract(null)
          setNewContract({
            empId: "",
            type: "Labor",
            subType: "Definite Term",
            startDate: format(new Date(), "yyyy-MM-dd"),
            endDate: "",
            status: "Active"
          })
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingContract ? t("hr.contracts.edit") : t("hr.contracts.add")}</DialogTitle>
            <DialogDescription>{t("hr.contracts.modalDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="empId" className="text-right">{t("hr.core.employee")}</Label>
              <Select value={newContract.empId} onValueChange={(val) => setNewContract({...newContract, empId: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("hr.core.selectEmployee")} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">{t("hr.contracts.type")}</Label>
              <Select value={newContract.type} onValueChange={(val: any) => setNewContract({...newContract, type: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("hr.contracts.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Probation">{t("hr.contracts.types.Probation")}</SelectItem>
                  <SelectItem value="Labor">{t("hr.contracts.types.Labor")}</SelectItem>
                  <SelectItem value="Service">{t("hr.contracts.types.Service")}</SelectItem>
                  <SelectItem value="Addendum">{t("hr.contracts.types.Addendum")}</SelectItem>
                  <SelectItem value="Termination">{t("hr.contracts.types.Termination")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newContract.type === "Labor" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subType" className="text-right">{t("hr.contracts.subType")}</Label>
                <Select value={newContract.subType} onValueChange={(val: any) => setNewContract({...newContract, subType: val})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t("hr.contracts.selectSubType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Definite Term">{t("hr.contracts.subTypes.Definite Term")}</SelectItem>
                    <SelectItem value="Indefinite Term">{t("hr.contracts.subTypes.Indefinite Term")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">{t("hr.contracts.startDate")}</Label>
              <Input 
                id="startDate" 
                type="date"
                value={newContract.startDate} 
                onChange={(e) => setNewContract({...newContract, startDate: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">{t("hr.contracts.endDate")}</Label>
              <Input 
                id="endDate" 
                type="date"
                value={newContract.endDate} 
                onChange={(e) => setNewContract({...newContract, endDate: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">{t("hr.core.status")}</Label>
              <Select value={newContract.status} onValueChange={(val: any) => setNewContract({...newContract, status: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("hr.contracts.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">{t("hr.contracts.status.Active")}</SelectItem>
                  <SelectItem value="Expired">{t("hr.contracts.status.Expired")}</SelectItem>
                  <SelectItem value="Terminated">{t("hr.contracts.status.Terminated")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSaveContract}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
