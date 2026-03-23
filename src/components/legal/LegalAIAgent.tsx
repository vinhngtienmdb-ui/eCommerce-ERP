import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from '@google/genai';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Badge } from '@/src/components/ui/badge';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { 
  Bot, 
  FileText, 
  Upload, 
  Search, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  FileSignature,
  Scale,
  Sparkles,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  type: string;
  content: string;
  status: 'draft' | 'reviewed' | 'signed';
  riskScore?: number;
}

const MOCK_DOCS: Document[] = [
  {
    id: 'doc-1',
    title: 'Hợp đồng lao động mẫu',
    type: 'Employment',
    content: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHỢP ĐỒNG LAO ĐỘNG\n\nĐiều 1: Thời hạn và công việc hợp đồng\nĐiều 2: Chế độ làm việc\nĐiều 3: Nghĩa vụ và quyền lợi của người lao động\nĐiều 4: Nghĩa vụ và quyền hạn của người sử dụng lao động\nĐiều 5: Điều khoản thi hành',
    status: 'draft'
  },
  {
    id: 'doc-2',
    title: 'Hợp đồng thuê mặt bằng',
    type: 'Lease',
    content: 'HỢP ĐỒNG THUÊ MẶT BẰNG KINH DOANH\n\nBên A (Bên cho thuê): ...\nBên B (Bên thuê): ...\n\nĐiều 1: Mục đích thuê\nĐiều 2: Giá thuê và phương thức thanh toán\nĐiều 3: Phạt vi phạm: Nếu Bên B chậm thanh toán, sẽ chịu phạt 20% giá trị hợp đồng.\nĐiều 4: Chấm dứt hợp đồng',
    status: 'draft'
  }
];

export function LegalAIAgent() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(MOCK_DOCS[1]);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Xin chào! Tôi là Trợ lý AI Pháp chế. Tôi có thể giúp bạn soát xét hợp đồng, tra cứu luật pháp Việt Nam, hoặc soạn thảo các điều khoản pháp lý. Bạn cần tôi giúp gì hôm nay?' }
  ]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Bạn là một chuyên gia pháp lý và luật sư tại Việt Nam.
        Tài liệu hiện tại đang xem xét (nếu có):
        Tiêu đề: ${selectedDoc?.title || 'Không có'}
        Nội dung: ${selectedDoc?.content || 'Không có'}
        
        Người dùng hỏi: ${userMsg}
        
        Hãy trả lời một cách chuyên nghiệp, trích dẫn luật Việt Nam (như Bộ luật Dân sự 2015, Luật Thương mại 2005, Bộ luật Lao động 2019) nếu cần thiết.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setChatHistory(prev => [...prev, { role: 'ai', content: response.text || 'Xin lỗi, tôi không thể trả lời lúc này.' }]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Có lỗi xảy ra khi kết nối với AI');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewContract = async () => {
    if (!selectedDoc) {
      toast.error('Vui lòng chọn một tài liệu để soát xét');
      return;
    }

    setIsProcessing(true);
    setReviewResult(null);
    setChatHistory(prev => [...prev, { role: 'user', content: `Hãy soát xét hợp đồng: ${selectedDoc.title}` }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Bạn là một hệ thống AI Review Hợp đồng chuyên nghiệp theo pháp luật Việt Nam.
        Hãy phân tích hợp đồng sau và trả về kết quả dưới dạng JSON với cấu trúc:
        {
          "risk_score": số (0-100, càng cao càng rủi ro),
          "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          "summary": "Tóm tắt ngắn gọn về hợp đồng và rủi ro chính",
          "clauses": [
            {
              "clause_number": "Tên điều khoản",
              "content": "Nội dung trích dẫn",
              "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
              "issue": "Vấn đề pháp lý",
              "law_reference": "Trích dẫn luật liên quan",
              "suggestion": "Đề xuất sửa đổi"
            }
          ],
          "missing_clauses": [
            {
              "clause": "Tên điều khoản thiếu",
              "importance": "HIGH" | "MEDIUM",
              "suggestion": "Lý do cần thêm"
            }
          ]
        }

        Nội dung hợp đồng:
        ${selectedDoc.content}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const result = JSON.parse(response.text || '{}');
      setReviewResult(result);
      
      // Update doc risk score
      setDocuments(docs => docs.map(d => d.id === selectedDoc.id ? { ...d, riskScore: result.risk_score, status: 'reviewed' } : d));
      setSelectedDoc(prev => prev ? { ...prev, riskScore: result.risk_score, status: 'reviewed' } : null);

      setChatHistory(prev => [...prev, { role: 'ai', content: `Đã hoàn tất soát xét hợp đồng. Mức độ rủi ro: ${result.risk_level} (${result.risk_score}/100). Vui lòng xem chi tiết ở bảng phân tích bên phải.` }]);
      toast.success('Đã hoàn tất phân tích hợp đồng');
    } catch (error) {
      console.error('AI Review Error:', error);
      toast.error('Có lỗi xảy ra khi phân tích hợp đồng');
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Xin lỗi, tôi gặp lỗi khi phân tích hợp đồng này.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Left Panel: Document List */}
      <Card className="lg:col-span-3 flex flex-col h-full border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-500" />
              Tài liệu
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Tìm kiếm tài liệu..." className="pl-9 bg-slate-50 border-slate-200" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {documents.map(doc => (
              <div 
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedDoc?.id === doc.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50'}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-sm text-slate-900 line-clamp-1">{doc.title}</h4>
                  {doc.riskScore !== undefined && (
                    <Badge variant={doc.riskScore > 70 ? 'destructive' : doc.riskScore > 40 ? 'warning' : 'default'} className="text-[10px] px-1.5 py-0">
                      {doc.riskScore}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {doc.type}</span>
                  <span className="capitalize">{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Middle Panel: AI Chat */}
      <Card className="lg:col-span-4 flex flex-col h-full border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 bg-indigo-50/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            Trợ lý AI Pháp chế
          </CardTitle>
          <CardDescription>Hỏi đáp luật, soạn thảo, soát xét hợp đồng</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-sm">AI đang suy nghĩ...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full" onClick={handleReviewContract} disabled={isProcessing || !selectedDoc}>
              <Sparkles className="w-3 h-3 mr-1 text-indigo-500" /> Soát xét hợp đồng
            </Button>
            <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full" onClick={() => setMessage('Hãy tóm tắt hợp đồng này')}>
              Tóm tắt
            </Button>
            <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full" onClick={() => setMessage('Tìm các điều khoản bất lợi')}>
              Tìm rủi ro
            </Button>
          </div>
          <div className="relative">
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder="Nhập yêu cầu pháp lý..."
              className="resize-none pr-10 min-h-[60px] bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
            />
            <Button 
              size="icon" 
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSendMessage}
              disabled={!message.trim() || isProcessing}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Right Panel: Document Viewer & Review Results */}
      <Card className="lg:col-span-5 flex flex-col h-full border-slate-200 shadow-sm overflow-hidden">
        {selectedDoc ? (
          <>
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedDoc.title}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-white">{selectedDoc.type}</Badge>
                  {selectedDoc.riskScore !== undefined && (
                    <span className={`text-xs font-medium flex items-center gap-1 ${selectedDoc.riskScore > 70 ? 'text-red-600' : selectedDoc.riskScore > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      <AlertTriangle className="w-3 h-3" /> Điểm rủi ro: {selectedDoc.riskScore}/100
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm"><FileSignature className="w-4 h-4 mr-2" /> Ký số</Button>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-6">
                {reviewResult ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-xl border ${reviewResult.risk_level === 'CRITICAL' || reviewResult.risk_level === 'HIGH' ? 'bg-red-50 border-red-200' : reviewResult.risk_level === 'MEDIUM' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <Scale className="w-5 h-5" /> Kết quả phân tích
                      </h3>
                      <p className="text-sm text-slate-700">{reviewResult.summary}</p>
                    </div>

                    {reviewResult.clauses && reviewResult.clauses.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" /> Các điều khoản rủi ro
                        </h4>
                        <div className="space-y-3">
                          {reviewResult.clauses.map((clause: any, i: number) => (
                            <div key={i} className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-sm text-slate-900">{clause.clause_number}</span>
                                <Badge variant={clause.risk_level === 'CRITICAL' || clause.risk_level === 'HIGH' ? 'destructive' : 'warning'}>
                                  {clause.risk_level}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 italic mb-3 border-l-2 border-slate-300 pl-3 py-1 bg-slate-50">"{clause.content}"</p>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium text-red-600">Vấn đề:</span> {clause.issue}</p>
                                <p><span className="font-medium text-blue-600">Căn cứ luật:</span> {clause.law_reference}</p>
                                <p><span className="font-medium text-emerald-600">Đề xuất:</span> {clause.suggestion}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reviewResult.missing_clauses && reviewResult.missing_clauses.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Điều khoản còn thiếu
                        </h4>
                        <div className="space-y-2">
                          {reviewResult.missing_clauses.map((missing: any, i: number) => (
                            <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-sm text-slate-900">{missing.clause}</p>
                                <p className="text-xs text-slate-500 mt-1">{missing.suggestion}</p>
                              </div>
                              <Badge variant="outline">{missing.importance}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      {selectedDoc.content}
                    </pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p>Chọn một tài liệu để xem và phân tích</p>
          </div>
        )}
      </Card>
    </div>
  );
}
