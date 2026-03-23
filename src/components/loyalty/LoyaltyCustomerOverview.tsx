import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Users, Star, Trophy, Crown, Award } from "lucide-react";

const MOCK_TOP_CUSTOMERS = [
  { id: 1, name: "Nguyễn Văn A", points: 15000, tier: "Diamond", lastPurchase: "2026-03-20", avatar: "NV" },
  { id: 2, name: "Trần Thị B", points: 12000, tier: "Gold", lastPurchase: "2026-03-21", avatar: "TB" },
  { id: 3, name: "Lê Văn C", points: 8500, tier: "Silver", lastPurchase: "2026-03-19", avatar: "LC" },
];

const getTierIcon = (tier: string) => {
  const lowerTier = tier.toLowerCase();
  switch (lowerTier) {
    case 'diamond': return <Trophy className="h-3 w-3" />;
    case 'gold': return <Crown className="h-3 w-3" />;
    case 'silver': return <Star className="h-3 w-3" />;
    default: return <Award className="h-3 w-3" />;
  }
};

const getTierColor = (tier: string) => {
  const lowerTier = tier.toLowerCase();
  switch (lowerTier) {
    case 'diamond': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'gold': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    case 'silver': return 'bg-slate-50 text-slate-700 border-slate-100';
    default: return 'bg-orange-50 text-orange-700 border-orange-100';
  }
};

export function LoyaltyCustomerOverview() {
  const { t } = useTranslation();

  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
            <Users className="h-6 w-6" />
          </div>
          {t("loyalty.customers.topCustomers")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4">{t("loyalty.customers.name")}</TableHead>
                <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4">{t("loyalty.customers.points")}</TableHead>
                <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4">{t("loyalty.customers.tier")}</TableHead>
                <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4">{t("loyalty.customers.lastPurchase")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TOP_CUSTOMERS.map((customer) => (
                <TableRow key={customer.id} className="border-slate-50 hover:bg-sky-50/30 transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-sky-100">
                        {customer.avatar}
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-sky-600 transition-colors">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-black text-slate-900">{customer.points.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">{t("loyalty.activities.points")}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-[10px] uppercase ${getTierColor(customer.tier)}`}>
                      {getTierIcon(customer.tier)}
                      {t(`loyalty.customers.tiers.${customer.tier.toLowerCase()}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-medium text-slate-500">{customer.lastPurchase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
