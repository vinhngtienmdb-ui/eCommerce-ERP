import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { disputes } from "@/src/constants/legalData"

export function LegalDispute() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Active Disputes</CardTitle>
          <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
            View All Reports
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Accused</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs text-slate-500">{dispute.id}</TableCell>
                  <TableCell className="font-medium">{dispute.type}</TableCell>
                  <TableCell>{dispute.reporter}</TableCell>
                  <TableCell>{dispute.accused}</TableCell>
                  <TableCell>
                    <Badge variant={dispute.status === 'resolved' ? 'default' : 'secondary'} className="rounded-full">
                      {dispute.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">View Details</Button>
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
