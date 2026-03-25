import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Plus, Search, Edit, Trash2, Loader2, Upload, Sparkles, Image as ImageIcon, Filter } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Badge } from "@/src/components/ui/badge";
import { db, auth } from "@/src/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { GoogleGenAI } from "@google/genai";

const FilterPopover = ({ label, options, selected, onChange }: { 
  label: string, 
  options: string[], 
  selected: string[], 
  onChange: (val: string[]) => void 
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm" className="h-11 gap-2 rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-xs shadow-sm">
        <Filter className="h-4 w-4 text-slate-400" />
        {label}
        {selected.length > 0 && (
          <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-none px-1.5 py-0 rounded-md text-[10px] font-bold">
            {selected.length}
          </Badge>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-72 p-0 rounded-2xl border-none shadow-2xl bg-white overflow-hidden" align="start">
      <div className="p-4 bg-slate-50 text-slate-900 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
        Lọc theo {label}
      </div>
      <div className="p-2 space-y-1 max-h-80 overflow-y-auto scrollbar-hide">
        {options.length === 0 && <p className="text-xs font-medium text-slate-400 p-4 text-center italic">Không có dữ liệu</p>}
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
            <Checkbox 
              id={`${label}-${option}`} 
              checked={selected.includes(option)}
              className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
              className="text-sm font-medium text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 group-hover:text-slate-900"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

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
      let apiKey = "";
      try {
        apiKey = process.env.GEMINI_API_KEY || "";
      } catch (e) {
        console.warn("process is not defined");
      }
      
      if (!apiKey) {
        toast.error("API Key is missing");
        setIsGenerating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
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
      category: (Array.isArray(product.category) ? product.category[0] : product.category) || "", 
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{t("pos.products.title", "Sản phẩm & Dịch vụ")}</h2>
          <p className="text-sm text-slate-500 font-medium mt-2">{t("pos.products.subtitle", "Quản lý danh mục hàng hóa của cửa hàng")}</p>
        </div>
        <Button 
          onClick={handleAddProduct} 
          className="rounded-xl h-12 px-8 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 font-bold transition-all"
        >
          <Plus className="mr-2 h-5 w-5" /> {t("pos.products.add", "Thêm sản phẩm")}
        </Button>
      </div>

      <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <CardHeader className="pb-6 px-8 pt-8 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("pos.products.search", "Tìm kiếm sản phẩm...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 rounded-xl bg-white border-slate-200 focus-visible:ring-primary/20 font-medium text-sm shadow-sm"
              />
            </div>
            
            <div className="flex gap-3">
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 px-4 h-11" 
                  onClick={() => {
                    setSelectedL1([]);
                    setSelectedL2([]);
                    setSelectedL3([]);
                  }}
                >
                  Xóa lọc
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200 bg-slate-50">
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-8">{t("pos.products.name", "Tên sản phẩm")}</TableHead>
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-8">{t("pos.products.category", "Danh mục")}</TableHead>
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-8">{t("pos.products.price", "Giá bán")}</TableHead>
                <TableHead className="h-12 text-xs uppercase tracking-wider font-bold text-slate-500 px-8">{t("pos.products.stock", "Tồn kho")}</TableHead>
                <TableHead className="h-12 text-right text-xs uppercase tracking-wider font-bold text-slate-500 px-8">{t("pos.products.actions", "Thao tác")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-slate-400 font-medium text-sm italic">
                    Không tìm thấy sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="font-bold text-slate-900 py-6 px-8 text-sm">{product.productName}</TableCell>
                    <TableCell className="text-slate-500 font-medium text-xs px-8">
                      {Array.isArray(product.category) ? product.category.join(" / ") : product.category}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 px-8 text-base">
                      {(product.price || product.suggestedPrice || 0).toLocaleString()}đ
                    </TableCell>
                    <TableCell className="px-8">
                      <Badge variant="secondary" className="font-mono font-bold text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 transition-all" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-rose-100 text-rose-500 hover:bg-rose-50 transition-all" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby="dialog-description" className="sm:max-w-2xl p-0 rounded-2xl border-none shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
            <DialogDescription id="dialog-description" className="text-sm font-medium text-slate-500 mt-2">
              Điền thông tin chi tiết của sản phẩm để quản lý kho và bán hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Tên sản phẩm</Label>
                <Input 
                  value={formData.productName} 
                  onChange={(e) => setFormData({...formData, productName: e.target.value})} 
                  placeholder="Nhập tên sản phẩm"
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Danh mục chính</Label>
                <Input 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  placeholder="Nhập danh mục"
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-sm transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Cấp 1</Label>
                <Input 
                  value={formData.categoryLevel1} 
                  onChange={(e) => setFormData({...formData, categoryLevel1: e.target.value})} 
                  placeholder="Cấp 1"
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-xs transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Cấp 2</Label>
                <Input 
                  value={formData.categoryLevel2} 
                  onChange={(e) => setFormData({...formData, categoryLevel2: e.target.value})} 
                  placeholder="Cấp 2"
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-xs transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Cấp 3</Label>
                <Input 
                  value={formData.categoryLevel3} 
                  onChange={(e) => setFormData({...formData, categoryLevel3: e.target.value})} 
                  placeholder="Cấp 3"
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-medium text-xs transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 ml-1">Mô tả sản phẩm</Label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Nhập mô tả sản phẩm"
                className="flex min-h-[100px] w-full rounded-xl bg-slate-50/50 border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 ml-1">{t("pos.products.image", "Hình ảnh sản phẩm")}</Label>
              <div className="flex flex-col gap-4">
                <div className="h-64 w-full bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 relative group shadow-sm">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-slate-200" />
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <Button variant="secondary" size="sm" className="relative h-10 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-white/90 shadow-lg" asChild>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" /> {t("common.upload", "Tải lên")}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                      </label>
                    </Button>
                    <Button variant="secondary" size="sm" className="h-10 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary/90 shadow-lg" onClick={generateAIImage} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" /> {t("common.aiGenerate", "AI Tạo ảnh")}</>}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 text-center font-medium italic">
                  {t("pos.products.imageHint", "Tải ảnh lên hoặc dùng AI để tạo ảnh từ tên sản phẩm")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Giá bán (đ)</Label>
                <Input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                  className="h-14 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-bold text-primary text-2xl transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-1">Tồn kho</Label>
                <Input 
                  type="number" 
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} 
                  className="h-14 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 font-bold text-slate-900 text-2xl transition-all"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 gap-3">
            <Button variant="outline" className="rounded-xl h-12 px-8 border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-all" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveProduct} className="rounded-xl h-12 px-12 font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20">Lưu sản phẩm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
