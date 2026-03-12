import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { 
  User, Bell, Shield, Palette, Settings as SettingsIcon, 
  Receipt, ListTree, Users, Network, CreditCard, Truck,
  History, Database, Lock, ChevronRight
} from "lucide-react"

import { UserManagement } from "./UserManagement"
import { GeneralSettings } from "@/src/components/settings/GeneralSettings"
import { CategoryConfig } from "@/src/components/settings/CategoryConfig"
import { FeesConfig } from "@/src/components/settings/FeesConfig"
import { ShippingFeesConfig } from "@/src/components/settings/ShippingFeesConfig"
import { RoleMatrixConfig } from "@/src/components/settings/RoleMatrixConfig"
import { IntegrationConfig } from "@/src/components/settings/IntegrationConfig"
import { ShippingSettingsTab } from "@/src/components/orders/ShippingSettingsTab"
import { PaymentShippingConfig } from "@/src/components/settings/PaymentShippingConfig"
import { AccountSettings } from "@/src/components/settings/AccountSettings"
import { NotificationSettings } from "@/src/components/settings/NotificationSettings"
import { SecuritySettings } from "@/src/components/settings/SecuritySettings"
import { AppearanceSettings } from "@/src/components/settings/AppearanceSettings"
import { AuditLog } from "@/src/components/settings/AuditLog"
import { BackupRestore } from "@/src/components/settings/BackupRestore"
import { useSettingsStore } from "@/src/store/useSettingsStore"
import { usePermissions } from "@/src/hooks/usePermissions"
import { cn } from "@/src/lib/utils"

export function Settings() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("general")
  const { fetchSettings, loading: settingsLoading } = useSettingsStore()
  const { hasPermission, isAdmin, loading: authLoading } = usePermissions()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  if (authLoading || settingsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const groups = [
    {
      id: "personal",
      title: t("settings.groups.personal"),
      items: [
        { id: "account", label: t("settings.tabs.account"), icon: User },
      ]
    },
    {
      id: "system",
      title: t("settings.groups.system"),
      items: [
        { id: "general", label: t("settings.tabs.general"), icon: SettingsIcon },
        { id: "appearance", label: t("settings.tabs.appearance"), icon: Palette },
        { id: "notifications", label: t("settings.tabs.notifications"), icon: Bell },
      ]
    },
    {
      id: "business",
      title: t("settings.groups.business"),
      items: [
        { id: "categories", label: t("settings.tabs.categories"), icon: ListTree },
        { id: "fees", label: t("settings.tabs.fees"), icon: Receipt },
        { id: "shipping", label: t("settings.tabs.shipping"), icon: Truck },
        { id: "paymentShipping", label: t("settings.tabs.paymentShipping"), icon: CreditCard },
        { id: "integrations", label: t("settings.tabs.integrations"), icon: Network },
      ]
    },
    {
      id: "security",
      title: t("settings.groups.security"),
      items: [
        { id: "users", label: t("nav.users"), icon: User },
        { id: "roles", label: t("settings.tabs.roles"), icon: Users, adminOnly: true },
        { id: "security", label: t("settings.tabs.security"), icon: Shield },
        { id: "audit", label: t("settings.tabs.audit"), icon: History, adminOnly: true },
      ]
    },
    {
      id: "data",
      title: t("settings.groups.data"),
      items: [
        { id: "backup", label: t("settings.tabs.backup"), icon: Database, adminOnly: true },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h2>
        <p className="text-muted-foreground">
          {t("settings.description")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-6">
          {groups.map((group) => {
            const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin)
            if (visibleItems.length === 0) return null

            return (
              <div key={group.id} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  {group.title}
                </h3>
                <nav className="space-y-1">
                  {visibleItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </div>
                      {activeTab === item.id && <ChevronRight className="h-4 w-4" />}
                    </button>
                  ))}
                </nav>
              </div>
            )
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border shadow-sm p-6 min-h-[600px]">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "categories" && <CategoryConfig />}
            {activeTab === "fees" && (
              <div className="space-y-8">
                <FeesConfig />
                <ShippingFeesConfig />
              </div>
            )}
            {activeTab === "roles" && isAdmin && <RoleMatrixConfig />}
            {activeTab === "integrations" && <IntegrationConfig />}
            {activeTab === "shipping" && <ShippingSettingsTab />}
            {activeTab === "paymentShipping" && <PaymentShippingConfig />}
            {activeTab === "account" && <AccountSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
            {activeTab === "audit" && isAdmin && <AuditLog />}
            {activeTab === "backup" && isAdmin && <BackupRestore />}
          </div>
        </main>
      </div>
    </div>
  )
}
