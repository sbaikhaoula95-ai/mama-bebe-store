import type { Product } from "@/config/products";

type IngredientCardsProps = {
  ingredients: Product["ingredients"];
};

const ingredientIcons: Record<string, string> = {
  "زيت الهندية": "🌵",
  "زيت الأرغان": "✨",
  الخزامى: "💜",
  البابونج: "🌼",
  الكاليندولا: "🌸",
  "زيت اللوز الحلو": "🌰",
  "شمع النحل": "🍯",
};

export function IngredientCards({ ingredients }: IngredientCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ingredients.map((ing) => (
        <div
          key={ing.nameAr}
          className="bg-white rounded-2xl border border-ink/10 p-5 flex gap-4"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center text-2xl">
            <span role="img" aria-hidden="true">
              {ingredientIcons[ing.nameAr] || "🌿"}
            </span>
          </div>
          <div>
            <p className="font-bold text-ink text-base">{ing.nameAr}</p>
            <p className="text-ink/50 text-xs mb-2">{ing.nameEn} · {ing.origin}</p>
            <p className="text-ink/70 text-sm">{ing.benefit}</p>
            <p className="text-forest text-xs mt-1 font-medium">✓ {ing.safety}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
