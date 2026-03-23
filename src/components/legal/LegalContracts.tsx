import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { contracts } from "@/src/constants/legalData"

export function LegalContracts() {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Active Contracts</CardTitle>
        <Button className="bg-indigo-600 hover:bg-indigo-700">New Contract</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Contract ID</TableHead>
              <TableHead>Party A</TableHead>
              <TableHead>Party B</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs text-slate-500">{contract.id}</TableCell>
                <TableCell>{contract.partyA}</TableCell>
                <TableCell>{contract.partyB}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>
                  <Badge variant={contract.status === 'signed' ? 'default' : 'secondary'} className="rounded-full">
                    {contract.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
