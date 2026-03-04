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
import { Badge } from "@/src/components/ui/badge"
import {
  Video,
  Users,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Plus,
  Pin,
  PinOff,
  Search,
  StopCircle
} from "lucide-react"

export function LiveHub() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [pinnedProducts, setPinnedProducts] = useState<string[]>(["PROD-001"])

  const togglePin = (id: string) => {
    setPinnedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const products = [
    { id: "PROD-001", name: "Áo thun Cotton Premium", price: 250000, stock: 150 },
    { id: "PROD-002", name: "Quần Jeans Slimfit", price: 550000, stock: 80 },
    { id: "PROD-003", name: "Giày Sneaker Basic", price: 890000, stock: 45 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("live.title")}</h1>
          <p className="text-muted-foreground">
            {t("live.description")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("live.schedule.create")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">{t("live.tabs.dashboard")}</TabsTrigger>
          <TabsTrigger value="schedule">{t("live.tabs.schedule")}</TabsTrigger>
          <TabsTrigger value="activeSession">{t("live.tabs.activeSession")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("live.dashboard.activeViewers")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground text-green-500">
                  +15% from last hour
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("live.dashboard.totalRevenue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₫ 45,000,000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("live.dashboard.orders")}
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("live.dashboard.engagement")}
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.4K</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
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
                    <TableCell>
                      <Badge variant="default" className="bg-red-500">{t("live.schedule.live")}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ra mắt SP mới</TableCell>
                    <TableCell>Trần Thị B</TableCell>
                    <TableCell>2026-03-05 19:00</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t("live.schedule.upcoming")}</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activeSession" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black relative flex items-center justify-center">
                  <Video className="h-16 w-16 text-white/20" />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    LIVE
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-2">
                    <Users className="h-3 w-3" /> 1,245
                  </div>
                </div>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Mega Sale 3.3</h3>
                    <p className="text-sm text-muted-foreground">Host: Nguyễn Văn A</p>
                  </div>
                  <Button variant="destructive">
                    <StopCircle className="mr-2 h-4 w-4" />
                    {t("live.activeSession.endStream")}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("live.tabs.products")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder={t("live.products.search")} className="pl-8" />
                    </div>
                  </div>
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
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">{product.price.toLocaleString()} ₫</TableCell>
                          <TableCell className="text-right">{product.stock}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant={pinnedProducts.includes(product.id) ? "secondary" : "default"}
                              onClick={() => togglePin(product.id)}
                            >
                              {pinnedProducts.includes(product.id) ? (
                                <><PinOff className="mr-2 h-4 w-4" /> {t("live.products.unpin")}</>
                              ) : (
                                <><Pin className="mr-2 h-4 w-4" /> {t("live.products.pin")}</>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>{t("live.activeSession.chat")}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4">
                  <div className="flex gap-2">
                    <span className="font-bold text-sm">User123:</span>
                    <span className="text-sm">Áo này còn size M không ạ?</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-sm text-blue-500">Shop:</span>
                    <span className="text-sm">Dạ còn size M nha bạn ơi.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-sm">KhachHangMoi:</span>
                    <span className="text-sm">Cho mình xem lại mẫu màu đen với.</span>
                  </div>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input placeholder="Nhập tin nhắn..." />
                    <Button size="icon"><MessageSquare className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
