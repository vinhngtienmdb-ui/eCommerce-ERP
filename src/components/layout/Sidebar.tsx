import { NavLink, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { cn } from "@/src/lib/utils"
import { useAppStore } from "@/src/store/useAppStore"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Megaphone,
  Link,
  Truck,
  Wallet,
  UsersRound,
  Settings,
  ShieldCheck,
  Video,
  CreditCard,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Headset,
  Briefcase,
  TrendingUp,
  Target
} from "lucide-react"
import React, { useState, useEffect } from "react"

const navigation = [
  { nameKey: "dashboard", href: "/", icon: LayoutDashboard },
  { 
    nameKey: "products", 
    href: "/products", 
    icon: Package,
    subItems: [
      { nameKey: "allProducts", href: "/products/all" },
      { nameKey: "addProduct", href: "/products/add" },
      { nameKey: "aiOptimization", href: "/products/ai-tools" },
    ]
  },
  { 
    nameKey: "sellers", 
    href: "/sellers", 
    icon: Users,
    subItems: [
      { nameKey: "sellerList", href: "/sellers/list" },
      { nameKey: "sellerApproval", href: "/sellers/approval" },
      { nameKey: "sellerRegistration", href: "/sellers/registration" },
    ]
  },
  { nameKey: "customers", href: "/customers", icon: UsersRound },
  { nameKey: "customerService", href: "/customer-service", icon: Headset },
  { nameKey: "orders", href: "/orders", icon: ShoppingCart },
  { nameKey: "marketing", href: "/marketing", icon: Megaphone },
  { nameKey: "social", href: "/social", icon: MessageSquare },
  { nameKey: "advertising", href: "/advertising", icon: Target },
  { nameKey: "affiliate", href: "/affiliate", icon: Link },
  { nameKey: "purchasing", href: "/purchasing", icon: Truck },
  { nameKey: "legal", href: "/legal", icon: ShieldCheck },
  { 
    nameKey: "finance", 
    href: "/finance", 
    icon: Wallet,
    subItems: [
      { nameKey: "accounting", href: "/finance/accounting" },
      { nameKey: "reconciliation", href: "/finance/reconciliation" },
      { nameKey: "pnl", href: "/finance/pnl" },
      { nameKey: "paymentWallet", href: "/finance/payment-wallet" },
      { nameKey: "sellerFinance", href: "/finance/seller-finance" },
    ]
  },
  { 
    nameKey: "hr", 
    href: "/hr", 
    icon: UsersRound,
    subItems: [
      { nameKey: "coreHr", href: "/hr/core" },
      { nameKey: "timeAttendance", href: "/hr/time" },
      { nameKey: "payroll", href: "/hr/payroll" },
      { nameKey: "performance", href: "/hr/performance" },
    ]
  },
  { 
    nameKey: "adminWorkspace", 
    href: "/admin-workspace", 
    icon: Briefcase,
    subItems: [
      { nameKey: "assets", href: "/admin-workspace/assets" },
      { nameKey: "stationery", href: "/admin-workspace/stationery" },
      { nameKey: "booking", href: "/admin-workspace/booking" },
      { nameKey: "requests", href: "/admin-workspace/requests" },
    ]
  },
  { nameKey: "analytics", href: "/analytics", icon: ShieldCheck },
  { nameKey: "sales", href: "/sales", icon: TrendingUp },
  { nameKey: "live", href: "/live", icon: Video },
  { nameKey: "settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const { isSidebarOpen } = useAppStore()
  const { t } = useTranslation()
  const location = useLocation()
  
  // Keep track of expanded items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    products: location.pathname.startsWith('/products'),
    finance: location.pathname.startsWith('/finance')
  })

  useEffect(() => {
    if (location.pathname.startsWith('/products')) {
      setExpandedItems(prev => ({ ...prev, products: true }))
    }
    if (location.pathname.startsWith('/finance')) {
      setExpandedItems(prev => ({ ...prev, finance: true }))
    }
  }, [location.pathname])

  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.preventDefault()
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        {isSidebarOpen ? (
          <span className="text-xl font-bold text-sidebar-primary">E-Commerce ERP</span>
        ) : (
          <span className="text-xl font-bold text-sidebar-primary">ERP</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.subItems && location.pathname.startsWith(item.href))
            const isExpanded = expandedItems[item.nameKey]

            return (
              <div key={item.nameKey}>
                {item.subItems ? (
                  <div
                    onClick={(e) => toggleExpand(item.nameKey, e)}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      !isSidebarOpen && "justify-center"
                    )}
                    title={!isSidebarOpen ? t(`nav.${item.nameKey}`) : undefined}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={cn(
                          "flex-shrink-0",
                          isSidebarOpen ? "mr-3 h-5 w-5" : "h-6 w-6"
                        )}
                      />
                      {isSidebarOpen && <span>{t(`nav.${item.nameKey}`)}</span>}
                    </div>
                    {isSidebarOpen && (
                      isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        !isSidebarOpen && "justify-center"
                      )
                    }
                    title={!isSidebarOpen ? t(`nav.${item.nameKey}`) : undefined}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0",
                        isSidebarOpen ? "mr-3 h-5 w-5" : "h-6 w-6"
                      )}
                    />
                    {isSidebarOpen && <span>{t(`nav.${item.nameKey}`)}</span>}
                  </NavLink>
                )}

                {/* Sub-items */}
                {item.subItems && isExpanded && isSidebarOpen && (
                  <div className="mt-1 space-y-1 pl-9">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.nameKey}
                        to={subItem.href}
                        className={({ isActive }) =>
                          cn(
                            "group flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                            isActive
                              ? "text-sidebar-primary font-semibold bg-sidebar-accent/50"
                              : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                          )
                        }
                      >
                        {t(`nav.${subItem.nameKey}`)}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

