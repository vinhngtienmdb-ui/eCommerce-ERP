import { Link } from "react-router-dom"
import { Facebook, Instagram, Linkedin, QrCode } from "lucide-react"

export function StorefrontFooter() {
  return (
    <footer className="bg-[#fbfbfb] border-t border-slate-200 pt-12 pb-8 text-sm text-slate-600">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: DỊCH VỤ KHÁCH HÀNG */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Dịch Vụ Khách Hàng</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="hover:text-primary transition-colors">Trung Tâm Trợ Giúp Dealtot</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Dealtot Blog</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Dealtot Mall</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Hướng Dẫn Mua Hàng/Đặt Hàng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Hướng Dẫn Bán Hàng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Ví DealtotPay</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Dealtot Xu</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Đơn Hàng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Trả Hàng/Hoàn Tiền</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Liên Hệ Dealtot</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Chính Sách Bảo Hành</Link></li>
            </ul>
          </div>

          {/* Column 2: DEALTOT VIỆT NAM */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Dealtot Việt Nam</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="hover:text-primary transition-colors">Về Dealtot</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Tuyển Dụng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Điều Khoản Dealtot</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Chính Sách Bảo Mật</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Dealtot Mall</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Kênh Người Bán</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Flash Sale</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Tiếp Thị Liên Kết</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Liên Hệ Truyền Thông</Link></li>
            </ul>
          </div>

          {/* Column 3: THANH TOÁN & ĐƠN VỊ VẬN CHUYỂN */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Thanh Toán</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-blue-800 text-[10px]">VISA</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <div className="flex">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-80 mix-blend-multiply"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 mix-blend-multiply -ml-1"></div>
                  </div>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-green-600 text-[10px]">JCB</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-blue-500 text-[8px] leading-tight text-center">AMERICAN<br/>EXPRESS</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-orange-500 text-[10px]">COD</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-orange-600 text-[8px] text-center">TRẢ<br/>GÓP</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-red-500 text-[10px]">DPay</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-red-500 text-[10px]">DPayLater</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Đơn Vị Vận Chuyển</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-red-500 text-[10px] italic">DPX</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-orange-500 text-[8px]">GiaoHangNhanh</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-red-600 text-[8px]">viettel post</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-yellow-500 text-[8px]">VIETNAM POST</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-red-600 text-[10px]">J&T</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-green-600 text-[8px]">GrabExpress</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-red-700 text-[8px]">ninjavan</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-yellow-400 text-[10px]">be</span>
                </div>
                <div className="bg-white p-2 shadow-sm rounded border border-slate-100 flex items-center justify-center h-8">
                  <span className="font-bold text-orange-500 text-[8px]">Ahamove</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: THEO DÕI DEALTOT */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Theo Dõi Dealtot</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-slate-700" />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-slate-700" />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-slate-700" />
                  <span>LinkedIn</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: TẢI ỨNG DỤNG DEALTOT */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Tải Ứng Dụng Dealtot</h3>
            <div className="flex gap-3">
              <div className="bg-white p-2 shadow-sm rounded border border-slate-100 w-20 h-20 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <div className="flex flex-col gap-2 justify-between">
                <div className="bg-white px-2 py-1 shadow-sm rounded border border-slate-100 flex items-center gap-1 h-[22px]">
                  <span className="text-[10px] font-medium">App Store</span>
                </div>
                <div className="bg-white px-2 py-1 shadow-sm rounded border border-slate-100 flex items-center gap-1 h-[22px]">
                  <span className="text-[10px] font-medium">Google Play</span>
                </div>
                <div className="bg-white px-2 py-1 shadow-sm rounded border border-slate-100 flex items-center gap-1 h-[22px]">
                  <span className="text-[10px] font-medium">AppGallery</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Dealtot. Tất cả các quyền được bảo lưu.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-primary">Quốc gia & Khu vực: Việt Nam</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
