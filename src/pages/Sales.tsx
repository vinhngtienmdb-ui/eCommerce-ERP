import { useState } from "react";
import { useTranslation } from "react-i18next";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("sales.title")}</h2>
        <p className="text-muted-foreground">{t("sales.description")}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("sales.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="hierarchy">{t("sales.performance.hierarchy")}</TabsTrigger>
          <TabsTrigger value="employees">Nhân viên</TabsTrigger>
          <TabsTrigger value="tiers">Cấp bậc & Hoa hồng</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty & Gamification</TabsTrigger>
          <TabsTrigger value="tracking">{t("sales.tabs.tracking")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.overview.totalRevenue")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$125,430.00</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.overview.activeSales")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.overview.topPerformer")}</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Nguyen Van A</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.overview.commissionPayout")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,200.00</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("sales.performance.hierarchy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 border rounded-lg">
                <Network className="h-16 w-16 text-muted-foreground" />
                <span className="ml-4 text-lg">Sales Hierarchy: {tiers.map(t => t.name).join(" -> ")}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quản lý Nhân viên</CardTitle>
              <Button onClick={() => setIsAddEmployeeOpen(true)}>
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
                      <TableCell>{emp.name}</TableCell>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cấp bậc & Hoa hồng</CardTitle>
              <Button onClick={() => setIsAddTierOpen(true)}>
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
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell>{tier.name}</TableCell>
                      <TableCell>{tier.commission}%</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditTier(tier)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTier(tier.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hạng thành viên</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gold</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Điểm tích lũy</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1250</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Đặc quyền</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">Giảm 10% mọi đơn hàng, Freeship</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách hạng thành viên</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle>Gamification</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Nhiệm vụ hàng ngày</h4>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Đăng nhập mỗi ngày</span>
                  <Button size="sm">Nhận 10 pts</Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Đặt 1 đơn hàng</span>
                  <Button size="sm">Nhận 50 pts</Button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded">
                <RotateCcw className="h-16 w-16 text-primary mb-4" />
                <Button>Vòng quay may mắn</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("sales.tracking.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name={t("sales.performance.individual")} fill="#8884d8" />
                  <Bar dataKey="teamSales" name={t("sales.performance.team")} fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm nhân viên từ khách hàng</DialogTitle>
            <DialogDescription>Chọn khách hàng và gán cấp bậc cho họ.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={setSelectedCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customersData.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedRole}>
              <SelectTrigger>
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
            <Button onClick={handleAddEmployee}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTierOpen} onOpenChange={setIsAddTierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm cấp bậc mới</DialogTitle>
            <DialogDescription>Nhập tên cấp bậc và tỷ lệ hoa hồng.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Tên cấp bậc" value={newTierName} onChange={(e) => setNewTierName(e.target.value)} />
            <Input type="number" placeholder="Hoa hồng (%)" value={newTierCommission} onChange={(e) => setNewTierCommission(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddTier}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTierOpen} onOpenChange={setIsEditTierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa cấp bậc</DialogTitle>
            <DialogDescription>Cập nhật tên cấp bậc và tỷ lệ hoa hồng.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Tên cấp bậc" value={newTierName} onChange={(e) => setNewTierName(e.target.value)} />
            <Input type="number" placeholder="Hoa hồng (%)" value={newTierCommission} onChange={(e) => setNewTierCommission(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleEditTier}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
