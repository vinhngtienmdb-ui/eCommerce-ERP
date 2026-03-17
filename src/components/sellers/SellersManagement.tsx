import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  FileCheck, 
  XCircle,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSignature
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { useTranslation } from "react-i18next"
import { ManageSellerDialog, type Seller } from "./ManageSellerDialog"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const initialSellers: Seller[] = [
  { 
    id: "SEL-101", 
    name: "TechStore Official", 
    category: "Electronics", 
    rating: 4.8, 
    sales: 1250000000, 
    status: "Verified", 
    kycStatus: "Approved", 
    kycType: "GPKD", 
    taxId: "0101234567", 
    bankAccount: "19031234567890", 
    bankName: "Techcombank", 
    bankAccountHolder: "NGUYEN VAN A",
    sellerType: "Regular",
    legalType: "Individual",
    ownerName: "Nguyễn Văn A",
    shopAddress: "123 Đường Láng, Đống Đa, Hà Nội",
    taxAddress: "123 Đường Láng, Đống Đa, Hà Nội",
    contactPhone: "0912345678",
    email: "vana@techstore.vn",
    warehouses: [
      { address: "Kho A1, KCN Quang Minh, Mê Linh, Hà Nội", staff: "Trần Văn B", phone: "0987654321" },
      { address: "Kho A2, KCN Bắc Thăng Long, Đông Anh, Hà Nội", staff: "Nguyễn Văn C", phone: "0912121212" }
    ]
  },
  { 
    id: "SEL-102", 
    name: "HomeComforts", 
    category: "Furniture", 
    rating: 4.5, 
    sales: 320000000, 
    status: "Verified", 
    kycStatus: "Approved", 
    kycType: "CCCD", 
    taxId: "0107654321", 
    bankAccount: "0011001234567", 
    bankName: "Vietcombank", 
    bankAccountHolder: "LE THI B",
    sellerType: "DropShipping",
    legalType: "Individual",
    ownerName: "Lê Thị B",
    shopAddress: "456 Lê Lợi, Quận 1, TP.HCM",
    taxAddress: "456 Lê Lợi, Quận 1, TP.HCM",
    contactPhone: "0901234567",
    email: "thib@homecomforts.vn",
    warehouses: [
      { address: "Kho B2, KCN Tân Bình, TP.HCM", staff: "Phạm Văn C", phone: "0976543210" }
    ]
  },
  { 
    id: "SEL-103", 
    name: "EcoWear", 
    category: "Clothing", 
    rating: 4.9, 
    sales: 840000000, 
    status: "Verified", 
    kycStatus: "Approved", 
    kycType: "GPKD", 
    taxId: "0301234567", 
    bankAccount: "1011234567", 
    bankName: "VietinBank", 
    bankAccountHolder: "TRAN THI C",
    sellerType: "Regular",
    legalType: "Enterprise",
    enterpriseName: "Công ty TNHH EcoWear Việt Nam",
    ownerName: "Trần Thị C",
    shopAddress: "789 Nguyễn Huệ, Quận 1, TP.HCM",
    taxAddress: "789 Nguyễn Huệ, Quận 1, TP.HCM",
    contactPhone: "0934567890",
    email: "thic@ecowear.com.vn",
    warehouses: [
      { address: "Kho C3, KCN Cát Lái, Quận 2, TP.HCM", staff: "Hoàng Văn D", phone: "0965432109" }
    ]
  },
  { 
    id: "SEL-104", 
    name: "KitchenPro", 
    category: "Home Appliances", 
    rating: 4.2, 
    sales: 150000000, 
    status: "Pending", 
    kycStatus: "Pending", 
    kycType: "CCCD", 
    sellerType: "Regular",
    legalType: "Household",
    businessHouseholdName: "Hộ kinh doanh KitchenPro",
    ownerName: "Phạm Văn E",
    shopAddress: "12 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    contactPhone: "0944556677",
    email: "vane@kitchenpro.vn",
    warehouses: [
      { address: "Kho D4, Gia Lâm, Hà Nội", staff: "Nguyễn Văn F", phone: "0933221100" }
    ]
  },
  { id: "SEL-105", name: "GamerGear", category: "Electronics", rating: 4.7, sales: 560000000, status: "Verified", kycStatus: "Approved", kycType: "GPKD", taxId: "0109876543", bankAccount: "19039876543210", bankName: "Techcombank", sellerType: "DropShipping" },
  { id: "SEL-106", name: "FitLife", category: "Fitness", rating: 4.6, sales: 410000000, status: "Verified", kycStatus: "Approved", kycType: "CCCD", taxId: "0309876543", bankAccount: "0011009876543", bankName: "Vietcombank", sellerType: "Regular" },
  { id: "SEL-107", name: "CheapGadgets", category: "Electronics", rating: 3.2, sales: 89000000, status: "Suspended", kycStatus: "Rejected", kycType: "CCCD", sellerType: "DropShipping" },
  { 
    id: "SEL-201", 
    name: "Samsung Vina Factory", 
    category: "Electronics", 
    rating: 5.0, 
    sales: 5000000000, 
    status: "Verified", 
    kycStatus: "Approved", 
    kycType: "GPKD", 
    taxId: "0100123456", 
    bankAccount: "190300001111", 
    bankName: "Techcombank", 
    bankAccountHolder: "SAMSUNG VINA ELECTRONICS",
    sellerType: "F2C",
    legalType: "Enterprise",
    enterpriseName: "Công ty TNHH Điện tử Samsung Vina",
    ownerName: "Samsung Electronics",
    shopAddress: "KCN Yên Phong, Bắc Ninh",
    taxAddress: "KCN Yên Phong, Bắc Ninh",
    contactPhone: "0243123456",
    email: "contact@samsung.com.vn",
    warehouses: [
      { address: "Kho Tổng Samsung, Bắc Ninh", staff: "Nguyễn Văn Samsung", phone: "0911111111" },
      { address: "Kho Phân phối Miền Nam, KCN Sóng Thần, Bình Dương", staff: "Lê Văn Samsung", phone: "0922222222" }
    ]
  },
  { 
    id: "SEL-202", 
    name: "VinFast Factory Store", 
    category: "Automotive", 
    rating: 4.9, 
    sales: 12000000000, 
    status: "Verified", 
    kycStatus: "Approved", 
    kycType: "GPKD", 
    taxId: "0100789456", 
    bankAccount: "001100789456", 
    bankName: "Vietcombank", 
    bankAccountHolder: "VINFAST TRADING AND PRODUCTION",
    sellerType: "F2C",
    legalType: "Enterprise",
    enterpriseName: "Công ty Cổ phần Sản xuất và Kinh doanh VinFast",
    ownerName: "VinFast",
    shopAddress: "KCN Đình Vũ, Cát Hải, Hải Phòng",
    taxAddress: "KCN Đình Vũ, Cát Hải, Hải Phòng",
    contactPhone: "02253123456",
    email: "support@vinfastauto.com",
    warehouses: [
      { address: "Kho Xe VinFast, Hải Phòng", staff: "Lê Văn Vin", phone: "0922222222" }
    ]
  },
]

interface SellersManagementProps {
  defaultTab?: string;
  hideTabs?: boolean;
}

export function SellersManagement({ defaultTab = "all", hideTabs = false }: SellersManagementProps) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [sellers, setSellers] = useState<Seller[]>(initialSellers)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("edit")
  const { t } = useTranslation()

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "approval") return matchesSearch && seller.kycStatus === "Pending"
    if (activeTab === "personal") return matchesSearch && (seller.legalType === "Individual" || seller.legalType === "Household")
    if (activeTab === "enterprise") return matchesSearch && seller.legalType === "Enterprise"
    if (activeTab === "regular") return matchesSearch && seller.sellerType === "Regular"
    if (activeTab === "dropshipping") return matchesSearch && seller.sellerType === "DropShipping"
    if (activeTab === "f2c") return matchesSearch && seller.sellerType === "F2C"
    
    return matchesSearch
  })

  const handleUpdateSeller = (updatedSeller: Seller) => {
    setSellers(sellers.map(s => s.id === updatedSeller.id ? updatedSeller : s))
  }

  const openManageDialog = (seller: Seller, mode: "view" | "edit" = "edit") => {
    setSelectedSeller(seller)
    setDialogMode(mode)
    setIsManageDialogOpen(true)
  }

  const sellerTabs = [
    { id: "all", label: t("products.tabs.all"), count: sellers.length },
    { id: "personal", label: t("sellers.tabs.personal"), count: sellers.filter(s => s.legalType === "Individual" || s.legalType === "Household").length },
    { id: "enterprise", label: t("sellers.tabs.enterprise"), count: sellers.filter(s => s.legalType === "Enterprise").length },
    { id: "regular", label: t("sellers.regularSeller"), count: sellers.filter(s => s.sellerType === "Regular").length },
    { id: "dropshipping", label: t("sellers.dropShippingSeller"), count: sellers.filter(s => s.sellerType === "DropShipping").length },
    { id: "f2c", label: t("sellers.f2cSeller"), count: sellers.filter(s => s.sellerType === "F2C").length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("sellers.title")}</h2>
          <p className="text-muted-foreground">
            {t("sellers.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filters")}
          </Button>
          <Button onClick={() => navigate("/seller-registration")}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("sellers.registerSeller")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("sellers.stats.totalSellers")}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialSellers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("sellers.stats.registeredShops")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("sellers.stats.verified")}</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialSellers.filter(s => s.status === "Verified").length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("sellers.stats.activeVerified")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("sellers.stats.pendingApproval")}</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialSellers.filter(s => s.status === "Pending").length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("sellers.stats.awaitingReview")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("sellers.stats.suspended")}</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialSellers.filter(s => s.status === "Suspended").length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("sellers.stats.policyViolations")}</p>
          </CardContent>
        </Card>
      </div>

      {!hideTabs && (
        <div className="flex space-x-6 border-b overflow-x-auto">
          {sellerTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                activeTab === tab.id
                  ? "text-[#ee4d2d] border-b-2 border-[#ee4d2d]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-sm:w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("sellers.searchPlaceholder")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("sellers.id")}</TableHead>
                <TableHead>{t("sellers.storeName")}</TableHead>
                <TableHead>{t("sellers.sellerType")}</TableHead>
                <TableHead>{t("sellers.primaryCategory")}</TableHead>
                <TableHead className="text-right">{t("sellers.rating")}</TableHead>
                <TableHead className="text-right">{t("sellers.totalSales")}</TableHead>
                <TableHead>eKYC</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.id}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      seller.sellerType === "DropShipping" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800" : 
                      seller.sellerType === "F2C" ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800" : ""
                    }>
                      {seller.sellerType === "DropShipping" ? t("sellers.dropShippingSeller") : 
                       seller.sellerType === "F2C" ? t("sellers.f2cSeller") : t("sellers.regularSeller")}
                    </Badge>
                  </TableCell>
                  <TableCell>{seller.category}</TableCell>
                  <TableCell className="text-right">{seller.rating} / 5.0</TableCell>
                  <TableCell className="text-right font-medium">{formatVND(seller.sales)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        (seller.kycStatus === "Approved" ? "default" : 
                        seller.kycStatus === "Rejected" ? "destructive" : 
                        seller.kycStatus === "Pending" ? "secondary" : "outline") as any
                      }
                    >
                      {seller.kycStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        (seller.status === "Verified" ? "default" : 
                        seller.status === "Suspended" ? "destructive" : "secondary") as any
                      }
                    >
                      {seller.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openManageDialog(seller, "view")}>
                          <Search className="mr-2 h-4 w-4" />
                          {t("sellers.actions.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openManageDialog(seller, "edit")}>
                          <FileCheck className="mr-2 h-4 w-4" />
                          {t("sellers.actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/e-contract")}>
                          <FileSignature className="mr-2 h-4 w-4" />
                          Sign Contract
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          {t("sellers.actions.suspend")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSellers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    {t("sellers.noSellers")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ManageSellerDialog 
        seller={selectedSeller} 
        open={isManageDialogOpen} 
        onOpenChange={setIsManageDialogOpen} 
        onUpdate={handleUpdateSeller} 
        mode={dialogMode}
      />
    </div>
  )
}
