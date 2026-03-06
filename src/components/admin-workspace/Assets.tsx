import { useTranslation } from "react-i18next"
import { Monitor, Plus, Search, Filter, MoreVertical, Laptop, Armchair } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

export function Assets() {
  const { t } = useTranslation()

  const assets = [
    { id: "AST-001", name: "MacBook Pro M2", category: t("adminWorkspace.assets.laptop"), assignee: "Nguyễn Văn A", status: "inUse", condition: "Tốt", value: "$2,500", purchaseDate: "2023-01-15" },
    { id: "AST-002", name: "Dell UltraSharp 27", category: t("adminWorkspace.assets.monitor"), assignee: "Trần Thị B", status: "inUse", condition: "Tốt", value: "$600", purchaseDate: "2023-03-10" },
    { id: "AST-003", name: "Ghế Công Thái Học", category: t("adminWorkspace.assets.furniture"), assignee: "-", status: "available", condition: "Mới", value: "$450", purchaseDate: "2023-06-20" },
    { id: "AST-004", name: "ThinkPad X1 Carbon", category: t("adminWorkspace.assets.laptop"), assignee: "Lê Văn C", status: "maintenance", condition: "Lỗi màn hình", value: "$1,800", purchaseDate: "2022-11-05" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge variant="default" className="bg-emerald-500">{t("adminWorkspace.assets.available")}</Badge>
      case 'inUse': return <Badge variant="secondary" className="bg-blue-100 text-blue-700">{t("adminWorkspace.assets.inUse")}</Badge>
      case 'maintenance': return <Badge variant="destructive" className="bg-amber-100 text-amber-700">{t("adminWorkspace.assets.maintenance")}</Badge>
      default: return null
    }
  }

  const getIcon = (category: string) => {
    if (category.includes("Laptop")) return <Laptop className="h-5 w-5" />
    if (category.includes("Màn hình") || category.includes("Monitor")) return <Monitor className="h-5 w-5" />
    return <Armchair className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("common.search")} className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filters")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("adminWorkspace.assets.create")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {getIcon(asset.category)}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1 mb-4">
              <h3 className="font-semibold text-foreground line-clamp-1">{asset.name}</h3>
              <p className="text-sm text-muted-foreground">{asset.category}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("adminWorkspace.assets.assignee")}:</span>
                <span className="font-medium">{asset.assignee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("adminWorkspace.assets.condition")}:</span>
                <span className={asset.condition === 'Lỗi màn hình' ? 'text-red-500 font-medium' : ''}>{asset.condition}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed">
                <span className="text-muted-foreground text-[10px] uppercase">{t("adminWorkspace.assets.value")}:</span>
                <span className="font-bold text-blue-600">{asset.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-[10px] uppercase">{t("adminWorkspace.assets.purchaseDate")}:</span>
                <span className="text-[10px]">{asset.purchaseDate}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">{asset.id}</span>
              {getStatusBadge(asset.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
