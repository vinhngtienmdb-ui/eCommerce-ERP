import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { User, Bell, Shield, Palette, Settings as SettingsIcon, Receipt, ListTree, Users, Network, CreditCard, Truck } from "lucide-react"
import { FeesConfig } from "@/src/components/settings/FeesConfig"
import { ShippingFeesConfig } from "@/src/components/settings/ShippingFeesConfig"
import { CategoryConfig } from "@/src/components/settings/CategoryConfig"
import { RoleMatrixConfig } from "@/src/components/settings/RoleMatrixConfig"
import { IntegrationConfig } from "@/src/components/settings/IntegrationConfig"
import { PaymentShippingConfig } from "@/src/components/settings/PaymentShippingConfig"
import { ShippingSettingsTab } from "@/src/components/orders/ShippingSettingsTab"

function SimpleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={`${
        checked ? "bg-primary" : "bg-input"
      } peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <span
        className={`${
          checked ? "translate-x-5" : "translate-x-0"
        } pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform`}
      />
    </button>
  )
}

export function Settings() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h2>
        <p className="text-muted-foreground">
          {t("settings.description")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-max min-w-full">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.general")}</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <ListTree className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.categories")}</span>
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.fees")}</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.roles")}</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.integrations")}</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.shipping")}</span>
            </TabsTrigger>
            <TabsTrigger value="paymentShipping" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.paymentShipping")}</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.account")}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.notifications")}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.security")}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.appearance")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="systemName">{t("settings.general.systemName")}</Label>
                <Input id="systemName" defaultValue="My E-Commerce Platform" />
                <p className="text-sm text-muted-foreground">{t("settings.general.systemNameDesc")}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">{t("settings.general.logo")}</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-muted border flex items-center justify-center text-xs text-muted-foreground">Logo</div>
                    <Button variant="outline" size="sm">Upload</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="navicon">{t("settings.general.navicon")}</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-muted border flex items-center justify-center text-[10px] text-muted-foreground">Icon</div>
                    <Button variant="outline" size="sm">Upload</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">{t("settings.general.contactEmail")}</Label>
                  <Input id="contactEmail" type="email" defaultValue="admin@example.com" />
                  <p className="text-sm text-muted-foreground">{t("settings.general.contactEmailDesc")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotline">{t("settings.general.hotline")}</Label>
                  <Input id="hotline" type="tel" defaultValue="1900 1234" />
                  <p className="text-sm text-muted-foreground">{t("settings.general.hotlineDesc")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t("settings.general.timezone")}</Label>
                  <select 
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Asia/Ho_Chi_Minh"
                  >
                    <option value="Asia/Ho_Chi_Minh">(GMT+07:00) Indochina Time (Ho Chi Minh City)</option>
                    <option value="UTC">(GMT+00:00) Coordinated Universal Time</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t("settings.general.currency")}</Label>
                  <select 
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="VND"
                  >
                    <option value="VND">VND (₫)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <Button>{t("settings.general.save")}</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <FeesConfig />
          <ShippingFeesConfig />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryConfig />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RoleMatrixConfig />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <IntegrationConfig />
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <ShippingSettingsTab />
        </TabsContent>

        <TabsContent value="paymentShipping" className="space-y-4">
          <PaymentShippingConfig />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-2xl">
            <h3 className="text-lg font-medium mb-4">{t("settings.account.profile")}</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  AD
                </div>
                <Button variant="outline">{t("settings.account.updateProfile")}</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("settings.account.fullName")}</Label>
                  <Input id="fullName" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.account.email")}</Label>
                  <Input id="email" type="email" defaultValue="admin@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">{t("settings.account.mobilePhone")}</Label>
                  <Input id="mobilePhone" type="tel" defaultValue="0987654321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ext">{t("settings.account.ext")}</Label>
                  <Input id="ext" defaultValue="101" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">{t("settings.account.department")}</Label>
                  <Input id="department" defaultValue="IT & Operations" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">{t("settings.account.position")}</Label>
                  <Input id="position" defaultValue="System Administrator" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">{t("settings.account.role")}</Label>
                <Input id="role" defaultValue="Super Administrator" disabled className="bg-muted" />
              </div>

              <Button>{t("settings.general.save")}</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("settings.notifications.emailNotif")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.notifications.emailNotifDesc")}
                  </p>
                </div>
                <SimpleSwitch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("settings.notifications.pushNotif")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.notifications.pushNotifDesc")}
                  </p>
                </div>
                <SimpleSwitch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("settings.notifications.smsNotif")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.notifications.smsNotifDesc")}
                  </p>
                </div>
                <SimpleSwitch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-2xl">
              <h3 className="text-lg font-medium mb-4">{t("settings.security.changePassword")}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t("settings.security.currentPassword")}</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("settings.security.newPassword")}</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("settings.security.confirmPassword")}</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>{t("settings.general.save")}</Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("settings.security.twoFactorAuth")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.security.twoFactorAuthDesc")}
                  </p>
                </div>
                <SimpleSwitch />
              </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-4xl">
              <h3 className="text-lg font-medium mb-4">{t("settings.security.activeSessions")}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">MacBook Pro - Chrome</p>
                    <p className="text-sm text-muted-foreground">Hanoi, Vietnam • 113.190.23.45</p>
                  </div>
                  <Badge variant="default">Current Session</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">iPhone 14 Pro - Safari</p>
                    <p className="text-sm text-muted-foreground">Ho Chi Minh City, Vietnam • 14.232.11.22</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">{t("settings.security.revokeSession")}</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-2xl">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">{t("settings.appearance.theme")}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border-2 border-primary rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-white border shadow-sm"></div>
                    <span className="text-sm font-medium">{t("settings.appearance.light")}</span>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 hover:border-primary/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-slate-950 border shadow-sm"></div>
                    <span className="text-sm font-medium">{t("settings.appearance.dark")}</span>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 hover:border-primary/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-white to-slate-950 border shadow-sm"></div>
                    <span className="text-sm font-medium">{t("settings.appearance.system")}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">{t("settings.appearance.primaryColor")}</h3>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-900 ring-2 ring-offset-2 ring-slate-900 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-blue-600 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="h-10 w-10 rounded-full bg-emerald-600 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="h-10 w-10 rounded-full bg-violet-600 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="h-10 w-10 rounded-full bg-rose-600 cursor-pointer hover:scale-110 transition-transform"></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">{t("settings.appearance.fontSize")}</h3>
                <div className="flex gap-4">
                  <Button variant="outline" className="text-sm">{t("settings.appearance.small")}</Button>
                  <Button variant="default" className="text-base">{t("settings.appearance.medium")}</Button>
                  <Button variant="outline" className="text-lg">{t("settings.appearance.large")}</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
