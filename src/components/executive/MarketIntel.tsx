import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Newspaper, TrendingUp } from "lucide-react";

export const MarketIntel = () => {
  const { t } = useTranslation();

  const news = [
    { title: "Đối thủ cạnh tranh X ra mắt sản phẩm mới", source: "TechCrunch", sentiment: "Neutral" },
    { title: "Thay đổi chính sách thuế thương mại điện tử", source: "Reuters", sentiment: "Negative" },
    { title: "Xu hướng tiêu dùng xanh tăng mạnh", source: "Forbes", sentiment: "Positive" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-light text-white">{t("executive.tabs.marketIntel")}</h2>
      <div className="grid gap-4">
        {news.map((item, index) => (
          <Card key={index} className="bg-white/5 border-white/10 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-[#F27D26]" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-white/60">
              <span>{item.source}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${item.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' : item.sentiment === 'Negative' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {item.sentiment}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
