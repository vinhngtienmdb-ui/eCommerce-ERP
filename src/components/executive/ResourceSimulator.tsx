import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Play } from "lucide-react";

export const ResourceSimulator = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-light text-white">{t("executive.tabs.simulator")}</h2>
      <Card className="bg-white/5 border-white/10 text-white p-6">
        <CardHeader>
          <CardTitle>Điều chỉnh phân bổ ngân sách</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <Button className="w-full bg-[#F27D26] hover:bg-[#F27D26]/80 text-black">
            <Play className="mr-2 h-4 w-4" /> Chạy mô phỏng
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
