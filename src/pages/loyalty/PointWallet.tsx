import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Wallet, Gift, History, ArrowUpRight, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

// Mock Data
const INITIAL_BALANCE = 12500;

const MOCK_REWARDS = [
  { id: "r1", title: "Voucher 50k", pointsCost: 5000, image: "https://picsum.photos/seed/voucher50/100/100", description: "Discount voucher 50,000 VND" },
  { id: "r2", title: "Voucher 100k", pointsCost: 10000, image: "https://picsum.photos/seed/voucher100/100/100", description: "Discount voucher 100,000 VND" },
  { id: "r3", title: "Free Shipping", pointsCost: 2000, image: "https://picsum.photos/seed/freeship/100/100", description: "Free shipping for orders under 5km" },
  { id: "r4", title: "Premium Coffee", pointsCost: 3500, image: "https://picsum.photos/seed/coffee/100/100", description: "1 Free Premium Coffee" },
];

const MOCK_HISTORY = [
  { id: "t1", date: "2026-03-15T10:30:00Z", type: "earn", amount: 500, description: "Order #10234" },
  { id: "t2", date: "2026-03-12T14:15:00Z", type: "earn", amount: 1200, description: "Order #10199" },
  { id: "t3", date: "2026-03-10T09:00:00Z", type: "redeem", amount: 5000, description: "Redeemed Voucher 50k" },
  { id: "t4", date: "2026-03-05T16:45:00Z", type: "earn", amount: 800, description: "Order #10050" },
];

export function PointWallet() {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);

  const handleRedeemClick = (reward: any) => {
    setSelectedReward(reward);
    setIsRedeemDialogOpen(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;

    if (balance < selectedReward.pointsCost) {
      toast.error(t("loyalty.wallet.insufficientPoints"));
      setIsRedeemDialogOpen(false);
      return;
    }

    // Deduct points
    setBalance((prev) => prev - selectedReward.pointsCost);

    // Add transaction history
    const newTransaction = {
      id: `t${Date.now()}`,
      date: new Date().toISOString(),
      type: "redeem",
      amount: selectedReward.pointsCost,
      description: `Redeemed ${selectedReward.title}`,
    };
    setHistory((prev) => [newTransaction, ...prev]);

    toast.success(t("loyalty.wallet.redeemSuccess", { reward: selectedReward.title }));
    setIsRedeemDialogOpen(false);
    setSelectedReward(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">{t("loyalty.wallet.title")}</h1>
      
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white/90">
            <Wallet className="h-6 w-6" /> {t("loyalty.wallet.balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-bold tracking-tight">{balance.toLocaleString()}</p>
            <span className="text-xl text-white/80 font-medium">{t("loyalty.wallet.points")}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rewards Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" /> {t("loyalty.wallet.rewards")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_REWARDS.map((reward) => (
              <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[2/1] w-full bg-muted relative">
                  <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold text-primary shadow-sm">
                    {reward.pointsCost.toLocaleString()} {t("loyalty.wallet.points")}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{reward.description}</p>
                  <Button 
                    className="w-full" 
                    onClick={() => handleRedeemClick(reward)}
                    disabled={balance < reward.pointsCost}
                    variant={balance >= reward.pointsCost ? "default" : "secondary"}
                  >
                    {t("loyalty.wallet.redeem")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> {t("loyalty.wallet.history")}
          </h2>
          <Card>
            <CardContent className="p-0">
              {history.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>{t("loyalty.wallet.noHistory")}</p>
                </div>
              ) : (
                <div className="divide-y">
                  {history.map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${tx.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {tx.type === 'earn' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <div className={`font-bold whitespace-nowrap ${tx.type === 'earn' ? 'text-green-600' : 'text-orange-600'}`}>
                        {tx.type === 'earn' ? '+' : '-'}{tx.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("loyalty.wallet.redeem")}</DialogTitle>
            <DialogDescription>
              {selectedReward && t("loyalty.wallet.confirmRedeem", { 
                reward: selectedReward.title, 
                points: selectedReward.pointsCost.toLocaleString() 
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsRedeemDialogOpen(false)}>
              {t("loyalty.wallet.cancel")}
            </Button>
            <Button onClick={confirmRedeem}>
              {t("loyalty.wallet.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
