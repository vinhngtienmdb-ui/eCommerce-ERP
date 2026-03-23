import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { useDevice } from "@/src/hooks/useDevice"
import { cn } from "@/src/lib/utils"
import { POSOrderListener } from "../pos/POSOrderListener"
import { NotificationListener } from "../notifications/NotificationListener"

export function Layout() {
  const { isMobile } = useDevice()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <POSOrderListener />
      <NotificationListener />
      <Sidebar />
      <div className={cn(
        "flex flex-1 flex-col overflow-hidden transition-all duration-300",
        !isMobile && "relative"
      )}>
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-10 scrollbar-hide relative">
          <div className="mx-auto max-w-[1600px] w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
