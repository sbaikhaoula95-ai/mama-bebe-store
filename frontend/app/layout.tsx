import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "@/styles/globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutPopup } from "@/components/cart/CheckoutPopup";
import { PixelLoader } from "@/components/tracking/PixelLoader";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "حنينة | عناية طبيعية لماما والبيبي في المغرب",
    template: "%s | حنينة",
  },
  description:
    "منتجات حنينة للعناية بماما والبيبي بمكونات طبيعية، الدفع عند الاستلام والتوصيل في المغرب.",
  keywords: [
    "حنينة",
    "عناية طبيعية",
    "ماما",
    "بيبي",
    "المغرب",
    "زيت الهندية",
    "الأرغان",
    "الخزامى",
    "الدفع عند الاستلام",
  ],
  authors: [{ name: "Hnina", url: "https://hnina.shop" }],
  creator: "Hnina",
  metadataBase: new URL("https://hnina.shop"),
  openGraph: {
    type: "website",
    locale: "ar_MA",
    url: "https://hnina.shop",
    siteName: "حنينة",
    title: "حنينة | عناية طبيعية لماما والبيبي في المغرب",
    description:
      "منتجات حنينة للعناية بماما والبيبي بمكونات طبيعية، الدفع عند الاستلام والتوصيل في المغرب.",
  },
  twitter: {
    card: "summary_large_image",
    title: "حنينة | عناية طبيعية لماما والبيبي",
    description: "منتجات طبيعية للعناية بماما والبيبي. الدفع عند الاستلام.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} font-arabic`}>
      <body className="font-arabic">
        <PixelLoader />
        <AnnouncementBar />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <CartDrawer />
        <CheckoutPopup />
      </body>
    </html>
  );
}
