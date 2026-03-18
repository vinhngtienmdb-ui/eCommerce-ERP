import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Users, DollarSign, TrendingDown, Edit, Trash2 } from "lucide-react";
import { MOCK_GROUP_BUYING_CAMPAIGNS } from "@/src/constants/groupBuyingConstants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";

export function GroupBuying() {
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">{t("marketing.groupBuying.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> {t("marketing.groupBuying.activeGroups")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> {t("marketing.groupBuying.totalRevenue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">$12,450</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" /> {t("marketing.groupBuying.avgDiscount")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">15%</p>
          </CardContent>
        </Card>
      </div>
      <Button>{t("marketing.groupBuying.createCampaign")}</Button>

      <Card>
        <CardHeader>
          <CardTitle>{t("marketing.groupBuying.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("marketing.groupBuying.table.productName")}</TableHead>
                <TableHead>{t("marketing.groupBuying.table.status")}</TableHead>
                <TableHead>{t("marketing.groupBuying.table.originalPrice")}</TableHead>
                <TableHead>{t("marketing.groupBuying.table.groupPrice")}</TableHead>
                <TableHead>{t("marketing.groupBuying.table.participants")}</TableHead>
                <TableHead>{t("marketing.groupBuying.table.endDate")}</TableHead>
                <TableHead>{t("marketing.groupBuying.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GROUP_BUYING_CAMPAIGNS.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.productName}</TableCell>
                  <TableCell>{t(`marketing.campaigns.${campaign.status}`)}</TableCell>
                  <TableCell className="line-through text-muted-foreground">${campaign.originalPrice}</TableCell>
                  <TableCell className="font-bold text-green-600">${campaign.groupPrice}</TableCell>
                  <TableCell>
                    {campaign.currentParticipants} / {campaign.requiredParticipants}
                  </TableCell>
                  <TableCell>{campaign.endDate}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
