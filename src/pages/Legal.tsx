import { useState } from "react"
import { useTranslation } from "react-i18next"
import { LegalAIAgent } from "@/src/components/legal/LegalAIAgent"
import { LegalBrandPortal } from "@/src/components/legal/LegalBrandPortal"
import { LegalDispute } from "@/src/components/legal/LegalDispute"
import { LegalCompliance } from "@/src/components/legal/LegalCompliance"
import { LegalContracts } from "@/src/components/legal/LegalContracts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

export default function Legal() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("aiAgent")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("legal.title")}</h1>
          <p className="text-muted-foreground">
            {t("legal.description")}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="aiAgent" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Trợ lý AI</TabsTrigger>
          <TabsTrigger value="brandPortal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t("legal.tabs.brandPortal")}</TabsTrigger>
          <TabsTrigger value="dispute" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t("legal.tabs.dispute")}</TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t("legal.tabs.compliance")}</TabsTrigger>
          <TabsTrigger value="contracts" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t("legal.tabs.contracts")}</TabsTrigger>
        </TabsList>

        <TabsContent value="aiAgent" className="space-y-6">
          <LegalAIAgent />
        </TabsContent>

        <TabsContent value="brandPortal" className="space-y-6">
          <LegalBrandPortal />
        </TabsContent>

        <TabsContent value="dispute" className="space-y-6">
          <LegalDispute />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <LegalCompliance />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <LegalContracts />
        </TabsContent>
      </Tabs>
    </div>
  )
}
