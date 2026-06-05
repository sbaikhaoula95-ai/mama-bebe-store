"use client";

import { useState } from "react";
import type { Product } from "@/config/products";
import { cn } from "@/lib/utils";

type ProductFaqProps = {
  faq: Product["faq"];
};

export function ProductFaq({ faq }: ProductFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {faq.map((item, idx) => (
        <div
          key={idx}
          className="bg-white border border-ink/10 rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-5 text-right font-semibold text-ink hover:text-forest transition-colors"
            aria-expanded={openIndex === idx}
          >
            <svg
              className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-200 ml-2",
                openIndex === idx ? "rotate-180" : ""
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <span>{item.question}</span>
          </button>
          {openIndex === idx && (
            <div className="px-5 pb-5 text-ink/70 text-sm leading-relaxed border-t border-ink/5 pt-4">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
