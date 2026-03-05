import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { CheckCircle2, Store, Building2, Upload } from "lucide-react"

export function SellerRegistrationPage() {
  const { t } = useTranslation()
  const [sellerType, setSellerType] = useState<"personal" | "enterprise">("personal")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6 pb-8 px-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Đăng ký thành công!</h2>
            <p className="text-muted-foreground mb-6">
              Thông tin đăng ký của bạn đã được gửi đến hệ thống ERP. Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
            </p>
            <Button onClick={() => setIsSubmitted(false)} className="w-full">
              Đăng ký tài khoản khác
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Đăng ký Nhà bán hàng</h1>
        <p className="text-muted-foreground mt-2">
          Điền thông tin để trở thành đối tác bán hàng trên nền tảng của chúng tôi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loại hình kinh doanh</CardTitle>
          <CardDescription>Chọn loại hình kinh doanh phù hợp với bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue="personal" 
            onValueChange={(value) => setSellerType(value as "personal" | "enterprise")}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="personal" id="personal" className="peer sr-only" />
              <Label
                htmlFor="personal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Store className="mb-3 h-6 w-6" />
                <span className="font-semibold">Cá nhân / Hộ kinh doanh</span>
                <span className="text-sm text-muted-foreground mt-1 text-center">
                  Dành cho cá nhân bán hàng hoặc hộ kinh doanh cá thể
                </span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="enterprise" id="enterprise" className="peer sr-only" />
              <Label
                htmlFor="enterprise"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Building2 className="mb-3 h-6 w-6" />
                <span className="font-semibold">Doanh nghiệp</span>
                <span className="text-sm text-muted-foreground mt-1 text-center">
                  Dành cho công ty có giấy phép đăng ký kinh doanh
                </span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin {sellerType === "personal" ? "Cá nhân / Hộ kinh doanh" : "Doanh nghiệp"}</CardTitle>
            <CardDescription>Vui lòng cung cấp đầy đủ và chính xác thông tin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shopName">Tên cửa hàng <span className="text-red-500">*</span></Label>
                <Input id="shopName" required placeholder="Nhập tên cửa hàng hiển thị" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Ngành hàng chính <span className="text-red-500">*</span></Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngành hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Điện tử & Công nghệ</SelectItem>
                    <SelectItem value="fashion">Thời trang</SelectItem>
                    <SelectItem value="beauty">Sức khỏe & Làm đẹp</SelectItem>
                    <SelectItem value="home">Nhà cửa & Đời sống</SelectItem>
                    <SelectItem value="fmcg">Bách hóa tổng hợp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sellerType === "enterprise" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Tên công ty <span className="text-red-500">*</span></Label>
                    <Input id="companyName" required placeholder="Tên công ty trên GPKD" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Mã số thuế <span className="text-red-500">*</span></Label>
                    <Input id="taxId" required placeholder="Nhập mã số thuế" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="representative">Người đại diện pháp luật <span className="text-red-500">*</span></Label>
                    <Input id="representative" required placeholder="Họ và tên người đại diện" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                    <Input id="fullName" required placeholder="Nhập họ và tên" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idCard">Số CMND/CCCD <span className="text-red-500">*</span></Label>
                    <Input id="idCard" required placeholder="Nhập số CMND/CCCD" />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại liên hệ <span className="text-red-500">*</span></Label>
                <Input id="phone" required placeholder="Nhập số điện thoại" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email liên hệ <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" required placeholder="Nhập địa chỉ email" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ kinh doanh <span className="text-red-500">*</span></Label>
                <Textarea id="address" required placeholder="Nhập địa chỉ chi tiết" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Tài liệu xác minh (eKYC)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellerType === "enterprise" ? (
                  <div className="space-y-2">
                    <Label>Giấy phép kinh doanh <span className="text-red-500">*</span></Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Nhấn để tải lên hoặc kéo thả file</p>
                      <p className="text-xs text-muted-foreground mt-1">Hỗ trợ PDF, JPG, PNG (Tối đa 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Ảnh CMND/CCCD mặt trước <span className="text-red-500">*</span></Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Nhấn để tải lên</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ảnh CMND/CCCD mặt sau <span className="text-red-500">*</span></Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Nhấn để tải lên</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-4">
              <Button type="button" variant="outline">Hủy bỏ</Button>
              <Button type="submit">Gửi đăng ký</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
