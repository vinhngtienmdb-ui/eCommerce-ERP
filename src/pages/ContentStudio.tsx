import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { 
  Sparkles, 
  FileText, 
  Video, 
  Share2, 
  Wand2, 
  Copy, 
  Check, 
  Loader2,
  Languages,
  Type,
  PenTool
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { GoogleGenAI } from "@google/genai"
import { toast } from "sonner"

const ContentStudio = () => {
  const { t } = useTranslation()
  const [productName, setProductName] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState({
    seo: "",
    script: "",
    social: ""
  })

  const generateAIContent = async (type: "seo" | "script" | "social") => {
    if (!productName) {
      toast.error("Please enter a product name")
      return
    }
    setIsGenerating(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const prompts = {
        seo: `Write a professional, high-converting SEO product description for "${productName}". Keywords to include: ${keywords}. Focus on benefits and unique selling points.`,
        script: `Create a 5-minute engaging livestream script for selling "${productName}". Include an opening hook, product demonstration steps, handling common objections, and a strong call to action.`,
        social: `Generate 3 viral social media posts (Instagram, Facebook, TikTok) for "${productName}". Include relevant hashtags and emojis.`
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompts[type],
      })

      setGeneratedContent(prev => ({ ...prev, [type]: response.text }))
      toast.success(`${type.toUpperCase()} content generated!`)
    } catch (error) {
      console.error("Content Generation Error:", error)
      toast.error("Failed to generate content")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Sparkles className="h-5 w-5" />
              <span className="uppercase tracking-widest text-xs">AI Creative Engine</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Content Studio</h1>
            <p className="text-slate-500">Generate high-converting marketing copy in seconds.</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Tell AI about what you're selling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input 
                  placeholder="e.g. Premium Wireless Earbuds" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords (Optional)</label>
                <Textarea 
                  placeholder="e.g. noise cancelling, 40h battery, waterproof" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-indigo-600" 
                disabled={isGenerating}
                onClick={() => generateAIContent("seo")}
              >
                {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Magic Generate All
              </Button>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="seo" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> SEO Copy
                </TabsTrigger>
                <TabsTrigger value="script" className="flex items-center gap-2">
                  <Video className="h-4 w-4" /> Live Script
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Social Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seo" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>SEO Description</CardTitle>
                      <CardDescription>Optimized for search engines and conversion</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.seo)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {generatedContent.seo ? (
                      <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 bg-slate-50 p-6 rounded-lg border">
                        {generatedContent.seo}
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed rounded-lg">
                        <PenTool className="h-12 w-12 mb-2" />
                        <p>No content generated yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="script" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Livestream Script</CardTitle>
                      <CardDescription>Engaging flow for your next live session</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.script)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {generatedContent.script ? (
                      <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 bg-slate-50 p-6 rounded-lg border">
                        {generatedContent.script}
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed rounded-lg">
                        <Video className="h-12 w-12 mb-2" />
                        <p>No script generated yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Social Media Posts</CardTitle>
                      <CardDescription>Ready-to-post content for FB, IG, TikTok</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.social)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {generatedContent.social ? (
                      <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 bg-slate-50 p-6 rounded-lg border">
                        {generatedContent.social}
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed rounded-lg">
                        <Share2 className="h-12 w-12 mb-2" />
                        <p>No posts generated yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentStudio
