import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Upload, ScanLine, QrCode, FileSpreadsheet, ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

interface EmployeeInfo {
  id: string
  empId: string
  idCard: string
  phone: string
  email: string
  address: string
  status: "Verified" | "Pending"
}

export function HRInfo() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [records, setRecords] = useState<EmployeeInfo[]>([
    { id: "EMP-001", empId: employees[0]?.id || "EMP-001", idCard: "079123456789", phone: "0901234567", email: "a.nguyen@company.com", address: "Quận 1, TP.HCM", status: "Verified" },
    { id: "EMP-002", empId: employees[1]?.id || "EMP-002", idCard: "079987654321", phone: "0987654321", email: "b.tran@company.com", address: "Quận 3, TP.HCM", status: "Verified" },
    { id: "EMP-003", empId: employees[2]?.id || "EMP-003", idCard: "079456123789", phone: "0912345678", email: "c.le@company.com", address: "Quận 7, TP.HCM", status: "Pending" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    empId: "",
    idCard: "",
    phone: "",
    email: "",
    address: ""
  })

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const handleUploadDoc = () => {
    if (!newRecord.empId || !newRecord.idCard) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    const record: EmployeeInfo = {
      id: `EMP-${(records.length + 1).toString().padStart(3, '0')}`,
      empId: newRecord.empId,
      idCard: newRecord.idCard,
      phone: newRecord.phone,
      email: newRecord.email,
      address: newRecord.address,
      status: "Pending"
    }

    setRecords([record, ...records])
    setIsModalOpen(false)
    setNewRecord({ empId: "", idCard: "", phone: "", email: "", address: "" })
    toast.success("Đã tải lên hồ sơ mới")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.info")}</h1>
          <p className="text-muted-foreground">{t("hrDashboard.hrInfoDesc")}</p>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Danh sách hồ sơ</TabsTrigger>
          <TabsTrigger value="import">Nhập liệu hàng loạt</TabsTrigger>
          <TabsTrigger value="verification">Yêu cầu xác minh</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("hr.info.title")}</CardTitle>
              <CardDescription>{t("hr.info.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("hr.info.uploadDoc")}
                </Button>
                <Button variant="outline">
                  <ScanLine className="mr-2 h-4 w-4" />
                  {t("hr.info.extractOcr")}
                </Button>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  {t("hr.info.scanQr")}
                </Button>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Tải lên hồ sơ nhân viên</DialogTitle>
                    <DialogDescription>
                      Điền thông tin và tải lên tài liệu liên quan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="empId" className="text-right">Nhân viên</Label>
                      <Select value={newRecord.empId} onValueChange={(val) => setNewRecord({...newRecord, empId: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn nhân viên" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="idCard" className="text-right">CCCD</Label>
                      <Input 
                        id="idCard" 
                        value={newRecord.idCard} 
                        onChange={(e) => setNewRecord({...newRecord, idCard: e.target.value})}
                        className="col-span-3" 
                        placeholder="Số CCCD"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">SĐT</Label>
                      <Input 
                        id="phone" 
                        value={newRecord.phone} 
                        onChange={(e) => setNewRecord({...newRecord, phone: e.target.value})}
                        className="col-span-3" 
                        placeholder="Số điện thoại"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={newRecord.email} 
                        onChange={(e) => setNewRecord({...newRecord, email: e.target.value})}
                        className="col-span-3" 
                        placeholder="Email"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">Địa chỉ</Label>
                      <Input 
                        id="address" 
                        value={newRecord.address} 
                        onChange={(e) => setNewRecord({...newRecord, address: e.target.value})}
                        className="col-span-3" 
                        placeholder="Địa chỉ"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                    <Button onClick={handleUploadDoc}>Tải lên</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.core.name")}</TableHead>
                    <TableHead>{t("hr.core.idCard")}</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{getEmployeeName(item.empId)}</TableCell>
                      <TableCell>{item.idCard}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Verified" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">{t("common.viewDetails")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nhập liệu hồ sơ hàng loạt</CardTitle>
              <CardDescription>Tải lên file Excel/CSV để cập nhật thông tin nhân viên</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Tính năng nhập liệu đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Hỗ trợ import danh sách nhân viên từ file Excel mẫu.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Xác minh hồ sơ</CardTitle>
              <CardDescription>Danh sách hồ sơ cần xác minh thông tin (CCCD, Bằng cấp...)</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Tính năng xác minh đang được cập nhật</h3>
                <p className="text-sm text-muted-foreground">Tự động đối chiếu thông tin với cơ sở dữ liệu (nếu có).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
