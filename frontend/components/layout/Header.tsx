"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCartStore } from "@/store/cart-store";
import { SITE } from "@/config/site";

export function Header() {
  const { items, openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const whatsappHref = `https://wa.me/${SITE.contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    "السلام عليكم، عندي سؤال على منتجات حنينة"
  )}`;

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-cream/80 backdrop-blur-xl shadow-lg shadow-ink/5 border-b border-ink/5"
          : "bg-cream/95 backdrop-blur-md border-b border-ink/10"
      }`}
    >
      <div className="container-site">
        <div className="flex h-[72px] items-center justify-between md:h-20">
          {/* Cart icon */}
          <button
            onClick={openCart}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-white/80 shadow-sm transition-all hover:bg-sage/10 hover:scale-105 active:scale-95"
            aria-label="فتح سلة التسوق"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white ring-2 ring-cream animate-scale-in">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
            {SITE.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink/70 transition-all px-4 py-2 rounded-xl hover:text-forest hover:bg-forest/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-white/80 shadow-sm transition-all hover:bg-sage/10 hover:scale-105 active:scale-95 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 text-ink transition-transform duration-300 ${mobileMenuOpen ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <Link href="/" aria-label="الصفحة الرئيسية لحنينة">
              <Logo size="md" className="scale-90 md:scale-100 transition-transform hover:scale-105" />
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="pb-5 md:hidden animate-fade-up" aria-label="القائمة المتنقلة">
            <div className="rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-xl p-3 shadow-xl shadow-ink/10">
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Link
                  href="/products"
                  className="rounded-2xl bg-forest px-4 py-3 text-center text-sm font-bold text-cream transition-transform hover:scale-[0.98] active:scale-95"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  تسوقي المنتجات
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-[#25D366] px-4 py-3 text-center text-sm font-bold text-white transition-transform hover:scale-[0.98] active:scale-95"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  واتساب
                </a>
              </div>

              <div className="grid grid-cols-1 gap-2">
              {SITE.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                    className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-base font-bold text-ink transition-all hover:bg-sage/10 active:scale-[0.98]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                    <span>{link.label}</span>
                    <span className="text-forest">←</span>
                </Link>
              ))}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold text-forest">
                <span className="rounded-2xl bg-sage/10 px-2 py-2">دفع عند الاستلام</span>
                <span className="rounded-2xl bg-sage/10 px-2 py-2">24-48 ساعة</span>
                <span className="rounded-2xl bg-sage/10 px-2 py-2">طبيعي</span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
