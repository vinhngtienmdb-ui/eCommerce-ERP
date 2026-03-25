import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Search, Plus, FileText, Download, Edit, Trash2, History, ShieldCheck } from "lucide-react"
import { useDataStore, HRPolicy } from "@/src/store/useDataStore"
import { toast } from "sonner"
import { format } from "date-fns"

export function Policies() {
  const { t } = useTranslation()
  const { hrPolicies, addHRPolicy, updateHRPolicy } = useDataStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<HRPolicy | null>(null)
  const [newPolicy, setNewPolicy] = useState<Partial<HRPolicy>>({
    title: "",
    type: "Policy",
    content: "",
    version: "1.0",
    updatedAt: format(new Date(), "yyyy-MM-dd")
  })

  const handleSavePolicy = () => {
    if (!newPolicy.title || !newPolicy.type) {
      toast.error(t("hr.core.toasts.requiredFields"))
      return
    }

    if (editingPolicy) {
      updateHRPolicy(editingPolicy.id, newPolicy)
      toast.success(t("hr.policies.updateSuccess"))
    } else {
      const id = `POL-${(hrPolicies.length + 1).toString().padStart(3, '0')}`
      addHRPolicy({ ...newPolicy, id } as HRPolicy)
      toast.success(t("hr.policies.addSuccess"))
    }

    setIsModalOpen(false)
    setEditingPolicy(null)
    setNewPolicy({
      title: "",
      type: "Policy",
      content: "",
      version: "1.0",
      updatedAt: format(new Date(), "yyyy-MM-dd")
    })
  }

  const handleEdit = (policy: HRPolicy) => {
    setEditingPolicy(policy)
    setNewPolicy(policy)
    setIsModalOpen(true)
  }

  const filteredPolicies = hrPolicies.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.policies.title")}</h1>
          <p className="text-muted-foreground">{t("hr.policies.description")}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("hr.policies.add")}
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("hr.policies.tabs.all")}</TabsTrigger>
          <TabsTrigger value="regulations">{t("hr.policies.tabs.regulations")}</TabsTrigger>
          <TabsTrigger value="laborRules">{t("hr.policies.tabs.laborRules")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("hr.policies.listTitle")}</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t("common.search")} 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hr.policies.policyTitle")}</TableHead>
                    <TableHead>{t("hr.policies.type")}</TableHead>
                    <TableHead>{t("hr.policies.version")}</TableHead>
                    <TableHead>{t("hr.policies.updatedAt")}</TableHead>
                    <TableHead>{t("hr.core.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {policy.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`hr.policies.types.${policy.type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{policy.version}</TableCell>
                      <TableCell>{policy.updatedAt}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          {t("hr.policies.active")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(policy)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {hrPolicies.filter(p => p.type === "Regulation").map(policy => (
              <Card key={policy.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle>{policy.title}</CardTitle>
                  <CardDescription>{t("hr.policies.version")}: {policy.version} | {t("hr.policies.updatedAt")}: {policy.updatedAt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{policy.content}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{t("hr.policies.types.Regulation")}</Badge>
                    <Button variant="link" className="p-0 h-auto">{t("common.viewDetails")}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="laborRules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {hrPolicies.filter(p => p.type === "Labor Rule").map(policy => (
              <Card key={policy.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle>{policy.title}</CardTitle>
                  <CardDescription>{t("hr.policies.version")}: {policy.version} | {t("hr.policies.updatedAt")}: {policy.updatedAt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{policy.content}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{t("hr.policies.types.Labor Rule")}</Badge>
                    <Button variant="link" className="p-0 h-auto">{t("common.viewDetails")}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open)
        if (!open) {
          setEditingPolicy(null)
          setNewPolicy({
            title: "",
            type: "Policy",
            content: "",
            version: "1.0",
            updatedAt: format(new Date(), "yyyy-MM-dd")
          })
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? t("hr.policies.edit") : t("hr.policies.add")}</DialogTitle>
            <DialogDescription>{t("hr.policies.modalDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">{t("hr.policies.policyTitle")}</Label>
              <Input 
                id="title" 
                value={newPolicy.title} 
                onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">{t("hr.policies.type")}</Label>
              <Select value={newPolicy.type} onValueChange={(val: any) => setNewPolicy({...newPolicy, type: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("hr.policies.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regulation">{t("hr.policies.types.Regulation")}</SelectItem>
                  <SelectItem value="Labor Rule">{t("hr.policies.types.Labor Rule")}</SelectItem>
                  <SelectItem value="Policy">{t("hr.policies.types.Policy")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="version" className="text-right">{t("hr.policies.version")}</Label>
              <Input 
                id="version" 
                value={newPolicy.version} 
                onChange={(e) => setNewPolicy({...newPolicy, version: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">{t("hr.policies.content")}</Label>
              <textarea 
                id="content" 
                value={newPolicy.content} 
                onChange={(e) => setNewPolicy({...newPolicy, content: e.target.value})}
                className="col-span-3 min-h-[200px] p-2 rounded-md border border-input bg-background" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSavePolicy}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
