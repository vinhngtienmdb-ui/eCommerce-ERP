import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Plus, X, FileText, Save, PenTool, Check, ArrowLeft, Loader2 } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { useDataStore, PaymentRequestData } from "@/src/store/useDataStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import SignatureCanvas from 'react-signature-canvas';

interface InvoiceAttachment {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
}

const PaymentRequest = () => {
  const { paymentRequests, addPaymentRequest, updatePaymentRequest } = useDataStore();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [attachments, setAttachments] = useState<InvoiceAttachment[]>([{ id: '1', invoiceNumber: '', date: '', amount: '' }]);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [formData, setFormData] = useState({
    type: 'electricity',
    supplier: 'evn',
    period: '',
    invoiceNumber: '',
    department: '',
    requester: '',
    content: '',
    totalAmount: '',
    advanceAmount: '',
    bankAccount: '',
    beneficiary: '',
    bankName: ''
  });

  const [signingRequest, setSigningRequest] = useState<PaymentRequestData | null>(null);
  const sigCanvas = useRef<any>(null);
  const [isSigning, setIsSigning] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const newReq: PaymentRequestData = {
      id: `PR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData,
      paymentMethod,
      status: 'pending_sign',
      createdAt: new Date().toISOString()
    };
    addPaymentRequest(newReq);
    toast.success("Đề nghị thanh toán đã được lưu và chuyển sang chờ ký!");
    setView('list');
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
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: "GIẤY ĐỀ NGHỊ THANH TOÁN", bold: true, size: 32 })], alignment: "center" }),
          new Paragraph({ children: [new TextRun({ text: `Loại chi phí: ${data.type}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Nhà cung cấp: ${data.supplier}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Kỳ thanh toán: ${data.period}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Số tiền đề nghị: ${data.totalAmount}` })] }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `DeNghiThanhToan_${data.id}.docx`);
    toast.success("Đã xuất file .docx!");
  };

  if (view === 'list') {
    return (
      <div className="p-6 bg-[#0f0c29] min-h-screen text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold">Quản lý Đề Nghị Thanh Toán</h1>
          </div>
          <Button onClick={() => setView('form')} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Tạo đề nghị mới
          </Button>
        </div>

        <Card className="bg-[#1a1633] border-none text-white">
          <CardHeader>
            <CardTitle>Danh sách đề nghị thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-gray-400">Mã ĐN</TableHead>
                  <TableHead className="text-gray-400">Người đề nghị</TableHead>
                  <TableHead className="text-gray-400">Nội dung</TableHead>
                  <TableHead className="text-gray-400">Số tiền</TableHead>
                  <TableHead className="text-gray-400">Trạng thái</TableHead>
                  <TableHead className="text-gray-400 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRequests.map((req) => (
                  <TableRow key={req.id} className="border-b border-white/5">
                    <TableCell className="font-medium">{req.id}</TableCell>
                    <TableCell>{req.requester}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{req.content}</TableCell>
                    <TableCell>{Number(req.totalAmount).toLocaleString()} VNĐ</TableCell>
                    <TableCell>
                      <Badge className={
                        req.status === 'signed' ? 'bg-green-500/20 text-green-400' :
                        req.status === 'pending_sign' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-blue-500/20 text-blue-400'
                      }>
                        {req.status === 'signed' ? 'Đã ký (Đã ĐB Tài chính)' : req.status === 'pending_sign' ? 'Chờ ký' : req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'pending_sign' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setSigningRequest(req)}>
                            <PenTool className="h-4 w-4 mr-1" /> Ký số
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10" onClick={() => exportToDocx(req)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!signingRequest} onOpenChange={(open) => !open && setSigningRequest(null)}>
          <DialogContent className="bg-white text-slate-900 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ký số Đề nghị thanh toán</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-4">
                <p className="text-sm text-slate-500 italic">"Tôi xác nhận các thông tin trong đề nghị thanh toán {signingRequest?.id} là chính xác và đồng ý ký số."</p>
                <div className="h-32 bg-white rounded-xl border flex items-center justify-center relative">
                  <SignatureCanvas 
                    ref={sigCanvas}
                    penColor='black'
                    canvasProps={{style: {width: '100%', height: '100%'}, className: 'sigCanvas'}} 
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => sigCanvas.current?.clear()}>Xóa chữ ký</Button>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isSigning}
                onClick={handleSign}
              >
                {isSigning ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                Xác nhận & Ký
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0f0c29] min-h-screen text-white">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setView('list')} className="hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <FileText className="h-6 w-6 text-purple-400" />
        <h1 className="text-2xl font-bold">Tạo Đề Nghị Thanh Toán</h1>
      </div>

      <Card className="bg-[#1a1633] border-none text-white">
        <CardContent className="p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">LOẠI CHI PHÍ</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-[#0f0c29] border-none">
                  <SelectValue placeholder="Tiền điện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Tiền điện</SelectItem>
                  <SelectItem value="water">Tiền nước</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">NHÀ CUNG CẤP</label>
              <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
                <SelectTrigger className="bg-[#0f0c29] border-none">
                  <SelectValue placeholder="Tổng Cty Điện lực TP.HCM (EVNHCMC)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evn">Tổng Cty Điện lực TP.HCM (EVNHCMC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">KỲ THANH TOÁN</label>
              <Input name="period" value={formData.period} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="Tháng 03/2026" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">MÃ KH / SỐ HĐ</label>
              <Input name="invoiceNumber" value={formData.invoiceNumber} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="PE0413-000XXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">PHÒNG/BAN</label>
              <Input name="department" value={formData.department} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="PHÒNG TCTH" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">HỌ TÊN NGƯỜI ĐỀ NGHỊ THANH TOÁN</label>
            <Input name="requester" value={formData.requester} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="Hoàng Văn Long" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">NỘI DUNG THANH TOÁN (TỰ ĐỘNG)</label>
            <Textarea name="content" value={formData.content} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="Thanh toán tiền điện Tháng 03/2026, mã KH: PE0413-000XXX" />
          </div>

          {/* Section 3: Attachments */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">HÓA ĐƠN ĐÍNH KÈM</label>
              <Button variant="outline" size="sm" onClick={addAttachment} className="bg-[#0f0c29] border-none text-white">+ Thêm HĐ</Button>
            </div>
            {attachments.map((att, index) => (
              <div key={att.id} className="grid grid-cols-4 gap-2 items-center">
                <Input className="bg-[#0f0c29] border-none" placeholder="Số HĐ" value={att.invoiceNumber} onChange={(e) => updateAttachment(att.id, 'invoiceNumber', e.target.value)} />
                <Input className="bg-[#0f0c29] border-none" placeholder="20/03/2026" value={att.date} onChange={(e) => updateAttachment(att.id, 'date', e.target.value)} />
                <Input className="bg-[#0f0c29] border-none" placeholder="Số tiền" value={att.amount} onChange={(e) => updateAttachment(att.id, 'amount', e.target.value)} />
                {attachments.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeAttachment(att.id)}><X className="h-4 w-4 text-red-500" /></Button>
                )}
              </div>
            ))}
          </div>

          {/* Section 4: Amounts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">SỐ TIỀN ĐỀ NGHỊ THANH TOÁN (VNĐ)</label>
              <Input name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="1500000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">SỐ TIỀN ĐÃ TẠM ỨNG</label>
              <Input name="advanceAmount" value={formData.advanceAmount} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="0" />
            </div>
          </div>

          {/* Section 5: Payment Method */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">HÌNH THỨC THANH TOÁN</label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={paymentMethod === 'transfer' ? 'default' : 'outline'} onClick={() => setPaymentMethod('transfer')} className={paymentMethod === 'transfer' ? 'bg-purple-600 text-white' : 'bg-[#0f0c29] border-none text-white'}>Chuyển khoản</Button>
              <Button variant={paymentMethod === 'cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cash')} className={paymentMethod === 'cash' ? 'bg-purple-600 text-white' : 'bg-[#0f0c29] border-none text-white'}>Tiền mặt</Button>
              <Button variant={paymentMethod === 'refund' ? 'default' : 'outline'} onClick={() => setPaymentMethod('refund')} className={paymentMethod === 'refund' ? 'bg-purple-600 text-white' : 'bg-[#0f0c29] border-none text-white'}>Hoàn tạm ứng</Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="Số tài khoản" />
            <Input name="beneficiary" value={formData.beneficiary} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="Tên đơn vị thụ hưởng" />
            <Input name="bankName" value={formData.bankName} onChange={handleInputChange} className="bg-[#0f0c29] border-none" placeholder="Tại ngân hàng" />
          </div>

          <div className="flex gap-4">
            <Button onClick={savePaymentRequest} className="flex-1 bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" /> Trình ký
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRequest;

