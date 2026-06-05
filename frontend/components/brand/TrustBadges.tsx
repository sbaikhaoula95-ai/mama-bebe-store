import { cn } from "@/lib/utils";

type Badge = {
  icon: string;
  text: string;
};

const ALL_BADGES: Badge[] = [
  { icon: "💵", text: "الدفع عند الاستلام" },
  { icon: "🚀", text: "توصيل 24-48 ساعة" },
  { icon: "🌿", text: "مكونات طبيعية" },
  { icon: "🧪", text: "مختبر جلديا" },
  { icon: "💚", text: "مناسب للبشرة الحساسة" },
  { icon: "🇲🇦", text: "صنع في المغرب" },
  { icon: "🚫", text: "بدون بارابين" },
  { icon: "🚫", text: "بدون كحول" },
];

type TrustBadgesProps = {
  variant?: "chips" | "row" | "grid";
  badges?: Badge[];
  className?: string;
};

export function TrustBadges({
  variant = "chips",
  badges = ALL_BADGES,
  className,
}: TrustBadgesProps) {
  if (variant === "chips") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {badges.map((badge) => (
          <span key={badge.text} className="trust-chip">
            <span role="img" aria-hidden="true">{badge.icon}</span>
            {badge.text}
          </span>
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-4 md:gap-8",
          className
        )}
      >
        {badges.map((badge) => (
          <div key={badge.text} className="flex items-center gap-1.5 text-sm text-ink/70">
            <span role="img" aria-hidden="true" className="text-base">
              {badge.icon}
            </span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {badges.map((badge) => (
        <div
          key={badge.text}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-ink/10 text-center"
        >
          <span role="img" aria-hidden="true" className="text-2xl">
            {badge.icon}
          </span>
          <span className="text-sm font-medium text-ink">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

export const COD_BADGES: Badge[] = [
  { icon: "💵", text: "الدفع عند الاستلام" },
  { icon: "🚀", text: "توصيل 24-48 ساعة" },
];

export const PRODUCT_BADGES: Badge[] = [
  { icon: "💵", text: "الدفع عند الاستلام" },
  { icon: "🚀", text: "توصيل 24-48 ساعة" },
  { icon: "🧪", text: "مختبر جلديا" },
  { icon: "💚", text: "بشرة حساسة" },
];
