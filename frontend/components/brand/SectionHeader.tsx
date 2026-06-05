import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start" | "end";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const alignClass = {
    center: "text-center items-center",
    start: "text-start items-start",
    end: "text-end items-end",
  }[align];

  return (
    <div className={cn("flex flex-col gap-3", alignClass, className)}>
      {eyebrow && (
        <span className="badge-gold">{eyebrow}</span>
      )}
      <h2 className="section-heading text-balance">{title}</h2>
      {subtitle && (
        <p className="section-subheading max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
