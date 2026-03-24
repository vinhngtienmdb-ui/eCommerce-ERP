import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { 
  Plus, X, FileText, Save, PenTool, Check, ArrowLeft, 
  Loader2, Building2, CreditCard, History, Search, 
  Download, Printer, FileDown, Briefcase, User, Calendar
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { useDataStore, PaymentRequestData, Vendor, ServiceType } from "@/src/store/useDataStore";
import { useAuth } from "@/src/lib/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import SignatureCanvas from 'react-signature-canvas';
import { motion, AnimatePresence } from "motion/react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceAttachment {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
}

const PaymentRequest = () => {
  const { 
    paymentRequests, addPaymentRequest, updatePaymentRequest, 
    vendors, addVendor, updateVendor, deleteVendor,
    serviceTypes, eContracts
  } = useDataStore();

  const [view, setView] = useState<'list' | 'form' | 'vendors' | 'settings'>('list');
  const [activeTab, setActiveTab] = useState('all');
  const [attachments, setAttachments] = useState<InvoiceAttachment[]>([{ id: '1', invoiceNumber: '', date: '', amount: '' }]);
  
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    transactionType: 'payment' as 'payment' | 'advance' | 'settlement',
    serviceTypeId: '',
    vendorId: '',
    contractId: '',
    period: '',
    invoiceNumber: '',
    department: 'Phòng Hành chính', // Default or from user profile
    requester: user?.displayName || user?.email || '',
    content: '',
    totalAmount: '',
    advanceAmount: '0',
    paymentMethod: 'transfer' as 'transfer' | 'cash' | 'refund',
    bankAccount: '',
    beneficiary: '',
    bankName: ''
  });

  useEffect(() => {
    if (user && !formData.requester) {
      setFormData(prev => ({
        ...prev,
        requester: user.displayName || user.email || ''
      }));
    }
  }, [user]);

  const [signingRequest, setSigningRequest] = useState<PaymentRequestData | null>(null);
  const sigCanvas = useRef<any>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Vendor Management State
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  // Service Type State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const { addServiceType } = useDataStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    let autoContractId = '';
    
    if (vendor) {
      // Auto-link contract if available
      const relatedContract = eContracts.find(c => c.party.toLowerCase().includes(vendor.name.toLowerCase()));
      if (relatedContract) {
        autoContractId = relatedContract.id;
      }

      setFormData({
        ...formData,
        vendorId,
        contractId: autoContractId,
        bankAccount: vendor.bankAccount,
        beneficiary: vendor.beneficiary,
        bankName: vendor.bankName
      });
    } else {
      setFormData({ ...formData, vendorId, contractId: '' });
    }
  };

  const addAttachment = () => {
    setAttachments([...attachments, { id: Math.random().toString(36).substr(2, 9), invoiceNumber: '', date: '', amount: '' }]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const updateAttachment = (id: string, field: keyof InvoiceAttachment, value: string) => {
    setAttachments(attachments.map(att => att.id === id ? { ...att, [field]: value } : att));
  };

  const savePaymentRequest = () => {
    if (!formData.requester || !formData.totalAmount || !formData.serviceTypeId) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }

    const newReq: PaymentRequestData = {
      id: `PR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      ...formData,
      status: 'pending_sign',
      createdAt: new Date().toISOString()
    };
    addPaymentRequest(newReq);
    toast.success("Đề nghị đã được lưu và chuyển sang chờ ký!");
    setView('list');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      transactionType: 'payment',
      serviceTypeId: '',
      vendorId: '',
      contractId: '',
      period: '',
      invoiceNumber: '',
      department: 'Phòng Hành chính',
      requester: user?.displayName || user?.email || '',
      content: '',
      totalAmount: '',
      advanceAmount: '0',
      paymentMethod: 'transfer',
      bankAccount: '',
      beneficiary: '',
      bankName: ''
    });
    setAttachments([{ id: '1', invoiceNumber: '', date: '', amount: '' }]);
  };

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Vui lòng ký tên");
      return;
    }
    setIsSigning(true);
    setTimeout(() => {
      if (signingRequest) {
        updatePaymentRequest(signingRequest.id, { status: 'signed' });
        toast.success("Đã ký số thành công! Dữ liệu đã đồng bộ sang module Tài chính.");
      }
      setIsSigning(false);
      setSigningRequest(null);
    }, 1500);
  };

  const exportToDocx = async (data: PaymentRequestData) => {
    const service = serviceTypes.find(s => s.id === data.serviceTypeId)?.name || data.serviceTypeId;
    const vendor = vendors.find(v => v.id === data.vendorId)?.name || "N/A";

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({ children: [new TextRun({ text: "" })] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ 
                text: data.transactionType === 'payment' ? "GIẤY ĐỀ NGHỊ THANH TOÁN" : 
                      data.transactionType === 'advance' ? "GIẤY ĐỀ NGHỊ TẠM ỨNG" : "GIẤY ĐỀ NGHỊ HOÀN ỨNG", 
                bold: true, 
                size: 32 
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Số: ${data.id}`, italics: true, size: 20 }),
            ],
          }),
          new Paragraph({ children: [new TextRun({ text: "" })] }),
          new Paragraph({ children: [new TextRun({ text: `Kính gửi: Ban Giám đốc / Phòng Tài chính Kế toán`, bold: true })] }),
          new Paragraph({ children: [new TextRun({ text: `Người đề nghị: ${data.requester}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Bộ phận: ${data.department}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Nội dung: ${data.content}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Loại dịch vụ: ${service}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Đơn vị cung cấp: ${vendor}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Số tiền: ${Number(data.totalAmount).toLocaleString()} VNĐ`, bold: true })] }),
          new Paragraph({ children: [new TextRun({ text: `Hình thức: ${data.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt'}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Thông tin thụ hưởng: ${data.beneficiary} - ${data.bankAccount} - ${data.bankName}` })] }),
          new Paragraph({ children: [new TextRun({ text: "" })] }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `Ngày .... tháng .... năm 2026`, italics: true }),
            ],
          }),
          new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new DocxTableRow({
                children: [
                  new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Người đề nghị", bold: true })], alignment: AlignmentType.CENTER })] }),
                  new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Kế toán trưởng", bold: true })], alignment: AlignmentType.CENTER })] }),
                  new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Giám đốc", bold: true })], alignment: AlignmentType.CENTER })] }),
                ],
              }),
              new DocxTableRow({
                children: [
                  new DocxTableCell({ children: [new Paragraph({ text: "\n\n\n" })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: "\n\n\n" })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: "\n\n\n" })] }),
                ],
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `DeNghiThanhToan_${data.id}.docx`);
    toast.success("Đã xuất file .docx thành công!");
  };

  const exportToPdf = async (id: string) => {
    const element = document.getElementById(`pr-preview-${id}`);
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`DeNghiThanhToan_${id}.pdf`);
    toast.success("Đã xuất file PDF thành công!");
  };

  const filteredRequests = paymentRequests.filter(req => {
    const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         req.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || req.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const vendorData: any = Object.fromEntries(formData.entries());
    
    if (editingVendor) {
      updateVendor(editingVendor.id, vendorData);
      toast.success("Đã cập nhật thông tin nhà cung cấp");
    } else {
      addVendor({
        id: `V-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...vendorData
      });
      toast.success("Đã thêm nhà cung cấp mới");
    }
    setIsVendorModalOpen(false);
    setEditingVendor(null);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const serviceData: any = Object.fromEntries(formData.entries());
    
    addServiceType({
      id: `ST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...serviceData
    });
    toast.success("Đã thêm loại dịch vụ mới");
    setIsServiceModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Đề Nghị Thanh Toán</h1>
                <p className="text-slate-500 mt-1">Quản lý các yêu cầu thanh toán, tạm ứng và hoàn ứng</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setView('vendors')} className="border-slate-200">
                  <Building2 className="mr-2 h-4 w-4" /> Nhà cung cấp
                </Button>
                <Button variant="outline" onClick={() => setView('settings')} className="border-slate-200">
                  <Plus className="mr-2 h-4 w-4" /> Loại dịch vụ
                </Button>
                <Button onClick={() => setView('form')} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                  <Plus className="mr-2 h-4 w-4" /> Tạo đề nghị mới
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Tổng yêu cầu</p>
                    <p className="text-2xl font-bold text-slate-900">{paymentRequests.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                    <PenTool className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Chờ ký</p>
                    <p className="text-2xl font-bold text-slate-900">{paymentRequests.filter(r => r.status === 'pending_sign').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Đã duyệt</p>
                    <p className="text-2xl font-bold text-slate-900">{paymentRequests.filter(r => r.status === 'signed').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Đã chi</p>
                    <p className="text-2xl font-bold text-slate-900">{paymentRequests.filter(r => r.status === 'paid').length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                    <TabsList className="bg-slate-200/50 p-1">
                      <TabsTrigger value="all">Tất cả</TabsTrigger>
                      <TabsTrigger value="pending_sign">Chờ ký</TabsTrigger>
                      <TabsTrigger value="signed">Đã ký</TabsTrigger>
                      <TabsTrigger value="paid">Đã chi</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Tìm kiếm mã, người đề nghị..." 
                      className="pl-9 border-slate-200 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="w-[100px]">Mã ĐN</TableHead>
                      <TableHead>Người đề nghị</TableHead>
                      <TableHead>Loại / Nội dung</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-indigo-600">{req.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                              {req.requester.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-700">{req.requester}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 uppercase font-semibold">
                              {req.transactionType === 'payment' ? 'Thanh toán' : req.transactionType === 'advance' ? 'Tạm ứng' : 'Hoàn ứng'}
                            </span>
                            <span className="text-sm text-slate-700 truncate max-w-[200px]">{req.content}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          {Number(req.totalAmount).toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            req.status === 'signed' ? 'bg-green-50 text-green-700 border-green-200' :
                            req.status === 'pending_sign' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            req.status === 'paid' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }>
                            {req.status === 'signed' ? 'Đã duyệt' : req.status === 'pending_sign' ? 'Chờ ký' : req.status === 'paid' ? 'Đã chi' : 'Bản nháp'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {req.status === 'pending_sign' && (
                              <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => setSigningRequest(req)}>
                                <PenTool className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-slate-100" onClick={() => exportToDocx(req)}>
                              <FileDown className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-slate-100" onClick={() => exportToPdf(req.id)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                          Không tìm thấy đề nghị nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {view === 'form' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setView('list')} className="rounded-full hover:bg-slate-200">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-slate-900">Tạo Đề Nghị Mới</h1>
            </div>

            <Card className="bg-white border-slate-200 shadow-xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg">Thông tin chung</CardTitle>
                <CardDescription>Vui lòng điền chính xác các thông tin thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Transaction Type Selection */}
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setFormData({...formData, transactionType: 'payment'})}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.transactionType === 'payment' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm font-bold">Thanh toán</span>
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, transactionType: 'advance'})}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.transactionType === 'advance' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                  >
                    <History className="h-6 w-6" />
                    <span className="text-sm font-bold">Tạm ứng</span>
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, transactionType: 'settlement'})}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.transactionType === 'settlement' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                  >
                    <Check className="h-6 w-6" />
                    <span className="text-sm font-bold">Hoàn ứng</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loại dịch vụ / Chi phí</label>
                    <Select value={formData.serviceTypeId} onValueChange={(v) => setFormData({...formData, serviceTypeId: v, vendorId: '', contractId: ''})}>
                      <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                        <SelectValue placeholder="Chọn loại dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(st => (
                          <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nhà cung cấp</label>
                    <Select value={formData.vendorId} onValueChange={handleVendorChange} disabled={!formData.serviceTypeId}>
                      <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                        <SelectValue placeholder={formData.serviceTypeId ? "Chọn nhà cung cấp" : "Vui lòng chọn loại dịch vụ trước"} />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.filter(v => !v.serviceTypeId || v.serviceTypeId === formData.serviceTypeId).map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Liên kết Hợp đồng</label>
                    <Select value={formData.contractId} onValueChange={(v) => setFormData({...formData, contractId: v})}>
                      <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                        <SelectValue placeholder="Chọn hợp đồng (nếu có)" />
                      </SelectTrigger>
                      <SelectContent>
                        {eContracts.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.title} ({c.id})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kỳ thanh toán</label>
                    <div className="flex gap-2">
                      <Select 
                        value={formData.period.split(' ')[0] || 'Tháng'} 
                        onValueChange={(v) => {
                          const currentVal = formData.period.split(' ').slice(1).join(' ');
                          setFormData({...formData, period: `${v} ${currentVal}`.trim()});
                        }}
                      >
                        <SelectTrigger className="w-[120px] bg-slate-50 border-slate-200 h-11">
                          <SelectValue placeholder="Loại kỳ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tháng">Tháng</SelectItem>
                          <SelectItem value="Quý">Quý</SelectItem>
                          <SelectItem value="Nửa năm">Nửa năm</SelectItem>
                          <SelectItem value="Năm">Năm</SelectItem>
                          <SelectItem value="Từ">Từ tháng - đến</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        value={formData.period.split(' ').slice(1).join(' ')} 
                        onChange={(e) => {
                          const prefix = formData.period.split(' ')[0] || 'Tháng';
                          setFormData({...formData, period: `${prefix} ${e.target.value}`.trim()});
                        }} 
                        className="flex-1 bg-slate-50 border-slate-200 h-11" 
                        placeholder={formData.period.startsWith('Từ') ? "tháng 1 đến tháng 3/2026" : "03/2026"} 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Người đề nghị</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input name="requester" value={formData.requester} onChange={handleInputChange} className="pl-10 bg-slate-50 border-slate-200 h-11" placeholder="Họ tên người đề nghị" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phòng ban</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input name="department" value={formData.department} onChange={handleInputChange} className="pl-10 bg-slate-50 border-slate-200 h-11" placeholder="Tên phòng ban" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nội dung đề nghị</label>
                  <Textarea name="content" value={formData.content} onChange={handleInputChange} className="bg-slate-50 border-slate-200 min-h-[100px]" placeholder="Mô tả chi tiết nội dung thanh toán/tạm ứng..." />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hóa đơn / Chứng từ đính kèm</label>
                    <Button variant="outline" size="sm" onClick={addAttachment} className="h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      <Plus className="mr-1 h-3 w-3" /> Thêm chứng từ
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {attachments.map((att, index) => (
                      <div key={att.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
                        <Input className="flex-1 bg-slate-50 border-slate-200" placeholder="Số hóa đơn" value={att.invoiceNumber} onChange={(e) => updateAttachment(att.id, 'invoiceNumber', e.target.value)} />
                        <Input className="w-40 bg-slate-50 border-slate-200" type="date" value={att.date} onChange={(e) => updateAttachment(att.id, 'date', e.target.value)} />
                        <Input className="w-40 bg-slate-50 border-slate-200" placeholder="Số tiền" value={att.amount} onChange={(e) => updateAttachment(att.id, 'amount', e.target.value)} />
                        {attachments.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeAttachment(att.id)} className="text-red-500 hover:bg-red-50">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Tổng số tiền đề nghị (VNĐ)</label>
                    <Input name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} className="bg-white border-indigo-200 h-12 text-lg font-bold text-indigo-700" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Số tiền đã tạm ứng (nếu có)</label>
                    <Input name="advanceAmount" value={formData.advanceAmount} onChange={handleInputChange} className="bg-white border-indigo-200 h-12 text-lg font-bold text-indigo-700" placeholder="0" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin thanh toán</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={formData.paymentMethod === 'transfer' ? 'default' : 'outline'} 
                      onClick={() => setFormData({...formData, paymentMethod: 'transfer'})}
                      className={formData.paymentMethod === 'transfer' ? 'bg-indigo-600' : 'border-slate-200'}
                    >Chuyển khoản</Button>
                    <Button 
                      variant={formData.paymentMethod === 'cash' ? 'default' : 'outline'} 
                      onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                      className={formData.paymentMethod === 'cash' ? 'bg-indigo-600' : 'border-slate-200'}
                    >Tiền mặt</Button>
                    <Button 
                      variant={formData.paymentMethod === 'refund' ? 'default' : 'outline'} 
                      onClick={() => setFormData({...formData, paymentMethod: 'refund'})}
                      className={formData.paymentMethod === 'refund' ? 'bg-indigo-600' : 'border-slate-200'}
                    >Hoàn tạm ứng</Button>
                  </div>

                  {formData.paymentMethod === 'transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                      <Input name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="bg-slate-50 border-slate-200" placeholder="Số tài khoản" />
                      <Input name="beneficiary" value={formData.beneficiary} onChange={handleInputChange} className="bg-slate-50 border-slate-200" placeholder="Tên đơn vị thụ hưởng" />
                      <Input name="bankName" value={formData.bankName} onChange={handleInputChange} className="bg-slate-50 border-slate-200" placeholder="Ngân hàng" />
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-4">
                  <Button variant="outline" onClick={() => setView('list')} className="flex-1 h-12 border-slate-200">Hủy bỏ</Button>
                  <Button onClick={savePaymentRequest} className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                    <Save className="mr-2 h-4 w-4" /> Trình ký phê duyệt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {view === 'vendors' && (
          <motion.div 
            key="vendors"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-6xl mx-auto space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setView('list')} className="rounded-full hover:bg-slate-200">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">Quản lý Nhà Cung Cấp</h1>
              </div>
              <Button onClick={() => { setEditingVendor(null); setIsVendorModalOpen(true); }} className="bg-indigo-600">
                <Plus className="mr-2 h-4 w-4" /> Thêm nhà cung cấp
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.map(vendor => (
                <Card key={vendor.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => { setEditingVendor(vendor); setIsVendorModalOpen(true); }}>
                          <PenTool className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => deleteVendor(vendor.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{vendor.name}</CardTitle>
                    <CardDescription className="text-xs font-mono">MST: {vendor.taxCode}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2 text-slate-600">
                      <CreditCard className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{vendor.bankAccount}</p>
                        <p className="text-xs">{vendor.beneficiary}</p>
                        <p className="text-xs">{vendor.bankName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="h-4 w-4" />
                      <span>{vendor.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{vendor.address}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
        {view === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setView('list')} className="rounded-full hover:bg-slate-200">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">Cấu hình Loại Dịch Vụ</h1>
              </div>
              <Button onClick={() => setIsServiceModalOpen(true)} className="bg-indigo-600">
                <Plus className="mr-2 h-4 w-4" /> Thêm loại dịch vụ
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map(st => (
                <Card key={st.id} className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{st.name}</CardTitle>
                    <CardDescription>{st.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-400 font-mono">ID: {st.id}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Thêm loại dịch vụ mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveService} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Tên dịch vụ</label>
              <Input name="name" required className="bg-slate-50 border-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Mô tả</label>
              <Textarea name="description" className="bg-slate-50 border-slate-200" />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Lưu cấu hình</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Vendor Modal */}
      <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>{editingVendor ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveVendor} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Tên nhà cung cấp</label>
                <Input name="name" defaultValue={editingVendor?.name} required className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Loại dịch vụ</label>
                <Select defaultValue={editingVendor?.serviceTypeId} onValueChange={(v) => {
                  const input = document.getElementById('hidden-service-type-id') as HTMLInputElement;
                  if (input) input.value = v;
                }}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Chọn loại dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(st => (
                      <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" id="hidden-service-type-id" name="serviceTypeId" defaultValue={editingVendor?.serviceTypeId} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Mã số thuế</label>
                <Input name="taxCode" defaultValue={editingVendor?.taxCode} className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ</label>
                <Input name="address" defaultValue={editingVendor?.address} className="bg-slate-50 border-slate-200" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Số tài khoản</label>
                <Input name="bankAccount" defaultValue={editingVendor?.bankAccount} className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Đơn vị thụ hưởng</label>
                <Input name="beneficiary" defaultValue={editingVendor?.beneficiary} className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Ngân hàng</label>
                <Input name="bankName" defaultValue={editingVendor?.bankName} className="bg-slate-50 border-slate-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Người liên hệ</label>
                <Input name="contactPerson" defaultValue={editingVendor?.contactPerson} className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                <Input name="phone" defaultValue={editingVendor?.phone} className="bg-slate-50 border-slate-200" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Lưu thông tin</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signing Modal */}
      <Dialog open={!!signingRequest} onOpenChange={(open) => !open && setSigningRequest(null)}>
        <DialogContent className="bg-white text-slate-900 sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="p-6 bg-indigo-600 text-white">
            <DialogTitle className="text-xl font-bold">Ký số phê duyệt</DialogTitle>
            <p className="text-indigo-100 text-sm mt-1">Xác nhận đề nghị thanh toán {signingRequest?.id}</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div id={`pr-preview-${signingRequest?.id}`} className="p-8 bg-white border border-slate-200 rounded-xl shadow-inner text-slate-800 space-y-4 font-serif text-sm">
              <div className="text-center space-y-1">
                <p className="font-bold uppercase">Cộng hòa xã hội chủ nghĩa Việt Nam</p>
                <p className="font-bold">Độc lập - Tự do - Hạnh phúc</p>
                <div className="w-32 h-px bg-slate-300 mx-auto mt-2"></div>
              </div>
              
              <div className="text-center py-4">
                <h2 className="text-xl font-bold uppercase tracking-wide">Giấy đề nghị thanh toán</h2>
                <p className="italic text-xs">Số: {signingRequest?.id}</p>
              </div>

              <div className="space-y-2">
                <p><span className="font-bold">Kính gửi:</span> Ban Giám đốc / Phòng Tài chính Kế toán</p>
                <p><span className="font-bold">Người đề nghị:</span> {signingRequest?.requester}</p>
                <p><span className="font-bold">Bộ phận:</span> {signingRequest?.department}</p>
                <p><span className="font-bold">Nội dung:</span> {signingRequest?.content}</p>
                <p><span className="font-bold">Số tiền:</span> {Number(signingRequest?.totalAmount).toLocaleString()} VNĐ</p>
                <p><span className="font-bold">Hình thức:</span> {signingRequest?.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt'}</p>
                <p><span className="font-bold">Thông tin thụ hưởng:</span> {signingRequest?.beneficiary} - {signingRequest?.bankAccount} - {signingRequest?.bankName}</p>
              </div>

              <div className="flex justify-between pt-8 text-center italic">
                <div>Người đề nghị</div>
                <div>Kế toán trưởng</div>
                <div>Giám đốc</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Ký tên vào khung dưới đây</p>
                <div className="h-40 bg-white rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden shadow-sm">
                  <SignatureCanvas 
                    ref={sigCanvas}
                    penColor='blue'
                    canvasProps={{style: {width: '100%', height: '100%'}, className: 'sigCanvas'}} 
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => sigCanvas.current?.clear()} className="text-slate-400 hover:text-red-500">Xóa chữ ký</Button>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-slate-200" onClick={() => setSigningRequest(null)}>Hủy</Button>
                <Button 
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100" 
                  disabled={isSigning}
                  onClick={handleSign}
                >
                  {isSigning ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                  Xác nhận & Ký số
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentRequest;
