import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { toast } from "sonner";
import { db, auth } from "@/src/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { Loader2, Save } from "lucide-react";

export function DocumentSettingsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    autoNumbering: true,
    prefix: "CV",
    currentNumber: 1,
    suffix: "CTY",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "settings", "documents");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "settings/documents");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "documents"), settings);
      toast.success("Đã lưu cài đặt văn bản");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/documents");
    } finally {
      setSaving(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt văn bản</h1>
        <p className="text-muted-foreground">Cấu hình đánh số tự động và các tham số hệ thống văn bản.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cấu hình đánh số tự động</CardTitle>
          <CardDescription>Thiết lập quy tắc sinh số hiệu văn bản tự động.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bật đánh số tự động</Label>
              <p className="text-sm text-muted-foreground">Tự động sinh số hiệu khi tạo văn bản mới.</p>
            </div>
            <Switch
              checked={settings.autoNumbering}
              onCheckedChange={(checked) => setSettings({ ...settings, autoNumbering: checked })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tiền tố (Prefix)</Label>
              <Input
                value={settings.prefix}
                onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
                placeholder="VD: CV"
              />
            </div>
            <div className="space-y-2">
              <Label>Số hiện tại</Label>
              <Input
                type="number"
                value={settings.currentNumber}
                onChange={(e) => setSettings({ ...settings, currentNumber: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hậu tố (Suffix)</Label>
              <Input
                value={settings.suffix}
                onChange={(e) => setSettings({ ...settings, suffix: e.target.value })}
                placeholder="VD: CTY"
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <Label className="text-xs uppercase text-muted-foreground">Xem trước định dạng</Label>
            <div className="text-xl font-mono mt-1">
              {settings.currentNumber}/{settings.prefix}-{settings.suffix}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Lưu cài đặt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
