import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useDataStore } from "@/src/store/useDataStore";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  recipient: string;
  amount: number;
  type: 'GTGT' | 'Hoa hồng' | 'Đề nghị thanh toán';
  status: 'Đã thanh toán' | 'Chưa thanh toán' | 'Đã hủy' | 'Chờ thanh toán';
}

const InvoiceManagement = () => {
  const { t } = useTranslation();
  const { paymentRequests } = useDataStore();

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', invoiceNumber: 'INV-001', date: '2026-03-20', recipient: 'Công ty A', amount: 10000000, type: 'GTGT', status: 'Đã thanh toán' },
    { id: '2', invoiceNumber: 'INV-002', date: '2026-03-19', recipient: 'KOL B', amount: 5000000, type: 'Hoa hồng', status: 'Chưa thanh toán' },
  ]);

  // Merge local invoices with signed payment requests
  const allInvoices: Invoice[] = [
    ...invoices,
    ...paymentRequests
      .filter(req => req.status === 'signed' || req.status === 'paid')
      .map(req => ({
        id: req.id,
        invoiceNumber: req.invoiceNumber || req.id,
        date: req.createdAt.split('T')[0],
        recipient: req.beneficiary,
        amount: Number(req.totalAmount),
        type: 'Đề nghị thanh toán' as const,
        status: (req.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán') as Invoice['status']
      }))
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Quản lý Hóa đơn & Thanh toán</h1>
        <Button className="bg-[#F27D26] hover:bg-[#F27D26]/80 text-black">
          <Plus className="mr-2 h-4 w-4" /> Tạo hóa đơn mới
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle>Danh sách chứng từ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-gray-400">Số HĐ / Mã ĐN</TableHead>
                <TableHead className="text-gray-400">Ngày</TableHead>
                <TableHead className="text-gray-400">Người nhận</TableHead>
                <TableHead className="text-gray-400">Số tiền</TableHead>
                <TableHead className="text-gray-400">Loại</TableHead>
                <TableHead className="text-gray-400">Trạng thái</TableHead>
                <TableHead className="text-gray-400">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-b border-white/5">
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.recipient}</TableCell>
                  <TableCell>{invoice.amount.toLocaleString()} VNĐ</TableCell>
                  <TableCell>{invoice.type}</TableCell>
                  <TableCell>
                    <Badge className={
                      invoice.status === 'Đã thanh toán' ? 'bg-green-500/20 text-green-400' :
                      invoice.status === 'Chờ thanh toán' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-slate-500/20 text-slate-400'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-white/10"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:bg-white/10"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-white/10"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
