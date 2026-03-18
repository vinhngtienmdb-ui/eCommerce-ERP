import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Settings2, 
  Bell, 
  ShoppingCart, 
  Users, 
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"

interface Workflow {
  id: string
  name: string
  trigger: string
  action: string
  status: "active" | "paused"
  lastRun?: string
  icon: any
}

const Automation = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Low Stock Alert & Draft PO",
      trigger: "Stock level < 10 units",
      action: "Notify Purchasing & Create Draft PO",
      status: "active",
      lastRun: "2 hours ago",
      icon: ShoppingCart
    },
    {
      id: "2",
      name: "VIP Customer Welcome",
      trigger: "Total spend > $1000",
      action: "Send personalized email & 10% coupon",
      status: "active",
      lastRun: "1 day ago",
      icon: Users
    },
    {
      id: "3",
      name: "Abandoned Cart Recovery",
      trigger: "Cart abandoned > 4 hours",
      action: "Send reminder notification",
      status: "paused",
      lastRun: "3 days ago",
      icon: Bell
    }
  ]);

  const handleToggleStatus = (id: string) => {
    setWorkflows(workflows.map(wf => {
      if (wf.id === id) {
        const newStatus = wf.status === "active" ? "paused" : "active";
        toast.success(`Workflow ${newStatus === "active" ? "activated" : "paused"}`);
        return { ...wf, status: newStatus };
      }
      return wf;
    }));
  };

  const handleDelete = (id: string) => {
    setWorkflows(workflows.filter(wf => wf.id !== id));
    toast.success("Workflow deleted");
  };

  const handleAddWorkflow = () => {
    setIsModalOpen(true);
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflowName) {
      toast.error("Please enter a workflow name");
      return;
    }
    const newWf: Workflow = {
      id: Math.random().toString(36).substr(2, 9),
      name: newWorkflowName,
      trigger: "Manual Trigger",
      action: "Custom Action",
      status: "active",
      lastRun: "Never",
      icon: Zap
    };
    setWorkflows([newWf, ...workflows]);
    toast.success("Workflow created successfully");
    setIsModalOpen(false);
    setNewWorkflowName("");
  };

  const handleSettings = () => {
    toast.success("Opening workflow settings...");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Smart Workflow Automation</h1>
            <p className="text-slate-500">Automate your business processes with AI-driven triggers and actions.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAddWorkflow}>
            <Plus className="mr-2 h-4 w-4" /> Create New Workflow
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Automations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{workflows.length}</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> {workflows.filter(w => w.status === 'active').length} currently active
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tasks Executed (MTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">1,284</div>
              <p className="text-xs text-slate-500 mt-1">Saving approx. 42 hours of manual work</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">99.8%</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" /> High reliability
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Active Workflows</h2>
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <workflow.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono mr-2">IF</span>
                      {workflow.trigger}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded text-xs font-mono mr-2 text-indigo-600">THEN</span>
                      {workflow.action}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400 uppercase font-medium">Last Run</p>
                    <p className="text-sm text-slate-600 flex items-center justify-end">
                      <Clock className="h-3 w-3 mr-1" /> {workflow.lastRun}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${workflow.status === "active" ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      onClick={() => handleToggleStatus(workflow.id)}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${workflow.status === "active" ? 'left-6' : 'left-1'}`} />
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600" onClick={handleSettings}>
                      <Settings2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600" onClick={() => handleDelete(workflow.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Card className="bg-indigo-900 text-white border-none overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-2xl">AI Workflow Recommender</CardTitle>
            <CardDescription className="text-indigo-200">
              Our AI has analyzed your store data and suggests these new automations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/10 rounded-lg border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-300" />
                <div>
                  <p className="font-medium">Post-Purchase Feedback Loop</p>
                  <p className="text-xs text-indigo-200">Send survey 3 days after delivery to improve NPS.</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={handleAddWorkflow}>Add Workflow</Button>
            </div>
            <div className="p-4 bg-white/10 rounded-lg border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-indigo-300" />
                <div>
                  <p className="font-medium">Dynamic Pricing Adjustment</p>
                  <p className="text-xs text-indigo-200">Adjust prices based on competitor stock levels.</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={handleAddWorkflow}>Add Workflow</Button>
            </div>
          </CardContent>
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Zap className="h-48 w-48" />
          </div>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Enter a name for your new automation workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="e.g. Summer Sale Broadcast"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Automation
