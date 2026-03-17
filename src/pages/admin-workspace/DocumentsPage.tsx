import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { Search, Plus, FileText, Download, Eye, Send } from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/src/store/useDataStore"

interface Document {
  id: string
  number: string
  title: string
  type: "Công văn" | "Quyết định" | "Tờ trình"
  date: string
  sender: string
  status: "Chờ xử lý" | "Đã xử lý" | "Đã ban hành"
}

export function DocumentsPage() {
  const { t } = useTranslation()
  const { employees } = useDataStore()
  const [activeTab, setActiveTab] = useState("incoming")
  const [docType, setDocType] = useState("cong-van")
  const [signer, setSigner] = useState("")

  const [incomingDocs] = useState<Document[]>([
    { id: "DOC-001", number: "123/CV-BCT", title: "V/v báo cáo tình hình kinh doanh quý 1", type: "Công văn", date: "2023-04-10", sender: "Bộ Công Thương", status: "Chờ xử lý" },
    { id: "DOC-002", number: "45/QĐ-UBND", title: "Quyết định phê duyệt dự án", type: "Quyết định", date: "2023-04-05", sender: "UBND Thành phố", status: "Đã xử lý" },
  ])

  const [outgoingDocs] = useState<Document[]>([
    { id: "DOC-003", number: "01/CV-CTY", title: "Đề xuất hợp tác kinh doanh", type: "Công văn", date: "2023-04-12", sender: "Công ty", status: "Đã ban hành" },
  ])

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signer) {
      toast.error("Vui lòng chọn người ký")
      return
    }
    toast.success("Đã tạo văn bản thành công theo chuẩn Nghị định 30")
    // In a real app, this would generate a PDF or Word document
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý văn bản (Nghị định 30)</h1>
        <p className="text-muted-foreground">Nhận, gửi và tạo văn bản hành chính theo chuẩn Nghị định 30/2020/NĐ-CP.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="incoming">Văn bản đến</TabsTrigger>
          <TabsTrigger value="outgoing">Văn bản đi</TabsTrigger>
          <TabsTrigger value="create">Tạo văn bản mới</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách văn bản đến</CardTitle>
              <CardDescription>Quản lý các văn bản nhận được từ cơ quan, đối tác.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm số hiệu, trích yếu..." className="pl-8" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số/Ký hiệu</TableHead>
                    <TableHead>Ngày ban hành</TableHead>
                    <TableHead>Trích yếu</TableHead>
                    <TableHead>Nơi gửi</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomingDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{doc.title}</TableCell>
                      <TableCell>{doc.sender}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "Chờ xử lý" ? "destructive" : "default"}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách văn bản đi</CardTitle>
              <CardDescription>Quản lý các văn bản do công ty ban hành.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số/Ký hiệu</TableHead>
                    <TableHead>Ngày ban hành</TableHead>
                    <TableHead>Trích yếu</TableHead>
                    <TableHead>Loại văn bản</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outgoingDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{doc.title}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Badge variant="default">{doc.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soạn thảo văn bản (Chuẩn NĐ 30)</CardTitle>
              <CardDescription>Tạo Công văn hoặc Quyết định với thể thức chuẩn.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDoc} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loại văn bản</Label>
                    <Select value={docType} onValueChange={setDocType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại văn bản" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cong-van">Công văn</SelectItem>
                        <SelectItem value="quyet-dinh">Quyết định</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Số/Ký hiệu</Label>
                    <Input placeholder="VD: 01/CV-CTY" />
                  </div>
                </div>

                {docType === "cong-van" && (
                  <div className="space-y-2">
                    <Label>Kính gửi (Cơ quan nhận)</Label>
                    <Input placeholder="VD: Sở Kế hoạch và Đầu tư" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Trích yếu nội dung</Label>
                  <Input placeholder="VD: V/v đề xuất hợp tác..." />
                </div>

                {docType === "quyet-dinh" && (
                  <div className="space-y-2">
                    <Label>Căn cứ ban hành</Label>
                    <Textarea placeholder="Căn cứ Luật Doanh nghiệp...&#10;Căn cứ Điều lệ công ty..." rows={3} />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Nội dung văn bản</Label>
                  <Textarea placeholder="Nhập nội dung chi tiết..." rows={8} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nơi nhận</Label>
                    <Textarea placeholder="- Như trên;&#10;- Lưu: VT." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Người ký (Chức vụ - Họ tên)</Label>
                    <Select value={signer} onValueChange={setSigner}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn người ký" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.pos} - {emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem trước
                  </Button>
                  <Button type="submit">
                    <FileText className="mr-2 h-4 w-4" />
                    Tạo văn bản
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
