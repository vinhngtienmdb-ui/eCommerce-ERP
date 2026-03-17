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
import { Plus, Key, Link as LinkIcon, Copy, Trash2, Edit } from "lucide-react"

const mockApiKeys = [
  { id: "1", name: "ERP Integration - SAP", key: "sk_live_51Nx...89kl", createdAt: "2023-10-15", lastUsed: "2023-10-26 14:30", status: "active" },
  { id: "2", name: "CRM Sync - Salesforce", key: "sk_live_22Ab...11xz", createdAt: "2023-09-01", lastUsed: "2023-10-25 09:15", status: "active" },
  { id: "3", name: "Old Inventory Sync", key: "sk_live_99Xx...00yy", createdAt: "2022-05-10", lastUsed: "2023-01-10 11:00", status: "inactive" },
]

const mockWebhooks = [
  { id: "1", url: "https://api.brand-erp.com/webhooks/orders", events: ["order.created", "order.updated"], status: "active" },
  { id: "2", url: "https://sync.salesforce.com/v1/shopee/hook", events: ["customer.created"], status: "active" },
  { id: "3", url: "https://test.webhook.site/12345", events: ["product.updated"], status: "inactive" },
]

export function IntegrationConfig() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* API Keys Section */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">{t("settings.integrations.apiKeys")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.integrations.description")}</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("settings.integrations.createApiKey")}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("settings.integrations.keyName")}</TableHead>
                <TableHead>{t("settings.integrations.keyString")}</TableHead>
                <TableHead>{t("settings.integrations.createdDate")}</TableHead>
                <TableHead>{t("settings.integrations.lastUsed")}</TableHead>
                <TableHead>{t("settings.integrations.status")}</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApiKeys.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">{item.key}</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.createdAt}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lastUsed}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status === 'active' ? t("settings.integrations.active") : t("settings.integrations.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">{t("settings.integrations.webhooks")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.integrations.webhooksDesc")}</p>
            </div>
          </div>
          <Button className="gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            {t("settings.integrations.addWebhook")}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("settings.integrations.endpointUrl")}</TableHead>
                <TableHead>{t("settings.integrations.events")}</TableHead>
                <TableHead>{t("settings.integrations.status")}</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWebhooks.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[300px] truncate" title={item.url}>
                    {item.url}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.events.map(ev => (
                        <Badge key={ev} variant="outline" className="text-xs font-normal bg-muted/50">
                          {ev}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status === 'active' ? t("settings.integrations.active") : t("settings.integrations.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
