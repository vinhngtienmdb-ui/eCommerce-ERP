import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Plus } from "lucide-react"

const modules = [
  "products",
  "orders",
  "sellers",
  "marketing",
  "finance",
  "settings"
]

const initialRoles = [
  { id: "admin", name: "Super Administrator" },
  { id: "manager", name: "Store Manager" },
  { id: "support", name: "Customer Support" },
  { id: "marketing", name: "Marketing Specialist" },
]

export function RoleMatrixConfig() {
  const { t } = useTranslation()
  const [selectedRole, setSelectedRole] = useState("admin")
  
  // Mock state for permissions: { roleId: { moduleName: { view: true, create: false... } } }
  const [permissions, setPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>({
    admin: modules.reduce((acc, mod) => ({ ...acc, [mod]: { view: true, create: true, edit: true, delete: true, approve: true } }), {}),
    manager: modules.reduce((acc, mod) => ({ ...acc, [mod]: { view: true, create: true, edit: true, delete: false, approve: true } }), {}),
    support: modules.reduce((acc, mod) => ({ ...acc, [mod]: { view: true, create: false, edit: false, delete: false, approve: false } }), {}),
    marketing: modules.reduce((acc, mod) => ({ ...acc, [mod]: { view: true, create: false, edit: false, delete: false, approve: false } }), {}),
  })

  const handlePermissionChange = (module: string, action: string) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [module]: {
          ...prev[selectedRole]?.[module],
          [action]: !prev[selectedRole]?.[module]?.[action]
        }
      }
    }))
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{t("settings.roles.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.roles.description")}</p>
          </div>
          <Button className="gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            {t("settings.roles.addRole")}
          </Button>
        </div>
        
        <div className="p-6 border-b bg-muted/20">
          <div className="flex flex-wrap gap-2">
            {initialRoles.map(role => (
              <Button
                key={role.id}
                variant={selectedRole === role.id ? "default" : "outline"}
                onClick={() => setSelectedRole(role.id)}
                className="rounded-full"
              >
                {role.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{t("settings.roles.module")}</TableHead>
                <TableHead className="text-center">{t("settings.roles.view")}</TableHead>
                <TableHead className="text-center">{t("settings.roles.create")}</TableHead>
                <TableHead className="text-center">{t("settings.roles.edit")}</TableHead>
                <TableHead className="text-center">{t("settings.roles.delete")}</TableHead>
                <TableHead className="text-center">{t("settings.roles.approve")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((mod) => (
                <TableRow key={mod}>
                  <TableCell className="font-medium">{t(`settings.roles.modules.${mod}`)}</TableCell>
                  {['view', 'create', 'edit', 'delete', 'approve'].map(action => (
                    <TableCell key={action} className="text-center">
                      <div className="flex justify-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={permissions[selectedRole]?.[mod]?.[action] || false}
                          onChange={() => handlePermissionChange(mod, action)}
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t flex justify-end">
          <Button>{t("settings.general.save")}</Button>
        </div>
      </div>
    </div>
  )
}
