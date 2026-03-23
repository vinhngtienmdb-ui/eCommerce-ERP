import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { compliance, risks } from "@/src/constants/legalData"

export function LegalCompliance() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader><CardTitle className="text-sm font-medium text-slate-500">System Score</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-indigo-600">98.5%</div></CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Active Violations</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-rose-600">3</div></CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader><CardTitle className="text-sm font-medium text-slate-500">Recent Audits</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-900">12</div></CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Compliance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Policy</TableHead>
                <TableHead>Violation Rate</TableHead>
                <TableHead>Last Audit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compliance.map((comp) => (
                <TableRow key={comp.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{comp.policy}</TableCell>
                  <TableCell>{comp.rate}</TableCell>
                  <TableCell>{comp.lastAudit}</TableCell>
                  <TableCell>
                    <Badge variant={comp.status === 'compliant' ? 'default' : 'destructive'} className="rounded-full">
                      {comp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
