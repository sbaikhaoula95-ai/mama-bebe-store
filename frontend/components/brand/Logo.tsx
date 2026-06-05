import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { circle: "w-8 h-8 text-sm", nameAr: "text-base", nameLatin: "text-xs" },
  md: { circle: "w-10 h-10 text-base", nameAr: "text-xl", nameLatin: "text-sm" },
  lg: { circle: "w-14 h-14 text-xl", nameAr: "text-2xl", nameLatin: "text-base" },
};

export function Logo({ size = "md", className }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "rounded-full bg-forest flex items-center justify-center flex-shrink-0",
          s.circle
        )}
        aria-hidden="true"
      >
        <span className="font-bold text-cream tracking-tight">H</span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className={cn("font-bold text-ink", s.nameAr)}>حنينة</span>
        <span className={cn("font-medium text-ink/60 tracking-widest uppercase", s.nameLatin)}>
          HNINA
        </span>
      </div>
    </div>
  );
}
