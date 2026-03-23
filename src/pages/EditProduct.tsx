import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useTranslation } from "react-i18next"
import { CheckCircle2, ImagePlus, Video, Sparkles, Loader2, Bold, Italic, List, X, Save, ArrowLeft } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Switch } from "@/src/components/ui/switch"
import { toast } from "sonner"
import { GoogleGenAI } from "@google/genai"
import { useSettingsStore } from "@/src/store/useSettingsStore"
import { initialPlatformFees } from "@/src/data/fees"
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
import { doc, getDoc, updateDoc } from 'firebase/firestore'
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
      <img src={url} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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

export function EditProduct() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { settings, fetchSettings } = useSettingsStore()
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [baseName, setBaseName] = useState("")
  const [specifications, setSpecifications] = useState("")
  const [productName, setProductName] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [stock, setStock] = useState("")
  const [lowStockThreshold, setLowStockThreshold] = useState("5")
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
  
  const [variants, setVariants] = useState<{name: string, options: string[]}[]>([])
  const [combinations, setCombinations] = useState<{id: string, options: Record<string, string>, price: string, stock: string, sku: string}[]>([])

  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")

  const [condition, setCondition] = useState("new")
  const [isPreOrder, setIsPreOrder] = useState(false)
  const [prepTime, setPrepTime] = useState("2")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML())
    },
  })

  useEffect(() => {
    fetchSettings()
    if (id) {
      fetchProduct()
    }
  }, [id, fetchSettings])

  const fetchProduct = async () => {
    if (!id) return
    try {
      const docRef = doc(db, "products", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setProductName(data.productName || "")
        setBrand(data.brand || "")
        setModel(data.model || "")
        setBaseName(data.baseName || "")
        setSpecifications(data.specifications || "")
        setDescription(data.description || "")
        editor?.commands.setContent(data.description || "")
        
        if (data.category && data.category.length > 0) {
          setSelectedLevel1(data.category[0] || "")
          setSelectedLevel2(data.category[1] || "")
          setSelectedLevel3(data.category[2] || "")
        }

        setImages((data.images || []).map((url: string) => ({ id: Math.random().toString(36).substr(2, 9), url })))
        setCoverImage(data.coverImage || null)
        setVideo(data.video || null)
        setVariants(data.variants || [])
        setCombinations(data.combinations || [])
        
        if (data.warehouse) {
          setWarehouseType(data.warehouse.type || "normal")
          setWarehouseId(data.warehouse.id || "")
          setSyncWms(data.warehouse.syncWms || false)
        }

        if (data.shipping) {
          setWeight(String(data.shipping.weight || ""))
          setLength(String(data.shipping.length || ""))
          setWidth(String(data.shipping.width || ""))
          setHeight(String(data.shipping.height || ""))
        }

        if (data.other) {
          setCondition(data.other.condition || "new")
          setIsPreOrder(data.other.isPreOrder || false)
          setPrepTime(String(data.other.prepTime || "2"))
        }

        if (data.combinations?.length === 0) {
          setStock(String(data.stock || ""))
          setCostPrice(String(data.costPrice || ""))
        }
        setLowStockThreshold(String(data.lowStockThreshold || "5"))
      } else {
        toast.error("Không tìm thấy sản phẩm")
        navigate("/products/all")
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `products/${id}`)
    } finally {
      setLoading(false)
    }
  }

  const categories = settings?.categories?.length > 0 ? settings.categories : initialPlatformFees
  const level1Options = Array.from(new Set(categories.map((c: any) => c.level1))).filter(Boolean)
  const level2Options = Array.from(new Set(categories.filter((c: any) => c.level1 === selectedLevel1).map((c: any) => c.level2))).filter(Boolean)
  const level3Options = Array.from(new Set(categories.filter((c: any) => c.level1 === selectedLevel1 && c.level2 === selectedLevel2).map((c: any) => c.level3))).filter(Boolean)

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
    if (!weight || Number(weight) <= 0) newErrors.weight = t("products.add.errors.weightRequired")

    setErrors(newErrors)
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

  const handleSave = async () => {
    if (!validateForm() || !id) return

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
        lowStockThreshold: Number(lowStockThreshold),
        updatedAt: new Date().toISOString()
      }

      await updateDoc(doc(db, 'products', id), productData)
      toast.success("Cập nhật sản phẩm thành công!")
      navigate("/products/all")
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products/all")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Chỉnh sửa sản phẩm</h2>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Lưu thay đổi
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="description">Mô tả & Hình ảnh</TabsTrigger>
              <TabsTrigger value="sales">Bán hàng & Kho vận</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tên sản phẩm</label>
                  <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Thương hiệu</label>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Model</label>
                    <Input value={model} onChange={(e) => setModel(e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Ngành hàng</label>
                  <Select value={selectedLevel1} onValueChange={setSelectedLevel1}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngành hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {level1Options.map((opt: any) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Mô tả sản phẩm</label>
                  <div className="border rounded-md">
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} className="p-4 min-h-[200px]" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Hình ảnh sản phẩm</label>
                  <div className="flex gap-4 flex-wrap">
                    {images.map((img) => (
                      <div key={img.id} className="w-24 h-24 relative group">
                        <img src={img.url} className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
                        <button onClick={() => setImages(images.filter(i => i.id !== img.id))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Giá bán (VND)</label>
                  <Input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tồn kho</label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Cảnh báo tồn kho thấp</label>
                  <Input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Cân nặng (gr)</label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tình trạng</label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Mới</SelectItem>
                      <SelectItem value="used">Đã qua sử dụng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
