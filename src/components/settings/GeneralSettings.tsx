import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"
import { Globe, Mail, Phone, Clock, Coins, Image as ImageIcon, Share2, AlertCircle } from "lucide-react"
import { useSettingsStore } from "@/src/store/useSettingsStore"
// import { toast } from "@/src/components/ui/use-toast"

export function GeneralSettings() {
  const { t } = useTranslation()
  const { settings, updateSettings, loading } = useSettingsStore()
  const [localSettings, setLocalSettings] = useState<any>({})
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (settings.general) {
      setLocalSettings(settings.general)
    }
  }, [settings.general])

  const handleChange = (field: string, value: string) => {
    setLocalSettings((prev: any) => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    try {
      await updateSettings('general', localSettings)
      setIsDirty(false)
      /* toast({
        title: t("common.success"),
        description: t("settings.general.saveSuccess"),
      }) */
    } catch (error) {
      /* toast({
        title: t("common.error"),
        description: t("settings.general.saveError"),
        variant: "destructive",
      }) */
    }
  }

  return (
    <div className="space-y-6">
      {isDirty && (
        <div className="flex items-center justify-between p-3 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{t("settings.general.unsavedChanges")}</span>
          </div>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            {t("settings.general.saveNow")}
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t("settings.general.systemInfo")}
          </CardTitle>
          <CardDescription>
            {t("settings.general.systemInfoDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="systemName">{t("settings.general.systemName")}</Label>
              <Input 
                id="systemName" 
                value={localSettings.systemName || ""} 
                onChange={(e) => handleChange('systemName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("settings.general.systemNameDesc")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemUrl">{t("settings.general.systemUrl")}</Label>
              <Input 
                id="systemUrl" 
                value={localSettings.systemUrl || ""} 
                onChange={(e) => handleChange('systemUrl', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("settings.general.systemUrlDesc")}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("settings.general.logo")}</Label>
              <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/20">
                <div className="h-12 w-12 rounded bg-muted border flex items-center justify-center text-xs text-muted-foreground">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="outline" size="sm">{t("common.upload")}</Button>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.general.navicon")}</Label>
              <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/20">
                <div className="h-12 w-12 rounded bg-muted border flex items-center justify-center text-xs text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="outline" size="sm">{t("common.upload")}</Button>
                  <p className="text-[10px] text-muted-foreground">ICO, PNG 32x32</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {t("settings.general.contactInfo")}
          </CardTitle>
          <CardDescription>
            {t("settings.general.contactInfoDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">{t("settings.general.contactEmail")}</Label>
              <Input 
                id="contactEmail" 
                type="email" 
                value={localSettings.contactEmail || ""} 
                onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("settings.general.contactEmailDesc")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotline">{t("settings.general.hotline")}</Label>
              <Input 
                id="hotline" 
                type="tel" 
                value={localSettings.hotline || ""} 
                onChange={(e) => handleChange('hotline', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("settings.general.hotlineDesc")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t("settings.general.address")}</Label>
            <Input 
              id="address" 
              value={localSettings.address || ""} 
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setIsDirty(false)} disabled={!isDirty}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSave} disabled={!isDirty || loading}>
          {t("settings.general.save")}
        </Button>
      </div>
    </div>
  )
}
