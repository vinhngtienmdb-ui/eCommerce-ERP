import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import {
  Plus,
  FileText,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calendar as CalendarIcon,
  Wallet
} from "lucide-react"

export function Accounting() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("finance.title")}</h1>
          <p className="text-muted-foreground">
            {t("finance.description")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("common.export")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("finance.journal.create")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">{t("finance.tabs.dashboard")}</TabsTrigger>
          <TabsTrigger value="chartOfAccounts">{t("finance.tabs.chartOfAccounts")}</TabsTrigger>
          <TabsTrigger value="journal">{t("finance.tabs.journal")}</TabsTrigger>
          <TabsTrigger value="ledger">{t("finance.tabs.ledger")}</TabsTrigger>
          <TabsTrigger value="statements">{t("finance.tabs.statements")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("finance.dashboard.totalRevenue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₫ 2,350,000,000</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% {t("dashboard.fromLastMonth")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("finance.dashboard.totalExpenses")}
                </CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₫ 1,200,000,000</div>
                <p className="text-xs text-muted-foreground">
                  +4.5% {t("dashboard.fromLastMonth")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("finance.dashboard.netProfit")}
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₫ 1,150,000,000</div>
                <p className="text-xs text-muted-foreground">
                  +35.2% {t("dashboard.fromLastMonth")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("finance.dashboard.cashOnHand")}
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₫ 540,000,000</div>
                <p className="text-xs text-muted-foreground">
                  {t("finance.dashboard.currentBalance")}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chartOfAccounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.chartOfAccounts.title")}</CardTitle>
              <CardDescription>
                {t("finance.chartOfAccounts.description")}
              </CardDescription>
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
                    <TableHead>{t("finance.chartOfAccounts.code")}</TableHead>
                    <TableHead>{t("finance.chartOfAccounts.name")}</TableHead>
                    <TableHead>{t("finance.chartOfAccounts.type")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { code: "111", name: "Tiền mặt", type: "Tài sản", status: "Active" },
                    { code: "112", name: "Tiền gửi ngân hàng", type: "Tài sản", status: "Active" },
                    { code: "131", name: "Phải thu của khách hàng", type: "Tài sản", status: "Active" },
                    { code: "152", name: "Nguyên liệu, vật liệu", type: "Tài sản", status: "Active" },
                    { code: "156", name: "Hàng hóa", type: "Tài sản", status: "Active" },
                    { code: "211", name: "Tài sản cố định hữu hình", type: "Tài sản", status: "Active" },
                    { code: "331", name: "Phải trả cho người bán", type: "Nợ phải trả", status: "Active" },
                    { code: "333", name: "Thuế và các khoản phải nộp Nhà nước", type: "Nợ phải trả", status: "Active" },
                    { code: "411", name: "Vốn đầu tư của chủ sở hữu", type: "Vốn chủ sở hữu", status: "Active" },
                    { code: "511", name: "Doanh thu bán hàng và cung cấp dịch vụ", type: "Doanh thu", status: "Active" },
                    { code: "632", name: "Giá vốn hàng bán", type: "Chi phí", status: "Active" },
                    { code: "642", name: "Chi phí quản lý doanh nghiệp", type: "Chi phí", status: "Active" },
                  ].map((account) => (
                    <TableRow key={account.code}>
                      <TableCell className="font-medium">{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{account.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.journal.title")}</CardTitle>
              <CardDescription>{t("finance.journal.description")}</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-2 mb-4">
                <Select defaultValue="S03a-DN">
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder={t("finance.journal.bookType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S03a-DN">{t("finance.journal.generalJournal")}</SelectItem>
                    <SelectItem value="S07-DN">{t("finance.journal.cashBook")}</SelectItem>
                    <SelectItem value="S08-DN">{t("finance.journal.bankBook")}</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("common.search")} className="pl-8" />
                </div>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {t("common.filters")}
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("finance.journal.date")}</TableHead>
                    <TableHead>{t("finance.journal.number")}</TableHead>
                    <TableHead>{t("finance.journal.description")}</TableHead>
                    <TableHead>{t("finance.journal.account")}</TableHead>
                    <TableHead>TK Đối ứng</TableHead>
                    <TableHead className="text-right">{t("finance.journal.debit")}</TableHead>
                    <TableHead className="text-right">{t("finance.journal.credit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2026-03-04</TableCell>
                    <TableCell>PT-001</TableCell>
                    <TableCell>Thu tiền bán hàng</TableCell>
                    <TableCell>111 - Tiền mặt</TableCell>
                    <TableCell>511</TableCell>
                    <TableCell className="text-right">50,000,000</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-03-04</TableCell>
                    <TableCell>PT-001</TableCell>
                    <TableCell>Thu tiền bán hàng</TableCell>
                    <TableCell>511 - Doanh thu</TableCell>
                    <TableCell>111</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">50,000,000</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>2026-03-04</TableCell>
                    <TableCell>PC-001</TableCell>
                    <TableCell>Thanh toán tiền điện</TableCell>
                    <TableCell>642 - Chi phí QLDN</TableCell>
                    <TableCell>111</TableCell>
                    <TableCell className="text-right">2,000,000</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-03-04</TableCell>
                    <TableCell>PC-001</TableCell>
                    <TableCell>Thanh toán tiền điện</TableCell>
                    <TableCell>111 - Tiền mặt</TableCell>
                    <TableCell>642</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">2,000,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
           <Card>
            <CardHeader>
              <CardTitle>{t("finance.ledger.title")}</CardTitle>
              <CardDescription>{t("finance.ledger.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                 <Select defaultValue="111">
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder={t("finance.ledger.selectAccount")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="111">111 - Tiền mặt</SelectItem>
                    <SelectItem value="112">112 - Tiền gửi ngân hàng</SelectItem>
                    <SelectItem value="131">131 - Phải thu khách hàng</SelectItem>
                  </SelectContent>
                </Select>
                 <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {t("common.filters")}
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("finance.journal.date")}</TableHead>
                    <TableHead>{t("finance.journal.number")}</TableHead>
                    <TableHead>{t("finance.journal.description")}</TableHead>
                    <TableHead>TK Đối ứng</TableHead>
                    <TableHead className="text-right">{t("finance.journal.debit")}</TableHead>
                    <TableHead className="text-right">{t("finance.journal.credit")}</TableHead>
                    <TableHead className="text-right">{t("finance.ledger.balance")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="font-medium">Số dư đầu kỳ</TableCell>
                    <TableCell className="text-right font-medium">100,000,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-03-04</TableCell>
                    <TableCell>PT-001</TableCell>
                    <TableCell>Thu tiền bán hàng</TableCell>
                    <TableCell>511</TableCell>
                    <TableCell className="text-right">50,000,000</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">150,000,000</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>2026-03-04</TableCell>
                    <TableCell>PC-001</TableCell>
                    <TableCell>Chi tạm ứng</TableCell>
                    <TableCell>141</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">5,000,000</TableCell>
                    <TableCell className="text-right">145,000,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
             <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t("finance.statements.balanceSheet")}</CardTitle>
                <CardDescription>Mẫu số B 01 - DN</CardDescription>
              </CardHeader>
            </Card>
             <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t("finance.statements.incomeStatement")}</CardTitle>
                <CardDescription>Mẫu số B 02 - DN</CardDescription>
              </CardHeader>
            </Card>
             <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t("finance.statements.cashFlow")}</CardTitle>
                <CardDescription>Mẫu số B 03 - DN</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("finance.statements.preview")}</CardTitle>
              <CardDescription>{t("finance.statements.balanceSheet")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2 font-bold">
                    <span>TÀI SẢN (ASSETS)</span>
                    <span>Số cuối năm</span>
                  </div>
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between">
                      <span>A. TÀI SẢN NGẮN HẠN</span>
                      <span>1,500,000,000</span>
                    </div>
                    <div className="pl-4 flex justify-between text-sm text-muted-foreground">
                      <span>I. Tiền và các khoản tương đương tiền</span>
                      <span>540,000,000</span>
                    </div>
                     <div className="pl-4 flex justify-between text-sm text-muted-foreground">
                      <span>II. Đầu tư tài chính ngắn hạn</span>
                      <span>200,000,000</span>
                    </div>
                     <div className="pl-4 flex justify-between text-sm text-muted-foreground">
                      <span>III. Các khoản phải thu ngắn hạn</span>
                      <span>300,000,000</span>
                    </div>
                     <div className="pl-4 flex justify-between text-sm text-muted-foreground">
                      <span>IV. Hàng tồn kho</span>
                      <span>460,000,000</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2 font-bold pt-4">
                    <span>NGUỒN VỐN (EQUITY & LIABILITIES)</span>
                    <span>Số cuối năm</span>
                  </div>
                   <div className="pl-4 space-y-2">
                    <div className="flex justify-between">
                      <span>C. NỢ PHẢI TRẢ</span>
                      <span>400,000,000</span>
                    </div>
                     <div className="flex justify-between">
                      <span>D. VỐN CHỦ SỞ HỮU</span>
                      <span>1,100,000,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
