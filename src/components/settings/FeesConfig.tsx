import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Percent, DollarSign } from "lucide-react"
import { initialOtherFees, type OtherFee } from "@/src/data/fees"

function SimpleSwitch({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
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

export function FeesConfig() {
  const { t } = useTranslation()
  const [otherFees, setOtherFees] = useState<OtherFee[]>(initialOtherFees)

  const handleOtherFeeChange = (id: string, field: keyof OtherFee, value: any) => {
    setOtherFees(fees => fees.map(fee => 
      fee.id === id ? { ...fee, [field]: value } : fee
    ))
  }

  return (
    <div className="space-y-8">
      {/* Other Fees Section */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{t("settings.fees.otherFees")}</h3>
          <p className="text-sm text-muted-foreground">{t("settings.fees.otherFeesDesc")}</p>
        </div>
        <div className="p-6">
          <div className="grid gap-6">
            {otherFees.map(fee => (
              <div key={fee.id} className={`flex items-center justify-between gap-4 p-4 border rounded-lg transition-colors ${fee.enabled ? 'bg-card' : 'bg-muted/50 opacity-75'}`}>
                <div className="flex-1 flex items-start gap-4">
                  <div className="pt-1">
                    <SimpleSwitch 
                      checked={fee.enabled} 
                      onChange={(checked) => handleOtherFeeChange(fee.id, 'enabled', checked)} 
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium">{t(`settings.fees.${fee.nameKey}`)}</Label>
                    {fee.descriptionKey && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`settings.fees.${fee.descriptionKey}`)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md overflow-hidden h-10">
                    <button
                      className={`px-3 py-2 text-sm font-medium transition-colors ${fee.type === 'percentage' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      onClick={() => handleOtherFeeChange(fee.id, 'type', 'percentage')}
                      disabled={!fee.enabled}
                    >
                      <Percent className="h-4 w-4" />
                    </button>
                    <button
                      className={`px-3 py-2 text-sm font-medium transition-colors ${fee.type === 'fixed' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      onClick={() => handleOtherFeeChange(fee.id, 'type', 'fixed')}
                      disabled={!fee.enabled}
                    >
                      <DollarSign className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="relative w-32">
                    <Input 
                      type="number" 
                      value={fee.value}
                      onChange={(e) => handleOtherFeeChange(fee.id, 'value', parseFloat(e.target.value) || 0)}
                      className="pr-8 text-right"
                      disabled={!fee.enabled}
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                      {fee.type === 'percentage' ? '%' : 'đ'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button>{t("settings.fees.saveChanges")}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
