"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import type { Product } from "@/config/products";
import { useCartStore } from "@/store/cart-store";

type CrossSellGridProps = {
  products: Product[];
  title?: string;
};

export function CrossSellGrid({
  products,
  title = "كملي روتين حنينة",
}: CrossSellGridProps) {
  const { addItem, openCheckout } = useCartStore();

  if (products.length === 0) return null;

  function handleBuyNow(product: Product) {
    addItem({
      productId: product.slug,
      sku: product.sku,
      arabicName: product.arabicName,
      quantity: 1,
      source: "cart_cross_sell",
      isUpsell: false,
    });
    openCheckout();
  }

  return (
    <section className="section-padding bg-cream">
      <div className="container-site">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-ink">{title}</h2>
          <p className="text-ink/60 mt-2">منتجات أخرى من حنينة لتكملة روتينك اليومي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.slug}
              className="product-card flex flex-col"
            >
              <Link href={`/products/${product.slug}`}>
                <PlaceholderImage
                  imageKey={product.heroImageKey}
                  alt={product.arabicName}
                  aspectRatio="product"
                  className="rounded-none rounded-t-3xl"
                />
              </Link>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-bold text-ink text-lg whitespace-pre-line hover:text-forest transition-colors">
                    {product.shortHeading}
                  </h3>
                  <p className="text-ink/60 text-sm mt-1">{product.subheading}</p>
                </Link>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-forest text-xl">199 درهم</span>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    اشتري الآن
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
