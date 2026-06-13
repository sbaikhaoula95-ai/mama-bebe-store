export function AnnouncementBar() {
  const items = [
    "👩‍⚕️ موصى به من أطباء الأطفال والقابلات",
    "🧪 مختبر جلديا · مكونات مغربية أصيلة",
    "💵 الدفع عند الاستلام · ما تخلصي والو دابا",
    "🚀 توصيل 24-48 ساعة فالمغرب كامل",
    "🎁 توصيل مجاني فوق 299 درهم",
  ];

  return (
    <div className="bg-pharmacy px-4 py-2 text-sm text-cream overflow-hidden">
      <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap text-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center md:gap-10">
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
