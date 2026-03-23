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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("pos.reports.revenue", "Doanh thu")}</p>
                <h3 className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}đ</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("pos.reports.orders", "Đơn hàng")}</p>
                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("pos.reports.avgValue", "Trung bình đơn")}</p>
                <h3 className="text-2xl font-bold">{stats.avgOrderValue.toLocaleString()}đ</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("pos.reports.shifts", "Ca làm việc")}</p>
                <h3 className="text-2xl font-bold">{shifts.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân bổ thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tiền mặt</span>
                <span className="font-bold">{(stats.paymentBreakdown.cash || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Thẻ/Chuyển khoản</span>
                <span className="font-bold">{(stats.paymentBreakdown.card || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ví điện tử</span>
                <span className="font-bold">{(stats.paymentBreakdown.wallet || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">App Dealtot</span>
                <span className="font-bold">{(stats.paymentBreakdown.dealtot || 0).toLocaleString()}đ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm truncate max-w-[200px]">{p.name}</span>
                  <span className="font-bold">{p.qty}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="day">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="shift">{t("pos.reports.byShift", "Theo ca")}</TabsTrigger>
            <TabsTrigger value="day">{t("pos.reports.byDay", "Theo ngày")}</TabsTrigger>
            <TabsTrigger value="week">{t("pos.reports.byWeek", "Theo tuần")}</TabsTrigger>
            <TabsTrigger value="month">{t("pos.reports.byMonth", "Theo tháng")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="shift">
          <Card>
            <CardHeader>
              <CardTitle>{t("pos.reports.shiftHistory", "Lịch sử ca làm việc")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shifts.map(shift => (
                  <div key={shift.id} className="flex items-center justify-between p-4 border rounded-xl">
                    <div>
                      <p className="font-bold">{shift.staffName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(shift.startTime), "dd/MM HH:mm")} - {shift.endTime ? format(new Date(shift.endTime), "HH:mm") : "Đang mở"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{(shift.totalSales || 0).toLocaleString()}đ</p>
                      <p className="text-xs text-muted-foreground">{shift.status === 'open' ? 'Đang hoạt động' : 'Đã kết thúc'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle>{t("pos.reports.revenueToday", "Doanh thu hôm nay")}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData('day')}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString() + "đ"} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>{t("pos.reports.revenueThisWeek", "Doanh thu tuần này")}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData('week')}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString() + "đ"} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle>{t("pos.reports.revenueThisMonth", "Doanh thu tháng này")}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData('month')}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString() + "đ"} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
