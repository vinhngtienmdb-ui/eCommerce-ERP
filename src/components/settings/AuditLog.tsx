import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Search, Filter, Download, History, User } from "lucide-react"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { format } from "date-fns"

export function AuditLog() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const q = query(
      collection(db, "audit_logs"),
      orderBy("timestamp", "desc"),
      limit(50)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setLogs(logData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              {t("settings.audit.title")}
            </CardTitle>
            <CardDescription>
              {t("settings.audit.description")}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {t("common.export")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("common.search")} 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t("common.filter")}
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-bottom">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">{t("settings.audit.user")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("settings.audit.action")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("settings.audit.module")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("settings.audit.time")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("settings.audit.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      {t("common.loading")}...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      {t("settings.audit.noLogs")}
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{log.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{log.action}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal">{log.module}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {log.timestamp?.toDate ? format(log.timestamp.toDate(), "yyyy-MM-dd HH:mm:ss") : "---"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={
                            log.status === "success" ? "default" : 
                            log.status === "warning" ? "secondary" : "destructive"
                          }
                        >
                          {log.status || 'success'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredLogs.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {t("settings.audit.showingEntries", { count: filteredLogs.length })}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>{t("common.previous")}</Button>
                <Button variant="outline" size="sm" disabled>{t("common.next")}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
