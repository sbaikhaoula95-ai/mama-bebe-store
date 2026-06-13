import Image from "next/image";
import { cn } from "@/lib/utils";

type PlaceholderImageProps = {
  imageKey: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "product";
  className?: string;
  label?: string;
  priority?: boolean;
};

const realImages: Record<string, string> = {
  "product-hnina-mama-hero": "/images/products/hnina-mama-hero.png",
  "product-hnina-mama-usage-1": "/images/products/hnina-mama-usage.png",
  "product-hnina-mama-hero-texture": "/images/products/hnina-mama-texture.png",
  "hnina-mama-how-to-use": "/images/products/hnina-mama-how-to-use.png",
  "product-hnina-jodour-hero": "/images/products/hnina-jodour-hero.png",
  "product-hnina-jodour-application": "/images/products/hnina-jodour-application.png",
  "product-hnina-jodour-hero-texture": "/images/products/hnina-jodour-texture.png",
  "hnina-jodour-how-to-use": "/images/products/hnina-jodour-how-to-use.png",
  "product-hnina-calm-hero": "/images/products/hnina-calm-hero.png",
  "product-hnina-calm-balm-texture": "/images/products/hnina-calm-balm-texture.png",
  "product-hnina-calm-hero-texture": "/images/products/hnina-calm-ingredient.png",
  "hnina-calm-how-to-use": "/images/products/hnina-calm-how-to-use.png",
  "pain-hnina-mama": "/images/products/pain-hnina-mama.png",
  "pain-hnina-jodour": "/images/products/pain-hnina-jodour.png",
  "pain-hnina-calm": "/images/products/pain-hnina-calm.png",
  "lab-hnina-mama": "/images/products/lab-hnina-mama.png",
  "lab-hnina-jodour": "/images/products/lab-hnina-jodour.png",
  "lab-hnina-calm": "/images/products/lab-hnina-calm.png",
  "home-hero-moroccan-mom-baby-natural-care": "/images/products/home-hero-products.png",
  "home-empathy-mom": "/images/products/pain-hnina-mama.png",
  "science-lab-testing": "/images/products/lab-hnina-mama.png",
  "ingredient-argan": "/images/products/hnina-mama-texture.png",
  "ingredient-prickly-pear": "/images/products/hnina-mama-usage.png",
  "ingredient-rosemary": "/images/products/hnina-jodour-texture.png",
  "ingredient-jarjir": "/images/products/hnina-jodour-application.png",
  "ingredient-calendula": "/images/products/hnina-calm-ingredient.png",
  "authority-pediatrician-placeholder": "/images/products/lab-hnina-calm.png",
};

const gradients: Record<string, string> = {
  "product-hnina-mama-hero": "from-blush/30 to-cream",
  "product-hnina-mama-usage-1": "from-blush/20 to-sage/20",
  "product-hnina-mama-ingredient-1": "from-gold/20 to-cream",
  "product-hnina-jodour-hero": "from-sage/30 to-cream",
  "product-hnina-jodour-application": "from-sage/20 to-forest/15",
  "product-hnina-calm-hero": "from-gold/20 to-cream",
  "product-hnina-calm-balm-texture": "from-gold/30 to-sage/20",
  "home-hero-moroccan-mom-baby-natural-care": "from-blush/20 to-sage/20",
  "ingredient-prickly-pear": "from-blush/30 to-cream",
  "ingredient-argan": "from-gold/30 to-cream",
  "ingredient-rosemary": "from-sage/30 to-cream",
  "ingredient-jarjir": "from-forest/20 to-cream",
  "ingredient-black-seed": "from-ink/20 to-cream",
  "ingredient-castor": "from-gold/20 to-sage/20",
  "ingredient-calendula": "from-blush/20 to-cream",
  "authority-pediatrician-placeholder": "from-sage/20 to-cream",
  "ugc-mom-placeholder-1": "from-blush/20 to-cream",
};

const icons: Record<string, string> = {
  "product-hnina-mama-hero": "🌿",
  "product-hnina-jodour-hero": "💆‍♀️",
  "product-hnina-jodour-application": "💧",
  "product-hnina-calm-hero": "🌼",
  "home-hero-moroccan-mom-baby-natural-care": "🤱",
  "ingredient-prickly-pear": "🌵",
  "ingredient-argan": "✨",
  "ingredient-rosemary": "🌿",
  "ingredient-jarjir": "🌱",
  "ingredient-black-seed": "🌑",
  "ingredient-castor": "🫒",
  "ingredient-calendula": "🌸",
  "authority-pediatrician-placeholder": "👨‍⚕️",
  "ugc-mom-placeholder-1": "🤱",
};

const ratioClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  product: "aspect-[4/5]",
};

export function PlaceholderImage({
  imageKey,
  alt,
  aspectRatio = "product",
  className,
  label,
  priority = false,
}: PlaceholderImageProps) {
  const gradient = gradients[imageKey] || "from-sage/20 to-cream";
  const icon = icons[imageKey] || "🌿";
  const realSrc = realImages[imageKey];
  const isHero = imageKey.includes("hero");

  if (realSrc) {
    return (
      <div
        className={cn(
          "w-full rounded-3xl bg-gradient-to-br overflow-hidden relative",
          gradient,
          ratioClasses[aspectRatio],
          className
        )}
      >
        <Image
          src={realSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority={priority || isHero}
          loading={priority || isHero ? "eager" : "lazy"}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-3xl bg-gradient-to-br overflow-hidden flex flex-col items-center justify-center relative",
        gradient,
        ratioClasses[aspectRatio],
        className
      )}
      role="img"
      aria-label={alt}
    >
      <span className="text-6xl md:text-8xl opacity-30 mb-4" aria-hidden="true">
        {icon}
      </span>
      <span className="text-ink/30 text-sm font-medium text-center px-4">
        {label || "صورة المنتج هنا"}
      </span>
    </div>
  );
}
