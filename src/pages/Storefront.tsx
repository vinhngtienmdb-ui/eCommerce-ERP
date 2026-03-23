import { StorefrontFooter } from "../components/storefront/StorefrontFooter"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

export function Storefront() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Placeholder */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">Dealtot</div>
          <div className="flex items-center gap-4">
            <Link to="/"><Button variant="secondary" size="sm">Vào trang quản trị</Button></Link>
          </div>
        </div>
      </header>

      {/* Main Content Placeholder */}
      <main className="flex-grow bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
            <h1 className="text-3xl font-bold text-slate-900">Chào mừng đến với Dealtot</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Nền tảng thương mại điện tử hàng đầu. Cuộn xuống để xem thiết kế module chân trang (footer) theo yêu cầu.
            </p>
            <div className="h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center mt-8">
              <span className="text-slate-400 font-medium">Nội dung trang chủ</span>
            </div>
          </div>
        </div>
      </main>

      {/* The Footer Module */}
      <StorefrontFooter />
    </div>
  )
}
