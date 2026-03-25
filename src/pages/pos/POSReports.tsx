import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { db } from "@/src/lib/firebase";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
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
        handleFirestoreError(error, OperationType.LIST, branchId ? `stores/${storeId}/branches/${branchId}` : `stores/${storeId}`);
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
        <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-0.5">{t("pos.reports.revenue", "Doanh thu")}</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{stats.totalRevenue.toLocaleString()}đ</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-0.5">{t("pos.reports.orders", "Đơn hàng")}</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{stats.totalOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-0.5">{t("pos.reports.avgValue", "Trung bình đơn")}</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{stats.avgOrderValue.toLocaleString()}đ</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-0.5">{t("pos.reports.shifts", "Ca làm việc")}</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{shifts.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-900">Phân bổ thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-slate-600">Tiền mặt</span>
                <span className="text-base font-bold text-slate-900">{(stats.paymentBreakdown.cash || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-slate-600">Thẻ/Chuyển khoản</span>
                <span className="text-base font-bold text-slate-900">{(stats.paymentBreakdown.card || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-slate-600">Ví điện tử</span>
                <span className="text-base font-bold text-slate-900">{(stats.paymentBreakdown.wallet || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-slate-600">App Dealtot</span>
                <span className="text-base font-bold text-slate-900">{(stats.paymentBreakdown.dealtot || 0).toLocaleString()}đ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-900">Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {stats.topProducts.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">{p.name}</span>
                  </div>
                  <span className="text-base font-bold text-slate-900">{p.qty}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="day" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl border border-slate-200 h-11">
            <TabsTrigger value="shift" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs px-4 h-9 transition-all">{t("pos.reports.byShift", "Theo ca")}</TabsTrigger>
            <TabsTrigger value="day" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs px-4 h-9 transition-all">{t("pos.reports.byDay", "Theo ngày")}</TabsTrigger>
            <TabsTrigger value="week" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs px-4 h-9 transition-all">{t("pos.reports.byWeek", "Theo tuần")}</TabsTrigger>
            <TabsTrigger value="month" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs px-4 h-9 transition-all">{t("pos.reports.byMonth", "Theo tháng")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="shift" className="mt-0">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900">{t("pos.reports.shiftHistory", "Lịch sử ca làm việc")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {shifts.map(shift => (
                  <div key={shift.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:bg-primary/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-10 rounded-full ${shift.status === 'open' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{shift.staffName}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {format(new Date(shift.startTime), "dd/MM HH:mm")} - {shift.endTime ? format(new Date(shift.endTime), "HH:mm") : "Đang mở"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-slate-900">{(shift.totalSales || 0).toLocaleString()}đ</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${shift.status === 'open' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {shift.status === 'open' ? 'Đang hoạt động' : 'Đã kết thúc'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="mt-0">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900">{t("pos.reports.revenueToday", "Doanh thu hôm nay")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData('day')}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: '600'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: '600'}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                    formatter={(value: number) => [value.toLocaleString() + "đ", "Doanh thu"]} 
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900">{t("pos.reports.revenueThisWeek", "Doanh thu tuần này")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData('week')}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: '600'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: '600'}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                    formatter={(value: number) => [value.toLocaleString() + "đ", "Doanh thu"]} 
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="mt-0">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900">{t("pos.reports.revenueThisMonth", "Doanh thu tháng này")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData('month')}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: '600'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: '600'}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                    formatter={(value: number) => [value.toLocaleString() + "đ", "Doanh thu"]} 
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
