"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/config/products";
import { useCartStore } from "@/store/cart-store";
import { OFFER_TIERS } from "@/config/offers";

type ProductHeroClientProps = {
  product: Product;
};

export function ProductHeroClient({ product }: ProductHeroClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedTierIdx] = useState(0);
  const { addItem, openCheckout } = useCartStore();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tier = OFFER_TIERS[selectedTierIdx];

  function handleBuyNow() {
    addItem({
      productId: product.slug,
      sku: product.sku,
      arabicName: product.arabicName,
      quantity: tier.quantity,
      source: "product_page",
      isUpsell: false,
    });
    openCheckout();
  }

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-20 bg-cream border-t border-ink/10 p-4 safe-bottom transition-transform duration-300 md:hidden ${
        isScrolled ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!isScrolled}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-bold text-ink text-sm leading-snug whitespace-pre-line">
            {product.shortHeading}
          </p>
          <p className="text-forest font-bold">{tier.total} درهم</p>
        </div>
        <button onClick={handleBuyNow} className="btn-primary text-base px-6 py-3">
          اشتري الآن
        </button>
      </div>
    </div>
  );
}
