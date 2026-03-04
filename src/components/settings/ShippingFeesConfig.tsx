import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Truck, Save } from "lucide-react"

const initialCarrierFees = [
  { id: "ghtk", name: "Giao Hàng Tiết Kiệm (GHTK)", baseFee: 15000, weightFee: 5000, codFee: 0 },
  { id: "ghn", name: "Giao Hàng Nhanh (GHN)", baseFee: 18000, weightFee: 4500, codFee: 2000 },
  { id: "viettel", name: "Viettel Post", baseFee: 20000, weightFee: 4000, codFee: 0 },
  { id: "jt", name: "J&T Express", baseFee: 12000, weightFee: 6000, codFee: 1000 },
]

export function ShippingFeesConfig() {
  const { t } = useTranslation()
  const [carrierFees, setCarrierFees] = useState(initialCarrierFees)

  const handleFeeChange = (id: string, field: string, value: number) => {
    setCarrierFees(prev => prev.map(carrier => 
      carrier.id === id ? { ...carrier, [field]: value } : carrier
    ))
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold">{t("settings.fees.shippingFees")}</h3>
        <p className="text-sm text-muted-foreground">{t("settings.fees.shippingFeesDesc")}</p>
      </div>

      <div className="grid gap-6">
        {carrierFees.map((carrier) => (
          <Card key={carrier.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{carrier.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-xs">{t("settings.fees.baseFee")}</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={carrier.baseFee} 
                      onChange={(e) => handleFeeChange(carrier.id, 'baseFee', parseInt(e.target.value) || 0)}
                      className="pr-10" 
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">đ</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("settings.fees.weightFee")}</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={carrier.weightFee} 
                      onChange={(e) => handleFeeChange(carrier.id, 'weightFee', parseInt(e.target.value) || 0)}
                      className="pr-10" 
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">đ</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("settings.fees.codFee")}</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={carrier.codFee} 
                      onChange={(e) => handleFeeChange(carrier.id, 'codFee', parseInt(e.target.value) || 0)}
                      className="pr-10" 
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">đ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          {t("settings.fees.saveChanges")}
        </Button>
      </div>
    </div>
  )
}
