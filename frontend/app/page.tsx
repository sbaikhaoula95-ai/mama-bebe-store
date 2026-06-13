import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "حنينة | الصيدلية الطبيعية لماما والبيبي في المغرب",
  description:
    "حنينة — الصيدلية الطبيعية المغربية لماما والبيبي. مكونات أصيلة (الهندية، الأرغان، إكليل الجبل، الكاليندولا)، تركيبات مختبرة جلديا، موصى بها من طرف أطباء الأطفال والقابلات. الدفع عند الاستلام والتوصيل في 24-48 ساعة.",
};

export default function HomePage() {
  return <HomeContent />;
}
