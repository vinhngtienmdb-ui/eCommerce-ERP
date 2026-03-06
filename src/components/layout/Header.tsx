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

        <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

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

