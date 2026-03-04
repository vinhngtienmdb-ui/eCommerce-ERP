import { useTranslation } from "react-i18next"
import { Stationery } from "@/src/components/admin-workspace/Stationery"

export function StationeryPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("adminWorkspace.tabs.stationery")}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("adminWorkspace.description")}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <Stationery />
      </div>
    </div>
  )
}
