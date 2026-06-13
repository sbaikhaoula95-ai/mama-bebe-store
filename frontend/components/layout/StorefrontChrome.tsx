"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { CartDrawer } from "@/components/cart/CartDrawer";

/**
 * Renders the public storefront chrome (announcement bar, header, footer,
 * floating WhatsApp, cart drawer). Suppressed on /admin and /admin/* paths so
 * the admin dashboard gets a clean canvas with its own shell.
 */
export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <CartDrawer />
    </>
  );
}
