export function AnnouncementBar() {
  const items = [
    "💵 الدفع عند الاستلام",
    "🚀 توصيل 24-48 ساعة",
    "🎁 توصيل مجاني فوق 299 درهم",
    "🌿 مكونات طبيعية 100٪",
  ];

  return (
    <div className="bg-forest px-4 py-2 text-sm text-cream overflow-hidden">
      <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap text-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center md:gap-12">
        {items.map((item) => (
          <span
            key={item}
            className="flex-shrink-0 rounded-full bg-cream/10 px-3 py-1 font-medium md:bg-transparent md:px-0 md:py-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
