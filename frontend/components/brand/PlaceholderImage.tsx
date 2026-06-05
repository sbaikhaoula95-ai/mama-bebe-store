import { cn } from "@/lib/utils";

type PlaceholderImageProps = {
  imageKey: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "product";
  className?: string;
  label?: string;
};

const gradients: Record<string, string> = {
  "product-hnina-mama-hero": "from-blush/30 to-cream",
  "product-hnina-mama-usage-1": "from-blush/20 to-sage/20",
  "product-hnina-mama-ingredient-1": "from-gold/20 to-cream",
  "product-hnina-lila-hero": "from-sage/30 to-cream",
  "product-hnina-lila-bedtime-ritual": "from-sage/20 to-blush/20",
  "product-hnina-calm-hero": "from-gold/20 to-cream",
  "product-hnina-calm-balm-texture": "from-gold/30 to-sage/20",
  "home-hero-moroccan-mom-baby-natural-care": "from-blush/20 to-sage/20",
  "ingredient-prickly-pear": "from-blush/30 to-cream",
  "ingredient-argan": "from-gold/30 to-cream",
  "ingredient-lavender": "from-sage/30 to-cream",
  "ingredient-chamomile": "from-gold/20 to-cream",
  "ingredient-calendula": "from-blush/20 to-cream",
  "authority-pediatrician-placeholder": "from-sage/20 to-cream",
  "ugc-mom-placeholder-1": "from-blush/20 to-cream",
};

const icons: Record<string, string> = {
  "product-hnina-mama-hero": "🌿",
  "product-hnina-lila-hero": "💜",
  "product-hnina-calm-hero": "🌼",
  "home-hero-moroccan-mom-baby-natural-care": "🤱",
  "ingredient-prickly-pear": "🌵",
  "ingredient-argan": "✨",
  "ingredient-lavender": "💜",
  "ingredient-chamomile": "🌼",
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
}: PlaceholderImageProps) {
  const gradient = gradients[imageKey] || "from-sage/20 to-cream";
  const icon = icons[imageKey] || "🌿";

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
