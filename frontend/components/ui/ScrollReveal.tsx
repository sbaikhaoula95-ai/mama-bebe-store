"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right" | "scale";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  stagger?: boolean;
  delay?: number;
  className?: string;
  threshold?: number;
};

const directionClasses: Record<RevealDirection, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

export function ScrollReveal({
  children,
  direction = "up",
  stagger = false,
  delay = 0,
  className,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => el.classList.add("visible"), delay);
          } else {
            el.classList.add("visible");
          }
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const baseClass = stagger ? "stagger-children" : directionClasses[direction];

  return (
    <div ref={ref} className={cn(baseClass, className)}>
      {children}
    </div>
  );
}
