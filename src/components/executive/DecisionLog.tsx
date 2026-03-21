import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const DecisionLog = () => {
  const { t } = useTranslation();

  const decisions = [
    { id: 1, title: "Mở rộng thị trường Đông Nam Á", date: "2026-03-15", status: "In Progress", impact: "High" },
    { id: 2, title: "Tối ưu hóa quy trình Logistics", date: "2026-02-28", status: "Completed", impact: "Medium" },
    { id: 3, title: "Tăng ngân sách R&D AI", date: "2026-02-10", status: "Completed", impact: "High" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-light text-white">{t("executive.tabs.decisionLog")}</h2>
      <div className="grid gap-4">
        {decisions.map((decision) => (
          <Card key={decision.id} className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">{decision.title}</CardTitle>
              <Badge variant="outline" className={decision.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}>
                {decision.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {decision.date}
              </div>
              <div className="flex items-center gap-2">
                Impact: <span className="font-bold text-white">{decision.impact}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
