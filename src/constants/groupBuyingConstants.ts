import { GroupBuyingCampaign } from "../types/groupBuying";

export const MOCK_GROUP_BUYING_CAMPAIGNS: GroupBuyingCampaign[] = [
  {
    id: "1",
    productName: "Wireless Earbuds Pro",
    originalPrice: 150,
    groupPrice: 99,
    requiredParticipants: 50,
    currentParticipants: 35,
    status: "active",
    endDate: "2026-04-15",
  },
  {
    id: "2",
    productName: "Smart Fitness Watch",
    originalPrice: 200,
    groupPrice: 120,
    requiredParticipants: 100,
    currentParticipants: 100,
    status: "completed",
    endDate: "2026-03-10",
  },
  {
    id: "3",
    productName: "Ergonomic Office Chair",
    originalPrice: 350,
    groupPrice: 250,
    requiredParticipants: 20,
    currentParticipants: 5,
    status: "planned",
    endDate: "2026-05-01",
  },
];
