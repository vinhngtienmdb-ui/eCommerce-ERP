import React, { useState, useRef, useEffect } from "react"
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Minimize2, 
  Maximize2,
  Sparkles
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { GoogleGenAI } from "@google/genai"
import { cn } from "@/src/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Xin chào! Tôi là Trợ lý AI Điều hành của bạn. Tôi có thể giúp bạn phân tích dữ liệu, kiểm tra KPI hoặc lập kế hoạch kinh doanh. Bạn muốn hỏi gì hôm nay?",
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "Bạn là một Trợ lý AI Điều hành cao cấp cho nền tảng thương mại điện tử. Bạn có quyền truy cập vào các báo cáo về doanh thu, người bán, đơn hàng và khách hàng. Hãy trả lời một cách chuyên nghiệp, súc tích và đưa ra các gợi ý hành động cụ thể. Nếu người dùng hỏi về dữ liệu, hãy giả định các con số tích cực dựa trên xu hướng hiện tại (Doanh thu +20%, 180 người bán mới, 1200 đơn hàng tuần này).",
        }
      })

      const result = await chat.sendMessage({ message: input })
      const assistantMessage: Message = {
        role: "assistant",
        content: result.text || "Xin lỗi, tôi gặp trục trặc khi xử lý yêu cầu.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("AI Chat Error:", error)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Có lỗi xảy ra khi kết nối với trí tuệ nhân tạo. Vui lòng thử lại sau.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-tr from-purple-600 to-blue-600 hover:scale-110 transition-transform z-50"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
      isMinimized ? "w-72" : "w-96 h-[500px]"
    )}>
      <Card className="h-full flex flex-col shadow-2xl border-purple-100 overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-sm font-bold">AI Executive Assistant</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full pr-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        msg.role === "user" ? "bg-blue-100" : "bg-purple-100"
                      )}>
                        {msg.role === "user" ? <User className="h-4 w-4 text-blue-600" /> : <Bot className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm max-w-[80%]",
                        msg.role === "user" 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-slate-100 text-slate-800 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-100 text-slate-400 text-sm italic">
                        Đang phân tích dữ liệu...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t bg-slate-50">
              <form 
                className="flex w-full gap-2" 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              >
                <Input 
                  placeholder="Hỏi về doanh thu, KPI..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-white"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
