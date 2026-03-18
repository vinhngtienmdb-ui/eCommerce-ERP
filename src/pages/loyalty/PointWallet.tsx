import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Wallet, Gift, History } from "lucide-react";

export function PointWallet() {
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">{t("loyalty.wallet.title")}</h1>
      <Card className="bg-indigo-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wallet className="h-6 w-6" /> {t("loyalty.wallet.balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold">12,500 pts</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" /> {t("loyalty.wallet.redeem")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">{t("loyalty.wallet.viewGifts")}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" /> {t("loyalty.wallet.history")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("loyalty.wallet.noHistory")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
