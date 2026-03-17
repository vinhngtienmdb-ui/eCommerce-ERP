import React from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  ShieldCheck, 
  AlertCircle, 
  Search,
  Navigation,
  BarChart3,
  ArrowUpRight,
  Filter,
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"

const Logistics = () => {
  const { t } = useTranslation()

  const shipments = [
    { id: "SHP-001", customer: "Nguyen Van A", carrier: "GHTK", status: "In Transit", eta: "Today, 4 PM", location: "Hanoi Hub" },
    { id: "SHP-002", customer: "Tran Thi B", carrier: "GHN", status: "Delivered", eta: "Completed", location: "District 1, HCMC" },
    { id: "SHP-003", customer: "Le Van C", carrier: "Shopee Express", status: "Pending", eta: "Tomorrow", location: "Warehouse" },
    { id: "SHP-004", customer: "Pham Thi D", carrier: "J&T", status: "Delayed", eta: "Mar 18", location: "Da Nang Sorting" },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Logistics Control Tower</h1>
              <p className="text-slate-500 text-sm">Real-time supply chain visibility & optimization.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Optimize Routes</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Active Shipments</p>
                <p className="text-2xl font-bold text-slate-900">1,248</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">On-Time Rate</p>
                <p className="text-2xl font-bold text-slate-900">96.4%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Avg. Delivery Time</p>
                <p className="text-2xl font-bold text-slate-900">1.8 Days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Delayed Orders</p>
                <p className="text-2xl font-bold text-slate-900">14</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Map/Tracking Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Live Tracking Map</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">842 Moving</Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-100">406 Idle</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] bg-slate-100 relative flex items-center justify-center overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover" />
                  <div className="relative z-10 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white animate-pulse">
                        <Navigation className="h-8 w-8" />
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium">Interactive Map View Loading...</p>
                  </div>
                  
                  {/* Floating Tracking Card */}
                  <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white p-4 rounded-xl shadow-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Active Route</span>
                      <Badge className="bg-blue-100 text-blue-700 border-none">Fastest</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                        <p className="text-sm font-medium text-slate-900">Warehouse A (Hanoi)</p>
                      </div>
                      <div className="ml-1 w-0.5 h-6 bg-slate-100" />
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        <p className="text-sm font-medium text-slate-900">Customer (District 7, HCMC)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Shipment Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-mono text-xs font-bold">{shipment.id}</TableCell>
                        <TableCell className="text-sm">{shipment.customer}</TableCell>
                        <TableCell className="text-sm">{shipment.carrier}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={
                              shipment.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                              shipment.status === "Delayed" ? "bg-red-50 text-red-700" :
                              "bg-blue-50 text-blue-700"
                            }
                          >
                            {shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">{shipment.eta}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-400">AI Optimization Insight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">Cost Saving Opportunity</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Switching 40% of Hanoi-HCMC routes to GHN could save <span className="text-white font-bold">$1,200/month</span> based on current volume.
                  </p>
                  <Button size="sm" variant="link" className="text-emerald-400 p-0 h-auto">Apply Optimization <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-orange-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">Weather Alert</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Heavy rain in Da Nang may delay 15 shipments by 4-6 hours. Automatic customer notifications sent.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Carrier Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "GHTK", score: 98, color: "bg-emerald-500" },
                  { name: "GHN", score: 92, color: "bg-blue-500" },
                  { name: "J&T", score: 85, color: "bg-orange-500" },
                ].map((carrier) => (
                  <div key={carrier.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{carrier.name}</span>
                      <span>{carrier.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${carrier.color}`} style={{ width: `${carrier.score}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logistics
