import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import { 
  Database, Download, Upload, RefreshCw, 
  Clock, ShieldCheck, AlertTriangle, CheckCircle2, Save
} from "lucide-react"
import { useSettingsStore } from "@/src/store/useSettingsStore"
import { toast } from "sonner"
import { logAction } from "@/src/services/auditService"

function SimpleSwitch({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) {
  return (
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
  )
}

export function BackupRestore() {
  const { t } = useTranslation()
  const { settings, saveAllSettings, updateSettings, loading } = useSettingsStore()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [autoBackup, setAutoBackup] = useState(settings.autoBackup?.enabled || false)

  useEffect(() => {
    if (settings.autoBackup) {
      setAutoBackup(settings.autoBackup.enabled)
    }
  }, [settings.autoBackup])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const dataStr = JSON.stringify(settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      await logAction({
        action: 'Export Settings',
        module: 'Backup',
        details: 'Manual export of all settings to JSON file',
        status: 'success'
      })

      toast.success(t("settings.backup.exportSuccess") || "Đã xuất dữ liệu cấu hình")
    } catch (error) {
      toast.error(t("settings.backup.exportError") || "Lỗi khi xuất dữ liệu")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const importedSettings = JSON.parse(content)
        
        if (typeof importedSettings !== 'object') throw new Error('Invalid format')

        await saveAllSettings(importedSettings)
        
        await logAction({
          action: 'Import Settings',
          module: 'Backup',
          details: `Imported settings from file: ${file.name}`,
          status: 'warning'
        })

        toast.success(t("settings.backup.importSuccess") || "Đã khôi phục dữ liệu cấu hình")
      } catch (error) {
        toast.error(t("settings.backup.importError") || "Lỗi khi nhập dữ liệu")
      } finally {
        setIsImporting(false)
        event.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  const handleToggleAutoBackup = async (enabled: boolean) => {
    setAutoBackup(enabled)
    try {
      await updateSettings('autoBackup', {
        enabled,
        lastUpdated: new Date().toISOString()
      })
      toast.success(enabled ? "Đã bật tự động sao lưu" : "Đã tắt tự động sao lưu")
    } catch (error) {
      toast.error("Lỗi khi cập nhật cài đặt")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              {t("settings.backup.manual")}
            </CardTitle>
            <CardDescription>
              {t("settings.backup.manualDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("settings.backup.lastBackup")}</span>
                <span className="text-sm text-muted-foreground">
                  {settings.autoBackup?.lastUpdated ? new Date(settings.autoBackup.lastUpdated).toLocaleString() : "Chưa có"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("settings.backup.size")}</span>
                <span className="text-sm text-muted-foreground">~{Math.round(JSON.stringify(settings).length / 1024)} KB</span>
              </div>
            </div>
            <Button className="w-full gap-2" onClick={handleExport} disabled={isExporting || loading}>
              {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              {t("settings.backup.createNow")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              {t("settings.backup.restore")}
            </CardTitle>
            <CardDescription>
              {t("settings.backup.restoreDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 bg-muted/10 relative">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">{t("settings.backup.dropFile")}</p>
                <p className="text-xs text-muted-foreground">.json (max 10MB)</p>
              </div>
              <Input 
                type="file" 
                accept=".json" 
                onChange={handleImport}
                disabled={isImporting || loading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">{t("common.selectFile")}</Button>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p>{t("settings.backup.restoreWarning")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            {t("settings.backup.auto")}
          </CardTitle>
          <CardDescription>
            {t("settings.backup.autoDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <p className="font-medium">{t("settings.backup.dailyBackup")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.backup.dailyBackupDesc")}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={autoBackup ? "default" : "secondary"}>
                {autoBackup ? "Enabled" : "Disabled"}
              </Badge>
              <SimpleSwitch checked={autoBackup} onChange={handleToggleAutoBackup} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {t("settings.backup.nextScheduled")}
              </span>
              <span className="font-medium">
                {autoBackup ? "Hàng ngày lúc 00:00" : "N/A"}
              </span>
            </div>
            <Progress value={autoBackup ? 45 : 0} className="h-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <p className="text-sm font-bold">Database</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="p-4 border rounded-lg flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <p className="text-sm font-bold">Storage</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="p-4 border rounded-lg flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <p className="text-sm font-bold">Cloud Sync</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
