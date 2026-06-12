import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { emblem: 32, circle: "w-8 h-8", nameAr: "text-base", nameLatin: "text-xs" },
  md: { emblem: 40, circle: "w-10 h-10", nameAr: "text-xl", nameLatin: "text-sm" },
  lg: { emblem: 56, circle: "w-14 h-14", nameAr: "text-2xl", nameLatin: "text-base" },
};

export function Logo({ size = "md", className }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/images/brand/hnina-logo-icon.png"
        alt="حنينة Hnina"
        width={s.emblem}
        height={s.emblem}
        className={cn("flex-shrink-0 object-contain", s.circle)}
        priority
      />
      <div className="flex flex-col leading-tight">
        <span className={cn("font-bold text-ink", s.nameAr)}>حنينة</span>
        <span className={cn("font-medium text-ink/60 tracking-widest uppercase", s.nameLatin)}>
          HNINA
        </span>
      </div>
    </div>
  );
}
