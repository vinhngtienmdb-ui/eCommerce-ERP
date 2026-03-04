import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Wallet, ShieldCheck, ArrowDownLeft, ArrowUpRight, History, Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentWallet() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("wallet");

  const depositOrders = [
    { id: "TXN12345", type: "Nạp tiền (MOMO)", amount: 1000000, customer: "Nguyễn Văn A", status: "Thành công" },
    { id: "TXN12347", type: "Nạp tiền (Banking)", amount: 5000000, customer: "Trần Thị B", status: "Đang xử lý" },
    { id: "TXN12348", type: "Nạp tiền (ZaloPay)", amount: 200000, customer: "Lê Văn C", status: "Thành công" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("paymentWallet.title")}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallet">{t("nav.paymentWallet")}</TabsTrigger>
          <TabsTrigger value="escrow">{t("paymentWallet.escrow")}</TabsTrigger>
          <TabsTrigger value="withdrawal">{t("finance.withdrawal.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("paymentWallet.availableBalance")}</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.500.000 đ</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("paymentWallet.pendingBalance")}</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.300.000 đ</div>
              </CardContent>
            </Card>
            <div className="flex gap-2 items-center">
              <Button><ArrowDownLeft className="mr-2 h-4 w-4" /> {t("paymentWallet.deposit")}</Button>
              <Button variant="outline"><ArrowUpRight className="mr-2 h-4 w-4" /> {t("paymentWallet.withdraw")}</Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("paymentWallet.depositOrders")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("paymentWallet.transactionId")}</TableHead>
                    <TableHead>{t("paymentWallet.type")}</TableHead>
                    <TableHead>{t("paymentWallet.amount")}</TableHead>
                    <TableHead>{t("paymentWallet.customer")}</TableHead>
                    <TableHead>{t("paymentWallet.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell className="text-green-600">+{order.amount.toLocaleString()} đ</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escrow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giao dịch ký quỹ (Escrow)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Đơn</TableHead>
                    <TableHead>Người mua</TableHead>
                    <TableHead>Số tiền giữ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>ORD98765</TableCell>
                    <TableCell>Nguyễn Văn A</TableCell>
                    <TableCell>1.200.000 đ</TableCell>
                    <TableCell>Đang giữ (Chờ nhận hàng)</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">Chi tiết</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.withdrawal.title")}</CardTitle>
              <CardDescription>{t("finance.withdrawal.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("common.search")} className="pl-8" />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("common.filters")}
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("finance.withdrawal.requestId")}</TableHead>
                    <TableHead>{t("finance.withdrawal.requester")}</TableHead>
                    <TableHead>{t("finance.withdrawal.type")}</TableHead>
                    <TableHead className="text-right">{t("finance.withdrawal.amount")}</TableHead>
                    <TableHead>{t("finance.withdrawal.bankInfo")}</TableHead>
                    <TableHead>{t("finance.withdrawal.date")}</TableHead>
                    <TableHead>{t("finance.withdrawal.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "WDR-001", requester: "Nguyen Van A", type: "user", amount: 500000, bank: "VCB - 1234567890", date: "2026-03-04", status: "pending" },
                    { id: "WDR-002", requester: "Shop XYZ", type: "seller", amount: 15000000, bank: "TCB - 0987654321", date: "2026-03-04", status: "approved" },
                    { id: "WDR-003", requester: "Tran Thi B", type: "user", amount: 200000, bank: "MB - 1122334455", date: "2026-03-03", status: "rejected" },
                  ].map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.requester}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.type === "user" ? t("finance.withdrawal.user") : t("finance.withdrawal.seller")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{item.amount.toLocaleString()} ₫</TableCell>
                      <TableCell>{item.bank}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "approved" ? "default" : item.status === "pending" ? "secondary" : "destructive"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                              {t("finance.withdrawal.approve")}
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                              {t("finance.withdrawal.reject")}
                            </Button>
                          </div>
                        )}
                         {item.status === "approved" && (
                            <Button size="sm" variant="default">
                              {t("finance.withdrawal.payout")}
                            </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
