import { useTranslation } from "react-i18next"
import { Booking } from "@/src/components/admin-workspace/Booking"

export function BookingPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("adminWorkspace.tabs.booking")}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("adminWorkspace.description")}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <Booking />
      </div>
    </div>
  )
}
