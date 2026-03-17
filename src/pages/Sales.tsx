import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Trophy, Users, DollarSign, TrendingUp, Network, UserPlus, Plus, Trash2, Pencil, Award, Target, Gift, Zap, RotateCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { customersData } from "@/src/data/customers";
import { initialEmployees, Employee } from "@/src/data/employees";
import { initialTiers, Tier } from "@/src/data/tiers";
import { toast } from "sonner";

const performanceData = [
  { name: "Dir A", sales: 4000, teamSales: 2400 },
  { name: "Dir B", sales: 3000, teamSales: 1398 },
  { name: "Mgr A", sales: 2000, teamSales: 9800 },
  { name: "Mgr B", sales: 2780, teamSales: 3908 },
];

export function Sales() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddTierOpen, setIsAddTierOpen] = useState(false);
  const [isEditTierOpen, setIsEditTierOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [newTierName, setNewTierName] = useState("");
  const [newTierCommission, setNewTierCommission] = useState("");
  const [editingTier, setEditingTier] = useState<Tier | null>(null);

  const handleAddEmployee = () => {
    const customer = customersData.find(c => c.id === selectedCustomerId);
    if (customer && selectedRole) {
      const newEmployee: Employee = {
        id: `EMP-${employees.length + 1}`,
        customerId: customer.id,
        name: customer.name,
        role: selectedRole,
        status: "active"
      };
      setEmployees([...employees, newEmployee]);
      setIsAddEmployeeOpen(false);
      setSelectedCustomerId("");
      setSelectedRole("");
      toast.success(t("common.success"));
    }
  };

  const handleAddTier = () => {
    if (newTierName && newTierCommission) {
      const newTier: Tier = {
        id: `T-${tiers.length + 1}`,
        name: newTierName,
        commission: parseInt(newTierCommission)
      };
      setTiers([...tiers, newTier]);
      setIsAddTierOpen(false);
      setNewTierName("");
      setNewTierCommission("");
      toast.success(t("common.success"));
    }
  };

  const handleEditTier = () => {
    if (editingTier && newTierName && newTierCommission) {
      setTiers(tiers.map(t => t.id === editingTier.id ? { ...t, name: newTierName, commission: parseInt(newTierCommission) } : t));
      setIsEditTierOpen(false);
      setEditingTier(null);
      setNewTierName("");
      setNewTierCommission("");
      toast.success(t("common.success"));
    }
  };

  const openEditTier = (tier: Tier) => {
    setEditingTier(tier);
    setNewTierName(tier.name);
    setNewTierCommission(tier.commission.toString());
    setIsEditTierOpen(true);
  };

  const handleDeleteTier = (id: string) => {
    setTiers(tiers.filter(t => t.id !== id));
    toast.success(t("common.deleted"));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 p-8 pt-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t("sales.title")}</h2>
          <p className="text-slate-500 mt-1">{t("sales.description")}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">{t("sales.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="hierarchy" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">{t("sales.performance.hierarchy")}</TabsTrigger>
          <TabsTrigger value="employees" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Nhân viên</TabsTrigger>
          <TabsTrigger value="tiers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Cấp bậc & Hoa hồng</TabsTrigger>
          <TabsTrigger value="loyalty" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Loyalty & Gamification</TabsTrigger>
          <TabsTrigger value="tracking" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">{t("sales.tabs.tracking")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: t("sales.overview.totalRevenue"), value: "$125,430.00", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
              { title: t("sales.overview.activeSales"), value: employees.length.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
              { title: t("sales.overview.topPerformer"), value: "Nguyen Van A", icon: Trophy, color: "text-amber-600", bg: "bg-amber-100" },
              { title: t("sales.overview.commissionPayout"), value: "$8,200.00", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-100" },
            ].map((stat, i) => (
              <Card key={i} className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-slate-500">{stat.title}</CardTitle>
                  <div className={`p-2 ${stat.bg} rounded-xl`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{t("sales.performance.hierarchy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-slate-50">
                <Network className="h-16 w-16 text-slate-400" />
                <span className="ml-4 text-lg font-medium text-slate-600">Sales Hierarchy: {tiers.map(t => t.name).join(" -> ")}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Quản lý Nhân viên</CardTitle>
              <Button onClick={() => setIsAddEmployeeOpen(true)} className="rounded-xl">
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm nhân viên
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Cấp bậc</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell>{emp.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Cấp bậc & Hoa hồng</CardTitle>
              <Button onClick={() => setIsAddTierOpen(true)} className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Thêm cấp bậc
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên cấp bậc</TableHead>
                    <TableHead>Hoa hồng (%)</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell className="font-medium">{tier.name}</TableCell>
                      <TableCell>{tier.commission}%</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditTier(tier)} className="rounded-lg">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTier(tier.id)} className="rounded-lg text-rose-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Hạng thành viên", value: "Gold", icon: Award },
              { title: "Điểm tích lũy", value: "1250", icon: Gift },
              { title: "Đặc quyền", value: "Giảm 10%, Freeship", icon: Zap },
            ].map((item, i) => (
              <Card key={i} className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-slate-500">{item.title}</CardTitle>
                  <item.icon className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Danh sách hạng thành viên</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hạng</TableHead>
                    <TableHead>Điểm yêu cầu</TableHead>
                    <TableHead>Đặc quyền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>Bronze</TableCell><TableCell>0</TableCell><TableCell>-</TableCell></TableRow>
                  <TableRow><TableCell>Silver</TableCell><TableCell>1000</TableCell><TableCell>Giảm 5%</TableCell></TableRow>
                  <TableRow><TableCell>Gold</TableCell><TableCell>5000</TableCell><TableCell>Giảm 10%, Freeship</TableCell></TableRow>
                  <TableRow><TableCell>Diamond</TableCell><TableCell>10000</TableCell><TableCell>Giảm 20%, Quà tặng VIP</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Gamification</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900">Nhiệm vụ hàng ngày</h4>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-medium">Đăng nhập mỗi ngày</span>
                  <Button size="sm" className="rounded-lg">Nhận 10 pts</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-medium">Đặt 1 đơn hàng</span>
                  <Button size="sm" className="rounded-lg">Nhận 50 pts</Button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <RotateCcw className="h-12 w-12 text-blue-600 mb-4" />
                <Button className="rounded-xl">Vòng quay may mắn</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{t("sales.tracking.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="sales" name={t("sales.performance.individual")} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="teamSales" name={t("sales.performance.team")} fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Thêm nhân viên từ khách hàng</DialogTitle>
            <DialogDescription>Chọn khách hàng và gán cấp bậc cho họ.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={setSelectedCustomerId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customersData.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedRole}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chọn cấp bậc" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map(t => (
                  <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddEmployee} className="rounded-xl">Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTierOpen} onOpenChange={setIsAddTierOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Thêm cấp bậc mới</DialogTitle>
            <DialogDescription>Nhập tên cấp bậc và tỷ lệ hoa hồng.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Tên cấp bậc" value={newTierName} onChange={(e) => setNewTierName(e.target.value)} className="rounded-xl" />
            <Input type="number" placeholder="Hoa hồng (%)" value={newTierCommission} onChange={(e) => setNewTierCommission(e.target.value)} className="rounded-xl" />
          </div>
          <DialogFooter>
            <Button onClick={handleAddTier} className="rounded-xl">Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTierOpen} onOpenChange={setIsEditTierOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sửa cấp bậc</DialogTitle>
            <DialogDescription>Cập nhật tên cấp bậc và tỷ lệ hoa hồng.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Tên cấp bậc" value={newTierName} onChange={(e) => setNewTierName(e.target.value)} className="rounded-xl" />
            <Input type="number" placeholder="Hoa hồng (%)" value={newTierCommission} onChange={(e) => setNewTierCommission(e.target.value)} className="rounded-xl" />
          </div>
          <DialogFooter>
            <Button onClick={handleEditTier} className="rounded-xl">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
