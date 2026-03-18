import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { useTranslation } from "react-i18next"
import { CheckCircle2, ImagePlus, Video, ShoppingBag, MessageSquare, ShoppingCart, ChevronDown, Sparkles, Loader2, Bold, Italic, List } from "lucide-react"
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
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import { db, storage, auth } from '@/src/lib/firebase'
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors"

const SortableImage = ({ id, url, onRemove }: { id: string, url: string, onRemove: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative aspect-square rounded-md border bg-muted flex items-center justify-center overflow-hidden group cursor-grab active:cursor-grabbing">
      <img src={url} alt="Product" className="w-full h-full object-cover" />
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }} 
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/20">
      <Button
        variant="ghost" size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-muted")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost" size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-muted")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost" size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("h-8 w-8 p-0", editor.isActive('bulletList') && "bg-muted")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function AddProduct() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
  const [stock, setStock] = useState("")
  const [warehouseType, setWarehouseType] = useState("normal")
  const [warehouseId, setWarehouseId] = useState("")
  const [syncWms, setSyncWms] = useState(false)
  const [suggestedPrice, setSuggestedPrice] = useState("")
  const [platformFee, setPlatformFee] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCategorizing, setIsCategorizing] = useState(false)
  
  const [selectedLevel1, setSelectedLevel1] = useState<string>("")
  const [selectedLevel2, setSelectedLevel2] = useState<string>("")
  const [selectedLevel3, setSelectedLevel3] = useState<string>("")

  const [images, setImages] = useState<{id: string, url: string}[]>([])
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [video, setVideo] = useState<string | null>(null)
  
  // Sales
  const [variants, setVariants] = useState<{name: string, options: string[]}[]>([])
  const [combinations, setCombinations] = useState<{id: string, options: Record<string, string>, price: string, stock: string, sku: string}[]>([])
  const [bulkPrice, setBulkPrice] = useState("")
  const [bulkStock, setBulkStock] = useState("")
  const [bulkSku, setBulkSku] = useState("")

  // Shipping
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")

  // Other
  const [condition, setCondition] = useState("new")
  const [isPreOrder, setIsPreOrder] = useState(false)
  const [prepTime, setPrepTime] = useState("2")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

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
      const newImages = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file)
      }))
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

  const handleBulkApply = () => {
    setCombinations(prev => prev.map(comb => ({
      ...comb,
      price: bulkPrice || comb.price,
      stock: bulkStock || comb.stock,
      sku: bulkSku || comb.sku
    })))
    toast.success(t("products.add.bulkApplySuccess"))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML())
    },
  })

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem('productDraft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (parsed.productName) setProductName(parsed.productName)
        if (parsed.brand) setBrand(parsed.brand)
        if (parsed.model) setModel(parsed.model)
        if (parsed.baseName) setBaseName(parsed.baseName)
        if (parsed.specifications) setSpecifications(parsed.specifications)
        if (parsed.description) {
          setDescription(parsed.description)
          editor?.commands.setContent(parsed.description)
        }
        if (parsed.costPrice) setCostPrice(parsed.costPrice)
        if (parsed.stock) setStock(parsed.stock)
        if (parsed.warehouseType) setWarehouseType(parsed.warehouseType)
        if (parsed.warehouseId) setWarehouseId(parsed.warehouseId)
        if (parsed.syncWms !== undefined) setSyncWms(parsed.syncWms)
        if (parsed.suggestedPrice) setSuggestedPrice(parsed.suggestedPrice)
        if (parsed.platformFee) setPlatformFee(parsed.platformFee)
        if (parsed.selectedLevel1) setSelectedLevel1(parsed.selectedLevel1)
        if (parsed.selectedLevel2) setSelectedLevel2(parsed.selectedLevel2)
        if (parsed.selectedLevel3) setSelectedLevel3(parsed.selectedLevel3)
        if (parsed.variants) setVariants(parsed.variants)
        if (parsed.combinations) setCombinations(parsed.combinations)
        if (parsed.weight) setWeight(parsed.weight)
        if (parsed.length) setLength(parsed.length)
        if (parsed.width) setWidth(parsed.width)
        if (parsed.height) setHeight(parsed.height)
        if (parsed.condition) setCondition(parsed.condition)
        if (parsed.isPreOrder !== undefined) setIsPreOrder(parsed.isPreOrder)
        if (parsed.prepTime) setPrepTime(parsed.prepTime)
      } catch (e) {
        console.error("Failed to parse draft", e)
      }
    }
  }, [editor])

  // Save draft
  useEffect(() => {
    const draft = {
      productName, brand, model, baseName, specifications,
      description, costPrice, stock, warehouseType, warehouseId, syncWms, suggestedPrice, platformFee,
      selectedLevel1, selectedLevel2, selectedLevel3,
      variants, combinations, weight, length, width, height,
      condition, isPreOrder, prepTime
    }
    localStorage.setItem('productDraft', JSON.stringify(draft))
  }, [productName, brand, model, baseName, specifications, description, costPrice, stock, warehouseType, warehouseId, syncWms, suggestedPrice, platformFee, selectedLevel1, selectedLevel2, selectedLevel3, variants, combinations, weight, length, width, height, condition, isPreOrder, prepTime])

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

  const autoCategorize = async () => {
    if (images.length === 0 && !coverImage) {
      toast.error(t("products.add.uploadImageForAi"));
      return;
    }

    setIsCategorizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Get the first available image
      const imageUrl = coverImage || images[0].url;
      
      // Convert blob URL to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Extract just the base64 part
          resolve(base64data.split(',')[1]);
        };
      });
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;

      // Provide the available categories to the AI
      const availableCategories = level1Options.join(", ");

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: blob.type,
                data: base64Data
              }
            },
            {
              text: `Analyze this product image and determine the most appropriate category from this list: [${availableCategories}]. Return ONLY the exact category name from the list. If none fit perfectly, return the closest match.`
            }
          ]
        }
      });

      if (aiResponse.text) {
        const suggestedCategory = aiResponse.text.trim();
        if (level1Options.includes(suggestedCategory)) {
          setSelectedLevel1(suggestedCategory);
          setSelectedLevel2("");
          setSelectedLevel3("");
          toast.success(t("products.add.aiCategorySuccess", { category: suggestedCategory }));
        } else {
          toast.error(t("products.add.aiCategoryNotFound"));
        }
      }
    } catch (error) {
      console.error("AI Categorization Error:", error);
      toast.error(t("products.add.aiCategoryImageError"));
    } finally {
      setIsCategorizing(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!productName) newErrors.productName = t("products.add.errors.nameRequired")
    if (!selectedLevel1) newErrors.category = t("products.add.errors.categoryRequired")
    if (!coverImage && images.length === 0) newErrors.images = t("products.add.errors.imageRequired")
    if (combinations.length > 0) {
      if (combinations.some(c => !c.price)) newErrors.combinations = t("products.add.errors.combinationPriceRequired")
      if (combinations.some(c => !c.stock)) newErrors.combinationsStock = t("products.add.errors.combinationStockRequired")
    } else {
      if (!costPrice) newErrors.price = t("products.add.errors.priceRequired")
      if (!stock) newErrors.stock = t("products.add.errors.stockRequired")
    }
    if (!warehouseId && warehouseType === 'normal') newErrors.warehouse = t("products.add.errors.warehouseRequired")
    if (!weight || Number(weight) <= 0) newErrors.weight = t("products.add.errors.weightRequired")

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      toast.error(t("products.add.errors.checkForm"))
    }
    return Object.keys(newErrors).length === 0
  }

  const uploadFile = async (fileUrl: string, path: string) => {
    if (!fileUrl.startsWith('blob:')) return fileUrl
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, blob)
    return await getDownloadURL(storageRef)
  }

  const handleSave = async (publish: boolean) => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      const uploadedImages = await Promise.all(images.map((img, i) => uploadFile(img.url, `products/${Date.now()}_img_${i}`)))
      const uploadedCover = coverImage ? await uploadFile(coverImage, `products/${Date.now()}_cover`) : uploadedImages[0]
      const uploadedVideo = video ? await uploadFile(video, `products/${Date.now()}_video`) : null

      const productData = {
        productName,
        brand,
        model,
        baseName,
        specifications,
        category: [selectedLevel1, selectedLevel2, selectedLevel3].filter(Boolean),
        description,
        images: uploadedImages,
        coverImage: uploadedCover,
        video: uploadedVideo,
        variants,
        combinations,
        stock: combinations.length > 0 ? combinations.reduce((acc, curr) => acc + Number(curr.stock || 0), 0) : Number(stock),
        warehouse: {
          type: warehouseType,
          id: warehouseId,
          syncWms
        },
        shipping: { weight: Number(weight), length: Number(length), width: Number(width), height: Number(height) },
        other: { condition, isPreOrder, prepTime: Number(prepTime) },
        status: publish ? 'published' : 'hidden',
        createdAt: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'anonymous'
      }

      await addDoc(collection(db, 'products'), productData)
      
      localStorage.removeItem('productDraft')
      toast.success(publish ? t("products.add.saveSuccessPublished") : t("products.add.saveSuccessHidden"))
      
      // Reset form or redirect
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "products")
    } finally {
      setIsSaving(false)
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
    { id: "warehouse", label: t("products.add.tabs.warehouse", "Kho vận") },
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
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={images.map(img => img.id)}
                            strategy={rectSortingStrategy}
                          >
                            {images.map((img) => (
                              <div key={img.id} className="w-24 h-24">
                                <SortableImage 
                                  id={img.id} 
                                  url={img.url} 
                                  onRemove={() => setImages(images.filter(i => i.id !== img.id))} 
                                />
                              </div>
                            ))}
                          </SortableContext>
                        </DndContext>
                        {images.length < 9 && (
                          <label className={cn("w-24 h-24 border border-dashed border-primary rounded flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors", errors.images && "border-destructive text-destructive")}>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <ImagePlus className="h-6 w-6 mb-1" />
                            <span className="text-[10px] text-center px-1">{t("products.add.addImage")}<br/>({images.length}/9)</span>
                          </label>
                        )}
                      </div>
                      {errors.images && <p className="text-sm text-destructive mt-1">{errors.images}</p>}
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
                        <label className={cn("w-24 h-24 border border-dashed border-primary rounded flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors shrink-0", errors.images && "border-destructive text-destructive")}>
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
                          className={cn("pr-16 bg-muted", errors.productName && "border-destructive")} 
                          value={productName}
                          readOnly
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">{productName.length}/120</span>
                      </div>
                      {errors.productName && <p className="text-sm text-destructive mt-1">{errors.productName}</p>}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-[200px_1fr] gap-4 relative z-50">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.category")}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4 w-full gap-2 text-xs h-8 border-primary/50 text-primary hover:bg-primary/5"
                        onClick={autoCategorize}
                        disabled={isCategorizing}
                      >
                        {isCategorizing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {t("products.add.aiSuggest")}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 z-50">
                      <Select value={selectedLevel1} onValueChange={(val) => { setSelectedLevel1(val); setSelectedLevel2(""); setSelectedLevel3(""); }}>
                        <SelectTrigger className={cn("w-full", errors.category && "border-destructive")}>
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
                      <div className="border rounded-md overflow-hidden bg-background">
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} className="p-4 min-h-[200px] prose max-w-none focus:outline-none" />
                      </div>
                      <div className="text-xs text-muted-foreground text-right mt-2">
                        {description.replace(/<[^>]*>?/gm, '').length}/3000
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sales" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-medium">{t("products.add.tabs.sales")}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{t("products.add.sales.variantClassification")}</h4>
                      <Button variant="outline" size="sm" onClick={() => setVariants([...variants, { name: '', options: [''] }])} disabled={variants.length >= 2}>
                        <Plus className="h-4 w-4 mr-2" /> {t("products.add.sales.addVariantGroup")}
                      </Button>
                    </div>

                    {variants.map((variant, vIdx) => (
                      <Card key={vIdx} className="p-4 relative bg-muted/30">
                        <button onClick={() => setVariants(variants.filter((_, i) => i !== vIdx))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </button>
                        <div className="space-y-4">
                          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label className="text-sm">{t("products.add.sales.groupName")}</label>
                            <Input 
                              value={variant.name} 
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[vIdx].name = e.target.value;
                                setVariants(newVariants);
                              }} 
                              placeholder={t("products.add.sales.groupNamePlaceholder")} 
                            />
                          </div>
                          <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                            <label className="text-sm pt-2">{t("products.add.sales.variant")}</label>
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
                                    placeholder={t("products.add.sales.variantPlaceholder")} 
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
                                <Plus className="h-4 w-4 mr-2" /> {t("products.add.sales.addVariant")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Combinations Table */}
                    {combinations.length > 0 ? (
                      <div className="space-y-4 mt-6">
                        {/* Bulk Apply */}
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-md border">
                          <span className="text-sm font-medium whitespace-nowrap">{t("products.add.sales.bulkApply")}:</span>
                          <Input type="number" placeholder={t("products.add.sales.price")} value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} className="w-32 h-9 bg-background" />
                          <Input type="number" placeholder={t("products.add.sales.stock")} value={bulkStock} onChange={e => setBulkStock(e.target.value)} className="w-32 h-9 bg-background" />
                          <Input placeholder={t("products.add.sales.sku")} value={bulkSku} onChange={e => setBulkSku(e.target.value)} className="w-32 h-9 bg-background" />
                          <Button size="sm" onClick={handleBulkApply}>{t("products.add.sales.apply")}</Button>
                        </div>

                        <div className="border rounded-md overflow-hidden overflow-x-auto">
                          <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-muted text-muted-foreground">
                              <tr>
                                {variants.filter(v => v.name.trim() !== '').map((v, i) => <th key={i} className="px-4 py-2 font-medium">{v.name}</th>)}
                                <th className="px-4 py-2 font-medium">{t("products.add.sales.price")}</th>
                                <th className="px-4 py-2 font-medium">{t("products.add.sales.stock")}</th>
                                <th className="px-4 py-2 font-medium">{t("products.add.sales.sku")}</th>
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
                                      className={cn("w-24 h-8", errors.combinations && !comb.price && "border-destructive")} 
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
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <label className="text-sm font-medium">
                            <span className="text-destructive">*</span> {t("products.add.sales.productPrice")}
                          </label>
                          <div>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              value={costPrice} 
                              onChange={(e) => setCostPrice(e.target.value)} 
                              className={cn("w-48", errors.price && "border-destructive")} 
                            />
                            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <label className="text-sm font-medium">
                            <span className="text-destructive">*</span> {t("products.add.sales.productStock")}
                          </label>
                          <div>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              value={stock} 
                              onChange={(e) => setStock(e.target.value)} 
                              className={cn("w-48", errors.stock && "border-destructive")} 
                            />
                            {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="warehouse" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-medium">{t("products.add.tabs.warehouse")}</h3>
                  
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">
                      <span className="text-destructive">*</span> {t("products.add.warehouse.type")}
                    </div>
                    <Select value={warehouseType} onValueChange={setWarehouseType}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder={t("products.add.warehouse.selectType")} />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="normal">{t("products.add.warehouse.normal")}</SelectItem>
                        <SelectItem value="fulfillment">{t("products.add.warehouse.fulfillment")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {warehouseType === 'normal' && (
                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <div className="text-sm font-medium pt-2">
                        <span className="text-destructive">*</span> {t("products.add.warehouse.selectWarehouse")}
                      </div>
                      <div>
                        <Select value={warehouseId} onValueChange={setWarehouseId}>
                          <SelectTrigger className={cn("w-64", errors.warehouse && "border-destructive")}>
                            <SelectValue placeholder={t("products.add.warehouse.selectWarehouse")} />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="wh_hn_01">Kho Tổng Hà Nội</SelectItem>
                            <SelectItem value="wh_hcm_01">Kho Tổng TP.HCM</SelectItem>
                            <SelectItem value="wh_dn_01">Kho Đà Nẵng</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.warehouse && <p className="text-sm text-destructive mt-1">{errors.warehouse}</p>}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">{t("products.add.warehouse.syncWms")}</div>
                    <div className="flex items-center gap-4 pt-2">
                      <Switch checked={syncWms} onCheckedChange={setSyncWms} />
                      <span className="text-sm text-muted-foreground">{t("products.add.warehouse.syncWmsDesc")}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-medium">{t("products.add.tabs.shipping")}</h3>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">{t("products.add.shipping.weight")}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" className={cn("w-32", errors.weight && "border-destructive")} />
                        <span className="text-muted-foreground">gr</span>
                      </div>
                      {errors.weight && <p className="text-sm text-destructive mt-1">{errors.weight}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">{t("products.add.shipping.dimensions")}</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder={t("products.add.shipping.length")} className="w-20" />
                        <span className="text-muted-foreground">cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder={t("products.add.shipping.width")} className="w-20" />
                        <span className="text-muted-foreground">cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={t("products.add.shipping.height")} className="w-20" />
                        <span className="text-muted-foreground">cm</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="other" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-medium">{t("products.add.tabs.other")}</h3>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">{t("products.add.other.condition")}</div>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder={t("products.add.other.selectCondition")} />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="new">{t("products.add.other.new")}</SelectItem>
                        <SelectItem value="used">{t("products.add.other.used")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium pt-2">{t("products.add.other.preOrder")}</div>
                    <div className="flex items-center gap-4 pt-2">
                      <Switch checked={isPreOrder} onCheckedChange={setIsPreOrder} />
                      <span className="text-sm text-muted-foreground">{t("products.add.other.preOrderDesc")}</span>
                    </div>
                  </div>
                  {isPreOrder && (
                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <div className="text-sm font-medium pt-2">{t("products.add.other.prepTime")}</div>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} className="w-32" />
                        <span className="text-muted-foreground">{t("products.add.other.days")}</span>
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
                    <img src={coverImage || images[0]?.url} alt="Preview" className="w-full h-full object-cover" />
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
        <Button variant="outline" onClick={() => navigate("/products")}>{t("products.add.cancel")}</Button>
        <Button variant="outline" onClick={() => handleSave(false)}>{t("products.add.saveHidden")}</Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleSave(true)}>{t("products.add.savePublish")}</Button>
      </div>
    </div>
  )
}
