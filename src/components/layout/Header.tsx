import { Bell, Menu, Search, Sun, Moon, Globe, X, LogOut, User as UserIcon, Settings as SettingsIcon, MessageSquare, Mail } from "lucide-react"
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
import { useAuth } from "@/src/lib/AuthContext"
import { db } from "@/src/lib/firebase"
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/src/components/ui/dialog"
import { Chat } from "@/src/pages/workspace/Chat"
import { Email } from "@/src/pages/workspace/Email"

export function Header() {
  const { toggleSidebar, isSidebarOpen } = useAppStore()
  const { isMobile } = useDevice()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { t, i18n } = useTranslation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-primary/10 hover:text-primary rounded-xl">
          {isMobile && isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        {/* Desktop Search */}
        <div className="hidden md:flex relative w-64 lg:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("header.searchPlaceholder")}
            className="w-full bg-muted pl-9 border-none focus:ring-2 focus:ring-primary/20 rounded-xl"
          />
        </div>

        {/* Mobile Search Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-primary/10 hover:text-primary rounded-xl"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Search Bar Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-0 z-50 flex h-16 items-center bg-card px-4 md:hidden shadow-sm border-b border-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder={t("header.searchPlaceholder")}
              className="w-full bg-muted pl-9 border-none focus:ring-2 focus:ring-primary/20 rounded-xl"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-2 hover:bg-primary/10 hover:text-primary rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1 md:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary rounded-xl">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 rounded-2xl">
            <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={() => changeLanguage('zh')}>中文</DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={() => changeLanguage('vi')}>Tiếng Việt</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary rounded-xl"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary rounded-xl">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Chat</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
            <DialogTitle className="sr-only">Chat</DialogTitle>
            <Chat isPopup={true} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary rounded-xl">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl p-0 border-none bg-transparent shadow-none">
            <DialogTitle className="sr-only">Email</DialogTitle>
            <Email isPopup={true} />
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex hover:bg-primary/10 hover:text-primary rounded-xl">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 rounded-2xl" align="end">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>{t("header.notifications")}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <DropdownMenuItem className="text-muted-foreground text-sm rounded-xl">
                  {t("header.noNotifications")}
                </DropdownMenuItem>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-primary/5 rounded-xl mb-1">
                    <div className="flex justify-between w-full">
                      <span className="font-medium text-sm">{notif.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {notif.createdAt?.toDate().toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {notif.message}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10 p-1">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/avatar/100/100"} alt={user?.displayName || t("header.user")} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.displayName?.charAt(0) || t("header.userFallback")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user?.displayName || t("header.user")}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-primary/5 rounded-xl cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4 text-primary" />
              {t("header.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden hover:bg-primary/5 rounded-xl cursor-pointer">{t("header.notifications")}</DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden hover:bg-primary/5 rounded-xl cursor-pointer">
              {theme === "light" ? t("header.darkMode") : t("header.lightMode")}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/5 rounded-xl cursor-pointer">
              <SettingsIcon className="mr-2 h-4 w-4 text-primary" />
              {t("header.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              {t("header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

