import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Download, FileText } from "lucide-react"

interface PayrollPeriod {
  id: string
  period: string
  count: number
  amount: string
  status: "Draft" | "Completed" | "Processing"
}

interface SalaryConfig {
  id: string
  empName: string
  basic: string
  allowance: string
  deduction: string
  net: string
}

export function Payroll() {
  const { t } = useTranslation()

  const [payrolls, setPayrolls] = useState<PayrollPeriod[]>([
    { id: "PR-2023-10", period: "October 2023", count: 1230, amount: "15,400,000,000 ₫", status: "Completed" },
    { id: "PR-2023-11", period: "November 2023", count: 1234, amount: "15,600,000,000 ₫", status: "Draft" },
  ])

  const [salaries] = useState<SalaryConfig[]>([
    { id: "SAL-001", empName: "Nguyen Van A", basic: "25,000,000", allowance: "2,000,000", deduction: "1,500,000", net: "25,500,000" },
    { id: "SAL-002", empName: "Tran Thi B", basic: "30,000,000", allowance: "3,000,000", deduction: "2,000,000", net: "31,000,000" },
  ])

  const handleRunPayroll = (id: string) => {
    setPayrolls(payrolls.map(p => 
      p.id === id ? { ...p, status: "Processing" } : p
    ))
    // Simulate processing
    setTimeout(() => {
      setPayrolls(payrolls.map(p => 
        p.id === id ? { ...p, status: "Completed" } : p
      ))
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("hr.tabs.payroll")}</h1>
          <p className="text-muted-foreground">{t("hr.payroll.description")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("hr.payroll.title")}</CardTitle>
          <CardDescription>{t("hr.payroll.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="space-x-2">
              <Button>{t("hr.payroll.runPayroll")}</Button>
              <Button variant="outline">{t("hr.payroll.configFormulas")}</Button>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("hr.payroll.exportReport")}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("hr.payroll.period")}</TableHead>
                <TableHead>{t("hr.payroll.totalEmployees")}</TableHead>
                <TableHead>{t("hr.payroll.totalAmount")}</TableHead>
                <TableHead>{t("hr.payroll.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Completed" ? "default" : item.status === "Processing" ? "outline" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === "Draft" ? (
                      <Button size="sm" onClick={() => handleRunPayroll(item.id)}>
                        {t("hr.payroll.runPayroll")}
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        {t("hr.payroll.payslips")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("hr.payroll.salaryStructure")}</CardTitle>
          <CardDescription>Employee salary configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("hr.core.name")}</TableHead>
                <TableHead>{t("hr.payroll.basicSalary")}</TableHead>
                <TableHead>{t("hr.payroll.allowances")}</TableHead>
                <TableHead>{t("hr.payroll.deductions")}</TableHead>
                <TableHead>{t("hr.payroll.netSalary")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.empName}</TableCell>
                  <TableCell>{item.basic} ₫</TableCell>
                  <TableCell className="text-green-600">+{item.allowance} ₫</TableCell>
                  <TableCell className="text-red-600">-{item.deduction} ₫</TableCell>
                  <TableCell className="font-bold">{item.net} ₫</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
