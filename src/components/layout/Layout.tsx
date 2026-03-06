import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { useDevice } from "@/src/hooks/useDevice"
import { cn } from "@/src/lib/utils"

export function Layout() {
  const { isMobile } = useDevice()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className={cn(
        "flex flex-1 flex-col overflow-hidden transition-all duration-300",
        !isMobile && "relative"
      )}>
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8 scrollbar-hide">
          <div className="mx-auto max-w-[1600px] w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
