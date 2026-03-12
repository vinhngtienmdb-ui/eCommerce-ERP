import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Bell, Mail, Smartphone, MessageSquare, Globe, Save, RotateCcw } from "lucide-react"
import { useSettingsStore } from "@/src/store/useSettingsStore"
import { toast } from "sonner"

function SimpleSwitch({ checked, onChange, label, description }: { checked: boolean, onChange: (checked: boolean) => void, label: string, description: string }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
      <div className="space-y-0.5">
        <Label className="text-base cursor-pointer" onClick={() => onChange(!checked)}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
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
    </div>
  )
}

const defaultNotifications = {
  email: true,
  push: true,
  sms: false,
  zalo: false,
  orderUpdates: true,
  inventoryAlerts: true,
  newCustomers: false
}

export function NotificationSettings() {
  const { t } = useTranslation()
  const { settings, updateSettings, loading } = useSettingsStore()
  const [notifs, setNotifs] = useState(defaultNotifications)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (settings.notifications) {
      setNotifs({ ...defaultNotifications, ...settings.notifications })
    }
  }, [settings.notifications])

  const handleChange = (key: keyof typeof defaultNotifications, value: boolean) => {
    setNotifs(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    try {
      await updateSettings('notifications', notifs)
      setIsDirty(false)
      toast.success(t("settings.notifications.saveSuccess") || "Đã lưu cài đặt thông báo")
    } catch (error) {
      toast.error(t("settings.notifications.saveError") || "Lỗi khi lưu cài đặt")
    }
  }

  const handleCancel = () => {
    setNotifs(settings.notifications || defaultNotifications)
    setIsDirty(false)
  }

  if (loading) return <div className="p-8 text-center">Đang tải...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("settings.tabs.notifications")}</h2>
          <p className="text-muted-foreground">{t("settings.notifications.channelsDesc")}</p>
        </div>
        {isDirty && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
              {t("settings.general.unsavedChanges")}
            </span>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <RotateCcw className="h-4 w-4 mr-1" />
              {t("common.cancel")}
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              {t("settings.general.save")}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {t("settings.notifications.channels")}
          </CardTitle>
          <CardDescription>
            {t("settings.notifications.channelsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SimpleSwitch 
            checked={notifs.email} 
            onChange={(val) => handleChange('email', val)}
            label={t("settings.notifications.emailNotif")} 
            description={t("settings.notifications.emailNotifDesc")} 
          />
          <SimpleSwitch 
            checked={notifs.push} 
            onChange={(val) => handleChange('push', val)}
            label={t("settings.notifications.pushNotif")} 
            description={t("settings.notifications.pushNotifDesc")} 
          />
          <SimpleSwitch 
            checked={notifs.sms} 
            onChange={(val) => handleChange('sms', val)}
            label={t("settings.notifications.smsNotif")} 
            description={t("settings.notifications.smsNotifDesc")} 
          />
          <SimpleSwitch 
            checked={notifs.zalo} 
            onChange={(val) => handleChange('zalo', val)}
            label={t("settings.notifications.zaloNotif")} 
            description={t("settings.notifications.zaloNotifDesc")} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t("settings.notifications.systemEvents")}
          </CardTitle>
          <CardDescription>
            {t("settings.notifications.systemEventsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SimpleSwitch 
            checked={notifs.orderUpdates} 
            onChange={(val) => handleChange('orderUpdates', val)}
            label={t("settings.notifications.orderUpdates")} 
            description={t("settings.notifications.orderUpdatesDesc")} 
          />
          <SimpleSwitch 
            checked={notifs.inventoryAlerts} 
            onChange={(val) => handleChange('inventoryAlerts', val)}
            label={t("settings.notifications.inventoryAlerts")} 
            description={t("settings.notifications.inventoryAlertsDesc")} 
          />
          <SimpleSwitch 
            checked={notifs.newCustomers} 
            onChange={(val) => handleChange('newCustomers', val)}
            label={t("settings.notifications.newCustomers")} 
            description={t("settings.notifications.newCustomersDesc")} 
          />
        </CardContent>
      </Card>
    </div>
  )
}
