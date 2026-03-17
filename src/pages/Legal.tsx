import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
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
  XCircle,
  FileText,
  Gavel,
  Users,
  FileSignature,
  History,
  AlertOctagon,
  Scale,
  Copyright
} from "lucide-react"

export function Legal() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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

  const contracts = [
    { id: "CTR-2024-001", partyA: "Platform Inc.", partyB: "Supplier X", type: "Supply Agreement", effectiveDate: "2024-01-01", expiryDate: "2025-01-01", status: "signed" },
    { id: "CTR-2024-002", partyA: "Platform Inc.", partyB: "Logistics Y", type: "Service Level Agreement", effectiveDate: "2024-02-15", expiryDate: "2026-02-15", status: "pending" },
  ]

  const trademarks = [
    { id: "TM-001", name: "SuperBrand", type: "Logo", status: "Registered", expiry: "2030-05-20" },
    { id: "TM-002", name: "MegaStore", type: "Wordmark", status: "Pending", expiry: "-" },
  ]

  const distributors = [
    { id: "DIST-001", name: "Alpha Distribution", region: "North", status: "Authorized", contractEnd: "2025-12-31" },
    { id: "DIST-002", name: "Beta Retail", region: "South", status: "Probation", contractEnd: "2024-06-30" },
  ]

  const risks = [
    { id: "RISK-001", category: t("legal.compliance.dataPrivacy"), description: "Potential GDPR violation in user data export", severity: "High", status: "Open" },
    { id: "RISK-002", category: t("legal.compliance.ipViolation"), description: "Unlicensed use of image assets", severity: "Medium", status: "Mitigated" },
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
          <TabsTrigger value="contracts">{t("legal.tabs.contracts")}</TabsTrigger>
        </TabsList>

        <TabsContent value="brandPortal" className="space-y-4">
          <Tabs defaultValue="trademarks" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="trademarks">{t("legal.brandPortal.register")}</TabsTrigger>
              <TabsTrigger value="ipProtection">{t("legal.brandPortal.ipProtection")}</TabsTrigger>
              <TabsTrigger value="distributors">{t("legal.brandPortal.authorizedDistributors")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trademarks" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t("legal.brandPortal.register")}</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("legal.brandPortal.register")}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("legal.brandPortal.brandName")}</TableHead>
                        <TableHead>{t("legal.brandPortal.type")}</TableHead>
                        <TableHead>{t("legal.brandPortal.status")}</TableHead>
                        <TableHead>{t("legal.brandPortal.expiry")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trademarks.map((tm) => (
                        <TableRow key={tm.id}>
                          <TableCell>{tm.id}</TableCell>
                          <TableCell className="font-medium">{tm.name}</TableCell>
                          <TableCell>{tm.type}</TableCell>
                          <TableCell>
                            <Badge variant={tm.status === 'Registered' ? 'default' : 'secondary'}>
                              {tm.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{tm.expiry}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ipProtection" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("legal.brandPortal.ipProtection")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <ShieldCheck className="h-12 w-12 mb-4 opacity-20" />
                    <p>{t("legal.brandPortal.dashboardComingSoon")}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distributors" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("legal.brandPortal.authorizedDistributors")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("legal.brandPortal.distributorName")}</TableHead>
                        <TableHead>{t("legal.brandPortal.region")}</TableHead>
                        <TableHead>{t("legal.brandPortal.status")}</TableHead>
                        <TableHead>{t("legal.brandPortal.contractEnd")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributors.map((dist) => (
                        <TableRow key={dist.id}>
                          <TableCell>{dist.id}</TableCell>
                          <TableCell className="font-medium">{dist.name}</TableCell>
                          <TableCell>{dist.region}</TableCell>
                          <TableCell>
                            <Badge variant={dist.status === 'Authorized' ? 'default' : 'outline'}>
                              {dist.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{dist.contractEnd}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="dispute" className="space-y-4">
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="reports">{t("legal.dispute.type")}</TabsTrigger>
              <TabsTrigger value="mediation">{t("legal.dispute.mediation")}</TabsTrigger>
              <TabsTrigger value="evidence">{t("legal.dispute.evidence")}</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-4">
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

            <TabsContent value="mediation" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("legal.dispute.mediation")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <Scale className="h-12 w-12 mb-4 opacity-20" />
                    <p>{t("legal.dispute.mediationComingSoon")}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

             <TabsContent value="evidence" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("legal.dispute.evidence")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4 opacity-20" />
                    <p>{t("legal.dispute.evidenceComingSoon")}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Tabs defaultValue="policies" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="policies">{t("legal.compliance.policy")}</TabsTrigger>
              <TabsTrigger value="auditLogs">{t("legal.compliance.auditLogs")}</TabsTrigger>
              <TabsTrigger value="riskAssessment">{t("legal.compliance.riskAssessment")}</TabsTrigger>
            </TabsList>

            <TabsContent value="policies" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("legal.compliance.systemScore")}</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">98.5%</div>
                    <p className="text-xs text-muted-foreground">{t("legal.compliance.excellentStanding")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("legal.compliance.activeViolations")}</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">12</div>
                    <p className="text-xs text-muted-foreground">{t("legal.compliance.requiresAttention")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("legal.compliance.recentAudits")}</CardTitle>
                    <FileCheck className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">4</div>
                    <p className="text-xs text-muted-foreground">{t("legal.compliance.thisMonth")}</p>
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

            <TabsContent value="auditLogs" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("legal.compliance.auditLogs")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <History className="h-12 w-12 mb-4 opacity-20" />
                    <p>{t("legal.compliance.auditLogsComingSoon")}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="riskAssessment" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("legal.compliance.riskAssessment")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("legal.compliance.category")}</TableHead>
                        <TableHead>{t("legal.compliance.description")}</TableHead>
                        <TableHead>{t("legal.compliance.severity")}</TableHead>
                        <TableHead>{t("legal.compliance.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {risks.map((risk) => (
                        <TableRow key={risk.id}>
                          <TableCell className="font-medium">{risk.category}</TableCell>
                          <TableCell>{risk.description}</TableCell>
                          <TableCell>
                            <Badge variant={risk.severity === 'High' ? 'destructive' : 'secondary'}>
                              {risk.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{risk.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("legal.tabs.contracts")}</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("common.create")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("legal.contracts.contractId")}</TableHead>
                    <TableHead>{t("legal.contracts.partyB")}</TableHead>
                    <TableHead>{t("legal.contracts.type")}</TableHead>
                    <TableHead>{t("legal.contracts.effectiveDate")}</TableHead>
                    <TableHead>{t("legal.contracts.expiryDate")}</TableHead>
                    <TableHead>{t("legal.contracts.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>{contract.partyB}</TableCell>
                      <TableCell>{contract.type}</TableCell>
                      <TableCell>{contract.effectiveDate}</TableCell>
                      <TableCell>{contract.expiryDate}</TableCell>
                      <TableCell>
                        <Badge variant={contract.status === 'signed' ? 'default' : 'secondary'}>
                          {contract.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/e-contract")}>
                          <FileSignature className="h-4 w-4" />
                        </Button>
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
