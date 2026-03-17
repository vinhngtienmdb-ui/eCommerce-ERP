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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
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
import { toast } from "sonner"

export function Accounting() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [newJournal, setNewJournal] = useState({
    date: new Date().toISOString().split('T')[0],
    number: "",
    description: "",
    account: "",
    contraAccount: "",
    debit: "",
    credit: ""
  })

  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "Tài sản",
    status: "Active"
  })

  const [accounts, setAccounts] = useState([
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
  ])

  const [journals, setJournals] = useState([
    { id: "1", date: "2026-03-04", number: "PT-001", description: "Thu tiền bán hàng", account: "111 - Tiền mặt", contraAccount: "511", debit: "50,000,000", credit: "-" },
    { id: "2", date: "2026-03-04", number: "PT-001", description: "Thu tiền bán hàng", account: "511 - Doanh thu", contraAccount: "111", debit: "-", credit: "50,000,000" },
    { id: "3", date: "2026-03-04", number: "PC-001", description: "Thanh toán tiền điện", account: "642 - Chi phí QLDN", contraAccount: "111", debit: "2,000,000", credit: "-" },
    { id: "4", date: "2026-03-04", number: "PC-001", description: "Thanh toán tiền điện", account: "111 - Tiền mặt", contraAccount: "642", debit: "-", credit: "2,000,000" },
  ])

  const handleCreateAccount = () => {
    if (!newAccount.code || !newAccount.name) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }
    
    // Check if code already exists
    if (accounts.some(acc => acc.code === newAccount.code)) {
      toast.error("Mã tài khoản đã tồn tại")
      return
    }

    setAccounts([...accounts, newAccount].sort((a, b) => a.code.localeCompare(b.code)))
    setIsAccountModalOpen(false)
    setNewAccount({
      code: "",
      name: "",
      type: "Tài sản",
      status: "Active"
    })
    toast.success("Đã thêm tài khoản mới")
  }

  const handleCreateJournal = () => {
    if (!newJournal.number || !newJournal.description || !newJournal.account || !newJournal.contraAccount) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    const journal = {
      id: Date.now().toString(),
      date: newJournal.date,
      number: newJournal.number,
      description: newJournal.description,
      account: newJournal.account,
      contraAccount: newJournal.contraAccount,
      debit: newJournal.debit ? parseInt(newJournal.debit).toLocaleString() : "-",
      credit: newJournal.credit ? parseInt(newJournal.credit).toLocaleString() : "-"
    }

    setJournals([journal, ...journals])
    setIsModalOpen(false)
    setNewJournal({
      date: new Date().toISOString().split('T')[0],
      number: "",
      description: "",
      account: "",
      contraAccount: "",
      debit: "",
      credit: ""
    })
    toast.success("Đã tạo bút toán mới")
  }

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
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("finance.journal.create")}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo bút toán mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết cho bút toán sổ nhật ký chung.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Ngày</Label>
              <Input 
                id="date" 
                type="date"
                value={newJournal.date} 
                onChange={(e) => setNewJournal({...newJournal, date: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">Số CT</Label>
              <Input 
                id="number" 
                value={newJournal.number} 
                onChange={(e) => setNewJournal({...newJournal, number: e.target.value})}
                className="col-span-3" 
                placeholder="VD: PT-002"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Diễn giải</Label>
              <Input 
                id="description" 
                value={newJournal.description} 
                onChange={(e) => setNewJournal({...newJournal, description: e.target.value})}
                className="col-span-3" 
                placeholder="Nội dung nghiệp vụ"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">Tài khoản</Label>
              <Input 
                id="account" 
                value={newJournal.account} 
                onChange={(e) => setNewJournal({...newJournal, account: e.target.value})}
                className="col-span-3" 
                placeholder="VD: 111 - Tiền mặt"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contraAccount" className="text-right">TK Đối ứng</Label>
              <Input 
                id="contraAccount" 
                value={newJournal.contraAccount} 
                onChange={(e) => setNewJournal({...newJournal, contraAccount: e.target.value})}
                className="col-span-3" 
                placeholder="VD: 511"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="debit" className="text-right">Nợ</Label>
              <Input 
                id="debit" 
                type="number"
                value={newJournal.debit} 
                onChange={(e) => setNewJournal({...newJournal, debit: e.target.value})}
                className="col-span-3" 
                placeholder="Số tiền Nợ"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credit" className="text-right">Có</Label>
              <Input 
                id="credit" 
                type="number"
                value={newJournal.credit} 
                onChange={(e) => setNewJournal({...newJournal, credit: e.target.value})}
                className="col-span-3" 
                placeholder="Số tiền Có"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateJournal}>Lưu bút toán</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <Button onClick={() => setIsAccountModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm tài khoản
                </Button>
              </div>

              <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Thêm tài khoản mới</DialogTitle>
                    <DialogDescription>
                      Thêm tài khoản mới vào hệ thống tài khoản kế toán.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="code" className="text-right">Mã TK</Label>
                      <Input 
                        id="code" 
                        value={newAccount.code} 
                        onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: 111"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Tên TK</Label>
                      <Input 
                        id="name" 
                        value={newAccount.name} 
                        onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                        className="col-span-3" 
                        placeholder="VD: Tiền mặt"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">Loại TK</Label>
                      <Select value={newAccount.type} onValueChange={(val) => setNewAccount({...newAccount, type: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn loại tài khoản" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tài sản">Tài sản</SelectItem>
                          <SelectItem value="Nợ phải trả">Nợ phải trả</SelectItem>
                          <SelectItem value="Vốn chủ sở hữu">Vốn chủ sở hữu</SelectItem>
                          <SelectItem value="Doanh thu">Doanh thu</SelectItem>
                          <SelectItem value="Chi phí">Chi phí</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">Trạng thái</Label>
                      <Select value={newAccount.status} onValueChange={(val) => setNewAccount({...newAccount, status: val})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Hoạt động</SelectItem>
                          <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAccountModalOpen(false)}>Hủy</Button>
                    <Button onClick={handleCreateAccount}>Thêm tài khoản</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
                  {accounts.map((account) => (
                    <TableRow key={account.code}>
                      <TableCell className="font-medium">{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell>
                        <Badge variant={account.status === "Active" ? "secondary" : "outline"}>
                          {account.status}
                        </Badge>
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
                  {journals.map((journal) => (
                    <TableRow key={journal.id}>
                      <TableCell>{journal.date}</TableCell>
                      <TableCell>{journal.number}</TableCell>
                      <TableCell>{journal.description}</TableCell>
                      <TableCell>{journal.account}</TableCell>
                      <TableCell>{journal.contraAccount}</TableCell>
                      <TableCell className="text-right">{journal.debit}</TableCell>
                      <TableCell className="text-right">{journal.credit}</TableCell>
                    </TableRow>
                  ))}
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
