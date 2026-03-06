import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Upload, ScanLine, QrCode, FileSpreadsheet, ShieldCheck } from "lucide-react"

interface EmployeeInfo {
  id: string
  name: string
  idCard: string
  phone: string
  email: string
  address: string
  status: "Verified" | "Pending"
}

export function HRInfo() {
  const { t } = useTranslation()

  const [records] = useState<EmployeeInfo[]>([
    { id: "EMP-001", name: "Nguyen Van A", idCard: "079123456789", phone: "0901234567", email: "a.nguyen@company.com", address: "Quận 1, TP.HCM", status: "Verified" },
    { id: "EMP-002", name: "Tran Thi B", idCard: "079987654321", phone: "0987654321", email: "b.tran@company.com", address: "Quận 3, TP.HCM", status: "Verified" },
    { id: "EMP-003", name: "Le Van C", idCard: "079456123789", phone: "0912345678", email: "c.le@company.com", address: "Quận 7, TP.HCM", status: "Pending" },
  ])

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
                <Button>
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
                      <TableCell className="font-medium">{item.name}</TableCell>
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
