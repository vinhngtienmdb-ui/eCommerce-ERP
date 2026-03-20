export interface GroupBuyingCampaign {
  id: string;
  code: string;
  productName: string;
  kolName: string;
  originalPrice: number;
  currentPrice: number;
  targetParticipants: number;
  currentParticipants: number;
  status: "proposal" | "approved" | "rejected" | "live" | "closing" | "refunding" | "delivering" | "completed" | "cancelled" | "refunded" | "refund_failed";
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  startDate: string;
  endDate: string;
  inventory: number;
  legalStatus: "complete" | "missing_documents";
  milestones: {
    participants: number;
    discountPercentage: number;
  }[];
  revenue?: number;
  commissionRate?: number;
  deliverySuccessRate?: number;
}
