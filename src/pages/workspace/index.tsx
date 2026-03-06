import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Mail, 
  Calendar as CalendarIcon,
  Settings,
  Bell,
  Search,
  Menu
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Separator } from "@/src/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { Dashboard } from "./Dashboard"
import { Tasks } from "./Tasks"
import { Chat } from "./Chat"
import { Email } from "./Email"
import { Calendar } from "./Calendar"

const Workspace = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState("dashboard")

  useEffect(() => {
    const path = location.pathname.split("/").pop()
    if (path && ["tasks", "chat", "email", "calendar"].includes(path)) {
      setActiveModule(path)
    } else {
      setActiveModule("dashboard")
    }
  }, [location])

  const handleNavigation = (id: string) => {
    setActiveModule(id)
    navigate(id === "dashboard" ? "/workspace" : `/workspace/${id}`)
  }

  const navItems = [
    { id: "dashboard", label: t('workspace.tabs.dashboard'), icon: LayoutDashboard },
    { id: "tasks", label: t('workspace.tabs.tasks'), icon: CheckSquare },
    { id: "chat", label: t('workspace.tabs.chat'), icon: MessageSquare },
    { id: "email", label: t('workspace.tabs.email'), icon: Mail },
    { id: "calendar", label: t('workspace.tabs.calendar'), icon: CalendarIcon },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard": return <Dashboard />
      case "tasks": return <Tasks />
      case "chat": return <Chat />
      case "email": return <Email />
      case "calendar": return <Calendar />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b flex items-center justify-between px-4 lg:px-6 bg-background sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold tracking-tight">{t('workspace.title')}</h2>
              </div>
              <nav className="flex flex-col p-4 gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeModule === item.id ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => handleNavigation(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="font-semibold text-lg hidden lg:block">{t('workspace.title')}</div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeModule === item.id ? "secondary" : "ghost"}
                size="sm"
                className="h-9 px-4"
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block w-64 mr-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('common.search')} className="pl-8 h-9" />
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-[1600px] mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default Workspace
