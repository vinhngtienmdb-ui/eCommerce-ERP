import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { db, auth } from "@/src/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";

export function POSProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    stock: 0,
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "products"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "products");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: 0, category: "", stock: 0 });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name || "", 
      price: product.price || product.currentPrice || 0, 
      category: product.category || "", 
      stock: product.stock || 0 
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    
    try {
      if (editingProduct) {
        const docRef = doc(db, "products", editingProduct.id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        toast.success(t("pos.products.editSuccess", "Đã cập nhật sản phẩm"));
      } else {
        await addDoc(collection(db, "products"), {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          creatorId: auth.currentUser?.uid
        });
        toast.success(t("pos.products.addSuccess", "Đã thêm sản phẩm mới"));
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.WRITE, editingProduct ? `products/${editingProduct.id}` : "products");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t("pos.products.deleteConfirm", "Bạn có chắc chắn muốn xóa sản phẩm này?"))) return;
    
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success(t("pos.products.deleteSuccess", "Đã xóa sản phẩm"));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("pos.products.title", "Sản phẩm & Dịch vụ")}</h2>
          <p className="text-muted-foreground">{t("pos.products.subtitle", "Quản lý danh mục hàng hóa của cửa hàng")}</p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> {t("pos.products.add", "Thêm sản phẩm")}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("pos.products.search", "Tìm kiếm sản phẩm...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pos.products.name", "Tên sản phẩm")}</TableHead>
                <TableHead>{t("pos.products.category", "Danh mục")}</TableHead>
                <TableHead>{t("pos.products.price", "Giá bán")}</TableHead>
                <TableHead>{t("pos.products.stock", "Tồn kho")}</TableHead>
                <TableHead className="text-right">{t("pos.products.actions", "Thao tác")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price.toLocaleString()}đ</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên sản phẩm</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Input 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                placeholder="Nhập danh mục"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Giá bán (đ)</Label>
                <Input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Tồn kho</Label>
                <Input 
                  type="number" 
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveProduct}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
