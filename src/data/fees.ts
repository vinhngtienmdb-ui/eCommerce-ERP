export interface CategoryFee {
  id: string;
  level1: string;
  level2: string;
  level3: string;
  feeRateMall: number;
  feeRateRegular: number;
}

export const initialPlatformFees: CategoryFee[] = [
  { id: "1", level1: "Thiết Bị Âm Thanh", level2: "Amply và đầu chỉnh âm", level3: "", feeRateMall: 12.60, feeRateRegular: 10.00 },
  { id: "2", level1: "Thiết Bị Âm Thanh", level2: "Cáp âm thanh/ video & Đầu chuyển", level3: "", feeRateMall: 13.50, feeRateRegular: 10.00 },
  { id: "3", level1: "Thiết Bị Âm Thanh", level2: "Tai nghe nhét tai & chụp tai", level3: "", feeRateMall: 14.70, feeRateRegular: 10.00 },
  { id: "4", level1: "Thiết Bị Âm Thanh", level2: "Dàn âm thanh", level3: "Thu sóng AV", feeRateMall: 14.70, feeRateRegular: 10.00 },
  { id: "5", level1: "Thiết Bị Âm Thanh", level2: "Dàn âm thanh", level3: "Hệ thống âm thanh giải trí tại gia", feeRateMall: 12.60, feeRateRegular: 8.00 },
  { id: "15", level1: "Cameras & Flycam", level2: "Phụ kiện máy ảnh", level3: "Đế pin", feeRateMall: 14.70, feeRateRegular: 10.00 },
  { id: "32", level1: "Cameras & Flycam", level2: "Máy ảnh", level3: "Máy quay hành động", feeRateMall: 8.30, feeRateRegular: 7.50 },
  { id: "54", level1: "Máy tính & Laptop", level2: "Thiết Bị Lưu Trữ", level3: "Đĩa CD", feeRateMall: 13.50, feeRateRegular: 8.00 },
  { id: "73", level1: "Máy tính & Laptop", level2: "Máy Tính Bàn", level3: "Máy Tính All in one", feeRateMall: 3.80, feeRateRegular: 2.50 },
  { id: "137", level1: "Thiết Bị Điện Gia Dụng", level2: "Pin", level3: "", feeRateMall: 14.70, feeRateRegular: 10.00 },
  { id: "149", level1: "Thiết Bị Điện Gia Dụng", level2: "Đồ gia dụng nhà bếp", level3: "Máy rửa bát đĩa", feeRateMall: 6.50, feeRateRegular: 8.00 },
  { id: "193", level1: "Điện Thoại & Phụ Kiện", level2: "Phụ kiện", level3: "Cáp, sạc & bộ chuyển đổi", feeRateMall: 14.70, feeRateRegular: 12.00 },
  { id: "211", level1: "Điện Thoại & Phụ Kiện", level2: "Điện thoại", level3: "", feeRateMall: 2.50, feeRateRegular: 2.00 },
  { id: "220", level1: "Voucher & Dịch vụ", level2: "Sức khỏe & Làm đẹp", level3: "Nha khoa", feeRateMall: 12.60, feeRateRegular: 11.00 },
  { id: "264", level1: "Thời trang trẻ em & trẻ sơ sinh", level2: "Phụ kiện trẻ em & trẻ sơ sinh", level3: "Túi xách & vali", feeRateMall: 16.10, feeRateRegular: 13.50 },
  { id: "323", level1: "Phụ Kiện Thời Trang", level2: "Bộ phụ kiện", level3: "", feeRateMall: 16.10, feeRateRegular: 13.50 },
  { id: "367", level1: "Túi Ví Nam", level2: "Ba lô", level3: "", feeRateMall: 16.10, feeRateRegular: 13.50 },
  { id: "384", level1: "Thời Trang Nam", level2: "Đồ hóa trang", level3: "", feeRateMall: 16.10, feeRateRegular: 13.50 },
  { id: "423", level1: "Giày Dép Nam", level2: "Bốt", level3: "Bốt thời trang", feeRateMall: 15.00, feeRateRegular: 12.50 },
  { id: "451", level1: "Thể Thao & Dã Ngoại", level2: "Khác", level3: "", feeRateMall: 16.10, feeRateRegular: 13.50 },
  { id: "511", level1: "Du lịch & Hành lý", level2: "Vali", level3: "", feeRateMall: 15.00, feeRateRegular: 12.50 },
  { id: "527", level1: "Đồng Hồ", level2: "Đồng hồ nam", level3: "", feeRateMall: 15.00, feeRateRegular: 12.50 },
  { id: "537", level1: "Túi Ví Nữ", level2: "Ba lô", level3: "", feeRateMall: 16.10, feeRateRegular: 13.50 },
  { id: "561", level1: "Thời Trang Nữ", level2: "Đầm", level3: "", feeRateMall: 16.10, feeRateRegular: 13.50 },
  { id: "634", level1: "Giày Dép Nữ", level2: "Bốt", level3: "Bốt thời trang", feeRateMall: 15.00, feeRateRegular: 12.50 },
  { id: "657", level1: "Mẹ & Bé", level2: "Đồ dùng du lịch cho bé", level3: "Túi đựng bỉm sữa", feeRateMall: 15.70, feeRateRegular: 12.50 },
  { id: "676", level1: "Sắc Đẹp", level2: "Tắm & chăm sóc cơ thể", level3: "Kem & sữa dưỡng thể", feeRateMall: 17.80, feeRateRegular: 14.00 },
  { id: "731", level1: "Sức Khỏe", level2: "Thực phẩm chức năng", level3: "Hỗ trợ làm đẹp", feeRateMall: 16.10, feeRateRegular: 14.00 },
  { id: "750", level1: "Thực phẩm và đồ uống", level2: "Đồ uống có cồn", level3: "Bia và trái cây lên men", feeRateMall: 16.10, feeRateRegular: 13.00 },
  { id: "945", level1: "Ô tô", level2: "Phụ kiện ngoại thất ô tô", level3: "Ăng-ten thu phát sóng", feeRateMall: 15.70, feeRateRegular: 13.00 },
  { id: "1007", level1: "Sách & Tạp Chí", level2: "Sách", level3: "Văn Học Hành Động, Tội Phạm & Kinh Dị", feeRateMall: 14.00, feeRateRegular: 12.00 },
  { id: "1047", level1: "Sở thích & Sưu tầm", level2: "Băng - Đĩa", level3: "", feeRateMall: 14.70, feeRateRegular: 13.00 },
  { id: "1083", level1: "Nhà cửa & Đời sống", level2: "Đồ dùng phòng tắm", level3: "Bông tắm", feeRateMall: 16.10, feeRateRegular: 13.00 },
  { id: "1259", level1: "Văn Phòng Phẩm", level2: "Họa cụ", level3: "Sơn Acrylic", feeRateMall: 15.70, feeRateRegular: 10.00 }
];

export interface OtherFee {
  id: string;
  nameKey: string;
  type: "percentage" | "fixed";
  value: number;
  enabled: boolean;
  descriptionKey?: string;
}

export const initialOtherFees: OtherFee[] = [
  { id: "f1", nameKey: "paymentFee", type: "percentage", value: 2.5, enabled: true },
  { id: "f2", nameKey: "infrastructureFee", type: "fixed", value: 10000, enabled: true },
  { id: "f3", nameKey: "insuranceFee", type: "percentage", value: 1.0, enabled: false },
  { id: "f4", nameKey: "voucherFee", type: "percentage", value: 0, enabled: true },
  { id: "f5", nameKey: "adsFee", type: "percentage", value: 5.0, enabled: true },
  { id: "f6", nameKey: "affiliateFee", type: "percentage", value: 10.0, enabled: true },
  { id: "f7", nameKey: "vatTax", type: "percentage", value: 1.0, enabled: true, descriptionKey: "vatTaxDesc" },
  { id: "f8", nameKey: "pitTax", type: "percentage", value: 0.5, enabled: true, descriptionKey: "pitTaxDesc" },
];
