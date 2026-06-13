import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Cairo } from "next/font/google";
import "@/styles/globals.css";
import { StorefrontChrome } from "@/components/layout/StorefrontChrome";
import { PixelLoader } from "@/components/tracking/PixelLoader";
import { PageViewTracker } from "@/components/tracking/PageViewTracker";
import { HomeJsonLd } from "@/components/seo/JsonLd";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "حنينة | الصيدلية الطبيعية لماما والبيبي في المغرب",
    template: "%s | حنينة",
  },
  description:
    "حنينة — الصيدلية الطبيعية المغربية لماما والبيبي. مكونات مغربية أصيلة، موصى بها من طرف أطباء الأطفال والقابلات. الدفع عند الاستلام، توصيل 24-48 ساعة.",
  keywords: [
    "حنينة",
    "صيدلية طبيعية",
    "عناية ماما والبيبي",
    "أطباء الأطفال",
    "القابلات",
    "المغرب",
    "زيت الهندية",
    "الأرغان",
    "إكليل الجبل",
    "الكاليندولا",
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
    title: "حنينة | الصيدلية الطبيعية لماما والبيبي في المغرب",
    description:
      "حنينة — الصيدلية الطبيعية المغربية لماما والبيبي. مكونات مغربية أصيلة، موصى بها من طرف أطباء الأطفال والقابلات. الدفع عند الاستلام.",
  },
  twitter: {
    card: "summary_large_image",
    title: "حنينة | الصيدلية الطبيعية لماما والبيبي",
    description:
      "الصيدلية الطبيعية المغربية لماما والبيبي — موصى بها من طرف أطباء الأطفال. الدفع عند الاستلام.",
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
      <head>
        <HomeJsonLd />
      </head>
      <body className="font-arabic">
        <PixelLoader />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
