import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Plus, ShieldCheck } from "lucide-react"
import { trademarks, distributors } from "@/src/constants/legalData"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

export function LegalBrandPortal() {
  const { t } = useTranslation()
  return (
    <Tabs defaultValue="trademarks" className="w-full">
      <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none p-0 h-10">
        <TabsTrigger value="trademarks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent">{t("legal.brandPortal.register")}</TabsTrigger>
        <TabsTrigger value="ipProtection" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent">{t("legal.brandPortal.ipProtection")}</TabsTrigger>
        <TabsTrigger value="distributors" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent">{t("legal.brandPortal.authorizedDistributors")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trademarks" className="mt-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">{t("legal.brandPortal.register")}</CardTitle>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              {t("legal.brandPortal.register")}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>{t("legal.brandPortal.brandName")}</TableHead>
                  <TableHead>{t("legal.brandPortal.type")}</TableHead>
                  <TableHead>{t("legal.brandPortal.status")}</TableHead>
                  <TableHead>{t("legal.brandPortal.expiry")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trademarks.map((tm) => (
                  <TableRow key={tm.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs text-slate-500">{tm.id}</TableCell>
                    <TableCell className="font-medium">{tm.name}</TableCell>
                    <TableCell>{tm.type}</TableCell>
                    <TableCell>
                      <Badge variant={tm.status === 'Registered' ? 'default' : 'secondary'} className="rounded-full">
                        {tm.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{tm.expiry}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ipProtection" className="mt-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{t("legal.brandPortal.ipProtection")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
              <ShieldCheck className="h-12 w-12 mb-4 text-slate-300" />
              <p className="text-sm">{t("legal.brandPortal.dashboardComingSoon")}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="distributors" className="mt-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{t("legal.brandPortal.authorizedDistributors")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>{t("legal.brandPortal.distributorName")}</TableHead>
                  <TableHead>{t("legal.brandPortal.region")}</TableHead>
                  <TableHead>{t("legal.brandPortal.status")}</TableHead>
                  <TableHead>{t("legal.brandPortal.contractEnd")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributors.map((dist) => (
                  <TableRow key={dist.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs text-slate-500">{dist.id}</TableCell>
                    <TableCell className="font-medium">{dist.name}</TableCell>
                    <TableCell>{dist.region}</TableCell>
                    <TableCell>
                      <Badge variant={dist.status === 'Authorized' ? 'default' : 'outline'} className="rounded-full">
                        {dist.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{dist.contractEnd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
