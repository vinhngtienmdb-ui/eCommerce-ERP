import React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { ShoppingBag, Star, Share2, UserPlus, Gift } from "lucide-react"
import { motion } from "motion/react"

export const LoyaltyActivityFeed = () => {
  const { t } = useTranslation()

  const activities = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "loyalty.activities.earned",
      amount: `+150 ${t("loyalty.activities.points")}`,
      type: "purchase",
      time: `2 ${t("common.minutesAgo")}`,
      icon: ShoppingBag,
      color: "text-sky-600 bg-sky-50",
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "loyalty.activities.redeemed",
      amount: `-500 ${t("loyalty.activities.points")}`,
      type: "redeem",
      time: `15 ${t("common.minutesAgo")}`,
      icon: Gift,
      color: "text-rose-600 bg-rose-50",
    },
    {
      id: 3,
      user: "Lê Văn C",
      action: "loyalty.activities.reviewed",
      amount: `+50 ${t("loyalty.activities.points")}`,
      type: "review",
      time: `1 ${t("common.hoursAgo")}`,
      icon: Star,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: 4,
      user: "Phạm Thị D",
      action: "loyalty.activities.referred",
      amount: `+200 ${t("loyalty.activities.points")}`,
      type: "referral",
      time: `3 ${t("common.hoursAgo")}`,
      icon: UserPlus,
      color: "text-emerald-600 bg-emerald-50",
    },
  ]

  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Share2 className="h-6 w-6" />
          </div>
          {t("loyalty.activities.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-indigo-50/30 transition-all border border-transparent hover:border-indigo-100 group"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${activity.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <activity.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 tracking-tight">{activity.user}</p>
                  <p className="text-xs font-medium text-slate-500">
                    {t(activity.action)} • {activity.time}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={`font-black rounded-lg ${activity.amount.startsWith('+') ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-rose-600 border-rose-100 bg-rose-50'}`}>
                {activity.amount}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
