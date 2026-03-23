import React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Settings, Plus, Edit2, Trash2, Zap, ShoppingBag, Star, Share2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { toast } from "sonner"

export const LoyaltyRules = () => {
  const { t } = useTranslation()

  const rules = [
    {
      id: 1,
      title: t("loyalty.rules.items.purchase.title"),
      description: t("loyalty.rules.items.purchase.description"),
      points: `1 ${t("loyalty.activities.points")} / 10k`,
      icon: ShoppingBag,
      color: "text-sky-600 bg-sky-50",
      status: "active",
    },
    {
      id: 2,
      title: t("loyalty.rules.items.review.title"),
      description: t("loyalty.rules.items.review.description"),
      points: `50 ${t("loyalty.activities.points")}`,
      icon: Star,
      color: "text-amber-600 bg-amber-50",
      status: "active",
    },
    {
      id: 3,
      title: t("loyalty.rules.items.referral.title"),
      description: t("loyalty.rules.items.referral.description"),
      points: `200 ${t("loyalty.activities.points")}`,
      icon: Share2,
      color: "text-emerald-600 bg-emerald-50",
      status: "active",
    },
    {
      id: 4,
      title: t("loyalty.rules.items.social.title"),
      description: t("loyalty.rules.items.social.description"),
      points: `20 ${t("loyalty.activities.points")}`,
      icon: Zap,
      color: "text-rose-600 bg-rose-50",
      status: "paused",
    },
  ]

  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-black flex items-center gap-3 tracking-tight">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Settings className="h-6 w-6" />
            </div>
            {t("loyalty.rules.title")}
          </CardTitle>
          <CardDescription className="font-medium text-slate-500">{t("loyalty.rules.description")}</CardDescription>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-100" onClick={() => toast.success(t("common.createSuccess", "Đã mở giao diện tạo quy tắc mới"))}>
          <Plus className="h-4 w-4 mr-1" /> {t("common.create")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${rule.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <rule.icon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 tracking-tight">{rule.title}</h3>
                  <Badge variant="outline" className={`text-[10px] uppercase font-black ${rule.status === 'active' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-slate-400 border-slate-100 bg-slate-50'}`}>
                    {t(`loyalty.rules.status.${rule.status}`)}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-500">{rule.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xl font-black text-indigo-600 tracking-tighter">{rule.points}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-xl">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 rounded-xl">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
