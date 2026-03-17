import { Bell, Menu, Search, Sun, Moon, Globe, X } from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"
import { useDevice } from "@/src/hooks/useDevice"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export function Header() {
  const { toggleSidebar, isSidebarOpen } = useAppStore()
  const { isMobile } = useDevice()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { t, i18n } = useTranslation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isMobile && isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        {/* Desktop Search */}
        <div className="hidden md:flex relative w-64 lg:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("header.searchPlaceholder")}
            className="w-full bg-muted pl-8"
          />
        </div>

        {/* Mobile Search Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Search Bar Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-0 z-50 flex h-16 items-center bg-card px-4 md:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder={t("header.searchPlaceholder")}
              className="w-full bg-muted pl-8"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-2">
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('zh')}>中文</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('vi')}>Tiếng Việt</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="hidden sm:inline-flex"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>{t("header.notifications")}</span>
              <Button variant="ghost" size="sm" className="text-xs h-auto p-0">{t("header.markAllRead")}</Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {[
                { id: 1, title: "Đơn hàng mới #12345", time: "2 phút trước", type: "order" },
                { id: 2, title: "Sản phẩm 'Áo thun' sắp hết hàng", time: "1 giờ trước", type: "inventory" },
                { id: 3, title: "Khách hàng mới đăng ký", time: "3 giờ trước", type: "customer" },
                { id: 4, title: "Chiến dịch Marketing đã kết thúc", time: "5 giờ trước", type: "marketing" },
              ].map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-sm">{notif.title}</span>
                    <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {notif.type === "order" && "Bạn có một đơn hàng mới cần xử lý."}
                    {notif.type === "inventory" && "Số lượng tồn kho còn dưới 5 sản phẩm."}
                    {notif.type === "customer" && "Một khách hàng vừa tạo tài khoản mới."}
                    {notif.type === "marketing" && "Xem báo cáo hiệu quả chiến dịch ngay."}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs text-primary font-medium">
              {t("header.viewAllNotifications")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="@admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@ecommerce.erp
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("header.profile")}</DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden">{t("header.notifications")}</DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden">
              {theme === "light" ? t("header.darkMode") : t("header.lightMode")}
            </DropdownMenuItem>
            <DropdownMenuItem>{t("header.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("header.logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

