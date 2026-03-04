import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { useTranslation } from "react-i18next"
import { CheckCircle2, ImagePlus, Video, ShoppingBag, MessageSquare, ShoppingCart } from "lucide-react"
import { cn } from "@/src/lib/utils"

export function AddProduct() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("basic")

  const suggestions = [
    { id: 1, text: t("products.add.sug1"), done: false },
    { id: 2, text: t("products.add.sug2"), done: false },
    { id: 3, text: t("products.add.sug3"), done: false },
    { id: 4, text: t("products.add.sug4"), done: false },
    { id: 5, text: t("products.add.sug5"), done: false },
  ]

  const tabs = [
    { id: "basic", label: t("products.add.tabs.basic") },
    { id: "description", label: t("products.add.tabs.description") },
    { id: "sales", label: t("products.add.tabs.sales") },
    { id: "shipping", label: t("products.add.tabs.shipping") },
    { id: "other", label: t("products.add.tabs.other") },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#f6f6f6] -m-6">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-medium">{t("products.add.title")}</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Suggestions */}
        <div className="w-64 bg-[#f6f6f6] border-r overflow-y-auto hidden lg:block">
          <div className="p-4">
            <h3 className="font-medium text-sm mb-4 bg-[#e8f0fe] text-[#1a73e8] p-3 rounded-md">
              {t("products.add.suggestions")}
            </h3>
            <ul className="space-y-4">
              {suggestions.map((sug) => (
                <li key={sug.id} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                  <span>{sug.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Tabs */}
            <div className="bg-white rounded-md shadow-sm border">
              <div className="flex border-b px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-6 py-4 text-sm font-medium transition-colors relative",
                      activeTab === tab.id
                        ? "text-[#ee4d2d] border-b-2 border-[#ee4d2d]"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-8">
                {/* Basic Info Section */}
                <div id="basic" className="space-y-6">
                  <h2 className="text-lg font-medium">{t("products.add.basicInfo")}</h2>
                  
                  {/* Product Images */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-[#ee4d2d]">*</span> {t("products.add.productImages")}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="ratio" className="text-[#ee4d2d] focus:ring-[#ee4d2d]" defaultChecked />
                          <span>{t("products.add.ratio11")}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="ratio" className="text-[#ee4d2d] focus:ring-[#ee4d2d]" />
                          <span>{t("products.add.ratio34")}</span>
                        </label>
                        <a href="#" className="text-[#1a73e8] hover:underline">{t("products.add.seeExample")}</a>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-24 h-24 border border-dashed border-[#ee4d2d] rounded flex flex-col items-center justify-center text-[#ee4d2d] cursor-pointer hover:bg-[#fff0ed] transition-colors">
                          <ImagePlus className="h-6 w-6 mb-1" />
                          <span className="text-[10px] text-center px-1">{t("products.add.addImage")}<br/>(0/9)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-[#ee4d2d]">*</span> {t("products.add.coverImage")}
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 border border-dashed border-[#ee4d2d] rounded flex flex-col items-center justify-center text-[#ee4d2d] cursor-pointer hover:bg-[#fff0ed] transition-colors shrink-0">
                        <ImagePlus className="h-6 w-6 mb-1" />
                        <span className="text-[10px]">(0/1)</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1 pt-1">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>{t("products.add.coverImageHint1")}</li>
                          <li>{t("products.add.coverImageHint2")}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Product Video */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      {t("products.add.productVideo")}
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 border border-dashed rounded flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted transition-colors shrink-0">
                        <Video className="h-6 w-6 mb-1 text-[#ee4d2d]" />
                        <span className="text-[10px] text-[#ee4d2d]">{t("products.add.addVideo")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1 pt-1">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>{t("products.add.videoHint1")}</li>
                          <li>{t("products.add.videoHint2")}</li>
                          <li>{t("products.add.videoHint3")}</li>
                          <li>{t("products.add.videoHint4")}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-[#ee4d2d]">*</span> {t("products.add.productName")}
                    </div>
                    <div>
                      <div className="relative">
                        <Input placeholder={t("products.add.productNamePlaceholder")} className="pr-16" />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">0/120</span>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-[#ee4d2d]">*</span> {t("products.add.category")}
                    </div>
                    <div>
                      <Input placeholder={t("products.add.selectCategory")} className="cursor-pointer" readOnly />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div id="description" className="space-y-6 pt-8 border-t">
                  <h2 className="text-lg font-medium">{t("products.add.description")}</h2>
                  
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-[#ee4d2d]">*</span> {t("products.add.productDescription")}
                    </div>
                    <div>
                      <div className="relative">
                        <Textarea 
                          placeholder={t("products.add.descriptionPlaceholder")} 
                          className="min-h-[200px] resize-y pb-8"
                        />
                        <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">0/3000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disabled Sections */}
                <div className="space-y-6 pt-8 border-t opacity-50 pointer-events-none">
                  <h2 className="text-lg font-medium">{t("products.add.salesInfo")}</h2>
                  <p className="text-sm text-muted-foreground">{t("products.add.salesInfoHint")}</p>
                </div>

                <div className="space-y-6 pt-8 border-t opacity-50 pointer-events-none">
                  <h2 className="text-lg font-medium">{t("products.add.shipping")}</h2>
                  <p className="text-sm text-muted-foreground">{t("products.add.shippingHint")}</p>
                </div>

                <div className="space-y-6 pt-8 border-t opacity-50 pointer-events-none">
                  <h2 className="text-lg font-medium">{t("products.add.otherInfo")}</h2>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Preview */}
        <div className="w-80 bg-white border-l hidden xl:flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium">{t("products.add.preview")}</h3>
            <p className="text-xs text-muted-foreground">{t("products.add.productDetails")}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-[#f6f6f6]">
            {/* Mobile Mockup */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border mx-auto max-w-[280px]">
              {/* Image placeholder */}
              <div className="aspect-square bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              </div>
              
              <div className="p-3 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                
                <div className="pt-2 border-t flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted"></div>
                  <div className="text-xs font-medium">Lucky Shop App</div>
                  <div className="ml-auto text-[10px] border px-2 py-0.5 rounded text-[#ee4d2d] border-[#ee4d2d]">Xem</div>
                </div>
              </div>
              
              <div className="flex border-t">
                <div className="flex-1 flex items-center justify-center py-2 bg-[#00bfa5] text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1 flex items-center justify-center py-2 bg-[#00bfa5] text-white border-l border-white/20">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="flex-[2] flex items-center justify-center py-2 bg-[#ee4d2d] text-white text-sm font-medium">
                  {t("products.add.buyNow")}
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground mt-4 px-4">
              {t("products.add.previewHint")}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="bg-white border-t p-4 flex items-center justify-end gap-3 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button variant="outline">{t("products.add.cancel")}</Button>
        <Button variant="outline">{t("products.add.saveHidden")}</Button>
        <Button className="bg-[#ee4d2d] hover:bg-[#d73211] text-white">{t("products.add.savePublish")}</Button>
      </div>
    </div>
  )
}
