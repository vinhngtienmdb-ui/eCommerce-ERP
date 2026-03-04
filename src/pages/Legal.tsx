import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react"

export function Legal() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("brandPortal")

  const brands = [
    { id: "BR-001", name: "Nike", owner: "Nike Inc.", status: "approved", docs: "3 files" },
    { id: "BR-002", name: "Adidas", owner: "Adidas AG", status: "pending", docs: "2 files" },
  ]

  const disputes = [
    { id: "DSP-1023", type: t("legal.dispute.counterfeit"), reporter: "Nike Inc.", accused: "Shop Giày Thể Thao", status: "investigating" },
    { id: "DSP-1024", type: t("legal.dispute.ipViolation"), reporter: "Apple", accused: "Phụ Kiện Giá Rẻ", status: "resolved" },
  ]

  const compliance = [
    { id: "POL-01", policy: t("legal.compliance.dataPrivacy"), rate: "0.5%", lastAudit: "2026-02-28", status: "compliant" },
    { id: "POL-02", policy: t("legal.compliance.ecommerceLaw"), rate: "1.2%", lastAudit: "2026-03-01", status: "warning" },
  ]

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="brandPortal">{t("legal.tabs.brandPortal")}</TabsTrigger>
          <TabsTrigger value="dispute">{t("legal.tabs.dispute")}</TabsTrigger>
          <TabsTrigger value="compliance">{t("legal.tabs.compliance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="brandPortal" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("legal.tabs.brandPortal")}</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("legal.brandPortal.register")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("common.search")} className="pl-8" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("legal.brandPortal.brandName")}</TableHead>
                    <TableHead>{t("legal.brandPortal.owner")}</TableHead>
                    <TableHead>{t("legal.brandPortal.documents")}</TableHead>
                    <TableHead>{t("legal.brandPortal.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell>{brand.owner}</TableCell>
                      <TableCell>{brand.docs}</TableCell>
                      <TableCell>
                        <Badge variant={brand.status === 'approved' ? 'default' : 'secondary'}>
                          {brand.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">{t("common.viewDetails")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("legal.tabs.dispute")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("legal.dispute.caseId")}</TableHead>
                    <TableHead>{t("legal.dispute.type")}</TableHead>
                    <TableHead>{t("legal.dispute.reporter")}</TableHead>
                    <TableHead>{t("legal.dispute.accused")}</TableHead>
                    <TableHead>{t("legal.dispute.status")}</TableHead>
                    <TableHead className="text-right">{t("legal.dispute.action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">{dispute.id}</TableCell>
                      <TableCell>{dispute.type}</TableCell>
                      <TableCell>{dispute.reporter}</TableCell>
                      <TableCell>{dispute.accused}</TableCell>
                      <TableCell>
                        <Badge variant={dispute.status === 'resolved' ? 'default' : 'destructive'}>
                          {dispute.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">{t("common.viewDetails")}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Compliance Score</CardTitle>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">98.5%</div>
                <p className="text-xs text-muted-foreground">Excellent standing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">12</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Audits</CardTitle>
                <FileCheck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("legal.tabs.compliance")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("legal.compliance.policy")}</TableHead>
                    <TableHead>{t("legal.compliance.violationRate")}</TableHead>
                    <TableHead>{t("legal.compliance.lastAudit")}</TableHead>
                    <TableHead>{t("legal.compliance.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compliance.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.policy}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                      <TableCell>{item.lastAudit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.status === 'compliant' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                          <span className={item.status === 'compliant' ? 'text-emerald-600' : 'text-amber-600'}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
