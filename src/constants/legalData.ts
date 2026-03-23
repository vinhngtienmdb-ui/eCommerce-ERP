export const brands = [
  { id: "BR-001", name: "Nike", owner: "Nike Inc.", status: "approved", docs: "3 files" },
  { id: "BR-002", name: "Adidas", owner: "Adidas AG", status: "pending", docs: "2 files" },
];

export const disputes = [
  { id: "DSP-1023", type: "Counterfeit", reporter: "Nike Inc.", accused: "Shop Giày Thể Thao", status: "investigating" },
  { id: "DSP-1024", type: "IP Violation", reporter: "Apple", accused: "Phụ Kiện Giá Rẻ", status: "resolved" },
];

export const compliance = [
  { id: "POL-01", policy: "Data Privacy", rate: "0.5%", lastAudit: "2026-02-28", status: "compliant" },
  { id: "POL-02", policy: "Ecommerce Law", rate: "1.2%", lastAudit: "2026-03-01", status: "warning" },
];

export const contracts = [
  { id: "CTR-2024-001", partyA: "Platform Inc.", partyB: "Supplier X", type: "Supply Agreement", effectiveDate: "2024-01-01", expiryDate: "2025-01-01", status: "signed" },
  { id: "CTR-2024-002", partyA: "Platform Inc.", partyB: "Logistics Y", type: "Service Level Agreement", effectiveDate: "2024-02-15", expiryDate: "2026-02-15", status: "pending" },
];

export const trademarks = [
  { id: "TM-001", name: "SuperBrand", type: "Logo", status: "Registered", expiry: "2030-05-20" },
  { id: "TM-002", name: "MegaStore", type: "Wordmark", status: "Pending", expiry: "-" },
];

export const distributors = [
  { id: "DIST-001", name: "Alpha Distribution", region: "North", status: "Authorized", contractEnd: "2025-12-31" },
  { id: "DIST-002", name: "Beta Retail", region: "South", status: "Probation", contractEnd: "2024-06-30" },
];

export const risks = [
  { id: "RISK-001", category: "Data Privacy", description: "Potential GDPR violation in user data export", severity: "High", status: "Open" },
  { id: "RISK-002", category: "IP Violation", description: "Unlicensed use of image assets", severity: "Medium", status: "Mitigated" },
];
