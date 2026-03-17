import React, { useState, useEffect, useRef } from "react"
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
import { 
  Search, Plus, FileText, Download, Eye, Send, 
  Save, Edit, Trash2, Printer, CheckCircle, 
  Clock, AlertCircle, FileType, Settings,
  History, UserCheck, FileSignature
} from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/src/store/useDataStore"
import { db, auth } from "@/src/lib/firebase"
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore"
import { DOCUMENT_TYPES, DOCUMENT_FIELDS } from "@/src/constants/documentConstants"
import { downloadPDF, downloadWord, generatePDF } from "@/src/utils/documentUtils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { ScrollArea } from "@/src/components/ui/scroll-area"

interface DocumentData {
  id?: string
  type: string
  number: string
  title: string
  content: any
  status: string
  direction: "incoming" | "outgoing"
  sender: string
  receiver: string
  createdAt: string
  creatorId: string
  signatureSteps?: any[]
}

export function DocumentsPage() {
  const { t } = useTranslation()
  const { employees } = useDataStore()
  const [activeTab, setActiveTab] = useState("incoming")
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState(DOCUMENT_TYPES[12]) // Default to Công văn
  const [formData, setFormData] = useState<any>({})
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<DocumentData | null>(null)
  const [isSigningOpen, setIsSigningOpen] = useState(false)
  const [signingDoc, setSigningDoc] = useState<DocumentData | null>(null)
  const [autoNumber, setAutoNumber] = useState("")
  const [settings, setSettings] = useState<any>({ autoNumbering: false })

  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "documents"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentData))
      setDocuments(docs)
      setLoading(false)
    }, (error) => {
      console.error("Snapshot listener error:", error);
      toast.error("Lỗi khi tải dữ liệu văn bản: " + error.message);
      setLoading(false);
    })

    // Fetch auto-numbering settings
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "documents");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings(data);
          if (data.autoNumbering) {
            setAutoNumber(`${data.currentNumber}/${data.prefix}-${data.suffix}`);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();

    return () => unsubscribe()
  }, [])

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCreateDoc = async (status: string = "draft") => {
    if (!formData.title) {
      toast.error("Vui lòng nhập trích yếu nội dung")
      return
    }

    try {
      const docData: DocumentData = {
        type: selectedType,
        number: formData.number || autoNumber,
        title: formData.title,
        content: formData,
        status: status,
        direction: "outgoing",
        sender: "Công ty",
        receiver: formData.receiver || "",
        createdAt: new Date().toISOString(),
        creatorId: auth.currentUser?.uid || "anonymous",
        signatureSteps: [
          { role: "Người soạn", userId: auth.currentUser?.uid, status: "completed", date: new Date().toISOString() },
          { role: "Trưởng phòng", status: "pending" },
          { role: "Giám đốc", status: "pending" }
        ]
      }

      await addDoc(collection(db, "documents"), docData)
      toast.success("Đã lưu văn bản vào hệ thống")
      setActiveTab("outgoing")
      setFormData({})
      
      // Update auto-number if used
      if (settings.autoNumbering && (!formData.number || formData.number === autoNumber)) {
        const docRef = doc(db, "settings", "documents");
        await updateDoc(docRef, { currentNumber: settings.currentNumber + 1 });
      }
    } catch (error) {
      console.error("Error creating document:", error)
      toast.error("Lỗi khi lưu văn bản")
    }
  }

  const handleSign = async (docId: string, stepIndex: number) => {
    try {
      const docRef = doc(db, "documents", docId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data() as DocumentData
        const steps = [...(data.signatureSteps || [])]
        steps[stepIndex].status = "completed"
        steps[stepIndex].userId = auth.currentUser?.uid
        steps[stepIndex].date = new Date().toISOString()
        
        const allSigned = steps.every(s => s.status === "completed")
        const nextStatus = allSigned ? "signed" : "pending_signature"

        await updateDoc(docRef, { 
          signatureSteps: steps,
          status: nextStatus
        })
        toast.success("Đã ký văn bản thành công")
        setIsSigningOpen(false)
      }
    } catch (error) {
      console.error("Error signing document:", error)
      toast.error("Lỗi khi ký văn bản")
    }
  }

  const renderFields = () => {
    const fields = DOCUMENT_FIELDS[selectedType] || DOCUMENT_FIELDS.default
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label>Số/Ký hiệu</Label>
          <Input 
            value={formData.number || autoNumber} 
            onChange={(e) => handleFieldChange("number", e.target.value)}
            placeholder="VD: 01/CV-CTY" 
          />
        </div>
        {fields.map(field => {
          if (field === "content" || field === "basis" || field === "terms") {
            return (
              <div key={field} className="space-y-2 col-span-2">
                <Label>{t(`documents.fields.${field}`)}</Label>
                <Textarea 
                  value={formData[field] || ""} 
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={`Nhập ${t(`documents.fields.${field}`)}...`} 
                  rows={6} 
                />
              </div>
            )
          }
          if (field === "signer") {
            return (
              <div key={field} className="space-y-2">
                <Label>Người ký</Label>
                <Select value={formData.signer || ""} onValueChange={(v) => handleFieldChange("signer", v)}>
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
            )
          }
          return (
            <div key={field} className="space-y-2">
              <Label>{t(`documents.fields.${field}`)}</Label>
              <Input 
                value={formData[field] || ""} 
                onChange={(e) => handleFieldChange(field, e.target.value)}
                placeholder={`Nhập ${t(`documents.fields.${field}`)}...`} 
              />
            </div>
          )
        })}
      </div>
    )
  }

  const DocumentPreview = ({ docData }: { docData: DocumentData }) => {
    return (
      <div id="document-preview" className="p-12 bg-white text-black font-serif min-h-[842px] w-[595px] mx-auto shadow-lg border">
        <div className="flex justify-between mb-8">
          <div className="text-center">
            <div className="font-bold uppercase">CÔNG TY CP LUCKY</div>
            <div className="border-b border-black w-24 mx-auto my-1"></div>
            <div className="text-sm">Số: {docData.number}</div>
          </div>
          <div className="text-center">
            <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="font-bold">Độc lập - Tự do - Hạnh phúc</div>
            <div className="border-b border-black w-40 mx-auto my-1"></div>
            <div className="text-sm italic">Hà Nội, ngày {new Date(docData.createdAt).getDate()} tháng {new Date(docData.createdAt).getMonth() + 1} năm {new Date(docData.createdAt).getFullYear()}</div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="font-bold text-xl uppercase">{docData.type}</div>
          <div className="italic">{docData.title}</div>
        </div>

        <div className="whitespace-pre-wrap mb-12 text-justify leading-relaxed">
          {docData.content.content || docData.content.basis || "Nội dung văn bản..."}
        </div>

        <div className="flex justify-between">
          <div className="text-sm">
            <div className="font-bold">Nơi nhận:</div>
            <div className="whitespace-pre-wrap">{docData.content.receiver || "- Như trên;\n- Lưu: VT."}</div>
          </div>
          <div className="text-center w-64">
            <div className="font-bold uppercase">GIÁM ĐỐC</div>
            <div className="h-24 flex items-center justify-center italic text-muted-foreground">
              {docData.status === "signed" ? (
                <div className="border-2 border-red-500 text-red-500 p-2 rounded rotate-12 font-bold uppercase">
                  Đã ký số
                </div>
              ) : "(Chưa ký)"}
            </div>
            <div className="font-bold">Nguyễn Văn A</div>
          </div>
        </div>
      </div>
    )
  }

  const filteredDocs = documents.filter(doc => {
    if (activeTab === "incoming") return doc.direction === "incoming"
    if (activeTab === "outgoing") return doc.direction === "outgoing"
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Văn phòng điện tử</h1>
          <p className="text-muted-foreground">Hệ thống quản lý văn bản, trình ký và lưu trữ tập trung.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "/admin/document-settings"}>
            <Settings className="mr-2 h-4 w-4" />
            Cấu hình
          </Button>
          <Button onClick={() => setActiveTab("create")}>
            <Plus className="mr-2 h-4 w-4" />
            Soạn văn bản
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="incoming">Sổ văn bản đến</TabsTrigger>
          <TabsTrigger value="outgoing">Sổ văn bản đi</TabsTrigger>
          <TabsTrigger value="create">Soạn thảo</TabsTrigger>
          <TabsTrigger value="archive">Kho lưu trữ</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sổ văn bản đến</CardTitle>
              <CardDescription>Theo dõi và xử lý các văn bản gửi đến cơ quan.</CardDescription>
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
                    <TableHead>Số hiệu</TableHead>
                    <TableHead>Ngày đến</TableHead>
                    <TableHead>Trích yếu</TableHead>
                    <TableHead>Nơi gửi</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{new Date(doc.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{doc.title}</TableCell>
                      <TableCell>{doc.sender}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "pending_signature" ? "destructive" : "default"}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setPreviewDoc(doc); setIsPreviewOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
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
              <CardTitle>Sổ văn bản đi</CardTitle>
              <CardDescription>Quản lý các văn bản do cơ quan ban hành.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số hiệu</TableHead>
                    <TableHead>Ngày ban hành</TableHead>
                    <TableHead>Trích yếu</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.number}</TableCell>
                      <TableCell>{new Date(doc.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{doc.title}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "signed" ? "default" : "secondary"}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setPreviewDoc(doc); setIsPreviewOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSigningDoc(doc); setIsSigningOpen(true); }}>
                          <FileSignature className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => downloadWord(doc.title, doc.content.content || "", doc.number)}>
                          <Download className="h-4 w-4" />
                        </Button>
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
              <CardTitle>Soạn thảo văn bản mới</CardTitle>
              <CardDescription>Chọn loại văn bản và nhập thông tin theo mẫu.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Loại văn bản</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại văn bản" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-80">
                        {DOCUMENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trích yếu nội dung</Label>
                  <Input 
                    value={formData.title || ""} 
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="VD: V/v đề xuất hợp tác..." 
                  />
                </div>

                {renderFields()}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => { setPreviewDoc({ type: selectedType, number: formData.number || autoNumber, title: formData.title, content: formData, status: "draft", direction: "outgoing", sender: "Công ty", receiver: formData.receiver || "", createdAt: new Date().toISOString(), creatorId: "temp" }); setIsPreviewOpen(true); }}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem trước
                  </Button>
                  <Button variant="secondary" onClick={() => handleCreateDoc("draft")}>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu nháp
                  </Button>
                  <Button onClick={() => handleCreateDoc("pending_signature")}>
                    <Send className="mr-2 h-4 w-4" />
                    Trình ký
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Xem trước văn bản</DialogTitle>
            <DialogDescription>Định dạng văn bản theo chuẩn Nghị định 30/2020/NĐ-CP.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4 bg-muted/50 rounded-md">
            {previewDoc && <DocumentPreview docData={previewDoc} />}
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => downloadWord(previewDoc?.title || "", previewDoc?.content.content || "", previewDoc?.number || "DOC")}>
              <FileType className="mr-2 h-4 w-4" />
              Tải Word
            </Button>
            <Button onClick={() => downloadPDF("document-preview", previewDoc?.number || "DOC")}>
              <Download className="mr-2 h-4 w-4" />
              Tải PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signing Dialog */}
      <Dialog open={isSigningOpen} onOpenChange={setIsSigningOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trình ký văn bản</DialogTitle>
            <DialogDescription>Ký số xác nhận văn bản theo quy trình nhiều cấp.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {signingDoc?.signatureSteps?.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white",
                    step.status === "completed" ? "bg-green-500" : "bg-blue-500"
                  )}>
                    {step.status === "completed" ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{step.role}</div>
                    <div className="text-xs text-muted-foreground">
                      {step.status === "completed" ? `Đã ký lúc ${new Date(step.date).toLocaleString("vi-VN")}` : "Đang chờ ký"}
                    </div>
                  </div>
                </div>
                {step.status === "pending" && (
                  <Button size="sm" onClick={() => handleSign(signingDoc.id!, index)}>
                    Ký số
                  </Button>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSigningOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
