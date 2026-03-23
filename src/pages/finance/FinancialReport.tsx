import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Download, FileText, TrendingUp, DollarSign } from "lucide-react"

export function FinancialReport() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("pnl")

  const handleDownload = () => {
    // Mock download functionality
    alert("Downloading financial report for Q1 2026...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo tài chính (Q1/2026)</h1>
          <p className="text-muted-foreground">
            Báo cáo kết quả hoạt động kinh doanh, bảng cân đối kế toán và lưu chuyển tiền tệ.
          </p>
        </div>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Tải báo cáo (PDF)
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="pnl" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Kết quả kinh doanh (P&L)
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Bảng cân đối kế toán
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Lưu chuyển tiền tệ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo kết quả hoạt động kinh doanh (P&L)</CardTitle>
              <CardDescription>Quý 1 năm 2026 (01/01/2026 - 31/03/2026)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chỉ tiêu</TableHead>
                    <TableHead className="text-right">Số tiền (VNĐ)</TableHead>
                    <TableHead className="text-right">% Doanh thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-medium bg-slate-50">
                    <TableCell>1. Doanh thu bán hàng và cung cấp dịch vụ</TableCell>
                    <TableCell className="text-right">2,500,000,000</TableCell>
                    <TableCell className="text-right">100.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">- Các khoản giảm trừ doanh thu</TableCell>
                    <TableCell className="text-right text-red-500">-50,000,000</TableCell>
                    <TableCell className="text-right">-2.0%</TableCell>
                  </TableRow>
                  <TableRow className="font-bold">
                    <TableCell>2. Doanh thu thuần (1 - 2)</TableCell>
                    <TableCell className="text-right">2,450,000,000</TableCell>
                    <TableCell className="text-right">98.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3. Giá vốn hàng bán (COGS)</TableCell>
                    <TableCell className="text-right text-red-500">-1,100,000,000</TableCell>
                    <TableCell className="text-right">-44.0%</TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-slate-50">
                    <TableCell>4. Lợi nhuận gộp (3 - 4)</TableCell>
                    <TableCell className="text-right text-green-600">1,350,000,000</TableCell>
                    <TableCell className="text-right">54.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">- Chi phí bán hàng (Marketing, Sales)</TableCell>
                    <TableCell className="text-right text-red-500">-450,000,000</TableCell>
                    <TableCell className="text-right">-18.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">- Chi phí quản lý doanh nghiệp (G&A)</TableCell>
                    <TableCell className="text-right text-red-500">-300,000,000</TableCell>
                    <TableCell className="text-right">-12.0%</TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-slate-50">
                    <TableCell>5. Lợi nhuận thuần từ hoạt động kinh doanh</TableCell>
                    <TableCell className="text-right text-green-600">600,000,000</TableCell>
                    <TableCell className="text-right">24.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6. Thu nhập khác</TableCell>
                    <TableCell className="text-right">20,000,000</TableCell>
                    <TableCell className="text-right">0.8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>7. Chi phí khác</TableCell>
                    <TableCell className="text-right text-red-500">-5,000,000</TableCell>
                    <TableCell className="text-right">-0.2%</TableCell>
                  </TableRow>
                  <TableRow className="font-bold">
                    <TableCell>8. Tổng lợi nhuận kế toán trước thuế</TableCell>
                    <TableCell className="text-right text-green-600">615,000,000</TableCell>
                    <TableCell className="text-right">24.6%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>9. Chi phí thuế TNDN (20%)</TableCell>
                    <TableCell className="text-right text-red-500">-123,000,000</TableCell>
                    <TableCell className="text-right">-4.9%</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg bg-emerald-50">
                    <TableCell>10. Lợi nhuận sau thuế (Net Profit)</TableCell>
                    <TableCell className="text-right text-emerald-600">492,000,000</TableCell>
                    <TableCell className="text-right text-emerald-600">19.7%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bảng cân đối kế toán (Balance Sheet)</CardTitle>
              <CardDescription>Tại ngày 31/03/2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Tài sản */}
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">TÀI SẢN (ASSETS)</h3>
                  <Table>
                    <TableBody>
                      <TableRow className="font-semibold bg-slate-50">
                        <TableCell>I. Tài sản ngắn hạn</TableCell>
                        <TableCell className="text-right">3,200,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Tiền và các khoản tương đương tiền</TableCell>
                        <TableCell className="text-right">1,500,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Các khoản phải thu ngắn hạn</TableCell>
                        <TableCell className="text-right">800,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Hàng tồn kho</TableCell>
                        <TableCell className="text-right">900,000,000</TableCell>
                      </TableRow>
                      <TableRow className="font-semibold bg-slate-50">
                        <TableCell>II. Tài sản dài hạn</TableCell>
                        <TableCell className="text-right">1,800,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Tài sản cố định hữu hình</TableCell>
                        <TableCell className="text-right">1,200,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Tài sản vô hình (Phần mềm, Bản quyền)</TableCell>
                        <TableCell className="text-right">600,000,000</TableCell>
                      </TableRow>
                      <TableRow className="font-bold text-lg bg-blue-50">
                        <TableCell>TỔNG TÀI SẢN</TableCell>
                        <TableCell className="text-right text-blue-700">5,000,000,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Nguồn vốn */}
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">NGUỒN VỐN (LIABILITIES & EQUITY)</h3>
                  <Table>
                    <TableBody>
                      <TableRow className="font-semibold bg-slate-50">
                        <TableCell>I. Nợ phải trả</TableCell>
                        <TableCell className="text-right">1,500,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Phải trả người bán ngắn hạn</TableCell>
                        <TableCell className="text-right">600,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Thuế và các khoản phải nộp Nhà nước</TableCell>
                        <TableCell className="text-right">150,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Vay và nợ thuê tài chính</TableCell>
                        <TableCell className="text-right">750,000,000</TableCell>
                      </TableRow>
                      <TableRow className="font-semibold bg-slate-50">
                        <TableCell>II. Vốn chủ sở hữu</TableCell>
                        <TableCell className="text-right">3,500,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Vốn góp của chủ sở hữu</TableCell>
                        <TableCell className="text-right">2,000,000,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-muted-foreground">Lợi nhuận sau thuế chưa phân phối</TableCell>
                        <TableCell className="text-right">1,500,000,000</TableCell>
                      </TableRow>
                      <TableRow className="font-bold text-lg bg-blue-50">
                        <TableCell>TỔNG NGUỒN VỐN</TableCell>
                        <TableCell className="text-right text-blue-700">5,000,000,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo lưu chuyển tiền tệ (Cash Flow)</CardTitle>
              <CardDescription>Quý 1 năm 2026 (Theo phương pháp trực tiếp)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chỉ tiêu</TableHead>
                    <TableHead className="text-right">Số tiền (VNĐ)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-semibold bg-slate-50">
                    <TableCell>I. Lưu chuyển tiền từ hoạt động kinh doanh</TableCell>
                    <TableCell className="text-right text-green-600">850,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">1. Tiền thu từ bán hàng, cung cấp dịch vụ</TableCell>
                    <TableCell className="text-right">2,600,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">2. Tiền chi trả cho người cung cấp hàng hóa, dịch vụ</TableCell>
                    <TableCell className="text-right text-red-500">-1,050,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">3. Tiền chi trả cho người lao động</TableCell>
                    <TableCell className="text-right text-red-500">-400,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">4. Tiền chi trả lãi vay, thuế TNDN</TableCell>
                    <TableCell className="text-right text-red-500">-300,000,000</TableCell>
                  </TableRow>

                  <TableRow className="font-semibold bg-slate-50">
                    <TableCell>II. Lưu chuyển tiền từ hoạt động đầu tư</TableCell>
                    <TableCell className="text-right text-red-500">-200,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">1. Tiền chi để mua sắm, xây dựng TSCĐ</TableCell>
                    <TableCell className="text-right text-red-500">-200,000,000</TableCell>
                  </TableRow>

                  <TableRow className="font-semibold bg-slate-50">
                    <TableCell>III. Lưu chuyển tiền từ hoạt động tài chính</TableCell>
                    <TableCell className="text-right text-red-500">-150,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">1. Tiền chi trả nợ gốc vay</TableCell>
                    <TableCell className="text-right text-red-500">-150,000,000</TableCell>
                  </TableRow>

                  <TableRow className="font-bold text-lg bg-emerald-50">
                    <TableCell>Lưu chuyển tiền thuần trong kỳ (I + II + III)</TableCell>
                    <TableCell className="text-right text-emerald-600">500,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Tiền và tương đương tiền đầu kỳ</TableCell>
                    <TableCell className="text-right">1,000,000,000</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg bg-blue-50">
                    <TableCell>Tiền và tương đương tiền cuối kỳ</TableCell>
                    <TableCell className="text-right text-blue-700">1,500,000,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
