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
      console.error("Error verifying registration:", error);
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
      console.error("Error approving registration:", error);
      toast.error(t("pos.registrations.approveError", "Có lỗi xảy ra khi phê duyệt"));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_registration": return <Badge variant="outline">{t("pos.status.pending", "Chờ xác minh")}</Badge>;
      case "pending_verification": return <Badge variant="secondary">{t("pos.status.verifying", "Đang xác minh")}</Badge>;
      case "pending_contract": return <Badge className="bg-blue-500">{t("pos.status.contract", "Chờ ký HĐ")}</Badge>;
      case "pending_approval": return <Badge className="bg-orange-500">{t("pos.status.approval", "Chờ phê duyệt")}</Badge>;
      case "approved": return <Badge className="bg-green-500">{t("pos.status.approved", "Đã phê duyệt")}</Badge>;
      case "rejected": return <Badge variant="destructive">{t("pos.status.rejected", "Đã từ chối")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("pos.registrations.title", "Quản lý Đăng ký Cửa hàng")}</h2>
          <p className="text-muted-foreground">{t("pos.registrations.subtitle", "Theo dõi quy trình onboarding đối tác mới")}</p>
        </div>
      </div>

      <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("pos.registrations.search", "Tìm kiếm đối tác...")} className="pl-10 rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead>{t("pos.registrations.partner", "Đối tác")}</TableHead>
                <TableHead>{t("pos.registrations.contact", "Liên hệ")}</TableHead>
                <TableHead>{t("pos.registrations.type", "Loại hình")}</TableHead>
                <TableHead>{t("pos.registrations.status", "Trạng thái")}</TableHead>
                <TableHead>{t("pos.registrations.date", "Ngày đăng ký")}</TableHead>
                <TableHead className="text-right">{t("common.actions", "Thao tác")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                  <TableCell className="font-medium">{reg.partnerName}</TableCell>
                  <TableCell>{reg.partnerContact}</TableCell>
                  <TableCell>{reg.businessType}</TableCell>
                  <TableCell>{getStatusBadge(reg.status)}</TableCell>
                  <TableCell>{reg.createdAt?.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {reg.status === "pending_registration" && (
                        <Button size="sm" onClick={() => { setSelectedReg(reg); setIsVerifyOpen(true); }}>
                          <Camera className="h-4 w-4 mr-2" /> {t("pos.registrations.verify", "Xác minh")}
                        </Button>
                      )}
                      {reg.status === "pending_contract" && (
                        <Button size="sm" variant="secondary" onClick={() => {
                          updateDoc(doc(db, "store_registrations", reg.id), { status: "pending_approval" });
                        }}>
                          <FileText className="h-4 w-4 mr-2" /> {t("pos.registrations.sign", "Ký HĐ")}
                        </Button>
                      )}
                      {reg.status === "pending_approval" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { setSelectedReg(reg); setIsApproveOpen(true); }}>
                          <CheckCircle className="h-4 w-4 mr-2" /> {t("pos.registrations.approve", "Phê duyệt")}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
        <DialogContent className="max-w-xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>{t("pos.registrations.verifyTitle", "Xác minh Cửa hàng")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("pos.registrations.notes", "Ghi chú xác minh")}</Label>
              <Input 
                placeholder="Mô tả hiện trạng cửa hàng..." 
                value={verificationData.notes}
                onChange={e => setVerificationData({ ...verificationData, notes: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("pos.registrations.location", "Định vị cửa hàng")}</Label>
              <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
                <MapPin className="h-8 w-8 text-primary opacity-50" />
                <span className="ml-2 text-slate-500">Map Integration Placeholder</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("pos.registrations.photo", "Chụp ảnh xác minh")}</Label>
              <Button variant="outline" className="w-full h-24 border-dashed rounded-xl">
                <Camera className="h-8 w-8 text-slate-400" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsVerifyOpen(false)}>{t("common.cancel", "Hủy")}</Button>
            <Button onClick={handleVerify}>{t("pos.registrations.submitVerify", "Hoàn tất xác minh")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{t("pos.registrations.approveTitle", "Phê duyệt & Khởi tạo Cửa hàng")}</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Store className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-slate-600">
              {t("pos.registrations.approveConfirm", "Xác nhận phê duyệt đối tác và khởi tạo hệ thống POS cho cửa hàng này?")}
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsApproveOpen(false)}>{t("common.cancel", "Hủy")}</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>{t("pos.registrations.confirmApprove", "Xác nhận Phê duyệt")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
