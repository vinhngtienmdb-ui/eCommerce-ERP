import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Switch } from "@/src/components/ui/switch";
import { Plus, Edit, Trash2, ArrowRight, Settings, Play, Save, X } from "lucide-react";
import { useWorkflowStore } from "@/src/store/useWorkflowStore";
import { Workflow } from "@/src/types/workflow";
import { Badge } from "@/src/components/ui/badge";

export function WorkflowManagement() {
  const { workflows, toggleWorkflow, deleteWorkflow } = useWorkflowStore();
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);

  const handleEdit = (wf: Workflow) => {
    setActiveWorkflow(wf);
    setIsBuilding(true);
  };

  if (isBuilding) {
    return (
      <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsBuilding(false)}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{activeWorkflow?.name || "Tạo quy trình mới"}</h1>
              <p className="text-sm text-slate-500">Workflow Builder (Kéo thả)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Play className="mr-2 h-4 w-4" /> Chạy thử</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700"><Save className="mr-2 h-4 w-4" /> Lưu quy trình</Button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Sidebar Tools */}
          <Card className="w-64 border-none shadow-sm flex-shrink-0 h-full overflow-y-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm uppercase text-slate-500">Công cụ (Nodes)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Bắt đầu", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                { name: "Phê duyệt", color: "bg-blue-100 text-blue-700 border-blue-200" },
                { name: "Gửi Email", color: "bg-purple-100 text-purple-700 border-purple-200" },
                { name: "Điều kiện (If/Else)", color: "bg-orange-100 text-orange-700 border-orange-200" },
                { name: "Ký số (E-Sign)", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
                { name: "Tạo PDF", color: "bg-red-100 text-red-700 border-red-200" },
                { name: "Cập nhật ERP", color: "bg-teal-100 text-teal-700 border-teal-200" },
                { name: "Kết thúc", color: "bg-slate-100 text-slate-700 border-slate-200" },
              ].map((tool, i) => (
                <div key={i} className={`p-3 rounded-lg border ${tool.color} cursor-grab active:cursor-grabbing font-medium text-sm flex items-center justify-between hover:shadow-md transition-all`}>
                  {tool.name}
                  <Plus className="h-4 w-4 opacity-50" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Canvas Area */}
          <Card className="flex-1 border-none shadow-sm bg-slate-50 relative overflow-hidden flex items-center justify-center">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Simulated Nodes */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-40 p-4 bg-white border-2 border-emerald-500 rounded-xl shadow-lg text-center relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500">Bắt đầu</Badge>
                <p className="text-sm font-medium mt-2">Tạo Đề nghị</p>
              </div>
              
              <ArrowRight className="text-slate-400" />
              
              <div className="w-40 p-4 bg-white border-2 border-blue-500 rounded-xl shadow-lg text-center relative group cursor-pointer hover:border-indigo-500">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">Phê duyệt</Badge>
                <div className="absolute -top-3 -right-3 h-6 w-6 bg-slate-100 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings className="h-3 w-3 text-slate-600" />
                </div>
                <p className="text-sm font-medium mt-2">Trưởng phòng</p>
              </div>

              <ArrowRight className="text-slate-400" />

              <div className="w-40 p-4 bg-white border-2 border-blue-500 rounded-xl shadow-lg text-center relative group cursor-pointer hover:border-indigo-500">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">Phê duyệt</Badge>
                <div className="absolute -top-3 -right-3 h-6 w-6 bg-slate-100 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings className="h-3 w-3 text-slate-600" />
                </div>
                <p className="text-sm font-medium mt-2">Kế toán trưởng</p>
              </div>

              <ArrowRight className="text-slate-400" />

              <div className="w-40 p-4 bg-white border-2 border-slate-500 rounded-xl shadow-lg text-center relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-500">Kết thúc</Badge>
                <p className="text-sm font-medium mt-2">Hoàn thành</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý Quy trình (Workflow)</h1>
          <p className="text-slate-500">Thiết kế và tự động hóa các quy trình phê duyệt trong doanh nghiệp.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsBuilding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo quy trình mới
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Danh sách quy trình</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Tên quy trình</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((wf) => (
                <TableRow key={wf.id}>
                  <TableCell className="font-medium">{wf.name}</TableCell>
                  <TableCell className="text-slate-500">{wf.description}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={wf.isActive} 
                      onCheckedChange={() => toggleWorkflow(wf.id)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(wf)}>
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteWorkflow(wf.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {workflows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Chưa có quy trình nào. Hãy tạo mới!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
