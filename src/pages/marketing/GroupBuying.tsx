import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { 
  Users, DollarSign, TrendingDown, Edit, Trash2, CheckCircle2, 
  XCircle, Clock, PlayCircle, Package, Truck, FileText, AlertCircle,
  RefreshCw, CheckSquare, FileSignature, Plus
} from "lucide-react";
import { MOCK_GROUP_BUYING_CAMPAIGNS } from "@/src/constants/groupBuyingConstants";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'live':
      return <Badge className="bg-blue-500">Đang mở</Badge>;
    case 'proposal':
      return <Badge className="bg-amber-500">Chờ duyệt</Badge>;
    case 'refunding':
      return <Badge className="bg-purple-500">Đang hoàn tiền</Badge>;
    case 'delivering':
      return <Badge className="bg-green-600">Đang giao hàng</Badge>;
    case 'completed':
      return <Badge className="bg-slate-600">Hoàn thành</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="text-red-500 border-red-500">Đã hủy</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function GroupBuying() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Chương Trình Gom Nhóm</h1>
          <p className="text-slate-500 mt-1">Quản lý toàn trình từ đề xuất KOL đến giao hàng & tổng kết</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Tạo phiên Gom Nhóm
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border shadow-sm w-full justify-start overflow-x-auto">
          <TabsTrigger value="dashboard">Tổng quan</TabsTrigger>
          <TabsTrigger value="phase1">1. Đề xuất & Duyệt</TabsTrigger>
          <TabsTrigger value="phase23">2-3. Phiên Đang Chạy</TabsTrigger>
          <TabsTrigger value="phase45">4-5. Chốt & Hoàn Tiền</TabsTrigger>
          <TabsTrigger value="phase678">6-8. Giao Hàng</TabsTrigger>
          <TabsTrigger value="phase9">9. Tổng Kết</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <PlayCircle className="h-4 w-4 text-blue-500" /> Phiên đang mở
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-muted-foreground mt-1">+3 phiên so với hôm qua</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="h-4 w-4 text-green-500" /> Khách tham gia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,245</p>
                <p className="text-xs text-muted-foreground mt-1">Đã thanh toán 100% giá gốc</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-amber-500" /> Tạm thu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">450M</p>
                <p className="text-xs text-muted-foreground mt-1">Chờ chốt phiên để hoàn tiền</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <RefreshCw className="h-4 w-4 text-purple-500" /> Đang hoàn tiền
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">45M</p>
                <p className="text-xs text-muted-foreground mt-1">Từ 3 phiên đã chốt</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tất cả phiên Gom Nhóm</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Phiên</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>KOL</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Giá gốc</TableHead>
                    <TableHead>Người tham gia</TableHead>
                    <TableHead>Mốc hiện tại</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GROUP_BUYING_CAMPAIGNS.map((campaign) => {
                    // Calculate current milestone
                    const currentMilestone = campaign.milestones
                      .slice()
                      .reverse()
                      .find(m => campaign.currentParticipants >= m.participants);
                    
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.code}</TableCell>
                        <TableCell>{campaign.productName}</TableCell>
                        <TableCell>{campaign.kolName}</TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>{formatCurrency(campaign.originalPrice)}</TableCell>
                        <TableCell>{campaign.currentParticipants} / {campaign.targetParticipants}</TableCell>
                        <TableCell className={currentMilestone ? "text-green-600 font-medium" : "text-muted-foreground"}>
                          {currentMilestone 
                            ? `-${currentMilestone.discountPercentage}% (${currentMilestone.participants} người)` 
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Chi tiết</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Giai đoạn 1: Chuẩn bị phiên (KOL Đề xuất)</CardTitle>
              <CardDescription>Kiểm tra 6 tiêu chí bắt buộc và phê duyệt đề xuất sản phẩm từ KOL</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Đề Xuất</TableHead>
                    <TableHead>KOL</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Tồn kho</TableHead>
                    <TableHead>Bảng giá mốc</TableHead>
                    <TableHead>Pháp lý</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GROUP_BUYING_CAMPAIGNS.filter(c => c.phase === 1).map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.code.replace('GN', 'DX')}</TableCell>
                      <TableCell>{campaign.kolName}</TableCell>
                      <TableCell>{campaign.productName}</TableCell>
                      <TableCell className={campaign.inventory >= campaign.targetParticipants ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                        {new Intl.NumberFormat('vi-VN').format(campaign.inventory)} ({campaign.inventory >= campaign.targetParticipants ? `Đạt \u2265${campaign.targetParticipants}` : "Không đạt"})
                      </TableCell>
                      <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã nộp</Badge></TableCell>
                      <TableCell>
                        {campaign.legalStatus === 'complete' 
                          ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đầy đủ</Badge>
                          : <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Thiếu CBMP</Badge>
                        }
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell className="flex gap-2">
                        {campaign.status === 'proposal' ? (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-4 w-4 mr-1" /> Duyệt</Button>
                            <Button size="sm" variant="destructive"><XCircle className="h-4 w-4 mr-1" /> Từ chối</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline">Xem lý do</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase23" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_GROUP_BUYING_CAMPAIGNS.filter(c => c.phase === 2 || c.phase === 3).map((campaign) => {
              const progressPercentage = Math.min(100, Math.round((campaign.currentParticipants / campaign.targetParticipants) * 100));
              const isAtRisk = campaign.currentParticipants < campaign.milestones[0].participants;
              
              return (
                <Card key={campaign.id} className={`border-blue-200 shadow-sm ${isAtRisk ? 'opacity-90' : ''}`}>
                  <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {getStatusBadge(campaign.status)}
                        <CardTitle className="mt-2">{campaign.code}: {campaign.productName}</CardTitle>
                        <CardDescription className="mt-1">KOL: {campaign.kolName} • Bắt đầu: {new Date(campaign.startDate).toLocaleString('vi-VN')}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">01:45:20</div>
                        <div className="text-xs text-muted-foreground">Thời gian còn lại</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Tiến độ người tham gia (Đã TT 100%)</span>
                          <span className={`font-bold ${isAtRisk ? 'text-amber-600' : 'text-green-600'}`}>
                            {campaign.currentParticipants} người {isAtRisk && "(Nguy cơ hủy)"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`${isAtRisk ? 'bg-amber-500' : 'bg-green-500'} h-2.5 rounded-full`} style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          {campaign.milestones.map((m, i) => (
                            <span key={i}>Mốc {i+1}: {m.participants} ({m.discountPercentage}%) {campaign.currentParticipants >= m.participants ? '✓' : ''}</span>
                          ))}
                        </div>
                      </div>
                      
                      {isAtRisk ? (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-md flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>Phiên có nguy cơ không đạt mốc tối thiểu ({campaign.milestones[0].participants} người). Cần can thiệp boost hoặc chuẩn bị kịch bản hủy phiên (SOP TH1).</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border">
                          <div>
                            <div className="text-xs text-muted-foreground">Giá gốc</div>
                            <div className="text-lg font-semibold line-through">{formatCurrency(campaign.originalPrice)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Giá hiện tại</div>
                            <div className="text-lg font-bold text-green-600">{formatCurrency(campaign.currentPrice)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Tạm thu (100% giá gốc)</div>
                            <div className="text-lg font-semibold">{formatCurrency(campaign.originalPrice * campaign.currentParticipants)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Dự kiến hoàn tiền</div>
                            <div className="text-lg font-semibold text-amber-600">{formatCurrency((campaign.originalPrice - campaign.currentPrice) * campaign.currentParticipants)}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700"><PlayCircle className="mr-2 h-4 w-4" /> Giám sát Live</Button>
                        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50"><AlertCircle className="mr-2 h-4 w-4" /> Báo vi phạm</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="phase45" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Giai đoạn 4-5: Chốt phiên & Hoàn tiền chênh lệch</CardTitle>
              <CardDescription>Hệ thống tự động tính toán và hoàn tiền qua ví điện tử (MoMo/ZaloPay/VNPay)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Phiên</TableHead>
                    <TableHead>Kết quả chốt</TableHead>
                    <TableHead>Tổng đơn</TableHead>
                    <TableHead>Tiền cần hoàn</TableHead>
                    <TableHead>Tiến độ hoàn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GROUP_BUYING_CAMPAIGNS.filter(c => c.phase === 4 || c.phase === 5).map((campaign) => {
                    const achievedMilestone = campaign.milestones.slice().reverse().find(m => campaign.currentParticipants >= m.participants);
                    const isSuccess = campaign.currentParticipants >= campaign.milestones[0].participants;
                    const refundAmount = isSuccess ? (campaign.originalPrice - campaign.currentPrice) * campaign.currentParticipants : campaign.originalPrice * campaign.currentParticipants;
                    const refundProgress = campaign.status === 'refunded' ? 100 : (campaign.status === 'refunding' ? Math.floor(Math.random() * 50) + 50 : 0);
                    
                    return (
                      <TableRow key={campaign.id} className={campaign.status === 'refund_failed' ? 'bg-red-50/50' : ''}>
                        <TableCell className="font-medium">{campaign.code}</TableCell>
                        <TableCell>
                          {isSuccess ? (
                            <>
                              <div className="text-sm font-medium text-green-600">ĐẠT - Mốc {achievedMilestone?.participants} (-{achievedMilestone?.discountPercentage}%)</div>
                              <div className="text-xs text-muted-foreground">Giá chốt: {formatCurrency(campaign.currentPrice)}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-sm font-medium text-red-600">HỦY - Dưới {campaign.milestones[0].participants} người</div>
                              <div className="text-xs text-muted-foreground">Chỉ đạt {campaign.currentParticipants} người</div>
                            </>
                          )}
                        </TableCell>
                        <TableCell>{campaign.currentParticipants} đơn</TableCell>
                        <TableCell className="font-medium text-amber-600">
                          {formatCurrency(refundAmount)} {isSuccess ? '' : '(Hoàn 100%)'}
                        </TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div className={`${refundProgress === 100 ? 'bg-green-500' : (campaign.status === 'refund_failed' ? 'bg-red-500' : 'bg-purple-500')} h-2 rounded-full`} style={{ width: `${refundProgress}%` }}></div>
                          </div>
                          <div className={`text-xs text-right ${campaign.status === 'refund_failed' ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                            {campaign.status === 'refund_failed' ? 'Lỗi hoàn tiền' : `${Math.floor(campaign.currentParticipants * (refundProgress/100))}/${campaign.currentParticipants} đơn`}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          {campaign.status === 'refund_failed' ? (
                            <Button size="sm" variant="destructive">Xử lý (SOP TH2)</Button>
                          ) : (
                            <Button size="sm" variant="outline">Xem Log</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase678" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Giai đoạn 6-8: Lệnh Giao Hàng & Xuất Kho</CardTitle>
              <CardDescription>Phát Lệnh Giao Hàng (LGH) sau khi hoàn tiền thành công &ge;90%</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã LGH</TableHead>
                    <TableHead>Mã Phiên</TableHead>
                    <TableHead>Số lượng xuất</TableHead>
                    <TableHead>Kế toán XN</TableHead>
                    <TableHead>QL Duyệt</TableHead>
                    <TableHead>Trạng thái Kho</TableHead>
                    <TableHead>Vận chuyển</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GROUP_BUYING_CAMPAIGNS.filter(c => c.phase >= 6 && c.phase <= 8).map((campaign) => {
                    const lghCode = `LGH-${campaign.code.split('-')[1]}-${campaign.code.split('-')[2]}`;
                    
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{lghCode}</TableCell>
                        <TableCell>{campaign.code}</TableCell>
                        <TableCell>{campaign.currentParticipants} SP</TableCell>
                        <TableCell><CheckSquare className="h-5 w-5 text-green-500" /></TableCell>
                        <TableCell>
                          {campaign.phase === 6 ? (
                            <Button size="sm" className="h-7 text-xs">Ký duyệt</Button>
                          ) : (
                            <CheckSquare className="h-5 w-5 text-green-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          {campaign.phase === 6 && <Badge variant="outline" className="text-slate-500">Chờ LGH</Badge>}
                          {campaign.phase === 7 && <Badge className="bg-blue-500">Đang đóng gói</Badge>}
                          {campaign.phase === 8 && <Badge className="bg-green-600">Đã xuất kho</Badge>}
                        </TableCell>
                        <TableCell>
                          {campaign.phase <= 6 ? '-' : (
                            campaign.phase === 7 ? 'GHTK' : (
                              <div className="text-xs">
                                <div className="text-green-600">{Math.floor(campaign.currentParticipants * 0.95)} Giao thành công</div>
                                <div className="text-amber-600">{campaign.currentParticipants - Math.floor(campaign.currentParticipants * 0.95)} Đang giao</div>
                              </div>
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          {campaign.phase === 6 && <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-1" /> Xem LGH</Button>}
                          {campaign.phase === 7 && <Button size="sm" variant="outline"><Package className="h-4 w-4 mr-1" /> Phiếu XK</Button>}
                          {campaign.phase === 8 && <Button size="sm" variant="outline"><Truck className="h-4 w-4 mr-1" /> Tracking</Button>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase9" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Giai đoạn 9: Tổng kết phiên</CardTitle>
              <CardDescription>Báo cáo kết quả, tính hoa hồng KOL và đánh giá hiệu quả</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Phiên</TableHead>
                    <TableHead>KOL</TableHead>
                    <TableHead>Doanh thu thực</TableHead>
                    <TableHead>Tỷ lệ giao TC</TableHead>
                    <TableHead>Hoa hồng KOL</TableHead>
                    <TableHead>Báo cáo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GROUP_BUYING_CAMPAIGNS.filter(c => c.phase === 9).map((campaign) => {
                    const commission = (campaign.revenue || 0) * ((campaign.commissionRate || 0) / 100);
                    
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.code}</TableCell>
                        <TableCell>{campaign.kolName}</TableCell>
                        <TableCell>{formatCurrency(campaign.revenue || 0)}</TableCell>
                        <TableCell className="text-green-600">{campaign.deliverySuccessRate || 0}%</TableCell>
                        <TableCell>{formatCurrency(commission)} ({campaign.commissionRate || 0}%)</TableCell>
                        <TableCell>
                          {campaign.status === 'completed' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã duyệt</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Chờ duyệt</Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          {campaign.status === 'completed' ? (
                            <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-1" /> Xem BC</Button>
                          ) : (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700"><FileSignature className="h-4 w-4 mr-1" /> Duyệt BC</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

