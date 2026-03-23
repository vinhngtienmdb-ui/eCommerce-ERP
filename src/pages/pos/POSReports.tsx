import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { db } from "@/src/lib/firebase";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { Loader2, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";

export function POSReports({ storeId, branchId }: { storeId: string; branchId?: string }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const ordersPath = branchId 
          ? `stores/${storeId}/branches/${branchId}/orders` 
          : `stores/${storeId}/orders`;
        
        const shiftsPath = branchId
          ? `stores/${storeId}/branches/${branchId}/shifts`
          : `stores/${storeId}/shifts`;

        const ordersSnap = await getDocs(query(collection(db, ordersPath), orderBy("createdAt", "desc")));
        const shiftsSnap = await getDocs(query(collection(db, shiftsPath), orderBy("startTime", "desc")));

        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setShifts(shiftsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storeId, branchId]);

  const getStats = (data: any[]) => {
    const totalRevenue = data.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = data.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const paymentBreakdown = data.reduce((acc: any, order: any) => {
      const method = order.paymentMethod || "cash";
      acc[method] = (acc[method] || 0) + (order.total || 0);
      return acc;
    }, {});

    const productSales: any = {};
    data.forEach(order => {
      order.items?.forEach((item: any) => {
        productSales[item.name] = (productSales[item.name] || 0) + (item.quantity || 0);
      });
    });
    const topProducts = Object.entries(productSales)
      .map(([name, qty]) => ({ name, qty: qty as number }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return { totalRevenue, totalOrders, avgOrderValue, paymentBreakdown, topProducts };
  };

  const stats = getStats(orders);

  const filterByDateRange = (range: 'day' | 'week' | 'month') => {
    const now = new Date();
    let start, end;
    if (range === 'day') {
      start = startOfDay(now);
      end = endOfDay(now);
    } else if (range === 'week') {
      start = startOfWeek(now);
      end = endOfWeek(now);
    } else {
      start = startOfMonth(now);
      end = endOfMonth(now);
    }
    return orders.filter(o => {
      const date = new Date(o.createdAt);
      return date >= start && date <= end;
    });
  };

  const getChartData = (range: 'day' | 'week' | 'month') => {
    const now = new Date();
    const data: any[] = [];
    if (range === 'day') {
      // Last 24 hours
      for (let i = 23; i >= 0; i--) {
        const hour = subDays(now, 0);
        hour.setHours(now.getHours() - i, 0, 0, 0);
        const hourOrders = orders.filter(o => {
          const d = new Date(o.createdAt);
          return d.getHours() === hour.getHours() && d.getDate() === hour.getDate();
        });
        data.push({
          name: format(hour, "HH:mm"),
          revenue: hourOrders.reduce((sum, o) => sum + o.total, 0)
        });
      }
    } else if (range === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const day = subDays(now, i);
        const dayOrders = orders.filter(o => format(new Date(o.createdAt), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));
        data.push({
          name: format(day, "EEE"),
          revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
        });
      }
    } else {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const day = subDays(now, i);
        const dayOrders = orders.filter(o => format(new Date(o.createdAt), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));
        data.push({
          name: format(day, "dd/MM"),
          revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
        });
      }
    }
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white transition-colors hover:border-blue-500">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-none border-2 border-blue-200">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-0.5">{t("pos.reports.revenue", "Doanh thu")}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter">{stats.totalRevenue.toLocaleString()}đ</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white transition-colors hover:border-emerald-500">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-none border-2 border-emerald-200">
                <ShoppingBag className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-0.5">{t("pos.reports.orders", "Đơn hàng")}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter">{stats.totalOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white transition-colors hover:border-purple-500">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-none border-2 border-purple-200">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-0.5">{t("pos.reports.avgValue", "Trung bình đơn")}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter">{stats.avgOrderValue.toLocaleString()}đ</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white transition-colors hover:border-orange-500">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-none border-2 border-orange-200">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-0.5">{t("pos.reports.shifts", "Ca làm việc")}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter">{shifts.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Phân bổ thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-none border-2 border-slate-100">
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">Tiền mặt</span>
                <span className="font-black text-slate-900">{(stats.paymentBreakdown.cash || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-none border-2 border-slate-100">
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">Thẻ/Chuyển khoản</span>
                <span className="font-black text-slate-900">{(stats.paymentBreakdown.card || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-none border-2 border-slate-100">
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">Ví điện tử</span>
                <span className="font-black text-slate-900">{(stats.paymentBreakdown.wallet || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-none border-2 border-slate-100">
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">App Dealtot</span>
                <span className="font-black text-slate-900">{(stats.paymentBreakdown.dealtot || 0).toLocaleString()}đ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3">
              {stats.topProducts.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-none border-2 border-slate-100 group hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-none bg-white flex items-center justify-center text-[10px] font-black text-slate-400 border-2 border-slate-200">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-slate-700 truncate max-w-[180px]">{p.name}</span>
                  </div>
                  <span className="font-black text-primary">{p.qty}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="day" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-slate-100 p-1 rounded-none border-2 border-slate-200 h-12">
            <TabsTrigger value="shift" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-5">{t("pos.reports.byShift", "Theo ca")}</TabsTrigger>
            <TabsTrigger value="day" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-5">{t("pos.reports.byDay", "Theo ngày")}</TabsTrigger>
            <TabsTrigger value="week" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-5">{t("pos.reports.byWeek", "Theo tuần")}</TabsTrigger>
            <TabsTrigger value="month" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-5">{t("pos.reports.byMonth", "Theo tháng")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="shift" className="animate-in fade-in-50 duration-500">
          <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-lg font-black uppercase tracking-tight">{t("pos.reports.shiftHistory", "Lịch sử ca làm việc")}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                {shifts.map(shift => (
                  <div key={shift.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-none border-2 border-slate-100 group hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-10 rounded-none ${shift.status === 'open' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                      <div>
                        <p className="font-black uppercase tracking-tight text-slate-900">{shift.staffName}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {format(new Date(shift.startTime), "dd/MM HH:mm")} - {shift.endTime ? format(new Date(shift.endTime), "HH:mm") : "Đang mở"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary tracking-tighter">{(shift.totalSales || 0).toLocaleString()}đ</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${shift.status === 'open' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {shift.status === 'open' ? 'Đang hoạt động' : 'Đã kết thúc'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="animate-in fade-in-50 duration-500">
          <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-lg font-black uppercase tracking-tight">{t("pos.reports.revenueToday", "Doanh thu hôm nay")}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData('day')}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '0', border: '2px solid #0f172a', boxShadow: 'none', padding: '12px'}}
                    formatter={(value: number) => [value.toLocaleString() + "đ", "Doanh thu"]} 
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="animate-in fade-in-50 duration-500">
          <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-lg font-black uppercase tracking-tight">{t("pos.reports.revenueThisWeek", "Doanh thu tuần này")}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData('week')}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '0', border: '2px solid #0f172a', boxShadow: 'none', padding: '12px'}}
                    formatter={(value: number) => [value.toLocaleString() + "đ", "Doanh thu"]} 
                  />
                  <Line type="stepAfter" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="animate-in fade-in-50 duration-500">
          <Card className="border-2 border-slate-200 rounded-none overflow-hidden bg-white">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-lg font-black uppercase tracking-tight">{t("pos.reports.revenueThisMonth", "Doanh thu tháng này")}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData('month')}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '0', border: '2px solid #0f172a', boxShadow: 'none', padding: '12px'}}
                    formatter={(value: number) => [value.toLocaleString() + "đ", "Doanh thu"]} 
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
