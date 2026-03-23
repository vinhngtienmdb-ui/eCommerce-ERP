import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Plus, Edit2, Trash2, Calendar, Sparkles, Megaphone } from "lucide-react";
import { toast } from "sonner";

const MOCK_CAMPAIGNS = [
  { id: 1, name: "Cuối tuần Nhân đôi điểm", status: "active", startDate: "2026-03-25", endDate: "2026-03-27" },
  { id: 2, name: "Thưởng Chào Xuân", status: "scheduled", startDate: "2026-04-01", endDate: "2026-04-15" },
];

export function LoyaltyCampaignManager() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);

  const addCampaign = () => {
    toast.info(t("common.featureComingSoon", "Tính năng Thêm chiến dịch sẽ sớm ra mắt"));
  };

  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-rose-500" />
            {t("loyalty.campaigns.title")}
          </CardTitle>
          <CardDescription className="font-medium text-slate-500">
            {t("loyalty.campaigns.description")}
          </CardDescription>
        </div>
        <Button onClick={addCampaign} size="sm" className="bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-100">
          <Plus className="mr-1 h-4 w-4" /> {t("loyalty.campaigns.add")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-rose-100 hover:shadow-md transition-all group/item">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 group-hover/item:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-900 tracking-tight">{campaign.name}</h4>
                  <Badge variant="outline" className={`text-[10px] uppercase font-black ${campaign.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {t(`loyalty.campaigns.status.${campaign.status}`)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />
                  {campaign.startDate} — {campaign.endDate}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
