import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { toast } from "sonner";
import { db, auth } from "../../lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDocs, where, limit } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { Search, MapPin, Camera, CheckCircle, XCircle, Eye, FileText, Store } from "lucide-react";

export function POSRegistrationList() {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [verificationData, setVerificationData] = useState({
    notes: "",
    verificationImages: [] as string[],
    location: { lat: 10.762622, lng: 106.660172 },
  });

  useEffect(() => {
    const q = query(collection(db, "store_registrations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "store_registrations");
    });
    return () => unsubscribe();
  }, []);

  const handleVerify = async () => {
    if (!selectedReg) return;
    try {
      await updateDoc(doc(db, "store_registrations", selectedReg.id), {
        status: "pending_contract",
        fieldSaleVerification: {
          verifiedBy: auth.currentUser?.uid,
          verifiedAt: serverTimestamp(),
          ...verificationData,
        },
        updatedAt: serverTimestamp(),
      });
      toast.success(t("pos.registrations.verifySuccess", "Xác minh thành công!"));
      setIsVerifyOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `store_registrations/${selectedReg.id}`);
      toast.error(t("pos.registrations.verifyError", "Có lỗi xảy ra khi xác minh"));
    }
  };

  const handleApprove = async () => {
    if (!selectedReg) return;
    try {
      // 1. Generate Store Code (Auto-generated)
      const storeCode = `ST${Math.floor(1000 + Math.random() * 9000)}`;
      
      // 2. Create Store
      const storeRef = await addDoc(collection(db, "stores"), {
        name: selectedReg.partnerName,
        storeCode: storeCode,
        ownerType: selectedReg.businessType,
        ownerName: selectedReg.partnerName,
        ownerContact: selectedReg.partnerContact,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        creatorId: auth.currentUser?.uid,
        registrationId: selectedReg.id,
      });

      // 3. Update Registration Status
      await updateDoc(doc(db, "store_registrations", selectedReg.id), {
        status: "approved",
        storeId: storeRef.id,
        updatedAt: serverTimestamp(),
      });

      toast.success(t("pos.registrations.approveSuccess", `Đã phê duyệt và khởi tạo cửa hàng: ${storeCode}`));
      setIsApproveOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "stores/store_registrations");
      toast.error(t("pos.registrations.approveError", "Có lỗi xảy ra khi phê duyệt"));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_registration": return <Badge className="rounded-full border-none font-bold uppercase tracking-wider text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-100">{t("pos.status.pending", "Chờ xác minh")}</Badge>;
      case "pending_verification": return <Badge className="rounded-full border-none font-bold uppercase tracking-wider text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-100">{t("pos.status.verifying", "Đang xác minh")}</Badge>;
      case "pending_contract": return <Badge className="rounded-full border-none font-bold uppercase tracking-wider text-[10px] bg-purple-100 text-purple-700 hover:bg-purple-100">{t("pos.status.contract", "Chờ ký HĐ")}</Badge>;
      case "pending_approval": return <Badge className="rounded-full border-none font-bold uppercase tracking-wider text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-100">{t("pos.status.approval", "Chờ phê duyệt")}</Badge>;
      case "approved": return <Badge className="rounded-full border-none font-bold uppercase tracking-wider text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{t("pos.status.approved", "Đã phê duyệt")}</Badge>;
      case "rejected": return <Badge className="rounded-full border-none font-bold uppercase tracking-wider text-[10px] bg-rose-100 text-rose-700 hover:bg-rose-100">{t("pos.status.rejected", "Đã từ chối")}</Badge>;
      default: return <Badge className="rounded-full border-none font-bold uppercase tracking-wider text-[10px] bg-slate-100 text-slate-700 hover:bg-slate-100">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t("pos.registrations.title", "Quản lý Đăng ký Cửa hàng")}</h2>
          <p className="font-medium text-slate-500 mt-1">{t("pos.registrations.subtitle", "Theo dõi quy trình onboarding đối tác mới")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <Store className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <Card className="border border-slate-200 rounded-3xl shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder={t("pos.registrations.search", "Tìm kiếm đối tác...")} 
                className="pl-11 h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-primary/20 focus-visible:border-primary font-medium transition-all" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 px-6">{t("pos.registrations.partner", "Đối tác")}</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 px-6">{t("pos.registrations.contact", "Liên hệ")}</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 px-6">{t("pos.registrations.type", "Loại hình")}</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 px-6">{t("pos.registrations.status", "Trạng thái")}</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 px-6">{t("pos.registrations.date", "Ngày đăng ký")}</TableHead>
                  <TableHead className="text-right text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 px-6">{t("common.actions", "Thao tác")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                    <TableCell className="font-bold text-slate-900 px-6">{reg.partnerName}</TableCell>
                    <TableCell className="font-medium text-slate-600 px-6">{reg.partnerContact}</TableCell>
                    <TableCell className="font-bold text-[10px] uppercase tracking-widest text-slate-400 px-6">{reg.businessType}</TableCell>
                    <TableCell className="px-6">{getStatusBadge(reg.status)}</TableCell>
                    <TableCell className="font-medium text-slate-500 text-xs px-6">{reg.createdAt?.toDate().toLocaleDateString()}</TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2">
                        {reg.status === "pending_registration" && (
                          <Button 
                            size="sm" 
                            onClick={() => { setSelectedReg(reg); setIsVerifyOpen(true); }}
                            className="h-9 rounded-lg font-bold uppercase tracking-wider text-[10px] bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-all"
                          >
                            <Camera className="h-3.5 w-3.5 mr-2" /> {t("pos.registrations.verify", "Xác minh")}
                          </Button>
                        )}
                        {reg.status === "pending_contract" && (
                          <Button 
                            size="sm" 
                            onClick={() => {
                              updateDoc(doc(db, "store_registrations", reg.id), { status: "pending_approval" });
                            }}
                            className="h-9 rounded-lg font-bold uppercase tracking-wider text-[10px] bg-purple-500 text-white hover:bg-purple-600 shadow-sm transition-all"
                          >
                            <FileText className="h-3.5 w-3.5 mr-2" /> {t("pos.registrations.sign", "Ký HĐ")}
                          </Button>
                        )}
                        {reg.status === "pending_approval" && (
                          <Button 
                            size="sm" 
                            onClick={() => { setSelectedReg(reg); setIsApproveOpen(true); }}
                            className="h-9 rounded-lg font-bold uppercase tracking-wider text-[10px] bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-all"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-2" /> {t("pos.registrations.approve", "Phê duyệt")}
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-9 w-9 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
        <DialogContent className="max-w-xl rounded-3xl border-none p-0 overflow-hidden shadow-2xl bg-white">
          <DialogHeader className="bg-primary/5 p-8 border-b border-slate-100">
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">{t("pos.registrations.verifyTitle", "Xác minh Cửa hàng")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-8">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 ml-1">{t("pos.registrations.notes", "Ghi chú xác minh")}</Label>
              <Input 
                placeholder="Mô tả hiện trạng cửa hàng..." 
                value={verificationData.notes}
                onChange={e => setVerificationData({ ...verificationData, notes: e.target.value })}
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 ml-1">{t("pos.registrations.location", "Định vị cửa hàng")}</Label>
              <div className="h-48 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group hover:border-primary/30 transition-all">
                <MapPin className="h-10 w-10 text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Map Integration Placeholder</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 ml-1">{t("pos.registrations.photo", "Chụp ảnh xác minh")}</Label>
              <Button variant="outline" className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-primary/5 hover:border-primary/30 transition-all group">
                <Camera className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
              </Button>
            </div>
          </div>
          <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100 flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsVerifyOpen(false)}
              className="flex-1 rounded-xl font-bold uppercase tracking-wider text-xs h-12 border border-slate-200 hover:bg-slate-100 transition-all"
            >{t("common.cancel", "Hủy")}</Button>
            <Button 
              onClick={handleVerify}
              className="flex-1 rounded-xl font-bold uppercase tracking-wider text-xs h-12 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >{t("pos.registrations.submitVerify", "Hoàn tất xác minh")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="max-w-md rounded-3xl border-none p-0 overflow-hidden shadow-2xl bg-white">
          <DialogHeader className="bg-emerald-50 p-8 border-b border-emerald-100">
            <DialogTitle className="text-2xl font-bold tracking-tight text-emerald-900 leading-none">{t("pos.registrations.approveTitle", "Phê duyệt & Khởi tạo Cửa hàng")}</DialogTitle>
          </DialogHeader>
          <div className="p-10 text-center space-y-6">
            <div className="h-24 w-24 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
              <Store className="h-12 w-12 text-emerald-600" />
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              {t("pos.registrations.approveConfirm", "Xác nhận phê duyệt đối tác và khởi tạo hệ thống POS cho cửa hàng này?")}\n
              <span className="text-emerald-600 font-bold mt-2 block">Cửa hàng sẽ được kích hoạt ngay lập tức.</span>
            </p>
          </div>
          <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100 flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsApproveOpen(false)}
              className="flex-1 rounded-xl font-bold uppercase tracking-wider text-xs h-12 border border-slate-200 hover:bg-slate-100 transition-all"
            >{t("common.cancel", "Hủy")}</Button>
            <Button 
              onClick={handleApprove}
              className="flex-1 rounded-xl font-bold uppercase tracking-wider text-xs h-12 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
            >{t("pos.registrations.confirmApprove", "Xác nhận Phê duyệt")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
