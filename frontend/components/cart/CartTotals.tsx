import type { CartTotals as CartTotalsType } from "@/lib/cart-pricing";

type CartTotalsProps = {
  totals: CartTotalsType;
  items?: unknown[];
};

export function CartTotals({ totals }: CartTotalsProps) {
  return (
    <div className="border-t border-ink/10 pt-4 flex flex-col gap-2">
      <div className="flex justify-between text-sm text-ink/70">
        <span>
          {totals.subtotal} {totals.currency}
        </span>
        <span>المجموع الجزئي</span>
      </div>
      <div className="flex justify-between text-sm text-ink/70">
        <span className={totals.isFreeDelivery ? "text-forest font-medium" : ""}>
          {totals.isFreeDelivery ? "مجاني 🎉" : `${totals.deliveryFee} ${totals.currency}`}
        </span>
        <span>التوصيل</span>
      </div>
      <div className="flex justify-between font-bold text-lg text-ink border-t border-ink/10 pt-2 mt-1">
        <span>
          {totals.total} {totals.currency}
        </span>
        <span>المجموع</span>
      </div>
    </div>
  );
}
