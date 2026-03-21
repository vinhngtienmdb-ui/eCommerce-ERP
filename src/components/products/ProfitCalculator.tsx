import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useTranslation } from 'react-i18next';

interface ProfitCalculatorProps {
  costPrice: number;
  sellingPrice: number;
  platformFee: number;
  otherFees: any[];
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ costPrice, sellingPrice, platformFee, otherFees }) => {
  const { t } = useTranslation();

  const platformFeeAmount = (sellingPrice * platformFee) / 100;
  
  let otherFeesAmount = 0;
  otherFees.forEach(fee => {
    if (fee.enabled) {
      if (fee.type === 'percentage') {
        otherFeesAmount += (sellingPrice * fee.value) / 100;
      } else {
        otherFeesAmount += fee.value;
      }
    }
  });

  const totalFees = platformFeeAmount + otherFeesAmount;
  const profit = sellingPrice - costPrice - totalFees;
  const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle>{t("products.add.profitCalculator")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>{t("products.add.costPrice")}:</span>
          <span>{costPrice.toLocaleString()} VNĐ</span>
        </div>
        <div className="flex justify-between">
          <span>{t("products.add.sellingPrice")}:</span>
          <span>{sellingPrice.toLocaleString()} VNĐ</span>
        </div>
        <div className="flex justify-between text-red-400">
          <span>{t("products.add.totalFees")}:</span>
          <span>-{totalFees.toLocaleString()} VNĐ</span>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between font-bold">
          <span>{t("products.add.profit")}:</span>
          <span className={profit >= 0 ? "text-emerald-400" : "text-red-400"}>
            {profit.toLocaleString()} VNĐ ({profitMargin.toFixed(2)}%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
