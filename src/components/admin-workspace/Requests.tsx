import { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { DollarSign, Plus, Search, Filter, FileText, CheckCircle2, Clock, XCircle, PenTool, Download, Eye, FileSignature } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { useDataStore } from "@/src/store/useDataStore"
import { toast } from "sonner"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import SignatureCanvas from 'react-signature-canvas'

export function Requests() {
  const { t } = useTranslation()
  const { employees } = useDataStore()

  const [requests, setRequests] = useState([
    { id: "REQ-001", title: "Đề xuất mua sắm thiết bị IT", type: "Mua sắm", requester: "Phòng Marketing", content: "Cần mua 2 laptop mới cho nhân sự.", amount: 15000000, date: "2026-03-04", status: "pending_sign", priority: "High" },
    { id: "REQ-002", title: "Thanh toán chi phí công tác", type: "Thanh toán", requester: "Phòng Hành chính", content: "Chi phí công tác Hà Nội tháng 2.", amount: 2500000, date: "2026-03-02", status: "signed", priority: "Medium" },
    { id: "REQ-003", title: "Đề xuất công tác Đà Nẵng", type: "Công tác", requester: "Nguyễn Văn A (Sales)", content: "Gặp gỡ đối tác chiến lược.", amount: 5000000, date: "2026-02-28", status: "rejected", priority: "Low" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewRequest, setViewRequest] = useState<any>(null)
  const [isSigning, setIsSigning] = useState(false)
  const sigCanvas = useRef<any>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const [newRequest, setNewRequest] = useState({
    title: "",
    type: "Mua sắm",
    requester: "",
    content: "",
    amount: "",
    priority: "Medium"
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_sign': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 font-medium"><Clock className="mr-1 h-3 w-3" />Chờ ký</Badge>
      case 'signed': return <Badge variant="default" className="bg-emerald-500 font-medium"><CheckCircle2 className="mr-1 h-3 w-3" />Đã ký duyệt</Badge>
      case 'rejected': return <Badge variant="destructive" className="font-medium"><XCircle className="mr-1 h-3 w-3" />Từ chối</Badge>
      default: return null
    }
  }

  const handleCreateRequest = () => {
    if (!newRequest.title || !newRequest.requester || !newRequest.content) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    const request = {
      id: `REQ-${(requests.length + 1).toString().padStart(3, '0')}`,
      title: newRequest.title,
      type: newRequest.type,
      requester: newRequest.requester,
      content: newRequest.content,
      amount: parseInt(newRequest.amount) || 0,
      date: new Date().toISOString().split('T')[0],
      status: "pending_sign",
      priority: newRequest.priority
    }

    setRequests([request, ...requests])
    setIsModalOpen(false)
    setNewRequest({ title: "", type: "Mua sắm", requester: "", content: "", amount: "", priority: "Medium" })
    toast.success("Đã tạo form văn bản và trình ký thành công!")
  }

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Vui lòng ký tên")
      return
    }
    
    setRequests(requests.map(r => r.id === viewRequest.id ? { ...r, status: 'signed' } : r))
    setViewRequest({ ...viewRequest, status: 'signed' })
    setIsSigning(false)
    toast.success("Đã ký duyệt văn bản thành công!")
  }

  const exportPDF = async () => {
    if (!printRef.current) return
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`VanBan_${viewRequest.id}.pdf`)
      toast.success("Đã xuất PDF thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xuất PDF")
    }
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
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tổng văn bản</p>
              <h3 className="text-xl font-bold">{requests.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Chờ trình ký</p>
              <h3 className="text-xl font-bold">{requests.filter(r => r.status === 'pending_sign').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Đã ký duyệt</p>
              <h3 className="text-xl font-bold text-emerald-700">{requests.filter(r => r.status === 'signed').length}</h3>
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
              <h3 className="text-xl font-bold">{requests.filter(r => r.status === 'rejected').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm văn bản..." className="pl-9 h-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Lọc
          </Button>
          <Button className="h-10 shadow-sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo form văn bản
          </Button>
        </div>
      </div>

      {/* Create Document Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo Form Văn Bản & Trình Ký</DialogTitle>
            <DialogDescription>
              Soạn thảo văn bản hành chính và gửi trình ký điện tử.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề văn bản <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                value={newRequest.title} 
                onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                placeholder="VD: Tờ trình xin mua sắm trang thiết bị"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại văn bản</Label>
                <Select value={newRequest.type} onValueChange={(val) => setNewRequest({...newRequest, type: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mua sắm">Tờ trình mua sắm</SelectItem>
                    <SelectItem value="Thanh toán">Đề nghị thanh toán</SelectItem>
                    <SelectItem value="Công tác">Quyết định công tác</SelectItem>
                    <SelectItem value="Thông báo">Thông báo nội bộ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requester">Người trình ký <span className="text-red-500">*</span></Label>
                <Select value={newRequest.requester} onValueChange={(val) => setNewRequest({...newRequest, requester: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người trình" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.name}>{emp.name} ({emp.dept})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung chi tiết <span className="text-red-500">*</span></Label>
              <Textarea 
                id="content" 
                value={newRequest.content} 
                onChange={(e) => setNewRequest({...newRequest, content: e.target.value})}
                placeholder="Nhập nội dung văn bản trình ký..."
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền (VNĐ) - Nếu có</Label>
                <Input 
                  id="amount" 
                  type="number"
                  value={newRequest.amount} 
                  onChange={(e) => setNewRequest({...newRequest, amount: e.target.value})}
                  placeholder="VD: 5000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                <Select value={newRequest.priority} onValueChange={(val) => setNewRequest({...newRequest, priority: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Bình thường</SelectItem>
                    <SelectItem value="Medium">Quan trọng</SelectItem>
                    <SelectItem value="High">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateRequest} className="bg-blue-600 hover:bg-blue-700">
              <FileSignature className="mr-2 h-4 w-4" /> Trình ký ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View & Sign Document Modal */}
      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-slate-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <DialogTitle className="text-xl font-bold text-blue-900">Chi tiết Văn bản</DialogTitle>
              <DialogDescription>Mã số: {viewRequest?.id}</DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportPDF} className="bg-white">
                <Download className="mr-2 h-4 w-4" /> Xuất PDF
              </Button>
            </div>
          </DialogHeader>

          {/* Document Preview Area for PDF Export */}
          <div className="bg-white p-8 border shadow-sm my-4 min-h-[400px]" ref={printRef}>
            <div className="text-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-bold uppercase mb-2">{viewRequest?.title}</h2>
              <p className="text-sm text-gray-500">Ngày lập: {viewRequest?.date} | Loại: {viewRequest?.type}</p>
            </div>
            
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-500">Người trình ký:</p>
                  <p className="font-medium text-lg">{viewRequest?.requester}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Mức độ ưu tiên:</p>
                  <p className="font-medium">{viewRequest?.priority}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-500 mb-2">Nội dung trình ký:</p>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap border">
                  {viewRequest?.content}
                </div>
              </div>

              {viewRequest?.amount > 0 && (
                <div>
                  <p className="font-semibold text-gray-500">Tổng số tiền đề nghị:</p>
                  <p className="font-bold text-lg text-blue-700">{viewRequest?.amount.toLocaleString()} VNĐ</p>
                </div>
              )}

              <div className="mt-12 pt-8 border-t grid grid-cols-2 gap-8 text-center">
                <div>
                  <p className="font-bold mb-16">Người đề nghị</p>
                  <p className="text-gray-500 italic">(Đã ký)</p>
                  <p className="font-medium mt-2">{viewRequest?.requester}</p>
                </div>
                <div>
                  <p className="font-bold mb-4">Người phê duyệt</p>
                  {viewRequest?.status === 'signed' ? (
                    <div className="flex flex-col items-center">
                      <div className="border-2 border-red-500 text-red-500 font-bold p-2 rotate-[-10deg] inline-block mb-4">
                        APPROVED / ĐÃ DUYỆT
                      </div>
                      <p className="font-medium">Ban Giám Đốc</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic mt-12">Chưa ký duyệt</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Signing Area */}
          {viewRequest?.status === 'pending_sign' && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <PenTool className="h-5 w-5 text-blue-600" /> Ký duyệt văn bản
              </h3>
              <div className="p-4 bg-white rounded-xl border border-dashed border-blue-200 text-center space-y-4">
                <p className="text-sm text-slate-500 italic">"Tôi xác nhận phê duyệt nội dung văn bản này."</p>
                <div className="h-32 bg-slate-50 rounded-xl border flex items-center justify-center relative">
                  <SignatureCanvas 
                    ref={sigCanvas}
                    penColor='blue'
                    canvasProps={{style: {width: '100%', height: '100%'}, className: 'sigCanvas'}} 
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => sigCanvas.current?.clear()}>Xóa chữ ký</Button>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" 
                onClick={handleSign}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" /> Xác nhận & Ký duyệt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[120px]">Mã VB</TableHead>
                <TableHead>Tiêu đề / Nội dung</TableHead>
                <TableHead>Người trình ký</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="group hover:bg-slate-50/50">
                  <TableCell className="font-medium font-mono text-xs text-slate-500">{req.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col max-w-[300px]">
                      <span className="font-bold text-blue-900 truncate">{req.title}</span>
                      <span className="text-xs text-slate-500 truncate">{req.content}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{req.requester}</span>
                      <span className="text-[10px] text-slate-400">{req.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-700">
                    {req.amount > 0 ? `${req.amount.toLocaleString()} ₫` : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{req.date}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {req.status === 'pending_sign' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setViewRequest(req)}>
                          <PenTool className="h-4 w-4 mr-1" /> Ký duyệt
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setViewRequest(req)}>
                        <Eye className="h-4 w-4 mr-1" /> Xem
                      </Button>
                    </div>
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

