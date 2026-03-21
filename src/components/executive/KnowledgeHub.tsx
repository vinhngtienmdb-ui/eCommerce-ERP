import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FileText, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";

export const KnowledgeHub = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-light text-white">{t("executive.tabs.knowledgeHub")}</h2>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-white/50" />
        <Input placeholder="Tìm kiếm tài liệu..." className="bg-white/5 border-white/10 text-white pl-10" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Biên bản họp HĐQT T2/2026", type: "PDF" },
          { title: "Kế hoạch kinh doanh 2026", type: "DOCX" },
          { title: "Hợp đồng đối tác chiến lược", type: "PDF" },
        ].map((doc, index) => (
          <Card key={index} className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <FileText className="h-8 w-8 text-[#F27D26]" />
              <CardTitle className="text-lg font-medium">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/60">
              Loại: {doc.type}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
