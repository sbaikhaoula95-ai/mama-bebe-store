"use client";

import Link from "next/link";
import type { Product } from "@/config/products";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`تقييم ${rating} من 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn("w-4 h-4", star <= Math.floor(rating) ? "text-gold" : "text-ink/20")}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-ink/50 text-xs mr-1">4.9</span>
    </div>
  );
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, openCheckout } = useCartStore();

  function handleBuyNow() {
    addItem({
      productId: product.slug,
      sku: product.sku,
      arabicName: product.arabicName,
      quantity: 1,
      source: "product_page",
      isUpsell: false,
    });
    openCheckout();
  }

  return (
    <div className={cn("product-card flex flex-col", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <PlaceholderImage
          imageKey={product.heroImageKey}
          alt={product.arabicName}
          aspectRatio="product"
          className="rounded-none rounded-t-3xl"
        />
      </Link>

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Rating */}
        <StarRating rating={4.9} />

        {/* Name */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-bold text-ink text-lg leading-snug whitespace-pre-line hover:text-forest transition-colors">
            {product.shortHeading}
          </h3>
          <p className="text-ink/60 text-sm mt-1 leading-relaxed">
            {product.subheading}
          </p>
        </Link>

        {/* Trust chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="trust-chip text-xs">الدفع عند الاستلام</span>
          <span className="trust-chip text-xs">توصيل 24-48 ساعة</span>
        </div>

        {/* Price + scarcity */}
        <div className="flex flex-col gap-1">
          <p className="text-forest font-bold text-xl">
            ابتداء من <span>199 درهم</span>
          </p>
          <p className="text-danger text-xs font-medium">
            🔥 الدفعة محدودة هذا الأسبوع
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="btn-primary text-center text-base mt-auto"
        >
          اشتري الآن
        </button>
      </div>
    </div>
  );
}
