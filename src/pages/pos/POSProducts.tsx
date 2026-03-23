import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Plus, Search, Edit, Trash2, Loader2, Upload, Sparkles, Image as ImageIcon, Filter } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Badge } from "@/src/components/ui/badge";
import { db, auth } from "@/src/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { GoogleGenAI } from "@google/genai";

export function POSProducts({ storeId, branchId }: { storeId: string; branchId?: string }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedL1, setSelectedL1] = useState<string[]>([]);
  const [selectedL2, setSelectedL2] = useState<string[]>([]);
  const [selectedL3, setSelectedL3] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    productName: "",
    price: 0,
    category: "",
    categoryLevel1: "",
    categoryLevel2: "",
    categoryLevel3: "",
    stock: 0,
    image: "",
    description: "",
  });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const generateAIImage = async () => {
    if (!formData.productName) {
      toast.error(t("pos.products.errorMissingName", "Vui lòng nhập tên sản phẩm để tạo ảnh AI"));
      return;
    }

    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [{ text: `A high-quality, professional product photo of ${formData.productName} for a ${formData.category || 'store'} menu, isolated on a clean background, appetizing and realistic.` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        const base64 = `data:image/png;base64,${imagePart.inlineData.data}`;
        setFormData(prev => ({ ...prev, image: base64 }));
        toast.success(t("pos.products.aiSuccess", "Đã tạo ảnh AI thành công!"));
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error("AI Generation error:", error);
      toast.error(t("pos.products.aiError", "Không thể tạo ảnh AI lúc này"));
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!auth.currentUser || !storeId) return;

    const productsPath = branchId 
      ? `stores/${storeId}/branches/${branchId}/products` 
      : `stores/${storeId}/products`;

    const q = query(collection(db, productsPath), orderBy("productName", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, productsPath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId, branchId]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.productName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesL1 = selectedL1.length === 0 || selectedL1.includes(p.categoryLevel1);
    const matchesL2 = selectedL2.length === 0 || selectedL2.includes(p.categoryLevel2);
    const matchesL3 = selectedL3.length === 0 || selectedL3.includes(p.categoryLevel3);
    return matchesSearch && matchesL1 && matchesL2 && matchesL3;
  });

  const uniqueL1 = Array.from(new Set(products.map(p => p.categoryLevel1).filter(Boolean))) as string[];
  const uniqueL2 = Array.from(new Set(products.map(p => p.categoryLevel2).filter(Boolean))) as string[];
  const uniqueL3 = Array.from(new Set(products.map(p => p.categoryLevel3).filter(Boolean))) as string[];

  const FilterPopover = ({ label, options, selected, onChange }: { 
    label: string, 
    options: string[], 
    selected: string[], 
    onChange: (val: string[]) => void 
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Filter className="h-4 w-4" />
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1 font-normal">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2" align="start">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {options.length === 0 && <p className="text-xs text-muted-foreground p-2">Không có dữ liệu</p>}
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded">
              <Checkbox 
                id={`${label}-${option}`} 
                checked={selected.includes(option)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selected, option]);
                  } else {
                    onChange(selected.filter(s => s !== option));
                  }
                }}
              />
              <label 
                htmlFor={`${label}-${option}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ 
      productName: "", 
      price: 0, 
      category: "", 
      categoryLevel1: "",
      categoryLevel2: "",
      categoryLevel3: "",
      stock: 0, 
      image: "", 
      description: "" 
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({ 
      productName: product.productName || "", 
      price: product.price || product.suggestedPrice || 0, 
      category: Array.isArray(product.category) ? product.category[0] : (product.category || ""), 
      categoryLevel1: product.categoryLevel1 || "",
      categoryLevel2: product.categoryLevel2 || "",
      categoryLevel3: product.categoryLevel3 || "",
      stock: product.stock || 0,
      image: product.image || (product.images?.[0]?.url || ""),
      description: product.description || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.productName) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    
    try {
      const productsPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/products` 
        : `stores/${storeId}/products`;

      const productData = {
        productName: formData.productName,
        price: Number(formData.price),
        category: [formData.category],
        categoryLevel1: formData.categoryLevel1,
        categoryLevel2: formData.categoryLevel2,
        categoryLevel3: formData.categoryLevel3,
        stock: Number(formData.stock),
        image: formData.image,
        description: formData.description,
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        const docRef = doc(db, `${productsPath}/${editingProduct.id}`);
        await updateDoc(docRef, productData);
        toast.success(t("pos.products.editSuccess", "Đã cập nhật sản phẩm"));
      } else {
        await addDoc(collection(db, productsPath), {
          ...productData,
          createdAt: new Date().toISOString(),
          userId: auth.currentUser?.uid || 'anonymous'
        });
        toast.success(t("pos.products.addSuccess", "Đã thêm sản phẩm mới"));
      }
      setIsModalOpen(false);
    } catch (error) {
      const productsPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/products` 
        : `stores/${storeId}/products`;
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.WRITE, editingProduct ? `${productsPath}/${editingProduct.id}` : productsPath);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t("pos.products.deleteConfirm", "Bạn có chắc chắn muốn xóa sản phẩm này?"))) return;
    
    try {
      const productsPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/products` 
        : `stores/${storeId}/products`;
      await deleteDoc(doc(db, `${productsPath}/${id}`));
      toast.success(t("pos.products.deleteSuccess", "Đã xóa sản phẩm"));
    } catch (error) {
      const productsPath = branchId 
        ? `stores/${storeId}/branches/${branchId}/products` 
        : `stores/${storeId}/products`;
      handleFirestoreError(error, OperationType.DELETE, `${productsPath}/${id}`);
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
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("pos.products.search", "Tìm kiếm sản phẩm...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <FilterPopover 
                label="Cấp 1" 
                options={uniqueL1} 
                selected={selectedL1} 
                onChange={setSelectedL1} 
              />
              <FilterPopover 
                label="Cấp 2" 
                options={uniqueL2} 
                selected={selectedL2} 
                onChange={setSelectedL2} 
              />
              <FilterPopover 
                label="Cấp 3" 
                options={uniqueL3} 
                selected={selectedL3} 
                onChange={setSelectedL3} 
              />
              {(selectedL1.length > 0 || selectedL2.length > 0 || selectedL3.length > 0) && (
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedL1([]);
                  setSelectedL2([]);
                  setSelectedL3([]);
                }}>
                  Xóa lọc
                </Button>
              )}
            </div>
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
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell>{Array.isArray(product.category) ? product.category.join(", ") : product.category}</TableCell>
                  <TableCell>{(product.price || product.suggestedPrice || 0).toLocaleString()}đ</TableCell>
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
                value={formData.productName} 
                onChange={(e) => setFormData({...formData, productName: e.target.value})} 
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cấp 1</Label>
                <Input 
                  value={formData.categoryLevel1} 
                  onChange={(e) => setFormData({...formData, categoryLevel1: e.target.value})} 
                  placeholder="Cấp 1"
                />
              </div>
              <div className="space-y-2">
                <Label>Cấp 2</Label>
                <Input 
                  value={formData.categoryLevel2} 
                  onChange={(e) => setFormData({...formData, categoryLevel2: e.target.value})} 
                  placeholder="Cấp 2"
                />
              </div>
              <div className="space-y-2">
                <Label>Cấp 3</Label>
                <Input 
                  value={formData.categoryLevel3} 
                  onChange={(e) => setFormData({...formData, categoryLevel3: e.target.value})} 
                  placeholder="Cấp 3"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả sản phẩm</Label>
              <Input 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("pos.products.image", "Hình ảnh sản phẩm")}</Label>
              <div className="flex flex-col gap-4">
                <div className="h-40 w-full bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 relative group">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" className="relative">
                      <Upload className="h-4 w-4 mr-2" /> {t("common.upload", "Tải lên")}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={generateAIImage} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" /> {t("common.aiGenerate", "AI Tạo ảnh")}</>}
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center italic">
                  {t("pos.products.imageHint", "Tải ảnh lên hoặc dùng AI để tạo ảnh từ tên sản phẩm")}
                </p>
              </div>
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
