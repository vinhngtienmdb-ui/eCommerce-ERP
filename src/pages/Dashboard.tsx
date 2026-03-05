import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  Megaphone, 
  Wallet, 
  BarChart3, 
  UsersRound,
  Star,
  HelpCircle
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const revenueData = [
  { name: "Tháng 1", total: 125000000 },
  { name: "Tháng 2", total: 145000000 },
  { name: "Tháng 3", total: 185000000 },
  { name: "Tháng 4", total: 165000000 },
  { name: "Tháng 5", total: 210000000 },
  { name: "Tháng 6", total: 195000000 },
  { name: "Tháng 7", total: 245000000 },
]

const ordersData = [
  { name: "Thứ 2", orders: 120 },
  { name: "Thứ 3", orders: 150 },
  { name: "Thứ 4", orders: 180 },
  { name: "Thứ 5", orders: 140 },
  { name: "Thứ 6", orders: 200 },
  { name: "Thứ 7", orders: 250 },
  { name: "Chủ Nhật", orders: 220 },
]

export function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const modules = [
    { title: "nav.products", icon: Package, color: "text-blue-500", bg: "bg-blue-100", href: "/products", description: "Manage your product catalog" },
    { title: "nav.orders", icon: ShoppingCart, color: "text-orange-500", bg: "bg-orange-100", href: "/orders", description: "Track and process orders" },
    { title: "nav.sellers", icon: Users, color: "text-purple-500", bg: "bg-purple-100", href: "/sellers", description: "Manage seller accounts" },
    { title: "nav.customers", icon: UsersRound, color: "text-green-500", bg: "bg-green-100", href: "/customers", description: "View customer data" },
    { title: "nav.marketing", icon: Megaphone, color: "text-pink-500", bg: "bg-pink-100", href: "/marketing", description: "Campaigns and promotions" },
    { title: "nav.finance", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-100", href: "/finance", description: "Financial overview" },
    { title: "nav.hr", icon: UsersRound, color: "text-cyan-500", bg: "bg-cyan-100", href: "/hr", description: "Human resources" },
    { title: "nav.analytics", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-100", href: "/analytics", description: "Data analysis" },
  ]

  return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
          <p className="text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.totalRevenue")}</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatVND(1250431000)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +20.1%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.activeSellers")}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.350</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +180.1%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.totalOrders")}</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <ShoppingCart className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.234</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +19%
              </span>
              {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.activeProducts")}</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-rose-500 flex items-center mr-1">
                <ArrowDown className="h-3 w-3 mr-1" />
                -201
              </span>
              {t("dashboard.sinceLastHour")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-600">Quick Access</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((item) => (
            <Card
              key={item.title}
              className="hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => navigate(item.href)}
            >
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-blue-400 cursor-pointer" />
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{t(item.title)}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("dashboard.revenueOverview")}</CardTitle>
            <CardDescription>
              {t("dashboard.revenueDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip
                    formatter={(value: any) => formatVND(value)}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.weeklyOrders")}</CardTitle>
            <CardDescription>
              {t("dashboard.weeklyOrdersDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
