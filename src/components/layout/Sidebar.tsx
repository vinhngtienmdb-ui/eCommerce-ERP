import { NavLink, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { cn } from "@/src/lib/utils"
import { useAppStore } from "@/src/store/useAppStore"
import { useDevice } from "@/src/hooks/useDevice"
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
  Zap,
  Globe,
  PenTool,
  Trophy,
  Navigation,
  FileSignature,
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
  Target,
  Layout,
  Mail,
  Calendar,
  X,
  Store,
  CheckSquare
} from "lucide-react"
import React, { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"

const navigationGroups = [
  {
    titleKey: "management",
    items: [
      { nameKey: "dashboard", href: "/", icon: LayoutDashboard },
      { 
        nameKey: "executive", 
        href: "/executive", 
        icon: Target,
        subItems: [
          { nameKey: "direction", href: "/executive/direction" },
          { nameKey: "strategyKpi", href: "/executive/strategy" },
        ]
      },
      { nameKey: "analytics", href: "/analytics", icon: ShieldCheck },
    ]
  },
  {
    titleKey: "workspace",
    items: [
      { nameKey: "dashboard", href: "/workspace", icon: Layout },
      { nameKey: "tasks", href: "/workspace/tasks", icon: CheckSquare },
      { nameKey: "chat", href: "/workspace/chat", icon: MessageSquare },
      { nameKey: "email", href: "/workspace/email", icon: Mail },
      { nameKey: "calendar", href: "/workspace/calendar", icon: Calendar },
    ]
  },
  {
    titleKey: "commerce",
    items: [
      { nameKey: "pos", href: "/pos", icon: Store },
      { nameKey: "orders", href: "/orders", icon: ShoppingCart },
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
      { nameKey: "customers", href: "/customers", icon: UsersRound },
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
      { nameKey: "sales", href: "/sales", icon: TrendingUp },
      { nameKey: "live", href: "/live", icon: Video },
    ]
  },
  {
    titleKey: "growth",
    items: [
      { 
        nameKey: "growthMarketing", 
        href: "/marketing", 
        icon: Megaphone,
        subItems: [
          { nameKey: "marketing", href: "/marketing" },
          { nameKey: "groupBuying", href: "/marketing/group-buying" },
          { nameKey: "social", href: "/social" },
          { nameKey: "advertising", href: "/advertising" },
          { nameKey: "affiliate", href: "/affiliate" },
          { nameKey: "planning", href: "/planning" },
        ]
      },
      { nameKey: "kolKoc", href: "/kol-koc", icon: Users },
      { nameKey: "contentStudio", href: "/content-studio", icon: PenTool },
      { nameKey: "loyalty", href: "/loyalty", icon: Trophy, subItems: [
          { nameKey: "loyaltyDashboard", href: "/loyalty" },
          { nameKey: "pointWallet", href: "/loyalty/point-wallet" },
      ] },
      { nameKey: "marketIntelligence", href: "/market-intelligence", icon: Globe },
    ]
  },
  {
    titleKey: "operations",
    items: [
      { nameKey: "purchasing", href: "/purchasing", icon: Truck },
      { nameKey: "logistics", href: "/logistics", icon: Navigation },
      { nameKey: "automation", href: "/automation", icon: Zap },
      { nameKey: "customerService", href: "/customer-service", icon: Headset },
    ]
  },
  {
    titleKey: "corporate",
    items: [
      { 
        nameKey: "finance", 
        href: "/finance", 
        icon: Wallet,
        subItems: [
          { nameKey: "accounting", href: "/finance/accounting" },
          { nameKey: "invoices", href: "/finance/invoices" },
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
          { nameKey: "hrPortal", href: "/hr/portal" },
          { nameKey: "hrInfo", href: "/hr/info" },
          { nameKey: "hrEmployees", href: "/hr/employees" },
          { nameKey: "hrTimeAttendance", href: "/hr/time-attendance" },
          { nameKey: "hrLeave", href: "/hr/leave" },
          { nameKey: "hrPayroll", href: "/hr/payroll" },
          { nameKey: "hrSocialInsurance", href: "/hr/social-insurance" },
          { nameKey: "hrPit", href: "/hr/pit" },
          { nameKey: "hrRecruitment", href: "/hr/recruitment" },
          { nameKey: "hrPerformance", href: "/hr/performance" },
          { nameKey: "hrGoals", href: "/hr/goals" },
        ]
      },
      { 
        nameKey: "adminWorkspace", 
        href: "/admin-workspace", 
        icon: Briefcase,
        subItems: [
          { nameKey: "requests", href: "/admin-workspace/requests" },
          { nameKey: "paymentRequest", href: "/admin-workspace/payment-request" },
          { nameKey: "workflow", href: "/admin-workspace/workflow" },
          { nameKey: "assets", href: "/admin-workspace/assets" },
          { nameKey: "stationery", href: "/admin-workspace/stationery" },
          { nameKey: "booking", href: "/admin-workspace/booking" },
          { nameKey: "documents", href: "/admin-workspace/documents" },
          { nameKey: "notifications", href: "/admin-workspace/notifications" },
        ]
      },
      { nameKey: "eContract", href: "/e-contract", icon: FileSignature },
      { 
        nameKey: "legal", 
        href: "/legal", 
        icon: ShieldCheck,
        subItems: [
          { nameKey: "legalAiAgent", href: "/legal/ai-agent" },
          { nameKey: "legalBrandPortal", href: "/legal/brand-portal" },
          { nameKey: "legalDispute", href: "/legal/dispute" },
          { nameKey: "legalCompliance", href: "/legal/compliance" },
          { nameKey: "legalContracts", href: "/legal/contracts" },
        ]
      },
    ]
  },
  {
    titleKey: "system",
    items: [
      { nameKey: "settings", href: "/settings", icon: Settings },
    ]
  }
]

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useAppStore()
  const { t } = useTranslation()
  const location = useLocation()
  const { isMobile, isTablet } = useDevice()
  
  // Keep track of expanded items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    products: location.pathname.startsWith('/products'),
    finance: location.pathname.startsWith('/finance'),
    workspace: location.pathname.startsWith('/workspace'),
    executive: location.pathname.startsWith('/executive')
  })

  useEffect(() => {
    if (location.pathname.startsWith('/products')) {
      setExpandedItems(prev => ({ ...prev, products: true }))
    }
    if (location.pathname.startsWith('/finance')) {
      setExpandedItems(prev => ({ ...prev, finance: true }))
    }
    if (location.pathname.startsWith('/workspace')) {
      setExpandedItems(prev => ({ ...prev, workspace: true }))
    }
    if (location.pathname.startsWith('/executive')) {
      setExpandedItems(prev => ({ ...prev, executive: true }))
    }
  }, [location.pathname])

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile, setSidebarOpen])

  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.preventDefault()
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <Layout className="h-5 w-5 text-primary-foreground" />
          </div>
          {(isSidebarOpen || isMobile) && (
            <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
              E-Commerce <span className="text-primary">ERP</span>
            </span>
          )}
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-full hover:bg-sidebar-accent">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
        <nav className="space-y-8 px-4">
          {navigationGroups.map((group) => (
            <div key={group.titleKey} className="space-y-2">
              {(isSidebarOpen || isMobile) && (
                <h3 className="px-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-sidebar-foreground/30 mb-4">
                  {t(`nav.groups.${group.titleKey}`)}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href || (item.subItems && location.pathname.startsWith(item.href))
                  const isExpanded = expandedItems[item.nameKey]

                  return (
                    <div key={item.nameKey}>
                      {item.subItems ? (
                        <div
                          onClick={(e) => toggleExpand(item.nameKey, e)}
                          className={cn(
                            "group flex items-center justify-between rounded px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-slate-600 hover:bg-slate-100",
                            !isSidebarOpen && !isMobile && "justify-center px-2"
                          )}
                          title={!isSidebarOpen && !isMobile ? t(`nav.${item.nameKey}`) : undefined}
                        >
                          <div className="flex items-center">
                            <item.icon
                              className={cn(
                                "flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                                isSidebarOpen || isMobile ? "mr-3 h-5 w-5" : "h-6 w-6"
                              )}
                            />
                            {(isSidebarOpen || isMobile) && <span className="tracking-tight">{t(`nav.${item.nameKey}`)}</span>}
                          </div>
                          {(isSidebarOpen || isMobile) && (
                            <div className="transition-transform duration-200">
                              {isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                            </div>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "group flex items-center rounded px-4 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-slate-600 hover:bg-slate-100",
                              !isSidebarOpen && !isMobile && "justify-center px-2"
                            )
                          }
                          title={!isSidebarOpen && !isMobile ? t(`nav.${item.nameKey}`) : undefined}
                        >
                          <item.icon
                            className={cn(
                              "flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                              isSidebarOpen || isMobile ? "mr-3 h-5 w-5" : "h-6 w-6"
                            )}
                          />
                          {(isSidebarOpen || isMobile) && <span className="tracking-tight">{t(`nav.${item.nameKey}`)}</span>}
                        </NavLink>
                      )}

                      {/* Sub-items */}
                      {item.subItems && isExpanded && (isSidebarOpen || isMobile) && (
                        <div className="mt-1 space-y-1 pl-11 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-sidebar-border/50">
                          {item.subItems.map((subItem) => (
                            <NavLink
                              key={subItem.nameKey}
                              to={subItem.href}
                              className={({ isActive }) =>
                                cn(
                                  "group flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                  isActive
                                    ? "text-primary font-semibold bg-primary/5"
                                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
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
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-[70px]"
      )}
    >
      {sidebarContent}
    </div>
  )
}

