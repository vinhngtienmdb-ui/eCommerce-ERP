import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { useTranslation } from "react-i18next"
import { CheckCircle2, ImagePlus, Video, ShoppingBag, MessageSquare, ShoppingCart, ChevronDown, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Switch } from "@/src/components/ui/switch"
import { toast } from "sonner"
import { GoogleGenAI } from "@google/genai"
import { useSettingsStore } from "@/src/store/useSettingsStore"
import { initialPlatformFees } from "@/src/data/fees"
import { X, Plus } from "lucide-react"

export function AddProduct() {
  const { t } = useTranslation()
  const { settings, fetchSettings } = useSettingsStore()
  
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const [activeTab, setActiveTab] = useState("basic")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [baseName, setBaseName] = useState("")
  const [specifications, setSpecifications] = useState("")
  const [productName, setProductName] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [suggestedPrice, setSuggestedPrice] = useState("")
  const [platformFee, setPlatformFee] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [selectedLevel1, setSelectedLevel1] = useState<string>("")
  const [selectedLevel2, setSelectedLevel2] = useState<string>("")
  const [selectedLevel3, setSelectedLevel3] = useState<string>("")

  const [images, setImages] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<string | null>(null)
  
  // Sales
  const [variants, setVariants] = useState<{name: string, options: string[]}[]>([])
  const [combinations, setCombinations] = useState<{id: string, options: Record<string, string>, price: string, stock: string, sku: string}[]>([])

  // Shipping
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")

  // Other
  const [condition, setCondition] = useState("new")
  const [isPreOrder, setIsPreOrder] = useState(false)
  const [prepTime, setPrepTime] = useState("2")

  const categories = settings?.categories?.length > 0 ? settings.categories : initialPlatformFees

  const level1Options = Array.from(new Set(categories.map((c: any) => c.level1))).filter(Boolean)
  const level2Options = Array.from(new Set(categories.filter((c: any) => c.level1 === selectedLevel1).map((c: any) => c.level2))).filter(Boolean)
  const level3Options = Array.from(new Set(categories.filter((c: any) => c.level1 === selectedLevel1 && c.level2 === selectedLevel2).map((c: any) => c.level3))).filter(Boolean)

  // Auto-generate full product name
  const updateProductName = (b: string, m: string, bn: string, s: string) => {
    setProductName(`${b} ${m} ${bn} ${s}`.trim())
  }

  const handleBrandChange = (val: string) => { setBrand(val); updateProductName(val, model, baseName, specifications); }
  const handleModelChange = (val: string) => { setModel(val); updateProductName(brand, val, baseName, specifications); }
  const handleBaseNameChange = (val: string) => { setBaseName(val); updateProductName(brand, model, val, specifications); }
  const handleSpecsChange = (val: string) => { setSpecifications(val); updateProductName(brand, model, baseName, val); }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages].slice(0, 9))
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(URL.createObjectURL(e.target.files[0]))
    }
  }

  useEffect(() => {
    // Generate combinations
    if (variants.length === 0) {
      setCombinations([])
      return
    }

    const validVariants = variants.filter(v => v.name.trim() !== '' && v.options.some(o => o.trim() !== ''))
    if (validVariants.length === 0) {
      setCombinations([])
      return
    }

    let newCombs: any[] = [{ options: {} }]
    
    validVariants.forEach(variant => {
      const validOptions = variant.options.filter(o => o.trim() !== '')
      if (validOptions.length === 0) return

      const temp: any[] = []
      newCombs.forEach(comb => {
        validOptions.forEach(opt => {
          temp.push({
            options: { ...comb.options, [variant.name]: opt },
            price: '',
            stock: '',
            sku: ''
          })
        })
      })
      newCombs = temp
    })

    // Merge with existing combinations to preserve data
    const merged = newCombs.map(nc => {
      const existing = combinations.find(c => JSON.stringify(c.options) === JSON.stringify(nc.options))
      return existing ? existing : { ...nc, id: Math.random().toString(36).substr(2, 9) }
    })

    setCombinations(merged)
  }, [variants])

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

  const handleSave = (publish: boolean) => {
    if (!productName || !selectedLevel1) {
      toast.error("Vui lòng nhập tên sản phẩm và chọn ngành hàng.")
      return
    }

    // In a real app, this would save to Firestore
    console.log("Saving product:", {
      productName,
      brand,
      model,
      baseName,
      specifications,
      category: [selectedLevel1, selectedLevel2, selectedLevel3].filter(Boolean),
      description,
      images,
      coverImage,
      video,
      variants,
      combinations,
      shipping: { weight, length, width, height },
      other: { condition, isPreOrder, prepTime },
      status: publish ? 'published' : 'hidden'
    })

    toast.success(publish ? "Đã lưu và hiển thị sản phẩm!" : "Đã lưu sản phẩm (ẩn)!")
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <Card>
              <div className="border-b px-6 py-2">
                <TabsList className="w-full justify-start bg-transparent h-auto p-0 space-x-6 overflow-x-auto overflow-y-hidden flex-nowrap">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-primary transition-none"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <CardContent className="p-6 space-y-8">
                <TabsContent value="basic" className="mt-0 space-y-6 animate-in fade-in duration-300">
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
                      
                      <div className="flex gap-4 flex-wrap">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                            <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button 
                              onClick={() => setImages(images.filter((_, i) => i !== idx))} 
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {images.length < 9 && (
                          <label className="w-24 h-24 border border-dashed border-primary rounded flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <ImagePlus className="h-6 w-6 mb-1" />
                            <span className="text-[10px] text-center px-1">{t("products.add.addImage")}<br/>({images.length}/9)</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.coverImage")}
                    </div>
                    <div className="flex gap-4">
                      {coverImage ? (
                        <div className="relative w-24 h-24 border rounded overflow-hidden group shrink-0">
                          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button 
                            onClick={() => setCoverImage(null)} 
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-24 h-24 border border-dashed border-primary rounded flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors shrink-0">
                          <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                          <ImagePlus className="h-6 w-6 mb-1" />
                          <span className="text-[10px]">(0/1)</span>
                        </label>
                      )}
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
                      {video ? (
                        <div className="relative w-24 h-24 border rounded overflow-hidden group shrink-0 bg-black">
                          <video src={video} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setVideo(null)} 
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-24 h-24 border border-dashed rounded flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted transition-colors shrink-0">
                          <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                          <Video className="h-6 w-6 mb-1 text-primary" />
                          <span className="text-[10px] text-primary">{t("products.add.addVideo")}</span>
                        </label>
                      )}
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

                  {/* Product Name Fields */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.brand")}
                    </div>
                    <Input 
                      placeholder={t("products.add.brandPlaceholder")} 
                      value={brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.model")}
                    </div>
                    <Input 
                      placeholder={t("products.add.modelPlaceholder")} 
                      value={model}
                      onChange={(e) => handleModelChange(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.baseName")}
                    </div>
                    <Input 
                      placeholder={t("products.add.baseNamePlaceholder")} 
                      value={baseName}
                      onChange={(e) => handleBaseNameChange(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.specifications")}
                    </div>
                    <Input 
                      placeholder={t("products.add.specificationsPlaceholder")} 
                      value={specifications}
                      onChange={(e) => handleSpecsChange(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      {t("products.add.productName")}
                    </div>
                    <div>
                      <div className="relative">
                        <Input 
                          placeholder={t("products.add.productNamePlaceholder")} 
                          className="pr-16 bg-muted" 
                          value={productName}
                          readOnly
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">{productName.length}/120</span>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-[200px_1fr] gap-4 relative z-50">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.category")}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 z-50">
                      <Select value={selectedLevel1} onValueChange={(val) => { setSelectedLevel1(val); setSelectedLevel2(""); setSelectedLevel3(""); }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("settings.fees.categoryLevel1Placeholder")} />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {level1Options.map((opt: any) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={selectedLevel2} onValueChange={(val) => { setSelectedLevel2(val); setSelectedLevel3(""); }} disabled={!selectedLevel1 || level2Options.length === 0}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("settings.fees.categoryLevel2Placeholder")} />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {level2Options.map((opt: any) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={selectedLevel3} onValueChange={setSelectedLevel3} disabled={!selectedLevel2 || level3Options.length === 0}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("settings.fees.categoryLevel3Placeholder")} />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {level3Options.map((opt: any) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="description" className="mt-0 space-y-6 animate-in fade-in duration-300">
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
                </TabsContent>

                <TabsContent value="sales" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-medium">{t("products.add.tabs.sales")}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Phân loại hàng</h4>
                      <Button variant="outline" size="sm" onClick={() => setVariants([...variants, { name: '', options: [''] }])} disabled={variants.length >= 2}>
                        <Plus className="h-4 w-4 mr-2" /> Thêm nhóm phân loại
                      </Button>
                    </div>

                    {variants.map((variant, vIdx) => (
                      <Card key={vIdx} className="p-4 relative bg-muted/30">
                        <button onClick={() => setVariants(variants.filter((_, i) => i !== vIdx))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </button>
                        <div className="space-y-4">
                          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label className="text-sm">Tên nhóm</label>
                            <Input 
                              value={variant.name} 
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[vIdx].name = e.target.value;
                                setVariants(newVariants);
                              }} 
                              placeholder="VD: Màu sắc, Kích thước..." 
                            />
                          </div>
                          <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                            <label className="text-sm pt-2">Phân loại</label>
                            <div className="space-y-2">
                              {variant.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex gap-2">
                                  <Input 
                                    value={opt} 
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[vIdx].options[oIdx] = e.target.value;
                                      setVariants(newVariants);
                                    }} 
                                    placeholder="VD: Đỏ, Xanh, S, M..." 
                                  />
                                  <Button variant="ghost" size="icon" onClick={() => {
                                    const newVariants = [...variants];
                                    newVariants[vIdx].options = newVariants[vIdx].options.filter((_, i) => i !== oIdx);
                                    setVariants(newVariants);
                                  }}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button variant="ghost" size="sm" onClick={() => {
                                const newVariants = [...variants];
                                newVariants[vIdx].options.push('');
                                setVariants(newVariants);
                              }}>
                                <Plus className="h-4 w-4 mr-2" /> Thêm phân loại
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Combinations Table */}
                    {combinations.length > 0 && (
                      <div className="mt-6 border rounded-md overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                          <thead className="bg-muted text-muted-foreground">
                            <tr>
                              {variants.filter(v => v.name.trim() !== '').map((v, i) => <th key={i} className="px-4 py-2 font-medium">{v.name}</th>)}
                              <th className="px-4 py-2 font-medium">Giá</th>
                              <th className="px-4 py-2 font-medium">Kho hàng</th>
                              <th className="px-4 py-2 font-medium">SKU</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {combinations.map((comb, cIdx) => (
                              <tr key={comb.id}>
                                {Object.values(comb.options).map((opt, i) => (
                                  <td key={i} className="px-4 py-2">{opt}</td>
                                ))}
                                <td className="px-4 py-2">
                                  <Input 
                                    type="number" 
                                    value={comb.price} 
                                    onChange={(e) => {
                                      const newCombs = [...combinations];
                                      newCombs[cIdx].price = e.target.value;
                                      setCombinations(newCombs);
                                    }} 
                                    placeholder="0" 
                                    className="w-24 h-8" 
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Input 
                                    type="number" 
                                    value={comb.stock} 
                                    onChange={(e) => {
                                      const newCombs = [...combinations];
                                      newCombs[cIdx].stock = e.target.value;
                                      setCombinations(newCombs);
                                    }} 
                                    placeholder="0" 
                                    className="w-24 h-8" 
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Input 
                                    value={comb.sku} 
                                    onChange={(e) => {
                                      const newCombs = [...combinations];
                                      newCombs[cIdx].sku = e.target.value;
                                      setCombinations(newCombs);
                                    }} 
                                    placeholder="SKU" 
                                    className="w-32 h-8" 
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-medium">{t("products.add.tabs.shipping")}</h3>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">Cân nặng (Sau khi đóng gói)</div>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" className="w-32" />
                      <span className="text-muted-foreground">gr</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">Kích thước đóng gói</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="D" className="w-20" />
                        <span className="text-muted-foreground">cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="R" className="w-20" />
                        <span className="text-muted-foreground">cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="C" className="w-20" />
                        <span className="text-muted-foreground">cm</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="other" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-medium">{t("products.add.tabs.other")}</h3>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">Tình trạng</div>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="new">Mới</SelectItem>
                        <SelectItem value="used">Đã sử dụng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">Hàng đặt trước</div>
                    <div className="flex items-center gap-4 pt-2">
                      <Switch checked={isPreOrder} onCheckedChange={setIsPreOrder} />
                      <span className="text-sm text-muted-foreground">Tôi sẽ cần thêm thời gian để chuẩn bị hàng</span>
                    </div>
                  </div>
                  {isPreOrder && (
                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <div className="text-sm font-medium pt-2">Thời gian chuẩn bị hàng</div>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} className="w-32" />
                        <span className="text-muted-foreground">ngày</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
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
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {coverImage || images[0] ? (
                    <img src={coverImage || images[0]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
                
                <div className="p-3 space-y-3">
                  <div className="text-sm font-medium line-clamp-2 min-h-[40px]">
                    {productName || "Tên sản phẩm sẽ hiển thị ở đây"}
                  </div>
                  <div className="text-primary font-semibold">
                    {combinations.length > 0 ? (
                      `₫${combinations[0].price || '0'} - ₫${combinations[combinations.length - 1].price || '0'}`
                    ) : (
                      `₫${costPrice || '0'}`
                    )}
                  </div>
                  
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
        <Button variant="outline" onClick={() => handleSave(false)}>{t("products.add.saveHidden")}</Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleSave(true)}>{t("products.add.savePublish")}</Button>
      </div>
    </div>
  )
}
