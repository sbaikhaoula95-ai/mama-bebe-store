import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "حنينة | عناية طبيعية لماما والبيبي في المغرب",
  description:
    "منتجات حنينة للعناية بماما والبيبي بمكونات طبيعية — زيت الهندية، الأرغان، الخزامى، البابونج والكاليندولا. الدفع عند الاستلام والتوصيل في المغرب.",
};

export default function HomePage() {
  return <HomeContent />;
}
