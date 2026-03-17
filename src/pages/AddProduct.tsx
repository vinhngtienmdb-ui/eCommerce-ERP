import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { useTranslation } from "react-i18next"
import { CheckCircle2, ImagePlus, Video, ShoppingBag, MessageSquare, ShoppingCart, ChevronDown, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { toast } from "sonner"
import { GoogleGenAI } from "@google/genai"

export function AddProduct() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("basic")
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateDescription = async () => {
    if (!productName) {
      toast.error(t("products.add.nameRequiredForAi"))
      return
    }

    setIsGenerating(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional, engaging product description for an e-commerce site. 
        Product Name: ${productName}
        Language: ${t("common.languageCode") || "Vietnamese"}
        Format: Markdown with bullet points for features.`,
      })
      
      if (response.text) {
        setDescription(response.text)
        toast.success(t("products.add.aiGeneratedSuccess"))
      }
    } catch (error) {
      console.error("AI Generation Error:", error)
      toast.error(t("products.add.aiGeneratedError"))
    } finally {
      setIsGenerating(false)
    }
  }

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("products.add.title")}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Suggestions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-primary">
                {t("products.add.suggestions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {suggestions.map((sug) => (
                  <li key={sug.id} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                    <span>{sug.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="border-b">
              <div className="flex px-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap",
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <CardContent className="p-6 space-y-8">
              {/* Basic Info Section */}
              <div id="basic" className="space-y-6">
                <h3 className="text-lg font-medium">{t("products.add.basicInfo")}</h3>
                
                {/* Product Images */}
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-sm font-medium pt-2">
                    <span className="text-destructive">*</span> {t("products.add.productImages")}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="ratio" className="text-primary focus:ring-primary" defaultChecked />
                        <span>{t("products.add.ratio11")}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="ratio" className="text-primary focus:ring-primary" />
                        <span>{t("products.add.ratio34")}</span>
                      </label>
                      <a href="#" className="text-primary hover:underline">{t("products.add.seeExample")}</a>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-24 h-24 border border-dashed border-primary rounded flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                        <ImagePlus className="h-6 w-6 mb-1" />
                        <span className="text-[10px] text-center px-1">{t("products.add.addImage")}<br/>(0/9)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-sm font-medium pt-2">
                    <span className="text-destructive">*</span> {t("products.add.coverImage")}
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 border border-dashed border-primary rounded flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors shrink-0">
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
                      <Video className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-[10px] text-primary">{t("products.add.addVideo")}</span>
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
                    <span className="text-destructive">*</span> {t("products.add.productName")}
                  </div>
                  <div>
                    <div className="relative">
                      <Input 
                        placeholder={t("products.add.productNamePlaceholder")} 
                        className="pr-16" 
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">{productName.length}/120</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-sm font-medium pt-2">
                    <span className="text-destructive">*</span> {t("products.add.category")}
                  </div>
                  <div>
                    <Input placeholder={t("products.add.selectCategory")} className="cursor-pointer" readOnly />
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div id="description" className="space-y-6 pt-8 border-t">
                <h3 className="text-lg font-medium">{t("products.add.description")}</h3>
                
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-sm font-medium pt-2">
                    <span className="text-destructive">*</span> {t("products.add.productDescription")}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full gap-2 text-xs h-8 border-primary/50 text-primary hover:bg-primary/5"
                      onClick={generateDescription}
                      disabled={isGenerating}
                    >
                      {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      {t("products.add.generateWithAi")}
                    </Button>
                  </div>
                  <div>
                    <div className="relative">
                      <Textarea 
                        placeholder={t("products.add.descriptionPlaceholder")} 
                        className="min-h-[200px] resize-y pb-8"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">{description.length}/3000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disabled Sections */}
              <div 
                className="space-y-6 pt-8 border-t opacity-50 cursor-not-allowed"
                onClick={() => toast.info(t("common.featureComingSoon"))}
              >
                <h3 className="text-lg font-medium">{t("products.add.salesInfo")}</h3>
                <p className="text-sm text-muted-foreground">{t("products.add.salesInfoHint")}</p>
              </div>

              <div 
                className="space-y-6 pt-8 border-t opacity-50 cursor-not-allowed"
                onClick={() => toast.info(t("common.featureComingSoon"))}
              >
                <h3 className="text-lg font-medium">{t("products.add.shipping")}</h3>
                <p className="text-sm text-muted-foreground">{t("products.add.shippingHint")}</p>
              </div>

              <div 
                className="space-y-6 pt-8 border-t opacity-50 cursor-not-allowed"
                onClick={() => toast.info(t("common.featureComingSoon"))}
              >
                <h3 className="text-lg font-medium">{t("products.add.otherInfo")}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader className="border-b">
              <CardTitle className="text-sm font-medium">{t("products.add.preview")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-muted/20">
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
                    <div className="ml-auto text-[10px] border px-2 py-0.5 rounded text-primary border-primary">Xem</div>
                  </div>
                </div>
                
                <div className="flex border-t">
                  <div className="flex-1 flex items-center justify-center py-2 bg-primary/80 text-white">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 flex items-center justify-center py-2 bg-primary/80 text-white border-l border-white/20">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div className="flex-[2] flex items-center justify-center py-2 bg-primary text-white text-sm font-medium">
                    {t("products.add.buyNow")}
                  </div>
                </div>
              </div>
              
              <p className="text-[10px] text-center text-muted-foreground mt-4 px-4">
                {t("products.add.previewHint")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="bg-card border-t p-4 flex items-center justify-end gap-3 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-xl">
        <Button variant="outline" onClick={() => toast.info(t("common.featureComingSoon"))}>{t("products.add.cancel")}</Button>
        <Button variant="outline" onClick={() => toast.info(t("common.featureComingSoon"))}>{t("products.add.saveHidden")}</Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => toast.info(t("common.featureComingSoon"))}>{t("products.add.savePublish")}</Button>
      </div>
    </div>
  )
}
