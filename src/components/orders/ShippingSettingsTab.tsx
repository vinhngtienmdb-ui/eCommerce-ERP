import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Plus, Globe, ShieldCheck, Trash2 } from "lucide-react"

export function ShippingSettingsTab() {
  const { t } = useTranslation()
  const [gateways] = useState([
    { id: "ghtk", name: "Giao Hàng Tiết Kiệm (GHTK)", status: "connected", logo: "https://picsum.photos/seed/ghtk/40/40" },
    { id: "ghn", name: "Giao Hàng Nhanh (GHN)", status: "connected", logo: "https://picsum.photos/seed/ghn/40/40" },
    { id: "viettel", name: "Viettel Post", status: "disconnected", logo: "https://picsum.photos/seed/viettel/40/40" },
    { id: "jt", name: "J&T Express", status: "disconnected", logo: "https://picsum.photos/seed/jt/40/40" },
    { id: "ninja", name: "Ninja Van", status: "disconnected", logo: "https://picsum.photos/seed/ninja/40/40" },
    { id: "shopee", name: "Shopee Express", status: "disconnected", logo: "https://picsum.photos/seed/shopee/40/40" },
  ])

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-xl font-bold">{t("orders.settings.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("orders.settings.description")}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
            {t("orders.settings.gateways")}
          </h4>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            {t("orders.settings.addCarrier")}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gateways.map((gateway) => (
            <Card key={gateway.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={gateway.logo} 
                      alt={gateway.name} 
                      className="h-8 w-8 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <CardTitle className="text-sm font-bold">{gateway.name}</CardTitle>
                  </div>
                  <Badge variant={gateway.status === "connected" ? "default" : "outline"} className="text-[10px] h-5">
                    {gateway.status === "connected" ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-[10px] text-muted-foreground mb-4">
                  API Integration for automatic labels and tracking.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                    {t("orders.settings.configure")}
                  </Button>
                  {gateway.status === "connected" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-6 bg-muted/20">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h4 className="font-bold">{t("orders.settings.testConnection")}</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Verify your API credentials and connection to the shipping provider's sandbox or production environment.
        </p>
        <Button variant="outline">{t("orders.settings.testConnection")}</Button>
      </div>
    </div>
  )
}
