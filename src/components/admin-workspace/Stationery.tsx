import { useState } from "react"
import { useTranslation } from "react-i18next"
import { PenTool, Plus, Search, Filter, Box, CheckCircle2, Clock, Truck, ArrowDownRight } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

export function Stationery() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [requests, setRequests] = useState([
    { id: "VPP-001", item: "Giấy A4 Double A", qty: 5, unit: "Ram", dept: "Marketing", status: "pending", date: "2024-03-01" },
    { id: "VPP-002", item: "Bút bi Thiên Long", qty: 20, unit: "Hộp", dept: "Sales", status: "approved", date: "2024-03-02" },
    { id: "VPP-003", item: "Sổ tay nhân viên", qty: 10, unit: "Cuốn", dept: "HR", status: "delivered", date: "2024-03-03" },
    { id: "VPP-004", item: "Mực in HP 85A", qty: 2, unit: "Hộp", dept: "IT", status: "pending", date: "2024-03-04" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    item: "Giấy A4 Double A",
    qty: "",
    unit: "Ram",
    dept: ""
  })

  const stockLevels = [
    { item: "Giấy A4", stock: 85, min: 20, unit: "Ram" },
    { item: "Bút bi", stock: 12, min: 50, unit: "Hộp" },
    { item: "Mực in", stock: 5, min: 10, unit: "Hộp" },
    { item: "Sổ tay", stock: 45, min: 30, unit: "Cuốn" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 font-medium border-amber-200"><Clock className="mr-1 h-3 w-3" />{t("adminWorkspace.stationery.pending")}</Badge>
      case 'approved': return <Badge variant="default" className="bg-blue-500 font-medium"><CheckCircle2 className="mr-1 h-3 w-3" />{t("adminWorkspace.stationery.approved")}</Badge>
      case 'delivered': return <Badge variant="default" className="bg-emerald-500 font-medium"><Truck className="mr-1 h-3 w-3" />{t("adminWorkspace.stationery.delivered")}</Badge>
      default: return null
    }
  }

  const handleCreateRequest = () => {
    if (!newRequest.qty || !newRequest.dept) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const request = {
      id: `VPP-${(requests.length + 1).toString().padStart(3, '0')}`,
      item: newRequest.item,
      qty: parseInt(newRequest.qty),
      unit: newRequest.unit,
      dept: newRequest.dept,
      status: "pending",
      date: new Date().toISOString().split('T')[0]
    }

    setRequests([request, ...requests])
    setIsModalOpen(false)
    setNewRequest({ item: "Giấy A4 Double A", qty: "", unit: "Ram", dept: "" })
    toast.success("Đã gửi yêu cầu cấp phát VPP")
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-500 text-white rounded-lg shadow-sm">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tổng yêu cầu</p>
              <h3 className="text-xl font-bold">145</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Chờ duyệt</p>
              <h3 className="text-xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Đã giao</p>
              <h3 className="text-xl font-bold">118</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-500 text-white rounded-lg shadow-sm">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Ngân sách</p>
              <h3 className="text-xl font-bold">$1.2k</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("adminWorkspace.stationery.recentRequests")}</CardTitle>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("adminWorkspace.stationery.request")}
              </Button>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t("common.search")} className="pl-9 h-9" />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                {t("common.filters")}
              </Button>
            </div>
          </CardHeader>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yêu cầu cấp phát VPP</DialogTitle>
                <DialogDescription>
                  Điền thông tin để yêu cầu văn phòng phẩm mới.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item" className="text-right">Vật phẩm</Label>
                  <Select value={newRequest.item} onValueChange={(val) => setNewRequest({...newRequest, item: val})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn vật phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockLevels.map(stock => (
                        <SelectItem key={stock.item} value={stock.item}>{stock.item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="qty" className="text-right">Số lượng</Label>
                  <Input 
                    id="qty" 
                    type="number"
                    value={newRequest.qty} 
                    onChange={(e) => setNewRequest({...newRequest, qty: e.target.value})}
                    className="col-span-3" 
                    placeholder="VD: 5"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">Đơn vị</Label>
                  <Select value={newRequest.unit} onValueChange={(val) => setNewRequest({...newRequest, unit: val})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn đơn vị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ram">Ram</SelectItem>
                      <SelectItem value="Hộp">Hộp</SelectItem>
                      <SelectItem value="Cuốn">Cuốn</SelectItem>
                      <SelectItem value="Cái">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dept" className="text-right">Phòng ban</Label>
                  <Select value={newRequest.dept} onValueChange={(val) => setNewRequest({...newRequest, dept: val})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ban Giám Đốc">Ban Giám Đốc</SelectItem>
                      <SelectItem value="Phòng Kinh Doanh">Phòng Kinh Doanh</SelectItem>
                      <SelectItem value="Phòng Nhân Sự">Phòng Nhân Sự</SelectItem>
                      <SelectItem value="Phòng Marketing">Phòng Marketing</SelectItem>
                      <SelectItem value="Phòng IT">Phòng IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button onClick={handleCreateRequest}>Gửi yêu cầu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>{t("adminWorkspace.stationery.item")}</TableHead>
                    <TableHead>{t("adminWorkspace.stationery.quantity")}</TableHead>
                    <TableHead>{t("adminWorkspace.stationery.department")}</TableHead>
                    <TableHead>{t("adminWorkspace.stationery.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} className="group cursor-pointer hover:bg-muted/30">
                      <TableCell className="font-medium font-mono text-[10px] text-muted-foreground">{req.id}</TableCell>
                      <TableCell className="font-medium">{req.item}</TableCell>
                      <TableCell>{req.qty} {req.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">{t(`hr.core.${req.dept.toLowerCase()}`, req.dept)}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("adminWorkspace.stationery.stockLevel")}</CardTitle>
            <CardDescription>{t("adminWorkspace.stationery.stockDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stockLevels.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.item}</span>
                    <span className={`font-bold ${item.stock < item.min ? 'text-red-500' : 'text-emerald-500'}`}>
                      {item.stock} / {item.unit}
                    </span>
                  </div>
                  <Progress 
                    value={(item.stock / 100) * 100} 
                    className={`h-1.5 ${item.stock < item.min ? 'bg-red-100' : ''}`}
                  />
                  {item.stock < item.min && (
                    <p className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                      <ArrowDownRight className="h-3 w-3" /> {t("adminWorkspace.stationery.lowStock")}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-xs" size="sm">
              {t("adminWorkspace.stationery.manageInventory")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
