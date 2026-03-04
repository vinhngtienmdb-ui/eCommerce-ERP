import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { CheckCircle2, XCircle, FileText, CreditCard, Building2, UploadCloud, Search } from "lucide-react"
import { useTranslation } from "react-i18next"

export type Warehouse = {
  address: string
  staff: string
  phone: string
}

export type Seller = {
  id: string
  name: string
  category: string
  rating: number
  sales: number
  status: string
  kycStatus: "Pending" | "Approved" | "Rejected" | "Unsubmitted"
  kycType?: "CCCD" | "GPKD"
  taxId?: string
  bankAccount?: string
  bankName?: string
  bankAccountHolder?: string
  sellerType: "Regular" | "DropShipping" | "F2C"
  legalType?: "Individual" | "Household" | "Enterprise"
  ownerName?: string
  businessHouseholdName?: string
  enterpriseName?: string
  shopAddress?: string
  taxAddress?: string
  contactPhone?: string
  email?: string
  warehouses?: Warehouse[]
  warehouseAddress?: string // Legacy field, keeping for compatibility
  warehouseStaff?: string // Legacy field, keeping for compatibility
  warehousePhone?: string // Legacy field, keeping for compatibility
}

const VIETNAM_BANKS = [
  "Vietcombank",
  "Techcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "MB Bank",
  "ACB",
  "VPBank",
  "Sacombank",
  "TPBank",
  "VIB",
  "HDBank",
  "Eximbank",
  "MSB",
  "SeABank"
]

interface ManageSellerDialogProps {
  seller: Seller | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedSeller: Seller) => void
  mode?: "view" | "edit"
}

export function ManageSellerDialog({ seller, open, onOpenChange, onUpdate, mode = "edit" }: ManageSellerDialogProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("details")
  const [formData, setFormData] = useState<Partial<Seller>>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<"matched" | "not_matched" | null>(null)

  const isViewMode = mode === "view"

  // Update form data when seller changes
  useEffect(() => {
    if (seller) {
      setFormData(seller)
      setVerificationResult(null)
      setActiveTab("details")
    }
  }, [seller])

  const handleSave = () => {
    if (seller) {
      onUpdate({ ...seller, ...formData } as Seller)
      onOpenChange(false)
    }
  }

  const simulateVerification = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      // Simulate a successful match for demonstration
      setVerificationResult("matched")
      setFormData({ ...formData, kycStatus: "Approved", status: "Verified" })
    }, 2000)
  }

  if (!seller) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("sellers.title")}: {seller.name}</DialogTitle>
          <DialogDescription>
            {t("sellers.onboardingApproval")}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">{t("sellers.detailsTab")}</TabsTrigger>
            <TabsTrigger value="ekyc">{t("sellers.approveEkyc")}</TabsTrigger>
            <TabsTrigger value="tax">{t("sellers.updateTax")}</TabsTrigger>
            <TabsTrigger value="bank">{t("sellers.updateBank")}</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="legalType">{t("sellers.legalType")}</Label>
                <select 
                  id="legalType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.legalType || "Individual"}
                  onChange={(e) => setFormData({ ...formData, legalType: e.target.value as any })}
                  disabled={isViewMode}
                >
                  <option value="Individual">{t("sellers.individual")}</option>
                  <option value="Household">{t("sellers.businessHousehold")}</option>
                  <option value="Enterprise">{t("sellers.enterprise")}</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  {formData.legalType === "Enterprise" ? t("sellers.taxNoteEnterprise") : t("sellers.taxNoteIndividual")}
                </p>
              </div>

              <div className="space-y-4 col-span-2 border-t pt-4">
                <h3 className="font-semibold text-sm">{t("sellers.sellerInfo")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {formData.legalType === "Individual" && (
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="ownerName">{t("sellers.ownerNameIndividual")}</Label>
                      <Input 
                        id="ownerName" 
                        value={formData.ownerName || ""}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        disabled={isViewMode}
                      />
                    </div>
                  )}
                  {formData.legalType === "Household" && (
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="businessHouseholdName">{t("sellers.businessHouseholdName")}</Label>
                      <Input 
                        id="businessHouseholdName" 
                        value={formData.businessHouseholdName || ""}
                        onChange={(e) => setFormData({ ...formData, businessHouseholdName: e.target.value })}
                        disabled={isViewMode}
                      />
                    </div>
                  )}
                  {formData.legalType === "Enterprise" && (
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="enterpriseName">{t("sellers.enterpriseName")}</Label>
                      <Input 
                        id="enterpriseName" 
                        value={formData.enterpriseName || ""}
                        onChange={(e) => setFormData({ ...formData, enterpriseName: e.target.value })}
                        disabled={isViewMode}
                      />
                    </div>
                  )}
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="shopAddress">{t("sellers.contactAddress")}</Label>
                    <Input 
                      id="shopAddress" 
                      value={formData.shopAddress || ""}
                      onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="taxAddress">{t("sellers.taxAddress")}</Label>
                    <Input 
                      id="taxAddress" 
                      value={formData.taxAddress || ""}
                      onChange={(e) => setFormData({ ...formData, taxAddress: e.target.value })}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">{t("sellers.taxId")}</Label>
                    <Input 
                      id="taxId" 
                      value={formData.taxId || ""}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">{t("sellers.contactPhone")}</Label>
                    <Input 
                      id="contactPhone" 
                      value={formData.contactPhone || ""}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="email">{t("sellers.email")}</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 col-span-2 border-t pt-4">
                <h3 className="font-semibold text-sm">{t("sellers.warehouseInfo")}</h3>
                <div className="space-y-4">
                  {formData.warehouses?.map((wh, idx) => (
                    <div key={idx} className="p-3 border rounded-lg bg-muted/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Kho #{idx + 1}</span>
                        {!isViewMode && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-destructive"
                            onClick={() => {
                              const newWhs = [...(formData.warehouses || [])]
                              newWhs.splice(idx, 1)
                              setFormData({ ...formData, warehouses: newWhs })
                            }}
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 space-y-1">
                          <Label className="text-[10px]">{t("sellers.warehouseAddress")}</Label>
                          <Input 
                            className="h-8 text-xs"
                            value={wh.address}
                            onChange={(e) => {
                              const newWhs = [...(formData.warehouses || [])]
                              newWhs[idx].address = e.target.value
                              setFormData({ ...formData, warehouses: newWhs })
                            }}
                            disabled={isViewMode}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">{t("sellers.warehouseStaff")}</Label>
                          <Input 
                            className="h-8 text-xs"
                            value={wh.staff}
                            onChange={(e) => {
                              const newWhs = [...(formData.warehouses || [])]
                              newWhs[idx].staff = e.target.value
                              setFormData({ ...formData, warehouses: newWhs })
                            }}
                            disabled={isViewMode}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">{t("sellers.warehousePhone")}</Label>
                          <Input 
                            className="h-8 text-xs"
                            value={wh.phone}
                            onChange={(e) => {
                              const newWhs = [...(formData.warehouses || [])]
                              newWhs[idx].phone = e.target.value
                              setFormData({ ...formData, warehouses: newWhs })
                            }}
                            disabled={isViewMode}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isViewMode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-dashed"
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          warehouses: [...(formData.warehouses || []), { address: "", staff: "", phone: "" }] 
                        })
                      }}
                    >
                      {t("sellers.addWarehouse")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ekyc" className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Trạng thái eKYC hiện tại</p>
                <p className="text-sm text-muted-foreground">
                  Loại giấy tờ: {formData.legalType === "Enterprise" ? t("sellers.ownerIdPassport") : t("sellers.idCard")}
                </p>
              </div>
              <Badge 
                variant={
                  formData.kycStatus === "Approved" ? "default" : 
                  formData.kycStatus === "Rejected" ? "destructive" : 
                  formData.kycStatus === "Pending" ? "secondary" : "outline"
                }
              >
                {formData.kycStatus}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-dashed rounded-lg p-4 text-center bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[120px]">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">{t("sellers.uploadDocs")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.legalType === "Enterprise" ? t("sellers.ownerIdPassport") : t("sellers.idCard")}
                  </p>
                </div>
                <div className="border border-dashed rounded-lg p-4 text-center bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[120px]">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">{t("sellers.uploadDocs")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.legalType === "Enterprise" ? t("sellers.businessLicense") : t("sellers.idCard") + " (Mặt sau)"}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Hệ thống tra cứu tự động
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
                  Hệ thống sẽ tự động trích xuất thông tin từ ảnh tải lên và đối soát với Cơ sở dữ liệu Quốc gia về Dân cư / Đăng ký doanh nghiệp.
                </p>
                
                {verificationResult === "matched" && (
                  <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 mb-4 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t("sellers.matchedNationalDb")}
                  </div>
                )}

                {verificationResult === "not_matched" && (
                  <div className="flex items-center text-sm text-destructive mb-4 bg-destructive/10 p-2 rounded border border-destructive/20">
                    <XCircle className="w-4 h-4 mr-2" />
                    {t("sellers.notMatchedNationalDb")}
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={simulateVerification}
                  disabled={isVerifying || formData.kycStatus === "Approved"}
                >
                  {isVerifying ? "Đang tra cứu..." : (formData.legalType === "Enterprise" ? t("sellers.verifyTaxId") : t("sellers.verifyIdCard"))}
                </Button>
              </div>
              
              {formData.kycStatus === "Pending" && !verificationResult && (
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    className="text-amber-600 border-amber-200 hover:bg-amber-50"
                    onClick={() => setFormData({ ...formData, kycStatus: "Pending" })}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {t("sellers.returnForAdditionalInfo")}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setFormData({ ...formData, kycStatus: "Rejected" })}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {t("sellers.reject")}
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => setFormData({ ...formData, kycStatus: "Approved", status: "Verified" })}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t("sellers.approve")}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tax" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">{t("sellers.taxId")}</Label>
                <div className="relative">
                  <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="taxId" 
                    className="pl-9"
                    placeholder="Nhập mã số thuế..." 
                    value={formData.taxId || ""}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.legalType === "Enterprise" ? t("sellers.taxNoteEnterprise") : t("sellers.taxNoteIndividual")}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">{t("sellers.bankName")}</Label>
                <select 
                  id="bankName"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.bankName || ""}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                >
                  <option value="">-- {t("sellers.selectBank")} --</option>
                  {VIETNAM_BANKS.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">
                  {formData.legalType === "Enterprise" ? t("sellers.businessAccount") : t("sellers.personalAccount")}
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="bankAccount" 
                    className="pl-9"
                    placeholder="Nhập số tài khoản..." 
                    value={formData.bankAccount || ""}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountHolder">{t("sellers.bankAccountHolder")}</Label>
                <Input 
                  id="bankAccountHolder" 
                  placeholder="Nhập tên chủ tài khoản..." 
                  value={formData.bankAccountHolder || ""}
                  onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          {!isViewMode && <Button onClick={handleSave}>Lưu thay đổi</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
