import React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Switch } from "@/src/components/ui/switch"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Settings, Save, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export const LoyaltySettings = () => {
  const { t } = useTranslation()

  const handleSave = () => {
    toast.success(t("loyalty.settings.config.saveSuccess", "Đã lưu cấu hình thành công"), {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    })
  }

  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
              {t("loyalty.settings.title")}
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
              {t("loyalty.settings.description")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Feature Toggles */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            {t("loyalty.settings.features.title")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { id: "miniGames", label: t("loyalty.settings.features.miniGames"), defaultChecked: true },
              { id: "activityFeed", label: t("loyalty.settings.features.activityFeed"), defaultChecked: true },
              { id: "referral", label: t("loyalty.settings.features.referral"), defaultChecked: true },
              { id: "socialSharing", label: t("loyalty.settings.features.socialSharing"), defaultChecked: false },
              { id: "analytics", label: t("loyalty.settings.features.analytics"), defaultChecked: true },
            ].map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-all">
                <Label htmlFor={feature.id} className="font-bold text-slate-700 cursor-pointer">
                  {feature.label}
                </Label>
                <Switch id={feature.id} defaultChecked={feature.defaultChecked} />
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Parameters */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            {t("loyalty.settings.config.title")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-600">{t("loyalty.settings.config.pointsPerUnit")}</Label>
              <Input type="number" defaultValue={1} className="rounded-xl border-slate-200 focus:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-600">{t("loyalty.settings.config.pointExpiry")}</Label>
              <Input type="number" defaultValue={12} className="rounded-xl border-slate-200 focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
            <Save className="h-5 w-5" />
            {t("common.save", "Lưu cấu hình")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
