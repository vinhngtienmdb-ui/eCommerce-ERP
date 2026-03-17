import { useState } from "react"
import { useTranslation } from "react-i18next"
import { DollarSign, Plus, Search, Filter, FileText, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"

export function Requests() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [requests, setRequests] = useState([
    { id: "REQ-001", type: t("adminWorkspace.requests.purchase"), requester: "Phòng Marketing", amount: 15000000, date: "2026-03-04", status: "pending", priority: "High" },
    { id: "REQ-002", type: t("adminWorkspace.requests.payment"), requester: "Phòng Hành chính", amount: 2500000, date: "2026-03-02", status: "approved", priority: "Medium" },
    { id: "REQ-003", type: t("adminWorkspace.requests.travel"), requester: "Nguyễn Văn A (Sales)", amount: 5000000, date: "2026-02-28", status: "rejected", priority: "Low" },
    { id: "REQ-004", type: t("adminWorkspace.requests.purchase"), requester: "Phòng IT", amount: 45000000, date: "2026-03-05", status: "pending", priority: "High" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    type: "Mua sắm",
    requester: "",
    amount: "",
    priority: "Medium"
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 font-medium"><Clock className="mr-1 h-3 w-3" />Chờ duyệt</Badge>
      case 'approved': return <Badge variant="default" className="bg-emerald-500 font-medium"><CheckCircle2 className="mr-1 h-3 w-3" />Đã duyệt</Badge>
      case 'rejected': return <Badge variant="destructive" className="font-medium"><XCircle className="mr-1 h-3 w-3" />Từ chối</Badge>
      default: return null
    }
  }

  const handleCreateRequest = () => {
    if (!newRequest.requester || !newRequest.amount) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const request = {
      id: `REQ-${(requests.length + 1).toString().padStart(3, '0')}`,
      type: newRequest.type,
      requester: newRequest.requester,
      amount: parseInt(newRequest.amount),
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      priority: newRequest.priority
    }

    setRequests([request, ...requests])
    setIsModalOpen(false)
    setNewRequest({ type: "Mua sắm", requester: "", amount: "", priority: "Medium" })
    toast.success("Đã tạo yêu cầu mới")
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tổng đề xuất</p>
              <h3 className="text-xl font-bold">45</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Chờ duyệt</p>
              <h3 className="text-xl font-bold">8</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Đã chi (Tháng)</p>
              <h3 className="text-xl font-bold text-emerald-700">125.5M ₫</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-red-500 text-white rounded-xl shadow-sm">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Từ chối</p>
              <h3 className="text-xl font-bold">4</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} className="pl-9 h-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filters")}
          </Button>
          <Button className="h-10 shadow-sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("adminWorkspace.requests.create")}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo yêu cầu hành chính mới.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Loại yêu cầu</Label>
              <Select value={newRequest.type} onValueChange={(val) => setNewRequest({...newRequest, type: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mua sắm">Mua sắm</SelectItem>
                  <SelectItem value="Thanh toán">Thanh toán</SelectItem>
                  <SelectItem value="Công tác">Công tác</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requester" className="text-right">Người yêu cầu</Label>
              <Select value={newRequest.requester} onValueChange={(val) => setNewRequest({...newRequest, requester: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn người yêu cầu" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.name}>{emp.name} ({emp.dept})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Số tiền (VNĐ)</Label>
              <Input 
                id="amount" 
                type="number"
                value={newRequest.amount} 
                onChange={(e) => setNewRequest({...newRequest, amount: e.target.value})}
                className="col-span-3" 
                placeholder="VD: 5000000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Mức độ</Label>
              <Select value={newRequest.priority} onValueChange={(val) => setNewRequest({...newRequest, priority: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Thấp</SelectItem>
                  <SelectItem value="Medium">Trung bình</SelectItem>
                  <SelectItem value="High">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateRequest}>Tạo yêu cầu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">{t("adminWorkspace.requests.requestId")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.type")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.requester")}</TableHead>
                <TableHead className="text-right">{t("adminWorkspace.requests.amount")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.date")}</TableHead>
                <TableHead>{t("adminWorkspace.requests.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-[10px] text-muted-foreground">{req.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{req.type}</span>
                      <span className={`text-[10px] ${req.priority === 'High' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Priority: {req.priority}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{req.requester}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{req.amount.toLocaleString()} ₫</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{req.date}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {t("common.viewDetails")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
