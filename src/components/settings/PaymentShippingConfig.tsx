import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { CreditCard, Truck, Settings2 } from "lucide-react"

const paymentGateways = [
  { id: "vnpay", name: "VNPay", status: "connected" },
  { id: "momo", name: "MoMo", status: "connected" },
  { id: "zalopay", name: "ZaloPay", status: "disconnected" },
  { id: "bidv", name: "BIDV", status: "disconnected" },
  { id: "napas", name: "Napas", status: "disconnected" },
  { id: "gpay", name: "Gpay", status: "disconnected" },
]

const shippingProviders = [
  { id: "ghtk", name: "Giao Hàng Tiết Kiệm", status: "connected" },
  { id: "ghn", name: "Giao Hàng Nhanh", status: "connected" },
  { id: "viettel", name: "Viettel Post", status: "connected" },
  { id: "jnt", name: "J&T Express", status: "disconnected" },
  { id: "ninja", name: "Ninja Van", status: "disconnected" },
  { id: "shopee", name: "Shopee Express", status: "disconnected" },
]

export function PaymentShippingConfig() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{t("settings.paymentShipping.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("settings.paymentShipping.description")}</p>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Payment Gateways */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <CreditCard className="h-5 w-5 text-primary" />
              <h4 className="font-medium">{t("settings.paymentShipping.paymentGateways")}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentGateways.map(gateway => (
                <div key={gateway.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{gateway.name}</span>
                    <Badge variant={gateway.status === 'connected' ? 'default' : 'secondary'} className="w-fit text-[10px]">
                      {gateway.status === 'connected' ? t("settings.paymentShipping.connected") : t("settings.paymentShipping.disconnected")}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    {t("settings.paymentShipping.configure")}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Providers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Truck className="h-5 w-5 text-primary" />
              <h4 className="font-medium">{t("settings.paymentShipping.shippingProviders")}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shippingProviders.map(provider => (
                <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{provider.name}</span>
                    <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'} className="w-fit text-[10px]">
                      {provider.status === 'connected' ? t("settings.paymentShipping.connected") : t("settings.paymentShipping.disconnected")}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    {t("settings.paymentShipping.configure")}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
