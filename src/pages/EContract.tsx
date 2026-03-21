import React, { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "motion/react"
import SignatureCanvas from 'react-signature-canvas'
import { 
  FileSignature, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Mail,
  History,
  Lock,
  PenTool,
  Check,
  Loader2,
  ShoppingCart,
  Truck
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { toast } from "sonner"

import { useDataStore } from "@/src/store/useDataStore"

const EContract = () => {
  const { t } = useTranslation()
  const { eContracts: contracts, addEContract } = useDataStore()
  const [isSigning, setIsSigning] = useState(false)
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [isAddContractOpen, setIsAddContractOpen] = useState(false)
  const [newContract, setNewContract] = useState({
    title: "",
    type: "Legal",
    party: "",
    security: "Standard"
  })
  const sigCanvas = useRef<any>(null)

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Please provide a signature")
      return
    }
    setIsSigning(true)
    setTimeout(() => {
      setIsSigning(false)
      toast.success("Contract signed successfully with Digital Certificate #E-9921-X")
      setSelectedContract(null)
    }, 2000)
  }

  const handleAddContract = () => {
    if (!newContract.title || !newContract.party) {
      toast.error("Please fill in all required fields")
      return
    }
    addEContract({
      id: `CTR-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: newContract.title,
      type: newContract.type,
      party: newContract.party,
      status: "pending_me",
      date: new Date().toISOString().split('T')[0],
      security: newContract.security
    })
    setIsAddContractOpen(false)
    setNewContract({ title: "", type: "Legal", party: "", security: "Standard" })
    toast.success("Contract added successfully")
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <Lock className="h-4 w-4" />
              <span className="uppercase tracking-widest text-[10px]">Secure Digital Signing</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">E-Contract <span className="text-blue-600">&</span> Digital Signature</h1>
            <p className="text-slate-500">Legally binding electronic signatures for all business modules.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-slate-200 shadow-sm">
              <History className="mr-2 h-4 w-4" /> Audit Logs
            </Button>
            <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                  <Plus className="mr-2 h-4 w-4" /> New Contract
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>New Contract</DialogTitle>
                  <DialogDescription>Add a new electronic agreement.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" value={newContract.title} onChange={(e) => setNewContract({...newContract, title: e.target.value})} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="party" className="text-right">Party</Label>
                    <Input id="party" value={newContract.party} onChange={(e) => setNewContract({...newContract, party: e.target.value})} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select value={newContract.type} onValueChange={(val) => setNewContract({...newContract, type: val})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Purchasing">Purchasing</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="security" className="text-right">Security</Label>
                    <Select value={newContract.security} onValueChange={(val) => setNewContract({...newContract, security: val})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select security" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Encrypted">Encrypted</SelectItem>
                        <SelectItem value="Blockchain Verified">Blockchain Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddContract}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Action Required", value: "3", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Waiting for Others", value: "12", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Completed", value: "148", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Security Level", value: "AES-256", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-white border p-1 h-11">
              <TabsTrigger value="all" className="px-6">All Documents</TabsTrigger>
              <TabsTrigger value="pending" className="px-6">Pending Me</TabsTrigger>
              <TabsTrigger value="completed" className="px-6">Completed</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search contracts..." className="pl-10 bg-white border-slate-200" />
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card className="border-none shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[300px]">Contract Name</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{contract.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono uppercase">{contract.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">{contract.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-600">{contract.party}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            contract.status === "signed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            contract.status === "pending_me" ? "bg-orange-50 text-orange-700 border-orange-100 animate-pulse" :
                            contract.status === "expired" ? "bg-red-50 text-red-700 border-red-100" :
                            "bg-blue-50 text-blue-700 border-blue-100"
                          }
                        >
                          {contract.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{contract.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {contract.status === "pending_me" ? (
                            <Button size="sm" className="bg-blue-600" onClick={() => setSelectedContract(contract)}>
                              <PenTool className="h-3.5 w-3.5 mr-1" /> Sign
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" className="text-slate-400">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-slate-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Signing Modal Simulation */}
        <AnimatePresence>
          {selectedContract && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
              >
                <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <FileSignature className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900">Sign Document</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedContract(null)}>
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-4">
                    <p className="text-sm text-slate-500 italic">"I hereby agree to the terms and conditions set forth in {selectedContract.title} and authorize the use of my digital signature for this transaction."</p>
                    <div className="h-32 bg-white rounded-xl border flex items-center justify-center relative group cursor-crosshair">
                      <SignatureCanvas 
                        ref={sigCanvas}
                        penColor='black'
                        canvasProps={{style: {width: '100%', height: '100%'}, className: 'sigCanvas'}} 
                      />
                      <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Encrypted Session
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => sigCanvas.current?.clear()}>Clear Signature</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                      <Input defaultValue="Vinh Nguyen" readOnly className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Signing As</label>
                      <Input defaultValue="Executive Director" readOnly className="bg-slate-50" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setSelectedContract(null)}>Cancel</Button>
                    <Button 
                      className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700" 
                      disabled={isSigning}
                      onClick={handleSign}
                    >
                      {isSigning ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                      Confirm & Sign
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Integration Section */}
        <section className="pt-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Cross-Module Integration</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "HR Module", desc: "Automate labor contracts and onboarding docs.", icon: Users },
              { title: "Sellers", desc: "Digital onboarding for new marketplace partners.", icon: ShoppingCart },
              { title: "Purchasing", desc: "Sign POs and supplier agreements instantly.", icon: Truck }
            ].map((mod, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <mod.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{mod.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{mod.desc}</p>
                <Badge className="bg-blue-50 text-blue-600 border-none">Active Integration</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default EContract
