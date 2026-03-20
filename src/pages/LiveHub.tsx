import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
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
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  Video,
  Users,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Pin,
  PinOff,
  Search,
  StopCircle,
  Calendar,
  LayoutDashboard,
  ChevronRight
} from "lucide-react"
import { cn } from "@/src/lib/utils"

// --- Sub-components for Tab Content ---

const DashboardContent = ({ t }: { t: any }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[
      { title: t("live.dashboard.activeViewers"), value: "1,245", icon: Users, trend: "+15% from last hour" },
      { title: t("live.dashboard.totalRevenue"), value: "₫ 45,000,000", icon: DollarSign },
      { title: t("live.dashboard.orders"), value: "128", icon: ShoppingCart },
      { title: t("live.dashboard.engagement"), value: "15.4K", icon: MessageSquare },
    ].map((stat, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          <stat.icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
          {stat.trend && <p className="text-xs text-muted-foreground text-green-500">{stat.trend}</p>}
        </CardContent>
      </Card>
    ))}
  </div>
)

const ScheduleContent = ({ t }: { t: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>{t("live.tabs.schedule")}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("live.schedule.title")}</TableHead>
            <TableHead>{t("live.schedule.host")}</TableHead>
            <TableHead>{t("live.schedule.startTime")}</TableHead>
            <TableHead>{t("live.schedule.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Mega Sale 3.3</TableCell>
            <TableCell>Nguyễn Văn A</TableCell>
            <TableCell>2026-03-03 20:00</TableCell>
            <TableCell><Badge variant="default" className="bg-red-500">{t("live.schedule.live")}</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

const ActiveSessionContent = ({ t }: { t: any }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <div className="md:col-span-2 space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-video bg-black relative flex items-center justify-center">
          <Video className="h-16 w-16 text-white/20" />
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE
          </div>
        </div>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Mega Sale 3.3</h3>
            <p className="text-sm text-muted-foreground">Host: Nguyễn Văn A</p>
          </div>
          <Button variant="destructive"><StopCircle className="mr-2 h-4 w-4" /> {t("live.activeSession.endStream")}</Button>
        </CardContent>
      </Card>
    </div>
    <div className="space-y-4">
      <Card className="h-[400px] flex flex-col">
        <CardHeader><CardTitle>{t("live.activeSession.chat")}</CardTitle></CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          <div className="flex gap-2"><span className="font-bold text-sm">User123:</span><span className="text-sm">Áo này còn size M không ạ?</span></div>
        </CardContent>
        <div className="p-4 border-t"><div className="flex gap-2"><Input placeholder="Nhập tin nhắn..." /><Button size="icon"><MessageSquare className="h-4 w-4" /></Button></div></div>
      </Card>
    </div>
  </div>
)

const ProductsContent = ({ t, products, pinnedProducts, togglePin }: { t: any, products: any[], pinnedProducts: string[], togglePin: (id: string) => void }) => (
  <Card>
    <CardHeader><CardTitle>{t("live.tabs.products")}</CardTitle></CardHeader>
    <CardContent>
      <div className="flex items-center gap-2 mb-4"><Input placeholder={t("live.products.search")} className="pl-8" /></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sản phẩm</TableHead>
            <TableHead className="text-right">{t("live.products.price")}</TableHead>
            <TableHead className="text-right">{t("live.products.stock")}</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.productName}</TableCell>
              <TableCell className="text-right">{(product.price || product.suggestedPrice || 0).toLocaleString()} ₫</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant={pinnedProducts.includes(product.id) ? "secondary" : "default"} onClick={() => togglePin(product.id)}>
                  {pinnedProducts.includes(product.id) ? <><PinOff className="mr-2 h-4 w-4" /> {t("live.products.unpin")}</> : <><Pin className="mr-2 h-4 w-4" /> {t("live.products.pin")}</>}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

// --- Main Component ---

export function LiveHub() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [pinnedProducts, setPinnedProducts] = useState<string[]>(["PROD-001"])

  const togglePin = (id: string) => {
    setPinnedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const products = [
    { id: "PROD-001", productName: "Áo thun Cotton Premium", price: 250000, stock: 150 },
    { id: "PROD-002", productName: "Quần Jeans Slimfit", price: 550000, stock: 80 },
    { id: "PROD-003", productName: "Giày Sneaker Basic", price: 890000, stock: 45 },
  ]

  const groups = [
    { id: "overview", title: t("live.tabs.dashboard"), items: [{ id: "dashboard", label: t("live.tabs.dashboard"), icon: LayoutDashboard }] },
    { id: "management", title: t("live.title"), items: [{ id: "schedule", label: t("live.tabs.schedule"), icon: Calendar }, { id: "activeSession", label: t("live.tabs.activeSession"), icon: Video }, { id: "products", label: t("live.tabs.products"), icon: ShoppingCart }] }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardContent t={t} />
      case "schedule": return <ScheduleContent t={t} />
      case "activeSession": return <ActiveSessionContent t={t} />
      case "products": return <ProductsContent t={t} products={products} pinnedProducts={pinnedProducts} togglePin={togglePin} />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("live.title")}</h2>
        <p className="text-muted-foreground">{t("live.description")}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-6">
          {groups.map((group) => (
            <div key={group.id} className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">{group.title}</h3>
              <nav className="space-y-1">
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors", activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                    <div className="flex items-center gap-3"><item.icon className="h-4 w-4" />{item.label}</div>
                    {activeTab === item.id && <ChevronRight className="h-4 w-4" />}
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border shadow-sm p-6 min-h-[600px]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
