import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { CreditCard, Truck, Settings2, Loader2, Key, Eye, EyeOff } from "lucide-react"
import { useSettingsStore } from "@/src/store/useSettingsStore"
import { toast } from "sonner"

const AVAILABLE_GATEWAYS = [
  { id: "stripe", name: "Stripe", fields: ["publicKey", "secretKey"] },
  { id: "paypal", name: "PayPal", fields: ["clientId", "clientSecret"] },
  { id: "vnpay", name: "VNPay", fields: ["tmnCode", "hashSecret"] },
  { id: "momo", name: "MoMo", fields: ["partnerCode", "accessKey", "secretKey"] },
  { id: "zalopay", name: "ZaloPay", fields: ["appId", "key1", "key2"] },
]

const shippingProviders = [
  { id: "ghtk", name: "Giao Hàng Tiết Kiệm", status: "connected" },
  { id: "ghn", name: "Giao Hàng Nhanh", status: "connected" },
  { id: "viettel", name: "Viettel Post", status: "connected" },
  { id: "jnt", name: "J&T Express", status: "disconnected" },
  { id: "ninja", name: "Ninja Van", status: "disconnected" },
  { id: "dealtot", name: "Dealtot Express", status: "disconnected" },
]

export function PaymentShippingConfig() {
  const { t } = useTranslation()
  const { settings, updateSettings } = useSettingsStore()
  const [isConfiguring, setIsConfiguring] = useState<string | null>(null)
  const [configData, setConfigData] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const paymentSettings = settings?.paymentGateways || {}

  const handleConfigure = (gatewayId: string) => {
    setIsConfiguring(gatewayId)
    setConfigData(paymentSettings[gatewayId] || {})
    setShowSecrets({})
  }

  const handleSaveConfig = async () => {
    if (!isConfiguring) return
    
    setIsSaving(true)
    try {
      await updateSettings(`paymentGateways.${isConfiguring}`, {
        ...configData,
        status: Object.values(configData).some(v => v) ? 'connected' : 'disconnected'
      })
      toast.success(t("settings.paymentShipping.saveSuccess", "Configuration saved successfully"))
      setIsConfiguring(null)
    } catch (error) {
      toast.error(t("settings.paymentShipping.saveError", "Failed to save configuration"))
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const activeGateway = AVAILABLE_GATEWAYS.find(g => g.id === isConfiguring)

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
              <h4 className="font-medium">{t("settings.paymentShipping.paymentGateways", "Payment Gateways")}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_GATEWAYS.map(gateway => {
                const isConnected = paymentSettings[gateway.id]?.status === 'connected'
                return (
                  <div key={gateway.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{gateway.name}</span>
                      <Badge variant={isConnected ? 'default' : 'secondary'} className="w-fit text-[10px]">
                        {isConnected ? t("settings.paymentShipping.connected", "Connected") : t("settings.paymentShipping.disconnected", "Disconnected")}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleConfigure(gateway.id)}>
                      <Settings2 className="h-4 w-4" />
                      {t("settings.paymentShipping.configure", "Configure")}
                    </Button>
                  </div>
                )
              })}
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

      <Dialog open={!!isConfiguring} onOpenChange={(open) => !open && setIsConfiguring(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("settings.paymentShipping.configureGateway", "Configure {{gateway}}", { gateway: activeGateway?.name })}</DialogTitle>
            <DialogDescription>
              {t("settings.paymentShipping.configureDescription", "Enter your API keys and credentials for this payment gateway. These will be stored securely.")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeGateway?.fields.map(field => {
              const isSecret = field.toLowerCase().includes('secret') || field.toLowerCase().includes('key')
              return (
                <div key={field} className="grid gap-2">
                  <Label htmlFor={field} className="capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field}
                      type={isSecret && !showSecrets[field] ? "password" : "text"}
                      value={configData[field] || ""}
                      onChange={(e) => setConfigData({ ...configData, [field]: e.target.value })}
                      className={isSecret ? "pr-10" : ""}
                      placeholder={`Enter ${field}`}
                    />
                    {isSecret && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => toggleSecretVisibility(field)}
                      >
                        {showSecrets[field] ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfiguring(null)}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleSaveConfig} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.save", "Save Changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
