export interface GroupBuyingCampaign {
  id: string;
  productName: string;
  originalPrice: number;
  groupPrice: number;
  requiredParticipants: number;
  currentParticipants: number;
  status: "active" | "completed" | "planned";
  endDate: string;
}
