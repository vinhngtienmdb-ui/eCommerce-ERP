import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Shield, Lock, Smartphone, Key, History, LogOut, Laptop, Smartphone as PhoneIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { auth } from "@/src/lib/firebase"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"

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

export function SecuritySettings() {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      setMessage({ type: 'error', text: t("settings.security.fillAllFields") })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t("settings.security.passwordMismatch") })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const user = auth.currentUser
      if (!user || !user.email) throw new Error("User not found")

      // Re-authenticate first (required for password change)
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      
      // Update password
      await updatePassword(user, newPassword)
      
      setMessage({ type: 'success', text: t("settings.security.passwordUpdateSuccess") })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Password update error:", error)
      let errorText = t("settings.security.passwordUpdateError")
      if (error.code === 'auth/wrong-password') {
        errorText = t("settings.security.wrongPassword")
      } else if (error.code === 'auth/requires-recent-login') {
        errorText = t("settings.security.requiresRecentLogin")
      }
      setMessage({ type: 'error', text: errorText })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t("settings.security.changePassword")}
            </CardTitle>
            <CardDescription>
              {t("settings.security.changePasswordDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {message.text}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("settings.security.currentPassword")}</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("settings.security.newPassword")}</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("settings.security.confirmPassword")}</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleUpdatePassword}
              disabled={loading}
            >
              {loading ? t("common.processing") : t("settings.security.updatePassword")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              {t("settings.security.twoFactorAuth")}
            </CardTitle>
            <CardDescription>
              {t("settings.security.twoFactorAuthDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <p className="font-medium">{t("settings.security.authenticatorApp")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.security.authenticatorAppDesc")}</p>
              </div>
              <SimpleSwitch />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <p className="font-medium">{t("settings.security.smsAuth")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.security.smsAuthDesc")}</p>
              </div>
              <SimpleSwitch defaultChecked />
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Key className="h-4 w-4" />
              {t("settings.security.backupCodes")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {t("settings.security.activeSessions")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.activeSessionsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">MacBook Pro - Chrome</p>
                <p className="text-xs text-muted-foreground">Hanoi, Vietnam • 113.190.23.45 • {t("common.now")}</p>
              </div>
            </div>
            <Badge variant="default">{t("settings.security.currentSession")}</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <PhoneIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">iPhone 14 Pro - Safari</p>
                <p className="text-xs text-muted-foreground">Ho Chi Minh City, Vietnam • 14.232.11.22 • 2 {t("common.hoursAgo")}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-2">
              <LogOut className="h-4 w-4" />
              {t("settings.security.revokeSession")}
            </Button>
          </div>
          <Button variant="link" className="text-destructive w-full">{t("settings.security.logoutAll")}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
