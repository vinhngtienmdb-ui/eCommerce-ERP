import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Bold, Italic, List, Save, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db, auth } from "@/src/lib/firebase"
import { toast } from "sonner"
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors"

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

const PolicyEditor = ({ policyId, title, description }: { policyId: string, title: string, description: string }) => {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  useEffect(() => {
    const fetchPolicy = async () => {
      setIsLoading(true)
      try {
        const docRef = doc(db, "legal_policies", policyId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setContent(data.content || "")
          editor?.commands.setContent(data.content || "")
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `legal_policies/${policyId}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPolicy()
  }, [policyId, editor])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const docRef = doc(db, "legal_policies", policyId)
      await setDoc(docRef, {
        type: policyId,
        content: content,
        lastUpdated: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || 'anonymous'
      }, { merge: true })
      toast.success("Đã lưu chính sách thành công")
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `legal_policies/${policyId}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Lưu thay đổi
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className="p-4 min-h-[400px] prose max-w-none" />
        </div>
      </CardContent>
    </Card>
  )
}

export function LegalPolicyEditor() {
  const [activeTab, setActiveTab] = useState("privacy")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 flex flex-wrap h-auto">
          <TabsTrigger value="privacy" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Chính sách bảo mật</TabsTrigger>
          <TabsTrigger value="operating" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Quy chế hoạt động</TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Chính sách vận chuyển</TabsTrigger>
          <TabsTrigger value="refund" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Chính sách trả hàng & hoàn tiền</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-6">
          <PolicyEditor 
            policyId="privacy" 
            title="Chính sách bảo mật" 
            description="Quản lý nội dung chính sách bảo mật thông tin khách hàng." 
          />
        </TabsContent>

        <TabsContent value="operating" className="space-y-6">
          <PolicyEditor 
            policyId="operating" 
            title="Quy chế hoạt động" 
            description="Quản lý nội dung quy chế hoạt động của nền tảng." 
          />
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <PolicyEditor 
            policyId="shipping" 
            title="Chính sách vận chuyển" 
            description="Quản lý nội dung chính sách giao hàng và vận chuyển." 
          />
        </TabsContent>

        <TabsContent value="refund" className="space-y-6">
          <PolicyEditor 
            policyId="refund" 
            title="Chính sách trả hàng & hoàn tiền" 
            description="Quản lý nội dung chính sách đổi trả và hoàn tiền cho khách hàng." 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
