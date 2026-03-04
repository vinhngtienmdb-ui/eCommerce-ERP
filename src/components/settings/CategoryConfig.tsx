import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Search, Plus, Trash2 } from "lucide-react"
import { initialPlatformFees, type CategoryFee } from "@/src/data/fees"

export function CategoryConfig() {
  const { t } = useTranslation()
  const [platformFees, setPlatformFees] = useState<CategoryFee[]>(initialPlatformFees)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState<Partial<CategoryFee>>({
    level1: "",
    level2: "",
    level3: "",
    feeRateMall: 0,
    feeRateRegular: 0,
  })

  const filteredPlatformFees = platformFees.filter(fee => 
    fee.level1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.level2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.level3.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePlatformFeeChange = (id: string, field: 'feeRateMall' | 'feeRateRegular', newRate: number) => {
    setPlatformFees(fees => fees.map(fee => 
      fee.id === id ? { ...fee, [field]: newRate } : fee
    ))
  }

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(t("settings.fees.confirmDeleteDesc"))) {
      setPlatformFees(fees => fees.filter(fee => fee.id !== id))
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.level1 || !newCategory.level2) return;

    const newId = `custom-${Date.now()}`;
    const categoryToAdd: CategoryFee = {
      id: newId,
      level1: newCategory.level1 || "",
      level2: newCategory.level2 || "",
      level3: newCategory.level3 || "",
      feeRateMall: newCategory.feeRateMall || 0,
      feeRateRegular: newCategory.feeRateRegular || 0,
    }

    setPlatformFees([categoryToAdd, ...platformFees])
    setIsAddDialogOpen(false)
    setNewCategory({
      level1: "",
      level2: "",
      level3: "",
      feeRateMall: 0,
      feeRateRegular: 0,
    })
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{t("settings.fees.categoryManagement")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.fees.categoryManagementDesc")}</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("settings.fees.searchCategory")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t("settings.fees.addCategory")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("settings.fees.addCategory")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>{t("settings.fees.categoryLevel1")}</Label>
                  <Input 
                    placeholder={t("settings.fees.categoryLevel1Placeholder")}
                    value={newCategory.level1}
                    onChange={(e) => setNewCategory({ ...newCategory, level1: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.fees.categoryLevel2")}</Label>
                  <Input 
                    placeholder={t("settings.fees.categoryLevel2Placeholder")}
                    value={newCategory.level2}
                    onChange={(e) => setNewCategory({ ...newCategory, level2: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.fees.categoryLevel3")}</Label>
                  <Input 
                    placeholder={t("settings.fees.categoryLevel3Placeholder")}
                    value={newCategory.level3}
                    onChange={(e) => setNewCategory({ ...newCategory, level3: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("settings.fees.feeRateMall")}</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={newCategory.feeRateMall}
                        onChange={(e) => setNewCategory({ ...newCategory, feeRateMall: parseFloat(e.target.value) || 0 })}
                        className="pr-8 text-right"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("settings.fees.feeRateRegular")}</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={newCategory.feeRateRegular}
                        onChange={(e) => setNewCategory({ ...newCategory, feeRateRegular: parseFloat(e.target.value) || 0 })}
                        className="pr-8 text-right"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleAddCategory} disabled={!newCategory.level1 || !newCategory.level2}>
                  {t("settings.fees.addCategory")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("settings.fees.categoryLevel1")}</TableHead>
                <TableHead>{t("settings.fees.categoryLevel2")}</TableHead>
                <TableHead>{t("settings.fees.categoryLevel3")}</TableHead>
                <TableHead className="text-right w-[150px]">{t("settings.fees.feeRateMall")}</TableHead>
                <TableHead className="text-right w-[150px]">{t("settings.fees.feeRateRegular")}</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlatformFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.level1}</TableCell>
                  <TableCell>{fee.level2}</TableCell>
                  <TableCell>{fee.level3}</TableCell>
                  <TableCell>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={fee.feeRateMall}
                        onChange={(e) => handlePlatformFeeChange(fee.id, 'feeRateMall', parseFloat(e.target.value) || 0)}
                        className="pr-8 text-right h-8"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-1.5 text-sm text-muted-foreground">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={fee.feeRateRegular}
                        onChange={(e) => handlePlatformFeeChange(fee.id, 'feeRateRegular', parseFloat(e.target.value) || 0)}
                        className="pr-8 text-right h-8"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-1.5 text-sm text-muted-foreground">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCategory(fee.id)}
                      title={t("settings.fees.deleteCategory")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPlatformFees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t flex justify-end">
          <Button>{t("settings.fees.saveChanges")}</Button>
        </div>
      </div>
    </div>
  )
}
