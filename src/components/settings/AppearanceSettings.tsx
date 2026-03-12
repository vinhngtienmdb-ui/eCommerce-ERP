import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Palette, Sun, Moon, Monitor, Type, Layout, Languages, Check } from "lucide-react"
import { useSettingsStore } from "@/src/store/useSettingsStore"
import { toast } from "sonner"

export function AppearanceSettings() {
  const { t, i18n } = useTranslation()
  const { settings, updateSettings, loading } = useSettingsStore()
  const [localAppearance, setLocalAppearance] = useState(settings.appearance || {
    theme: 'system',
    primaryColor: 'slate',
    fontSize: 'medium',
    density: 'comfortable'
  })
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (settings.appearance) {
      setLocalAppearance(settings.appearance)
    }
  }, [settings.appearance])

  const handleChange = (field: string, value: string) => {
    setLocalAppearance((prev: any) => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    try {
      await updateSettings('appearance', localAppearance)
      setIsDirty(false)
      toast.success(t("common.saveSuccess"))
    } catch (error) {
      toast.error(t("common.saveError"))
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Languages className="h-5 w-5 text-primary" />
            {t("settings.appearance.language")}
          </CardTitle>
          <CardDescription>
            {t("settings.appearance.languageDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant={i18n.language === 'vi' ? 'default' : 'outline'}
              onClick={() => i18n.changeLanguage('vi')}
              className="flex-1 h-12 text-base"
            >
              Tiếng Việt
            </Button>
            <Button 
              variant={i18n.language === 'en' ? 'default' : 'outline'}
              onClick={() => i18n.changeLanguage('en')}
              className="flex-1 h-12 text-base"
            >
              English
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-5 w-5 text-primary" />
            {t("settings.appearance.theme")}
          </CardTitle>
          <CardDescription>
            {t("settings.appearance.themeDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'light', icon: Sun, label: t("settings.appearance.light") },
              { id: 'dark', icon: Moon, label: t("settings.appearance.dark") },
              { id: 'system', icon: Monitor, label: t("settings.appearance.system") },
            ].map((theme) => (
              <div 
                key={theme.id}
                onClick={() => handleChange('theme', theme.id)}
                className={`group border-2 rounded-xl p-6 cursor-pointer flex flex-col items-center gap-4 bg-card hover:bg-muted/20 transition-all shadow-sm ${localAppearance.theme === theme.id ? 'border-primary ring-1 ring-primary' : 'border-transparent'}`}
              >
                <div className={`h-16 w-16 rounded-full bg-muted border flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform ${localAppearance.theme === theme.id ? 'bg-primary/10' : ''}`}>
                  <theme.icon className={`h-8 w-8 ${localAppearance.theme === theme.id ? 'text-primary' : ''}`} />
                </div>
                <span className="text-sm font-bold">{theme.label}</span>
                {localAppearance.theme === theme.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => setIsDirty(false)} disabled={!isDirty} className="h-10 px-6">
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSave} disabled={!isDirty || loading} className="h-10 px-6">
          {t("settings.general.save")}
        </Button>
      </div>
    </div>
  )
}
