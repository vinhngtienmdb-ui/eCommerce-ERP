import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

const INITIAL_PRODUCTS = [
  { id: "1", name: "Cà phê sữa đá", price: 25000, category: "Đồ uống", stock: 50 },
  { id: "2", name: "Trà đào cam sả", price: 35000, category: "Đồ uống", stock: 30 },
  { id: "3", name: "Bánh mì thịt nướng", price: 20000, category: "Đồ ăn", stock: 20 },
];

export function POSProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("pos.products.title", "Sản phẩm & Dịch vụ")}</h2>
          <p className="text-muted-foreground">{t("pos.products.subtitle", "Quản lý danh mục hàng hóa của cửa hàng")}</p>
        </div>
        <Button>
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
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
